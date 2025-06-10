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

---

## 🛠 Getting Started

1. **Install the package**

```bash
npm i @dobprotocol/dobverse
```

2. **Basic DOBVERSE editor**

```javascript
<template>
  <Dobverse :page="page" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { Dobverse } from '@dobprotocol/dobverse'

const page = ref({
  name: '🌐 DOBVERSE',
  blocks:[{
    id: uuidv4(),
    type: 'TEXT',
    details: {
      value: 'Welcome to DOBVERSE!'
    },
  }],
})
</script>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📝 License

DOBVERSE is open-source software licensed under the MIT license.

## 🙏 Acknowledgements

- [Lotion](https://github.com/dashibase/lotion) - The original Notion-style editor
- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Privy](https://privy.io/) - For wallet integration
