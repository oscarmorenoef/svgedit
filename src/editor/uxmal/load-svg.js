
import { showMessage } from './utils/dom/showMessage.js';
import { envSvgUrl } from './utils/envSvgUrl.js';

/**
 * Loads the SVG from the URL
 * @param {Editor} svgEditor 
 */
export async function loadSvg(svgEditor) {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const svgId = params.get('id')

  const removeLoadingMessage = showMessage({ 
    message: 'Loading SVG...', 
    minimumDuration: 500, 
    loading: true
  });

  try {
    await svgEditor.loadFromURL(`${envSvgUrl()}/${svgId}`, { noAlert: true });
    removeLoadingMessage();
    const title = document.querySelector('#title_panel p');
    title.parentElement.removeChild(title);
  } catch(e) {
    await removeLoadingMessage();
    showMessage({ message: 'SVG not found' });
  } 
}