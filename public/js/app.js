/**
 * Main Application Logic
 * Initializes the application and handles UI interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Abbiey AI initialized');
  
  initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
  // Initialize chat
  if (window.chatModule) {
    window.chatModule.initializeChat();
  }
  
  // Set up event listeners
  setupEventListeners();
  
  // Set up smooth scrolling for navigation
  setupSmoothScrolling();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Chat form submission
  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }
  
  // Template selector
  const templateSelect = document.getElementById('template-select');
  if (templateSelect) {
    templateSelect.addEventListener('change', handleTemplateChange);
  }
  
  // Allow Enter key to send message (without Shift)
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  }
}

/**
 * Handle chat form submission
 * @param {Event} event - Submit event
 */
function handleChatSubmit(event) {
  event.preventDefault();
  
  const chatInput = document.getElementById('chat-input');
  const message = chatInput.value.trim();
  
  if (!message) {
    return;
  }
  
  // Send message via chat module
  if (window.chatModule) {
    window.chatModule.handleSendMessage(message);
  }
  
  // Clear input
  chatInput.value = '';
  
  // Disable submit button temporarily to prevent spam
  const submitButton = event.target.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
    setTimeout(() => {
      submitButton.disabled = false;
      chatInput.focus();
    }, 500);
  }
}

/**
 * Handle template selection change
 * @param {Event} event - Change event
 */
function handleTemplateChange(event) {
  const template = event.target.value;
  
  if (window.chatModule) {
    window.chatModule.changeTemplate(template);
  }
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') {
        return;
      }
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Check API health status
 * @returns {Promise<boolean>} Health status
 */
async function checkAPIHealth() {
  try {
    const response = await fetch('/health');
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

/**
 * Display error notification
 * @param {string} message - Error message to display
 */
function showErrorNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification error';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f56565;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

/**
 * Display success notification
 * @param {string} message - Success message to display
 */
function showSuccessNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification success';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #48bb78;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add notification animations to document
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Check API health on load
checkAPIHealth().then(isHealthy => {
  if (!isHealthy) {
    console.warn('API health check failed - some features may not work');
  }
});

// Export utility functions
window.appUtils = {
  showErrorNotification,
  showSuccessNotification,
  checkAPIHealth
};
