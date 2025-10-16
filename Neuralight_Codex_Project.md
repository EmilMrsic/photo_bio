
# Neuralight Pro — Codex Project Brief

## 🧠 Objective
Build a modular, maintainable front-end for **Neuralight Pro**, a photobiomodulation protocol platform. The platform enables providers to assign light therapy protocols based on brain maps or symptom intake and includes a shop, CMS blog, and subscription model.

You are building the **frontend only**, and will interact with:
- **Xano API** for backend data
- **Stripe** for purchases
- **Memberstack** for auth (admin and provider)

We will be launching the entire product on **Replit**.

---

## 🛠 Tools Used

| Layer       | Tech              |
|------------|--------------------|
| Frontend   | Next.js + Tailwind CSS (Tailwind UI Plus) |
| Hosting    | Replit            |
| Auth       | Memberstack (test mode enabled) |
| Backend    | Xano              |
| Payments   | Stripe (test mode enabled) |
| CMS        | Xano `blog_posts` table |

---

## 📄 Page Structure

### 🧷 Public Routes
- `/` — Homepage (value prop + CTA)
- `/shop` — Product listing (helmet, subscription, optional add-ons)
- `/shop/[product]` — Product detail page
- `/checkout` — Stripe checkout redirect
- `/blog` — SEO article index
- `/blog/[slug]` — Individual blog article
- `/privacy`, `/terms`, `/faq` — Static pages

### 🔐 Authenticated Provider Routes (`role = provider`)
- `/dashboard` — Overview of clients, quick stats
- `/clients` — Client management table
- `/clients/new` — Intake form (condition + PDF or CEC)
- `/protocols/[clientId]` — Display assigned protocol (PBM plan)
- `/account` — Subscription + account details
- `/resources` — Loom videos + setup guides

### 🔐 Admin Routes (`role = admin`)
- `/admin` — Admin-only dashboard (protocol stats, blog control, etc.)

---

## 🔑 Credentials (Test Mode)

| Role     | Email                         | Password |
|----------|-------------------------------|----------|
| Provider | projects@thankyuu.com         | [Your set password] |
| Admin    | [admin email configured]      | [Admin password] |

Stripe test cards:
- Visa: `4242 4242 4242 4242`  
- Exp: Any future date  
- CVC: Any 3 digits

---

## 🔗 Xano API Base URL
`https://x8a0-xyz.xano.io/api:YOUR_ENDPOINT`  
> Add endpoints for: `clients`, `products`, `orders`, `protocols`, `blog_posts`

---

## 💡 Developer Notes

- Use Tailwind UI Plus components for layout and spacing
- Dark mode is required; use Tailwind's `dark:` utilities
- Design system inspired by 37signals/Basecamp
- Gate routes via Memberstack `role` (admin vs provider)
- Show/hide UI components based on login + role
- Use Xano's API key (if needed) via `.env` securely

---

## 🔐 .env.example (suggested)
```
NEXT_PUBLIC_XANO_API=https://xano.io/api:abc123
NEXT_PUBLIC_STRIPE_PK=pk_test_...
NEXT_PUBLIC_MEMBERSTACK_PK=pk_...
```

---

## ✅ Ready to Build
- Memberstack: ✅ test mode, roles configured
- Stripe: ✅ test mode, products created
- Xano: ✅ schemas + APIs ready
- GitHub: [Set up or link here]
- Replit: [Link or project name]

---

## 👇 First Feature to Build
Start with `/clients/new` — intake form that posts to Xano and redirects to `/protocols/[clientId]` on success.
