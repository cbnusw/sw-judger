import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '@/ckeditor5/build/ckeditor';
import { UploadAdapter } from './utils/uploadAdapter';
import { UploadService } from './utils/uploadService';

const editorConfiguration = {
  placeholder: '내용을 입력해 주세요',
};

const uploadService = new UploadService();

const CustomCKEditor = ({ initEditorContent, onEditorChange }) => {
  return (
    <CKEditor
      editor={Editor}
      config={editorConfiguration}
      onReady={(editor) => {
        if (initEditorContent) editor.setData(initEditorContent);
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return new UploadAdapter(loader, uploadService);
        };
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onEditorChange(data);
      }}
    />
  );
};

export default CustomCKEditor;
