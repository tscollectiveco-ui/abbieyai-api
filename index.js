/**
 * Abbiey AI Chatbot Client
 * A JavaScript client library for connecting to the Cloudflare Worker API
 */

class AbbieyAIClient {
  /**
   * Initialize the Abbiey AI client
   * @param {Object} options - Configuration options
   * @param {string} options.apiUrl - The base URL of the Cloudflare Worker API
   */
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || 'https://abbieyai-api.workers.dev';
    this.conversationHistory = [];
  }

  /**
   * Make a request to the API
   * @private
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   */
  async _request(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Re-throw the error for consumers to handle
      throw error;
    }
  }

  /**
   * Check API health status
   * @returns {Promise<Object>} Health status response
   */
  async health() {
    return this._request('/health');
  }

  /**
   * Send a chat message and get AI response
   * @param {string} message - The message to send
   * @param {Object} options - Chat options
   * @param {string} options.template - Template to use (default, customer_support, sales, technical)
   * @param {boolean} options.keepHistory - Whether to maintain conversation history (default: true)
   * @returns {Promise<Object>} AI response
   */
  async chat(message, options = {}) {
    const { template = 'default', keepHistory = true } = options;

    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string');
    }

    const requestBody = {
      message,
      template,
      conversationHistory: keepHistory ? this.conversationHistory : [],
    };

    const response = await this._request('/chat', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    // Update conversation history if keeping history
    if (keepHistory) {
      this.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: response.response }
      );
    }

    return response;
  }

  /**
   * Get a greeting message for a specific template
   * @param {string} template - Template name (default, customer_support, sales, technical)
   * @returns {Promise<Object>} Greeting response
   */
  async greeting(template = 'default') {
    return this._request(`/greeting?template=${encodeURIComponent(template)}`);
  }

  /**
   * Get list of available templates
   * @returns {Promise<Object>} Templates response
   */
  async templates() {
    return this._request('/templates');
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get current conversation history
   * @returns {Array} Current conversation history
   */
  getHistory() {
    return [...this.conversationHistory];
  }

  /**
   * Set conversation history
   * @param {Array} history - Conversation history to set
   */
  setHistory(history) {
    if (!Array.isArray(history)) {
      throw new Error('History must be an array');
    }
    this.conversationHistory = [...history];
  }
}

// Export for different module systems
// ES6 default export (primary)
export default AbbieyAIClient;

// Browser global
if (typeof window !== 'undefined') {
  window.AbbieyAIClient = AbbieyAIClient;
}
