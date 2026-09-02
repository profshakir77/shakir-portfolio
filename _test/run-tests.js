// Exercises the real API handler modules with a fake fetch that simulates
// Vercel KV's REST API and Resend's email API, plus a tiny in-memory Redis-
// like store. This is not a substitute for a real deployment test, but it
// verifies the actual logic paths (validation, auth, CRUD, error handling)
// run correctly end-to-end without needing live credentials.

process.env.KV_REST_API_URL = 'https://fake-kv.example.com';
process.env.KV_REST_API_TOKEN = 'fake-kv-token';
process.env.RESEND_API_KEY = 'fake-resend-key';
process.env.ADMIN_PASSWORD = 'letmein123';
process.env.CONTACT_TO_EMAIL = 'mr.shakir77@gmail.com';

const assert = require('assert');
const { makeReq, makeRes } = require('./mock-req-res');

// --- Fake Redis-like store ------------------------------------------------
const store = { strings: new Map(), zsets: new Map(), lists: new Map() };
const sentEmails = [];

function handleKvCommand(cmd) {
  const [op, ...args] = cmd;
  switch (String(op).toLowerCase()) {
    case 'set': store.strings.set(args[0], args[1]); return 'OK';
    case 'get': return store.strings.has(args[0]) ? store.strings.get(args[0]) : null;
    case 'del': store.strings.delete(args[0]); return 1;
    case 'zadd': {
      const [key, score, member] = args;
      if (!store.zsets.has(key)) store.zsets.set(key, new Map());
      store.zsets.get(key).set(member, Number(score));
      return 1;
    }
    case 'zrevrange': {
      const [key] = args;
      const zs = store.zsets.get(key) || new Map();
      return [...zs.entries()].sort((a, b) => b[1] - a[1]).map(([m]) => m);
    }
    case 'zrem': {
      const [key, member] = args;
      const zs = store.zsets.get(key);
      if (zs) zs.delete(member);
      return 1;
    }
    case 'rpush': {
      const [key, value] = args;
      if (!store.lists.has(key)) store.lists.set(key, []);
      store.lists.get(key).push(value);
      return store.lists.get(key).length;
    }
    case 'lrange': {
      const [key] = args;
      return store.lists.get(key) || [];
    }
    default:
      throw new Error('Unhandled fake KV command: ' + op);
  }
}

global.fetch = async (url, opts = {}) => {
  if (String(url).includes('fake-kv.example.com')) {
    const cmd = JSON.parse(opts.body);
    const result = handleKvCommand(cmd);
    return { ok: true, json: async () => ({ result }) };
  }
  if (String(url).includes('api.resend.com')) {
    const payload = JSON.parse(opts.body);
    sentEmails.push(payload);
    return { ok: true, json: async () => ({ id: 'fake-email-id' }) };
  }
  throw new Error('Unexpected fetch to ' + url);
};

