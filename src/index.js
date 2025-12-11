// -----------------------------------------------------------------------------
// Internal helpers
// -----------------------------------------------------------------------------
const __defProp = Object.defineProperty;
function __name(target, value) {
  return __defProp(target, "name", { value, configurable: true });
}

// -----------------------------------------------------------------------------
// Templates
// -----------------------------------------------------------------------------
const templates = {
  default: {
    systemPrompt:
      "You are a helpful AI assistant. Respond clearly, concisely, and usefully.",
    greeting: "Hello! I'm your AI assistant. How can I help you today?",
    fallbackResponse:
      "I wasn't able to parse that. Could you rephrase your message?"
  },

  customer_support: {
    systemPrompt:
      "You are a customer support agent. Respond with empathy, clarity, and actionable solutions.",
    greeting:
      "Welcome to customer support. How can I help resolve your issue today?",
    fallbackResponse:
      "I may need more details to help you properly. Could you clarify?"
  },

  sales: {
    systemPrompt:
      "You are a sales assistant. Highlight benefits, ask clarifying questions, and guide users toward a decision.",
    greeting:
      "Hi! I'm here to help you find the perfect option. What are you searching for?",
    fallbackResponse:
      "I can help with that. Could you tell me a bit more about what you're interested in?"
  },

  technical: {
    systemPrompt:
      "You provide technical assistance. Be accurate, structured, and patient. Include clear troubleshooting steps.",
    greeting:
      "Hello! I'm your technical assistant. What issue can I help you troubleshoot?",
    fallbackResponse:
      "To assist properly, I need more technical detail. Can you describe the problem?"
  }
};

function getTemplate(name = "default") {
  return templates[name] || templates.default;
}
__name(getTemplate, "getTemplate");

// -----------------------------------------------------------------------------
// CORS
// -----------------------------------------------------------------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}
__name(handleOptions, "handleOptions");

// -----------------------------------------------------------------------------
// AI Engine
// -----------------------------------------------------------------------------
async function generateAIResponse(ai, message, template, history = []) {
  try {
    const messages = [
      { role: "system", content: template.systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
      messages
    });

    return response?.response ?? template.fallbackResponse;
  } catch (err) {
    console.error("AI generation error:", err);
    return template.fallbackResponse;
  }
}
__name(generateAIResponse, "generateAIResponse");

// -----------------------------------------------------------------------------
// Handlers
// -----------------------------------------------------------------------------
async function handleChat(request, env) {
  try {
    const body = await request.json().catch(() => null);

    if (!body?.message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const template = getTemplate(body.template);
    const aiResponse = await generateAIResponse(
      env.AI,
      body.message,
      template,
      body.conversationHistory || []
    );

    return new Response(
      JSON.stringify({
        response: aiResponse,
        template: body.template || "default",
        timestamp: new Date().toISOString()
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (err) {
    console.error("Chat handler error:", err);
    return new Response(
      JSON.stringify({ error: "Chat processing failed" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
}
__name(handleChat, "handleChat");

function handleGreeting(request) {
  const templateName = new URL(request.url).searchParams.get("template") || "default";
  const template = getTemplate(templateName);

  return new Response(
    JSON.stringify({
      greeting: template.greeting,
      template: templateName,
      timestamp: new Date().toISOString()
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}
__name(handleGreeting, "handleGreeting");

function handleTemplates() {
  return new Response(
    JSON.stringify({
      templates: Object.keys(templates),
      timestamp: new Date().toISOString()
    }),
    { headers: { "Content-Type": "application/json", ...corsHeaders } }
  );
}
__name(handleTemplates, "handleTemplates");

// -----------------------------------------------------------------------------
// Router
// -----------------------------------------------------------------------------
const router = {
  "/chat": { POST: handleChat },
  "/greeting": { GET: handleGreeting },
  "/templates": { GET: handleTemplates }
};

// -----------------------------------------------------------------------------
// Worker entry
// -----------------------------------------------------------------------------
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    if (method === "OPTIONS") return handleOptions();

    if (router[path] && router[path][method]) {
      return router[path][method](request, env);
    }

    if (path === "/" || path === "/health") {
      return new Response(
        JSON.stringify({
          status: "healthy",
          name: "Abbiey AI Chatbot API",
          version: "1.0.1",
          endpoints: {
            chat: "POST /chat",
            greeting: "GET /greeting?template=<name>",
            templates: "GET /templates"
          }
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};
