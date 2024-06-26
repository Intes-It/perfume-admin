import { RichTextEditor } from '@mantine/tiptap';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface textEditorProps {
  content?: string;
  onChangeValue?: (value: string) => void;
}
export default function TextEditor({
  content,
  onChangeValue,
}: textEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChangeValue && onChangeValue(content);
    },
    content: content,
    editable: true,
  });

  useEffect(() => {
    if (content) editor?.commands?.setContent(content);
  }, [content]);

  return (
    <RichTextEditor
      editor={editor}
      sx={{
        minHeight: 300,
        borderColor: '#B82C67',
        '.mantine-nlxhsk': {
          borderBottom: '0.0625rem solid #B82C67',
        },
        '.ProseMirror': {
          minHeight: 300,
        },
      }}
    >
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
