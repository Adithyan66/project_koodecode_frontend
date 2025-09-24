import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { roomSocketService } from '../../../services/roomSocketService';
import { useDebounce } from '../../../utils/debounce';

interface CodeEditorSectionProps {
    selectedLanguage: string;
    code: string;
    setCode: (code: string) => void;
    handleEditorDidMount: (editor: any) => void;
    readOnly?: boolean;
    roomId?: string;
    problemNumber?: number;
}

const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({ 
    selectedLanguage, 
    code, 
    setCode, 
    handleEditorDidMount,
    readOnly = false,
    roomId,
    problemNumber
}) => {
    const debouncedUpdateRef = useRef<((value: string) => void) | null>(null);

    useEffect(() => {
        if (roomId && problemNumber) {
            // Create debounced function for room code updates
            debouncedUpdateRef.current = useDebounce((value: string) => {
                roomSocketService.updateCode(value, selectedLanguage, problemNumber);
            }, 500); // Debounce by 500ms instead of every keystroke
        }
    }, [roomId, selectedLanguage, problemNumber]);

    const handleCodeChange = (value: string | undefined) => {
        const newCode = value || '';
        setCode(newCode);
        
        // Send to room if in room mode
        if (roomId && debouncedUpdateRef.current && !readOnly) {
            debouncedUpdateRef.current(newCode);
        }
    };

    return (
        <div className="flex-1">
            <Editor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
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
                    readOnly: readOnly,
                }}
            />
        </div>
    );
};

export default CodeEditorSection;
