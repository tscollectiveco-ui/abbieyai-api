import { getTemplate, ChatTemplate } from './templates';

/**
 * Environment bindings for Cloudflare Workers
 */
interface Env {
  AI: any; // Cloudflare AI binding
}

/**
 * Request body structure for chat messages
 */
interface ChatRequest {
  message: string;
  template?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

/**
 * Response structure for chat API
 */
interface ChatResponse {
  response: string;
  template: string;
  timestamp: string;
}

/**
 * CORS headers for API responses
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Handle CORS preflight requests
 */
function handleOptions(): Response {
  return new Response(null, {
    headers: corsHeaders,
  });
}

/**
 * Generate AI response using Cloudflare AI
 */
async function generateAIResponse(
  ai: any,
  message: string,
  template: ChatTemplate,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    // Build messages array with system prompt and conversation history
    const messages = [
      { role: 'system', content: template.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Use Cloudflare AI to generate response
    // @ts-ignore - Cloudflare AI binding types
    const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: messages,
    });

    return response.response || template.fallbackResponse;
  } catch (error) {
    console.error('AI generation error:', error);
    return template.fallbackResponse;
  }
}

/**
 * Handle chat requests
 */
async function handleChat(request: Request, env: Env): Promise<Response> {
  try {
    // Parse request body
    const body: ChatRequest = await request.json();
    
    if (!body.message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Get template
    const template = getTemplate(body.template);
    
    // Generate AI response
    const aiResponse = await generateAIResponse(
      env.AI,
      body.message,
      template,
      body.conversationHistory || []
    );

    // Prepare response
    const response: ChatResponse = {
      response: aiResponse,
      template: body.template || 'default',
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Chat handler error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
}

/**
 * Get greeting message for a template
 */
function handleGreeting(request: Request): Response {
  const url = new URL(request.url);
  const templateName = url.searchParams.get('template') || 'default';
  const template = getTemplate(templateName);

  return new Response(
    JSON.stringify({
      greeting: template.greeting,
      template: templateName,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  );
}

/**
 * List available templates
 */
function handleTemplates(): Response {
  const templateList = Object.keys(getTemplate('default')).length > 0 
    ? ['default', 'customer_support', 'sales', 'technical']
    : [];

  return new Response(
    JSON.stringify({
      templates: templateList,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  );
}

/**
 * Main worker entry point
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Route handling
    if (path === '/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }

    if (path === '/greeting' && request.method === 'GET') {
      return handleGreeting(request);
    }

    if (path === '/templates' && request.method === 'GET') {
      return handleTemplates();
    }

    if (path === '/' || path === '/health') {
      return new Response(
        JSON.stringify({
          status: 'healthy',
          message: 'Abbiey AI Chatbot API',
          version: '1.0.0',
          endpoints: {
            chat: 'POST /chat',
            greeting: 'GET /greeting?template=<template_name>',
            templates: 'GET /templates',
          },
        }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // 404 for unknown routes
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  },
};
