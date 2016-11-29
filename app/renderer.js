const { remote, shell } = require('electron');
const fs = require('fs');

const marked = require('marked');

const currentWindow = remote.getCurrentWindow();
let currentFile = null;

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
  remote.dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  },
  (files) => {
    if (!files) { return; }

    const file = files[0];

    fs.readFile(file, (err, content) => {
      if (err) { return console.error(err); }

      loadContent(content.toString());
      updateCurrentFile(file);
    });
  });
});

saveMarkdownButton.addEventListener('click', () => {
  fs.writeFile(currentFile, markdownView.value);
});

const updateCurrentFile = (file) => {
  currentFile = file;

  currentWindow.setTitle(file);
  currentWindow.setRepresentedFilename(file);

  saveMarkdownButton.disabled = false;
  showFileButton.disabled = false;
  openInDefaultButton.disabled = false;
};

showFileButton.addEventListener('click', () => {
  shell.showItemInFolder(currentFile);
});

openInDefaultButton.addEventListener('click', () => {
  shell.openItem(currentFile);
});

saveHtmlButton.addEventListener('click', () => {
  remote.dialog.showSaveDialog({
    title: 'Save Markdown',
    defaultPath: remote.app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  }, (file) => {
    if (!file) { return; }

    fs.writeFile(file, htmlView.innerHTML, (err) => {
      if (err) { return console.error(err); }
      shell.showItemInFolder(file);
    });
  });
});
