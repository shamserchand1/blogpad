# BlogPad — Free CKEditor Alternative

> A lightweight, dependency-free WYSIWYG editor. Drop it into any page with 2 lines of code. No license fee. No premium tier. Forever free.

[**Live Demo →**](https://shamserchand1.github.io/blogpad)

## Why BlogPad?

CKEditor 5 charges for premium features (real-time collaboration, export to Word/PDF, etc.). BlogPad gives you the core editing experience — free, open-source, and self-hostable.

| Feature | BlogPad | CKEditor 5 (Free) | CKEditor 5 (Premium) |
|---|---|---|---|
| Rich text editing | ✅ | ✅ | ✅ |
| Image resize & drag | ✅ | ✅ | ✅ |
| Tables with merge/split | ✅ | ✅ | ✅ |
| Source code view | ✅ | ✅ | ✅ |
| Custom modals (no alerts) | ✅ | ✅ | ✅ |
| Mobile / touch friendly | ✅ | ✅ | ✅ |
| **Word count + read time** | ✅ | ✅ | ✅ |
| **Blog blocks (callout, TOC)** | ✅ | ❌ | ✅ |
| **Price** | **Free** | Free | $500+/year |
| **Self-hosted** | ✅ | ✅ | ✅ |
| **Dependencies** | **Zero** | Framework needed | Framework needed |
| **Bundle size** | **~50KB** | ~200KB | ~200KB+ |

## Install via CDN

\`\`\`html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
<script>
  BlogPad.init('#content', { height: 700 });
</script>
\`\`\`

## Quick Start

\`\`\`html
<form action="/save" method="POST">
  <textarea id="content" name="content"></textarea>
</form>

<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
<script>
  var editor = BlogPad.init('#content', {
    height: 700,
    placeholder: 'Start writing…',
    autosaveKey: 'my-draft'
  });

  document.querySelector('form').addEventListener('submit', function () {
    document.getElementById('content').value = editor.getContent();
  });
</script>
\`\`\`

## API

- `editor.getContent()` — HTML string
- `editor.setContent(html)`
- `editor.getText()` — plain text
- `editor.save()` — force save
- `editor.openLinkModal()` — trigger link dialog
- `editor.destroy()` — cleanup

## Features

- Two-row CKEditor-style toolbar
- **Custom modals** (no ugly browser alerts)
- Image resize, drag-move, align, caption, alt text
- Tables with row/column/merge/split
- Text color + highlight palettes
- Auto-save to localStorage
- Source code view + fullscreen
- Mobile + touch friendly
- Zero dependencies

## License

MIT — free for personal and commercial use.
