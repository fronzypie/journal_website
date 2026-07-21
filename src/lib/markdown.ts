function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export function renderJournalMarkdown(markdown: string) {
  if (!markdown.trim()) {
    return "<p class='text-muted'>No content.</p>";
  }

  const lines = markdown.split(/\n/);
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      return;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      closeList();
      const level = Math.min(3, trimmed.match(/^#+/)?.[0].length ?? 1);
      const content = renderInline(trimmed.replace(/^#{1,3}\s+/, ""));
      html.push(`<h${level}>${content}</h${level}>`);
      return;
    }

    if (/^>\s+/.test(trimmed)) {
      closeList();
      html.push(`<blockquote>${renderInline(trimmed.replace(/^>\s+/, ""))}</blockquote>`);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${renderInline(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${renderInline(trimmed)}</p>`);
  });

  closeList();
  return html.join("");
}

export function renderEditorPreview(title: string, markdown: string) {
  const safeTitle = escapeHtml(title || "Untitled entry");

  if (!markdown.trim()) {
    return `
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.24em] text-muted">Preview</p>
        <h2 class="text-2xl font-semibold text-porcelain">${safeTitle}</h2>
        <p class="text-sm text-muted">Start writing to see your rendered markdown here.</p>
      </div>
    `;
  }

  return `
    <div class="space-y-3">
      <p class="text-sm uppercase tracking-[0.24em] text-muted">Preview</p>
      <h2 class="text-2xl font-semibold text-porcelain">${safeTitle}</h2>
      <div class="space-y-3 text-sm leading-7 text-muted-strong">${renderJournalMarkdown(markdown)}</div>
    </div>
  `;
}
