// Minimal fakes of the Vercel Node request/response objects, enough to
// exercise our handler functions directly without a real server.
function makeReq({ method = 'GET', headers = {}, body = undefined, query = {} } = {}) {
  return { method, headers, body, query };
}

function makeRes() {
  const res = {
    statusCode: 200,
    _json: null,
    _headers: {},
    status(code) { this.statusCode = code; return this; },
    json(obj) { this._json = obj; return this; },
    end() { return this; },
    setHeader(k, v) { this._headers[k] = v; return this; },
  };
  return res;
}

module.exports = { makeReq, makeRes };
