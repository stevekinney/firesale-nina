const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

app.on('ready', () => {
  createWindow();
});

const createWindow = () => {
  let win = new BrowserWindow({ show: false });

  windows.add(win);
  
  win.loadURL(`file://${__dirname}/index.html`);
  
  win.once('ready-to-show', () => win.show());
  
  win.on('closed', () => {
    windows.delete(win);
    win = null;
  });
  
  return win;
}

const selectFile = exports.selectFile = (win) => {
  const files = dialog.showOpenDialog(win, {
    title: 'Open File',
    properties: [ 'openFile' ],
    filters: [
      {name: 'Text Files', extensions: ['txt', 'text']},
      {name: 'Markdown Files', extensions: ['md', 'mdown', 'markdown']},
    ]
  });

  if (!files) { return; }
  
  openFile(win, files[0]);
}

const openFile = exports.openFile = (win, file) => {
  const content = fs.readFileSync(file).toString();
  win.webContents.send('file-opened', file, content);
};

const saveMarkdown = exports.saveMarkdown = (win, file, markdown) => {
  file = file || dialog.showSaveDialog(win, {
    title: 'Save File',
    defaultPath: app.getPath('desktop'),
    buttonLabel: '😎',
    filters: [
      {name: 'Markdown Files', extensions: ['md', 'markdown']},
    ]
  });

  if (!file) { return; }

  fs.writeFileSync(file, markdown);
  win.webContents.send('file-opened', file, markdown);
};

const saveHtml = exports.saveHtml = (win, html) => {
  const file = dialog.showSaveDialog(win, {
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
