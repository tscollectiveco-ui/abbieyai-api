# Abbiey AI Chatbot API

A Cloudflare Workers-based chatbot API with template support for different conversation types. This backend provides a flexible chatbot system that can be configured with different templates for various use cases like customer support, sales, and technical assistance.

## Features

- 🤖 **AI-Powered Responses**: Uses Cloudflare AI for intelligent conversation
- 📝 **Template System**: Multiple pre-configured templates for different conversation types
- 🔄 **Conversation History**: Supports maintaining conversation context
- 🚀 **Serverless**: Runs on Cloudflare Workers for global edge deployment
- 🔒 **CORS Enabled**: Ready for frontend integration

## Templates

The API comes with several built-in templates:

- **default**: General-purpose AI assistant
- **customer_support**: Empathetic customer service agent
- **sales**: Enthusiastic sales assistant
- **technical**: Technical support specialist

## API Endpoints

### 1. Health Check
```bash
GET /
GET /health
```

Returns API status and available endpoints.

### 2. Chat
```bash
POST /chat
```

Send a message and get an AI response.

**Request Body:**
```json
{
  "message": "Hello, I need help with my order",
  "template": "customer_support",
  "conversationHistory": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

**Response:**
```json
{
  "response": "I'd be happy to help you with your order...",
  "template": "customer_support",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. Get Greeting
```bash
GET /greeting?template=customer_support
```

Get the greeting message for a specific template.

**Response:**
```json
{
  "greeting": "Welcome to customer support! I'm here to help...",
  "template": "customer_support",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. List Templates
```bash
GET /templates
```

Get a list of available templates.

**Response:**
```json
{
  "templates": ["default", "customer_support", "sales", "technical"],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tscollectiveco-ui/abbieyai-api.git
cd abbieyai-api
```

2. Install dependencies:
```bash
npm install
```

3. Configure Wrangler:
```bash
npx wrangler login
```

### Development

Run the worker locally:
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Configuration

Edit `wrangler.toml` to configure your worker:

```toml
name = "abbieyai-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"
```

## Adding Custom Templates

You can add custom templates by editing `src/templates.ts`:

```typescript
export const templates: Record<string, ChatTemplate> = {
  // ... existing templates
  
  my_custom_template: {
    systemPrompt: "Your custom system prompt here",
    greeting: "Your custom greeting message",
    fallbackResponse: "Your custom fallback response"
  }
};
```

## Example Usage

### cURL Example

```bash
# Get greeting
curl https://your-worker.workers.dev/greeting?template=customer_support

# Send a chat message
curl -X POST https://your-worker.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help with my account",
    "template": "customer_support"
  }'
```

### JavaScript Example

```javascript
// Get greeting
const greeting = await fetch('https://your-worker.workers.dev/greeting?template=sales')
  .then(r => r.json());

// Send chat message
const response = await fetch('https://your-worker.workers.dev/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Tell me about your products',
    template: 'sales'
  })
}).then(r => r.json());

console.log(response.response);
```

## Architecture

```
abbieyai-api/
├── src/
│   ├── index.ts       # Main worker entry point
│   └── templates.ts   # Chatbot templates
├── wrangler.toml      # Cloudflare Workers config
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript config
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.