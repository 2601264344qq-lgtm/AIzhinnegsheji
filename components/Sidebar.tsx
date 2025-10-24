import React from 'react';
import type { Page, NavItem } from '../types';
import { HomeIcon, MessageSquareIcon, CalculatorIcon, ZapIcon, BarChart2Icon, FileTextIcon, UserIcon, ShieldIcon } from './icons/Icons';

interface SidebarProps {
    activePage: Page;
    onNavigate: (page: Page) => void;
    isOpen: boolean;
}

const navItems: NavItem[] = [
    { id: 'home', label: '首页', icon: <HomeIcon /> },
    { id: 'chat', label: '与小顾对话', icon: <MessageSquareIcon /> },
    { id: 'calculator', label: '工程计算器', icon: <CalculatorIcon /> },
    { id: 'optimize', label: '参数分析与优化', icon: <ZapIcon /> },
    { id: 'visualize', label: '结果可视化', icon: <BarChart2Icon /> },
    { id: 'report', label: '报告生成', icon: <FileTextIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen }) => {
    return (
        <aside className={`flex flex-col bg-slate-900/70 backdrop-blur-lg border-r border-violet-500/30 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            <div className="p-4 border-b border-violet-500/30">
                <div className="flex items-center gap-2 text-lg font-semibold text-violet-300">
                    <ShieldIcon className="w-6 h-6" />
                    <span>小顾助手</span>
                </div>
            </div>

            <nav className="flex-1 p-2 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm rounded-lg transition-colors duration-200 ${
                            activePage === item.id
                                ? 'bg-violet-500/30 text-violet-300 font-medium'
                                : 'text-gray-400 hover:bg-violet-500/20 hover:text-violet-200'
                        }`}
                    >
                        <span className="w-5 h-5">{item.icon}</span>
                        <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-3 border-t border-violet-500/30">
                <div className="flex items-center gap-3 p-3 text-sm text-gray-400">
                    <UserIcon className="w-5 h-5" />
                    <span className="whitespace-nowrap">设计助手用户</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;