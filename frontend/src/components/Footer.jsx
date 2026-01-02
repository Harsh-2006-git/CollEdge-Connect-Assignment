import React from 'react';
import { Github, Twitter, Linkedin, Instagram, Rocket, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-12 px-6 overflow-hidden bg-white dark:bg-[#050505]">
            {/* Minimalist Top Border */}
            <div className="max-w-7xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent mb-12"></div>

            <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 text-center md:text-left">

                {/* Left Side: Brand & Tagline */}
                <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start space-x-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary dark:bg-primary-neon flex items-center justify-center text-white dark:text-black shadow-lg transition-transform group-hover:rotate-12">
                            <Rocket size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none">
                            CollEdge<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-neon">Connect</span>
                        </span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        Simplifying connections. Everywhere.
                    </p>
                </div>

                {/* Right Side: Social Icons & Credits */}
                <div className="flex flex-col items-center md:items-end space-y-4">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-6">
                        {[
                            { Icon: Github, href: "#", label: "Github" },
                            { Icon: Twitter, href: "#", label: "Twitter" },
                            { Icon: Linkedin, href: "#", label: "LinkedIn" },
                            { Icon: Instagram, href: "#", label: "Instagram" }
                        ].map(({ Icon, href, label }, i) => (
                            <a
                                key={i}
                                href={href}
                                aria-label={label}
                                className="text-gray-400 hover:text-primary dark:hover:text-primary-neon transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>

                    {/* Bottom Credits */}
                    <div className="flex flex-col items-center md:items-end space-y-2">
                        <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
                            <span className="opacity-20">•</span>
                            <span>&copy; {currentYear} CollEdge</span>
                            <span className="opacity-20">•</span>
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
                        </div>

                        <div className="flex items-center text-[9px] font-bold text-gray-400 opacity-60">
                            Made with <Heart size={10} className="mx-1 text-primary-pink" fill="currentColor" /> by <span className="ml-1 text-gray-900 dark:text-white uppercase tracking-tighter font-black">Harsh </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Ambient Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-24 bg-primary/10 dark:bg-primary-neon/5 rounded-full blur-[60px] pointer-events-none"></div>
        </footer>
    );
};

export default Footer;