// --- Run the tests ---------------------------------------------------------
async function main() {
  const contactHandler = require('../api/contact.js');
  const postsHandler = require('../api/posts.js');
  const postSlugHandler = require('../api/posts/[slug].js');
  const estimateHandler = require('../api/estimate.js');

  let passed = 0;
  function ok(desc) { passed++; console.log('  ok -', desc); }

  console.log('contact.js');
  {
    const req = makeReq({ method: 'POST', body: { name: '', email: 'a@b.com', message: 'hi' } });
    const res = makeRes();
    await contactHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    ok('rejects missing name');
  }
  {
    const req = makeReq({ method: 'POST', body: { name: 'Ali', email: 'not-an-email', message: 'hi' } });
    const res = makeRes();
    await contactHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    ok('rejects invalid email');
  }
  {
    const req = makeReq({ method: 'POST', body: { name: 'Ali', email: 'ali@example.com', message: 'Interested in a website.', budget: '$500-1000' } });
    const res = makeRes();
    await contactHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res._json.ok, true);
    assert.strictEqual(sentEmails.length, 1);
    assert.strictEqual(sentEmails[0].to[0], 'mr.shakir77@gmail.com');
    assert.strictEqual(sentEmails[0].reply_to, 'ali@example.com');
    assert.ok(sentEmails[0].html.includes('Interested in a website.'));
    ok('valid submission sends an email to the configured recipient');
  }
  {
    const req = makeReq({ method: 'POST', body: { name: 'Bot', email: 'bot@spam.com', message: 'buy now', website: 'http://spam.example' } });
    const res = makeRes();
    const before = sentEmails.length;
    await contactHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(sentEmails.length, before);
    ok('honeypot-filled submission is silently dropped (no email sent)');
  }

  console.log('posts.js (list + create)');
  {
    const req = makeReq({ method: 'GET' });
    const res = makeRes();
    await postsHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res._json.posts, []);
    ok('empty list before any posts exist');
  }
  {
    const req = makeReq({ method: 'POST', body: { title: 'Hello World', content: 'First paragraph.\n\nSecond paragraph.' } });
    const res = makeRes();
    await postsHandler(req, res);
    assert.strictEqual(res.statusCode, 401);
    ok('create without admin password is rejected');
  }
  let createdSlug;
  {
    const req = makeReq({
      method: 'POST',
      headers: { 'x-admin-password': 'letmein123' },
      body: { title: 'Hello World', category: 'News', content: 'First paragraph.\n\nSecond paragraph.' },
    });
    const res = makeRes();
    await postsHandler(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res._json.post.slug, 'hello-world');
    assert.strictEqual(res._json.post.readTime, '1 min read');
    createdSlug = res._json.post.slug;
    ok('create with correct admin password succeeds and derives a slug');
  }
  {
    const req = makeReq({ method: 'GET' });
    const res = makeRes();
    await postsHandler(req, res);
    assert.strictEqual(res._json.posts.length, 1);
    assert.strictEqual(res._json.posts[0].slug, createdSlug);
    ok('list now shows the created post');
  }
  {
    // Same title again -> slug collision should be auto-disambiguated, not overwritten.
    const req = makeReq({
      method: 'POST',
      headers: { 'x-admin-password': 'letmein123' },
      body: { title: 'Hello World', content: 'A different post entirely.' },
    });
    const res = makeRes();
    await postsHandler(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.notStrictEqual(res._json.post.slug, createdSlug);
    ok('duplicate title gets a disambiguated slug instead of overwriting');
  }
  {
    const req = makeReq({ method: 'POST', headers: { 'x-admin-password': 'letmein123' }, body: { title: '', content: '' } });
    const res = makeRes();
    await postsHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    ok('rejects empty title/content even with correct password');
  }

  console.log('posts/[slug].js (read + delete)');
  {
    const req = makeReq({ method: 'GET', query: { slug: createdSlug } });
    const res = makeRes();
    await postSlugHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res._json.post.title, 'Hello World');
    ok('fetch by slug returns the right post');
  }
  {
    const req = makeReq({ method: 'GET', query: { slug: 'does-not-exist' } });
    const res = makeRes();
    await postSlugHandler(req, res);
    assert.strictEqual(res.statusCode, 404);
    ok('fetch of unknown slug returns 404');
  }
  {
    const req = makeReq({ method: 'DELETE', query: { slug: createdSlug } });
    const res = makeRes();
    await postSlugHandler(req, res);
    assert.strictEqual(res.statusCode, 401);
    ok('delete without admin password is rejected');
  }
  {
    const req = makeReq({ method: 'DELETE', headers: { 'x-admin-password': 'letmein123' }, query: { slug: createdSlug } });
    const res = makeRes();
    await postSlugHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    ok('delete with correct password succeeds');
  }
  {
    const req = makeReq({ method: 'GET', query: { slug: createdSlug } });
    const res = makeRes();
    await postSlugHandler(req, res);
    assert.strictEqual(res.statusCode, 404);
    ok('deleted post is gone from GET by slug');
  }
  {
    const req = makeReq({ method: 'GET' });
    const res = makeRes();
    await postsHandler(req, res);
    assert.strictEqual(res._json.posts.length, 1); // only the disambiguated duplicate remains
    ok('deleted post is also gone from the list index (no orphaned zset entry)');
  }

  console.log('estimate.js');
  {
    const req = makeReq({ method: 'POST', body: { projectType: 'landing', pages: 3, addons: ['SEO'], estimateLow: 300, estimateHigh: 450 } });
    const res = makeRes();
    const before = sentEmails.length;
    await estimateHandler(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(sentEmails.length, before + 1);
    assert.ok(sentEmails[sentEmails.length - 1].html.includes('landing'));
    ok('anonymous estimate is stored and emailed to Shakir, no copy email sent');
  }
  {
    const req = makeReq({ method: 'GET' });
    const res = makeRes();
    await estimateHandler(req, res);
    assert.strictEqual(res.statusCode, 401);
    ok('listing estimates without admin password is rejected');
  }
  {
    const req = makeReq({ method: 'GET', headers: { 'x-admin-password': 'letmein123' } });
    const res = makeRes();
    await estimateHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res._json.estimates.length, 1);
    ok('listing with admin password returns the captured estimate');
  }
  {
    const before = sentEmails.length;
    const req = makeReq({
      method: 'POST',
      body: { projectType: 'ecom', pages: 6, estimateLow: 800, estimateHigh: 1200, name: 'Sara', email: 'sara@example.com' },
    });
    const res = makeRes();
    await estimateHandler(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(sentEmails.length, before + 2); // one to Shakir, one copy to Sara
    assert.strictEqual(sentEmails[sentEmails.length - 1].to[0], 'sara@example.com');
    ok('estimate with an email address also sends the visitor a copy');
  }
  {
    const req = makeReq({ method: 'POST', body: { projectType: 'ecom', email: 'not-an-email' } });
    const res = makeRes();
    await estimateHandler(req, res);
    assert.strictEqual(res.statusCode, 400);
    ok('rejects an invalid email on the estimate form');
  }

  console.log(`\nAll ${passed} checks passed.`);
}

main().catch((err) => {
  console.error('TEST FAILURE:', err);
  process.exit(1);
});
