



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
  username?: string;
  onLocalVideoStatusChange?: (on: boolean) => void;
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
  username = "Adhi",
  onLocalVideoStatusChange
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const [isJitsiLoaded, setIsJitsiLoaded] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const scriptLoadedRef = useRef(false);
  
  // Add these refs to prevent multiple initialization
  const initializationRef = useRef(false);
  const mountedRef = useRef(false);
  const roomInitializedRef = useRef('');

  // Track component mount state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Load script only once
  useEffect(() => {
    loadJitsiScript();
    return () => {
      if (jitsiApiRef.current) {
        console.log('Component unmounting, disposing Jitsi');
        try {
          jitsiApiRef.current.dispose();
        } catch (error) {
          console.error('Error disposing Jitsi on unmount:', error);
        }
        jitsiApiRef.current = null;
        initializationRef.current = false;
      }
    };
  }, []);

  // Initialize Jitsi only when needed
  useEffect(() => {
    let timeoutId: number;

    if (isJitsiLoaded && jitsiContainerRef.current && mountedRef.current) {
      // Only initialize if room has changed or no instance exists
      if (roomInitializedRef.current !== roomId && !initializationRef.current) {
        timeoutId = setTimeout(() => {
          if (mountedRef.current) {
            initializeJitsi();
          }
        }, 200);
      }
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isJitsiLoaded, roomId]);

  const loadJitsiScript = () => {
    if (window.JitsiMeetExternalAPI || scriptLoadedRef.current) {
      setIsJitsiLoaded(true);
      return;
    }

    console.log('Loading Jitsi script...');
    const oldDefine = (window as any).define;
    let defineOverridden = false;

    try {
      (window as any).define = undefined;
      defineOverridden = true;
    } catch (error) {
      console.warn('Unable to temporarily override window.define before loading Jitsi script:', error);
    }

    const script = document.createElement('script');
    script.src = import.meta.env.VITE_JITSI_SCRIPT_URL;
    script.crossOrigin = "anonymous";
    script.async = true;

    script.onload = () => {
      if (defineOverridden) {
        try {
          (window as any).define = oldDefine;
        } catch (error) {
          console.warn('Unable to restore window.define after loading Jitsi script:', error);
        }
      }

      setTimeout(() => {
        if (window.JitsiMeetExternalAPI && mountedRef.current) {
          scriptLoadedRef.current = true;
          setIsJitsiLoaded(true);
          console.log('Jitsi script loaded successfully');
        }
      }, 300);
    };

    script.onerror = (error) => {
      if (defineOverridden) {
        try {
          (window as any).define = oldDefine;
        } catch (restoreError) {
          console.warn('Unable to restore window.define after failing to load Jitsi script:', restoreError);
        }
      }
      console.error('Failed to load Jitsi Meet API:', error);
    };

    document.head.appendChild(script);
  };

  const initializeJitsi = () => {
    console.log('=== JITSI INITIALIZATION ATTEMPT ===');
    console.log('initializationRef.current:', initializationRef.current);
    console.log('mountedRef.current:', mountedRef.current);
    console.log('jitsiApiRef.current exists:', !!jitsiApiRef.current);
    console.log('roomId:', roomId);
    console.log('username:', username);

    // Prevent multiple initializations
    if (initializationRef.current || !mountedRef.current) {
      console.log('Skipping initialization - already in progress or unmounted');
      return;
    }

    if (!window.JitsiMeetExternalAPI) {
      console.error('JitsiMeetExternalAPI is not available');
      return;
    }

    // Dispose existing instance if any
    if (jitsiApiRef.current) {
      console.log('Disposing existing Jitsi instance');
      try {
        jitsiApiRef.current.dispose();
      } catch (error) {
        console.error('Error disposing existing Jitsi:', error);
      }
      jitsiApiRef.current = null;
    }

    initializationRef.current = true;
    roomInitializedRef.current = roomId;

    // const jitsiDomain = 'localhost:8443';
    // const jitsiDomain = 'meet.jit.si';
    const jitsiDomain = import.meta.env.VITE_JITSIDOMAIN;

    const options = {
      roomName: roomId,
      width: '100%',
      height: minimized ? 200 : 645,
      parentNode: jitsiContainerRef.current,

      userInfo: {
        displayName: username,
        email: `${username.toLowerCase().replace(/\s+/g, '')}@koode.code`
      },

      configOverwrite: {
        prejoinPageEnabled: false,
        prejoinConfig: {
          enabled: false,
        },
        enableWelcomePage: false,
        requireDisplayName: false,
        enableClosePage: false,
        disableDeepLinking: true,
        startWithAudioMuted: true,
        startWithVideoMuted: true,
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        resolution: minimized ? 360 : 720,
        p2p: { enabled: true },
        startAudioOnly: false,
        channelLastN: -1,
        toolbarConfig: {
          alwaysVisible: true,
          timeout: 4000,
        }
      },

      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_POWERED_BY: false,
        APP_NAME: 'KoodeCode',
        NATIVE_APP_NAME: 'KoodeCode',
        TOOLBAR_BUTTONS: minimized ?
          ['microphone', 'camera'] :
          [
            'microphone', 'camera', 'desktop', 'fullscreen',
            'participants-pane', 'settings', 'videoquality', 'filmstrip'
          ],
        FILM_STRIP_MAX_HEIGHT: minimized ? 100 : 200,
        VERTICAL_FILMSTRIP: false,
        DEFAULT_BACKGROUND: '#1a1a1a',
        CONNECTION_INDICATOR_DISABLED: false,
        DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
        DISABLE_FOCUS_INDICATOR: false,
        MOBILE_APP_PROMO: false,
        HIDE_INVITE_MORE_HEADER: true
      }
    };

    console.log("Initializing Jitsi with domain:", jitsiDomain);

    try {
      jitsiApiRef.current = new window.JitsiMeetExternalAPI(jitsiDomain, options);
      
      // Remove the setFeatureFlag call as it doesn't exist
      // jitsiApiRef.current.setFeatureFlag('prejoinpage.enabled', false);
      
      setupJitsiEventListeners();
      console.log('Jitsi initialized successfully');

    } catch (error) {
      console.error('Failed to create JitsiMeetExternalAPI instance:', error);
      initializationRef.current = false;
      jitsiApiRef.current = null;
    }
  };

  const setupJitsiEventListeners = () => {
    if (!jitsiApiRef.current) return;

    console.log('Setting up Jitsi event listeners');

    jitsiApiRef.current.addEventListener('connectionFailed', (event: any) => {
      console.log('Connection failed:', event);
      setTimeout(() => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.executeCommand('toggleVideo');
        }
      }, 2000);
    });

    jitsiApiRef.current.addEventListener('conferenceFailed', (event: any) => {
      console.log('Conference failed:', event);
      alert('Connection unstable. Switching to audio-only mode.');
    });

    jitsiApiRef.current.addEventListener('readyToClose', () => {
      console.log('Jitsi ready to close');
    });

    jitsiApiRef.current.addEventListener('videoConferenceJoined', (event: any) => {
      console.log('Successfully joined video conference:', event);
      setIsJoined(true);
      injectMinimalCSS();
      try {
        const mutedMaybe = jitsiApiRef.current?.isVideoMuted?.();
        if (typeof mutedMaybe === 'boolean') {
          onLocalVideoStatusChange && onLocalVideoStatusChange(!mutedMaybe);
        } else if (mutedMaybe && typeof mutedMaybe.then === 'function') {
          mutedMaybe.then((m: boolean) => onLocalVideoStatusChange && onLocalVideoStatusChange(!m)).catch(() => {});
        }
      } catch {}
    });

    jitsiApiRef.current.addEventListener('videoConferenceLeft', (event: any) => {
      console.log('Left video conference:', event);
      setIsJoined(false);
      initializationRef.current = false;
      roomInitializedRef.current = '';
      if (onClose) {
        onClose();
      }
      try { onLocalVideoStatusChange && onLocalVideoStatusChange(false); } catch {}
    });

    jitsiApiRef.current.addEventListener('participantJoined', (event: any) => {
      console.log('Participant joined:', event);
      setActiveParticipants(prev => [...prev, event.id]);
    });

    jitsiApiRef.current.addEventListener('participantLeft', (event: any) => {
      console.log('Participant left:', event);
      setActiveParticipants(prev => prev.filter(id => id !== event.id));
    });

    jitsiApiRef.current.addEventListener('audioMuteStatusChanged', (event: any) => {
      setIsAudioMuted(event.muted);
    });

    jitsiApiRef.current.addEventListener('videoMuteStatusChanged', (event: any) => {
      setIsVideoMuted(event.muted);
      try { onLocalVideoStatusChange && onLocalVideoStatusChange(!event.muted); } catch {}
    });

    jitsiApiRef.current.addEventListener('largeVideoChanged', (event: any) => {
      console.log('Large video changed:', event);
    });
  };

  const injectMinimalCSS = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      .leftwatermark,
      .rightwatermark,
      .brand-watermark,
      .jitsi-watermark,
      .poweredby,
      [class*="watermark"]:not([class*="avatar"]):not([class*="background"]) {
        display: none !important;
      }
      
      .promotional-close-page,
      .chrome-extension-banner,
      .deep-linking-mobile,
      .deep-linking-desktop {
        display: none !important;
      }
      
      .videocontainer,
      .large-video-container,
      .large-video,
      .remote-video-container,
      .local-video-container {
        display: block !important;
        visibility: visible !important;
      }
      
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
        try {
          jitsiApiRef.current.executeCommand('hangup');
        } catch (error) {
          console.error('Error during hangup:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className={`video-call-container ${minimized ? 'minimized' : ''} relative h-full`}>
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
        className="absolute inset-0 bg-black"
        style={{ height: '100%', minHeight: '100%' }}
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
    </div>
  );
};

export default VideoCallTab;
