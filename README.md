# BlogPad

> A lightweight, dependency-free WYSIWYG editor. Drop it into any page with 2 lines of code. No license fee. No premium tier. Forever free.

🔗 **[▶ Try Live Demo](https://shamserchand1.github.io/blogpad/)**

[![GitHub stars](https://img.shields.io/github/stars/shamserchand1/blogpad?style=social)](https://github.com/shamserchand1/blogpad/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsDelivr](https://img.shields.io/jsdelivr/gh/hm/shamserchand1/blogpad)](https://www.jsdelivr.com/package/gh/shamserchand1/blogpad)

---

## Why BlogPad?

CKEditor 5 and other premium editors charge for features that a basic blog actually needs.

**BlogPad** provides the core editing experience — free, open-source, self-hostable, and dependency-free.

| Feature | **BlogPad** | CKEditor 5 (Free) | CKEditor 5 (Premium) |
|:---|:---:|:---:|:---:|
| Rich text editing | ✅ | ✅ | ✅ |
| Image resize & drag | ✅ | ✅ | ✅ |
| Image caption & alt text | ✅ | ✅ | ✅ |
| Tables with merge / split | ✅ | ✅ | ✅ |
| Source code view | ✅ | ✅ | ✅ |
| Custom modals | ✅ | ❌ | ✅ |
| Mobile & touch friendly | ✅ | ✅ | ✅ |
| Word count + read time | ✅ | ❌ | ✅ |
| Blog blocks | ✅ | ❌ | ✅ |
| Zero dependencies | ✅ | ❌ | ❌ |
| Self-hosted | ✅ | ✅ | ✅ |
| Price | **Free forever** | Free | Premium |
| Bundle size | **~50 KB** | ~200 KB | ~200 KB+ |

> **Note:** Feature availability and pricing of third-party editors can change. Check their official documentation for current details.

---

# Quick Start

Get BlogPad working in **3 simple steps**.

No build tools.  
No npm.  
No bundler.  
No configuration.

## Step 1 — Add the CDN Script

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
```

## Step 2 — Add a Textarea

```html
<textarea id="content" name="content"></textarea>
```

## Step 3 — Initialize BlogPad

```html
<script>
  var editor = BlogPad.init('#content', {
    height: 700,
    placeholder: 'Start writing…',
    autosaveKey: 'my-blog-draft'
  });

  document.querySelector('form').addEventListener('submit', function () {
    document.getElementById('content').value = editor.getContent();
  });
</script>
```

That's it.

Your backend receives the editor's HTML through the `content` field just like a normal `<textarea>`.

---

# Complete Working Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Blog Editor</title>
</head>

<body>

  <h1>New Post</h1>

  <form action="/save" method="POST">

    <textarea
      id="content"
      name="content"
    ></textarea>

    <button type="submit">Publish</button>

  </form>

  <script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>

  <script>
    var editor = BlogPad.init('#content', {
      height: 700,
      placeholder: 'Start writing… (try "/" for commands)',
      autosaveKey: 'my-blog-draft'
    });

    document.querySelector('form').addEventListener('submit', function () {
      document.getElementById('content').value = editor.getContent();
    });
  </script>

</body>
</html>
```

---

# Installation Options

## Option 1 — CDN

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
```

### Latest Version

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad/blogpad.js"></script>
```

### Production Version

For production websites, use a specific version:

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
```

Pinning the version prevents your production site from unexpectedly changing when a new release is published.

## Option 2 — Download

Download `blogpad.js` from this repository and host it yourself:

```html
<script src="/path/to/blogpad.js"></script>
```

No build tools are required.

---

# API Reference

## `BlogPad.init(target, options)`

Initializes BlogPad on a `<textarea>` or container element.

### Parameters

| Parameter | Type | Default | Description |
|:---|:---|:---|:---|
| `target` | `string \| HTMLElement` | — | CSS selector or DOM element |
| `options` | `object` | `{}` | Editor configuration |

### Example

```javascript
var editor = BlogPad.init('#content', {
  height: 740,
  placeholder: 'Type your text here…',
  initialContent: '<p>Hello BlogPad!</p>',
  autosaveKey: 'my-blog-draft'
});
```

---

# Configuration Options

| Option | Type | Default | Description |
|:---|:---|:---|:---|
| `height` | `number` | `740` | Editor height in pixels |
| `placeholder` | `string` | `Type your text here…` | Placeholder text |
| `initialContent` | `string` | `''` | Initial HTML content |
| `autosaveKey` | `string` | `null` | LocalStorage key for auto-save |
| `showStatus` | `boolean` | `true` | Show editor status/footer |
| `onChange` | `function` | `null` | Called whenever content changes |
| `onReady` | `function` | `null` | Called when editor is ready |
| `onPublish` | `function` | `null` | Called when publish action is triggered |

---

# Editor API

```javascript
var editor = BlogPad.init('#content');
```

| Method | Description |
|:---|:---|
| `editor.getContent()` | Returns HTML string |
| `editor.setContent(html)` | Sets HTML content |
| `editor.getText()` | Returns plain text |
| `editor.isEmpty()` | Returns `true` if editor is empty |
| `editor.clear()` | Clears editor content |
| `editor.focus()` | Focuses the editor |
| `editor.blur()` | Removes focus |
| `editor.save()` | Forces save operation |
| `editor.toggleFullscreen()` | Toggles fullscreen mode |
| `editor.openLinkModal()` | Opens link dialog |
| `editor.openTableModal()` | Opens table dialog |
| `editor.on('change', fn)` | Subscribes to change events |
| `editor.destroy()` | Destroys editor and restores original element |

---

# Events

## Change Event

```javascript
editor.on('change', function (html) {
  console.log('Content changed:', html);
});
```

## Ready Callback

```javascript
var editor = BlogPad.init('#content', {
  onReady: function (editor) {
    console.log('BlogPad is ready');
  }
});
```

## Change Callback

```javascript
var editor = BlogPad.init('#content', {
  onChange: function (html) {
    console.log('New content:', html);
  }
});
```

---

# Features

## Editor

- Two-row CKEditor-style toolbar
- Bold
- Italic
- Underline
- Strikethrough
- Superscript
- Subscript
- Inline code
- Headings H1–H4
- Paragraph
- Blockquote
- Code block
- Bulleted lists
- Numbered lists
- Indent / outdent
- Text alignment
- Font family
- Font size
- Text color
- Text highlight
- Custom color palette
- Clear formatting

## Insert Tools

### Links

- Link text
- URL
- Open in new tab
- Link attributes

### Images

- Image insertion
- Image resizing
- Dragging
- Alignment
- Caption
- Alt text
- Image replacement

### Tables

- Create tables
- Add rows
- Add columns
- Delete rows
- Delete columns
- Merge cells
- Split cells
- Header row
- Table editing

### Blog Blocks

- Callout
- Key takeaway
- Divider
- Highlighted information

### Table of Contents

BlogPad can automatically generate a table of contents from article headings.

---

# User Experience

- Custom modals
- No browser `alert()`
- No browser `prompt()`
- Auto-save
- Word count
- Character count
- Reading time
- Source code view
- Fullscreen mode
- Keyboard shortcuts
- Mobile support
- Touch-friendly controls
- Responsive interface
- Zero external dependencies

---

# Auto-Save

BlogPad can save drafts locally using `localStorage`.

```javascript
var editor = BlogPad.init('#content', {
  autosaveKey: 'my-blog-draft'
});
```

For individual posts:

```javascript
var editor = BlogPad.init('#content', {
  autosaveKey: 'post-123-draft'
});
```

---

# Getting Content

```javascript
var html = editor.getContent();
```

---

# Setting Content

```javascript
editor.setContent('<h2>Hello World</h2><p>This is my article.</p>');
```

---

# Getting Plain Text

```javascript
var text = editor.getText();
```

Useful for search indexing, character limits, excerpts, and reading statistics.

---

# Checking Empty Content

```javascript
if (editor.isEmpty()) {
  console.log('Editor is empty');
}
```

---

# Clearing Content

```javascript
editor.clear();
```

---

# Focus Editor

```javascript
editor.focus();
```

---

# Fullscreen

```javascript
editor.toggleFullscreen();
```

---

# Backend Integration

BlogPad outputs normal HTML.

Your backend receives it just like a normal `<textarea>`.

> **Security:** Never trust HTML coming from the browser. Always sanitize HTML on your server before storing or rendering it.

---

# PHP Example

```php
<?php

$content = $_POST['content'] ?? '';

$allowed =
    '<p><br><b><strong><i><em><u><s>'
    . '<h1><h2><h3><h4>'
    . '<ul><ol><li>'
    . '<blockquote>'
    . '<pre><code>'
    . '<a>'
    . '<img>'
    . '<figure><figcaption>'
    . '<table><thead><tbody><tfoot>'
    . '<tr><td><th>'
    . '<hr>'
    . '<div><span>';

$clean = strip_tags($content, $allowed);

// Example:
//
// $stmt = $pdo->prepare(
//     "INSERT INTO posts (content) VALUES (?)"
// );
//
// $stmt->execute([$clean]);
```

> For production applications, use a proper HTML sanitizer rather than relying only on `strip_tags()`.

---

# Node.js / Express Example

Install a sanitizer:

```bash
npm install sanitize-html
```

Then:

```javascript
const sanitizeHtml = require('sanitize-html');

app.post('/save', (req, res) => {

  const clean = sanitizeHtml(req.body.content, {

    allowedTags: [
      'p',
      'br',
      'b',
      'strong',
      'i',
      'em',
      'u',
      's',
      'h1',
      'h2',
      'h3',
      'h4',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'a',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tfoot',
      'tr',
      'td',
      'th',
      'hr',
      'div',
      'span'
    ],

    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'class']
    }

  });

  // Save `clean` to your database.
});
```

---

# Form Submission

```html
<form id="postForm" method="POST" action="/save">

  <textarea
    id="content"
    name="content"
  ></textarea>

  <button type="submit">Publish</button>

</form>

<script>

  var editor = BlogPad.init('#content', {
    height: 700
  });

  document
    .getElementById('postForm')
    .addEventListener('submit', function () {

      document.getElementById('content').value =
        editor.getContent();

    });

</script>
```

---

# Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| `Ctrl / ⌘ + B` | Bold |
| `Ctrl / ⌘ + I` | Italic |
| `Ctrl / ⌘ + U` | Underline |
| `Ctrl / ⌘ + K` | Insert link |
| `Ctrl / ⌘ + S` | Force save |
| `Ctrl / ⌘ + P` | Print |
| `Ctrl / ⌘ + Alt + 1` | Heading 1 |
| `Ctrl / ⌘ + Alt + 2` | Heading 2 |
| `Ctrl / ⌘ + Alt + 3` | Heading 3 |
| `Ctrl / ⌘ + Alt + 0` | Paragraph |
| `Ctrl / ⌘ + Shift + F` | Toggle fullscreen |
| `Esc` | Close menu / exit fullscreen |

---

# Mobile Support

BlogPad is designed to work on desktop and mobile browsers.

Supported environments include:

- Android Chrome
- iOS Safari
- Desktop Chrome
- Desktop Firefox
- Safari
- Microsoft Edge

---

# Browser Support

| Browser | Support |
|:---|:---:|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile Safari | ✅ |
| Chrome Mobile | ✅ |

---

# Framework Integration

BlogPad is framework-independent.

It can be integrated with:

- Vanilla JavaScript
- PHP
- WordPress
- React
- Vue
- Svelte
- Laravel
- CodeIgniter
- Node.js
- Express
- Custom CMS platforms

---

# React Example

```jsx
import { useEffect, useRef } from 'react';

function Editor() {

  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {

    editorRef.current = BlogPad.init(
      textareaRef.current,
      {
        height: 700
      }
    );

    return () => {
      editorRef.current?.destroy();
    };

  }, []);

  return (
    <textarea
      ref={textareaRef}
      name="content"
    />
  );
}

