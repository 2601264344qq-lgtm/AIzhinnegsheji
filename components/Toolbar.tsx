import React from 'react';
import { MenuIcon, Trash2Icon } from './icons/Icons';

interface ToolbarProps {
    onToggleSidebar: () => void;
    onClearChat: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onToggleSidebar, onClearChat }) => {
    return (
        <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-violet-500/30 px-5 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-md text-gray-400 hover:bg-violet-500/20 hover:text-violet-200 transition-colors"
                >
                    <MenuIcon className="w-5 h-5" />
                </button>
                <select className="px-4 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-200 rounded-lg text-sm cursor-pointer hover:bg-violet-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500">
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                </select>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 rounded-full text-xs text-violet-300">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                    </span>
                    <span>在线</span>
                </div>
            </div>
            <div className="hidden md:flex">
                <button onClick={onClearChat} className="flex items-center gap-2 px-4 py-2 bg-transparent border border-violet-500/30 text-gray-400 rounded-lg text-sm hover:bg-violet-500/20 hover:text-violet-200 transition-colors">
                    <Trash2Icon className="w-4 h-4" />
                    清除对话
                </button>
            </div>
        </header>
    );
};

export default Toolbar;