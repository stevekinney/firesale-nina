const { ipcRenderer, remote } = require('electron');
const mainProcess = remote.require('./main');
const marked = require('marked');

console.log(remote);

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

const loadContent = (content) => {
  markdownView.value = content;
  renderMarkdownToHtml(content);
};

markdownView.addEventListener('keyup', (event) => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
});

openFileButton.addEventListener('click', () => {
  mainProcess.openFile();
});

ipcRenderer.on('file-opened', (event, file, content) => {
  loadContent(content);
});
