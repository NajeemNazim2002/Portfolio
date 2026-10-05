# Portfolio website (Next.js + Neon + Cloudinary)

A responsive portfolio for a web developer and graphic designer. Visitors browse the work. Only the admin (you) can sign in and upload projects in two categories: **Graphic design** and **Web development**.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Prisma · Neon PostgreSQL · Cloudinary

## Pages

| Public | Admin (sign-in required) |
|---|---|
| `/` Home, `/work` filterable gallery, `/work/[slug]` project page, `/about`, `/contact` | `/admin/login`, `/admin` project list, `/admin/new`, `/admin/[id]/edit`, `/admin/messages` |

## 1. Set up (one time)

1. **Install:** `npm install` (Node 18.18 or newer)
2. **Neon database:** create a project at neon.tech, open **Connect**, and copy both connection strings: the pooled one (host contains `-pooler`) and the direct one.
3. **Cloudinary:** create a free account at cloudinary.com. From the dashboard copy the Cloud name, API key and API secret.
4. **Environment:** copy `.env.example` to `.env` and fill in every value.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`: your admin login. Use a long password.
   - `AUTH_SECRET`: any random string of 32+ characters (`openssl rand -base64 32`).
5. **Create the tables:** `npm run db:push`
6. **Run:** `npm run dev`, open http://localhost:3000, and sign in at http://localhost:3000/admin

## 2. Make it yours

- Edit `src/lib/site.ts`: your name, email, intro, bio, services, tools and social links.
- Your photo is `public/images/profile.png` (replace it with any 3:4 portrait).
- Your resume is available from the About page at `public/resume.pdf`; replace that file to update it.
- Colours and fonts are in `src/app/globals.css`.

## 3. Add a project

Sign in, choose **New project**, pick the category, write the summary and full description, upload the cover and gallery images, then publish.

- Tick **Featured** to show a project first on the home page.
- Untick **Published** to keep it hidden as a draft.
- Images upload straight to Cloudinary (max 10 MB each on the free plan) and are resized automatically for each screen size.

## 4. Deploy to Netlify

1. Push the project to a Git provider such as GitHub, then choose **Add new site > Import an existing project** in Netlify and connect that repository.
2. Let Netlify detect Next.js and its build settings. The build command is `npm run build`; do not configure the site as a static export.
3. In the Netlify site settings, add these environment variables for the deploy context:
   - `DATABASE_URL` and `DIRECT_URL`: your Neon pooled and direct connection strings.
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`: your admin login.
   - `AUTH_SECRET`: a random secret string of at least 32 characters.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`: your Cloudinary credentials.
   - `NEXT_PUBLIC_SITE_URL`: your Netlify site URL (update it if you later add a custom domain).
4. Make sure the Neon database has the Prisma tables. From your computer, with the production Neon values in `.env`, run `npm run db:push` once.
5. Trigger a deploy. The build runs `prisma generate` automatically. After deployment, test the public site, `/admin/login`, image uploads and the contact form.

Never commit `.env` or paste secret values into source code. If you change a Netlify environment variable, trigger a new deploy for it to take effect.

## How security works

- `/admin/*` and `/api/admin/*` are blocked by middleware unless you hold a signed, HttpOnly session cookie (7 days). Every admin API route checks the session again.
- Password comparison is constant-time and failed logins are delayed.
- The upload endpoint hands out short-lived signed Cloudinary permissions. Your API secret never reaches the browser.
- The contact form has a hidden spam trap and a basic rate limit.

## Good to know

- Deleting a project does not delete its images from Cloudinary (remove them in the Cloudinary dashboard if you want).
- `npm run db:studio` opens a visual database editor.