export default Editor;
```

---

# Vue Example

```javascript
import { onMounted, onBeforeUnmount, ref } from 'vue';

const textarea = ref(null);
let editor = null;

onMounted(() => {

  editor = BlogPad.init(
    textarea.value,
    {
      height: 700
    }
  );

});

onBeforeUnmount(() => {

  if (editor) {
    editor.destroy();
  }

});
```

Template:

```html
<textarea
  ref="textarea"
  name="content"
></textarea>
```

---

# WordPress

BlogPad can be integrated into WordPress-based applications.

A small wrapper/plugin can initialize BlogPad on an existing editor `<textarea>`.

For production WordPress integrations:

1. Sanitize HTML server-side.
2. Respect WordPress capability checks.
3. Use nonces for authenticated actions.
4. Never trust user-generated HTML.
5. Validate uploaded images independently.

---

# Content Storage

BlogPad itself does not require a database.

Local drafts:

```text
Editor
   ↓
localStorage
```

Server persistence:

```text
Editor
   ↓
HTML
   ↓
Textarea
   ↓
Your Backend
   ↓
Database
```

Example:

```javascript
var editor = BlogPad.init('#content', {

  onChange: function (html) {

    // Send HTML to your server.

  }

});
```

---

# Security

BlogPad generates HTML in the browser.

The server must therefore treat editor content as **untrusted input**.

Recommended security practices:

- Sanitize HTML server-side.
- Validate image URLs.
- Validate uploaded files.
- Restrict allowed HTML tags.
- Restrict allowed attributes.
- Validate links.
- Prevent JavaScript URLs.
- Escape content when rendering outside the HTML context.
- Use CSRF protection for authenticated forms.
- Use authorization checks before editing or publishing posts.

Never assume browser-generated HTML is automatically safe.

---

# Performance

BlogPad is designed around a simple architecture:

```text
No npm
No build process
No bundler
No framework
No runtime dependency
```

This makes it suitable for:

- Blogs
- CMS systems
- Admin panels
- Documentation systems
- Internal tools
- News websites
- Publishing platforms
- Personal websites

---

# Project Structure

```text
blogpad/
│
├── blogpad.js
├── README.md
├── LICENSE
├── index.html
│
├── assets/
│   ├── demo.png
│   └── demo.gif
│
└── examples/
    ├── basic.html
    ├── php.html
    └── advanced.html
