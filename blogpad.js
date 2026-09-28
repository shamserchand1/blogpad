/* =========================================================
   BlogPad v4.0.1 — Production-Ready Embeddable Blog Editor
   ---------------------------------------------------------
   • Zero dependencies
   • Fully inline-styled content (no CSS class conflicts)
   • No localStorage — pure onChange callbacks
   • Custom modals (no browser alerts)
   • TOC uses <div> (immune to host theme styles)
   • Proper cleanup via destroy()
   • MIT Licensed
   ========================================================= */
(function (global) {
  'use strict';

  var VERSION = '4.0.1';
  var CSS_ID = 'blogpad-styles-v4';

  /* =========================================================
     INLINE STYLE MAP — every content element
  ========================================================= */
  var IS = {
    h1: 'font-size:2em;line-height:1.25;font-weight:700;margin:.8em 0 .4em;letter-spacing:-.015em;font-family:Georgia,"Times New Roman",serif',
    h2: 'font-size:1.5em;line-height:1.3;font-weight:700;margin:1.1em 0 .4em;letter-spacing:-.01em;font-family:Georgia,"Times New Roman",serif',
    h3: 'font-size:1.22em;line-height:1.4;font-weight:600;margin:1em 0 .35em',
    h4: 'font-size:1.05em;font-weight:600;margin:.9em 0 .3em',
    p: 'margin:0 0 1em;font-size:16px;line-height:1.65',
    blockquote: 'border-left:3px solid #c4c4c4;padding:2px 0 2px 18px;margin:1em 0;color:#6b6b6b;font-style:italic;font-size:1.03em;font-family:Georgia,"Times New Roman",serif',
    pre: 'background:#f6f8fa;border:1px solid #e0e0e0;border-radius:4px;padding:14px 16px;margin:1em 0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Courier New",monospace;font-size:.88em;line-height:1.55;overflow-x:auto;white-space:pre-wrap;color:#24292e;display:block',
    code: 'background:#f6f8fa;padding:2px 5px;border-radius:3px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Courier New",monospace;font-size:.88em;color:#d6336c;border:1px solid #e1e4e8',
    preCode: 'background:none;padding:0;border:none;color:inherit;font-size:inherit;font-family:inherit;border-radius:0',
    a: 'color:#1a73e8;text-decoration:underline;text-underline-offset:2px',
    ul: 'margin:.5em 0 .9em;padding-left:1.6em;list-style-type:disc',
    ol: 'margin:.5em 0 .9em;padding-left:1.6em;list-style-type:decimal',
    li: 'margin:.22em 0;line-height:1.65',
    hr: 'border:none;border-top:1px solid #e0e0e0;margin:1.8em 0;height:0;background:transparent',
    table: 'border-collapse:collapse;width:100%;margin:1.2em 0;font-size:.95em;table-layout:fixed',
    td: 'border:1px solid #c4c4c4;padding:8px 12px;min-width:40px;vertical-align:top;line-height:1.5;word-wrap:break-word;overflow-wrap:break-word',
    th: 'border:1px solid #c4c4c4;padding:8px 12px;min-width:40px;vertical-align:top;line-height:1.5;word-wrap:break-word;overflow-wrap:break-word;background:#f6f6f6;font-weight:600;text-align:left',
    img: 'max-width:100%;height:auto;display:inline-block;vertical-align:bottom',
    imgLeft: 'max-width:55%;height:auto;float:left;margin:4px 20px 12px 0;display:inline-block;vertical-align:bottom',
    imgRight: 'max-width:55%;height:auto;float:right;margin:4px 0 12px 20px;display:inline-block;vertical-align:bottom',
    imgCenter: 'max-width:100%;height:auto;display:block;margin:12px auto',
    imgFull: 'max-width:100%;height:auto;display:block;width:100%;margin:14px 0',
    figure: 'margin:1.4em 0;text-align:center',
    figcaption: 'font-size:.85em;color:#9a9a9a;margin-top:8px;font-style:italic;line-height:1.5',
    callout: 'background:#e8f0fe;border-left:3px solid #1a73e8;padding:12px 16px;border-radius:0 4px 4px 0;margin:1.2em 0;color:#174ea6;font-size:.97em;line-height:1.65',
    calloutStrong: 'color:#1a73e8;font-weight:700',
    takeaway: 'background:#e6f4ea;border:1px solid #a8dab5;border-left:3px solid #34a853;border-radius:0 4px 4px 0;padding:12px 16px;margin:1.2em 0;font-size:.97em;line-height:1.65',
    takeawayStrong: 'color:#0d652d;display:block;margin-bottom:6px;font-size:.85em;letter-spacing:.05em;text-transform:uppercase;font-weight:700',
    toc: 'background:#f8f9fa;border:1px solid #e0e0e0;border-radius:4px;padding:14px 18px;margin:1.3em 0',
    tocStrong: 'font-size:.85em;color:#6b6b6b;text-transform:uppercase;letter-spacing:.06em;font-weight:700;display:block;margin-bottom:8px',
    tocList: 'margin:0;padding-left:0;list-style:none;list-style-type:none;counter-reset:none;display:block',
    tocOl: 'margin:0;padding-left:0;list-style:none;list-style-type:none;counter-reset:none',
    tocLi: 'margin:3px 0;font-size:.94em;line-height:1.5;padding-left:0;list-style:none;list-style-type:none;display:block',
    tocLink: 'color:#1a73e8;text-decoration:none',
    divider: 'text-align:center;margin:2.6em 0;color:#9a9a9a;font-size:14px;line-height:1;user-select:none'
  };

  /* =========================================================
     UI CSS — scoped to .bpad-* namespace
  ========================================================= */
  var CSS = `
  .bpad-root{--bpad-border:#c4c4c4;--bpad-border-light:#e0e0e0;--bpad-toolbar-bg:#fafafa;
    --bpad-editor-bg:#fff;--bpad-text:#333;--bpad-text-muted:#6b6b6b;--bpad-text-faint:#9a9a9a;
    --bpad-btn-hover:#f0f0f0;--bpad-btn-hover-border:#d0d0d0;
    --bpad-btn-active-bg:#d1e8ff;--bpad-btn-active-border:#8ab4f8;--bpad-btn-active-text:#1a73e8;
    --bpad-accent:#1a73e8;--bpad-accent-subtle:#e8f0fe;--bpad-menu-bg:#fff;--bpad-menu-hover:#f0f0f0;
    --bpad-danger:#d32f2f;--bpad-shadow-menu:0 2px 8px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.05);
    --bpad-shadow-floating:0 4px 16px rgba(0,0,0,.15);
    --bpad-shadow-modal:0 20px 50px rgba(0,0,0,.25);
    --bpad-radius:2px;--bpad-radius-lg:3px;--bpad-radius-xl:6px;
    position:relative;display:flex;flex-direction:column;background:var(--bpad-editor-bg);
    color:var(--bpad-text);font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    font-size:14px;line-height:1.5;border:1px solid var(--bpad-border);border-radius:var(--bpad-radius);
    overflow:hidden;-webkit-font-smoothing:antialiased}
  .bpad-root *,.bpad-root *::before,.bpad-root *::after{box-sizing:border-box}
  .bpad-root button{font-family:inherit}
  .bpad-toolbar{display:flex;flex-direction:column;padding:0;background:var(--bpad-toolbar-bg);
    border-bottom:1px solid var(--bpad-border);flex-shrink:0;position:relative;z-index:10}
  .bpad-toolbar-row{display:flex;align-items:center;gap:1px;min-height:38px;padding:3px 6px;
    overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;flex-wrap:nowrap}
  .bpad-toolbar-row+.bpad-toolbar-row{border-top:1px solid var(--bpad-border-light)}
  .bpad-toolbar-row::-webkit-scrollbar{display:none}
  .bpad-toolbar-spacer{flex:1;min-width:4px}
  .bpad-sep{width:1px;height:22px;background:var(--bpad-border-light);margin:0 4px;flex-shrink:0;align-self:center}
  .bpad-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;
    width:32px;height:32px;padding:0;background:transparent;border:1px solid transparent;
    border-radius:var(--bpad-radius);cursor:pointer;color:var(--bpad-text);
    transition:background 100ms,border-color 100ms,color 100ms;flex-shrink:0;
    touch-action:manipulation;user-select:none;outline:none}
  .bpad-btn:hover{background:var(--bpad-btn-hover);border-color:var(--bpad-btn-hover-border)}
  .bpad-btn:focus-visible{outline:2px solid var(--bpad-accent);outline-offset:1px}
  .bpad-btn[data-active="true"]{background:var(--bpad-btn-active-bg);border-color:var(--bpad-btn-active-border);color:var(--bpad-btn-active-text)}
  .bpad-btn svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
  .bpad-drop{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 26px 0 10px;
    background:transparent;border:1px solid transparent;border-radius:var(--bpad-radius);
    cursor:pointer;font-size:13px;color:var(--bpad-text);transition:background 100ms,border-color 100ms;
    white-space:nowrap;flex-shrink:0;position:relative;touch-action:manipulation;outline:none}
  .bpad-drop:hover{background:var(--bpad-btn-hover);border-color:var(--bpad-btn-hover-border)}
  .bpad-drop[data-open="true"]{background:var(--bpad-btn-hover);border-color:var(--bpad-btn-hover-border)}
  .bpad-drop-label{max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bpad-drop-arrow{position:absolute;right:9px;top:50%;margin-top:1px;width:0;height:0;
    border-left:3.5px solid transparent;border-right:3.5px solid transparent;border-top:4px solid var(--bpad-text-muted);pointer-events:none}
  .bpad-drop[data-open="true"] .bpad-drop-arrow{transform:rotate(180deg);margin-top:-2px}
  .bpad-split{display:inline-flex;align-items:center;height:32px;padding:0 4px 0 8px;
    background:transparent;border:1px solid transparent;border-radius:var(--bpad-radius);
    cursor:pointer;gap:4px;position:relative;transition:background 100ms,border-color 100ms;
    flex-shrink:0;touch-action:manipulation;outline:none}
  .bpad-split:hover{background:var(--bpad-btn-hover);border-color:var(--bpad-btn-hover-border)}
  .bpad-split[data-open="true"]{background:var(--bpad-btn-hover);border-color:var(--bpad-btn-hover-border)}
  .bpad-split svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .bpad-split-arrow{width:0;height:0;border-left:3.5px solid transparent;border-right:3.5px solid transparent;border-top:4px solid var(--bpad-text-muted)}
  .bpad-color-bar{position:absolute;left:4px;right:12px;bottom:4px;height:3px;border-radius:1px;pointer-events:none}
  .bpad-menu{position:fixed;min-width:200px;max-height:min(400px,70vh);overflow-y:auto;
    background:var(--bpad-menu-bg);border:1px solid var(--bpad-border);border-radius:var(--bpad-radius-lg);
    box-shadow:var(--bpad-shadow-menu);padding:5px 0;z-index:9999;display:none}
  .bpad-menu[data-open="true"]{display:block;animation:bpad-menu-in 120ms cubic-bezier(.4,0,.2,1)}
  @keyframes bpad-menu-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
  .bpad-menu-item{display:flex;align-items:center;gap:10px;width:100%;padding:7px 14px 7px 12px;
    background:transparent;border:none;cursor:pointer;font-size:13px;color:var(--bpad-text);
    text-align:left;transition:background 80ms;font-family:inherit;line-height:1.4;outline:none}
  .bpad-menu-item:hover,.bpad-menu-item[data-focused="true"]{background:var(--bpad-menu-hover)}
  .bpad-menu-item[data-active="true"]{background:var(--bpad-accent-subtle);color:var(--bpad-accent)}
  .bpad-menu-check{width:16px;height:16px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;color:var(--bpad-accent)}
  .bpad-menu-check svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
  .bpad-menu-icon{width:18px;height:18px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;color:var(--bpad-text-muted)}
  .bpad-menu-icon svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .bpad-menu-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .bpad-menu-shortcut{font-size:11px;color:var(--bpad-text-faint);font-family:ui-monospace,monospace;padding:1px 5px;border:1px solid var(--bpad-border-light);border-radius:3px;background:#fafafa}
  .bpad-menu-header{padding:6px 14px 4px;font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--bpad-text-faint)}
  .bpad-menu-sep{height:1px;background:var(--bpad-border-light);margin:5px 8px}
  .bpad-color-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:4px;padding:6px 12px 8px}
  .bpad-color-swatch{width:22px;height:22px;border:1px solid var(--bpad-border);border-radius:3px;cursor:pointer;transition:transform 80ms,box-shadow 80ms;padding:0;position:relative;outline:none}
  .bpad-color-swatch:hover{transform:scale(1.12);box-shadow:0 0 0 2px var(--bpad-accent);z-index:1}
  .bpad-color-swatch[data-transparent="true"]{background-image:linear-gradient(45deg,#d0d0d0 25%,transparent 25%),linear-gradient(-45deg,#d0d0d0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#d0d0d0 75%),linear-gradient(-45deg,transparent 75%,#d0d0d0 75%);background-size:8px 8px;background-position:0 0,0 4px,4px -4px,-4px 0;background-color:#fff}
  .bpad-color-custom{display:flex;align-items:center;gap:8px;padding:6px 14px 8px;font-size:12.5px;color:var(--bpad-text-muted)}
  .bpad-color-custom input[type="color"]{width:32px;height:24px;padding:0;border:1px solid var(--bpad-border);border-radius:3px;cursor:pointer;background:#fff}
  .bpad-editor-wrap{flex:1;overflow-y:auto;overflow-x:hidden;background:var(--bpad-editor-bg);-webkit-overflow-scrolling:touch}
  .bpad-editor{padding:24px 40px 60px;outline:none;min-height:100%;font-size:16px;line-height:1.65;color:var(--bpad-text);word-wrap:break-word;overflow-wrap:break-word;caret-color:var(--bpad-accent);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
  @media (max-width:600px){.bpad-editor{padding:18px 16px 60px;font-size:15.5px}}
  .bpad-editor.bpad-is-empty::before{content:attr(data-placeholder);color:var(--bpad-text-faint);pointer-events:none;position:absolute;user-select:none}
  .bpad-footer{display:flex;align-items:center;gap:14px;min-height:30px;padding:0 12px;background:var(--bpad-toolbar-bg);border-top:1px solid var(--bpad-border);font-size:12px;color:var(--bpad-text-muted);flex-shrink:0;overflow-x:auto;scrollbar-width:none}
  .bpad-footer::-webkit-scrollbar{display:none}
  .bpad-footer .bpad-stat{white-space:nowrap}
  .bpad-footer .bpad-spacer{flex:1;min-width:8px}
  .bpad-footer-link{color:var(--bpad-text-faint);text-decoration:none}
  .bpad-source{display:none;width:100%;height:100%;border:none;outline:none;resize:none;padding:20px 24px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;line-height:1.6;color:#24292e;background:#f6f8fa;tab-size:2}
  .bpad-root[data-source="true"] .bpad-editor-wrap{display:none}
  .bpad-root[data-source="true"] .bpad-source{display:block}
  .bpad-float{position:fixed;z-index:600;display:none;align-items:center;gap:1px;padding:3px;background:var(--bpad-menu-bg);border:1px solid var(--bpad-border);border-radius:var(--bpad-radius-lg);box-shadow:var(--bpad-shadow-floating);max-width:calc(100vw - 16px);overflow-x:auto;scrollbar-width:none}
  .bpad-float::-webkit-scrollbar{display:none}
  .bpad-float[data-open="true"]{display:flex}
  .bpad-float .bpad-btn{color:var(--bpad-text-muted);width:32px;height:32px}
  .bpad-float .bpad-btn:hover{background:var(--bpad-btn-hover);color:var(--bpad-text)}
  .bpad-float .bpad-btn[data-active="true"]{background:var(--bpad-btn-active-bg);color:var(--bpad-btn-active-text)}
  .bpad-float .bpad-btn.bpad-btn-danger:hover{background:#fdecea;color:var(--bpad-danger)}
  .bpad-float .bpad-sep{height:20px;margin:0 3px}
  .bpad-img-overlay{position:fixed;pointer-events:none;z-index:590;display:none;border:2px solid var(--bpad-accent);touch-action:none}
  .bpad-img-overlay[data-open="true"]{display:block}
  .bpad-handle{position:absolute;width:10px;height:10px;background:#fff;border:2px solid var(--bpad-accent);border-radius:50%;pointer-events:auto;touch-action:none;box-shadow:0 1px 3px rgba(0,0,0,.2);-webkit-tap-highlight-color:transparent}
  .bpad-handle:hover{transform:scale(1.3)}
  .bpad-h-nw{left:-6px;top:-6px;cursor:nwse-resize}
  .bpad-h-n{left:50%;top:-6px;margin-left:-5px;cursor:ns-resize}
  .bpad-h-ne{right:-6px;top:-6px;cursor:nesw-resize}
  .bpad-h-e{right:-6px;top:50%;margin-top:-5px;cursor:ew-resize}
  .bpad-h-se{right:-6px;bottom:-6px;cursor:nwse-resize}
  .bpad-h-s{left:50%;bottom:-6px;margin-left:-5px;cursor:ns-resize}
  .bpad-h-sw{left:-6px;bottom:-6px;cursor:nesw-resize}
  .bpad-h-w{left:-6px;top:50%;margin-top:-5px;cursor:ew-resize}
  .bpad-caret{position:fixed;width:2px;background:var(--bpad-accent);z-index:700;display:none;pointer-events:none}
  .bpad-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);z-index:9000;display:flex;align-items:center;gap:8px;background:#202124;color:#fff;padding:9px 16px;border-radius:var(--bpad-radius-lg);font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:all 180ms cubic-bezier(.4,0,.2,1);max-width:calc(100vw - 24px)}
  .bpad-toast[data-open="true"]{opacity:1;transform:translate(-50%,0)}
  .bpad-toast svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
  .bpad-hint{position:fixed;bottom:70px;left:50%;transform:translateX(-50%);background:rgba(32,33,36,.94);color:#fff;padding:8px 14px;border-radius:16px;font-size:12.5px;z-index:9000;pointer-events:none;opacity:0;transition:opacity 180ms;white-space:nowrap}
  .bpad-hint[data-open="true"]{opacity:1}
  .bpad-root.bpad-fullscreen{position:fixed !important;top:0;left:0;right:0;bottom:0;z-index:9000;border-radius:0;width:auto !important;height:auto !important}
  .bpad-modal-backdrop{position:fixed;inset:0;z-index:10000;background:rgba(15,15,17,.45);display:none;align-items:center;justify-content:center;padding:16px;animation:bpad-fade 140ms ease-out}
  .bpad-modal-backdrop[data-open="true"]{display:flex}
  @keyframes bpad-fade{from{opacity:0}to{opacity:1}}
  .bpad-modal{background:#fff;border-radius:var(--bpad-radius-xl);width:100%;max-width:440px;max-height:calc(100vh - 32px);display:flex;flex-direction:column;box-shadow:var(--bpad-shadow-modal);overflow:hidden;animation:bpad-modal-in 180ms cubic-bezier(.4,0,.2,1);font-family:inherit}
  @keyframes bpad-modal-in{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
  .bpad-modal-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #e8e8e8}
  .bpad-modal-title{font-size:15px;font-weight:600;color:#1e1e1e;margin:0}
  .bpad-modal-close{background:transparent;border:none;cursor:pointer;color:#6b6b6b;width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;transition:background 100ms,color 100ms}
  .bpad-modal-close:hover{background:#f0f0f0;color:#333}
  .bpad-modal-close svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}
  .bpad-modal-body{padding:18px;overflow-y:auto;flex:1}
  .bpad-modal-footer{display:flex;justify-content:flex-end;gap:8px;padding:12px 18px;border-top:1px solid #e8e8e8;background:#fafafa}
  .bpad-field{margin-bottom:14px}
  .bpad-field:last-child{margin-bottom:0}
  .bpad-field-label{display:block;font-size:12.5px;font-weight:600;color:#3c3c3c;margin-bottom:6px;letter-spacing:.005em}
  .bpad-input{width:100%;padding:9px 12px;border:1px solid #c4c4c4;border-radius:4px;font-size:14px;font-family:inherit;color:#1e1e1e;background:#fff;outline:none;transition:border-color 120ms,box-shadow 120ms}
  .bpad-input:hover{border-color:#8c8f94}
  .bpad-input:focus{border-color:var(--bpad-accent);box-shadow:0 0 0 3px rgba(26,115,232,.15)}
  .bpad-input::placeholder{color:#9a9a9a}
  .bpad-input-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .bpad-checkbox{display:flex;align-items:center;gap:8px;font-size:13.5px;color:#3c3c3c;cursor:pointer;user-select:none;padding:4px 0}
  .bpad-checkbox input{width:16px;height:16px;margin:0;cursor:pointer;accent-color:var(--bpad-accent)}
  .bpad-btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;background:var(--bpad-accent);color:#fff;border:1px solid var(--bpad-accent);border-radius:4px;font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;transition:background 120ms}
  .bpad-btn-primary:hover{background:#1558c0;border-color:#1558c0}
  .bpad-btn-secondary{display:inline-flex;align-items:center;justify-content:center;padding:8px 18px;background:#fff;color:#333;border:1px solid #c4c4c4;border-radius:4px;font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;transition:background 120ms}
  .bpad-btn-secondary:hover{background:#f5f5f5}
  .bpad-btn-danger{background:transparent;color:var(--bpad-danger);border:1px solid transparent;padding:8px 12px;border-radius:4px;font-size:13.5px;font-weight:500;cursor:pointer;font-family:inherit;margin-right:auto;transition:background 120ms}
  .bpad-btn-danger:hover{background:#fdecea}
  .bpad-table-preview{display:inline-grid;gap:1px;background:#c4c4c4;border:1px solid #c4c4c4;border-radius:3px;overflow:hidden;margin-top:4px}
  .bpad-table-preview-cell{width:22px;height:18px;background:#fff}
  .bpad-table-preview-cell.bpad-hl{background:#d1e8ff}
  @media (max-width:768px){
    .bpad-toolbar-row{padding:2px 4px;min-height:38px}
    .bpad-btn{width:34px;height:34px}
    .bpad-btn svg{width:19px;height:19px}
    .bpad-drop{height:34px;padding:0 24px 0 8px;font-size:12.5px}
    .bpad-drop-label{max-width:80px}
    .bpad-split{height:34px;padding:0 3px 0 6px}
    .bpad-handle{width:16px;height:16px;border-width:2.5px}
    .bpad-h-nw{left:-9px;top:-9px}
    .bpad-h-n{left:50%;top:-9px;margin-left:-8px}
    .bpad-h-ne{right:-9px;top:-9px}
    .bpad-h-e{right:-9px;top:50%;margin-top:-8px}
    .bpad-h-se{right:-9px;bottom:-9px}
    .bpad-h-s{left:50%;bottom:-9px;margin-left:-8px}
    .bpad-h-sw{left:-9px;bottom:-9px}
    .bpad-h-w{left:-9px;top:50%;margin-top:-8px}
    .bpad-modal{max-width:100%}
  }
  @media print{
    .bpad-root{height:auto !important;min-height:0 !important;border:none}
    .bpad-toolbar,.bpad-footer,.bpad-float,.bpad-img-overlay,.bpad-toast,.bpad-hint,.bpad-caret,.bpad-modal-backdrop{display:none !important}
    .bpad-editor-wrap{overflow:visible}
    .bpad-editor{padding:0}
  }
  `;

  /* Inject CSS once */
  function injectCSS() {
    if (document.getElementById(CSS_ID)) return;
    var st = document.createElement('style');
    st.id = CSS_ID;
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* =========================================================
     ICONS
  ========================================================= */
  var I = {
    undo:'<svg viewBox="0 0 24 24"><path d="M8 5L3 9l5 4V5z"/><path d="M3 9h11a5 5 0 0 1 5 5v1a4 4 0 0 1-4 4h-1"/></svg>',
    redo:'<svg viewBox="0 0 24 24"><path d="M16 5l5 4-5 4V5z"/><path d="M21 9H10a5 5 0 0 0-5 5v1a4 4 0 0 0 4 4h1"/></svg>',
    bold:'<svg viewBox="0 0 24 24"><path d="M7 5h6a4 4 0 0 1 0 8H7z" stroke-width="1.8"/><path d="M7 13h7a4 4 0 0 1 0 8H7z" stroke-width="1.8"/></svg>',
    italic:'<svg viewBox="0 0 24 24"><path d="M10 5h8M6 19h8M15 5L9 19"/></svg>',
    underline:'<svg viewBox="0 0 24 24"><path d="M7 5v7a5 5 0 0 0 10 0V5"/><path d="M5 20h14"/></svg>',
    strike:'<svg viewBox="0 0 24 24"><path d="M16 7c-.5-1.5-2-2.5-4-2.5s-4 1-4 3 2 3 4 3.5"/><path d="M8 17c.5 1.5 2 2.5 4 2.5s4-1 4-3"/><path d="M4 12h16"/></svg>',
    code:'<svg viewBox="0 0 24 24"><path d="M9 8l-5 4 5 4"/><path d="M15 8l5 4-5 4"/></svg>',
    superscript:'<svg viewBox="0 0 24 24"><path d="M5 8l9 10M14 8L5 18"/><path d="M18 8h5v-1l-4 3"/><path d="M18 7l5-3"/></svg>',
    subscript:'<svg viewBox="0 0 24 24"><path d="M5 5l9 10M14 5L5 15"/><path d="M18 20h5v-1l-4 3"/><path d="M18 19l5-3"/></svg>',
    link:'<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1"/><path d="M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"/></svg>',
    image:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5-8 8"/></svg>',
    table:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M3 15h18M9 4v16M15 4v16"/></svg>',
    hr:'<svg viewBox="0 0 24 24"><path d="M3 12h18"/><path d="M6 7h12M6 17h12" opacity=".35"/></svg>',
    blockquote:'<svg viewBox="0 0 24 24"><path d="M3 9h5v5a3 3 0 0 1-3 3"/><path d="M13 9h5v5a3 3 0 0 1-3 3"/></svg>',
    clear:'<svg viewBox="0 0 24 24"><path d="M5 7h13"/><path d="M9 7l-2.5 12M15 7l-.5 4"/><path d="M15.5 15.5l4 4M19.5 15.5l-4 4"/></svg>',
    textColor:'<svg viewBox="0 0 24 24"><path d="M5 18L10 6l5 12"/><path d="M7 14h6"/></svg>',
    hilite:'<svg viewBox="0 0 24 24"><path d="M12 3l6 6-7 7-6-6 7-7z"/><path d="M6 16l-2 4 4-2"/></svg>',
    alignLeft:'<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h12M3 18h15"/></svg>',
    alignCenter:'<svg viewBox="0 0 24 24"><path d="M3 6h18M6 12h12M4 18h16"/></svg>',
    alignRight:'<svg viewBox="0 0 24 24"><path d="M3 6h18M9 12h12M6 18h15"/></svg>',
    alignJustify:'<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    ul:'<svg viewBox="0 0 24 24"><path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none"/></svg>',
    ol:'<svg viewBox="0 0 24 24"><path d="M10 6h11M10 12h11M10 18h11"/><text x="2" y="9" font-size="8" fill="currentColor" stroke="none" font-weight="700">1</text><text x="2" y="15" font-size="8" fill="currentColor" stroke="none" font-weight="700">2</text><text x="2" y="21" font-size="8" fill="currentColor" stroke="none" font-weight="700">3</text></svg>',
    outdent:'<svg viewBox="0 0 24 24"><path d="M10 6h11M10 12h11M10 18h11"/><path d="M3 9l4 3-4 3z" fill="currentColor"/></svg>',
    indent:'<svg viewBox="0 0 24 24"><path d="M10 6h11M10 12h11M10 18h11"/><path d="M7 9l-4 3 4 3z" fill="currentColor"/></svg>',
    source:'<svg viewBox="0 0 24 24"><path d="M9 18l-6-6 6-6"/><path d="M15 6l6 6-6 6"/></svg>',
    fullscreen:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    fullscreenExit:'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    warning:'<svg viewBox="0 0 24 24"><path d="M12 3L2 20h20z"/><path d="M12 10v4M12 17v.01"/></svg>',
    close:'<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    imgLeft:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="10" height="12" rx="1"/><path d="M16 9h5M16 12h5M16 15h5"/></svg>',
    imgCenter:'<svg viewBox="0 0 24 24"><rect x="7" y="6" width="10" height="12" rx="1"/><path d="M3 9h2M3 12h2M3 15h2M19 9h2M19 12h2M19 15h2"/></svg>',
    imgRight:'<svg viewBox="0 0 24 24"><rect x="11" y="6" width="10" height="12" rx="1"/><path d="M3 9h5M3 12h5M3 15h5"/></svg>',
    imgFull:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1"/></svg>',
    imgReset:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    imgCaption:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M6 20h12"/></svg>',
    imgAlt:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9.5a3 3 0 0 1 5.8 1c0 2-2.8 2.5-2.8 2.5"/><path d="M12 17v.01"/></svg>',
    imgReplace:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6 2.5L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6-2.5L3 16"/><path d="M3 21v-5h5"/></svg>',
    trash:'<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>',
    rowAbove:'<svg viewBox="0 0 24 24"><path d="M12 21V9"/><path d="M8 13l4-4 4 4"/><rect x="3" y="17" width="18" height="4" rx="1"/></svg>',
    rowBelow:'<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><rect x="3" y="17" width="18" height="4" rx="1"/></svg>',
    rowDel:'<svg viewBox="0 0 24 24"><path d="M3 6h18M3 18h18"/><path d="M8 12h8"/><path d="M12 9l3 3-3 3"/></svg>',
    colLeft:'<svg viewBox="0 0 24 24"><path d="M21 12H9"/><path d="M13 8l-4 4 4 4"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>',
    colRight:'<svg viewBox="0 0 24 24"><path d="M3 12h12"/><path d="M11 8l4 4-4 4"/><rect x="3" y="3" width="4" height="18" rx="1"/></svg>',
    colDel:'<svg viewBox="0 0 24 24"><path d="M6 3v18M18 3v18"/><path d="M12 8v8"/><path d="M9 12l3 3 3-3"/></svg>',
    merge:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M12 4v16"/><path d="M8 12l4-2 4 2"/></svg>',
    split:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M12 4v16"/><path d="M6 10l-2 2 2 2M18 10l2 2-2 2"/></svg>',
    header:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18"/><path d="M7 7h2M12 7h2M17 7h2"/></svg>',
    tableDel:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 12h6M12 9v6"/></svg>',
    h1:'<svg viewBox="0 0 24 24"><path d="M3 6v12M11 6v12M3 12h8"/><path d="M15 10l3-2v10"/></svg>',
    h2:'<svg viewBox="0 0 24 24"><path d="M3 6v12M11 6v12M3 12h8"/><path d="M15 10h5c0 4-5 3-5 6h5"/></svg>',
    h3:'<svg viewBox="0 0 24 24"><path d="M3 6v12M11 6v12M3 12h8"/><path d="M15 10h4l-3 3h1a2 2 0 0 1 0 4h-2"/></svg>',
    h4:'<svg viewBox="0 0 24 24"><path d="M3 6v12M11 6v12M3 12h8"/><path d="M15 17v-7h4l-4 4h5"/></svg>',
    paragraph:'<svg viewBox="0 0 24 24"><path d="M13 4v16M17 4v16M19 4h-8.5a4.5 4.5 0 0 0 0 9H13"/></svg>',
    callout:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5"/></svg>',
    takeaway:'<svg viewBox="0 0 24 24"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    toc:'<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none"/></svg>',
    divider:'<svg viewBox="0 0 24 24"><path d="M3 12h18"/></svg>'
  };

  /* =========================================================
     UTILITIES
  ========================================================= */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function debounce(fn, ms) {
    var t = null;
    var wrapped = function () {
      var a = arguments, ctx = this;
      if (t) clearTimeout(t);
      t = setTimeout(function () { t = null; fn.apply(ctx, a); }, ms);
    };
    wrapped.cancel = function () { if (t) { clearTimeout(t); t = null; } };
    return wrapped;
  }

  function slugId(text, i) {
    var base = String(text || 'section').toLowerCase()
      .replace(/[^\w\u0900-\u097F]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    return (base || 'section') + '-' + (i || 0) + '-' + Math.random().toString(36).slice(2, 6);
  }

  function mergeStyle(el, newStyle) {
    if (!el || !newStyle || el.nodeType !== 1) return;
    var existing = el.getAttribute('style') || '';
    var map = {};
    existing.split(';').forEach(function (rule) {
      var i = rule.indexOf(':');
      if (i > 0) {
        var k = rule.slice(0, i).trim().toLowerCase();
        var v = rule.slice(i + 1).trim();
        if (k && v) map[k] = v;
      }
    });
    newStyle.split(';').forEach(function (rule) {
      var i = rule.indexOf(':');
      if (i > 0) {
        var k = rule.slice(0, i).trim().toLowerCase();
        var v = rule.slice(i + 1).trim();
        if (k && v && !(k in map)) map[k] = v;
      }
    });
    var merged = Object.keys(map).map(function (k) { return k + ':' + map[k]; }).join(';');
    el.setAttribute('style', merged);
  }

  /* =========================================================
     CORE EDITOR
  ========================================================= */
  function init(target, options) {
    var opts = Object.assign({
      height: 740,
      placeholder: 'Type your text here…',
      initialContent: '',
      showStatus: true,
      onChange: null,
      onReady: null,
      onPublish: null,
      onDestroy: null
    }, options || {});

    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) {
      console.error('[BlogPad] Target element not found:', target);
      return null;
    }

    injectCSS();

    var isTextarea = el.tagName === 'TEXTAREA';
    var startContent = isTextarea ? (el.value || opts.initialContent) : (el.innerHTML || opts.initialContent);

    /* ---------- BUILD DOM ---------- */
    var root = document.createElement('div');
    root.className = 'bpad-root';
    root.id = 'bpad-' + Math.random().toString(36).slice(2, 9);
    var h = parseInt(opts.height, 10) || 740;
    root.style.height = h + 'px';
    root.style.minHeight = '320px';
    root.style.maxHeight = '92vh';
    root.style.width = '100%';

    /* Toolbar */
    var toolbar = document.createElement('div');
    toolbar.className = 'bpad-toolbar';

    var row1 = document.createElement('div');
    row1.className = 'bpad-toolbar-row';
    row1.innerHTML =
      '<button type="button" class="bpad-btn" data-cmd="undo" title="Undo (Ctrl+Z)">' + I.undo + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="redo" title="Redo (Ctrl+Y)">' + I.redo + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-drop" data-role="block-toggle" title="Paragraph style"><span class="bpad-drop-label" data-role="block-label">Paragraph</span><span class="bpad-drop-arrow"></span></button>' +
      '<button type="button" class="bpad-drop" data-role="font-toggle" title="Font family"><span class="bpad-drop-label" data-role="font-label">Default</span><span class="bpad-drop-arrow"></span></button>' +
      '<button type="button" class="bpad-drop" data-role="size-toggle" title="Font size" style="min-width:70px"><span class="bpad-drop-label" data-role="size-label">16px</span><span class="bpad-drop-arrow"></span></button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn" data-cmd="bold" title="Bold (Ctrl+B)">' + I.bold + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="italic" title="Italic (Ctrl+I)">' + I.italic + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="underline" title="Underline (Ctrl+U)">' + I.underline + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="strikeThrough" title="Strikethrough">' + I.strike + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="superscript" title="Superscript">' + I.superscript + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="subscript" title="Subscript">' + I.subscript + '</button>' +
      '<button type="button" class="bpad-btn" data-role="inline-code" title="Inline code">' + I.code + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-split" data-role="fore-split" title="Text color"><span style="position:relative;display:inline-flex">' + I.textColor + '<span class="bpad-color-bar" data-role="fore-bar" style="background:#333"></span></span><span class="bpad-split-arrow"></span></button>' +
      '<button type="button" class="bpad-split" data-role="hilite-split" title="Highlight color"><span style="position:relative;display:inline-flex">' + I.hilite + '<span class="bpad-color-bar" data-role="hilite-bar" style="background:#ffff00"></span></span><span class="bpad-split-arrow"></span></button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn" data-role="clear-format" title="Clear formatting">' + I.clear + '</button>' +
      '<span class="bpad-toolbar-spacer"></span>' +
      '<button type="button" class="bpad-btn" data-role="source" title="Source code">' + I.source + '</button>' +
      '<button type="button" class="bpad-btn" data-role="fullscreen" title="Fullscreen">' + I.fullscreen + '</button>';

    var row2 = document.createElement('div');
    row2.className = 'bpad-toolbar-row';
    row2.innerHTML =
      '<button type="button" class="bpad-drop" data-role="align-toggle" title="Alignment" style="min-width:56px"><span style="display:inline-flex;width:18px;height:18px" data-role="align-icon">' + I.alignLeft + '</span><span class="bpad-drop-arrow"></span></button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn" data-cmd="insertUnorderedList" title="Bulleted list">' + I.ul + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="insertOrderedList" title="Numbered list">' + I.ol + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="outdent" title="Decrease indent">' + I.outdent + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="indent" title="Increase indent">' + I.indent + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn" data-role="link" title="Link (Ctrl+K)">' + I.link + '</button>' +
      '<button type="button" class="bpad-btn" data-role="image" title="Insert image">' + I.image + '</button>' +
      '<button type="button" class="bpad-btn" data-role="table" title="Insert table">' + I.table + '</button>' +
      '<button type="button" class="bpad-btn" data-cmd="insertHorizontalRule" title="Horizontal line">' + I.hr + '</button>' +
      '<button type="button" class="bpad-btn" data-role="blockquote" title="Blockquote">' + I.blockquote + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-drop" data-role="insert-toggle" title="Insert block"><span style="display:inline-flex;width:16px;height:16px">' + I.plus + '</span><span class="bpad-drop-label">Insert</span><span class="bpad-drop-arrow"></span></button>';

    toolbar.appendChild(row1);
    toolbar.appendChild(row2);
    root.appendChild(toolbar);

    /* Editor body */
    var editorWrap = document.createElement('div');
    editorWrap.className = 'bpad-editor-wrap';

    var editor = document.createElement('div');
    editor.className = 'bpad-editor';
    editor.contentEditable = 'true';
    editor.spellcheck = true;
    editor.setAttribute('data-placeholder', opts.placeholder);
    editor.innerHTML = startContent;
    editorWrap.appendChild(editor);

    var source = document.createElement('textarea');
    source.className = 'bpad-source';
    source.spellcheck = false;

    root.appendChild(editorWrap);
    root.appendChild(source);

    /* Footer */
    var footer = null;
    if (opts.showStatus) {
      footer = document.createElement('div');
      footer.className = 'bpad-footer';
      footer.innerHTML =
        '<span class="bpad-stat" data-role="words">Words: 0</span>' +
        '<span class="bpad-stat" data-role="chars">Characters: 0</span>' +
        '<span class="bpad-spacer"></span>' +
        '<span class="bpad-footer-link">BlogPad v' + VERSION + '</span>';
      root.appendChild(footer);
    }

    /* Menus */
    var blockMenu = document.createElement('div');
    blockMenu.className = 'bpad-menu';
    blockMenu.setAttribute('data-role', 'block-menu');
    blockMenu.innerHTML =
      '<div class="bpad-menu-item" data-block="p" data-active="true"><span class="bpad-menu-check">' + I.check + '</span><span class="bpad-menu-icon">' + I.paragraph + '</span><span class="bpad-menu-label">Paragraph</span><span class="bpad-menu-shortcut">Ctrl+Alt+0</span></div>' +
      '<div class="bpad-menu-item" data-block="h1"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.h1 + '</span><span class="bpad-menu-label">Heading 1</span><span class="bpad-menu-shortcut">Ctrl+Alt+1</span></div>' +
      '<div class="bpad-menu-item" data-block="h2"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.h2 + '</span><span class="bpad-menu-label">Heading 2</span><span class="bpad-menu-shortcut">Ctrl+Alt+2</span></div>' +
      '<div class="bpad-menu-item" data-block="h3"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.h3 + '</span><span class="bpad-menu-label">Heading 3</span><span class="bpad-menu-shortcut">Ctrl+Alt+3</span></div>' +
      '<div class="bpad-menu-item" data-block="h4"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.h4 + '</span><span class="bpad-menu-label">Heading 4</span></div>' +
      '<div class="bpad-menu-sep"></div>' +
      '<div class="bpad-menu-item" data-block="blockquote"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.blockquote + '</span><span class="bpad-menu-label">Quote</span></div>' +
      '<div class="bpad-menu-item" data-block="pre"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.code + '</span><span class="bpad-menu-label">Code block</span></div>';
    root.appendChild(blockMenu);

    var fontMenu = document.createElement('div');
    fontMenu.className = 'bpad-menu';
    fontMenu.setAttribute('data-role', 'font-menu');
    var fonts = [
      { v: '', l: 'Default' }, { v: 'Arial, sans-serif', l: 'Arial' },
      { v: 'Georgia, serif', l: 'Georgia' }, { v: '"Times New Roman", serif', l: 'Times New Roman' },
      { v: '"Courier New", monospace', l: 'Courier New' }, { v: 'Verdana, sans-serif', l: 'Verdana' },
      { v: 'Calibri, sans-serif', l: 'Calibri' }, { v: 'Mangal, sans-serif', l: 'Mangal (Hindi)' }
    ];
    fontMenu.innerHTML = fonts.map(function (f) {
      return '<div class="bpad-menu-item" data-font="' + esc(f.v) + '"><span class="bpad-menu-check"></span><span class="bpad-menu-label" style="font-family:' + (f.v || 'inherit') + '">' + f.l + '</span></div>';
    }).join('');
    root.appendChild(fontMenu);

    var sizeMenu = document.createElement('div');
    sizeMenu.className = 'bpad-menu';
    sizeMenu.setAttribute('data-role', 'size-menu');
    sizeMenu.style.minWidth = '110px';
    var sizes = ['10px','11px','12px','13px','14px','15px','16px','17px','18px','20px','22px','24px','28px','32px','40px','48px'];
    sizeMenu.innerHTML = sizes.map(function (s) {
      return '<div class="bpad-menu-item" data-size="' + s + '"' + (s === '16px' ? ' data-active="true"' : '') + '><span class="bpad-menu-check">' + (s === '16px' ? I.check : '') + '</span><span class="bpad-menu-label">' + s.replace('px', '') + '</span></div>';
    }).join('');
    root.appendChild(sizeMenu);

    var alignMenu = document.createElement('div');
    alignMenu.className = 'bpad-menu';
    alignMenu.setAttribute('data-role', 'align-menu');
    alignMenu.innerHTML =
      '<div class="bpad-menu-item" data-align="justifyLeft" data-active="true"><span class="bpad-menu-check">' + I.check + '</span><span class="bpad-menu-icon">' + I.alignLeft + '</span><span class="bpad-menu-label">Align left</span></div>' +
      '<div class="bpad-menu-item" data-align="justifyCenter"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.alignCenter + '</span><span class="bpad-menu-label">Align center</span></div>' +
      '<div class="bpad-menu-item" data-align="justifyRight"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.alignRight + '</span><span class="bpad-menu-label">Align right</span></div>' +
      '<div class="bpad-menu-item" data-align="justifyFull"><span class="bpad-menu-check"></span><span class="bpad-menu-icon">' + I.alignJustify + '</span><span class="bpad-menu-label">Justify</span></div>';
    root.appendChild(alignMenu);

    var insertMenu = document.createElement('div');
    insertMenu.className = 'bpad-menu';
    insertMenu.setAttribute('data-role', 'insert-menu');
    insertMenu.innerHTML =
      '<div class="bpad-menu-item" data-insert="callout"><span class="bpad-menu-icon">' + I.callout + '</span><span class="bpad-menu-label">Callout / Note</span></div>' +
      '<div class="bpad-menu-item" data-insert="takeaway"><span class="bpad-menu-icon">' + I.takeaway + '</span><span class="bpad-menu-label">Key takeaway</span></div>' +
      '<div class="bpad-menu-item" data-insert="divider"><span class="bpad-menu-icon">' + I.divider + '</span><span class="bpad-menu-label">Divider</span></div>' +
      '<div class="bpad-menu-sep"></div>' +
      '<div class="bpad-menu-item" data-insert="toc"><span class="bpad-menu-icon">' + I.toc + '</span><span class="bpad-menu-label">Table of contents</span></div>';
    root.appendChild(insertMenu);

    var foreMenu = document.createElement('div');
    foreMenu.className = 'bpad-menu';
    foreMenu.setAttribute('data-role', 'fore-menu');
    foreMenu.style.minWidth = '230px';
    var textColors = ['#000000','#333333','#666666','#999999','#cccccc','#ffffff','#d32f2f','#e64a19','#f57c00','#fbc02d','#388e3c','#0097a7','#1976d2','#303f9f','#7b1fa2','#c2185b'];
    foreMenu.innerHTML =
      '<div class="bpad-menu-header">Text color</div>' +
      '<div class="bpad-color-grid">' + textColors.map(function (c) {
        return '<button type="button" class="bpad-color-swatch" data-color="' + c + '" title="' + c + '" style="background:' + c + '"></button>';
      }).join('') + '</div>' +
      '<div class="bpad-color-custom"><input type="color" data-role="fore-custom" value="#333333"><span>Custom</span></div>';
    root.appendChild(foreMenu);

    var hiliteMenu = document.createElement('div');
    hiliteMenu.className = 'bpad-menu';
    hiliteMenu.setAttribute('data-role', 'hilite-menu');
    hiliteMenu.style.minWidth = '230px';
    var bgColors = ['', '#ffff00','#ffeb3b','#ffcdd2','#f8bbd0','#e1bee7','#c5cae9','#bbdefb','#b3e5fc','#b2dfdb','#c8e6c9','#dcedc8','#f0f4c3','#ffe0b2','#d7ccc8','#e0e0e0'];
    hiliteMenu.innerHTML =
      '<div class="bpad-menu-header">Highlight color</div>' +
      '<div class="bpad-color-grid">' + bgColors.map(function (c) {
        if (c === '') return '<button type="button" class="bpad-color-swatch" data-color="transparent" title="No color" data-transparent="true"></button>';
        return '<button type="button" class="bpad-color-swatch" data-color="' + c + '" title="' + c + '" style="background:' + c + '"></button>';
      }).join('') + '</div>' +
      '<div class="bpad-color-custom"><input type="color" data-role="hilite-custom" value="#ffff00"><span>Custom</span></div>';
    root.appendChild(hiliteMenu);

    /* Floating toolbars */
    var imgFb = document.createElement('div');
    imgFb.className = 'bpad-float';
    imgFb.setAttribute('data-role', 'img-toolbar');
    imgFb.innerHTML =
      '<button type="button" class="bpad-btn" data-img="left" title="Float left">' + I.imgLeft + '</button>' +
      '<button type="button" class="bpad-btn" data-img="center" title="Center">' + I.imgCenter + '</button>' +
      '<button type="button" class="bpad-btn" data-img="right" title="Float right">' + I.imgRight + '</button>' +
      '<button type="button" class="bpad-btn" data-img="full" title="Full width">' + I.imgFull + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn" data-img="reset" title="Reset size">' + I.imgReset + '</button>' +
      '<button type="button" class="bpad-btn" data-img="caption" title="Add caption">' + I.imgCaption + '</button>' +
      '<button type="button" class="bpad-btn" data-img="alt" title="Alt text">' + I.imgAlt + '</button>' +
      '<button type="button" class="bpad-btn" data-img="replace" title="Replace image">' + I.imgReplace + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn bpad-btn-danger" data-img="delete" title="Delete image">' + I.trash + '</button>';
    root.appendChild(imgFb);

    var tblFb = document.createElement('div');
    tblFb.className = 'bpad-float';
    tblFb.setAttribute('data-role', 'table-toolbar');
    tblFb.innerHTML =
      '<button type="button" class="bpad-btn" data-tbl="row-above" title="Row above">' + I.rowAbove + '</button>' +
      '<button type="button" class="bpad-btn" data-tbl="row-below" title="Row below">' + I.rowBelow + '</button>' +
      '<button type="button" class="bpad-btn bpad-btn-danger" data-tbl="row-del" title="Delete row">' + I.rowDel + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn" data-tbl="col-left" title="Column left">' + I.colLeft + '</button>' +
      '<button type="button" class="bpad-btn" data-tbl="col-right" title="Column right">' + I.colRight + '</button>' +
      '<button type="button" class="bpad-btn bpad-btn-danger" data-tbl="col-del" title="Delete column">' + I.colDel + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn" data-tbl="merge" title="Merge cells">' + I.merge + '</button>' +
      '<button type="button" class="bpad-btn" data-tbl="split" title="Split cell">' + I.split + '</button>' +
      '<button type="button" class="bpad-btn" data-tbl="header" title="Toggle header row">' + I.header + '</button>' +
      '<span class="bpad-sep"></span>' +
      '<button type="button" class="bpad-btn bpad-btn-danger" data-tbl="table-del" title="Delete table">' + I.tableDel + '</button>';
    root.appendChild(tblFb);

    var overlay = document.createElement('div');
    overlay.className = 'bpad-img-overlay';
    ['nw','n','ne','e','se','s','sw','w'].forEach(function (d) {
      var hh = document.createElement('div');
      hh.className = 'bpad-handle bpad-h-' + d;
      hh.setAttribute('data-dir', d);
      overlay.appendChild(hh);
    });
    root.appendChild(overlay);

    var caret = document.createElement('div');
    caret.className = 'bpad-caret';
    root.appendChild(caret);

    var toastEl = document.createElement('div');
    toastEl.className = 'bpad-toast';
    root.appendChild(toastEl);

    var hintEl = document.createElement('div');
    hintEl.className = 'bpad-hint';
    root.appendChild(hintEl);

    var fileIn = document.createElement('input');
    fileIn.type = 'file'; fileIn.accept = 'image/*'; fileIn.style.display = 'none';
    root.appendChild(fileIn);

    var replaceIn = document.createElement('input');
    replaceIn.type = 'file'; replaceIn.accept = 'image/*'; replaceIn.style.display = 'none';
    root.appendChild(replaceIn);

    var modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'bpad-modal-backdrop';
    modalBackdrop.innerHTML =
      '<div class="bpad-modal" role="dialog" aria-modal="true">' +
        '<div class="bpad-modal-header">' +
          '<h3 class="bpad-modal-title" data-role="modal-title"></h3>' +
          '<button type="button" class="bpad-modal-close" data-role="modal-close" aria-label="Close">' + I.close + '</button>' +
        '</div>' +
        '<div class="bpad-modal-body" data-role="modal-body"></div>' +
        '<div class="bpad-modal-footer" data-role="modal-footer"></div>' +
      '</div>';
    root.appendChild(modalBackdrop);

    /* Mount */
    var mount = document.createElement('div');
    mount.className = 'bpad-mount';
    mount.style.cssText = 'display:block;width:100%;';
    mount.appendChild(root);

    if (isTextarea) {
      el.style.display = 'none';
      if (el.parentNode) el.parentNode.insertBefore(mount, el.nextSibling);
      else document.body.appendChild(mount);
    } else {
      el.innerHTML = '';
      el.appendChild(mount);
    }

    /* =========================================================
       STATE
    ========================================================= */
    var state = {
      savedRange: null,
      selectedImg: null,
      activeCell: null,
      replaceTarget: null,
      dragGhost: null,
      dragStart: null,
      suppressClick: false,
      lastFore: '#333333',
      lastHilite: '#ffff00',
      isFullscreen: false,
      openMenuRef: null,
      modalState: null,
      destroyed: false
    };

    /* =========================================================
       HELPERS
    ========================================================= */
    function toast(msg, icon) {
      if (state.destroyed) return;
      toastEl.innerHTML = (icon === 'warning' ? I.warning : I.check) + '<span>' + esc(msg) + '</span>';
      toastEl.setAttribute('data-open', 'true');
      clearTimeout(toastEl._t);
      toastEl._t = setTimeout(function () {
        if (!state.destroyed) toastEl.setAttribute('data-open', 'false');
      }, 2000);
    }

    function showHint(msg, ms) {
      if (state.destroyed) return;
      hintEl.textContent = msg;
      hintEl.setAttribute('data-open', 'true');
      clearTimeout(hintEl._t);
      hintEl._t = setTimeout(function () {
        if (!state.destroyed) hintEl.setAttribute('data-open', 'false');
      }, ms || 1500);
    }

    function focusEditor() {
      if (state.destroyed) return;
      try { editor.focus({ preventScroll: true }); } catch (e) { editor.focus(); }
    }

    function saveSel() {
      try {
        var s = window.getSelection();
        if (s.rangeCount) {
          var r = s.getRangeAt(0);
          if (editor.contains(r.commonAncestorContainer)) state.savedRange = r.cloneRange();
        }
      } catch (e) {}
    }

    function restoreSel() {
      if (!state.savedRange) return false;
      try {
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(state.savedRange);
        return true;
      } catch (e) { return false; }
    }

    function emitChange() {
      if (state.destroyed) return;
      if (typeof opts.onChange !== 'function') return;
      try { opts.onChange(editor.innerHTML); }
      catch (e) { console.error('[BlogPad] onChange callback error:', e); }
    }

    var scheduleEmit = debounce(emitChange, 300);

    function exec(cmd, val) {
      if (state.destroyed) return;
      focusEditor();
      restoreSel();
      try { document.execCommand(cmd, false, val === undefined ? null : val); }
      catch (e) { console.warn('[BlogPad] execCommand failed:', cmd, e); }
      if (cmd === 'formatBlock' || cmd === 'insertUnorderedList' || cmd === 'insertOrderedList') {
        setTimeout(function () {
          if (state.destroyed) return;
          applyInlineStyles(editor);
          styleCurrentBlock();
        }, 0);
      }
      saveSel();
      updateToolbarState();
      updateCounts();
      updatePlaceholder();
      scheduleEmit();
    }

    function insertHTML(html) {
      if (state.destroyed) return;
      focusEditor();
      restoreSel();
      try { document.execCommand('insertHTML', false, html); }
      catch (e) { console.warn('[BlogPad] insertHTML failed:', e); }
      setTimeout(function () {
        if (state.destroyed) return;
        applyInlineStyles(editor);
      }, 0);
      saveSel();
      prepImgs();
      updateCounts();
      updatePlaceholder();
      scheduleEmit();
    }

    /* =========================================================
       STYLE INLINING
    ========================================================= */
    function styleElement(el) {
      if (!el || el.nodeType !== 1) return;
      var tag = el.tagName.toLowerCase();
      var map = {
        h1: IS.h1, h2: IS.h2, h3: IS.h3, h4: IS.h4,
        p: IS.p, blockquote: IS.blockquote, pre: IS.pre,
        a: IS.a, ul: IS.ul, ol: IS.ol, li: IS.li, hr: IS.hr,
        table: IS.table, td: IS.td, th: IS.th,
        figure: IS.figure, figcaption: IS.figcaption
      };
      if (map[tag]) mergeStyle(el, map[tag]);
      if (tag === 'code') {
        if (el.parentElement && el.parentElement.tagName === 'PRE') mergeStyle(el, IS.preCode);
        else mergeStyle(el, IS.code);
      }
      if (tag === 'img') {
        var align = el.getAttribute('data-bp-align') || 'center';
        var styleMap = { left: IS.imgLeft, right: IS.imgRight, center: IS.imgCenter, full: IS.imgFull };
        mergeStyle(el, styleMap[align] || IS.img);
        el.removeAttribute('class');
      }
      if (el.hasAttribute && el.hasAttribute('data-bp-block')) {
        var type = el.getAttribute('data-bp-block');
        if (type === 'callout') mergeStyle(el, IS.callout);
        else if (type === 'takeaway') mergeStyle(el, IS.takeaway);
        else if (type === 'toc') mergeStyle(el, IS.toc);
        else if (type === 'divider') mergeStyle(el, IS.divider);
      }
      if (tag === 'strong') {
        var parent = el.parentElement;
        if (parent && parent.hasAttribute && parent.hasAttribute('data-bp-block')) {
          var pt = parent.getAttribute('data-bp-block');
          if (pt === 'callout') mergeStyle(el, IS.calloutStrong);
          if (pt === 'takeaway') mergeStyle(el, IS.takeawayStrong);
        }
      }
      /* TOC internals — convert legacy <ol>/<li> to <div> */
      if (el.hasAttribute && el.hasAttribute('data-bp-block') && el.getAttribute('data-bp-block') === 'toc') {
        el.querySelectorAll('strong').forEach(function (s) { mergeStyle(s, IS.tocStrong); });
        el.querySelectorAll('ol').forEach(function (o) {
          var div = document.createElement('div');
          div.setAttribute('style', IS.tocList);
          while (o.firstChild) div.appendChild(o.firstChild);
          o.replaceWith(div);
        });
        el.querySelectorAll('li').forEach(function (l) {
          var div = document.createElement('div');
          var m = (l.getAttribute('style') || '').match(/margin-left:\s*[^;]+/);
          div.setAttribute('style', IS.tocLi + (m ? ';' + m[0] : ''));
          while (l.firstChild) div.appendChild(l.firstChild);
          l.replaceWith(div);
        });
        el.querySelectorAll('ul').forEach(function (u) {
          var div = document.createElement('div');
          div.setAttribute('style', IS.tocList);
          while (u.firstChild) div.appendChild(u.firstChild);
          u.replaceWith(div);
        });
        el.querySelectorAll('a').forEach(function (aa) { mergeStyle(aa, IS.tocLink); });
      }
    }

    function applyInlineStyles(rootEl) {
      if (!rootEl) return;
      var tags = ['h1','h2','h3','h4','p','blockquote','pre','code','a','ul','ol','li','hr','table','td','th','figure','figcaption','img','strong','div'];
      tags.forEach(function (tag) {
        rootEl.querySelectorAll(tag).forEach(function (el) { styleElement(el); });
      });
    }

    function styleCurrentBlock() {
      var sel = window.getSelection();
      if (!sel.rangeCount) return;
      var node = sel.anchorNode;
      if (node && node.nodeType === 3) node = node.parentNode;
      var safety = 0;
      while (node && node !== editor && safety < 30) {
        if (node.nodeType === 1) {
          var tag = node.tagName.toLowerCase();
          if (['h1','h2','h3','h4','p','blockquote','pre','li','div','table','td','th','a','ul','ol','figure','figcaption'].indexOf(tag) !== -1) {
            styleElement(node);
          }
        }
        node = node.parentNode;
        safety++;
      }
    }

    /* =========================================================
       MODAL SYSTEM
    ========================================================= */
    var modalTitle = modalBackdrop.querySelector('[data-role="modal-title"]');
    var modalBody = modalBackdrop.querySelector('[data-role="modal-body"]');
    var modalFooter = modalBackdrop.querySelector('[data-role="modal-footer"]');
    var modalClose = modalBackdrop.querySelector('[data-role="modal-close"]');

    function onModalKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        var target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT') {
          e.preventDefault();
          var primary = modalFooter.querySelector('.bpad-btn-primary');
          if (primary) primary.click();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModalWith(null);
      }
    }

    function openModal(config) {
      if (state.destroyed) return;
      modalTitle.textContent = config.title || '';
      modalBody.innerHTML = config.bodyHTML || '';
      modalFooter.innerHTML = '';
      state.modalState = config;

      var buttons = config.buttons || [
        { label: 'Cancel', value: null, class: 'bpad-btn-secondary' },
        { label: 'OK', value: 'ok', class: 'bpad-btn-primary', primary: true }
      ];
      buttons.forEach(function (btn) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = btn.class || 'bpad-btn-secondary';
        if (btn.danger) b.classList.add('bpad-btn-danger');
        b.textContent = btn.label;
        b.addEventListener('click', function () { closeModalWith(btn.value); });
        modalFooter.appendChild(b);
      });

      modalBackdrop.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';

      setTimeout(function () {
        if (state.destroyed) return;
        var first = modalBody.querySelector('input, textarea, select');
        if (first) {
          first.focus();
          if (first.select) try { first.select(); } catch (e) {}
        }
        if (typeof config.onOpen === 'function') config.onOpen(modalBody);
      }, 30);

      if (config.submitOnEnter !== false) modalBody.addEventListener('keydown', onModalKeydown);
    }

    function closeModalWith(value) {
      if (!state.modalState) return;
      var cfg = state.modalState;
      state.modalState = null;
      modalBackdrop.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
      modalBody.removeEventListener('keydown', onModalKeydown);
      setTimeout(function () { if (!state.destroyed) focusEditor(); }, 0);
      if (typeof cfg.onSubmit === 'function') {
        try { cfg.onSubmit(value, modalBody); }
        catch (e) { console.error('[BlogPad] modal onSubmit error:', e); }
      }
    }

    modalClose.addEventListener('click', function () { closeModalWith(null); });
    modalBackdrop.addEventListener('pointerdown', function (e) {
      if (e.target === modalBackdrop) closeModalWith(null);
    });

    /* ---- Link Modal ---- */
    function openLinkModal() {
      restoreSel();
      var sel = window.getSelection();
      var selText = '', existing = null;
      if (sel.rangeCount) {
        var node = sel.anchorNode;
        if (node && node.nodeType === 3) node = node.parentNode;
        existing = node && node.closest ? node.closest('a') : null;
        if (!sel.getRangeAt(0).collapsed) selText = sel.toString();
      }
      var isEdit = !!existing;
      var bodyHTML =
        '<div class="bpad-field">' +
          '<label class="bpad-field-label">Link text</label>' +
          '<input type="text" class="bpad-input" data-field="text" placeholder="Link text" value="' + esc(isEdit ? existing.textContent : selText) + '">' +
        '</div>' +
        '<div class="bpad-field">' +
          '<label class="bpad-field-label">URL</label>' +
          '<input type="url" class="bpad-input" data-field="url" placeholder="https://example.com" value="' + esc(isEdit ? existing.getAttribute('href') || '' : '') + '">' +
        '</div>' +
        '<label class="bpad-checkbox"><input type="checkbox" data-field="newtab"' + (isEdit ? (existing.getAttribute('target') === '_blank' ? ' checked' : '') : ' checked') + '> Open in new tab</label>';
      var buttons = [];
      if (isEdit) buttons.push({ label: 'Remove', value: 'remove', class: 'bpad-btn-danger' });
      buttons.push({ label: 'Cancel', value: null, class: 'bpad-btn-secondary' });
      buttons.push({ label: isEdit ? 'Update' : 'Insert Link', value: 'submit', class: 'bpad-btn-primary', primary: true });
      openModal({
        title: isEdit ? 'Edit link' : 'Insert link',
        bodyHTML: bodyHTML,
        buttons: buttons,
        onSubmit: function (val, body) {
          if (val !== 'submit' && val !== 'remove') return;
          var url = (body.querySelector('[data-field="url"]').value || '').trim();
          var text = (body.querySelector('[data-field="text"]').value || '').trim();
          var newtab = body.querySelector('[data-field="newtab"]').checked;
          focusEditor(); restoreSel();
          if (val === 'remove') {
            if (existing) existing.replaceWith(document.createTextNode(existing.textContent));
            updateCounts(); scheduleEmit(); toast('Link removed'); return;
          }
          if (!url) { toast('URL required', 'warning'); return; }
          if (existing) {
            existing.setAttribute('href', url);
            if (newtab) { existing.setAttribute('target', '_blank'); existing.setAttribute('rel', 'noopener'); }
            else { existing.removeAttribute('target'); existing.removeAttribute('rel'); }
            if (text && text !== existing.textContent) existing.textContent = text;
            styleElement(existing);
          } else {
            var linkText = text || url;
            var attrs = ' href="' + esc(url) + '"' + (newtab ? ' target="_blank" rel="noopener"' : '') + ' style="' + IS.a + '"';
            var s = window.getSelection();
            if (s.rangeCount && !s.getRangeAt(0).collapsed) {
              document.execCommand('createLink', false, url);
              var anchors = editor.querySelectorAll('a[href="' + url + '"]');
              var newA = anchors[anchors.length - 1];
              if (newA) {
                if (newtab) { newA.setAttribute('target', '_blank'); newA.setAttribute('rel', 'noopener'); }
                if (text) newA.textContent = text;
                styleElement(newA);
              }
            } else {
              document.execCommand('insertHTML', false, '<a' + attrs + '>' + esc(linkText) + '</a>');
            }
          }
          applyInlineStyles(editor);
          saveSel(); updateCounts(); scheduleEmit();
          toast(existing ? 'Link updated' : 'Link inserted');
        }
      });
    }

    /* ---- Table Modal ---- */
    function openTableModal() {
      var bodyHTML =
        '<div class="bpad-field">' +
          '<div class="bpad-input-row">' +
            '<div><label class="bpad-field-label">Rows</label><input type="number" min="1" max="50" class="bpad-input" data-field="rows" value="3"></div>' +
            '<div><label class="bpad-field-label">Columns</label><input type="number" min="1" max="20" class="bpad-input" data-field="cols" value="3"></div>' +
          '</div>' +
        '</div>' +
        '<div class="bpad-field" style="text-align:center;padding-top:6px"><div data-role="table-preview"></div></div>';
      openModal({
        title: 'Insert table',
        bodyHTML: bodyHTML,
        buttons: [
          { label: 'Cancel', value: null, class: 'bpad-btn-secondary' },
          { label: 'Insert Table', value: 'submit', class: 'bpad-btn-primary', primary: true }
        ],
        onOpen: function (body) {
          var rowsInput = body.querySelector('[data-field="rows"]');
          var colsInput = body.querySelector('[data-field="cols"]');
          var preview = body.querySelector('[data-role="table-preview"]');
          function render() {
            var r = Math.max(1, Math.min(50, parseInt(rowsInput.value, 10) || 0));
            var c = Math.max(1, Math.min(20, parseInt(colsInput.value, 10) || 0));
            var pr = Math.min(r, 10), pc = Math.min(c, 10);
            var html = '<div class="bpad-table-preview" style="grid-template-columns:repeat(' + pc + ',22px)">';
            for (var i = 0; i < pr; i++) for (var j = 0; j < pc; j++)
              html += '<div class="bpad-table-preview-cell' + (i === 0 ? ' bpad-hl' : '') + '"></div>';
            html += '</div>';
            if (r > 10 || c > 10) html += '<div style="font-size:11.5px;color:#9a9a9a;margin-top:6px">' + r + ' × ' + c + '</div>';
            preview.innerHTML = html;
          }
          rowsInput.addEventListener('input', render);
          colsInput.addEventListener('input', render);
          render();
        },
        onSubmit: function (val, body) {
          if (val !== 'submit') return;
          var r = Math.max(1, Math.min(50, parseInt(body.querySelector('[data-field="rows"]').value, 10) || 3));
          var c = Math.max(1, Math.min(20, parseInt(body.querySelector('[data-field="cols"]').value, 10) || 3));
          var html = '<table style="' + IS.table + '"><tbody>';
          for (var i = 0; i < r; i++) {
            html += '<tr style="vertical-align:top">';
            for (var j = 0; j < c; j++) {
              if (i === 0) html += '<th style="' + IS.th + '"><br></th>';
              else html += '<td style="' + IS.td + '"><br></td>';
            }
            html += '</tr>';
          }
          html += '</tbody></table><p style="' + IS.p + '"><br></p>';
          insertHTML(html);
          toast('Table inserted');
        }
      });
    }

    /* ---- Alt Text Modal ---- */
    function openAltModal(img) {
      var currentAlt = img.getAttribute('alt') || '';
      openModal({
        title: 'Image alt text',
        bodyHTML:
          '<div class="bpad-field">' +
            '<label class="bpad-field-label">Alt text (describe the image for accessibility & SEO)</label>' +
            '<textarea class="bpad-input" rows="3" data-field="alt" placeholder="e.g. Screenshot of the settings page">' + esc(currentAlt) + '</textarea>' +
          '</div>',
        buttons: [
          { label: 'Cancel', value: null, class: 'bpad-btn-secondary' },
          { label: 'Save', value: 'submit', class: 'bpad-btn-primary', primary: true }
        ],
        onSubmit: function (val, body) {
          if (val !== 'submit') return;
          var alt = (body.querySelector('[data-field="alt"]').value || '').trim();
          img.setAttribute('alt', alt);
          scheduleEmit();
          toast('Alt text saved');
        }
      });
    }

    /* =========================================================
       MENU POSITIONING
    ========================================================= */
    function positionFixed(menu, trigger) {
      menu.style.left = '0px';
      menu.style.top = '-9999px';
      var mr = menu.getBoundingClientRect();
      var tr = trigger.getBoundingClientRect();
      var left = tr.left, top = tr.bottom + 4;
      if (left + mr.width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - mr.width - 8);
      if (top + mr.height > window.innerHeight - 8) {
        var above = tr.top - mr.height - 4;
        if (above > 8) top = above;
        else top = Math.max(8, window.innerHeight - mr.height - 8);
      }
      menu.style.left = Math.round(left) + 'px';
      menu.style.top = Math.round(top) + 'px';
    }

    function closeAllMenus() {
      root.querySelectorAll('.bpad-menu[data-open="true"]').forEach(function (m) { m.setAttribute('data-open', 'false'); });
      root.querySelectorAll('[data-open="true"]').forEach(function (b) {
        if (b.hasAttribute('data-role') && /-toggle$/.test(b.getAttribute('data-role'))) b.setAttribute('data-open', 'false');
        if (b.classList && b.classList.contains('bpad-split')) b.setAttribute('data-open', 'false');
      });
      state.openMenuRef = null;
    }

    function openMenu(menu, trigger) {
      closeAllMenus();
      menu.setAttribute('data-open', 'true');
      if (trigger) trigger.setAttribute('data-open', 'true');
      positionFixed(menu, trigger);
      state.openMenuRef = menu;
    }

    /* =========================================================
       EVENT BINDING
    ========================================================= */
    function onClick(el, fn) {
      if (!el) return;
      el.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        fn.call(this, e);
      });
    }

    /* Toolbar buttons — prevent focus loss on mousedown */
    toolbar.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('mousedown', function (e) {
        if (e.button === 0) e.preventDefault();
      });
    });
    [imgFb, tblFb].forEach(function (tb) {
      tb.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('mousedown', function (e) { if (e.button === 0) e.preventDefault(); });
      });
    });
    [blockMenu, fontMenu, sizeMenu, alignMenu, insertMenu, foreMenu, hiliteMenu].forEach(function (m) {
      m.querySelectorAll('button, .bpad-menu-item').forEach(function (b) {
        b.addEventListener('mousedown', function (e) { if (e.button === 0) e.preventDefault(); });
      });
    });

    /* Inline commands */
    toolbar.querySelectorAll('[data-cmd]').forEach(function (btn) {
      onClick(btn, function () { exec(btn.dataset.cmd); });
    });

    onClick(toolbar.querySelector('[data-role="blockquote"]'), function () {
      exec('formatBlock', '<blockquote>');
    });

    onClick(toolbar.querySelector('[data-role="clear-format"]'), function () {
      focusEditor();
      var s = window.getSelection();
      if (!s.rangeCount || !editor.contains(s.anchorNode)) {
        restoreSel();
        s = window.getSelection();
      }
      if (!s.rangeCount || !editor.contains(s.anchorNode)) {
        toast('Click inside editor first', 'warning');
        return;
      }
      var r = s.getRangeAt(0);
      document.execCommand('removeFormat');
      document.execCommand('unlink');
      document.execCommand('formatBlock', false, '<p>');
      try {
        var container = r.commonAncestorContainer;
        if (container.nodeType === 3) container = container.parentNode;
        var safety = 0;
        while (container && container !== editor && safety < 30) {
          if (container.nodeType === 1 &&
              ['TABLE','TR','TD','TH','UL','OL','LI'].indexOf(container.tagName) === -1) {
            container.removeAttribute('style');
            container.removeAttribute('class');
            if (container.hasAttribute && container.hasAttribute('data-bp-align')) container.removeAttribute('data-bp-align');
          }
          container = container.parentNode;
          safety++;
        }
      } catch (e) {}
      setTimeout(function () {
        if (state.destroyed) return;
        applyInlineStyles(editor);
        styleCurrentBlock();
      }, 0);
      saveSel(); updateToolbarState(); updateCounts(); scheduleEmit();
      toast('Formatting cleared');
    });

    onClick(toolbar.querySelector('[data-role="inline-code"]'), function () {
      focusEditor();
      var s = window.getSelection();
      if (!s.rangeCount || !editor.contains(s.anchorNode)) {
        restoreSel();
        s = window.getSelection();
      }
      if (!s.rangeCount || !editor.contains(s.anchorNode)) {
        toast('Click inside editor first', 'warning');
        return;
      }
      var r = s.getRangeAt(0);
      var node = r.commonAncestorContainer;
      if (node && node.nodeType === 3) node = node.parentNode;
      var existingCode = node && node.closest ? node.closest('code') : null;
      if (existingCode && editor.contains(existingCode)) {
        var parent = existingCode.parentNode;
        while (existingCode.firstChild) parent.insertBefore(existingCode.firstChild, existingCode);
        parent.removeChild(existingCode);
        parent.normalize();
        saveSel(); updateCounts(); scheduleEmit();
        toast('Code removed');
        return;
      }
      if (r.collapsed) {
        var code = document.createElement('code');
        code.setAttribute('style', IS.code);
        code.textContent = 'code';
        r.insertNode(code);
        var newRange = document.createRange();
        newRange.selectNodeContents(code);
        s.removeAllRanges();
        s.addRange(newRange);
      } else {
        try {
          var codeWrap = document.createElement('code');
          codeWrap.setAttribute('style', IS.code);
          var frag = r.extractContents();
          codeWrap.appendChild(frag);
          r.insertNode(codeWrap);
          var afterRange = document.createRange();
          afterRange.setStartAfter(codeWrap);
          afterRange.collapse(true);
          s.removeAllRanges();
          s.addRange(afterRange);
        } catch (e) {
          document.execCommand('insertHTML', false, '<code style="' + IS.code + '">' + esc(r.toString()) + '</code>');
        }
      }
      saveSel(); updateCounts(); scheduleEmit();
      toast('Code applied');
    });

    /* Block menu */
    var blockToggle = toolbar.querySelector('[data-role="block-toggle"]');
    var blockLabel = toolbar.querySelector('[data-role="block-label"]');
    onClick(blockToggle, function () {
      if (blockMenu.getAttribute('data-open') === 'true') closeAllMenus();
      else openMenu(blockMenu, blockToggle);
    });
    blockMenu.querySelectorAll('[data-block]').forEach(function (item) {
      onClick(item, function () {
        closeAllMenus();
        var tag = item.dataset.block;
        var labelMap = { p:'Paragraph', h1:'Heading 1', h2:'Heading 2', h3:'Heading 3', h4:'Heading 4', blockquote:'Quote', pre:'Code block' };
        blockLabel.textContent = labelMap[tag] || 'Paragraph';
        exec('formatBlock', '<' + tag + '>');
      });
    });

    /* Font menu */
    var fontToggle = toolbar.querySelector('[data-role="font-toggle"]');
    var fontLabel = toolbar.querySelector('[data-role="font-label"]');
    onClick(fontToggle, function () {
      if (fontMenu.getAttribute('data-open') === 'true') closeAllMenus();
      else openMenu(fontMenu, fontToggle);
    });
    fontMenu.querySelectorAll('[data-font]').forEach(function (item) {
      onClick(item, function () {
        closeAllMenus();
        var v = item.dataset.font;
        fontLabel.textContent = item.querySelector('.bpad-menu-label').textContent;
        if (v) exec('fontName', v);
      });
    });

    /* Size menu */
    var sizeToggle = toolbar.querySelector('[data-role="size-toggle"]');
    var sizeLabel = toolbar.querySelector('[data-role="size-label"]');
    onClick(sizeToggle, function () {
      if (sizeMenu.getAttribute('data-open') === 'true') closeAllMenus();
      else openMenu(sizeMenu, sizeToggle);
    });
    sizeMenu.querySelectorAll('[data-size]').forEach(function (item) {
      onClick(item, function () {
        closeAllMenus();
        var size = item.dataset.size;
        sizeLabel.textContent = size;
        sizeMenu.querySelectorAll('[data-size]').forEach(function (i) {
          i.setAttribute('data-active', i.dataset.size === size ? 'true' : 'false');
          i.querySelector('.bpad-menu-check').innerHTML = i.dataset.size === size ? I.check : '';
        });
        focusEditor(); restoreSel();
        try {
          document.execCommand('styleWithCSS', false, false);
          document.execCommand('fontSize', false, '7');
          document.execCommand('styleWithCSS', false, true);
        } catch (e) {}
        editor.querySelectorAll('font[size="7"]').forEach(function (fe) {
          var sp = document.createElement('span');
          sp.style.fontSize = size;
          while (fe.firstChild) sp.appendChild(fe.firstChild);
          fe.replaceWith(sp);
        });
        saveSel(); updateCounts(); scheduleEmit();
      });
    });

    /* Align menu */
    var alignToggle = toolbar.querySelector('[data-role="align-toggle"]');
    var alignIcon = toolbar.querySelector('[data-role="align-icon"]');
    onClick(alignToggle, function () {
      if (alignMenu.getAttribute('data-open') === 'true') closeAllMenus();
      else openMenu(alignMenu, alignToggle);
    });
    alignMenu.querySelectorAll('[data-align]').forEach(function (item) {
      onClick(item, function () {
        closeAllMenus();
        var cmd = item.dataset.align;
        var iconMap = { justifyLeft: I.alignLeft, justifyCenter: I.alignCenter, justifyRight: I.alignRight, justifyFull: I.alignJustify };
        alignIcon.innerHTML = iconMap[cmd] || I.alignLeft;
        alignMenu.querySelectorAll('[data-align]').forEach(function (i) {
          i.setAttribute('data-active', i.dataset.align === cmd ? 'true' : 'false');
          i.querySelector('.bpad-menu-check').innerHTML = i.dataset.align === cmd ? I.check : '';
        });
        exec(cmd);
      });
    });

    /* Insert menu */
    var insertToggle = toolbar.querySelector('[data-role="insert-toggle"]');
    onClick(insertToggle, function () {
      if (insertMenu.getAttribute('data-open') === 'true') closeAllMenus();
      else openMenu(insertMenu, insertToggle);
    });
    insertMenu.querySelectorAll('[data-insert]').forEach(function (item) {
      onClick(item, function () {
        closeAllMenus();
        insertBlock(item.dataset.insert);
      });
    });

    /* Color splits */
    var foreSplit = toolbar.querySelector('[data-role="fore-split"]');
    var foreBar = toolbar.querySelector('[data-role="fore-bar"]');
    var hiliteSplit = toolbar.querySelector('[data-role="hilite-split"]');
    var hiliteBar = toolbar.querySelector('[data-role="hilite-bar"]');

    foreSplit.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var r = foreSplit.getBoundingClientRect();
      var localX = e.clientX - r.left;
      if (localX < r.width - 20 && e.clientX) exec('foreColor', state.lastFore);
      else {
        if (foreMenu.getAttribute('data-open') === 'true') closeAllMenus();
        else openMenu(foreMenu, foreSplit);
      }
    });
    foreMenu.querySelectorAll('[data-color]').forEach(function (sw) {
      onClick(sw, function () {
        foreBar.style.background = sw.dataset.color;
        state.lastFore = sw.dataset.color;
        closeAllMenus();
        exec('foreColor', sw.dataset.color);
      });
    });
    foreMenu.querySelector('[data-role="fore-custom"]').addEventListener('change', function () {
      foreBar.style.background = this.value;
      state.lastFore = this.value;
      closeAllMenus();
      exec('foreColor', this.value);
    });

    hiliteSplit.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var r = hiliteSplit.getBoundingClientRect();
      var localX = e.clientX - r.left;
      if (localX < r.width - 20 && e.clientX) exec('hiliteColor', state.lastHilite);
      else {
        if (hiliteMenu.getAttribute('data-open') === 'true') closeAllMenus();
        else openMenu(hiliteMenu, hiliteSplit);
      }
    });
    hiliteMenu.querySelectorAll('[data-color]').forEach(function (sw) {
      onClick(sw, function () {
        var c = sw.dataset.color;
        hiliteBar.style.background = c === 'transparent' ? 'transparent' : c;
        state.lastHilite = c;
        closeAllMenus();
        exec('hiliteColor', c === 'transparent' ? 'transparent' : c);
      });
    });
    hiliteMenu.querySelector('[data-role="hilite-custom"]').addEventListener('change', function () {
      hiliteBar.style.background = this.value;
      state.lastHilite = this.value;
      closeAllMenus();
      exec('hiliteColor', this.value);
    });

    /* Outside close */
    document.addEventListener('pointerdown', onDocPointerDown, true);
    function onDocPointerDown(e) {
      if (state.destroyed) return;
      if (!state.openMenuRef) return;
      if (state.openMenuRef.contains(e.target)) return;
      if (e.target.closest && (e.target.closest('[data-role$="-toggle"]') || e.target.closest('.bpad-split'))) return;
      closeAllMenus();
    }

    window.addEventListener('scroll', onWindowScroll, true);
    function onWindowScroll() { if (state.openMenuRef) closeAllMenus(); }

    window.addEventListener('resize', onWindowResize);
    function onWindowResize() { if (state.openMenuRef) closeAllMenus(); }

    /* Link */
    onClick(toolbar.querySelector('[data-role="link"]'), openLinkModal);

    /* Image */
    function readFile(f) {
      return new Promise(function (res, rej) {
        var r = new FileReader();
        r.onload = function (e) { res(e.target.result); };
        r.onerror = rej;
        r.readAsDataURL(f);
      });
    }

    function findImgNearCaret() {
      var s = window.getSelection();
      if (s.rangeCount) {
        var n = s.anchorNode;
        if (n && n.nodeType === 3) n = n.parentNode;
        if (n && n.closest) { var i = n.closest('img'); if (i && editor.contains(i)) return i; }
      }
      var all = editor.querySelectorAll('img');
      return all.length ? all[all.length - 1] : null;
    }

    onClick(toolbar.querySelector('[data-role="image"]'), function () { fileIn.click(); });
    fileIn.addEventListener('change', function () {
      var f = this.files && this.files[0];
      this.value = '';
      if (!f || !/^image\//.test(f.type)) { toast('Only image files', 'warning'); return; }
      readFile(f).then(function (src) {
        if (state.destroyed) return;
        insertHTML('<img src="' + src + '" alt="' + esc(f.name) + '" data-bp-align="center" style="' + IS.imgCenter + '">');
        var img = findImgNearCaret();
        if (img) selectImg(img);
        toast('Image inserted');
      }).catch(function () { toast('Failed to read image', 'warning'); });
    });

    /* Table */
    onClick(toolbar.querySelector('[data-role="table"]'), openTableModal);

    /* Insert block templates */
    function insertBlock(type) {
      switch (type) {
        case 'callout':
          insertHTML('<div data-bp-block="callout" style="' + IS.callout + '">💡 <strong style="' + IS.calloutStrong + '">Note:</strong> Add your note here…</div><p style="' + IS.p + '"><br></p>');
          break;
        case 'takeaway':
          insertHTML('<div data-bp-block="takeaway" style="' + IS.takeaway + '"><strong style="' + IS.takeawayStrong + '">Key Takeaway</strong>Summarize the main point here…</div><p style="' + IS.p + '"><br></p>');
          break;
        case 'divider':
          insertHTML('<div data-bp-block="divider" style="' + IS.divider + '">✦</div><p style="' + IS.p + '"><br></p>');
          break;
        case 'toc': insertTOC(); break;
      }
    }

    /* ★ TOC — <div> based, immune to theme styles */
    function insertTOC() {
      var heads = [].slice.call(editor.querySelectorAll('h1,h2,h3,h4'));
      if (!heads.length) { toast('Add headings first', 'warning'); return; }
      var html = '<div data-bp-block="toc" style="' + IS.toc + '">' +
                 '<strong style="' + IS.tocStrong + '">Table of Contents</strong>' +
                 '<div style="' + IS.tocList + '">';
      heads.forEach(function (h, i) {
        var id = h.id || slugId(h.textContent, i);
        h.id = id;
        var indent = h.tagName === 'H2' ? '16px' : h.tagName === 'H3' ? '32px' : h.tagName === 'H4' ? '48px' : '0';
        html += '<div style="' + IS.tocLi + 'margin-left:' + indent + '">' +
                '<a href="#' + id + '" style="' + IS.tocLink + '">' +
                (i + 1) + '. ' + esc((h.textContent || '').trim() || 'Untitled') +
                '</a></div>';
      });
      html += '</div></div><p style="' + IS.p + '"><br></p>';
      insertHTML(html);
      toast('Table of contents added');
    }

    /* Toolbar state */
    var STATECMDS = ['bold','italic','underline','strikeThrough','superscript','subscript','justifyLeft','justifyCenter','justifyRight','justifyFull','insertUnorderedList','insertOrderedList'];
    function updateToolbarState() {
      if (state.destroyed) return;
      var s = window.getSelection();
      if (!s.rangeCount || !editor.contains(s.anchorNode)) return;
      STATECMDS.forEach(function (c) {
        var b = toolbar.querySelector('[data-cmd="' + c + '"]');
        if (!b) return;
        var on = false;
        try { on = document.queryCommandState(c); } catch (e) {}
        b.setAttribute('data-active', on ? 'true' : 'false');
      });
      try {
        if (document.queryCommandState('justifyCenter')) alignIcon.innerHTML = I.alignCenter;
        else if (document.queryCommandState('justifyRight')) alignIcon.innerHTML = I.alignRight;
        else if (document.queryCommandState('justifyFull')) alignIcon.innerHTML = I.alignJustify;
        else alignIcon.innerHTML = I.alignLeft;
      } catch (e) {}
      var blk = '';
      try { blk = (document.queryCommandValue('formatBlock') || '').toLowerCase(); } catch (e) {}
      var labelMap = { p:'Paragraph', h1:'Heading 1', h2:'Heading 2', h3:'Heading 3', h4:'Heading 4', blockquote:'Quote', pre:'Code block' };
      if (labelMap[blk]) blockLabel.textContent = labelMap[blk];
    }

    function updateCounts() {
      if (!footer || state.destroyed) return;
      var txt = editor.innerText || '';
      var tr = txt.trim();
      var words = tr ? tr.split(/\s+/).length : 0;
      footer.querySelector('[data-role="words"]').textContent = 'Words: ' + words;
      footer.querySelector('[data-role="chars"]').textContent = 'Characters: ' + txt.length;
    }

    function updatePlaceholder() {
      if (state.destroyed) return;
      var empty = !editor.textContent.trim() &&
        !editor.querySelector('img, table, hr, [data-bp-block], pre, blockquote');
      editor.classList.toggle('bpad-is-empty', empty);
    }

    function prepImgs() {
      editor.querySelectorAll('img').forEach(function (i) { i.draggable = true; });
    }

    /* Image select / resize */
    function selectImg(img) {
      if (state.selectedImg) state.selectedImg.removeAttribute('data-bp-selected');
      state.selectedImg = img;
      img.setAttribute('data-bp-selected', '1');
      var existing = img.getAttribute('style') || '';
      if (existing.indexOf('outline:') === -1) {
        img.setAttribute('style', existing + ';outline:2px solid #1a73e8;outline-offset:2px');
      }
      overlay.setAttribute('data-open', 'true');
      imgFb.setAttribute('data-open', 'true');
      positionImgUI();
    }

    function deselectImg() {
      if (state.selectedImg) {
        var existing = state.selectedImg.getAttribute('style') || '';
        existing = existing.replace(/;?outline[^;]*;?/g, '');
        state.selectedImg.setAttribute('style', existing);
        state.selectedImg.removeAttribute('data-bp-selected');
      }
      state.selectedImg = null;
      overlay.setAttribute('data-open', 'false');
      imgFb.setAttribute('data-open', 'false');
    }

    function positionImgUI() {
      if (!state.selectedImg || !editor.contains(state.selectedImg)) { deselectImg(); return; }
      var r = state.selectedImg.getBoundingClientRect();
      overlay.style.left = r.left + 'px';
      overlay.style.top = r.top + 'px';
      overlay.style.width = r.width + 'px';
      overlay.style.height = r.height + 'px';
      var w = imgFb.offsetWidth || 400;
      var left = Math.max(w / 2 + 8, Math.min(window.innerWidth - w / 2 - 8, r.left + r.width / 2));
      var top, tr;
      if (r.bottom + 12 + 50 < window.innerHeight) { top = r.bottom + 12; tr = 'translate(-50%,0)'; }
      else { top = r.top - 12; tr = 'translate(-50%,-100%)'; }
      imgFb.style.left = left + 'px';
      imgFb.style.top = top + 'px';
      imgFb.style.transform = tr;
    }

    editor.addEventListener('click', onEditorClick);
    function onEditorClick(e) {
      if (state.destroyed) return;
      if (state.suppressClick) { e.preventDefault(); e.stopPropagation(); return; }
      if (e.target.tagName === 'IMG') { e.preventDefault(); selectImg(e.target); return; }
      var tl = e.target.closest && e.target.closest('[data-bp-block="toc"] a');
      if (tl) {
        e.preventDefault();
        var t = document.getElementById(tl.getAttribute('href').slice(1));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (state.selectedImg) deselectImg();
    }

    document.addEventListener('pointerdown', onDocPointerDownImg, true);
    function onDocPointerDownImg(e) {
      if (state.destroyed || !state.selectedImg) return;
      if (overlay.contains(e.target) || imgFb.contains(e.target)) return;
      if (e.target === state.selectedImg || (e.target.closest && e.target.closest('img') === state.selectedImg)) return;
      if (!editor.contains(e.target)) deselectImg();
    }

    overlay.addEventListener('pointerdown', function (e) {
      var hh = e.target.closest('.bpad-handle');
      if (!hh || !state.selectedImg) return;
      e.preventDefault();
      e.stopPropagation();
      startResize(hh.dataset.dir, e);
    });

    function startResize(dir, startEv) {
      var img = state.selectedImg;
      if (!img) return;
      var sx = startEv.clientX, sy = startEv.clientY;
      var r = img.getBoundingClientRect();
      var sw = r.width, sh = r.height;
      var vert = (dir === 'n' || dir === 's');
      function move(cx, cy) {
        var dx = cx - sx, dy = cy - sy;
        if (vert) {
          var hh2 = Math.max(24, sh + (dir === 's' ? dy : -dy));
          img.style.height = Math.round(hh2) + 'px';
          img.style.width = '';
          img.style.maxWidth = '100%';
        } else {
          var w = Math.max(40, sw + (dir.indexOf('w') !== -1 ? -dx : dx));
          img.style.width = Math.round(w) + 'px';
          img.style.height = '';
          img.style.maxWidth = '100%';
        }
        positionImgUI();
      }
      var handle = overlay.querySelector('.bpad-handle[data-dir="' + dir + '"]');
      try { handle.setPointerCapture(startEv.pointerId); } catch (e) {}
      function onMove(ev) { if (state.destroyed) return; move(ev.clientX, ev.clientY); }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        document.removeEventListener('pointercancel', onUp);
        if (!state.destroyed) { positionImgUI(); scheduleEmit(); }
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
      document.addEventListener('pointercancel', onUp);
    }

    imgFb.querySelectorAll('button').forEach(function (btn) {
      onClick(btn, function () {
        if (!state.selectedImg) return;
        var act = btn.dataset.img;
        var img = state.selectedImg;
        var hadOutline = img.getAttribute('data-bp-selected');
        switch (act) {
          case 'left':   img.setAttribute('data-bp-align', 'left');   mergeStyle(img, IS.imgLeft);   img.style.float = 'left'; break;
          case 'center': img.setAttribute('data-bp-align', 'center'); mergeStyle(img, IS.imgCenter); img.style.float = 'none'; break;
          case 'right':  img.setAttribute('data-bp-align', 'right');  mergeStyle(img, IS.imgRight);  img.style.float = 'right'; break;
          case 'full':   img.setAttribute('data-bp-align', 'full');   mergeStyle(img, IS.imgFull);   img.style.float = 'none'; break;
          case 'reset':
            img.setAttribute('data-bp-align', 'center');
            img.style.width = '';
            img.style.height = '';
            img.style.maxWidth = '100%';
            img.style.float = 'none';
            img.style.display = 'block';
            img.style.margin = '12px auto';
            break;
          case 'caption': toggleCaption(img); break;
          case 'alt': openAltModal(img); break;
          case 'replace': state.replaceTarget = img; replaceIn.click(); return;
          case 'delete':
            deselectImg();
            img.remove();
            updateCounts(); updatePlaceholder(); scheduleEmit();
            toast('Image deleted');
            return;
        }
        if (hadOutline && img === state.selectedImg) {
          var s = img.getAttribute('style') || '';
          if (s.indexOf('outline:') === -1) img.setAttribute('style', s + ';outline:2px solid #1a73e8;outline-offset:2px');
        }
        prepImgs(); positionImgUI(); scheduleEmit();
      });
    });

    function toggleCaption(img) {
      var fig = img.closest('figure');
      if (fig) {
        var cap = fig.querySelector('figcaption');
        if (cap) cap.remove();
        fig.parentNode.insertBefore(img, fig);
        if (!fig.querySelector('img') && !fig.textContent.trim()) fig.remove();
        toast('Caption removed');
        return;
      }
      var f = document.createElement('figure');
      f.setAttribute('style', IS.figure);
      img.parentNode.insertBefore(f, img);
      f.appendChild(img);
      var c = document.createElement('figcaption');
      c.setAttribute('style', IS.figcaption);
      c.textContent = 'Write your caption…';
      f.appendChild(c);
      var r = document.createRange();
      r.selectNodeContents(c);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      toast('Caption added');
    }

    replaceIn.addEventListener('change', function () {
      var f = this.files && this.files[0];
      this.value = '';
      if (!f || !state.replaceTarget) return;
      readFile(f).then(function (src) {
        if (state.destroyed) return;
        state.replaceTarget.src = src;
        state.replaceTarget.setAttribute('alt', f.name);
        positionImgUI(); scheduleEmit();
        toast('Image replaced');
      });
    });

    /* Image drag */
    editor.addEventListener('pointerdown', onEditorPointerDown);
    function onEditorPointerDown(e) {
      if (state.destroyed) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      var img = e.target.closest && e.target.closest('img');
      if (!img || !editor.contains(img)) return;
      state.dragStart = {
        img: img, x: e.clientX, y: e.clientY,
        pointerId: e.pointerId,
        wasSelected: (state.selectedImg === img),
        moved: false
      };
    }

    editor.addEventListener('pointermove', onEditorPointerMove);
    function onEditorPointerMove(e) {
      if (state.destroyed) return;
      var ds = state.dragStart;
      if (!ds || e.pointerId !== ds.pointerId) return;
      var dx = e.clientX - ds.x, dy = e.clientY - ds.y;
      if (Math.sqrt(dx * dx + dy * dy) < 8) return;
      if (!ds.moved) {
        if (!ds.wasSelected) { state.dragStart = null; return; }
        ds.moved = true;
        enterDrag(ds);
      }
      if (ds.moved) {
        if (state.dragGhost) {
          state.dragGhost.style.left = e.clientX + 'px';
          state.dragGhost.style.top = e.clientY + 'px';
        }
        showCaret(e.clientX, e.clientY);
      }
    }

    editor.addEventListener('pointerup', onEditorPointerUp);
    function onEditorPointerUp(e) {
      if (state.destroyed) return;
      var ds = state.dragStart;
      if (!ds || e.pointerId !== ds.pointerId) return;
      state.dragStart = null;
      if (!ds.moved) return;
      ds.img.style.opacity = '';
      removeGhost(); hideCaret();
      var range = rangeFromPoint(e.clientX, e.clientY);
      if (range) {
        var marker = document.createElement('span');
        marker.textContent = '\u200B';
        try { range.insertNode(marker); } catch (err) { marker.remove(); }
        var nodeMove = ds.img.closest('figure') || ds.img;
        var parentFig = ds.img.closest('figure');
        nodeMove.remove();
        if (parentFig && parentFig !== nodeMove) parentFig.remove();
        marker.replaceWith(nodeMove);
        ensureP(nodeMove);
        prepImgs();
        var mi = nodeMove.tagName === 'IMG' ? nodeMove : nodeMove.querySelector('img');
        if (mi) selectImg(mi);
        updateCounts(); scheduleEmit();
        toast('Image moved');
      }
      state.suppressClick = true;
      setTimeout(function () { state.suppressClick = false; }, 400);
    }

    editor.addEventListener('pointercancel', onEditorPointerCancel);
    function onEditorPointerCancel() {
      if (state.dragStart && state.dragStart.moved) {
        state.dragStart.img.style.opacity = '';
        removeGhost(); hideCaret();
      }
      state.dragStart = null;
    }

    function enterDrag(ds) {
      deselectImg();
      ds.img.style.opacity = '0.35';
      var r = ds.img.getBoundingClientRect();
      var g = document.createElement('img');
      g.src = ds.img.src;
      g.style.cssText = 'position:fixed;pointer-events:none;z-index:9000;opacity:.65;border:2px dashed #1a73e8;box-shadow:0 4px 16px rgba(26,115,232,.3);transform:translate(-50%,-50%);width:' + Math.min(r.width, 180) + 'px;height:auto;left:' + ds.x + 'px;top:' + ds.y + 'px';
      document.body.appendChild(g);
      state.dragGhost = g;
      showHint('Drop to place image');
    }

    function removeGhost() {
      if (state.dragGhost) { state.dragGhost.remove(); state.dragGhost = null; }
    }

    function ensureP(node) {
      if (!node.parentNode) return;
      var nxt = node.nextSibling;
      if (!nxt || (nxt.nodeType === 1 && nxt.tagName === 'IMG')) {
        var p = document.createElement('p');
        p.setAttribute('style', IS.p);
        p.innerHTML = '<br>';
        node.parentNode.insertBefore(p, nxt);
      }
    }

    function rangeFromPoint(x, y) {
      var r = null;
      if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(x, y);
      else if (document.caretPositionFromPoint) {
        var p = document.caretPositionFromPoint(x, y);
        if (p) { r = document.createRange(); r.setStart(p.offsetNode, p.offset); r.collapse(true); }
      }
      if (r && editor.contains(r.startContainer)) return r;
      return null;
    }

    function showCaret(x, y) {
      var r = rangeFromPoint(x, y);
      if (!r) { hideCaret(); return; }
      var rects = r.getClientRects(), rect = rects && rects[0];
      if (!rect || (!rect.height && !rect.width)) {
        var n = r.startContainer;
        if (n && n.nodeType === 3) n = n.parentNode;
        if (n && n.getBoundingClientRect) {
          var rr = n.getBoundingClientRect();
          if (rr.height || rr.width) rect = rr;
        }
      }
      if (!rect) { hideCaret(); return; }
      caret.style.display = 'block';
      caret.style.left = Math.round(rect.left) + 'px';
      caret.style.top = Math.round(rect.top) + 'px';
      caret.style.height = Math.max(Math.round(rect.height) || 20, 20) + 'px';
    }

    function hideCaret() { caret.style.display = 'none'; }

    /* Table controls */
    function getCell() {
      var s = window.getSelection();
      if (!s.rangeCount) return null;
      var n = s.anchorNode;
      if (!n) return null;
      if (n.nodeType === 3) n = n.parentNode;
      var c = n && n.closest ? n.closest('td,th') : null;
      return (c && editor.contains(c)) ? c : null;
    }

    function updateTableFb() {
      if (state.destroyed) return;
      var c = getCell();
      if (!c) { state.activeCell = null; tblFb.setAttribute('data-open', 'false'); return; }
      state.activeCell = c;
      tblFb.setAttribute('data-open', 'true');
      positionTableFb();
    }

    function positionTableFb() {
      if (!state.activeCell || !editor.contains(state.activeCell)) {
        tblFb.setAttribute('data-open', 'false');
        return;
      }
      var t = state.activeCell.closest('table');
      if (!t) { tblFb.setAttribute('data-open', 'false'); return; }
      var r = t.getBoundingClientRect();
      var w = tblFb.offsetWidth || 520;
      var left = Math.max(w / 2 + 8, Math.min(window.innerWidth - w / 2 - 8, r.left + r.width / 2));
      var top, tr;
      if (r.top > 70) { top = r.top - 12; tr = 'translate(-50%,-100%)'; }
      else { top = r.bottom + 12; tr = 'translate(-50%,0)'; }
      tblFb.style.left = left + 'px';
      tblFb.style.top = top + 'px';
      tblFb.style.transform = tr;
    }

    var scheduleSelectionCheck = debounce(function () {
      if (state.destroyed) return;
      saveSel();
      updateTableFb();
      updateToolbarState();
    }, 80);

    document.addEventListener('selectionchange', scheduleSelectionCheck);

    tblFb.querySelectorAll('button').forEach(function (btn) {
      onClick(btn, function () {
        var c = getCell() || state.activeCell;
        if (!c) { toast('Click inside a table cell', 'warning'); return; }
        var a = btn.dataset.tbl;
        if (a === 'row-above') insRow(c, 'above');
        else if (a === 'row-below') insRow(c, 'below');
        else if (a === 'row-del') delRow(c);
        else if (a === 'col-left') insCol(c, 'left');
        else if (a === 'col-right') insCol(c, 'right');
        else if (a === 'col-del') delCol(c);
        else if (a === 'merge') mergeCells();
        else if (a === 'split') splitCell(c);
        else if (a === 'header') toggleHeader(c);
        else if (a === 'table-del') delTable(c);
        prepImgs(); updateCounts(); scheduleEmit();
        setTimeout(updateTableFb, 10);
      });
    });

    function insRow(cell, where) {
      var tr = cell.parentElement;
      var n = document.createElement('tr');
      n.setAttribute('style', 'vertical-align:top');
      [].forEach.call(tr.children, function (c) {
        var td = document.createElement(c.tagName === 'TH' ? 'th' : 'td');
        td.setAttribute('style', c.tagName === 'TH' ? IS.th : IS.td);
        td.innerHTML = '<br>';
        if (c.colSpan > 1) td.colSpan = c.colSpan;
        n.appendChild(td);
      });
      where === 'above' ? tr.before(n) : tr.after(n);
    }

    function insCol(cell, where) {
      var tr = cell.parentElement;
      var tbl = tr.closest('table');
      var i = [].indexOf.call(tr.children, cell);
      [].forEach.call(tbl.rows, function (row) {
        var t = row.children[i];
        if (!t) return;
        var nc = document.createElement(t.tagName === 'TH' ? 'th' : 'td');
        nc.setAttribute('style', t.tagName === 'TH' ? IS.th : IS.td);
        nc.innerHTML = '<br>';
        where === 'left' ? t.before(nc) : t.after(nc);
      });
    }

    function delRow(cell) {
      var tr = cell.parentElement, tbl = tr.closest('table');
      tr.remove();
      if (!tbl.rows.length) tbl.remove();
    }

    function delCol(cell) {
      var tr = cell.parentElement, tbl = tr.closest('table');
      var i = [].indexOf.call(tr.children, cell);
      [].forEach.call(tbl.rows, function (row) { if (row.children[i]) row.children[i].remove(); });
      if (tbl.rows.length && !tbl.rows[0].children.length) tbl.remove();
    }

    function delTable(cell) {
      var t = cell.closest('table');
      var p = document.createElement('p');
      p.setAttribute('style', IS.p);
      p.innerHTML = '<br>';
      t.replaceWith(p);
      state.activeCell = null;
      tblFb.setAttribute('data-open', 'false');
      var r = document.createRange();
      r.selectNodeContents(p);
      r.collapse(true);
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }

    function toggleHeader(cell) {
      var t = cell.closest('table');
      var fr = t.rows[0];
      if (!fr) return;
      var isH = [].every.call(fr.children, function (c) { return c.tagName === 'TH'; });
      [].forEach.call(fr.children, function (c) {
        var nc = document.createElement(isH ? 'td' : 'th');
        nc.innerHTML = c.innerHTML;
        nc.setAttribute('style', isH ? IS.td : IS.th);
        if (c.colSpan > 1) nc.colSpan = c.colSpan;
        if (c.rowSpan > 1) nc.rowSpan = c.rowSpan;
        c.replaceWith(nc);
      });
      toast(isH ? 'Header removed' : 'Header added');
    }

    function selectedCells() {
      var s = window.getSelection();
      if (!s.rangeCount) return [];
      var r = s.getRangeAt(0);
      var n = s.anchorNode;
      if (n && n.nodeType === 3) n = n.parentNode;
      var t = n && n.closest ? n.closest('table') : null;
      if (!t) return [];
      return [].filter.call(t.querySelectorAll('td,th'), function (c) {
        try { return r.intersectsNode(c); } catch (e) { return false; }
      });
    }

    function mergeCells() {
      var cs = selectedCells();
      if (cs.length < 2) { toast('Select 2 or more cells', 'warning'); return; }
      var rows = [];
      cs.forEach(function (c) { if (rows.indexOf(c.parentElement) === -1) rows.push(c.parentElement); });
      var cols = cs.map(function (c) { return [].indexOf.call(c.parentElement.children, c); });
      var mn = Math.min.apply(null, cols), mx = Math.max.apply(null, cols);
      var first = cs[0];
      cs.slice(1).forEach(function (c) { c.remove(); });
      first.rowSpan = rows.length;
      first.colSpan = mx - mn + 1;
      toast('Cells merged');
    }

    function splitCell(cell) {
      var rs = cell.rowSpan || 1, cs = cell.colSpan || 1;
      if (rs === 1 && cs === 1) { toast('Cell is already split', 'warning'); return; }
      var t = cell.closest('table'), tr = cell.parentElement;
      var ri = [].indexOf.call(t.rows, tr);
      var ci = [].indexOf.call(tr.children, cell);
      cell.rowSpan = 1;
      cell.colSpan = 1;
      for (var r = 0; r < rs; r++) {
        var row = t.rows[ri + r];
        if (!row) continue;
        for (var c = 0; c < cs; c++) {
          if (r === 0 && c === 0) continue;
          var td = document.createElement(cell.tagName.toLowerCase());
          td.setAttribute('style', cell.tagName === 'TH' ? IS.th : IS.td);
          td.innerHTML = '<br>';
          var ref = row.children[ci + c] || null;
          ref ? row.insertBefore(td, ref) : row.appendChild(td);
        }
      }
      toast('Cell split');
    }

    /* Source mode */
    var sourceBtn = toolbar.querySelector('[data-role="source"]');

    function enterSourceMode() {
      source.value = editor.innerHTML;
      root.setAttribute('data-source', 'true');
      sourceBtn.setAttribute('data-active', 'true');
      setTimeout(function () { if (!state.destroyed) source.focus(); }, 0);
    }

    function exitSourceMode() {
      editor.innerHTML = source.value;
      root.setAttribute('data-source', 'false');
      sourceBtn.setAttribute('data-active', 'false');
      applyInlineStyles(editor);
      prepImgs(); updateCounts(); updatePlaceholder(); scheduleEmit();
      toast('Source applied');
    }

    onClick(sourceBtn, function () {
      if (root.getAttribute('data-source') === 'true') exitSourceMode();
      else enterSourceMode();
    });

    /* Fullscreen */
    var fullscreenBtn = toolbar.querySelector('[data-role="fullscreen"]');

    function toggleFullscreen() {
      state.isFullscreen = !state.isFullscreen;
      if (state.isFullscreen) {
        root.classList.add('bpad-fullscreen');
        fullscreenBtn.innerHTML = I.fullscreenExit;
        fullscreenBtn.setAttribute('data-active', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        root.classList.remove('bpad-fullscreen');
        fullscreenBtn.innerHTML = I.fullscreen;
        fullscreenBtn.setAttribute('data-active', 'false');
        document.body.style.overflow = '';
      }
      setTimeout(repositionAll, 60);
    }

    onClick(fullscreenBtn, toggleFullscreen);

    /* =========================================================
       EDITOR EVENTS
    ========================================================= */
    editor.addEventListener('input', onEditorInput);
    function onEditorInput() {
      if (state.destroyed) return;
      applyInlineStyles(editor);
      updateCounts();
      updatePlaceholder();
      prepImgs();
      scheduleEmit();
    }

    editor.addEventListener('keydown', onEditorKeydown);
    function onEditorKeydown(e) {
      if (state.destroyed) return;
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        var s = window.getSelection();
        var n = s.anchorNode;
        if (n && n.nodeType === 3) n = n.parentNode;
        if (!n.closest || (!n.closest('ul,ol') && !n.closest('table'))) {
          e.preventDefault();
          document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
      }
    }

    editor.addEventListener('paste', onEditorPaste);
    function onEditorPaste(e) {
      if (state.destroyed) return;
      var cd = e.clipboardData;
      if (!cd) return;
      e.preventDefault();
      var html = cd.getData('text/html');
      var text = cd.getData('text/plain');
      if (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        doc.querySelectorAll('script,style,meta,link,title,iframe,object,embed,form,input,button')
          .forEach(function (n) { n.remove(); });
        doc.querySelectorAll('*').forEach(function (el) {
          el.removeAttribute('class');
          el.removeAttribute('id');
          el.removeAttribute('onclick');
          el.removeAttribute('onload');
          el.removeAttribute('onerror');
        });
        insertHTML(doc.body.innerHTML);
      } else {
        document.execCommand('insertText', false, text);
        updateCounts();
        updatePlaceholder();
        scheduleEmit();
      }
      setTimeout(function () {
        if (!state.destroyed) applyInlineStyles(editor);
      }, 0);
    }

    /* Global keyboard */
    document.addEventListener('keydown', onDocKeydown);
    function onDocKeydown(e) {
      if (state.destroyed) return;
      if (state.modalState) return;
      if ((e.ctrlKey || e.metaKey) && e.altKey) {
        if (e.key >= '1' && e.key <= '4') {
          e.preventDefault();
          exec('formatBlock', '<h' + e.key + '>');
          var labelMap = { '1':'Heading 1', '2':'Heading 2', '3':'Heading 3', '4':'Heading 4' };
          blockLabel.textContent = labelMap[e.key];
          return;
        }
        if (e.key === '0') {
          e.preventDefault();
          exec('formatBlock', '<p>');
          blockLabel.textContent = 'Paragraph';
          return;
        }
      }
      var ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) {
        if (e.key === 'Escape') {
          closeAllMenus();
          if (state.selectedImg) deselectImg();
          if (state.isFullscreen) toggleFullscreen();
        }
        return;
      }
      var k = e.key.toLowerCase();
      if (k === 's') { e.preventDefault(); emitChange(); }
      else if (k === 'k') { e.preventDefault(); openLinkModal(); }
      else if (k === 'p') { e.preventDefault(); window.print(); }
      else if (k === 'shift+f') { e.preventDefault(); toggleFullscreen(); }
    }

    /* Reposition UI */
    function repositionAll() {
      if (state.destroyed) return;
      if (state.selectedImg) {
        if (editor.contains(state.selectedImg)) positionImgUI();
        else deselectImg();
      }
      positionTableFb();
    }

    window.addEventListener('scroll', repositionAll, true);
    window.addEventListener('resize', repositionAll);
    editorWrap.addEventListener('scroll', repositionAll, true);

    /* =========================================================
       BOOT
    ========================================================= */
    try {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand('defaultParagraphSeparator', false, 'p');
    } catch (e) {}

    applyInlineStyles(editor);
    prepImgs();
    updateCounts();
    updatePlaceholder();

    /* =========================================================
       PUBLIC API
    ========================================================= */
    var api = {
      version: VERSION,
      element: root,

      getContent: function () { return editor.innerHTML; },
      setContent: function (html) {
        if (state.destroyed) return;
        editor.innerHTML = String(html == null ? '' : html);
        applyInlineStyles(editor);
        updateCounts();
        updatePlaceholder();
        scheduleEmit();
        prepImgs();
      },
      getText: function () { return editor.innerText; },
      isEmpty: function () { return !editor.innerText.trim(); },
      clear: function () {
        if (state.destroyed) return;
        editor.innerHTML = '';
        updateCounts();
        updatePlaceholder();
        scheduleEmit();
      },
      focus: function () { focusEditor(); },
      blur: function () { try { editor.blur(); } catch (e) {} },
      save: function () { emitChange(); },
      toggleFullscreen: toggleFullscreen,
      openLinkModal: openLinkModal,
      openTableModal: openTableModal,

      on: function (ev, fn) {
        if (ev === 'change') opts.onChange = fn;
        else if (ev === 'publish') opts.onPublish = fn;
        else if (ev === 'destroy') opts.onDestroy = fn;
        return api;
      },

      destroy: function () {
        if (state.destroyed) return;
        state.destroyed = true;

        /* Clear timers */
        if (toastEl._t) clearTimeout(toastEl._t);
        if (hintEl._t) clearTimeout(hintEl._t);
        if (scheduleEmit.cancel) scheduleEmit.cancel();
        if (scheduleSelectionCheck.cancel) scheduleSelectionCheck.cancel();

        /* Remove global listeners */
        document.removeEventListener('pointerdown', onDocPointerDown, true);
        document.removeEventListener('pointerdown', onDocPointerDownImg, true);
        document.removeEventListener('selectionchange', scheduleSelectionCheck);
        document.removeEventListener('keydown', onDocKeydown);
        window.removeEventListener('scroll', onWindowScroll, true);
        window.removeEventListener('resize', onWindowResize);
        window.removeEventListener('scroll', repositionAll, true);
        window.removeEventListener('resize', repositionAll);

        /* Restore body overflow */
        document.body.style.overflow = '';

        /* Remove DOM */
        if (isTextarea) {
          try { el.value = editor.innerHTML; } catch (e) {}
          el.style.display = '';
          if (mount.parentNode) mount.parentNode.removeChild(mount);
        } else {
          try { el.innerHTML = editor.innerHTML; } catch (e) {}
        }

        if (typeof opts.onDestroy === 'function') {
          try { opts.onDestroy(); } catch (e) {}
        }
      }
    };

    /* Publish helper */
    function publishContent() {
      var html = editor.innerHTML;
      if (typeof opts.onPublish === 'function') {
        try { opts.onPublish(html); }
        catch (e) { console.error('[BlogPad] onPublish error:', e); }
      } else {
        var form = el.closest ? el.closest('form') : null;
        if (form) {
          el.value = html;
          form.submit();
        }
      }
    }
    api.publish = publishContent;

    if (typeof opts.onReady === 'function') {
      setTimeout(function () {
        if (!state.destroyed) {
          try { opts.onReady(api); }
          catch (e) { console.error('[BlogPad] onReady error:', e); }
        }
      }, 0);
    }

    return api;
  }

  /* =========================================================
     EXPORT
  ========================================================= */
  global.BlogPad = {
    init: init,
    version: VERSION
  };

})(typeof window !== 'undefined' ? window : this);
