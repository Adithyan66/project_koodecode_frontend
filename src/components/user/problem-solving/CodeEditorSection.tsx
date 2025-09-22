
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorSectionProps {
    selectedLanguage: string;
    code: string;
    setCode: (code: string) => void;
    handleEditorDidMount: (editor: any) => void;
}

const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({ selectedLanguage, code, setCode, handleEditorDidMount }) => (
    <div className="flex-1">
        <Editor
            height="100%"
            language={selectedLanguage}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'off',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                contextmenu: false,
                copyWithSyntaxHighlighting: false,
            }}
        />
    </div>
);

export default CodeEditorSection;