```

---

# Roadmap

- [ ] Toolbar customization via options
- [ ] Markdown import
- [ ] Markdown export
- [ ] Dark mode
- [ ] Plugin system
- [ ] Internationalization (i18n)
- [ ] More image tools
- [ ] More table controls
- [ ] Better accessibility tooling
- [ ] Framework integration helpers
- [ ] Real-time collaboration
- [ ] Yjs integration

Roadmap items may change based on development priorities and community feedback.

---

# Contributing

Contributions are welcome.

You can contribute through:

- Bug reports
- Feature requests
- Documentation improvements
- UI/UX improvements
- Accessibility improvements
- Performance improvements
- Pull requests

## Development Workflow

### 1. Fork the Repository

Fork BlogPad on GitHub.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/blogpad.git
```

### 3. Enter the Project

```bash
cd blogpad
```

### 4. Create a Feature Branch

```bash
git checkout -b feature/my-feature
```

### 5. Make Your Changes

Edit the source files and test your changes.

### 6. Commit

```bash
git add .
git commit -m "Add my feature"
```

### 7. Push

```bash
git push origin feature/my-feature
```

### 8. Open a Pull Request

Open a Pull Request on GitHub with a clear description of the changes.

---

# Reporting Bugs

Before opening an issue:

1. Check existing issues.
2. Confirm the problem occurs in the latest version.
3. Provide browser and operating-system information.
4. Provide a minimal reproduction if possible.
5. Include console errors when relevant.
6. Explain the expected and actual behavior.

