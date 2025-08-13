/**
 * ChatBot Creator Widget
 * Embeddable chatbot widget for websites
 */

(function() {
  'use strict';

  // Default configuration
  const defaultConfig = {
    apiUrl: 'https://api.chatbotcreator.com',
    theme: 'light',
    position: 'bottom-right',
    primaryColor: '#6366f1',
    welcomeMessage: 'Hi! How can I help you today?',
    placeholder: 'Type your message...',
    title: 'Chat with us',
    subtitle: 'We typically reply instantly',
    showBranding: true
  };

  // Merge user config with defaults
  const config = Object.assign({}, defaultConfig, window.chatbotConfig || {});

  // Check if required config is provided
  if (!config.botId) {
    console.error('ChatBot Creator: botId is required in chatbotConfig');
    return;
  }

  // Prevent multiple widget initialization
  if (window.chatbotWidgetInitialized) {
    console.warn('ChatBot Creator: Widget already initialized');
    return;
  }
  window.chatbotWidgetInitialized = true;

  // Widget state
  let isOpen = false;
  let isMinimized = true;
  let messages = [];
  let sessionId = generateSessionId();

  // Create widget HTML
  function createWidget() {
    const widgetHTML = `
      <div id="chatbot-widget" class="chatbot-widget">
        <!-- Minimized State (Chat Button) -->
        <div id="chatbot-button" class="chatbot-button" onclick="toggleChatbot()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div class="chatbot-notification" id="chatbot-notification">1</div>
        </div>

        <!-- Expanded State (Chat Window) -->
        <div id="chatbot-window" class="chatbot-window">
          <!-- Header -->
          <div class="chatbot-header">
            <div class="chatbot-header-content">
              <div class="chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="m7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div class="chatbot-header-text">
                <div class="chatbot-title">${config.title}</div>
                <div class="chatbot-subtitle">${config.subtitle}</div>
              </div>
            </div>
            <button class="chatbot-close" onclick="toggleChatbot()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Messages -->
          <div class="chatbot-messages" id="chatbot-messages">
            <div class="chatbot-message chatbot-message-bot">
              <div class="chatbot-message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="m7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <div class="chatbot-message-content">${config.welcomeMessage}</div>
            </div>
          </div>

          <!-- Input -->
          <div class="chatbot-input-container">
            <div class="chatbot-input-wrapper">
              <input 
                type="text" 
                id="chatbot-input" 
                class="chatbot-input" 
                placeholder="${config.placeholder}"
                onkeypress="handleKeyPress(event)"
              />
              <button class="chatbot-send-button" onclick="sendMessage()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
              </button>
            </div>
            ${config.showBranding ? `
              <div class="chatbot-branding">
                Powered by <a href="https://chatbotcreator.com" target="_blank">ChatBot Creator</a>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Insert widget HTML
    document.body.insertAdjacentHTML('beforeend', widgetHTML);
  }

  // Create widget styles
  function createStyles() {
    const styles = `
      <style id="chatbot-widget-styles">
        .chatbot-widget {
          position: fixed;
          ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
          ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
          z-index: 1000000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chatbot-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${config.primaryColor};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          position: relative;
        }

        .chatbot-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .chatbot-notification {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .chatbot-window {
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
        }

        .chatbot-header {
          background: ${config.primaryColor};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chatbot-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatbot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-title {
          font-weight: 600;
          font-size: 16px;
        }

        .chatbot-subtitle {
          font-size: 12px;
          opacity: 0.8;
        }

        .chatbot-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .chatbot-close:hover {
          opacity: 1;
        }

        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f8fafc;
        }

        .chatbot-message {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          align-items: flex-start;
        }

        .chatbot-message-bot {
          flex-direction: row;
        }

        .chatbot-message-user {
          flex-direction: row-reverse;
        }

        .chatbot-message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${config.primaryColor};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chatbot-message-user .chatbot-message-avatar {
          background: #64748b;
        }

        .chatbot-message-content {
          background: white;
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 250px;
          font-size: 14px;
          line-height: 1.4;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .chatbot-message-user .chatbot-message-content {
          background: ${config.primaryColor};
          color: white;
        }

        .chatbot-input-container {
          padding: 16px;
          background: white;
          border-top: 1px solid #e2e8f0;
        }

        .chatbot-input-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .chatbot-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chatbot-input:focus {
          border-color: ${config.primaryColor};
        }

        .chatbot-send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${config.primaryColor};
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .chatbot-send-button:hover {
          background: ${adjustColor(config.primaryColor, -20)};
        }

        .chatbot-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chatbot-branding {
          text-align: center;
          margin-top: 8px;
          font-size: 11px;
          color: #64748b;
        }

        .chatbot-branding a {
          color: ${config.primaryColor};
          text-decoration: none;
        }

        .chatbot-typing {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
        }

        .chatbot-typing-dot {
          width: 6px;
          height: 6px;
          background: #94a3b8;
          border-radius: 50%;
          animation: chatbot-typing 1.4s infinite ease-in-out;
        }

        .chatbot-typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .chatbot-typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes chatbot-typing {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        @media (max-width: 480px) {
          .chatbot-widget {
            right: 10px !important;
            left: 10px !important;
            bottom: 10px !important;
          }
          
          .chatbot-window {
            width: calc(100vw - 20px);
            height: calc(100vh - 20px);
            max-height: 600px;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  // Utility functions
  function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
  }

  function adjustColor(color, amount) {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  }

  // Widget functions
  window.toggleChatbot = function() {
    const button = document.getElementById('chatbot-button');
    const window = document.getElementById('chatbot-window');
    const notification = document.getElementById('chatbot-notification');
    
    isOpen = !isOpen;
    
    if (isOpen) {
      button.style.display = 'none';
      window.style.display = 'flex';
      notification.style.display = 'none';
      document.getElementById('chatbot-input').focus();
    } else {
      button.style.display = 'flex';
      window.style.display = 'none';
    }
  };

  window.sendMessage = function() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Send to API
    sendToAPI(message);
  };

  window.handleKeyPress = function(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  function addMessage(content, type) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageHTML = `
      <div class="chatbot-message chatbot-message-${type}">
        <div class="chatbot-message-avatar">
          ${type === 'bot' ? `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="m7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          ` : `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          `}
        </div>
        <div class="chatbot-message-content">${content}</div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    messages.push({ content, type, timestamp: Date.now() });
  }

  function showTyping() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingHTML = `
      <div class="chatbot-message chatbot-message-bot" id="typing-indicator">
        <div class="chatbot-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="m7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="chatbot-message-content">
          <div class="chatbot-typing">
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
            <div class="chatbot-typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
      typing.remove();
    }
  }

  async function sendToAPI(message) {
    try {
      const response = await fetch(`${config.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: config.botId,
          message: message,
          sessionId: sessionId,
          timestamp: Date.now()
        })
      });

      const data = await response.json();
      
      hideTyping();
      
      if (data.success && data.response) {
        addMessage(data.response, 'bot');
      } else {
        addMessage("I'm sorry, I'm having trouble responding right now. Please try again later.", 'bot');
      }
    } catch (error) {
      console.error('ChatBot API Error:', error);
      hideTyping();
      addMessage("I'm sorry, I'm having trouble connecting. Please check your internet connection and try again.", 'bot');
    }
  }

  // Initialize widget when DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    createStyles();
    createWidget();
    
    // Auto-open after delay if configured
    if (config.autoOpen) {
      setTimeout(() => {
        if (!isOpen) {
          toggleChatbot();
        }
      }, config.autoOpenDelay || 3000);
    }

    console.log('ChatBot Creator widget initialized');
  }

  // Start initialization
  init();
})();
