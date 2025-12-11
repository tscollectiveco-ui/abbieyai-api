/**
 * Chatbot templates for different conversation types
 */
export interface ChatTemplate {
  systemPrompt: string;
  greeting: string;
  fallbackResponse: string;
}

export const templates: Record<string, ChatTemplate> = {
  default: {
    systemPrompt: "You are a helpful AI assistant. Provide clear, concise, and friendly responses.",
    greeting: "Hello! I'm your AI assistant. How can I help you today?",
    fallbackResponse: "I'm sorry, I didn't quite understand that. Could you please rephrase your question?"
  },
  
  customer_support: {
    systemPrompt: "You are a customer support agent. Be empathetic, professional, and solution-oriented. Help users resolve their issues efficiently.",
    greeting: "Welcome to customer support! I'm here to help resolve any issues you may have. How can I assist you?",
    fallbackResponse: "I apologize for any confusion. Let me try to help you better. Could you please provide more details about your issue?"
  },
  
  sales: {
    systemPrompt: "You are a sales assistant. Be enthusiastic, knowledgeable about products, and help users make informed purchasing decisions.",
    greeting: "Hi there! I'm here to help you find the perfect product. What are you looking for today?",
    fallbackResponse: "That's a great question! Let me provide you with more information. Could you tell me more about what you're interested in?"
  },
  
  technical: {
    systemPrompt: "You are a technical support specialist. Provide detailed, accurate technical information and troubleshooting steps. Use clear language and be patient.",
    greeting: "Hello! I'm your technical support assistant. What technical issue can I help you troubleshoot today?",
    fallbackResponse: "Let me help you with that technical issue. Could you provide more specific details about the problem you're experiencing?"
  }
};

export function getTemplate(templateName: string = 'default'): ChatTemplate {
  return templates[templateName] || templates.default;
}