---

# Feature Requests

When requesting a feature, explain:

- What problem it solves
- Who would benefit from it
- How you expect it to work
- Whether it should be optional
- Any relevant examples

---

# Support

If BlogPad saves you time or money, you can help the project by:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting improvements
- 📢 Sharing BlogPad
- 🔧 Contributing code
- 📖 Improving documentation

---

# FAQ

## Is BlogPad free?

Yes.

BlogPad is intended to be free and open-source under the MIT License.

## Can I use BlogPad commercially?

Yes.

The MIT License permits personal and commercial use, subject to the license terms.

## Does BlogPad require npm?

No.

The basic editor can be used directly through a JavaScript file.

## Does BlogPad require a build process?

No.

BlogPad is designed to work without a build step.

## Does BlogPad require a backend?

No.

The editor itself can run entirely in the browser.

A backend is only required for server-side features such as saving posts, publishing, user accounts, image uploads, and database storage.

## Where are drafts stored?

If `autosaveKey` is configured, local drafts can be stored in the browser's `localStorage`.

```javascript
var editor = BlogPad.init('#content', {
  autosaveKey: 'my-blog-draft'
});
```

Server-side persistence requires your own backend implementation.

## Does BlogPad support Hindi and Devanagari?

Yes.

Because BlogPad uses standard browser text rendering, Hindi and Devanagari text can be entered normally.

