# Barley’s Website Editing and Deployment Workflow

Last reviewed: July 2026

This guide documents the recommended workflow for maintaining the Barley’s
Taproom & Pizzeria website: make changes locally, verify them, record them in
Git, deploy the committed version to the server, and confirm the public site.

The short version is:

```text
Edit locally -> preview and test -> commit -> push -> pull on server
-> build -> restart Barley’s service -> verify both public hostnames
```

## 1. Current project and hosting setup

| Item                      | Current value                               |
| ------------------------- | ------------------------------------------- |
| Local project             | `/Users/jakedavis/Desktop/BTAP`           |
| Production project        | `/var/www/btap`                           |
| Runtime                   | Node.js 24.18.0 on the server               |
| Minimum supported Node.js | 22.13.0, as declared in`package.json`     |
| Framework                 | Next.js App Router, React, and vinext       |
| Production process        | `barleys.service` under systemd           |
| App listener              | `127.0.0.1:3000`                          |
| Reverse proxy             | Nginx on`127.0.0.1:8080`                  |
| Public routing            | Existing Cloudflare Tunnel                  |
| Public test domains       | `dankjavis.com` and `www.dankjavis.com` |

The application’s scripts are defined in `package.json`:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
```

This project builds and starts with `vinext`, not the stock `next` command.
Always use the npm scripts instead of calling `next`, `vite`, or `vinext`
directly.

### Routine update versus infrastructure change

Menu edits, text changes, photo replacements, CSS changes, and most application
code changes do **not** require any edits to Nginx, Cloudflare DNS, or the
Cloudflare Tunnel.

Only revisit the hosting configuration when changing a domain, hostname, port,
server address, application service, or proxy behavior. The separate
[`HOSTING_GUIDE.md`](./HOSTING_GUIDE.md) covers those changes.

## 2. Ground rules

1. Treat the local Git repository as the source of truth.
2. Do not edit files directly in `/var/www/btap` as a normal workflow.
3. Never deploy an uncommitted local folder by dragging, copying, or manually
   replacing individual production files.
4. Build and test before changing the running service.
5. Deploy only a clean, committed revision from the main branch.
6. Keep the previous media file until the replacement has been verified in
   production. This makes rollback reliable.
7. Do not edit Nginx or Cloudflare for ordinary content changes.
8. Never commit passwords, API tokens, Cloudflare credentials, private keys, or
   `.env` files.

## 3. One-time Git setup

### Confirm the local remote

From the local project:

```bash
cd /Users/jakedavis/Desktop/BTAP
git remote -v
```

If this prints an `origin` fetch and push URL, Git is already connected. If it
prints nothing, first create an empty private repository on GitHub, then add it:

```bash
git remote add origin git@github.com:YOUR-USER/YOUR-REPOSITORY.git
git push -u origin main
```

Create the remote repository without an automatically generated README,
license, or `.gitignore` when the local repository already has history. That
avoids an unnecessary history conflict on the first push.

### Confirm the server is a Git checkout

On the server:

```bash
cd /var/www/btap
git status --short --branch
git remote -v
```

The production folder should be a clean checkout of the same repository with an
`origin` remote. If it is only a copied folder and has no `.git` directory,
convert it to a Git-based deployment as a separate, backed-up maintenance task.
Do not run `git init`, force a pull, or overwrite the working production folder
without first preserving the known-good deployment.

## 4. The routine editing workflow

### Step 1: Start from a clean, current copy

```bash
cd /Users/jakedavis/Desktop/BTAP
nvm use 24.18.0
git status --short
git switch main
git pull --ff-only origin main
```

If that Node version is not installed locally yet, run
`nvm install 24.18.0` once, then repeat `nvm use 24.18.0`.

If `git status` lists work you still need, commit it before pulling. Do not erase
or overwrite unexplained local changes.

For a larger change, use a short-lived branch:

```bash
git switch -c content/update-menu-and-hero
```

A branch is especially useful when changing layout, dependencies, several
sections, or anything that would benefit from review. A tiny typo or single
price change can be committed directly to `main` in a solo-maintained project,
provided it is still tested and committed.

### Step 2: Install dependencies when needed

For the first checkout, after changing Node versions, or whenever
`package-lock.json` changes:

```bash
npm ci
```

`npm ci` installs the exact dependency tree recorded in `package-lock.json` and
does not rewrite the lockfile. Ordinary menu or image changes do not require a
fresh install if dependencies are already present and the lockfile did not
change.

Use `npm install PACKAGE_NAME` only when intentionally adding or upgrading a
dependency. Commit both `package.json` and `package-lock.json` when either one
changes.

Do not run `npm audit fix --force` casually. It can install breaking major
versions and turn a security report into an application outage. Review and test
dependency updates locally.

### Step 3: Run the local development site

```bash
npm run dev
```

Open the URL printed in the terminal. Keep the terminal visible so browser or
server errors are not missed. Stop the development server with `Ctrl-C` when
finished.

During the edit, check at least:

- A desktop viewport around 1440 pixels wide.
- A phone viewport around 390 pixels wide.
- The hero crop at both sizes.
- Long menu names and prices.
- Navigation anchors and the mobile menu.
- The phone CTA and Facebook CTA.
- Horizontal overflow.
- Browser Console errors and failed Network requests.

### Step 4: Run the release checks

```bash
npm run lint
npx tsc --noEmit
npm test
```

In this repository, `npm test` already runs a production build before the
rendered-HTML tests. If one command fails, fix the failure before committing or
deploying.

For a high-risk change, stop the development server and inspect the production
build locally:

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

### Step 5: Review exactly what changed

```bash
git status --short
git diff --check
git diff
```

`git diff --check` catches accidental whitespace problems. Read the full diff;
it is the last easy opportunity to catch an incorrect price, typo, or unintended
file before it becomes part of the site’s history.

Stage named files rather than blindly staging the entire folder:

```bash
git add app/page.tsx public/barleys-hero-2026-07.webp
git status --short
```

Then commit with a specific message:

```bash
git commit -m "Update hero photo and menu pricing"
```

For a direct update to `main`:

```bash
git push origin main
```

For a branch:

```bash
git push -u origin content/update-menu-and-hero
```

Open a pull request, review the rendered diff, merge it, and deploy the merged
`main` branch. The production server should not normally deploy a feature
branch.

## 5. Replacing the hero photo

### Current implementation

The hero image file is currently:

```text
public/barleys-pizza.jpg
```

Its markup is in `app/page.tsx`. Search that file for:

```text
src="/barleys-pizza.jpg"
```

The visual crop is controlled in `app/globals.css` by:

```css
.hero-photo-frame {
  aspect-ratio: 0.82;
}

