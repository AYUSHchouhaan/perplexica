"use client";

import { CgProfile } from "react-icons/cg";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import ThemeButton from "@/components/ThemeButton";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AppFont } from "@/types";
import { useFont } from "@/components/FontProvider";
import { useMessageCount } from "@/components/MessageCountProvider";

// Shortcut UI removed per request

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { data: session } = useSession();
    const { font: selectedFont, setFont: setSelectedFont } = useFont();
    const { messageCount } = useMessageCount();
    const [hue, setHue] = useState(280);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    useEffect(() => {
        setMounted(true);
        
        const savedHue = localStorage.getItem('perplex-hue');
        const savedContrast = localStorage.getItem('perplex-contrast');
        const savedSaturation = localStorage.getItem('perplex-saturation');
        
        if (savedHue) setHue(parseInt(savedHue));
        if (savedContrast) setContrast(parseInt(savedContrast));
        if (savedSaturation) setSaturation(parseInt(savedSaturation));
        
        if (savedHue) document.documentElement.style.setProperty('--hue-rotation', `${savedHue}deg`);
        if (savedContrast) document.documentElement.style.setProperty('--contrast-value', `${savedContrast}%`);
        if (savedSaturation) document.documentElement.style.setProperty('--saturation-value', `${savedSaturation}%`);
    }, []);


    if (!mounted) {
        return null;
    }
    
    const handleHueChange = (value: number[]) => {
        const newHue = value[0];
        setHue(newHue);
        document.documentElement.style.setProperty('--hue-rotation', `${newHue}deg`);
        localStorage.setItem('perplex-hue', newHue.toString());
    };
    
    const handleContrastChange = (value: number[]) => {
        const newContrast = value[0];
        setContrast(newContrast);
        document.documentElement.style.setProperty('--contrast-value', `${newContrast}%`);
        localStorage.setItem('perplex-contrast', newContrast.toString());
    };
    
    const handleSaturationChange = (value: number[]) => {
        const newSaturation = value[0];
        setSaturation(newSaturation);
        document.documentElement.style.setProperty('--saturation-value', `${newSaturation}%`);
        localStorage.setItem('perplex-saturation', newSaturation.toString());
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFont = e.target.value as AppFont;
        setSelectedFont(newFont);
    };

    return ( 
    <div 
        className="overflow-y-auto h-screen"
        style={{
            background: theme === 'dark'
                ? 'linear-gradient(to bottom, #1E141A, #0E040A)'
                : 'linear-gradient(to bottom, #FFECFF, #EFDCF5)'
        }}
    >
        <div className="flex justify-between gap-2 w-full px-24 py-6">
            <Link href="/" className="flex gap-2 items-center hover:bg-pink-500/20 cursor-pointer rounded-md py-2 px-4 transition-all duration-300">
                <ArrowLeft size={15} />
                <button className="font-semibold text-sm">Back </button>
            </Link>
            <div className="flex gap-2 items-center">
                <ThemeButton theme={theme || 'system'} onToggleTheme={toggleTheme} />
                <button 
                  onClick={() => signOut({ callbackUrl: '/auth' })}
                  className="font-semibold text-sm hover:bg-pink-500/20 cursor-pointer rounded-md py-2 px-4 transition-all duration-300"
                >
                  Sign Out
                </button>
            </div>
        </div>

        <div className="flex w-full">
            <aside className={`w-[30%] max-md:invisible max-md:w-[0%] h-full overflow-y-auto`}>
                <div className="flex flex-col justify-center items-center gap-2 pt-8">
                    <CgProfile size={200} />
                    <p className="text-2xl font-bold">{session?.user?.username}</p>
                    <p className="text-lg">{session?.user?.email}</p>
                    <p className="text-xs font-bold p-2 bg-pink-500/20 rounded-full">Free Tier</p>
                    
                    {session && (
                      <div className={`mt-4 p-4 rounded-lg text-center w-full max-w-xs ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
                      }`}>
                        <p className={`text-sm mb-2 ${
                          theme === 'dark' ? 'text-white/70' : 'text-black/70'
                        }`}>
                          Messages Remaining
                        </p>
                        <p className={`text-4xl font-bold ${
                          messageCount <= 5
                            ? 'text-red-500'
                            : theme === 'dark'
                            ? 'text-[#f2c0d7]'
                            : 'text-[#ba4077]'
                        }`}>
                          {messageCount}
                        </p>
                        <p className={`text-xs mt-2 ${
                          theme === 'dark' ? 'text-white/50' : 'text-black/50'
                        }`}>
                          out of 50
                        </p>
                        {messageCount <= 5 && (
                          <button
                            onClick={() => window.location.href = '/upgrade'}
                            className={`mt-3 w-full py-2 rounded-lg font-semibold transition-all ${
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-[#5e183d] to-[#401020] hover:from-[#8e486d] hover:to-[#6e284d] text-[#f2c0d7]'
                                : 'bg-[#aa3067] hover:bg-[#ea70a7] text-white'
                            }`}
                          >
                            Upgrade for More
                          </button>
                        )}
                      </div>
                    )}
                    {/* Keyboard shortcuts removed */}
                </div>
            </aside>

            <main className={`w-[70%] h-full overflow-y-auto px-8 max-md:w-[100%]`}>
                <h2 className="!text-2xl !font-bold my-4">Visual Options</h2>
                <div className="mb-24">
                    <div className="mb-6">
                        <p className="font-semibold mb-2">Color Hue</p>
                        <p className="opacity-50 mb-2">Adjust the hue rotation of the app&apos;s colors.</p>
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={hue}
                                    onChange={(e) => handleHueChange([parseInt(e.target.value)])}
                                    className={`w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-200'}`}
                                />
                            </div>
                            <span className="min-w-[40px] text-center">{hue}°</span>
                        </div>
                        <div className={`mt-2 p-3 rounded-md ${theme === 'dark' ? 'bg-black/30' : 'bg-white/70'} border border-pink-500/20`}>
                            <div className="w-full h-6 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-md"
                                 style={{ filter: `hue-rotate(${hue}deg)` }}></div>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <p className="font-semibold mb-2">Contrast</p>
                        <p className="opacity-50 mb-2">Adjust the contrast of the app&apos;s interface.</p>
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <input
                                    type="range"
                                    min="50"
                                    max="150"
                                    value={contrast}
                                    onChange={(e) => handleContrastChange([parseInt(e.target.value)])}
                                    className={`w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-200'}`}
                                />
                            </div>
                            <span className="min-w-[40px] text-center">{contrast}%</span>
                        </div>
                        <div className={`mt-2 p-3 rounded-md ${theme === 'dark' ? 'bg-black/30' : 'bg-white/70'} border border-pink-500/20`}>
                            <div className="flex justify-between">
                                <div className="w-1/3 h-6 bg-pink-500 rounded-md"
                                     style={{ filter: `contrast(${contrast}%)` }}></div>
                                <div className="w-1/3 h-6 bg-purple-500 rounded-md"
                                     style={{ filter: `contrast(${contrast}%)` }}></div>
                                <div className="w-1/3 h-6 bg-blue-500 rounded-md"
                                     style={{ filter: `contrast(${contrast}%)` }}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <p className="font-semibold mb-2">Saturation</p>
                        <p className="opacity-50 mb-2">Adjust the color saturation of the app.</p>
                        <div className="flex items-center gap-4">
                            <div className="w-full">
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={saturation}
                                    onChange={(e) => handleSaturationChange([parseInt(e.target.value)])}
                                    className={`w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer ${theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-200'}`}
                                />
                            </div>
                            <span className="min-w-[40px] text-center">{saturation}%</span>
                        </div>
                        <div className={`mt-2 p-3 rounded-md ${theme === 'dark' ? 'bg-black/30' : 'bg-white/70'} border border-pink-500/20`}>
                            <div className="w-full h-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-md"
                                 style={{ filter: `saturate(${saturation}%)` }}></div>
                        </div>
                    </div>
                    <p className="font-semibold">Main Text Font</p>
                    <p className="opacity-50">Used in general text throughout the app.</p>
                    <select 
                        className={`border my-2 border-pink-500/20 w-full p-2 rounded-md bg-pink-500/5 ${theme === 'dark' ? '!placeholder-neutral-100' : '!placeholder-pink-800'}`}
                        value={selectedFont}
                        onChange={handleFontChange}
                    >
                        <option value="proxima-nova">Proxima Nova (Default)</option>
                        <option value="inter">Inter</option>
                        <option value="comic-sans">Comic Sans MS</option>
                    </select>
                    
                </div>
            </main>
        </div>
    </div> );
}
 
export default SettingsPage;