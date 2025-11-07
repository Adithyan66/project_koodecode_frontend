import {  X,  Lock, Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';
import { useJoinPrivateRoom } from '../../../app/hooks/room/useJoinPrivateRoom';

interface InlinePanelProps {
    onClose: () => void;
}

const JoinPrivateRoomInlinePanel: React.FC<InlinePanelProps> = ({ onClose }) => {
    const {
        formData,
        errors,
        showPassword,
        isSubmitting,
        handleInputChange,
        handleSubmit,
        handleClose,
        toggleShowPassword,
    } = useJoinPrivateRoom({ onClose });

    const handlePanelClose = () => {
        if (!isSubmitting) {
            handleClose();
        }
    };

    return (
        <div className="flex h-full flex-col overflow-hidden text-white">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">Join</p>
                    <h3 className="mt-2 text-xl font-semibold">Enter a private room</h3>
                </div>
                <button
                    type="button"
                    onClick={handlePanelClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white"
                    disabled={isSubmitting}
                >
                    <X size={18} />
                </button>
            </div>

            {errors.general && (
                <div className="mt-4 flex items-center space-x-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <AlertCircle size={16} />
                    <span>{errors.general}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex-1 space-y-5">
                <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Room Name</label>
                    <input
                        type="text"
                        value={formData.roomName}
                        onChange={(event) => handleInputChange('roomName', event.target.value)}
                        placeholder="Provide the private room name"
                        disabled={isSubmitting}
                        className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${errors.roomName ? 'border-red-500/60' : 'border-white/10'}`}
                    />
                    {errors.roomName && (
                        <div className="flex items-center space-x-2 text-xs text-red-300">
                            <AlertCircle size={12} />
                            <span>{errors.roomName}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Room Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(event) => handleInputChange('password', event.target.value)}
                            placeholder="Enter the shared password"
                            disabled={isSubmitting}
                            className={`w-full rounded-2xl border bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${errors.password ? 'border-red-500/60' : 'border-white/10'}`}
                        />
                        <button
                            type="button"
                            onClick={toggleShowPassword}
                            disabled={isSubmitting}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && (
                        <div className="flex items-center space-x-2 text-xs text-red-300">
                            <AlertCircle size={12} />
                            <span>{errors.password}</span>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/70">
                    <div className="flex items-center space-x-3">
                        <Lock size={18} className="text-red-300" />
                        <div>
                            <p className="font-semibold text-white">Private rooms stay private</p>
                            <p className="text-xs text-white/60">Share credentials carefully with teammates only.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={handlePanelClose}
                        disabled={isSubmitting}
                        className="flex-1 rounded-full border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-black shadow-[0_20px_60px_-20px_rgba(16,185,129,0.6)] transition hover:opacity-90"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader className="animate-spin" size={16} />
                                <span>Joining...</span>
                            </>
                        ) : (
                            <span>Join Room</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};


export default JoinPrivateRoomInlinePanel