.hero-photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

The frame is portrait-shaped—roughly 4:5—even though the current placeholder
photo is landscape. A portrait source will require less aggressive cropping.

### Prepare the image

For a new hero image:

- Use a photo the business owns or has permission to publish.
- Prefer a portrait crop around 4:5.
- Aim for roughly 1600 × 2000 pixels.
- Use WebP or a well-compressed JPEG.
- Try to keep the optimized file below about 500 KB without visible damage.
- Remove unnecessary camera metadata.
- Use a lowercase, hyphenated, versioned filename such as
  `barleys-hero-2026-07.webp`.

A versioned filename is preferable to overwriting `barleys-pizza.jpg`. It makes
browser and CDN cache invalidation predictable and preserves the old asset for
rollback.

### Add and reference the new image

Place the optimized file in `public/`, then update the image in
`app/page.tsx`:

```tsx
<img
  src="/barleys-hero-2026-07.webp"
  width="1600"
  height="2000"
  alt="Fresh pepperoni pizza served at Barley’s Taproom"
  fetchPriority="high"
/>
```

Use the new file’s actual pixel width and height. Write useful alt text that
describes what is visible; do not stuff it with search keywords. Remove the word
“placeholder” from the current alt text and nearby `aria-label` when the real
photo is installed.

The hero is the page’s likely largest-contentful image, so keeping
`fetchPriority="high"` and not lazy-loading it is appropriate. Images farther
down the page should normally retain `loading="lazy"`.

If the subject is cut off, adjust the focal point in `app/globals.css` and test
again:

```css
.hero-photo-frame img {
  object-position: 50% 40%;
}
```

The first percentage is horizontal position and the second is vertical
position. Always verify the crop on desktop and mobile rather than choosing the
value by guesswork.

This project currently uses native `<img>` elements because of its vinext/Sites
adapter setup. For a conventional Next.js deployment, `next/image` is usually
preferred for responsive sizing, format conversion, lazy loading, and layout
stability. Do not refactor this project to `next/image` without confirming and
testing adapter support first; meanwhile, optimize local images before adding
them.

### Social sharing image

The hero image and social sharing image are separate. `public/og.png` is the
1200 × 630 image used when the page is shared. If the brand photography changes
substantially, consider updating `og.png` too, while preserving the 1.91:1
social-card ratio and checking the metadata in `app/layout.tsx`.

## 6. Updating menu items and prices

Most food and drink content is near the top of `app/page.tsx` in these arrays:

- `specialtyPizzas`
- `pizzaClassics`
- `starters`
- `pastasAndMains`
- `sandwiches`
- `kidsPasta`
- `sweets`
- `zeroProof`

Each item follows this shape:

