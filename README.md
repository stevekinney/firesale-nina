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
  const file = remote.dialog.showOpenDialog();
  console.log(file);
});

```

Oh look, we see the file path in an array.


