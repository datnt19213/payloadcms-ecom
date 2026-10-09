import {Editor} from "@tiptap/react";

async function setLink(editor: Editor) {
  const previousUrl = editor.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  // update link
  editor.chain().focus().extendMarkRange("link").setLink({href: url}).run();
}

async function formatHtml(input: string) {
  const {rehype} = await import("rehype");
  const rehypeFormat = (await import("rehype-format")).default;

  return String(rehype().use(rehypeFormat).processSync(input))
    .replace(/<\/?(html|head|body)>/g, "")
    .replace(/\n {4}/g, "\n")
    .replace(/^\s+|\s+$/g, "");
}

export {formatHtml, setLink};
