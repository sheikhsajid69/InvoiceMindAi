# InvoiceMind AI

An autonomous financial reasoning assistant that transforms invoices, chat messages, and bank records into clear, actionable financial insights. 

InvoiceMind AI acts as a smart bridge between your unstructured correspondence (like client chat messages containing delays or promises) and structured records (like official invoices and bank ledgers). It cross-references these assets to flag discrepancies, estimate overdue cash flow, calculate dynamic risk scores, and compose context-aware communication drafts (such as legal demand letters or discrepancy reconciliation follow-ups).

---

## 🎯 Purpose of the Project

In today's fast-paced gig, freelance, and corporate economies, tracking receivables is a massive chore. Outstanding payments frequently get lost in translation when clients make informal promises in chat threads (e.g., Slack, WhatsApp, iMessage) but fail to match them in bank ledgers. 

**InvoiceMind AI was created to solve this friction by:**
- **Automating Financial Cross-Referencing**: Instantly comparing invoice parameters against bank statement credits and communication promises.
- **Assessing Behavior & Credit Risk**: Quantifying risk with an automated risk scoring engine based on unresponsiveness, past ghosting, or partial payment disputes.
- **Reducing Administrative Burden**: Drafting contextually relevant correspondence templates with an embedded AI-powered message editor, allowing users to instantly generate reminder and dispute emails.
- **Providing Interactive Analysis Contexts**: Enabling sandbox mode exploration with realistic multi-document scenarios so teams can test scenarios prior to deploying in production.

---

## 👥 For Whom Is This Project?

InvoiceMind AI is engineered specifically for:
- **Freelancers & Solopreneurs**: Who manage their own billing and need to quickly follow up on outstanding client invoices without sounding confrontational.
- **Small & Medium Businesses (SMBs)**: Accounting teams that want a quick cross-referencing ledger auditor to check if clients' claims of "payment sent" match live bank entries.
- **Financial Analysts & Operations Teams**: Managers looking to evaluate cash-flow risk profiles and project-by-project payment histories.
- **Enterprise Integrators**: Teams wanting a robust blueprint of using the **Google Gemini 3.5 API** for complex document reasoning and multimodal extraction.

---

## 🚀 Key Features

- **Multimodal AI Reasoning**: Analyzes PDFs, invoices, spreadsheets, CSV files, and chat screenshots concurrently using `gemini-3.5-flash`.
- **Pre-Loaded Interactive Sandboxes**: Three high-fidelity interactive cases spanning high-risk payment delays, partial payment discrepancies, and successfully matched credits.
- **Dynamic Risk Score Dashboard**: Custom interactive charts powered by Recharts, visualization metrics, and client behavior report cards.
- **Interactive Email Draft Editor**: Full-featured custom workspace where you can refine, copy, and immediately draft follow-up or demand emails utilizing native mail protocols.
- **Report Exporter**: Generate beautifully structured Markdown reports with a single click to download offline audit results.
- **Continuous AI Assistant Chat**: Sidebar widget linked directly to the analysis context allowing for deep inquiries about extracted line items or negotiation tactics.

---

## 📊 Project Structure

```text
├── .env.local             # Local environment secrets and keys (e.g., GEMINI_API_KEY)
├── .gitignore             # Standard git exclusions for build targets and node modules
├── App.tsx                # Primary layout, drag-and-drop state, and demo dashboards
├── constants.ts           # Standard instructional anchors for the financial intelligence engine
├── index.html             # HTML mounting element with custom CDN imports
├── index.tsx              # Main React 19 bootstrap file
├── metadata.json          # System permissions and major cloud capabilities
├── package.json           # Dependencies and project scripts (Vite, React 19, Gemini SDK)
├── tsconfig.json          # TypeScript environment compiler settings
├── types.ts               # Shared strict TypeScript contracts and interface definitions
├── vite.config.ts         # Vite bundler, environment variable loaders, and aliases
│
├── components/
│   ├── AnalysisView.tsx   # Visual financial charts, statistics modules, and drafting suite
│   └── ChatWidget.tsx     # Direct contextual interaction pane connected to Gemini
│
└── services/
    ├── demoData.ts        # Fully modeled realistic scenarios (high, medium, low risk)
    └── geminiService.ts   # Core client-side and server-side integration of @google/genai SDK
```

---

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (v18 or later) installed.

### 1. Clone the repository and navigate to the directory
```bash
git clone https://github.com/your-username/invoicemind-ai.git
cd invoicemind-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Gemini API Key
Create or open a `.env.local` file in the root directory and specify your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

### 5. Build for Production
To generate compiled static assets in the `dist/` directory:
```bash
npm run build
```

---

## 🏷️ Versions

- **Vite**: `^6.2.0`
- **React**: `^19.2.1`
- **React DOM**: `^19.2.1`
- **Google Gen AI SDK**: `^1.32.0` (`@google/genai`)
- **Lucide Icons**: `^0.556.0` (`lucide-react`)
- **Recharts**: `^3.5.1`

---

## ⚖️ Copyright & License

### MIT License
Copyright (c) 2026 **InvoiceMind AI Authors**. All rights reserved.

Licensed under the **MIT License**. You are free to use, modify, distribute, and sublicense this software for both personal and commercial operations, provided the original copyright notice and permission consent are included in all copies or substantial portions of the software. Refer to the [LICENSE](./LICENSE) file for the full text.
