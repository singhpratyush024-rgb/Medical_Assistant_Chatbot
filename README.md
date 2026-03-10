# MedAssist — AI Medical Intelligence

![MedAssist](https://img.shields.io/badge/MedAssist-AI%20Medical%20Assistant-blue?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-success?style=for-the-badge)](https://medical-assistant-chatbot-hazel.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-purple?style=for-the-badge)](https://medical-assistant-chatbot-6ixo.onrender.com)


---

## Screenshot

![MedAssist App](screenshots/app-screenshot.png)


---

## Overview

**MedAssist** is a full-stack AI-powered medical assistant that allows users to upload medical documents (PDFs) and ask questions about them using Retrieval-Augmented Generation (RAG). It also supports medical image analysis using Google Gemini Vision.

> **Disclaimer:** MedAssist is for informational purposes only. Always consult a qualified healthcare professional for medical advice.

---

## Features

- **PDF Upload & Indexing** — Upload medical PDFs and index them into a vector database for semantic search
- **RAG-Powered Q&A** — Ask natural language questions about your medical documents
- **Medical Image Analysis** — Upload X-rays, prescriptions, or medical reports for AI-powered visual analysis
- **Table & Chart Extraction** — Extracts tables and structured data from PDFs using pdfplumber
- **Responsive UI** — Works seamlessly on desktop and mobile devices
- **Real-time Chat Interface** — Clean, modern chat UI with typing indicators

---

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-000000?style=flat-square&logo=chainlink&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

### AI & Vector Store
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-FF6B35?style=flat-square&logo=groq&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=flat-square&logo=pinecone&logoColor=white)

---

## Architecture

```
User
 │
 ├── Upload PDF
 │     └── FastAPI → pdfplumber (extract text + tables)
 │           └── Gemini Embedding (gemini-embedding-001)
 │                 └── Pinecone (vector store)
 │
 └── Ask Question / Upload Image
       ├── Text Query
       │     └── Gemini Embedding → Pinecone similarity search
       │           └── LangChain RAG → Groq LLM (llama-3.3-70b)
       │                 └── Answer
       │
       └── Image Query
             └── Gemini Vision (analyze image)
                   └── Combined query → Pinecone → Groq LLM
                         └── Answer + Image Analysis
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- API Keys: Google AI, Pinecone, Groq

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/medical-assistant.git
cd medical-assistant/server

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys to .env

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd medical-assistant/client

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > .env.local

# Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Backend (`server/.env`)

```env
GOOGLE_API_KEY=your_google_api_key
PINECONE_API_KEY=your_pinecone_api_key
GROQ_API_KEY=your_groq_api_key
```

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload_pdfs/` | Upload and index PDF documents |
| POST | `/ask/` | Ask a text question |
| POST | `/ask_with_image/` | Ask a question with a medical image |

---

## Project Structure

```
medical-assistant/
├── client/                      # Next.js frontend
│   ├── app/
│   │   └── page.tsx             # Main page
│   ├── components/
│   │   ├── Sidebar.tsx          # PDF upload sidebar
│   │   ├── ChatWindow.tsx       # Chat messages
│   │   └── ChatInput.tsx        # Input bar
│   ├── hooks/
│   │   ├── useChat.ts           # Chat logic
│   │   └── useMobile.ts         # Responsive detection
│   └── lib/
│       └── api.ts               # API calls
│
└── server/                      # FastAPI backend
    ├── main.py                  # App entry point
    ├── routes/
    │   ├── upload_pdfs.py       # PDF upload endpoint
    │   ├── ask_question.py      # Text Q&A endpoint
    │   └── ask_with_image.py    # Image analysis endpoint
    ├── modules/
    │   ├── load_vectorstore.py  # PDF processing & embedding
    │   └── llm.py               # LangChain RAG chain
    └── requirements.txt
```

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [medical-assistant-chatbot-hazel.vercel.app](https://medical-assistant-chatbot-hazel.vercel.app) |
| Backend | Render | [medical-assistant-chatbot-6ixo.onrender.com](https://medical-assistant-chatbot-6ixo.onrender.com) |

---

## License

This project is licensed under the MIT License.

---

<p align="center">Built with by Pratyush Singh</p>
