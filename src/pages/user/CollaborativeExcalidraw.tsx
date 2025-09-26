




// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Excalidraw, 
//   convertToExcalidrawElements,
//   exportToCanvas,
//   exportToSvg
// } from '@excalidraw/excalidraw';
// import '@excalidraw/excalidraw/index.css';
// import type { 
//   ExcalidrawElement, 
//   AppState,
//   ExcalidrawImperativeAPI 
// } from '@excalidraw/excalidraw/types';

// interface CollaborativeExcalidrawProps {
//   roomId?: string;
//   height?: string;
//   width?: string;
//   theme?: 'light' | 'dark';
//   onSave?: (elements: ExcalidrawElement[]) => void;
//   onExport?: (type: 'png' | 'svg', data: string | HTMLCanvasElement) => void;
//   className?: string;
// }

// const CollaborativeExcalidraw: React.FC<CollaborativeExcalidrawProps> = ({
//   roomId,
//   height = '600px',
//   width = '100%',
//   theme = 'light',
//   onSave,
//   onExport,
//   className = ''
// }) => {
//   const [elements, setElements] = useState<ExcalidrawElement[]>([]);
//   const [appState, setAppState] = useState<Partial<AppState>>({});
//   const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);

//   // Handle data changes
//   const handleChange = useCallback((elements: ExcalidrawElement[], appState: AppState) => {
//     setElements(elements);
//     setAppState(appState);
//   }, []);

//   // Save function
//   const handleSave = useCallback(() => {
//     if (onSave && elements.length > 0) {
//       onSave(elements);
//     }
//   }, [elements, onSave]);

//   // Export functions
//   const handleExportPNG = useCallback(async () => {
//     if (!excalidrawAPI) return;
    
//     const canvas = await exportToCanvas({
//       elements,
//       appState: {
//         ...appState,
//         exportBackground: true,
//         viewBackgroundColor: '#ffffff'
//       }
//     });
    
//     if (onExport) {
//       onExport('png', canvas);
//     }
//   }, [elements, appState, excalidrawAPI, onExport]);

//   const handleExportSVG = useCallback(async () => {
//     if (!excalidrawAPI) return;
    
//     const svg = await exportToSvg({
//       elements,
//       appState: {
//         ...appState,
//         exportBackground: true,
//       }
//     });
    
//     if (onExport) {
//       onExport('svg', svg.outerHTML);
//     }
//   }, [elements, appState, excalidrawAPI, onExport]);

//   // Custom toolbar
//   const renderTopRightUI = () => (
//     <div className="flex gap-2 p-2">
//       <button
//         onClick={handleSave}
//         className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
//         disabled={elements.length === 0}
//       >
//         Save
//       </button>
//       <button
//         onClick={handleExportPNG}
//         className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
//         disabled={elements.length === 0}
//       >
//         Export PNG
//       </button>
//       <button
//         onClick={handleExportSVG}
//         className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
//         disabled={elements.length === 0}
//       >
//         Export SVG
//       </button>
//     </div>
//   );

//   return (
//     <div className={`border rounded-lg overflow-hidden ${className}`} style={{ height, width }}>
//       <Excalidraw
//         ref={(api) => setExcalidrawAPI(api)}
//         theme={theme}
//         initialData={{ elements, appState }}
//         onChange={handleChange}
//         UIOptions={{
//           canvasActions: {
//             saveToActiveFile: false, // We'll handle save ourselves
//             loadScene: true,
//             export: false, // We'll handle export ourselves
//             toggleTheme: true,
//           },
//           tools: {
//             image: true,
//           }
//         }}
//         renderTopRightUI={renderTopRightUI}
//         langCode="en"
//       />
//     </div>
//   );
// };

// export default CollaborativeExcalidraw;



