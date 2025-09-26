
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import { Download, Share, Trash2, Lock, Users } from 'lucide-react';
import { roomSocketService } from '../../../services/roomSocketService';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';

interface ExcalidrawPageProps {
  roomId: string;
  canDraw: boolean;
}

interface WhiteboardUpdateData {
  elements: any[];
  appState: any;
  files?: any;
  timestamp: string | number;
  changedBy?: string;
  userId?: string;
}

const WhiteboardTab: React.FC<ExcalidrawPageProps> = ({ roomId, canDraw }) => {
  const { user } = useSelector((state: RootState) => state.user);

  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [elementsCount, setElementsCount] = useState(0);

  // Refs for debouncing and tracking internal state
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isReceivingUpdate = useRef<boolean>(false);
  const lastBroadcastRef = useRef<number>(0);
  const pendingUpdateRef = useRef<any>(null);

  // Store current state in refs
  const currentElementsRef = useRef<any[]>([]);
  const currentAppStateRef = useRef<any>({});
  const currentFilesRef = useRef<any>({});

  // Throttled broadcast function
  const throttledBroadcast = useCallback(() => {
    const now = Date.now();
    
    if (now - lastBroadcastRef.current < 500) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        if (pendingUpdateRef.current && canDraw) {
          console.log('Broadcasting delayed whiteboard update');
          roomSocketService.updateWhiteboard(pendingUpdateRef.current);
          lastBroadcastRef.current = Date.now();
          pendingUpdateRef.current = null;
        }
      }, 500);
      return;
    }

    if (pendingUpdateRef.current && canDraw) {
      console.log('Broadcasting immediate whiteboard update');
      roomSocketService.updateWhiteboard(pendingUpdateRef.current);
      lastBroadcastRef.current = now;
      pendingUpdateRef.current = null;
    }
  }, [canDraw]);

  // Initialize socket listeners
  useEffect(() => {
    if (!roomId) return;

    console.log('Setting up whiteboard socket listeners for room:', roomId);

    // Listen for whiteboard updates from other users
    const handleWhiteboardUpdate = (data: WhiteboardUpdateData) => {
      console.log('Received whiteboard update:', data);

      const updateUserId = data.changedBy || data.userId;

      if (updateUserId === user?.id) {
        console.log('Ignoring own update');
        return;
      }

      console.log('Applying remote update from user:', updateUserId);

      isReceivingUpdate.current = true;

      if (data.elements) {
        currentElementsRef.current = [...data.elements];
        setElementsCount(data.elements.length);
      }

      if (data.appState) {
        currentAppStateRef.current = { ...currentAppStateRef.current, ...data.appState };
      }

      if (data.files) {
        currentFilesRef.current = { ...data.files };
      }

      if (excalidrawAPI && data.elements) {
        setTimeout(() => {
          try {
            console.log('Updating Excalidraw scene with', data.elements.length, 'elements');
            excalidrawAPI.updateScene({
              elements: data.elements,
              appState: data.appState || {}
            });
          } catch (error) {
            console.warn('Failed to update scene:', error);
          }

          setTimeout(() => {
            isReceivingUpdate.current = false;
          }, 100);
        }, 50);
      } else {
        setTimeout(() => {
          isReceivingUpdate.current = false;
        }, 100);
      }
    };

    // Register the listener using the correct method
    roomSocketService.onWhiteboardUpdate(handleWhiteboardUpdate);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      // Clean up listener
      roomSocketService.offWhiteboardUpdate(handleWhiteboardUpdate);
    };
  }, [roomId, user?.id, excalidrawAPI]);

  // Handle Excalidraw changes with aggressive throttling
  const handleChange = useCallback((newElements: any[], newAppState: any, newFiles: any) => {
    if (isReceivingUpdate.current) {
      return;
    }

    currentElementsRef.current = [...newElements];
    currentAppStateRef.current = { ...newAppState };
    currentFilesRef.current = { ...newFiles };
    
    setElementsCount(newElements.length);

    if (!canDraw) {
      return;
    }

    pendingUpdateRef.current = {
      elements: newElements,
      appState: {
        viewBackgroundColor: newAppState.viewBackgroundColor,
        currentItemFontFamily: newAppState.currentItemFontFamily,
        currentItemFontSize: newAppState.currentItemFontSize,
        currentItemTextAlign: newAppState.currentItemTextAlign,
        currentItemStrokeColor: newAppState.currentItemStrokeColor,
        currentItemBackgroundColor: newAppState.currentItemBackgroundColor,
        currentItemStrokeWidth: newAppState.currentItemStrokeWidth,
        currentItemStrokeStyle: newAppState.currentItemStrokeStyle,
        currentItemRoughness: newAppState.currentItemRoughness,
        currentItemOpacity: newAppState.currentItemOpacity,
        zoom: newAppState.zoom,
        scrollX: newAppState.scrollX,
        scrollY: newAppState.scrollY
      },
      files: newFiles,
      timestamp: new Date().toISOString()
    };

    throttledBroadcast();
  }, [canDraw, throttledBroadcast]);

  // Export functions (keeping them the same)
  const handleExportToPNG = useCallback(async () => {
    if (!excalidrawAPI) return;

    try {
      const { exportToCanvas } = await import('@excalidraw/excalidraw');
      const canvas = await exportToCanvas({
        elements: currentElementsRef.current,
        appState: currentAppStateRef.current,
        files: excalidrawAPI.getFiles(),
      });

      const link = document.createElement('a');
      link.download = `koodecode-whiteboard-${roomId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to export to PNG:', error);
    }
  }, [excalidrawAPI, roomId]);

  const handleExportToSVG = useCallback(async () => {
    if (!excalidrawAPI) return;

    try {
      const { exportToSvg } = await import('@excalidraw/excalidraw');
      const svg = await exportToSvg({
        elements: currentElementsRef.current,
        appState: currentAppStateRef.current,
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
  }, [excalidrawAPI, roomId]);

  const handleClearCanvas = useCallback(() => {
    if (!canDraw) return;

    if (window.confirm('Are you sure you want to clear the whiteboard? This action cannot be undone.')) {
      const emptyElements: any[] = [];
      
      currentElementsRef.current = emptyElements;
      setElementsCount(0);

      if (excalidrawAPI) {
        excalidrawAPI.updateScene({ elements: emptyElements });
      }

      roomSocketService.updateWhiteboard({
        elements: emptyElements,
        appState: currentAppStateRef.current,
        files: currentFilesRef.current,
        timestamp: new Date().toISOString()
      });
    }
  }, [canDraw, excalidrawAPI]);

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700 z-10">
        <div className="flex items-center space-x-4">
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
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 z-10">
          <div className="flex items-center">
            <Lock size={16} className="text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800">
              You have view-only access to this whiteboard. Drawing permissions are controlled by the room creator.
            </p>
          </div>
        </div>
      )}

      {/* Excalidraw Canvas */}
      <div className="flex-1 relative">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          onChange={handleChange}
          viewModeEnabled={!canDraw}
          zenModeEnabled={false}
          gridModeEnabled={true}
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: false,
              export: false,
              clearCanvas: false,
              toggleTheme: false
            }
          }}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 px-4 py-2 border-t border-gray-300 z-10">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{elementsCount} elements on canvas</span>
          <span>Real-time collaboration active</span>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardTab;
