const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow();

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

const openFile = exports.openFile = () => {
  const files = dialog.showOpenDialog({
    title: 'Open File',
    properties: [ 'openFile' ],
    filters: [
      {name: 'Text Files', extensions: ['txt', 'text']},
      {name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown']},
    ]
  });

  if (!files) { return; }

  const file = files[0];
  const content = fs.readFileSync(files[0]).toString();

  mainWindow.webContents.send('file-opened', file, content);
};

const saveMarkdown = exports.saveMarkdown = (file, markdown) => {
  file = file || dialog.showSaveDialog({
    title: 'Save File',
    defaultPath: app.getPath('desktop'),
    buttonLabel: '😎',
    filters: [
      {name: 'Markdown Files', extensions: ['md', 'markdown']},
    ]
  });

  if (!file) { return; }

  fs.writeFileSync(file, markdown);
  mainWindow.webContents.send('file-opened', file, markdown);
};

const saveHtml = exports.saveHtml = (html) => {
  const file = dialog.showSaveDialog({
    title: 'Save File',
    defaultPath: app.getPath('desktop'),
    buttonLabel: '😎',
    filters: [
      {name: 'HTML Files', extensions: ['html']},
    ]
  });

  if (!file) { return; }

  fs.writeFileSync(file, html);
};