```tsx
{
  name: "The Meat",
  price: "M 24 · L 28",
  description: "Pepperoni, Italian sausage, bacon, ham & beef",
},
```

The description is optional:

```tsx
{ name: "Wings", price: "10" },
```

Editing rules:

- The array order is the display order.
- Preserve commas, braces, and quotation marks.
- Keep price formatting consistent with surrounding items.
- Keep item names unique within each displayed array because the name is used
  as the React list key.
- Use plain text in `description`. An HTML string such as `<br>` is displayed as
  text by the current component and does not create a line break.
- Confirm every price and availability note against an authoritative business
  source before publishing.
- Do not invent menu items, prices, tap availability, event dates, or claims.

Some prices are written directly in the page instead of an array:

- Salad prices are in the “Fresh & simple” block.
- The Sample Rack price is in the beer section.
- Hours are in the visit section.

Search by the visible label rather than relying on a saved line number, because
line numbers move as the file changes:

```bash
rg -n "Fresh & simple|Sample Rack|Hours" app/page.tsx
```

For frequent updates, a sensible future refactor is to move menu data into a
dedicated file such as `content/menu.ts` and event data into
`content/events.ts`. A CMS is worthwhile only when non-developers need to edit
the site regularly or updates become frequent enough to justify the additional
system.

## 7. Updating other common content

| Content                                      | Location                                        |
| -------------------------------------------- | ----------------------------------------------- |
| Phone number and Facebook URL                | Constants at the top of`app/page.tsx`         |
| Menu, prices, hours, and page copy           | `app/page.tsx`                                |
| Page title, description, and social metadata | `app/layout.tsx`                              |
| Mobile navigation behavior                   | `app/MobileMenu.tsx`                          |
| Global styles and image crops                | `app/globals.css`                             |
| Hero photo                                   | `public/barleys-pizza.jpg` or its replacement |
| Taproom photo                                | `public/barleys-taproom.jpg`                  |
| Logo                                         | `public/barleys-logo.png`                     |
| Social card                                  | `public/og.png`                               |
| Build commands and dependencies              | `package.json` and `package-lock.json`      |

The current live-music section intentionally sends visitors to Facebook for the
latest schedule. That avoids showing stale band dates. If events are later
stored directly on the site, put them in structured data, include unambiguous
dates and times, assign someone responsibility for updates, and remove or
archive expired events promptly.

## 8. Deploying the committed update

Deploy only after the desired change has reached `main` on the remote Git
repository.

Connect to the server and inspect the checkout before changing it:

```bash
ssh karpa@karpa0
cd /var/www/btap
git status --short --branch
git fetch origin
git log --oneline HEAD..origin/main
```

The production checkout should be clean. If `git status` shows modified or
untracked files, stop and determine where they came from. Do not erase them or
force the checkout to match the remote.

Pull the update and select the same Node version used by the service:

```bash
git switch main
git pull --ff-only origin main
nvm use 24.18.0
```

If `package.json` or `package-lock.json` changed in this release, install the
locked dependency tree:

```bash
npm ci
```

For a menu, copy, CSS, or image-only release where neither package file changed,
leave the already-tested production dependencies in place and skip this step.
This project requires the development dependencies for its current build and
start scripts because `vinext` is listed there. Whenever an install is needed,
do **not** use `npm ci --omit=dev`.

Build the new version:

```bash
npm run build
```

If the build fails, stop. The existing service is still the version to preserve;
do not restart it with a failed or incomplete build.

Only after a successful build, restart and inspect the Barley’s service:

```bash
sudo systemctl restart barleys
sudo systemctl status barleys --no-pager
sudo journalctl -u barleys -n 50 --no-pager
```

Test each layer:

```bash
curl -I http://127.0.0.1:3000/
curl -I -H 'Host: dankjavis.com' http://127.0.0.1:8080/
curl -I https://dankjavis.com/
curl -I https://www.dankjavis.com/
```

Expect successful HTTP responses. Then open both public hostnames in a browser
and visually inspect the changed content. On mobile, tap the phone button and
confirm it opens the dialer with `(828) 288-8388`; confirm Facebook opens the
correct page.

Because the same Nginx and Cloudflare Tunnel also serve Clean Slate, a final
smoke test is prudent after any hosting-related change:

```bash
curl -I https://cleanslatehomewash.com/
curl -I https://www.cleanslatehomewash.com/
```

Routine Barley’s content changes should not affect Clean Slate, and they should
not require an Nginx reload or cloudflared restart.

## 9. Rollback

Git makes the safest rollback an explicit, recorded change. From a clean local
`main` branch:

```bash
git log --oneline -n 10
git revert BAD_COMMIT_HASH
git push origin main
```

Then repeat the normal server pull, install, build, restart, and verification
steps.

