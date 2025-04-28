/**
 * Shows a message centered in the screen
 * @param {Message} message 
 * @returns {function} The function to remove the message
 */
export function showMessage(message) {
  const triggeredAt = Date.now();

  const loadingContainer = document.createElement('div');
  loadingContainer.classList.add('loading-container');
  loadingContainer.setAttribute('data-loader-in-dialog', !!message.inDialog);
  loadingContainer.appendChild(createMessageContent(message));
  document.body.appendChild(loadingContainer);

  return () => {
    return new Promise((resolve) => {
      const now = Date.now();
      if(now - triggeredAt < message.minimumDuration) {
        setTimeout(() => {
          document.body.removeChild(loadingContainer);
          resolve();
        }, message.minimumDuration - (now - triggeredAt));
        return;
      }
      document.body.removeChild(loadingContainer);
      resolve()
    })
    
  }
}

/**
 * Creates the message content
 * @param {Message} message
 * @returns {HTMLElement} The message element
 */
function createMessageContent(message){
  const messageContent = document.createElement('template');
  let messageContainer = messageContent

  if(message.inDialog) {
    const dialogContainer = document.createElement('div');
    const dialog = document.createElement('div');
    dialog.role = 'dialog';
    dialog.classList.add('loading-content')
    dialogContainer.classList.add('uxmal-dialog-container');
    dialogContainer.appendChild(dialog);
    messageContent.content.appendChild(dialogContainer);
    messageContainer = dialog
  }

  messageContainer.innerHTML = `
    <div class="loading">
      ${message.loading ? '<span class="loader"></span>' : ''}
      ${message.message}
    </div>   
  `;

  return messageContent.content.cloneNode(true);
}

/**
 * @typedef {object} Message
 * @property {string} message - The message to be displayed
 * @property {number} minimumDuration - The minimum duration to display the message
 * @property {boolean} [loading] - Shows a loading indicator
 * @property {boolean} [inDialog] - Shows the message inside a dialog
 */