import { wait } from './utils/wait.js';
import { saveSvg } from './save-svg.js';
import { loadSvg } from './load-svg.js';

/**
 * 
 * @param {svgEditor} svgEditor 
 */
export default async function setUpSvgEdit(svgEditor){
  await Promise.allSettled([
    removeTools(),
    replaceSaveToolButton(svgEditor),
    loadSvg(svgEditor),
  ])
}

async function removeTools() {
  await wait(500);
  await customElements.whenDefined('se-menu');

  const uxmalTools = ['tool_editor_prefs', 'tool_save']

  const toolsMenu = document.querySelector('#main_button');
  toolsMenu.querySelectorAll('se-menu-item').forEach(tool => {
    if(uxmalTools.includes(tool.getAttribute('id'))) return;
    toolsMenu.removeChild(tool);
  })
}

async function replaceSaveToolButton(svgEditor) {
  await wait(500);
  await customElements.whenDefined('se-menu');

  const uxmalTools = ['tool_save'];

  const toolsMenu = document.querySelector('#main_button');
  toolsMenu.querySelectorAll('se-menu-item').forEach(tool => {
    if(!uxmalTools.includes(tool.getAttribute('id'))) return;

    const newTool = document.createElement('div');
    newTool.classList.add('uxmal-tool');
    newTool.innerHTML = `
      <img src="./images/saveImg.svg" alt="icon" />
      <span>Save SVG</span>
    `
    newTool.addEventListener('click', () => saveSvg(svgEditor))
    toolsMenu.replaceChild(newTool, tool);
  })
}