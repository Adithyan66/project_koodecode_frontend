
import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorSectionProps {
    selectedLanguage: string;
    code: string;
    setCode: (code: string) => void;
    handleEditorDidMount: (editor: any) => void;
}

const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({ selectedLanguage, code, setCode, handleEditorDidMount }) => (
    <div className="flex-1 bg-gradient-to-br from-gray-950 to-black overflow-hidden">
        <Editor
            height="100%"
            language={selectedLanguage}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineHeight: 24,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', monospace",
                fontLigatures: true,
                lineNumbers: 'on',
                lineNumbersMinChars: 3,
                renderLineHighlight: 'all',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                contextmenu: true,
                copyWithSyntaxHighlighting: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                folding: true,
                foldingHighlight: true,
                bracketPairColorization: { enabled: true },
                guides: {
                    bracketPairs: true,
                    indentation: true,
                },
                padding: { top: 16, bottom: 16 },
                scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                },
                suggest: {
                    showKeywords: true,
                    showSnippets: true,
                },
            }}
        />
    </div>
);

export default CodeEditorSection;