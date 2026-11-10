// Shared functionality for both parent and iframe
class IframeCommunicator {
  constructor(options = {}) {
    this.isIframe = window !== window.parent;
    this.targetOrigin = options.targetOrigin || '*';
    this.messageHandlers = {};
    this.init();
  }
  
  init() {
    window.addEventListener('message', this.handleMessage.bind(this));
    
    if (this.isIframe) {
      // Iframe specific initialization
      this.sendToParent({ type: 'iframe_ready' });
    } else {
      // Parent specific initialization
      this.iframe = document.getElementById('iframeId');
    }
  }
  
  handleMessage(event) {
    // Security: Verify origin in production (commented for demo)
    // if (this.targetOrigin !== '*' && event.origin !== this.targetOrigin) return;
    
    const { data } = event;
    if (data && data.type && this.messageHandlers[data.type]) {
      this.messageHandlers[data.type](data);
    }
  }
  
  on(messageType, handler) {
    this.messageHandlers[messageType] = handler;
  }
  
  sendToParent(message) {
    if (this.isIframe) {
      window.parent.postMessage(message, this.targetOrigin);
    }
  }
  
  sendToIframe(message) {
    if (!this.isIframe && this.iframe) {
      this.iframe.contentWindow.postMessage(message, this.targetOrigin);
    }
  }
  
  // CSS manipulation methods (same-origin only)
  changeIframeStyles(styles) {
    if (!this.isIframe && this.iframe) {
      try {
        const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        Object.assign(iframeDoc.body.style, styles);
        return true;
      } catch (e) {
        console.error("Cannot modify iframe styles:", e);
        return false;
      }
    }
    return false;
  }
}

// Initialize based on context
const communicator = new IframeCommunicator({
  targetOrigin: window.location.origin // For production, set specific origin
});

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IframeCommunicator;
}