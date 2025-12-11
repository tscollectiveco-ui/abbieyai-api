# AbbieYAI API

A Cloudflare Pages Functions API that provides endpoints for:
- Chat completions (OpenAI)
- Embeddings generation
- Content moderation

## Endpoints

- `POST /api/chat` - Chat completions
- `POST /api/embeddings` - Generate embeddings
- `POST /api/moderation` - Content moderation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the `OPENAI` binding in your Cloudflare Pages settings

3. Deploy:
   ```bash
   npm run deploy
   ```

## Development

Run locally with:
```bash
npm run dev
```