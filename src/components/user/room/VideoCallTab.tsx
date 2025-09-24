import React, { useEffect, useRef, useState } from 'react';
import { Minimize2, Maximize2, X, Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoCallTabProps {
  roomId: string;
  jitsiUrl: string;
  participants: any[];
  minimized?: boolean;
  onMinimize?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

const VideoCallTab: React.FC<VideoCallTabProps> = ({
  roomId,
  jitsiUrl,
  participants,
  minimized = false,
  onMinimize,
  onExpand,
  onClose
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);

  useEffect(() => {
    loadJitsiScript();
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (isJitsiLoaded && jitsiContainerRef.current) {
      initializeJitsi();
    }
  }, [isJitsiLoaded, roomId]);

  const loadJitsiScript = () => {
    if (window.JitsiMeetExternalAPI) {
      setIsJitsiLoaded(true);
      return;
    }

    const jitsiDomain = new URL(jitsiUrl).hostname;
    const script = document.createElement('script');
    script.src = `https://${jitsiDomain}/external_api.js`;
    script.async = true;
    script.onload = () => {
      setIsJitsiLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Jitsi Meet API');
    };
    document.head.appendChild(script);
  };

  const initializeJitsi = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
    }

    const jitsiDomain = new URL(jitsiUrl).hostname;
    const options = {
      roomName: roomId,
      width: '100%',
      height: minimized ? 200 : 400,
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        APP_NAME: 'KoodeCode',
        NATIVE_APP_NAME: 'KoodeCode',
        enableWelcomePage: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        resolution: minimized ? 360 : 720,
        constraints: {
          video: {
            height: {
              ideal: minimized ? 360 : 720,
              max: minimized ? 480 : 1080,
              min: 240
            }
          }
        },
        disableAudioLevels: minimized,
        enableNoisyMicDetection: !minimized,
        p2p: { enabled: true },
        enableAPI: true,
        enableAPIHttps: true
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY: false,
        TOOLBAR_BUTTONS: minimized ? 
          ['microphone', 'camera', 'hangup'] :
          [
            'microphone', 'camera', 'closedcaptions', 'desktop',
            'fullscreen', 'fodeviceselection', 'hangup', 'profile',
            'recording', 'settings', 'raisehand', 'videoquality', 
            'filmstrip', 'invite'
          ],
        MOBILE_APP_PROMO: false,
        DEFAULT_BACKGROUND: '#1a1a1a',
        DISABLE_VIDEO_BACKGROUND: minimized
      }
    };

    jitsiApiRef.current = new window.JitsiMeetExternalAPI(jitsiDomain, options);
    setupJitsiEventListeners();
  };

  const setupJitsiEventListeners = () => {
    if (!jitsiApiRef.current) return;

    jitsiApiRef.current.addEventListner('videoConferenceJoined', (event: any) => {
      console.log('Joined video conference:', event);
    });

    jitsiApiRef.current.addEventListner('participantJoined', (event: any) => {
      setActiveParticipants(prev => [...prev, event.id]);
    });

    jitsiApiRef.current.addEventListner('participantLeft', (event: any) => {
      setActiveParticipants(prev => prev.filter(id => id !== event.id));
    });

    jitsiApiRef.current.addEventListner('audioMuteStatusChanged', (event: any) => {
      setIsAudioMuted(event.muted);
    });

    jitsiApiRef.current.addEventListner('videoMuteStatusChanged', (event: any) => {
      setIsVideoMuted(event.muted);
    });
  };

  const toggleAudio = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleAudio');
    }
  };

  const toggleVideo = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('toggleVideo');
    }
  };

  const hangUp = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('hangup');
    }
  };

  return (
    <div className={`video-call-container ${minimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-medium">KoodeCode Video Call</span>
          <span className="text-gray-400 text-sm">
            {participants.filter(p => p.isOnline).length} participant{participants.filter(p => p.isOnline).length === 1 ? '' : 's'}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {!minimized && onMinimize && (
            <button
              onClick={onMinimize}
              className="text-gray-400 hover:text-white p-1 transition-colors"
              title="Minimize"
            >
              <Minimize2 size={16} />
            </button>
          )}
          
          {minimized && onExpand && (
            <button
              onClick={onExpand}
              className="text-gray-400 hover:text-white p-1 transition-colors"
              title="Expand"
            >
              <Maximize2 size={16} />
            </button>
          )}
          
          {minimized && onClose && (
            <button
              onClick={onClose}
              title="Close Minimized View"
              className="text-gray-400 hover:text-red-400 p-1 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Jitsi Container */}
      <div 
        ref={jitsiContainerRef}
        className={`jitsi-container bg-gray-900 ${minimized ? 'h-48' : 'h-96'}`}
        style={{ 
          height: minimized ? '200px' : '400px',
          minHeight: minimized ? '200px' : '400px'
        }}
      />

      {/* Quick Controls for Minimized View */}
      {minimized && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-2">
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full transition-colors ${
              isAudioMuted 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          
          <button
            onClick={toggleVideo}
            className={`p-2 rounded-full transition-colors ${
              isVideoMuted 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
            title={isVideoMuted ? 'Turn On Video' : 'Turn Off Video'}
          >
            {isVideoMuted ? <VideoOff size={16} /> : <Video size={16} />}
          </button>
        </div>
      )}

      {/* Loading State */}
      {!isJitsiLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Loading KoodeCode Video Call...</p>
          </div>
        </div>
      )}

      {/* Chat Section */}
      <div className="bg-black border-t border-gray-700">
        <ChatComponent roomId={roomId} />
      </div>
    </div>
  );
};

export default VideoCallTab;
