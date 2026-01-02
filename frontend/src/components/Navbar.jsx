import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, Shield, Zap, LayoutGrid, Info, Phone } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: Zap },
        { name: 'Dashboard', path: '/admin', icon: LayoutGrid },
    ];

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav
            className={`floating-nav ${isScrolled ? 'floating-nav-scrolled' : ''} 
            ${isMobileMenuOpen ? 'rounded-b-none' : ''}`}
        >
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-2 md:space-x-3 group relative px-1">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-neon via-primary to-primary-pink rounded-xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-7 md:w-12 h-7 md:h-12 rounded-lg md:rounded-xl bg-white dark:bg-black border border-white/50 dark:border-white/10 flex items-center justify-center text-primary-neon shadow-2xl group-hover:scale-110 transition-all duration-300">
                                <Rocket size={16} className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base md:text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase leading-none">
                                CollEdge<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-neon">Connect</span>
                            </span>
                            <span className="text-[8px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-[0.2em] uppercase">Enterprise</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center bg-gray-100/50 dark:bg-white/5 rounded-2xl px-2 py-1.5 border border-white/20 dark:border-white/5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${location.pathname === link.path
                                    ? 'bg-white dark:bg-white/10 text-primary dark:text-primary-neon shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white'
                                    }`}
                            >
                                <link.icon size={16} />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Action Area */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link
                            to="/admin"
                            className="relative group overflow-hidden"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-neon rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                            <button className="relative px-6 py-2.5 bg-primary dark:bg-primary-neon text-white dark:text-black font-bold rounded-xl flex items-center space-x-2 text-sm transition-transform active:scale-95">
                                <Shield size={18} />
                                <span>Admin Panel</span>
                                <Zap size={14} className="animate-pulse" />
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex lg:hidden items-center space-x-2 pr-1">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 overflow-hidden group border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                        >
                            <div className="flex flex-col space-y-1">
                                <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                                <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`lg:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100 border-t border-white/10' : 'max-h-0 opacity-0 pointer-events-none'
                }`}>
                <div className="bg-white/90 dark:bg-black/80 backdrop-blur-3xl px-4 py-8 space-y-6 rounded-b-3xl shadow-2xl">
                    <div className="grid grid-cols-1 gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-4 p-4 rounded-2xl transition-all ${location.pathname === link.path
                                    ? 'bg-primary/10 dark:bg-primary-neon/10 text-primary dark:text-primary-neon border border-primary/20'
                                    : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${location.pathname === link.path ? 'bg-primary dark:bg-primary-neon text-white dark:text-black' : 'bg-gray-200 dark:bg-white/10'}`}>
                                    <link.icon size={20} />
                                </div>
                                <span className="text-lg font-bold">{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="pt-4 space-y-4">
                        <Link
                            to="/admin"
                            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-accent text-white font-black text-lg shadow-lg shadow-primary/30"
                        >
                            <Shield size={20} />
                            <span>ACCESS ADMIN PANEL</span>
                        </Link>

                        <div className="flex justify-center items-center space-x-8 pt-4">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 mb-1">
                                    <Info size={18} />
                                </div>
                                <span className="text-xs text-gray-400">Help</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 mb-1">
                                    <Phone size={18} />
                                </div>
                                <span className="text-xs text-gray-400">Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
