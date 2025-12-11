# Abbiey AI Chatbot API

![Deployment Status](https://img.shields.io/github/deployments/tscollectiveco-ui/abbieyai-api/production?label=deployment&logo=cloudflare)
![Node Version](https://img.shields.io/badge/node-20.19.6-brightgreen?logo=node.js)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A Cloudflare Worker-based AI chatbot API with a modern, responsive frontend. Provides conversational AI capabilities with multiple specialized templates powered by Cloudflare Workers AI.

## 🌟 Features

### Backend API
- **Multiple Templates**: Choose from different conversation styles
  - Default: General-purpose AI assistant
  - Customer Support: Empathetic support agent
  - Sales: Benefit-focused sales assistant
  - Technical: Detailed technical troubleshooting

- **AI-Powered Responses**: Uses Cloudflare AI Workers with Llama 2 model
- **Conversation History**: Supports multi-turn conversations
- **CORS Enabled**: Ready for cross-origin requests
- **RESTful API**: Simple, clean endpoint structure

### Frontend
- **Modern UI**: Clean, minimal, elegant design
- **Interactive Chat**: Real-time chat interface with multiple templates
- **Responsive**: Mobile-first design that works on all devices
- **Fast Loading**: Vanilla JavaScript, no build step required
- **PWA Ready**: Progressive Web App with manifest and service worker support

## 📁 Project Structure

```
abbieyai-api/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Production deployment workflow
│       └── preview.yml         # PR preview deployment workflow
├── public/                     # Static frontend assets
│   ├── css/
│   │   └── style.css          # Main stylesheet with CSS variables
│   ├── js/
│   │   ├── app.js             # Application initialization
│   │   └── chat.js            # Chat functionality module
│   ├── index.html             # Landing page with chat interface
│   ├── manifest.json          # PWA manifest
│   └── favicon.svg            # Site favicon
├── src/
│   └── index.js               # Cloudflare Worker entry point
├── .dev.vars.example          # Environment variables template
├── .gitignore                 # Git ignore rules
├── .node-version              # Node.js version specification
├── package.json               # Node.js dependencies
├── README.md                  # This file
└── wrangler.toml             # Cloudflare configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js v20.19.6 or later (see [.node-version](.node-version))
- npm or yarn
- Cloudflare account with Workers AI enabled
- Cloudflare API token (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/tscollectiveco-ui/abbieyai-api.git
   cd abbieyai-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional for local development)
   ```bash
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars with your values (optional)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The API will be available at `http://localhost:8787` and the frontend at `http://localhost:8787/`

5. **Test the API**
   ```bash
   # Health check
   curl http://localhost:8787/health
   
   # Send a chat message
   curl -X POST http://localhost:8787/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello!", "template": "default"}'
   ```

## 📡 API Endpoints

### Health Check
```
GET /
GET /health
```
Returns API status and available endpoints.

**Response:**
```json
{
  "status": "healthy",
  "name": "Abbiey AI Chatbot API",
  "version": "1.0.1",
  "endpoints": {
    "chat": "POST /chat",
    "greeting": "GET /greeting?template=<name>",
    "templates": "GET /templates"
  }
}
```

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

## 🌐 Deployment

### Cloudflare Pages + Workers Deployment

This project uses GitHub Actions for automated deployment to Cloudflare Pages and Workers.

#### Setup Deployment

1. **Get Cloudflare credentials**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Get your Account ID from the Workers & Pages overview
   - Create an API Token with the following permissions:
     - Account > Cloudflare Pages > Edit
     - Account > Workers Scripts > Edit

2. **Add GitHub Secrets**
   
   Go to your repository's Settings > Secrets and variables > Actions, and add:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

3. **Automatic Deployment**
   - **Production**: Push to `main` branch triggers deployment
   - **Preview**: Open a PR to get a preview deployment with a unique URL

#### Manual Deployment

```bash
# Deploy the worker
npm run deploy

# Or use wrangler directly
npx wrangler deploy
```

### Environment Variables

For production deployments, you can add environment variables:

1. **Via Cloudflare Dashboard**: Workers & Pages > Your Worker > Settings > Variables
2. **Via wrangler**: Add to `wrangler.toml` or use `wrangler secret put`

## 🎨 Frontend Customization

### Color Scheme

The frontend uses CSS custom properties (variables) for easy theming. Edit `/public/css/style.css`:

```css
:root {
  --color-primary: #667eea;      /* Primary brand color */
  --color-secondary: #764ba2;    /* Secondary brand color */
  --color-accent: #f093fb;       /* Accent color */
  /* ... more variables */
}
```

### Adding New Features

The frontend is built with vanilla JavaScript for simplicity:

- **App logic**: Edit `/public/js/app.js`
- **Chat functionality**: Edit `/public/js/chat.js`
- **Styling**: Edit `/public/css/style.css`
- **HTML structure**: Edit `/public/index.html`

## 🧪 Testing

Currently, the project focuses on manual testing. To test:

1. Start the dev server: `npm run dev`
2. Open `http://localhost:8787` in your browser
3. Test the chat interface with different templates
4. Test API endpoints using curl or Postman

## 🔒 Security

- All API requests use CORS headers for cross-origin support
- No sensitive data is stored in the frontend
- Environment variables are kept secure via `.dev.vars` (gitignored)
- Cloudflare Workers provide built-in DDoS protection

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare AI Documentation](https://developers.cloudflare.com/workers-ai/)

## 💡 Tips

- Use the template selector to switch between different AI personalities
- Conversation history is maintained within a session for contextual responses
- The frontend is fully static - you can host it anywhere
- Worker and Pages can be deployed independently

---

Built with ❤️ using Cloudflare Workers AI