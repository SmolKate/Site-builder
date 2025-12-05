import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type IBlock } from "@/store/builder/types";
import { useAppDispatch } from "@/store";
import { updateComponent } from "@/store/builder/builderSlice";
import { useEffect } from "react";

interface Props {
  block: IBlock;
  readOnly?: boolean;
}

export const TextBlock = ({ block, readOnly = false }: Props) => {
  const dispatch = useAppDispatch();

  const editor = useEditor({
    extensions: [StarterKit],
    content: block.content,
    editable: !readOnly,
    onBlur: ({ editor }) => {
      dispatch(updateComponent({
        id: block.id,
        changes: { content: editor.getHTML() }
      }));
    },
  });
  
  useEffect(() => {
    if (editor && block.content !== editor.getHTML()) {
      if (!editor.isFocused) {
        editor.commands.setContent(block.content || "");
      }
    }
  }, [block.content, editor]);

  if (!editor) return null;

  return (
    <div style={{ ...block.style }}>
      <EditorContent editor={editor} />
    </div>
  );
};