/**
 * Chat Module - Handles chat functionality
 * Manages message rendering, API calls, and real-time UI updates
 */

// Chat state
const chatState = {
  conversationHistory: [],
  currentTemplate: 'default',
  isLoading: false
};

// API Configuration
const API_BASE_URL = window.location.origin;

/**
 * Add a message to the chat display
 * @param {string} content - Message content
 * @param {string} role - Message role (user, assistant, system)
 */
function addMessageToChat(content, role = 'assistant') {
  const messagesContainer = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = content;
  
  messageDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(messageDiv);
  
  // Scroll to bottom smoothly
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Show loading indicator in chat
 */
function showLoadingIndicator() {
  const messagesContainer = document.getElementById('chat-messages');
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'chat-message assistant';
  loadingDiv.id = 'loading-indicator';
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble message-loading';
  bubbleDiv.innerHTML = `
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
    <div class="loading-dot"></div>
  `;
  
  loadingDiv.appendChild(bubbleDiv);
  messagesContainer.appendChild(loadingDiv);
  
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Remove loading indicator from chat
 */
function removeLoadingIndicator() {
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

/**
 * Send message to the API
 * @param {string} message - User message
 * @returns {Promise<Object>} API response
 */
async function sendMessageToAPI(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        template: chatState.currentTemplate,
        conversationHistory: chatState.conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Fetch greeting message for current template
 * @returns {Promise<string>} Greeting message
 */
async function fetchGreeting() {
  try {
    const response = await fetch(`${API_BASE_URL}/greeting?template=${chatState.currentTemplate}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.greeting;
  } catch (error) {
    console.error('Error fetching greeting:', error);
    return 'Hello! How can I assist you today?';
  }
}

/**
 * Handle sending a message
 * @param {string} message - User message
 */
async function handleSendMessage(message) {
  if (!message.trim() || chatState.isLoading) {
    return;
  }

  // Set loading state
  chatState.isLoading = true;
  
  // Add user message to chat
  addMessageToChat(message, 'user');
  
  // Add to conversation history
  chatState.conversationHistory.push({
    role: 'user',
    content: message
  });
  
  // Show loading indicator
  showLoadingIndicator();
  
  try {
    // Send to API
    const response = await sendMessageToAPI(message);
    
    // Remove loading indicator
    removeLoadingIndicator();
    
    // Add assistant response
    addMessageToChat(response.response, 'assistant');
    
    // Add to conversation history
    chatState.conversationHistory.push({
      role: 'assistant',
      content: response.response
    });
  } catch (error) {
    // Remove loading indicator
    removeLoadingIndicator();
    
    // Show error message
    addMessageToChat(
      'Sorry, I encountered an error. Please try again.',
      'system'
    );
  } finally {
    // Reset loading state
    chatState.isLoading = false;
  }
}

/**
 * Clear chat messages
 */
function clearChat() {
  const messagesContainer = document.getElementById('chat-messages');
  messagesContainer.innerHTML = '';
  chatState.conversationHistory = [];
}

/**
 * Initialize chat with greeting message
 */
async function initializeChat() {
  clearChat();
  
  // Show loading briefly
  showLoadingIndicator();
  
  // Fetch and display greeting
  const greeting = await fetchGreeting();
  removeLoadingIndicator();
  addMessageToChat(greeting, 'assistant');
}

/**
 * Change template and reinitialize chat
 * @param {string} template - Template name
 */
async function changeTemplate(template) {
  chatState.currentTemplate = template;
  await initializeChat();
  
  // Show system message about template change
  const templateNames = {
    'default': 'General Assistant',
    'customer_support': 'Customer Support',
    'sales': 'Sales Assistant',
    'technical': 'Technical Support'
  };
  
  addMessageToChat(
    `Switched to ${templateNames[template] || template} mode`,
    'system'
  );
}

// Export functions for use in app.js
window.chatModule = {
  handleSendMessage,
  changeTemplate,
  initializeChat,
  chatState
};
