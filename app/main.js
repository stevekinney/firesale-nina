const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow();

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  openFile();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

const openFile = () => {
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
