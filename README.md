# Abbiey AI Chatbot API

A Cloudflare Worker-based AI chatbot API that provides conversational AI capabilities with multiple specialized templates.

## Preview

The API is deployed and available at: **https://abbieyai-api.tscollective-co.workers.dev/**

## Features

- **Multiple Templates**: Choose from different conversation styles
  - Default: General-purpose AI assistant
  - Customer Support: Empathetic support agent
  - Sales: Benefit-focused sales assistant
  - Technical: Detailed technical troubleshooting

- **AI-Powered Responses**: Uses Cloudflare AI Workers with Llama 2 model
- **Conversation History**: Supports multi-turn conversations
- **CORS Enabled**: Ready for cross-origin requests
- **RESTful API**: Simple, clean endpoint structure

## API Endpoints

### Health Check
```
GET /
GET /health
```
Returns API status and available endpoints.

### Chat
```
POST /chat
```
Send a message and get an AI-generated response.

**Request Body:**
```json
{
  "message": "Your message here",
  "template": "default",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "AI generated response",
  "template": "default",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Greeting
```
GET /greeting?template=<template_name>
```
Get a greeting message for a specific template.

**Response:**
```json
{
  "greeting": "Template-specific greeting",
  "template": "default",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Templates
```
GET /templates
```
List all available templates.

**Response:**
```json
{
  "templates": ["default", "customer_support", "sales", "technical"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Development

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Cloudflare account with Workers AI enabled

### Setup
```bash
npm install
```

### Local Development
```bash
npm run dev
```

### Deployment
```bash
npm run deploy
```

## Configuration

The API is configured via `wrangler.toml`. Make sure you have:
- AI binding configured
- Proper compatibility date set

## License

MIT