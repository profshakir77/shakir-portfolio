# Backend setup

This site now has a small serverless backend (a handful of files under `/api`,
running as Vercel Functions -- no separate server to host, they deploy
automatically alongside the static pages). It needs three things configured
in the Vercel dashboard before it actually works: a password for the admin
panel, an email-sending account, and a small database for storing posts and
leads. All three are free at this site's scale.

## 1. Pick an admin password

This gates `/admin.html` and every write operation (publishing/deleting
posts, viewing leads). Pick any password you like -- it's not tied to any
account, just a shared secret between you and the API.

## 2. Sign up for Resend (sends the emails)

1. Go to https://resend.com and create a free account (100 emails/day, no
   credit card needed).
2. In the Resend dashboard, go to **API Keys** and create one. Copy it --
   you won't see it again.
3. You do **not** need to verify a domain to get started. Resend's shared
   `onboarding@resend.dev` sender works out of the box and can send to any
   address, which is exactly what the contact form and calculator emails
   need. (If you later want emails to come from your own domain, e.g.
   `hello@shakir.dev`, verify that domain in Resend and set
   `RESEND_FROM_EMAIL` -- covered below.)

## 3. Add a Vercel KV database (stores posts and leads)

1. Open your project on https://vercel.com -> **Storage** tab -> **Create
   Database** -> choose **KV** (built on Upstash Redis; there's a free tier).
2. Once created, click **Connect Project** and select this project. Vercel
   automatically adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` as
   environment variables for you -- no manual copying needed.

## 4. Set the remaining environment variables

In your Vercel project: **Settings -> Environment Variables**. Add these
(apply to Production, Preview, and Development):

| Variable | Required | Value |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Whatever password you picked in step 1 |
| `RESEND_API_KEY` | Yes | The API key from step 2 |
| `CONTACT_TO_EMAIL` | No | Defaults to `mr.shakir77@gmail.com` if unset |
| `RESEND_FROM_EMAIL` | No | Defaults to `Portfolio <onboarding@resend.dev>`. Only set this once you've verified your own domain in Resend, e.g. `Shakir <hello@yourdomain.com>` |

`KV_REST_API_URL` and `KV_REST_API_TOKEN` should already be there from step 3
-- just confirm they're listed.

## 5. Redeploy

Environment variable changes need a new deployment to take effect. Either
push a new commit, or in the Vercel dashboard go to **Deployments**, open
the latest one, and choose **Redeploy**.

## What you get once this is configured

- **Contact form** (`contact.html`) emails you directly instead of going
  through Formspree.
- **Cost calculator** (`services.html`) can email a visitor their estimate
  if they ask for one, and always notifies you of the lead.
- **`/admin.html`** -- enter your admin password to publish new blog posts
  (they show up in a "Fresh posts" section on `blog.html` and at
  `post.html?slug=...`, alongside your 20 existing hand-written articles,
  which are untouched) and to see every calculator lead that's come in.

## If something doesn't work

- Contact form / calculator emails silently fail with a friendly error
  message if `RESEND_API_KEY` isn't set yet -- check Vercel's function logs
  (**Deployments -> [latest] -> Functions**) for the specific error.
- `/admin.html` says "Wrong password" for any password until `ADMIN_PASSWORD`
  is set in Vercel.
- The blog's "Fresh posts" section just stays hidden (not broken-looking)
  until KV is connected and at least one post is published.
