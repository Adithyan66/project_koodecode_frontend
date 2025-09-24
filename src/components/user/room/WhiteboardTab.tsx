
import React, { useEffect, useRef, useState } from 'react';
import { Excalidraw, exportToCanvas, exportToSvg } from '@excalidraw/excalidraw';
// import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
// import { AppState } from '@excalidraw/excalidraw/types/types';
// import type { ExcalidrawElement, AppState } from "@excalidraw/excalidraw";
import { Download, Share, Trash2, Lock, Unlock } from 'lucide-react';
import { roomSocketService } from '../../../services/roomSocketService';

interface WhiteboardTabProps {
  roomId: string;
  canDraw: boolean;
}

const WhiteboardTab: React.FC<WhiteboardTabProps> = ({ roomId, canDraw }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  // const [elements, setElements] = useState<ExcalidrawElement[]>([]);
  const [elements, setElements] = useState([]);
  // const [appState, setAppState] = useState<Partial<AppState>>({});
  const [appState, setAppState] = useState({});
  const updateTimeoutRef = useRef<number | null>(null);

  // Handle real-time updates from other users
  useEffect(() => {
    // TODO: Listen for whiteboard updates via Socket.IO
    // roomSocketService.onWhiteboardUpdate((data) => {
    //   if (data.elements) {
    //     setElements(data.elements);
    //   }
    //   if (data.appState) {
    //     setAppState(data.appState);
    //   }
    // });
  }, [roomId]);

  const handleChange = (elements: any, appState: any) => {
    setElements(elements);
    setAppState(appState);

    // Debounce updates to prevent too frequent Socket.IO emissions
    if (canDraw && updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    if (canDraw) {
      updateTimeoutRef.current = setTimeout(() => {
        roomSocketService.updateWhiteboard({
          elements,
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            currentItemFontFamily: appState.currentItemFontFamily,
            currentItemFontSize: appState.currentItemFontSize,
            currentItemTextAlign: appState.currentItemTextAlign,
            currentItemStrokeColor: appState.currentItemStrokeColor,
            currentItemBackgroundColor: appState.currentItemBackgroundColor,
            currentItemStrokeWidth: appState.currentItemStrokeWidth,
            currentItemStrokeStyle: appState.currentItemStrokeStyle,
            currentItemRoughness: appState.currentItemRoughness,
            currentItemOpacity: appState.currentItemOpacity
          }
        });
      }, 300);
    }
  };

  const handleExportToPNG = async () => {
    if (!excalidrawAPI) return;

    try {
      const canvas = await exportToCanvas({
        elements,
        appState,
        files: excalidrawAPI.getFiles(),
      });

      const link = document.createElement('a');
      link.download = `koodecode-whiteboard-${roomId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to export to PNG:', error);
    }
  };

  const handleExportToSVG = async () => {
    if (!excalidrawAPI) return;

    try {
      const svg = await exportToSvg({
        elements,
        appState,
        files: excalidrawAPI.getFiles(),
      });

      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `koodecode-whiteboard-${roomId}.svg`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export to SVG:', error);
    }
  };

  const handleClearCanvas = () => {
    if (!canDraw) return;

    if (confirm('Are you sure you want to clear the whiteboard? This action cannot be undone.')) {
      setElements([]);
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({ elements: [] });
      }

      // Notify other users
      roomSocketService.updateWhiteboard({
        elements: [],
        appState
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Whiteboard Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium">Collaborative Whiteboard</span>
          {!canDraw && (
            <div className="flex items-center space-x-1 text-yellow-400">
              <Lock size={14} />
              <span className="text-xs">View Only</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleExportToPNG}
            className="text-gray-400 hover:text-white p-1 transition-colors"
            title="Export as PNG"
          >
            <Download size={16} />
          </button>

          <button
            onClick={handleExportToSVG}
            className="text-gray-400 hover:text-white p-1 transition-colors"
            title="Export as SVG"
          >
            <Share size={16} />
          </button>

          {canDraw && (
            <button
              onClick={handleClearCanvas}
              className="text-gray-400 hover:text-red-400 p-1 transition-colors"
              title="Clear Whiteboard"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Permission Notice */}
      {!canDraw && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
          <div className="flex items-center">
            <Lock size={16} className="text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800">
              You have view-only access to this whiteboard. Ask the room creator for drawing permissions.
            </p>
          </div>
        </div>
      )}

      {/* Excalidraw Canvas */}
      <div className="flex-1">
        <Excalidraw
          ref={(api) => setExcalidrawAPI(api)}
          initialData={{
            elements,
            appState: {
              ...appState,
              viewBackgroundColor: '#ffffff',
              currentItemFontFamily: 1,
              currentItemFontSize: 16,
              currentItemTextAlign: 'left',
              currentItemStrokeColor: '#000000',
              currentItemBackgroundColor: 'transparent',
              currentItemStrokeWidth: 1,
              currentItemStrokeStyle: 'solid',
              currentItemRoughness: 1,
              currentItemOpacity: 100,
              currentItemLinearStrokeSharpness: 'round',
              currentItemEndArrowhead: 'arrow',
              currentItemStartArrowhead: null,
            }
          }}
          onChange={handleChange}
          viewModeEnabled={!canDraw}
          zenModeEnabled={false}
          gridModeEnabled={true}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 px-4 py-2 border-t border-gray-300">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{elements.length} elements on canvas</span>
          <span>Real-time collaboration active</span>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardTab;
