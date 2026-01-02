import React from 'react';
import ContactForm from '../components/ContactForm';
import { Sparkles, MessageCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center pt-32 pb-12 overflow-hidden">

            {/* Ambient Bacgkround Blobs - Hidden in Light Mode */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 hidden dark:block">
                <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-900/10 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-900/10 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40rem] h-[40rem] bg-pink-900/10 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* Left Text Content */}
                <div className="text-center lg:text-left space-y-8 animate-slide-up">
                    <div className="inline-flex items-center px-4 py-2 rounded-full glass border-primary/20 text-primary dark:text-primary-neon text-sm font-semibold mb-2">
                        <Sparkles size={16} className="mr-2" />
                        Redefining Connections
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                        Stay Connected <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-accent to-pink-500 dark:from-primary-neon dark:to-purple-500">
                            In Style.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                        Experience a contact management system that's as beautiful as it is functional. Minimalist design, maximal power.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <button className="btn-primary w-full sm:w-auto flex items-center justify-center">
                            Get Started
                        </button>
                        <button className="px-8 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition-all w-full sm:w-auto">
                            Learn More
                        </button>
                    </div>

                    <div className="pt-8 flex items-center justify-center lg:justify-start space-x-8 text-gray-400">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-black bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs overflow-hidden`}>
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-black bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400">
                                +2k
                            </div>
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-gray-800 dark:text-white">Trusted by teams</p>
                            <p>Worldwide</p>
                        </div>
                    </div>
                </div>

                {/* Right Form Content */}
                <div className="w-full lg:max-w-lg mx-auto animate-fade-in delay-200">
                    <ContactForm />
                </div>

            </div>
        </div>
    );
};

export default Home;
