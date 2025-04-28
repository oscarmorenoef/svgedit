import { envSvgUrl } from './utils/envSvgUrl.js';
import { showMessage } from './utils/dom/showMessage.js';

/**
 * saves the svg
 * @param {Editor} svgEditor 
 */
export async function saveSvg(svgEditor) {
  const request = await requestSvgComments()
  if(!request) return;

  const svgCanvas = svgEditor.svgCanvas;
  const saveOpts = {
    images: svgEditor.configObj.pref('img_save'),
    round_digits: 2
  }
  // remove the selected outline before serializing
  svgCanvas.clearSelection()
  // Update save options if provided
  if (saveOpts) {
    const saveOptions = svgCanvas.mergeDeep(svgCanvas.getSvgOption(), saveOpts)
    for (const [key, value] of Object.entries(saveOptions)) {
      svgCanvas.setSvgOption(key, value)
    }
  }
  svgCanvas.setSvgOption('apply', true)

  // no need for doctype, see https://jwatt.org/svg/authoring/#doctype-declaration
  const svg = '<?xml version="1.0"?>\n' + svgCanvas.svgCanvasToString()
  const b64Data = svgCanvas.encode64(svg)

  console.log(b64Data)
  console.log(request.comments)

  await uploadSvg({
    comments: request.comments,
    svgInBase64: b64Data
  })
}

async function requestSvgComments() {
  const dialogContainer = document.createElement('div');
  dialogContainer.classList.add('uxmal-dialog-container');
  dialogContainer.innerHTML = `
    <div role="dialog" class="uxmal-dialog-comments">
      <label for="comments">Comments</label>
      <textarea id="comments" name="comments" placeholder="Write comments for the font changes" ></textarea>
      <div class="buttons-container">
        <button id="cancel-button">Cancel</button>
        <button id="save-button">Save</button>
      </div>
    </div>
  `

  const saveButton = dialogContainer.querySelector('#save-button');
  const cancelButton = dialogContainer.querySelector('#cancel-button');
  document.body.appendChild(dialogContainer);

  return new Promise((resolve) => {
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(dialogContainer);
      resolve()
    })
    saveButton.addEventListener('click', () => {
      document.body.removeChild(dialogContainer);
      const commentsInput = dialogContainer.querySelector('#comments');
      resolve({
        comments: commentsInput.value
      })
    })
  })
}
  
/**
 * Uploads the SVG to the URL
 * @param {blob} svgBlob 
 */
async function uploadSvg(request) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const svgId = params.get('id')

  const removeUploadingMessage = showMessage({ 
    message: 'Uploading SVG...',
    loading: true,
    inDialog: true
  });

  try{ 
    await fetch(`${envSvgUrl()}/123`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    removeUploadingMessage();
  } catch(e) {
    removeUploadingMessage();
    showMessage({ message: 'Failed to save SVG', minimumDuration: 1000, inDialog: true })();
  }
}