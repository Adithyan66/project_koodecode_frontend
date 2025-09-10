

import React from 'react';
import { imageKitService } from '../../services/ImageKitService';

interface AvatarProps {
    profileImageKey?: string;
    username: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
    profileImageKey, 
    username, 
    size = 'md', 
    className = '' 
}) => {
    const sizeClasses = {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl'
    };

    const optimizedImageUrl = profileImageKey 
        ? imageKitService.getProfileImageUrl(profileImageKey, 'small')
        : null;

    return (
        <div className={`
            ${sizeClasses[size]} 
            rounded-full 
            overflow-hidden 
            bg-gray-300 
            dark:bg-gray-600 
            flex 
            items-center 
            justify-center 
            ${className}
        `}>
            {optimizedImageUrl ? (
                <img 
                    src={optimizedImageUrl} 
                    alt={`${username}'s avatar`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            ) : (
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                    {username.charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );
};

export default Avatar;
