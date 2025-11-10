import React from 'react';

interface PushPermissionPromptProps {
  isLoading: boolean;
  onEnable: () => void;
  onDismiss: () => void;
}

const PushPermissionPrompt: React.FC<PushPermissionPromptProps> = ({
  isLoading,
  onEnable,
  onDismiss
}) => {
  return (
    <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-slate-950/90 p-5 shadow-[0_25px_50px_rgba(0,0,0,0.55)] backdrop-blur-sm md:w-[360px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300/70">Stay Updated</p>
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">
            Enable real-time notifications
          </h3>
          <p className="text-xs text-gray-300">
            Get instant alerts for upcoming rooms, session invites, and community announcements.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onEnable}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
            )}
            <span>{isLoading ? 'Enabling…' : 'Enable Notifications'}</span>
          </button>
          <button
            type="button"
            onClick={onDismiss}
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushPermissionPrompt;

