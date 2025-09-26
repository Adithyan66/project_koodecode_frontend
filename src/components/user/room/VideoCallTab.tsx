




import React, { useEffect, useRef, useState } from 'react';
import { Minimize2, Maximize2, X, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import ChatComponent from './ChatComponent';

interface VideoCallTabProps {
  roomId: string;
  jitsiUrl: string;
  participants: any[];
  minimized?: boolean;
  onMinimize?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  username?: string;
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
  onClose,
  username = "User"
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const scriptLoadedRef = useRef(false);

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
      setTimeout(() => {
        initializeJitsi();
      }, 100);
    }
  }, [isJitsiLoaded, roomId, username]);

  const loadJitsiScript = () => {
    if (window.JitsiMeetExternalAPI || scriptLoadedRef.current) {
      setIsJitsiLoaded(true);
      return;
    }

    const jitsiDomain = new URL(jitsiUrl).hostname;

    const oldDefine = (window as any).define;
    delete (window as any).define;

    const script = document.createElement('script');
    // script.src = `https://${jitsiDomain}:8443/external_api.js`;
    script.src = `http://localhost:8000/external_api.js`;
    script.crossOrigin = "anonymous"; // Add this line
    script.async = true;

    script.onload = () => {
      if (oldDefine) {
        (window as any).define = oldDefine;
      }

      setTimeout(() => {
        if (window.JitsiMeetExternalAPI) {
          scriptLoadedRef.current = true;
          setIsJitsiLoaded(true);
        }
      }, 300);
    };

    script.onerror = (error) => {
      if (oldDefine) {
        (window as any).define = oldDefine;
      }
      console.error('Failed to load Jitsi Meet API:', error);
    };

    document.head.appendChild(script);
  };

  const initializeJitsi = () => {
    if (!window.JitsiMeetExternalAPI) {
      console.error('JitsiMeetExternalAPI is not available');
      return;
    }

    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
    }

    // const jitsiDomain = new URL(jitsiUrl).hostname;

    const jitsiDomain = 'localhost:8443'

    // Simplified configuration that ensures UI visibility
    const options = {
      roomName: roomId,
      width: '100%',
      height: minimized ? 200 : 645,
      parentNode: jitsiContainerRef.current,

      // User info for auto-join
      userInfo: {
        displayName: username,
        email: `${username.toLowerCase().replace(/\s+/g, '')}@koode.code`
      },

      configOverwrite: {
        // Skip prejoin page for auto-join
        prejoinPageEnabled: false,
        enableWelcomePage: false,
        requireDisplayName: false,

        // Basic video/audio settings
        startWithAudioMuted: false,
        startWithVideoMuted: false,

        // Hide only Jitsi branding, keep functional UI
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,

        // Keep essential UI elements visible
        resolution: minimized ? 360 : 720,
        p2p: { enabled: true },

        // Ensure video streams are visible
        startAudioOnly: false,
        channelLastN: -1, // Show all participants

        // Keep toolbar visible but customized
        toolbarConfig: {
          alwaysVisible: true,
          timeout: 4000,
        }
      },

      interfaceConfigOverwrite: {
        // Remove Jitsi branding but keep functional elements
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_POWERED_BY: false,

        // Custom app name
        APP_NAME: 'KoodeCode',
        NATIVE_APP_NAME: 'KoodeCode',

        // Keep essential toolbar buttons
        TOOLBAR_BUTTONS: minimized ? 
          ['microphone', 'camera', 'hangup'] :
          [
            'microphone', 'camera', 'desktop', 'fullscreen', 
            'hangup', 'settings', 'videoquality', 'filmstrip'
          ],

        // Keep video elements visible
        FILM_STRIP_MAX_HEIGHT: minimized ? 100 : 200,
        VERTICAL_FILMSTRIP: false,

        // Customize colors but keep interface functional
        DEFAULT_BACKGROUND: '#1a1a1a',

        // Don't hide essential connection info
        CONNECTION_INDICATOR_DISABLED: false,

        // Keep participant display functional
        DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
        DISABLE_FOCUS_INDICATOR: false,

        // Remove promotional content only
        MOBILE_APP_PROMO: false,
        HIDE_INVITE_MORE_HEADER: true
      }
    };


    console.log("Initializing Jitsi with domain:", jitsiDomain);

    try {

      jitsiApiRef.current = new window.JitsiMeetExternalAPI(jitsiDomain, options);
      setupJitsiEventListeners();

    } catch (error) {
      console.error('Failed to create JitsiMeetExternalAPI instance:', error);
    }
  };

  const setupJitsiEventListeners = () => {
    if (!jitsiApiRef.current) return;

    jitsiApiRef.current.addEventListener('connectionFailed', (event: any) => {
      console.log('Connection failed:', event);
      // Retry with audio-only mode
      setTimeout(() => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.executeCommand('toggleVideo'); // Force video off
        }
      }, 2000);
    });

    // Handle conference failures
    jitsiApiRef.current.addEventListener('conferenceFailed', (event: any) => {
      console.log('Conference failed:', event);
      // Show user-friendly error
      alert('Connection unstable. Switching to audio-only mode.');
    });

    // Monitor ready state
    jitsiApiRef.current.addEventListener('readyToClose', () => {
      console.log('Jitsi ready to close');
    });

    // Conference events
    jitsiApiRef.current.addEventListener('videoConferenceJoined', (event: any) => {
      console.log('Successfully joined video conference:', event);
      setIsJoined(true);

      // Only inject minimal CSS to hide watermarks, not functional elements
      injectMinimalCSS();
    });

    jitsiApiRef.current.addEventListener('videoConferenceLeft', (event: any) => {
      console.log('Left video conference:', event);
      setIsJoined(false);
      if (onClose) {
        onClose();
      }
    });

    // Participant events
    jitsiApiRef.current.addEventListener('participantJoined', (event: any) => {
      console.log('Participant joined:', event);
      setActiveParticipants(prev => [...prev, event.id]);
    });

    jitsiApiRef.current.addEventListener('participantLeft', (event: any) => {
      console.log('Participant left:', event);
      setActiveParticipants(prev => prev.filter(id => id !== event.id));
    });

    // Audio/Video status
    jitsiApiRef.current.addEventListener('audioMuteStatusChanged', (event: any) => {
      setIsAudioMuted(event.muted);
    });

    jitsiApiRef.current.addEventListener('videoMuteStatusChanged', (event: any) => {
      setIsVideoMuted(event.muted);
    });

    // Debug events to see what's happening
    jitsiApiRef.current.addEventListener('readyToClose', () => {
      console.log('Jitsi ready to close');
    });

    jitsiApiRef.current.addEventListener('largeVideoChanged', (event: any) => {
      console.log('Large video changed:', event);
    });
  };

  // Inject only minimal CSS to hide watermarks, preserve functionality
  const injectMinimalCSS = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Hide only Jitsi watermarks, keep everything else */
      .leftwatermark,
      .rightwatermark,
      .brand-watermark,
      .jitsi-watermark,
      .poweredby,
      [class*="watermark"]:not([class*="avatar"]):not([class*="background"]) {
        display: none !important;
      }
      
      /* Hide promotional content */
      .promotional-close-page,
      .chrome-extension-banner,
      .deep-linking-mobile,
      .deep-linking-desktop {
        display: none !important;
      }
      
      /* Ensure video containers are visible */
      .videocontainer,
      .large-video-container,
      .large-video,
      .remote-video-container,
      .local-video-container {
        display: block !important;
        visibility: visible !important;
      }
      
      /* Ensure filmstrip is visible */
      .filmstrip,
      .remote-videos-container {
        display: flex !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
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

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.executeCommand('hangup');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className={`video-call-container ${minimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="bg-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isJoined ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-white font-medium">KoodeCode Video Call</span>
          <span className="text-gray-400 text-sm">
            {username} • {isJoined ? 'Connected' : 'Connecting...'}
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
              title="Close"
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
        className={`jitsi-container bg-black ${minimized ? 'h-48' : 'h-96'}`}
        style={{
          height: minimized ? '200px' : '400px',
          minHeight: minimized ? '200px' : '400px'
        }}
      />


      {/* Quick Controls for Minimized View */}
      {minimized && isJoined && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-center space-x-2">
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full transition-colors ${isAudioMuted
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-2 rounded-full transition-colors ${isVideoMuted
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
            <p className="text-sm text-gray-400">Auto-joining as {username}...</p>
          </div>
        </div>
      )}

      {/* Chat Section */}
      {/* <div className="bg-black border-t border-gray-700">
        <ChatComponent roomId={roomId} />
      </div> */}
    </div>
  );
};

export default VideoCallTab;






