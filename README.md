# 📚 Samanta E-Book Stall

### Your Premium Destination for Books & Stationery

A modern, responsive bookstore and stationery catalogue built with **React, Vite, Firebase Authentication, and Cloud Firestore**. The project features a dynamic public catalogue, a protected admin dashboard, wishlist functionality, and CSV-based catalogue management.


---

## ✨ Features

### 🏠 Public Website
- Modern homepage with a responsive, indigo-and-white design.
- Dynamic book and stationery catalogue powered by Cloud Firestore.
- Category-based product discovery.
- Book and product details.
- Bestseller and stock-status indicators.
- Wishlist functionality for saving favourite items.
- Responsive layouts for desktop, tablet, and mobile devices.

### 🔐 Admin Dashboard
- Firebase Authentication with email and password.
- Administrator authorization using a configured UID.
- Add, edit, and delete catalogue items.
- Publish or unpublish catalogue entries.
- Manage book and stationery information.
- Mark items as bestsellers.
- Manage stock-status information.
- Import catalogue data using CSV files.
- Centralized catalogue operations through `catalogueService.js`.

### ⚙️ Technical Features
- Component-based React architecture.
- Fast development and production builds with Vite.
- Client-side routing with React Router.
- Cloud Firestore integration.
- Image URLs stored directly in catalogue documents.
- Reusable UI components and CSS styling.
- Vercel deployment with SPA route rewrites.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development and build tooling |
| JavaScript (ES6+) | Application logic |
| React Router | Client-side navigation |
| Firebase Authentication | Admin authentication |
| Cloud Firestore | Catalogue database |
| CSS | Styling and responsive layouts |
| Lucide React | Icons |
| PapaParse | CSV parsing |
| Git & GitHub | Version control |
| Vercel | Deployment and hosting |

---

## 🚀 Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- A Firebase project

### 1. Clone the Repository

```bash
git clone https://github.com/SwarupPal2006/samanta-e-book-stall.git
cd samanta-e-book-stall
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_ADMIN_UID=your-authorized-admin-uid
```

Replace the placeholder values with your Firebase project configuration and authorized administrator UID.

**Security note:** Never commit your `.env` file or Firebase service-account credentials to GitHub. Firebase client configuration is not a substitute for proper database security rules.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

### 5. Build for Production

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

---

## 🔥 Firebase Setup

The application uses Firebase as its backend.

### Authentication

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project.
3. Navigate to **Authentication → Sign-in method**.
4. Enable **Email/Password** authentication.
5. Create or select the authorized administrator account.
6. Set its UID in `VITE_ADMIN_UID`.

### Cloud Firestore

Create or select the Firestore database used by the application.

The catalogue service uses the following collection:

```text
catalogue
```

Catalogue documents can contain fields such as:

| Field | Description |
|---|---|
| `type` | `book` or `product` |
| `title` | Book or product name |
| `category` | Catalogue category |
| `description` | Item description |
| `author` | Author, where applicable |
| `imageUrl` | Image URL |
| `price` | Price, where applicable |
| `published` | Publication visibility |
| `bestseller` | Bestseller indicator |
| `stockStatus` | Stock availability |

Fields may vary depending on the item type and current implementation.

### Security Rules

Configure Firestore Security Rules to ensure that:

- Public visitors can read published catalogue entries.
- Authorized administrators can access unpublished entries.
- Only authorized administrators can create, update, or delete catalogue documents.

Test the rules independently of the frontend. Hiding admin pages or checking a UID in React alone does not secure the database.

---

## 📥 CSV Catalogue Import

The admin dashboard supports bulk catalogue management through CSV imports.

Example CSV structure:

```csv
type,title,category,description,author,price,imageUrl,published,bestseller,stockStatus
book,Example Novel,Fiction,Example description,Example Author,250,https://example.com/book.jpg,true,true,in-stock
product,Example Notebook,Notebooks,Notebook description,,80,https://example.com/notebook.jpg,true,false,in-stock
```

Ensure the column names and values match the import logic in `catalogueService.js` and the admin dashboard.

Before importing a large catalogue:

- Validate the CSV headers.
- Check prices and required fields.
- Verify image URLs.
- Use consistent category names.
- Test with a small sample file.

---

## 🌐 Deployment on Vercel

The project can be deployed through Vercel using its GitHub integration.

1. Push the repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Configure the project as a Vite application.
4. Set the required Firebase environment variables.
5. Set `VITE_ADMIN_UID`.
6. Deploy the project.

### Build Configuration

| Setting | Value |
|---|---|
| Framework | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### React Router Configuration

For direct access to nested routes, configure `vercel.json` with an SPA rewrite:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

After updating environment variables, redeploy the application so the new configuration is included in the build.

### Push Updates to GitHub

```bash
git add .
git commit -m "Update project"
git push origin main
```

If automatic deployments are enabled in Vercel, pushing to the configured production branch will trigger a deployment.

---

## ⚡ Performance

For production builds, run:

```bash
npm run build
```

If Vite reports large JavaScript chunks, consider:

- Lazy-loading pages with `React.lazy()` and `Suspense`.
- Splitting the admin dashboard from public pages.
- Reviewing large dependencies.
- Optimizing product images.
- Avoiding unnecessary duplicate imports.

A chunk-size warning does not necessarily indicate a failed build.

---

## 🗺️ Roadmap

Potential future improvements include:

- [ ] Enhanced dashboard analytics.
- [ ] Firestore-backed promotional offer management.
- [ ] Improved catalogue filtering and sorting.
- [ ] Customer in-app and push notifications.
- [ ] Additional accessibility improvements.
- [ ] Further performance optimization.
- [ ] Automated testing.

These items are planned enhancements, not claims that the features are already implemented.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the application and production build.
5. Submit a pull request with a description of your changes.

---

## 📄 License

No license is specified in this README. Check the repository for a `LICENSE` file before redistributing or reusing the source code.

---

## 🙌 Acknowledgements

Built with:

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Firebase](https://firebase.google.com/)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Lucide](https://lucide.dev/)
- [PapaParse](https://www.papaparse.com/)
- [Vercel](https://vercel.com/)

---

<p align="center">
  <strong>Samanta E-Book Stall</strong><br>
  Discover Books. Explore Ideas. Create More.<br><br>
  Made with ❤️ using React and Firebase.
</p>



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
