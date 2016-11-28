# Fire Sale

Demonstration application for the [Electron workshop][w] at [Node Interactive North America 2016][nina].

[nina]: http://events.linuxfoundation.org/events/node-interactive
[w]: http://sched.co/8H6W

---

## Follow-along

Show the `package.json` and highlight the following parts:

- `"main"`
- `"scripts"`

Let's get the "Open File" button working.

We can only trigger native OS-level APIs from the main process, but we can control the main process from the renderer process using the `remote` module.

```js
const { remote } = require('electron');
```

```js
openFileButton.addEventListener('click', () => {
  remote.dialog.showOpenDialog((files) => {
    console.log(files);
  });
});
```

Oh look, we see the file path in an array. Cool. Let's load it.

```js
const fs = require('fs');
```

That's right—it's a Node standard library module making an appearance in your browser code.

```js
openFileButton.addEventListener('click', () => {
  remote.dialog.showOpenDialog((files) => {
    fs.readFile(files[0], (err, content) => {
      if (err) { return console.error(err); }
      console.log(content.toString());
    });
  });
});
```

Now we can read the file.

```js
openFileButton.addEventListener('click', () => {
  remote.dialog.showOpenDialog((files) => {
    fs.readFile(files[0], (err, content) => {
      if (err) { return console.error(err); }
      loadContent(content.toString());
    });
  });
});
```

If the user hits cancel, then `files` is `undefined`, so we should return early.

```js
openFileButton.addEventListener('click', () => {
  remote.dialog.showOpenDialog((files) => {
    if (!files) { return; }

    fs.readFile(files[0], (err, content) => {
      if (err) { return console.error(err); }
      loadContent(content.toString());
    });
  });
});
```

Let's also keep track of what file we're working with so that we can save it later if things change.

```js
let currentFile = null;
```

Okay, it's time to update the UI when we have a file.

```js
const updateCurrentFile = (file) => {
  currentFile = file;
  saveMarkdownButton.disabled = false;
};
```

```js
openFileButton.addEventListener('click', () => {
  remote.dialog.showOpenDialog((files) => {
    if (!files) { return; }

    const file = files[0];

    fs.readFile(file, (err, content) => {
      if (err) { return console.error(err); }

      currentFile = file;

      loadContent(content.toString());
      updateCurrentFile(file);
    });
  });
});
```

Can we make this more better?

```js
openFileButton.addEventListener('click', () => {
  remote.dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'text'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
  }, (files) => {
    if (!files) { return; }

    const file = files[0];

    fs.readFile(file, (err, content) => {
      if (err) { return console.error(err); }

      currentFile = file;

      loadContent(content.toString());
      updateCurrentFile(file);
    });
  });
});
```

Now, how can we interact with the UI in new and unconventional ways?

```js
const currentWindow = remote.getCurrentWindow();
```

```js
const updateCurrentFile = (file) => {
  currentFile = file;

  currentWindow.setTitle(file);

  saveMarkdownButton.disabled = false;
};
```

This next one is Mac-only.

```js
const updateCurrentFile = (file) => {
  currentFile = file;

  currentWindow.setTitle(file);
  currentWindow.setRepresentedFilename(file);

  saveMarkdownButton.disabled = false;
};
```

Let's save the current file.

```js
saveMarkdownButton.addEventListener('click', () => {
  fs.writeFile(currentFile, markdownView.value);
});
```

Triggering the native file system is easy too.

```js
const { remote, shell } = require('electron');
```

```js
showFileButton.addEventListener('click', () => {
  shell.showItemInFolder(currentFile);
});

openInDefaultButton.addEventListener('click', () => {
  shell.openItem(currentFile);
});
```

Let's bring it all together with our last trick.

```js
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
```
