import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document"; 
import { type IBlock } from "@/store/builder/types";
import { useAppDispatch } from "@/store";
import { updateComponent } from "@/store/builder/builderSlice";
import { useEffect } from "react";
import type { Level } from "@tiptap/extension-heading";
import "./HeadingBlock.scss";

interface Props {
  block: IBlock;
  readOnly?: boolean;
}

export const HeadingBlock = ({ block, readOnly = false }: Props) => {
  const dispatch = useAppDispatch();
  const level = (parseInt(String(block.props.level)) || 2) as Level;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false, 
      }),
      Document.extend({
        content: "heading", 
      }),
    ],
    content: block.content,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: "heading-editor-content",
        style: "outline: none;", 
      },
    },
    onBlur: ({ editor }) => {
      dispatch(updateComponent({
        id: block.id,
        changes: { content: editor.getText() }
      }));
    },
  });

  useEffect(() => {
    if (editor && block.content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(block.content || "");
    }
  }, [block.content, editor]);

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setHeading({ level }).run();
    }
  }, [level, editor]);

  if (!editor) return null;

  return (
    <div style={{ ...block.style }} className="heading-block-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
};