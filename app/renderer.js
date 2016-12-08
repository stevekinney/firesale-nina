const { ipcRenderer, remote } = require('electron');
const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
const marked = require('marked');

let currentFile = null;
let originalContent = '';

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = (markdown) => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

const loadContent = (file, content) => {
  currentFile = file;
  originalContent = content;
  markdownView.value = content;
  renderMarkdownToHtml(content);
  updateUserInterface(content);
};

const updateUserInterface = (content) => {
  const isChanged = content !== originalContent;

  currentWindow.setDocumentEdited(isChanged);
  saveMarkdownButton.disabled = !isChanged;

  let title = 'Fire Sale';

  if (currentFile) { title = currentFile; }
  if (isChanged) { title += ' (Edited)'; }

  currentWindow.setTitle(title);
};

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
  updateUserInterface(currentContent);
});

openFileButton.addEventListener('click', () => {
  mainProcess.selectFile(currentWindow);
});

saveMarkdownButton.addEventListener('click', () => {
  mainProcess.saveMarkdown(currentWindow, currentFile, markdownView.value);
});

saveHtmlButton.addEventListener('click', () => {
  mainProcess.saveHtml(currentWindow, htmlView.innerHTML);
});

ipcRenderer.on('file-opened', (event, file, content) => {
  loadContent(file, content);
  currentWindow.setRepresentedFilename(file);
  remote.app.addRecentDocument(file);
});
