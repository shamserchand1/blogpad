Yeh raha aapke BlogPad project ke liye complete production-ready README. Bas copy karke README.md me paste kar dein.

---

```markdown
# BlogPad

> A lightweight, dependency-free WYSIWYG editor. Drop it into any page with 2 lines of code. No license fee. No premium tier. Forever free.

🔗 **[▶ Try Live Demo](https://shamserchand1.github.io/blogpad/)**

[![GitHub stars](https://img.shields.io/github/stars/shamserchand1/blogpad?style=social)](https://github.com/shamserchand1/blogpad/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsDelivr](https://img.shields.io/jsdelivr/gh/hm/shamserchand1/blogpad)](https://www.jsdelivr.com/package/gh/shamserchand1/blogpad)

---

## Why BlogPad?

CKEditor 5 and other premium editors charge for features that a basic blog actually needs. BlogPad gives you the core editing experience — **free, open-source, and self-hostable**.

| Feature | **BlogPad** | CKEditor 5 (Free) | CKEditor 5 (Premium) |
|---|:---:|:---:|:---:|
| Rich text editing | ✅ | ✅ | ✅ |
| Image resize & drag | ✅ | ✅ | ✅ |
| Image caption & alt text | ✅ | ✅ | ✅ |
| Tables with merge / split | ✅ | ✅ | ✅ |
| Source code view | ✅ | ✅ | ✅ |
| Custom modals (no browser alerts) | ✅ | ✅ | ✅ |
| Mobile & touch friendly | ✅ | ✅ | ✅ |
| Word count + read time | ✅ | ✅ | ✅ |
| Blog blocks (callout, TOC, takeaway) | ✅ | ❌ | ✅ |
| Zero dependencies | ✅ | ❌ | ❌ |
| **Price** | **Free forever** | Free | $500+ / year |
| **Self-hosted** | ✅ | ✅ | ✅ |
| **Bundle size** | **~50 KB** | ~200 KB | ~200 KB+ |

---

## Quick Start

Get BlogPad working in **3 simple steps**. No build tools. No npm. No configuration.

### Step 1 — Add the CDN script

Paste this `<script>` tag inside your page's `<head>` or right before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
```

Step 2 — Add a textarea

Add a <textarea> wherever you want the editor to appear.

⚠️ Important: The name="content" attribute is required — this is how your backend receives the editor content on form submit.

```html
<textarea id="content" name="content"></textarea>
```

Step 3 — Initialize BlogPad

Add this <script> after the CDN script. It converts your textarea into a full WYSIWYG editor:

```html
<script>
  var editor = BlogPad.init('#content', {
    height: 700,
    placeholder: 'Start writing…',
    autosaveKey: 'my-blog-draft'
  });

  // Sync editor content to the textarea before form submit
  document.querySelector('form').addEventListener('submit', function () {
    document.getElementById('content').value = editor.getContent();
  });
</script>
```

That's it. Your backend will receive the editor's HTML in the content field — exactly like a regular <textarea>.

---

Complete Working Example

Copy this into a file called index.html, open it in your browser, and you're ready to go:

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
    <textarea id="content" name="content"></textarea>
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

Installation Options

Option 1 — CDN (recommended)

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
```

· Latest version: https://cdn.jsdelivr.net/gh/shamserchand1/blogpad/blogpad.js
· Specific version (recommended for production): @v3.4.0
· Version is pinned → your site never breaks on new releases.

Option 2 — Download

Download blogpad.js from this repo and include it locally:

```html
<script src="/path/to/blogpad.js"></script>
```

No build tools. No bundler. Just a single file.

---

API Reference

BlogPad.init(target, options)

Initialize the editor on a <textarea> or a container <div>.

Parameters:

· target (string \| HTMLElement) — CSS selector or DOM element
· options (object, optional)

Options:

Option Type Default Description
height number 740 Editor height in pixels
placeholder string 'Type your text here…' Placeholder text
initialContent string '' Initial HTML content
autosaveKey string null localStorage key for auto-save
showStatus boolean true Show word count / char count footer
onChange function null Called on every content change with HTML string
onReady function null Called once with the editor API
onPublish function null Called when publish button is clicked

Returns: Editor API object (see below).

---

Editor API

```js
var editor = BlogPad.init('#content', { /* options */ });
```

Method Description
editor.getContent() Returns HTML string
editor.setContent(html) Sets HTML content
editor.getText() Returns plain text
editor.isEmpty() Returns true if empty
editor.clear() Clears content
editor.focus() Focuses the editor
editor.blur() Blurs the editor
editor.save() Forces a save to localStorage / onChange
editor.toggleFullscreen() Toggles fullscreen mode
editor.openLinkModal() Opens the link dialog
editor.openTableModal() Opens the table dialog
editor.on('change', fn) Subscribes to change events
editor.destroy() Destroys the editor and restores the original element

---

Features

Editor

· Two-row CKEditor-style toolbar
· Bold, italic, underline, strikethrough
· Superscript & subscript
· Inline code
· Headings (H1–H4), quote, code block
· Bulleted & numbered lists
· Indent / outdent
· Text alignment (left, center, right, justify)
· Font family & size
· Text color & highlight (with custom palette)
· Clear formatting

Insert

· Link — with custom modal (text, URL, "open in new tab")
· Image — resize, drag, align, caption, alt text, replace
· Table — rows, columns, merge, split, header toggle
· Horizontal line
· Blog blocks — callout, key takeaway, divider
· Table of contents — auto-generated from headings

UX

· Custom modals — no browser alert() / prompt()
· Auto-save to localStorage
· Word count + character count + read time
· Source code view
· Fullscreen mode
· Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K, Ctrl+S, etc.)
· Mobile & touch friendly
· Zero dependencies — pure vanilla JavaScript

Developer

· Single file, no build step
· Works with any <textarea> — backend needs zero changes
· Syncs content to textarea on every change
· Data is delivered as standard HTML — sanitize on your backend
· MIT licensed — free for personal and commercial use

---

Backend Integration

BlogPad sends content as a standard HTML string. Your backend receives it exactly like a regular <textarea>.

PHP

```php
<?php
$content = $_POST['content'];

