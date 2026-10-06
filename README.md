# 👗 Atik's Fashion House 2.1

### ✨ Modern Fashion Storefront & Admin Studio

A stylish, responsive fashion storefront and admin studio starter project built with **HTML5, CSS3, Vanilla JavaScript, Node.js, and Express.js**. Designed to provide a modern shopping experience with backend authentication APIs and lightweight JSON-based data persistence.

<p align="center">
  <strong>Developed by MD. Atiqul Islam (Atik)</strong><br>
  <a href="mailto:atik.cmttiu1001@gmail.com">atik.cmttiu1001@gmail.com</a>
</p>

---

## 📌 Table of Contents

* [About the Project](#-about-the-project)
* [Features](#-features)
* [Technology Stack](#-technology-stack)
* [Requirements](#-requirements)
* [Installation](#-installation--setup)
* [Environment Configuration](#-environment-configuration)
* [Run the Application](#-run-the-application)
* [Application URLs](#-application-urls)
* [Admin Dashboard](#-admin-dashboard)
* [API Documentation](#-api-documentation)
* [Project Structure](#-project-structure)
* [Data Storage](#-data-storage)
* [Security](#-security-considerations)
* [Current Limitations](#-current-limitations)
* [Troubleshooting](#-troubleshooting)
* [Future Improvements](#-future-improvements)
* [Developer Information](#-developer-information)
* [License](#-license)

---

## 🌟 About the Project

**Atik's Fashion House 2.1** is a fashion e-commerce starter project that combines an attractive storefront with an Express.js backend.

The project is designed for learning, development, demonstration, and future expansion into a complete online fashion store.

The backend uses a local JSON file for data persistence instead of a native SQLite module, simplifying installation on Windows and modern Node.js versions.

### 🎯 Project Goals

* Build a responsive fashion shopping interface.
* Provide a foundation for product and order management.
* Implement server-side admin authentication APIs.
* Simplify local development on Windows.
* Create a foundation for future e-commerce functionality.

## ✨ Features

### 🛍️ Storefront

* Responsive fashion storefront interface.
* Modern HTML and CSS styling.
* Vanilla JavaScript interactions.
* Demo shopping cart.
* Demo checkout experience.
* Newsletter interface.
* Demo order-list functionality.

### 🛠️ Admin Studio

* Dedicated admin dashboard page.
* Browser `localStorage`-based demo interface.
* Demo login for local UI testing.
* Separate server-side admin authentication API.
* Backend endpoints for products, orders, settings, and dashboard summaries.

**Important:** The current visual admin dashboard is not yet connected to the server-side admin APIs.

### ⚙️ Backend

* Node.js and Express.js server.
* Session-based admin authentication.
* Password hashing support through `bcryptjs`.
* Protected admin API endpoints.
* JSON-based local data persistence.
* Application health-check endpoint.
* Environment-based configuration.

### 💻 Developer Experience

* Compatible with modern Node.js environments.
* Designed for Windows and PowerShell.
* No native SQLite compilation required.
* Easy local installation with npm.
* Simple project structure for further development.

---

## 🧰 Technology Stack

| Technology         | Purpose                                               |
| ------------------ | ----------------------------------------------------- |
| HTML5              | Page structure                                        |
| CSS3               | Styling and responsive layouts                        |
| Vanilla JavaScript | Frontend interactions                                 |
| Node.js            | JavaScript runtime                                    |
| Express.js         | Backend server and REST APIs                          |
| bcryptjs           | Password hashing support                              |
| JSON               | Local application data storage                        |
| npm                | Dependency management                                 |
| dotenv             | Environment configuration, if included in the project |
| Express sessions   | Server-side session authentication                    |

---

## 📋 Requirements

Before running the project, install:

* **Node.js:** Version 20 or newer.
* **npm:** Included with Node.js.
* **Web browser:** Chrome, Edge, Firefox, or another modern browser.
* **Terminal:** PowerShell, Windows Terminal, or a compatible shell.

Node.js 22 LTS is recommended for broad package compatibility.

### Download Node.js

Official website: https://nodejs.org/en/download

Verify your installation:

```powershell
node --version
npm --version
```

Both commands should display installed version numbers.

---

## 🚀 Installation & Setup

### Step 1: Open the Project Folder

Extract the project ZIP file and open PowerShell in the project root directory.

For example:

```powershell
cd "C:\Users\ASUS\Downloads\Atiks-Fashion-House-2"
```

Replace the example path with your actual project location.

### Step 2: Install Dependencies

Run:

```powershell
npm install
```

Wait until npm finishes installing the dependencies.

If npm displays deprecation warnings, review them separately from installation errors. A warning does not necessarily mean the installation failed.

### Step 3: Create the Environment File

Copy the example configuration file:

```powershell
Copy-Item .env.example .env
```

If `.env` already exists, do not overwrite it unnecessarily.

### Step 4: Configure Environment Variables

Open `.env` in your preferred code editor and configure the variables supported by your project's `server.js`.

Set a strong, unique session secret and a secure admin password. The server API admin password must contain at least 12 characters.

**Do not commit your real `.env` file to a public GitHub repository.**

### Step 5: Start the Server

```powershell
npm start
```

Keep the terminal open while using the application.

### Step 6: Open the Website

Visit:

* Storefront: http://localhost:3000
* Admin demo: http://localhost:3000/admin.html
* Health check: http://localhost:3000/health

To stop the server, press:

```text
Ctrl + C
```

---

## 🔐 Environment Configuration

The project includes an `.env.example` file for local configuration.

Example setup:

```powershell
Copy-Item .env.example .env
```

Configure the actual variable names expected by your backend.

Typical configuration concepts include:

| Variable                | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `PORT`                  | Server listening port, if configurable      |
| `SESSION_SECRET`        | Secret used to sign session identifiers     |
| Admin password variable | Password used for server API authentication |

**Note:** The exact environment variable names depend on your implementation. Check `.env.example` and `server.js` before adding or changing variables.

Never publish real passwords, session secrets, API keys, or other private credentials.

---

## 🌐 Application URLs

After successfully starting the server, use these local addresses.

| Service              | Address                          |
| -------------------- | -------------------------------- |
| Fashion Storefront   | http://localhost:3000            |
| Admin Dashboard Demo | http://localhost:3000/admin.html |
| Server Health Check  | http://localhost:3000/health     |

These addresses work on the same computer running the server.

---

## 👨‍💼 Admin Dashboard

The visual admin dashboard currently uses browser `localStorage` and a demo login.

### Demo UI Credentials

| Field    | Value       |
| -------- | ----------- |
| Username | `admin`     |
| Password | `Atik@2026` |

These credentials are for local UI demonstration only.

**Security warning:** Do not publish demo credentials as production credentials or expose the demo dashboard as a production management portal.

### Two Separate Authentication Systems

The project currently has two separate systems:

1. **Dashboard demo login:** Uses browser `localStorage`.
2. **Backend admin authentication:** Uses the Express API and server-side sessions.

The visual dashboard is not yet integrated with the backend's protected admin endpoints. Therefore, actions in the demo interface should not be assumed to update the server's JSON database.

---

## 🔌 API Documentation

The Express backend provides authentication, product, order, settings, and dashboard summary endpoints.

### 1. Authentication API

| Method | Endpoint           | Description                             |
| ------ | ------------------ | --------------------------------------- |
| `POST` | `/api/auth/login`  | Authenticate an admin                   |
| `POST` | `/api/auth/logout` | Log out an admin                        |
| `GET`  | `/api/auth/me`     | Check the current authentication status |

### 2. Product API

| Method   | Endpoint                  | Description                            |
| -------- | ------------------------- | -------------------------------------- |
| `GET`    | `/api/products`           | Retrieve public products               |
| `GET`    | `/api/admin/products`     | Retrieve products for admin management |
| `POST`   | `/api/admin/products`     | Create a product                       |
| `PUT`    | `/api/admin/products/:id` | Update an existing product             |
| `DELETE` | `/api/admin/products/:id` | Delete a product                       |

### 3. Order API

| Method  | Endpoint                       | Description               |
| ------- | ------------------------------ | ------------------------- |
| `GET`   | `/api/admin/orders`            | Retrieve admin order data |
| `PATCH` | `/api/admin/orders/:id/status` | Update an order's status  |

### 4. Store Settings API

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| `GET`  | `/api/admin/settings` | Retrieve store settings |
| `PUT`  | `/api/admin/settings` | Update store settings   |

### 5. Dashboard Summary API

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| `GET`  | `/api/admin/summary` | Retrieve dashboard summary data |

### API Authentication

All `/api/admin/*` endpoints require a valid server-side admin session.

The login endpoint must be used to establish the session before accessing protected admin routes.

The precise request bodies, response formats, validation rules, and status codes depend on the implementation in `server.js`.

---

## 📁 Project Structure

The following is an illustrative structure. Your actual project may use different filenames or directories.

```text
atiks-fashion-house-2.1/
│
├── public/
│   ├── index.html
│   ├── admin.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── data/
│   └── store.json
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

### Main Files

* `public/index.html` — Main storefront page, if present.
* `public/admin.html` — Admin dashboard demonstration.
* `server.js` — Express backend entry point, if named this way.
* `data/store.json` — Local JSON persistence file.
* `.env.example` — Example environment configuration.
* `.gitignore` — Files and folders excluded from Git.
* `package.json` — Project metadata, dependencies, and scripts.
* `README.md` — Project documentation.

---

## 💾 Data Storage

The backend stores application data in:

```text
data/store.json
```

This avoids the need to compile a native SQLite dependency during installation.

### Important Considerations

* Back up `data/store.json` before making significant changes.
* Ensure the server process has permission to write to the data directory.
* Avoid simultaneous conflicting writes to the JSON file.
* Do not treat this simple storage method as a replacement for a production database.
* Use a suitable database when scaling to multiple users or concurrent transactions.

### Session Storage

The default Express in-memory session store is suitable only for local development.

Production deployments should use a persistent session store configured for the deployment environment.

---

## 🔒 Security Considerations

This project is a development starter and is not production-ready without further work.

Before making the application publicly accessible:

1. Replace demo credentials with secure credentials.
2. Keep `.env` excluded from version control.
3. Use a strong and unique session secret.
4. Enable HTTPS in production.
5. Configure secure session cookie options.
6. Use a persistent production session store.
7. Validate and sanitize incoming API data.
8. Apply appropriate rate limiting and CSRF protection.
9. Enforce authorization checks on every protected endpoint.
10. Use a production-suitable database when needed.
11. Implement proper customer order creation and validation.
12. Integrate a trusted payment provider before accepting payments.
13. Avoid exposing internal errors or sensitive information.
14. Review dependencies for vulnerabilities before deployment.

### Public Repository Checklist

Before pushing the project to GitHub, check that:

* `.env` is ignored by Git.
* Real passwords and secrets are removed.
* No customer information is included.
* No production session credentials are exposed.
* Demo credentials are clearly documented as demonstration-only.

---

## ⚠️ Current Limitations

The current version is a starter project with demonstration features.

* The admin dashboard is not yet connected to the server-side admin APIs.
* The dashboard demo login uses browser `localStorage`.
* The storefront cart is a demo feature.
* Checkout does not process real payments.
* Customer order creation is not configured.
* Newsletter email delivery is not configured.
* The order list is a demonstration feature.
* JSON storage is intended for simple local development.
* Express's default in-memory session store is not suitable for production.

These limitations should be addressed before using the project for a real commercial fashion store.

---

## 🧰 Troubleshooting

### Problem 1: `npm install` fails

Try the following:

```powershell
node --version
npm --version
npm install
```

Confirm that Node.js 20 or newer is installed.

Review the first actual error in the terminal rather than relying only on warning messages.

### Problem 2: Port 3000 is already in use

Another application may already be using the port.

Stop the other application or configure a different port if the server supports it.

### Problem 3: The website does not open

Confirm that the server started successfully.

```powershell
npm start
```

Then open:

http://localhost:3000

Keep the server terminal running.

### Problem 4: Admin logout does not work

The visual dashboard and backend authentication use separate systems.

If the dashboard uses `localStorage`, its logout handler must clear the correct demo authentication key and update the page state.

If backend logout is involved, the frontend must send a `POST` request to `/api/auth/logout` using the same session cookie, and the server must invalidate the session.

Clearing browser `localStorage` alone does not invalidate a server-side session.

### Problem 5: Admin changes do not appear in the JSON file

The current dashboard is not connected to the server admin APIs.

Its local demo data may be stored in browser `localStorage`, while API data is stored in `data/store.json`.

Integration between the dashboard and the backend is required for server-persisted management actions.

### Problem 6: Environment configuration errors

Check that:

* `.env` exists in the project root.
* The variable names match those read by the backend.
* The session secret is configured.
* The admin password meets the minimum length requirement.
* The server has been restarted after configuration changes.

---

## 🚀 Future Improvements

Potential improvements for future versions include:

* [ ] Connect the dashboard to the backend APIs.
* [ ] Add real product CRUD functionality to the UI.
* [ ] Implement persistent customer orders.
* [ ] Add customer registration and login.
* [ ] Introduce a production database.
* [ ] Add product search, filtering, and sorting.
* [ ] Add product categories and inventory management.
* [ ] Integrate a payment gateway.
* [ ] Configure transactional email delivery.
* [ ] Improve accessibility and responsive design.
* [ ] Add automated tests.
* [ ] Add production logging and error monitoring.
* [ ] Add deployment instructions.
* [ ] Configure a production session store.

---

## 👨‍💻 Developer Information

**Developer Name:** MD. Atiqul Islam (Atik)

**Email:** [atik.cmttiu1001@gmail.com](mailto:atik.cmttiu1001@gmail.com)

**GitHub:** [ATIQULTIU](https://github.com/ATIQULTIU)

**Project Name:** Atik's Fashion House 2.1

**Project Type:** Responsive Fashion Storefront & Admin Studio Starter

---

## 📄 License

No license has been specified for this project yet.

Before publishing, choose an appropriate license and add a corresponding `LICENSE` file to the repository.

If you intend to allow reuse and modification, review the MIT License as one possible option. Do not claim that the project uses a particular license until you have added it.

---

<p align="center">
  <strong>Atik's Fashion House 2.1</strong><br>
  Style Meets Technology 👗✨<br><br>
  Designed and developed by<br>
  <strong>MD. Atiqul Islam (Atik)</strong><br>
  <a href="mailto:atik.cmttiu1001@gmail.com">atik.cmttiu1001@gmail.com</a>
</p>
