// import React, { useEffect, useRef } from 'react';
// import Editor from '@monaco-editor/react';
// import { roomSocketService } from '../../../services/roomSocketService';
// import { useDebounce } from '../../../utils/debounce';

// interface CodeEditorSectionProps {
//     selectedLanguage: string;
//     code: string;
//     setCode: (code: string) => void;
//     handleEditorDidMount: (editor: any) => void;
//     readOnly?: boolean;
//     roomId?: string;
//     problemNumber?: number;
// }

// const CodeEditorSection: React.FC<CodeEditorSectionProps> = ({
//     selectedLanguage,
//     code,
//     setCode,
//     handleEditorDidMount,
//     readOnly = false,
//     roomId,
//     problemNumber
// }) => {

//     const debouncedUpdateRef = useRef<((value: string) => void) | null>(null);

//     useEffect(() => {
//         console.log("workssssssssssssssssssss",debouncedUpdateRef.current);
//         if (roomId && problemNumber) {

//             debouncedUpdateRef.current = useDebounce((value: string) => {
//                 roomSocketService.updateCode(value, selectedLanguage, problemNumber);
//             }, 500); 
//         }
//     }, [roomId, selectedLanguage, problemNumber]);

//     const handleCodeChange = (value: string | undefined) => {
//         const newCode = value || '';
//         setCode(newCode);

//         // Send to room if in room mode
//         if (roomId && debouncedUpdateRef.current && !readOnly) {
//             debouncedUpdateRef.current(newCode);
//         }
//     };

//     return (
//         <div className="flex-1">
//             <Editor
//                 height="100%"
//                 language={selectedLanguage}
//                 theme="vs-dark"
//                 value={code}
//                 onChange={handleCodeChange}
//                 onMount={handleEditorDidMount}
//                 options={{
//                     minimap: { enabled: false },
//                     fontSize: 14,
//                     lineNumbers: 'off',
//                     roundedSelection: false,
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                     tabSize: 4,
//                     insertSpaces: true,
//                     wordWrap: 'on',
//                     contextmenu: false,
//                     copyWithSyntaxHighlighting: false,
//                     readOnly: readOnly,
//                 }}
//             />
//         </div>
//     );
// };

// export default CodeEditorSection;















import React, { useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { roomSocketService } from '../../../services/roomSocketService';

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
    const timeoutRef = useRef<any>(null);

    // Create a stable debounced function using useCallback
    const debouncedUpdateCode = useCallback((value: string) => {
        if (!roomId || !problemNumber) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            console.log("Debounced update executing:", {
                codeLength: value.length,
                selectedLanguage,
                problemNumber,
                roomId
            });

            roomSocketService.updateCode(value, selectedLanguage, problemNumber);
        }, 500);

    }, [roomId, problemNumber, selectedLanguage]); // Include all dependencies

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCodeChange = (value: string | undefined) => {
        const newCode = value || '';
        setCode(newCode);

        console.log('Code changed:', {
            newCodeLength: newCode.length,
            roomId,
            readOnly,
            hasRoomAndProblem: !!(roomId && problemNumber),
            problemNumber
        });

        // Send to room if in room mode and not read-only
        if (roomId && problemNumber && !readOnly) {
            console.log('Calling debounced update...');
            debouncedUpdateCode(newCode);
        }
    };

    return (
        <div className="flex-1 bg-gradient-to-br from-gray-950 to-black overflow-hidden">
            <Editor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
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
                    readOnly: readOnly,
                }}
            />
        </div>
    );
};

export default CodeEditorSection;