// Sanitize — allow only safe tags
$allowed = '<p><br><b><i><u><s><h1><h2><h3><h4><ul><ol><li>'
         . '<blockquote><pre><code><a><img><figure><figcaption>'
         . '<table><tr><td><th><hr><div><span>';
$clean = strip_tags($content, $allowed);

// Save to database
$stmt = $pdo->prepare("INSERT INTO posts (content) VALUES (?)");
$stmt->execute([$clean]);
```

Node.js / Express

```js
const sanitizeHtml = require('sanitize-html');

app.post('/save', (req, res) => {
  const clean = sanitizeHtml(req.body.content, {
    allowedTags: ['p', 'br', 'b', 'i', 'u', 's', 'h1', 'h2', 'h3', 'h4',
                  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
                  'a', 'img', 'figure', 'figcaption',
                  'table', 'tr', 'td', 'th', 'hr', 'div', 'span'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'class']
    }
  });
  // Save `clean` to database
});
```

⚠️ Always sanitize on the server — never trust client-side HTML.

---

Keyboard Shortcuts

Shortcut Action
Ctrl / ⌘ + B Bold
Ctrl / ⌘ + I Italic
Ctrl / ⌘ + U Underline
Ctrl / ⌘ + K Insert link
Ctrl / ⌘ + S Force save
Ctrl / ⌘ + P Print
Ctrl / ⌘ + Alt + 1 Heading 1
Ctrl / ⌘ + Alt + 2 Heading 2
Ctrl / ⌘ + Alt + 3 Heading 3
Ctrl / ⌘ + Alt + 0 Paragraph
Ctrl / ⌘ + Shift + F Toggle fullscreen
Esc Close menu / exit fullscreen

---

Browser Support

Browser Version
Chrome ✅ Latest
Firefox ✅ Latest
Safari ✅ Latest
Edge ✅ Latest
Mobile Safari (iOS) ✅ 13+
Chrome Mobile (Android) ✅ Latest

---

FAQ

Does it work with WordPress?
Yes. WordPress classic editor uses a <textarea> — BlogPad can replace it. You may need a small plugin wrapper.

Does it work with React / Vue / Svelte?
Yes. Use a ref to the <textarea>, call BlogPad.init() in useEffect / onMounted, and call editor.destroy() in cleanup.

Where is content stored?
By default, auto-save goes to localStorage. To persist to your server, use the onChange callback or handle the form submit.

Is it free for commercial use?
Yes. BlogPad is MIT licensed — free for personal and commercial projects.

Does it support Hindi / Devanagari?
Yes. The font dropdown includes Mangal and Noto Sans Devanagari.

Can I customize the toolbar?
Not yet via options — but you can edit the blogpad.js source directly. Toolbar customization is on the roadmap.

---

Roadmap

☐ Toolbar customization via options
☐ Markdown import / export
☐ Real-time collaboration (Yjs)
☐ Dark mode
☐ Plugin system
☐ i18n (multi-language UI)

---

Contributing

Contributions are welcome! Whether it's a bug report, feature request, or pull request — every bit helps.

1. Fork the repo
2. Create a branch: git checkout -b feature/my-feature
3. Commit: git commit -m 'Add my feature'
4. Push: git push origin feature/my-feature
5. Open a Pull Request

Found a bug? Open an issue →

---

Support

If BlogPad saved you money or time, consider:

· ⭐ Starring the repo — helps others discover it
· 🐛 Reporting bugs — makes the editor better
· 📢 Sharing — tell a friend who's paying for CKEditor

---

License

MIT © 2025 Shamser Chand

Free for personal and commercial use.

```

---

## Ab Kya Karna Hai

1. GitHub repo → `README.md` → **pencil ✏️** icon
2. Sab select karein (**Select all**)
3. Upar wala poora content paste karein
4. Neeche scroll → **"Commit changes"** → message: `Complete README with 3-step guide, API, and FAQ`

Bas! Ab aapka README **professional open-source project jaisa** lagega.

---

## Ek Aur Chhota Kaam (Optional)

README me **screenshot** ya **GIF** add karna bahut valuable hai. Isse:

1. Demo kholo → `shamserchand1.github.io/blogpad/`
2. Editor use karo → screen record karo (mobile pe built-in, ya PC pe ShareX/Loom)
3. Video ko GIF me convert karo — [ezgif.com/video-to-gif](https://ezgif.com/video-to-gif)
4. Repo me `demo.gif` upload karo
5. README me top pe daalo:

```markdown
![BlogPad Demo](demo.gif)
```
