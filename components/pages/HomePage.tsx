import React from 'react';
import type { Page } from '../../types';
import { MessageSquareIcon, CalculatorIcon } from '../icons/Icons';

interface HomePageProps {
    onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; description: string; onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <div className="bg-slate-900/60 backdrop-blur-lg p-7 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-500/20 cursor-pointer" onClick={onClick}>
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-3 text-violet-200">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="max-w-5xl mx-auto p-8 lg:p-12 animate-fadeIn">
            <header className="text-center mb-16 animate-[fadeInUp_0.8s_ease-out]">
                <div className="inline-block px-4 py-2 bg-violet-500/20 rounded-full mb-5">
                    <span className="text-sm font-semibold text-violet-300">🤖 Gemini AI 驱动</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-violet-200 to-violet-400 mb-4">
                    AI智能设计助手
                </h1>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    为机械设计师打造的智能工作平台<br />集成对话交流、工程计算、参数优化、可视化分析和报告生成功能
                </p>
                <div className="mt-8 flex gap-4 justify-center">
                    <button onClick={() => onNavigate('chat')} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">
                        <MessageSquareIcon className="w-5 h-5" />
                        开始对话
                    </button>
                    <button onClick={() => onNavigate('calculator')} className="flex items-center gap-2 px-6 py-3 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors">
                        <CalculatorIcon className="w-5 h-5" />
                        工程计算器
                    </button>
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeInUp_0.8s_ease-out_0.2s_backwards]">
                <FeatureCard icon="💬" title="智能对话" description="与小顾助手进行自然语言交流，支持文件上传分析，获取专业的机械设计建议、技术解答和设计方案优化" onClick={() => onNavigate('chat')} />
                <FeatureCard icon="🔧" title="工程计算" description="涵盖梁、轴、齿轮、螺栓、弹簧等10+种专业计算工具，快速完成工程设计计算和校核" onClick={() => onNavigate('calculator')} />
                <FeatureCard icon="⚙️" title="参数优化" description="基于AI算法对设计参数进行智能优化，提升设计性能和效率，减重降本增效" onClick={() => onNavigate('optimize')} />
                <FeatureCard icon="📊" title="结果可视化" description="将分析结果以图表、云图等形式直观展示，便于理解和决策，支持数据导出" onClick={() => onNavigate('visualize')} />
                <FeatureCard icon="📄" title="报告生成" description="一键生成专业的设计分析报告，包含完整的设计数据和优化建议，支持多种格式" onClick={() => onNavigate('report')} />
                <FeatureCard icon="🎯" title="精准分析" description="运用AI技术对设计方案进行全方位分析，提供可靠的技术支持和决策依据" onClick={() => onNavigate('chat')} />
            </div>
        </div>
    );
};

export default HomePage;