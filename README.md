# BlogPad — Free CKEditor Alternative

> A lightweight, dependency-free WYSIWYG editor. Drop it into any page with 2 lines of code. No license fee. No premium tier. Forever free.

**Live Demo:** https://shamserchand1.github.io/blogpad
**GitHub:** https://github.com/shamserchand1/blogpad

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
| Word count + read time | ✅ | ✅ | ✅ |
| Blog blocks (callout, TOC) | ✅ | ❌ | ✅ |
| Price | **Free** | Free | $500+/year |
| Self-hosted | ✅ | ✅ | ✅ |
| Dependencies | **Zero** | Framework needed | Framework needed |
| Bundle size | **~50KB** | ~200KB | ~200KB+ |

## Install via CDN

```html
<script src="https://cdn.jsdelivr.net/gh/shamserchand1/blogpad@v3.4.0/blogpad.js"></script>
<script>
  BlogPad.init('#content', { height: 700 });
</script>
