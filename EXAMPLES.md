# Example API Requests

This file contains example requests you can use to test the Abbiey AI Chatbot API.

## Health Check

```bash
curl http://localhost:8787/health
```

## Get Available Templates

```bash
curl http://localhost:8787/templates
```

## Get Greeting for Default Template

```bash
curl http://localhost:8787/greeting
```

## Get Greeting for Customer Support Template

```bash
curl "http://localhost:8787/greeting?template=customer_support"
```

## Send a Simple Chat Message

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?"
  }'
```

## Send Chat Message with Customer Support Template

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I need help with my order #12345",
    "template": "customer_support"
  }'
```

## Send Chat Message with Sales Template

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What products do you recommend for small businesses?",
    "template": "sales"
  }'
```

## Send Chat Message with Technical Template

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "My application is not connecting to the database",
    "template": "technical"
  }'
```

## Send Chat Message with Conversation History

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What about refunds?",
    "template": "customer_support",
    "conversationHistory": [
      {
        "role": "user",
        "content": "I need help with my order"
      },
      {
        "role": "assistant",
        "content": "I would be happy to help you with your order. Could you please provide your order number?"
      },
      {
        "role": "user",
        "content": "Order #12345"
      },
      {
        "role": "assistant",
        "content": "Thank you. I have found your order #12345. How can I assist you with it?"
      }
    ]
  }'
```

## Testing with Production URL

Replace `http://localhost:8787` with your deployed worker URL:

```bash
# Example with deployed worker
curl https://abbieyai-api.your-subdomain.workers.dev/health

curl -X POST https://abbieyai-api.your-subdomain.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "template": "default"
  }'
```
