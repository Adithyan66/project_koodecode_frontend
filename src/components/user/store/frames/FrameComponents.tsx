
import React from 'react';

interface FrameProps {
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

export const DefaultFrame: React.FC<FrameProps> = ({ children, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-20 h-20', 
        large: 'w-32 h-32'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-400 overflow-hidden`}>
            {children}
        </div>
    );
};

export const GoldFrame: React.FC<FrameProps> = ({ children, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-20 h-20',
        large: 'w-32 h-32'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-4 border-yellow-400 shadow-lg shadow-yellow-400/50 overflow-hidden relative`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20"></div>
            {children}
        </div>
    );
};

export const DiamondFrame: React.FC<FrameProps> = ({ children, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-20 h-20',
        large: 'w-32 h-32'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-4 border-cyan-400 shadow-lg shadow-cyan-400/50 overflow-hidden relative`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30"></div>
            <div className="absolute inset-2 rounded-full border-2 border-cyan-300/50"></div>
            {children}
        </div>
    );
};

export const FireFrame: React.FC<FrameProps> = ({ children, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-20 h-20',
        large: 'w-32 h-32'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-4 border-red-500 shadow-lg shadow-red-500/50 overflow-hidden relative`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/30 to-orange-600/30 animate-pulse"></div>
            {children}
        </div>
    );
};

export const NeonFrame: React.FC<FrameProps> = ({ children, size = 'medium' }) => {
    const sizeClasses = {
        small: 'w-12 h-12',
        medium: 'w-20 h-20',
        large: 'w-32 h-32'
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-4 border-green-400 shadow-lg shadow-green-400/50 overflow-hidden relative animate-pulse`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/30 to-emerald-600/30"></div>
            {children}
        </div>
    );
};

// Frame component mapping
export const FRAME_COMPONENTS = {
    'default-frame': DefaultFrame,
    'gold-frame': GoldFrame,
    'diamond-frame': DiamondFrame,
    'fire-frame': FireFrame,
    'neon-frame': NeonFrame,
};

export const getFrameComponent = (componentId: string) => {
    return FRAME_COMPONENTS[componentId as keyof typeof FRAME_COMPONENTS] || DefaultFrame;
};