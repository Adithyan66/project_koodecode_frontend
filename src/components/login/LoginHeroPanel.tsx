import React from 'react';
import LoginHero from '../../assets/images/login_student-removebg-preview.png';

const LoginHeroPanel: React.FC = () => (
    <div className="flex-1 flex items-center justify-center">
        <div className="relative">
            <img
                src={LoginHero}
                alt="Character"
                className="w-150 h-150 object-cover rounded-full opacity-80"
            />
        </div>
    </div>
);

export default LoginHeroPanel;
