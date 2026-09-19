# CCS Infratech Frontend

Public marketing website for [CCS Infratech](https://ccsinfratech.com) — projects, blogs, press, events, and enquiry forms.

**Repository:** [github.com/CCS-Infratech/CCS-Infratech-Frontend](https://github.com/CCS-Infratech/CCS-Infratech-Frontend)

Related apps:

- API — [CCS-Infratech-Backend](https://github.com/CCS-Infratech/CCS-Infratech-Backend)
- Admin dashboard — [CCS-Infratech-Admin](https://github.com/CCS-Infratech/CCS-Infratech-Admin)

---

## What it includes

- Home, About, Projects, Blogs, and Media pages
- Project groups and individual project detail (gallery, plans, amenities, location)
- External project links (CCS Amor, CCS Cricket Academy) that open the dedicated sites
- Press coverage, events/campaigns, and walkthroughs loaded from the CMS
- Blog sharing (native share, Facebook, X, LinkedIn)
- Enquiry, contact, and schedule-a-visit forms
- Dynamic footer / contact details and leadership from the backend
- SMTP email notifications to the sales inbox plus a visitor thank-you
- Next.js 15 App Router, Tailwind CSS, shadcn/ui, Framer Motion, TanStack Query

---

## Architecture

```
Browser
  │
  ├─ Marketing pages (App Router)
  │     └─ Axios  ─►  Backend /api/v1
  │           (projects, blogs, press, events, walkthroughs, settings, leadership)
  │
  └─ Form posts  ─►  Next.js Route Handlers
                        ├─ SMTP (admin + visitor emails)
                        └─ Backend /api/v1/leads  (contact form)
```

```
src/
├── app/
│   ├── (marketing)/          # Public pages + shared navbar/footer
│   │   ├── page.tsx          # Home
│   │   ├── about-us/
│   │   ├── projects/         # List, groups, project detail
│   │   ├── blogs/
│   │   └── media/            # Press, events, walkthrough
│   └── api/                  # contact-us, send-lead, schedule-visit
├── components/               # Page sections + shadcn/ui
├── http/                     # Axios clients (projects, blogs, press, events, walkthrough)
├── hooks/
├── lib/                      # Mailer, email templates, site settings
└── constants/                # Fallbacks (e.g. walkthroughs if the API is empty)
```

The site runs on port **3000**. It reads published content from the backend (`NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_CCS_BACKEND_URL`) and sends form emails through Nodemailer.

---

## How to run

**Requirements:** Node.js 20+, pnpm, and a running [backend](https://github.com/CCS-Infratech/CCS-Infratech-Backend) (or the production API).

```bash
git clone https://github.com/CCS-Infratech/CCS-Infratech-Frontend.git
cd CCS-Infratech-Frontend
pnpm install
```

Create a `.env` in the project root:

```env
NEXT_PUBLIC_APP_NAME=CCS Infratech
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CCS_BACKEND_URL=http://localhost:8000
CCS_BACKEND_URL=http://localhost:8000

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
EMAIL_TO=
```

`EMAIL_FROM` must be a verified sender if you use Amazon SES. `EMAIL_TO` is the internal inbox that receives enquiries.

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
pnpm build
pnpm start
```

---

## Pages

| Path | Content |
| --- | --- |
| `/` | Home — hero, about, testimonials, features, CTA |
| `/about-us` | Company story and leadership |
| `/projects` | Published projects |
| `/projects/groups/[slug]` | Project collection |
| `/projects/[id]` | Project detail |
| `/blogs` / `/blogs/[id]` | Blog list and article |
| `/media/press-coverage` | Press |
| `/media/events-and-campaigns` | Event / campaign galleries |
| `/media/walkthrough` | Video walkthroughs from `/walkthrough/published` |

---

CCS Infratech
