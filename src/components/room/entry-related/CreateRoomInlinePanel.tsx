

import {  X, Upload, Calendar, Clock3, Lock, Users as UsersIcon, Code, Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';
import { useCreateRoom } from '../../../app/hooks/room/useCreateRoom';
import ProblemSelectorForModal from './ProblemSelectorForModal';


interface InlinePanelProps {
    onClose: () => void;
}

const CreateRoomInlinePanel: React.FC<InlinePanelProps> = ({ onClose }) => {
    const {
        fileInputRef,
        formData,
        errors,
        error,
        selectedProblem,
        showProblemSelector,
        thumbnailPreview,
        isUploading,
        isSubmitting,
        scheduledDateTime,
        showPassword,
        handleInputChange,
        handleThumbnailSelect,
        handleProblemSelect,
        handleSubmit,
        handleClose,
        getDifficultyColor,
        getMinDateTime,
        toggleProblemSelector,
        closeProblemSelector,
        toggleShowPassword,
        handleScheduledTimeChange,
        handleRemoveThumbnail,
        clearSelectedProblem,
    } = useCreateRoom({ onClose });

    const handlePanelClose = () => {
        if (!isSubmitting) {
            handleClose();
        }
    };

    return (
        <div className="flex h-full flex-col overflow-hidden text-white">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">Launch</p>
                    <h3 className="mt-2 text-xl font-semibold">Create a collaborative room</h3>
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

            {error && (
                <div className="mt-4 flex items-center space-x-2 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex-1 space-y-5 overflow-y-auto pr-2">
                <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Starter Problem</label>
                    <div className="relative">
                        {selectedProblem ? (
                            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-semibold text-emerald-300">#{selectedProblem.problemNumber}</span>
                                            <span className="text-sm font-medium">{selectedProblem.title}</span>
                                        </div>
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDifficultyColor(selectedProblem.difficulty)}`}>
                                            {selectedProblem.difficulty}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearSelectedProblem}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                                        disabled={isSubmitting}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={toggleProblemSelector}
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center space-x-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:border-emerald-400/50 hover:text-white"
                            >
                                <Code size={16} />
                                <span>Select a starter problem</span>
                            </button>
                        )}
                        {showProblemSelector && !selectedProblem && (
                            <ProblemSelectorForModal
                                onSelectProblem={handleProblemSelect}
                                onClose={closeProblemSelector}
                            />
                        )}
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => handleInputChange('isInstant', true)}
                        disabled={isSubmitting}
                        className={`flex items-start space-x-3 rounded-2xl border px-4 py-3 transition ${formData.isInstant ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200 shadow-[0_10px_30px_-15px_rgba(16,185,129,0.7)]' : 'border-white/10 bg-white/5 text-white/65 hover:border-emerald-400/40 hover:text-white'}`}
                    >
                        <div className="mt-1 rounded-full bg-emerald-500/15 p-2 text-emerald-300">
                            <Clock3 size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Instant Room</p>
                            <p className="text-xs text-white/60">Open right away with everyone on board.</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleInputChange('isInstant', false)}
                        disabled={isSubmitting}
                        className={`flex items-start space-x-3 rounded-2xl border px-4 py-3 transition ${!formData.isInstant ? 'border-sky-400/60 bg-sky-500/10 text-sky-200 shadow-[0_10px_30px_-15px_rgba(56,189,248,0.7)]' : 'border-white/10 bg-white/5 text-white/65 hover:border-sky-400/40 hover:text-white'}`}
                    >
                        <div className="mt-1 rounded-full bg-sky-500/15 p-2 text-sky-300">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Scheduled Room</p>
                            <p className="text-xs text-white/60">Lock in a later time with full context.</p>
                        </div>
                    </button>
                </div>

                {!formData.isInstant && (
                    <div className="space-y-2">
                        <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Scheduled Time</label>
                        <input
                            type="datetime-local"
                            min={getMinDateTime()}
                            value={scheduledDateTime}
                            onChange={(event) => handleScheduledTimeChange(event.target.value)}
                            disabled={isSubmitting}
                            className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${errors.scheduledTime ? 'border-red-500/60' : 'border-white/10'}`}
                        />
                        {errors.scheduledTime && (
                            <div className="flex items-center space-x-2 text-xs text-red-300">
                                <AlertCircle size={12} />
                                <span>{errors.scheduledTime}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Room Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(event) => handleInputChange('name', event.target.value)}
                        placeholder="Give your room a memorable identity"
                        disabled={isSubmitting}
                        className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${errors.name ? 'border-red-500/60' : 'border-white/10'}`}
                    />
                    {errors.name && (
                        <div className="flex items-center space-x-2 text-xs text-red-300">
                            <AlertCircle size={12} />
                            <span>{errors.name}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(event) => handleInputChange('description', event.target.value)}
                        placeholder="Outline your goals, deliverables, or practice focus"
                        rows={3}
                        disabled={isSubmitting}
                        className={`w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${errors.description ? 'border-red-500/60' : 'border-white/10'}`}
                    />
                    {errors.description && (
                        <div className="flex items-center space-x-2 text-xs text-red-300">
                            <AlertCircle size={12} />
                            <span>{errors.description}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {formData.isPrivate ? (
                                <Lock size={18} className="text-red-300" />
                            ) : (
                                <UsersIcon size={18} className="text-emerald-300" />
                            )}
                            <div>
                                <p className="text-sm font-semibold">{formData.isPrivate ? 'Private Room' : 'Public Room'}</p>
                                <p className="text-xs text-white/60">{formData.isPrivate ? 'Share access only with teammates' : 'Let the community discover your session'}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                checked={formData.isPrivate}
                                onChange={(event) => handleInputChange('isPrivate', event.target.checked)}
                                disabled={isSubmitting}
                                className="sr-only"
                            />
                            <span className="flex h-6 w-11 items-center rounded-full bg-white/10 transition peer-focus:outline-none">
                                <span className={`ml-0.5 h-5 w-5 rounded-full bg-white transition ${formData.isPrivate ? 'translate-x-5 bg-red-400' : ''}`} />
                            </span>
                        </label>
                    </div>
                    {formData.isPrivate && (
                        <div className="space-y-2">
                            <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Room Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(event) => handleInputChange('password', event.target.value)}
                                    placeholder="Choose a secure phrase"
                                    disabled={isSubmitting}
                                    className={`w-full rounded-2xl border bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${errors.password ? 'border-red-500/60' : 'border-white/10'}`}
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    disabled={isSubmitting}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="flex items-center space-x-2 text-xs text-red-300">
                                    <AlertCircle size={12} />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-[0.3em] text-white/50">Room Thumbnail</label>
                    <div className="space-y-3">
                        {thumbnailPreview ? (
                            <div className="group relative rounded-2xl">
                                <img src={thumbnailPreview} alt="Room thumbnail" className="h-32 w-full rounded-2xl object-cover" />
                                <button
                                    type="button"
                                    onClick={handleRemoveThumbnail}
                                    disabled={isSubmitting}
                                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 text-sm font-medium text-white opacity-0 transition group-hover:opacity-100"
                                >
                                    Remove Thumbnail
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 py-10 text-white/60 transition hover:border-emerald-400/40 hover:text-white"
                                disabled={isSubmitting}
                            >
                                <Upload size={20} className="mb-2" />
                                <span className="text-sm font-medium">Upload cover image</span>
                                <span className="text-xs">PNG, JPG, WebP up to 5MB</span>
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailSelect}
                            disabled={isSubmitting}
                            className="hidden"
                        />
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
                        disabled={isSubmitting || isUploading}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-black shadow-[0_20px_60px_-20px_rgba(16,185,129,0.6)] transition hover:opacity-90"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader className="animate-spin" size={16} />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <span>{formData.isInstant ? 'Create & Join Room' : 'Schedule Room'}</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRoomInlinePanel