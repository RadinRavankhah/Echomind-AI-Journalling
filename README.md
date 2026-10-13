# EchoMind

An AI-assisted journaling and self-reflection app. EchoMind guides you through structured reflection prompts, stores your entries, and uses an LLM to mirror your thoughts back to you for deeper insight. A vector store keeps a personal memory of patterns noticed across your reflections over time.

## Features

- **Guided reflection flow** — a ten-question prompt journey covering emotion, trigger, intensity, physical effect, context, patterns, relationships, self-view, preferred outcome, and next steps.
- **AI mirroring** — request an LLM-generated reflection of any entry. It reflects emotions and patterns rather than offering advice or judgment.
- **Pattern memory** — user-specific embeddings stored in ChromaDB power "memories" that surface repeated patterns.
- **Journal library** — browse, pin, and manage past entries.
- **Analytics** — streak tracking, dominant emotions, reflection coverage, and entry frequency charts.
- **Authentication** — JWT-based auth with per-user data isolation.

## Tech Stack

**Backend** — Django, Django REST Framework, SimpleJWT, LangChain, ChromaDB
**Frontend** — React, TypeScript, Vite, Recharts, Lucide icons

## Architecture

| Directory | Purpose |
|-----------|---------|
| `accounts/` | Custom user model, profiles, JWT authentication |
| `journals/` | Entries, prompts, responses, emotion tags |
| `reflect/` | LLM integration, embeddings, vector store, AI reflection service |
| `analytics/` | Aggregated insights (streaks, trends, frequency) |
| `frontend/` | React + TypeScript client |

## Getting Started

### Backend

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Configuration

- Set your LLM provider credentials (used by the `reflect` app) via environment variables.

## License

This project is licensed under the EchoMind Personal Use License. It may be used for personal, non-commercial purposes only. Commercial use and redistribution are prohibited. See the [LICENSE](./LICENSE) file for full terms.

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before opening a pull request.