Prefer `git revert` over rewriting shared history. Do not use
`git reset --hard`, force-push `main`, or delete unexplained production files as
a routine rollback method.

Keeping old media in the repository until the replacement is verified matters
here: reverting the code can immediately restore the previous image path.

If the application process itself fails, inspect it before making unrelated
configuration changes:

```bash
sudo systemctl status barleys --no-pager
sudo journalctl -u barleys -n 100 --no-pager
curl -I http://127.0.0.1:3000/
```

A failure at port 3000 is an application or service issue. A success at port
3000 but failure through port 8080 points toward Nginx. Success through Nginx
but failure on the public hostname points toward Cloudflare or public DNS.

## 10. Next.js maintenance best practices

### Keep server and client code intentional

App Router components are Server Components by default. Keep them that way
unless browser state, effects, or event handlers require a Client Component.
Limit `"use client"` to the smallest interactive boundary so the browser ships
less JavaScript. `app/MobileMenu.tsx` is the kind of interaction that belongs in
a focused Client Component.

### Protect secrets

- Keep `.env*`, credentials, and private keys out of Git.
- Variables without `NEXT_PUBLIC_` remain server-side.
- Anything beginning with `NEXT_PUBLIC_` is intended for browser code and must
  never contain a secret.
- Public variables are generally embedded when the app is built, so changing
  one requires a new build and deployment.

The project’s `.gitignore` already excludes `.env*`, `*.pem`, build outputs,
Wrangler logs, and dependency folders. Review `git status` before every commit
instead of relying on ignore rules alone.

### Keep dependencies deliberate

- Match the project’s Node requirement before installing or building.
- Use `npm ci` for clean and production installs.
- Add or update dependencies locally, never directly on production.
- Commit the lockfile.
- Avoid unnecessary packages, especially for simple UI behavior.
- Read release notes and test framework upgrades as their own changes rather
  than mixing them with menu or copy updates.

### Treat images as performance work

- Size images for their displayed use instead of uploading full camera files.
- Set intrinsic width and height.
- Give meaningful images useful alt text and decorative images empty alt text.
- Eagerly load only the primary hero/LCP image.
- Lazy-load below-the-fold images.
- Use versioned filenames when replacing cached public assets.
- Test crop and sharpness at desktop and mobile sizes.

### Preserve accessibility

- Keep one clear page-level heading and logical heading order.
- Make every interactive control reachable and visible by keyboard.
- Preserve focus styles and sufficient color contrast.
- Use real links and buttons instead of clickable generic elements.
- Keep phone numbers as `tel:` links.
- Test at 200% browser zoom and on a narrow screen.
- Do not use color alone to communicate meaning.

### Preserve metadata and discoverability

- Keep page title, description, canonical domain, and Open Graph metadata
  current in `app/layout.tsx`.
- Keep `public/og.png` at 1200 × 630 unless metadata is updated for a different
  size.
- Add and maintain `sitemap.ts` and `robots.ts` when the final restaurant domain
  is ready for search indexing.
- Use accurate visible business name, address, phone number, and hours.

### Verify production behavior, not only compilation

A successful build proves that code compiled; it does not prove the menu is
correct, a photo crops well, a phone link works, or a domain reaches the right
site. Every release needs a short browser smoke test after deployment.

## 11. Quick release checklist

### Local

- [ ] Start from a clean, current `main` branch.
- [ ] Use Node 24.18.0.
- [ ] Make the change locally.
- [ ] Preview desktop and mobile.
- [ ] Check Console and Network errors.
- [ ] Run lint, TypeScript, and tests.
- [ ] Read `git diff`.
- [ ] Commit only intended files.
- [ ] Push and merge to `main`.

### Production

- [ ] Confirm `/var/www/btap` is clean.
- [ ] Pull with `--ff-only`.
- [ ] If either package file changed, run `npm ci` without omitting development
  dependencies.
- [ ] Run `npm run build`.
- [ ] Restart `barleys` only after a successful build.
- [ ] Confirm systemd status and logs.
- [ ] Test ports 3000 and 8080.
- [ ] Test `dankjavis.com` and `www.dankjavis.com`.
- [ ] Visually inspect the change on desktop and mobile.
- [ ] Confirm the phone and Facebook CTAs.
- [ ] Leave Nginx and Cloudflare unchanged for routine content releases.

## References

- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js self-hosting guide](https://nextjs.org/docs/app/guides/self-hosting)
- [Next.js image optimization](https://nextjs.org/docs/app/getting-started/images)
- [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables)
- [npm `ci` documentation](https://docs.npmjs.com/cli/commands/npm-ci)
- [`HOSTING_GUIDE.md`](./HOSTING_GUIDE.md) for Nginx, systemd, and Cloudflare
  architecture and recovery procedures.
