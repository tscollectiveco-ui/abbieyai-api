# Abbiey AI Client Library

A JavaScript client library for connecting web pages to the Abbiey AI Chatbot Cloudflare Worker API.

## Installation

### Browser (Direct Include)

Include the `index.js` file directly in your HTML:

```html
<script src="index.js"></script>
```

### Node.js / Module Bundlers

```javascript
// ES6 Modules
import AbbieyAIClient from './index.js';
```

## Quick Start

```javascript
// Initialize the client
const client = new AbbieyAIClient({
    apiUrl: 'https://your-worker.workers.dev'
});

// Send a chat message
const response = await client.chat('Hello, how are you?');
console.log(response.response);
```

## API Reference

### Constructor

```javascript
new AbbieyAIClient(options)
```

**Parameters:**
- `options.apiUrl` (string): The base URL of your Cloudflare Worker API (default: 'https://abbieyai-api.workers.dev')

**Example:**
```javascript
const client = new AbbieyAIClient({
    apiUrl: 'https://my-worker.workers.dev'
});
```

### Methods

#### `health()`

Check the API health status.

**Returns:** Promise<Object>

**Example:**
```javascript
const status = await client.health();
console.log(status);
// { status: "healthy", name: "Abbiey AI Chatbot API", version: "1.0.1", ... }
```

---

#### `chat(message, options)`

Send a chat message and receive an AI response.

**Parameters:**
- `message` (string, required): The message to send
- `options` (object, optional):
  - `template` (string): Template to use ('default', 'customer_support', 'sales', 'technical'). Default: 'default'
  - `keepHistory` (boolean): Whether to maintain conversation history. Default: true

**Returns:** Promise<Object>

**Example:**
```javascript
// Simple message
const response = await client.chat('What can you help me with?');
console.log(response.response);

// With options
const response = await client.chat('I need help with my order', {
    template: 'customer_support',
    keepHistory: true
});
```

---

#### `greeting(template)`

Get a greeting message for a specific template.

**Parameters:**
- `template` (string, optional): Template name. Default: 'default'

**Returns:** Promise<Object>

**Example:**
```javascript
const greeting = await client.greeting('sales');
console.log(greeting.greeting);
// "Hi! I'm here to help you find the perfect option. What are you searching for?"
```

---

#### `templates()`

Get a list of all available templates.

**Returns:** Promise<Object>

**Example:**
```javascript
const data = await client.templates();
console.log(data.templates);
// ["default", "customer_support", "sales", "technical"]
```

---

#### `clearHistory()`

Clear the conversation history.

**Example:**
```javascript
client.clearHistory();
```

---

#### `getHistory()`

Get the current conversation history.

**Returns:** Array

**Example:**
```javascript
const history = client.getHistory();
console.log(history);
// [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
```

---

#### `setHistory(history)`

Set the conversation history.

**Parameters:**
- `history` (array, required): Array of conversation messages

**Example:**
```javascript
client.setHistory([
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi there!" }
]);
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Chatbot</title>
</head>
<body>
    <div id="chat"></div>
    <input id="input" type="text" placeholder="Type a message...">
    <button id="send">Send</button>

    <script src="index.js"></script>
    <script>
        // Initialize client
        const client = new AbbieyAIClient({
            apiUrl: 'https://your-worker.workers.dev'
        });

        // Elements
        const chatDiv = document.getElementById('chat');
        const input = document.getElementById('input');
        const sendBtn = document.getElementById('send');

        // Send message
        async function sendMessage() {
            const message = input.value.trim();
            if (!message) return;

            // Display user message
            chatDiv.innerHTML += `<div>You: ${message}</div>`;
            input.value = '';

            try {
                // Get AI response
                const response = await client.chat(message);
                
                // Display AI response
                chatDiv.innerHTML += `<div>AI: ${response.response}</div>`;
            } catch (error) {
                chatDiv.innerHTML += `<div>Error: ${error.message}</div>`;
            }
        }

        // Event listeners
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
```

## Templates

The client supports four conversation templates:

1. **default** - General-purpose AI assistant
2. **customer_support** - Empathetic support agent
3. **sales** - Benefit-focused sales assistant
4. **technical** - Detailed technical troubleshooting

## Conversation History

The client automatically maintains conversation history when `keepHistory: true` is set (default). This allows for multi-turn conversations where the AI remembers context.

```javascript
// Start a conversation
await client.chat('Hi, my name is John');
// AI remembers this

await client.chat('What is my name?');
// AI will respond with "John" because it remembers the history

// Clear history to start fresh
client.clearHistory();
```

## Error Handling

Always wrap API calls in try-catch blocks:

```javascript
try {
    const response = await client.chat('Hello');
    console.log(response.response);
} catch (error) {
    console.error('Chat error:', error.message);
    // Handle error appropriately
}
```

## Browser Compatibility

This client library uses modern JavaScript features:
- `async`/`await`
- `fetch` API
- ES6 classes

Make sure your target browsers support these features, or use appropriate polyfills.

## Demo

Open `example.html` in a browser to see a fully-functional chat interface using the client library.

## Configuration

Before using the client, make sure to:

1. Update the `apiUrl` in your code to point to your deployed Cloudflare Worker
2. Ensure CORS is properly configured on your Worker (already handled in the Worker code)
3. Make sure your Worker has AI binding configured

## License

MIT
