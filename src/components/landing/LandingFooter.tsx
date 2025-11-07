import React from 'react';

const Footer: React.FC = () => (
    <footer className="px-6 py-10 border-t border-white/10 bg-black/60 backdrop-blur">
        <div className="max-w-6xl mx-auto flex flex-col items-center space-y-4 text-sm text-white/50">
            <div className="flex items-center space-x-2 uppercase tracking-[0.4em] text-white/40">
                <span>KoodeCode</span>
                <span>·</span>
                <span>Collaborate Fearlessly</span>
            </div>
            <p>&copy; {new Date().getFullYear()} KoodeCode. Crafted for creators and learners.</p>
        </div>
    </footer>
);

export default Footer;