```text
नमस्ते दुनिया
```

The actual font availability depends on the operating system and browser.

## Does BlogPad work with PHP?

Yes.

BlogPad submits standard HTML, so PHP applications can receive the content through `$_POST`.

```php
$content = $_POST['content'] ?? '';
```

Always sanitize before storing or displaying user-generated HTML.

## Does BlogPad work with WordPress?

Yes.

BlogPad can be integrated with WordPress using a plugin or custom integration.

## Does BlogPad work with React?

Yes.

Initialize BlogPad after the textarea has mounted and call:

```javascript
editor.destroy();
```

during component cleanup.

## Does BlogPad work with Vue?

Yes.

Initialize it in `onMounted()` and destroy it in `onBeforeUnmount()`.

## Can I customize the toolbar?

Toolbar customization through configuration options is planned.

Until an official configuration API is available, advanced users can modify the source code directly.

## Does BlogPad upload images?

The editor can work with images, but image persistence depends on your application.

For a production CMS, image uploads should be handled by your backend or storage service.

The backend should validate:

- File type
- File size
- File name
- MIME type
- Image dimensions
- Storage location

## Is BlogPad a replacement for a complete CMS?

No.

BlogPad is an **editor component**, not a complete CMS.

You still need your own application for:

- Authentication
- Authorization
- Database
- Post management
- Media management
- Publishing workflow
- Categories
- Tags
- SEO
- User management

BlogPad handles the editing layer.

---

# Architecture

```text
┌───────────────────────┐
│       BlogPad         │
│       Editor          │
└───────────┬───────────┘
            │
            │ HTML
            ▼
┌───────────────────────┐
│      <textarea>       │
└───────────┬───────────┘
            │
            │ POST / API
            ▼
┌───────────────────────┐
│       Backend         │
│ PHP / Node / etc.     │
└───────────┬───────────┘
            │
            │ Sanitized HTML
            ▼
┌───────────────────────┐
│       Database        │
└───────────────────────┘
```

---

# Example CMS Workflow

```text
Admin Dashboard
      │
      ▼
Create Post
      │
      ▼
BlogPad Editor
      │
      ▼
HTML Content
      │
      ▼
Server-side Sanitization
      │
      ▼
Database
      │
      ▼
Published Article
```

---

# Versioning

For production websites, pin the BlogPad version:

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
```

Instead of:

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad/blogpad.js"></script>
```

Pinned versions provide more predictable deployments.

---

# CDN

BlogPad can be served through jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
```

Repository:

https://github.com/shamserchand1/blogpad

---

# Live Demo

Try BlogPad:

**https://shamserchand1.github.io/blogpad/**

---

# Screenshots & Demo

If you add a screenshot:

```markdown
![BlogPad Editor](demo.png)
```

For a demo GIF:

```markdown
![BlogPad Demo](demo.gif)
```

A short demo GIF is useful because visitors can immediately see the editor in action.

---

# License

MIT License

Copyright (c) 2025 Shamser Chand

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

# Credits

Created and maintained by **Shamser Chand**.

GitHub:

https://github.com/shamserchand1

BlogPad:

https://github.com/shamserchand1/blogpad

Live Demo:

https://shamserchand1.github.io/blogpad/

---

# ⭐ Support BlogPad

If you find BlogPad useful:

⭐ Star the repository

🐛 Report bugs

💡 Suggest features

🔧 Contribute improvements

📢 Share the project

Every contribution helps make BlogPad better.

---

<p align="center">
  <strong>BlogPad</strong>
  <br>
  Lightweight. Dependency-free. Open source.
  <br><br>
  Made with ❤️ by Shamser Chand
</p>
