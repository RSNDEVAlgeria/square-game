/**
 * Square Coffee - Games Menu Scene
 * Main landing page with all available games
 */

import { motion } from 'framer-motion';
import { Utensils, Grid3X3, Swords, Star, ChevronRight, Heart, Crown, Languages, ExternalLink, Download, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function GamesMenu() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Set initial direction based on language
    useEffect(() => {
        document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = currentLang;
    }, [currentLang]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            alert('To install: Open this page in Chrome/Edge, tap the menu icon and select "Install App" or "Add to Home Screen"');
        }
    };

    // Language switcher handler
    const handleLanguageSwitch = () => {
        const languages = ['en', 'fr', 'ar'];
        const currentIndex = languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLang = languages[nextIndex];

        i18n.changeLanguage(nextLang);

        // Update document direction for RTL support
        document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = nextLang;
    };

    const menuItems = [
        {
            id: 'cooking',
            path: '/maingame',
            title: t('gamesMenu.games.cooking.title'),
            desc: t('gamesMenu.games.cooking.desc'),
            icon: <Utensils size={32} />,
            color: 'linear-gradient(135deg, #1B4D3E, #2E8B57)',
            badge: t('gamesMenu.games.cooking.badge')
        },
        {
            id: 'sip-or-spill',
            path: '/siporspill',
            title: t('gamesMenu.games.sipOrSpill.title'),
            desc: t('gamesMenu.games.sipOrSpill.desc'),
            icon: <Heart size={32} />,
            color: 'linear-gradient(135deg, #D4698B, #E85D75)',
            badge: t('gamesMenu.games.sipOrSpill.badge')
        },
        {
            id: 'sudoku',
            path: '/sudoku',
            title: t('gamesMenu.games.sudoku.title'),
            desc: t('gamesMenu.games.sudoku.desc'),
            icon: <Grid3X3 size={32} />,
            color: 'linear-gradient(135deg, #4B3621, #6F4E37)',
            badge: t('gamesMenu.games.sudoku.badge')
        },
        {
            id: 'xo',
            path: '/xo',
            title: t('gamesMenu.games.xo.title'),
            desc: t('gamesMenu.games.xo.desc'),
            icon: <Swords size={32} />,
            color: 'linear-gradient(135deg, #C19A6B, #8B5A2B)',
            badge: t('gamesMenu.games.xo.badge')
        },
        {
            id: 'chess',
            path: '/chess',
            title: t('gamesMenu.games.chess.title'),
            desc: t('gamesMenu.games.chess.desc'),
            icon: <Crown size={32} />,
            color: 'linear-gradient(135deg, #2C1810, #4B3621)',
            badge: t('gamesMenu.games.chess.badge')
        }
    ];

    return (
        <div className="menu-container w-full h-full flex flex-col items-center p-6 relative" style={{
            background: 'radial-gradient(circle at top left, #FAF9F6, #F5F5DC)'
        }}>
            {/* Decorative Elements */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[5%] left-[10%] text-4xl opacity-10 z-0"
            >☕</motion.div>
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[15%] right-[10%] text-4xl opacity-10 z-0"
            >🌿</motion.div>

            {/* RSN-dev Watermark */}
            <a
                href="https://rsndev.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 left-4 z-50 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity no-underline group"
            >
                <img
                    src="/rsn-logo.png"
                    alt="RSN DEV"
                    className="w-10 h-10 object-contain drop-shadow-sm"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.querySelector('.fallback-logo')!.classList.remove('hidden');
                    }}
                />
                <div className="fallback-logo hidden w-10 h-10 bg-[#1B4D3E] rounded-full flex items-center justify-center text-amber-100 font-bold text-xs ring-2 ring-amber-100/50">
                    RSN
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#1B4D3E] uppercase tracking-wider leading-tight">{t('gamesMenu.madeBy')}</span>
                    <span className="text-xs font-black text-[#1B4D3E] group-hover:text-[#2E8B57] transition-colors leading-tight">RSN-dev</span>
                </div>
            </a>

            {/* Menu Button */}
            <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all border-2 border-[#1B4D3E]/20"
                title="Menu"
            >
                {menuOpen ? <X size={20} className="text-[#1B4D3E]" /> : <Menu size={20} className="text-[#1B4D3E]" />}
            </motion.button>

            {/* Dropdown Menu */}
            {menuOpen && (
                <div
                    className="absolute top-16 right-4 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#D2B48C]/20 overflow-hidden min-w-[200px]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Install Button - always visible now */}
                    <button
                        onClick={() => { handleInstall(); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1B4D3E]/5 transition-colors text-[#1B4D3E]"
                    >
                        <Download size={18} />
                        <span className="font-medium">Install App</span>
                    </button>

                    {/* Language Switcher */}
                    <button
                        onClick={() => { handleLanguageSwitch(); setMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1B4D3E]/5 transition-colors text-[#1B4D3E]"
                    >
                        <Languages size={18} />
                        <span className="font-medium">Language</span>
                        <span className="ml-auto text-sm opacity-60">{currentLang.toUpperCase()}</span>
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-[#D2B48C]/20" />

                    {/* Visit Square Coffee */}
                    <a
                        href="https://squarecoffee.shop"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1B4D3E]/5 transition-colors text-[#1B4D3E]"
                    >
                        <ExternalLink size={18} />
                        <span className="font-medium">Visit Square Coffee</span>
                    </a>
                </div>
            )}

            <header className="text-center mt-12 mb-10 z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg p-3"
                >
                    <img src="/logo.png" alt="Coffee Logo" className="w-full h-full object-contain" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl m-0 leading-none text-[#1B4D3E]"
                    style={{
                        fontFamily: "'Pacifico', cursive",
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    {t('gamesMenu.title')}
                </motion.h1>
                <div className="inline-flex items-center gap-1.5 bg-[#1B4D3E] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mt-4">
                    <Star size={14} fill="currentColor" />
                    <span>{t('gamesMenu.subtitle')}</span>
                </div>
            </header>

            {/* Scrollable Games Container */}
            <div className="w-full max-w-4xl flex-1 relative z-10 overflow-hidden">
                {/* Scroll Indicator - Top */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#FAF9F6] to-transparent pointer-events-none z-20 opacity-60" />

                {/* Scrollable Games List */}
                <div
                    className="w-full h-full overflow-y-auto overflow-x-hidden px-1 py-2 scroll-smooth"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#D2B48C #F5F5DC',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    <div className="flex flex-col gap-4 pb-4">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.15 }}
                                whileHover={{ scale: 1.03, x: 5 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-md cursor-pointer border border-[#D2B48C]/20 relative hover:shadow-xl transition-shadow"
                                onClick={() => navigate(item.path)}
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                                    style={{ background: item.color }}
                                >
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-[0.65rem] font-extrabold text-[#4B3621] uppercase">
                                            {item.badge}
                                        </span>
                                        <h3 className="m-0 text-[#2C1810] text-xl font-bold">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="mt-1 mb-0 text-[#8B735B] text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                                <ChevronRight className="text-[#D2B48C] opacity-50" size={20} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none z-20 opacity-60" />
            </div>

            <footer className="mt-auto w-full text-center pb-8 pt-4">
                <div className="w-10 h-0.5 bg-[#D2B48C] mx-auto mb-4 rounded-full opacity-30" />
                <p
                    className="text-sm text-[#4B3621] m-0"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                >
                    {t('gamesMenu.footer')}
                </p>
            </footer>
        </div>
    );
}
