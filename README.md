# 🌐 DOBVERSE

DOBVERSE is an open-source, modular Notion-style editor forked from [Lotion](https://github.com/dashibase/lotion), redesigned as a dynamic knowledge and coordination hub for the DePIN-native world.

> Built with Vue 3 · Powered by DOB Protocol · Inspired by coordination layers like Notion, Tana, and CharmVerse

![DOBVERSE Screenshot](./assets/dobverse-preview.png)

---

## 🚀 Why DOBVERSE?

DOBVERSE is a collaborative canvas for decentralized builders. It enables structured discussions, DePIN project pages, governance docs, and agent playbooks — all in an intuitive, extensible interface.

It integrates with **DOB Protocol's infrastructure** and provides a customizable block-based editing experience for DAOs, tokenized infra communities, and RWA projects.

---

## ✨ Features

- 🧱 **Block-based editor** with drag-and-drop reordering
- 📄 Markdown-style content creation (`**bold**`, `# Headings`, `---` dividers, etc.)
- ⌨️ Slash command menu for shortcuts and inserting new blocks
- 🔌 Custom block registration (build your own!)
- 🔒 Read-only view mode
- 🧩 DOB-ready UI for token-gated access, proposals, and agent execution docs _(coming soon)_
- 🔒 Wallet-based authentication (MetaMask or any EIP-1193 wallet)
- 🧩 Team dashboard with Notion/Lotion-style UI

---

## 🛠 Running in a Private Cloud Server

### 1. **Clone the Repository**

```bash
git clone https://github.com/blessedux/DobVerse.git
cd DobVerse
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
# No backend secrets needed for UI-only mode
# If you want to restrict access, set your whitelisted wallet addresses in src/components/LandingPage.vue
```

### 4. **Build and Run the App**

#### For development:

```bash
npm run dev
```

- The app will be available at `http://localhost:5173`

#### For production:

```bash
npm run build
npm run preview
```

- Or serve the `dist/` directory with any static file server (e.g. Nginx, Caddy, serve).

### 5. **Deploy to Your Private Cloud**

- **Docker:** You can use a simple Dockerfile to containerize the app.
- **Nginx/Apache:** Serve the `dist/` directory as static files.
- **Cloud Providers:** Deploy to AWS EC2, DigitalOcean, GCP, Azure, or any VPS.

#### Example Dockerfile

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔐 Wallet Authentication

- The app uses MetaMask (or any EIP-1193 compatible wallet) for authentication.
- Only addresses in the whitelist (see `src/components/LandingPage.vue`) can access the dashboard.
- On login, users must sign a message to prove wallet ownership.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

DOBVERSE is open-source software licensed under the MIT license.

## 🙏 Acknowledgements

- [Lotion](https://github.com/dashibase/lotion) - The original Notion-style editor
- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
