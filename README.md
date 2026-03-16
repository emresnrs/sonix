# Sonix 🎙️

Sonix is a modern, fast, and privacy-focused web application that brings **AI-powered audio transcription** directly to your browser. Built with **Next.js**, **React**, and **Tailwind CSS**, Sonix unleashes the power of **Whisper models** entirely client-side using Web Workers and ONNX Runtime.

## ✨ Features

- **Client-Side Transcription**: Your audio files never leave your device. Transcription is powered by `@xenova/transformers` running Whisper models directly in your browser.
- **Multiple Whisper Models**: Choose from various Whisper models (Tiny, Base, Small, Multilingual, or English-only) depending on your speed vs. accuracy needs.
- **Multi-Language Support (i18n)**: Fully localized interface with support for **English**, **Turkish**, **Spanish**, **French**, and **German**. Your language preference is saved via `localStorage`.
- **Dark & Light Mode**: Seamless theme switching with system-default detection, persisting your preferences automatically.
- **History & Caching**: Your previous transcriptions are safely stored locally via **IndexedDB**. AI models are heavily cached so you don't download them twice!
- **Modern UI/UX**: Built using `shadcn/ui`, `lucide-react` icons, and a beautiful Next.js-driven dashboard interface.

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v18.18+) and your preferred package manager (npm, pnpm, or yarn) installed.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/sonix.git
   cd sonix
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or yarn install
   # or pnpm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or yarn dev
   ```

4. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

## 🏗️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **AI / ML**: [@xenova/transformers](https://huggingface.co/docs/transformers.js) (v2.7.0 for Web Worker ONNX execution)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Storage**: React Context API, `localStorage`, `IndexedDB`

## 🌍 Language Support (i18n)

Sonix features a custom lightweight i18n implementation without heavy external libraries. It utilizes the React Context API to dynamically inject localized text across the application. Supported languages:

- 🇺🇸 English (`en`)
- 🇹🇷 Türkçe (`tr`)
- 🇪🇸 Español (`es`)
- 🇫🇷 Français (`fr`)
- 🇩🇪 Deutsch (`de`)

## 🛠️ Project Structure

```text
sonix/
├── app/                  # Next.js App Router (pages, layouts, dashboard)
├── components/           # Reusable UI components (shadcn, sidebars, headers)
│   └── ui/               # Base design system components
├── config/               # Configuration files (AI model configs, metadata)
├── lib/                  # Utility functions and workers
│   ├── whisper-worker.ts # Web worker script handling ML operations
│   └── transcript-store.ts# IndexedDB local storage logic
├── locales/              # i18n dictionaries for all supported languages
└── public/               # Static assets
```

## 🔐 Privacy-First Approach

Unlike traditional transcription services, **Sonix does not send your raw audio to external servers** for transcription. The entire Whisper inference process happens inside your browser's memory. Your transcripts and media histories are only ever saved in your own browser's local storage (`IndexedDB`).

## 📜 License

This project is licensed under the [MIT License](LICENSE).
