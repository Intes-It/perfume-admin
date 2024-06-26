import { RichTextEditor } from '@mantine/tiptap';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
interface textEditorProps {
  content?: string;
  onChangeValue?: (value: string) => void;
}
export default function TextEditor({
  onChangeValue,
  content,
}: textEditorProps) {
  const limit = 500;

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Link,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        CharacterCount.configure({
          limit,
        }),
      ],
      onUpdate: ({ editor }) => {
        const content = editor.getHTML();
        onChangeValue && onChangeValue(content);
      },
      editable: true,
      content: content,
    },
    [content],
  );

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
