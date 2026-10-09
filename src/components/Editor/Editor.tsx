import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {Toolbar} from "./Toolbar";
import CodeBlock from "@tiptap/extension-code-block";
import {Label} from "../ui/label";
import {FilterSlashN} from "../../utils";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import {Color} from "@tiptap/extension-color";
import Gapcursor from "@tiptap/extension-gapcursor";
import Youtube from "@tiptap/extension-youtube";
import { FontSize } from "./CustomsExtentions";
import {TextSelection} from "@tiptap/pm/state";

type TiptapProps = {
  title?: string;
  content?: string;
  editable?: boolean;
  placeholder?: string;
  withToolbar?: boolean;
  withTypographyExtension?: boolean;
  withLinkExtension?: boolean;
  withCodeBlockLowlightExtension?: boolean;
  withTaskListExtension?: boolean;
  withPlaceholderExtension?: boolean;
  withImageExtension?: boolean;
  withUnderline?: boolean;
  withHighlight?: boolean;
  withSubscript?: boolean;
  withSuperscript?: boolean;
  withTable?: boolean;
  withTableRow?: boolean;
  withTableHeader?: boolean;
  withTableCell?: boolean;
  withTextStyle?: boolean;
  withTextAlign?: boolean;
  withColor?: boolean;
  withGapCursor?: boolean;
  withYoutube?: boolean;
  withFontSize?: boolean;
  onChange: (val: any) => void;
};

const Editor = ({
  title = "",
  content = "",
  editable = true,
  placeholder = "Typing here…",
  withToolbar = true,
  withTypographyExtension = true,
  withLinkExtension = true,
  withCodeBlockLowlightExtension = true,
  withTaskListExtension = true,
  withPlaceholderExtension = true,
  withImageExtension = true,
  withUnderline = true,
  withHighlight = true,
  withSubscript = true,
  withSuperscript = true,
  withTable = true,
  withTableCell = true,
  withTableHeader = true,
  withTableRow = true,
  withTextStyle = true,
  withTextAlign = true,
  withColor = true,
  withGapCursor = true,
  withYoutube = true,
  withFontSize = true,
  onChange,
}: TiptapProps) => {
  const [contents, setContents] = useState("");

  const extensions: Extensions = [
    StarterKit.configure({
      ...(withCodeBlockLowlightExtension && {codeBlock: false}),
    }),
  ];

  if (withTypographyExtension) {
    extensions.push(Typography);
  }

  if (withLinkExtension) {
    extensions.push(
      Link.configure({
        linkOnPaste: false,
        openOnClick: false,
      })
    );
  }

  if (withCodeBlockLowlightExtension) {
    extensions.push(CodeBlock);
  }

  if (withTaskListExtension) {
    extensions.push(TaskList, TaskItem);
  }

  if (withPlaceholderExtension) {
    extensions.push(
      Placeholder.configure({
        placeholder,
      })
    );
  }
  if (withImageExtension) {
    extensions.push(
      Image.configure({
        allowBase64: true,
      })
    );
  }
  if (withUnderline) {
    extensions.push(Underline);
  }
  if (withHighlight) {
    extensions.push(Highlight.configure({multicolor: true}));
  }
  if (withSubscript) {
    extensions.push(Subscript);
  }
  if (withSuperscript) {
    extensions.push(Superscript);
  }
  if (withTable) {
    extensions.push(
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          class: "!border !border-gray-300",
        },
      })
    );
  }
  if (withTableCell) {
    extensions.push(
      TableCell.configure({
        HTMLAttributes: {
          class: "!border !border-gray-300 !p-2",
        },
      })
    );
  }
  if (withTableHeader) {
    extensions.push(
      TableHeader.configure({
        HTMLAttributes: {
          class: "!border !border-gray-300 !p-2 bg-gray-200",
        },
      })
    );
  }
  if (withTableRow) {
    extensions.push(
      TableRow.configure({
        HTMLAttributes: {
          class: "!border !border-gray-300",
        },
      })
    );
  }
  if (withTextStyle) {
    extensions.push(
      TextStyle.configure({
        HTMLAttributes: {
          style: "",
        },
      })
    );
  }
  if (withTextAlign) {
    extensions.push(
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      })
    );
  }
  if (withColor) {
    extensions.push(
      Color.configure({
        types: ["textStyle"],
      })
    );
  }

  if (withGapCursor) {
    extensions.push(Gapcursor);
  }
  if (withGapCursor) {
    extensions.push(FontSize);
  }
  if (withYoutube) {
    extensions.push(
      Youtube.configure({
        controls: false,
        nocookie: true,
      })
    );
  }

  const editor = useEditor({
    content,
    extensions,
    editable,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);
  // useEffect(() => {
  //   if (content) {
  //     const selection = editor.state.selection;
  //     const start = selection.from;
  //     const end = selection.to;
  //     setContents(content);
  //     editor.commands.setContent(content, false);
  //     if (
  //       start <= editor.state.doc.content.size &&
  //       end <= editor.state.doc.content.size
  //     ) {
  //       editor.view.dispatch(
  //         editor.view.state.tr.setSelection(
  //           TextSelection.create(editor.state.doc, start, end)
  //         )
  //       );
  //     }
  //   }
  //   console.log("Content no S: " + content);
  //   console.log("Content have S: " + contents);
  // }, [content]);
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      const selection = editor.state.selection;
      const start = selection.from;
      const end = selection.to;

      editor.commands.setContent(content, false);

      if (
        start <= editor.state.doc.content.size &&
        end <= editor.state.doc.content.size
      ) {
        editor.view.dispatch(
          editor.view.state.tr.setSelection(
            TextSelection.create(editor.state.doc, start, end)
          )
        );
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  editor.on("update", ({editor}) => {
    let contentValue = editor.getHTML();
    setContents(contentValue);
    if (onChange) {
      onChange(contentValue);
    }
  });

  const handleChangeEditorContent = () => {
    let contentValue = editor.getHTML();
    setContents(contentValue);
    if (onChange) {
      onChange(contentValue);
    }
  };

  return (
    <div className="dark:text-white dark:bg-transparent mt-5">
      <Label className="dark:text-white dark:bg-transparent text-base mb-5">
        {title}
      </Label>
      <div className="dark:text-white dark:bg-transparent flex flex-col gap-5">
        {withToolbar ? <Toolbar editor={editor} /> : null}
        <EditorContent
          editor={editor}
          // content={contents}
          // onChange={() => handleChangeEditorContent()}
          className="dark:text-white dark:bg-transparent prose prose-lg w-full ring-1 ring-gray-300 focus-within:ring-2 focus-within:ring-gray-900 transition-all duration-200 px-3 p-3 rounded-md max-w-none"
        />
      </div>
    </div>
  );
};

export { Editor };
