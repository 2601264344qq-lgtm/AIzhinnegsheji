import React, { useState, useEffect } from 'react';
import type { AnalysisData } from '../../types';
import { BarChart2Icon, ZapIcon, DownloadIcon, RefreshCwIcon } from '../icons/Icons';

interface VisualizePageProps {
    initialData: AnalysisData | null;
}

// Mock Stress Chart Component (Heatmap style)
const MockStressChart: React.FC<{ stress: { max: number; location: string } }> = ({ stress }) => {
    const getColor = (value: number) => {
        if (value > 0.85) return 'bg-red-500/80';
        if (value > 0.65) return 'bg-orange-500/80';
        if (value > 0.45) return 'bg-yellow-400/80';
        if (value > 0.25) return 'bg-green-500/80';
        return 'bg-blue-600/80';
    };
    const grid = Array.from({ length: 120 }, () => Math.random());
    return (
        <div className="relative w-full h-full p-4 flex items-center justify-center">
            <div className="grid grid-cols-12 gap-1 w-full h-full">
                {grid.map((value, i) => <div key={i} className={`rounded-sm ${getColor(value)}`}></div>)}
            </div>
            <div className="absolute bottom-2 right-2 bg-slate-900/80 p-2 rounded-md text-xs border border-violet-500/30">
                <p>最大应力: <span className="font-bold text-red-400">{stress.max.toFixed(1)} MPa</span></p>
                <p>位置: {stress.location}</p>
            </div>
        </div>
    );
};

// Mock Deformation Chart Component (Line chart style)
const MockDeformationChart: React.FC<{ deformation: { max: number; location: string } }> = ({ deformation }) => (
    <div className="relative w-full h-full flex items-center justify-center p-4">
        <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M 0 45 Q 25 10, 50 30 T 100 20" stroke="#60a5fa" fill="transparent" strokeWidth="2" />
            <path d="M 0 45 Q 25 10, 50 30 T 100 20" fill="url(#deformGradient)" stroke="none" />
            <defs>
                <linearGradient id="deformGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
        <div className="absolute bottom-2 right-2 bg-slate-900/80 p-2 rounded-md text-xs border border-violet-500/30">
            <p>最大变形: <span className="font-bold text-blue-300">{deformation.max.toFixed(2)} mm</span></p>
            <p>位置: {deformation.location}</p>
        </div>
    </div>
);

// AI Suggestion Component
const AiSuggestion: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-start gap-3 bg-slate-800/50 p-4 rounded-lg border border-violet-500/20">
        <span className="text-lg mt-0.5">💡</span>
        <p className="text-sm text-gray-300 leading-relaxed">{children}</p>
    </div>
);


const VisualizePage: React.FC<VisualizePageProps> = ({ initialData }) => {
    const [data, setData] = useState<AnalysisData | null>(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const hasData = !!data;
    const safetyFactor = hasData && data.visualData.stress.max > 0 ? (400 / data.visualData.stress.max).toFixed(1) : '--';
    const deformAllowed = hasData ? (data.visualData.deformation.max * 1.2).toFixed(2) : '--';
    const optSpace = hasData ? (100 - data.visualData.utilization).toFixed(1) : '--';

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-violet-200 mb-2">结果可视化</h2>
            <p className="text-gray-400 mb-8">以图表形式展示分析结果，直观理解设计性能</p>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer title="应力分布分析" icon={<BarChart2Icon />}>
                    {hasData ? (
                        <MockStressChart stress={data.visualData.stress} />
                    ) : (
                        <p className="text-gray-500">暂无数据，请先进行分析</p>
                    )}
                </ChartContainer>
                <ChartContainer title="变形分析" icon={<ZapIcon />}>
                     {hasData ? (
                         <MockDeformationChart deformation={data.visualData.deformation} />
                    ) : (
                        <p className="text-gray-500">暂无数据，请先进行分析</p>
                    )}
                </ChartContainer>
            </div>

            <Section title="数据统计">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DataBox title="最大应力">
                        <DataItem label="数值" value={`${data?.visualData.stress.max?.toFixed(2) ?? '--'} MPa`} />
                        <DataItem label="位置" value={data?.visualData.stress.location ?? '--'} />
                        <DataItem label="安全系数" value={safetyFactor} />
                    </DataBox>
                    <DataBox title="最大变形">
                        <DataItem label="数值" value={`${data?.visualData.deformation.max?.toFixed(2) ?? '--'} mm`} />
                        <DataItem label="位置" value={data?.visualData.deformation.location ?? '--'} />
                        <DataItem label="允许值" value={`${deformAllowed} mm`} />
                    </DataBox>
                    <DataBox title="材料利用率">
                        <DataItem label="利用率" value={`${data?.visualData.utilization?.toFixed(1) ?? '--'}%`} />
                        <DataItem label="优化空间" value={`${optSpace}%`} />
                        <DataItem label="状态" value={hasData ? (data.visualData.utilization > 90 ? '✅ 良好' : '⚠️ 可优化') : '--'} />
                    </DataBox>
                </div>
            </Section>

             <div className="mt-6">
                <Section title="AI 智能建议">
                    <div className="space-y-4">
                        {hasData ? (
                            <>
                                {data.visualData.stress.max > 300 && (
                                    <AiSuggestion>
                                        最大应力值为 <strong className="text-orange-400">{data.visualData.stress.max.toFixed(1)} MPa</strong>，已接近部分常用材料的屈服极限。建议您仔细校核所选材料的安全系数，或考虑使用更高强度的材料以确保设计的长期可靠性。
                                    </AiSuggestion>
                                )}
                                {data.visualData.deformation.max > 0.5 && (
                                     <AiSuggestion>
                                        最大变形量为 <strong className="text-blue-300">{data.visualData.deformation.max.toFixed(2)} mm</strong>，数值相对显著。请务必校核此变形是否会影响零件的装配关系、运动精度或与其他部件产生干涉。
                                    </AiSuggestion>
                                )}
                                {data.visualData.utilization < 75 && (
                                    <AiSuggestion>
                                        材料利用率为 <strong className="text-green-400">{data.visualData.utilization.toFixed(1)}%</strong>，表明当前设计存在较大的优化空间。建议您考虑对非关键受力区域进行结构优化或材料移除，以实现轻量化并降低成本。
                                    </AiSuggestion>
                                )}
                                 {data.visualData.utilization >= 75 && data.visualData.stress.max <= 300 && (
                                    <AiSuggestion>
                                        整体设计表现良好。当前材料利用率和应力水平均在合理范围内，方案具备较好的技术可行性。可按当前方案进入下一设计阶段。
                                    </AiSuggestion>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">暂无建议，请先进行分析以获取智能反馈。</p>
                        )}
                    </div>
                </Section>
            </div>
            
            <div className="flex gap-4 pt-8">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50" disabled={!hasData}>
                    <DownloadIcon className="w-5 h-5" />
                    导出数据
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors disabled:opacity-50" disabled={!hasData}>
                    <RefreshCwIcon className="w-5 h-5" />
                    刷新图表
                </button>
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-900/60 backdrop-blur-lg p-7 rounded-2xl border border-violet-500/30">
        <h3 className="text-xl font-semibold mb-6 text-violet-200">{title}</h3>
        {children}
    </div>
);

const ChartContainer: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
     <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30">
        <h3 className="text-lg font-semibold mb-4 text-violet-200 flex items-center gap-2">
            {icon} {title}
        </h3>
        <div className="h-64 bg-slate-900/50 border-2 border-dashed border-violet-500/20 rounded-lg flex items-center justify-center overflow-hidden">
            {children}
        </div>
    </div>
);

const DataBox: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-800/50 p-5 rounded-lg border border-violet-500/20">
        <h4 className="font-semibold text-violet-300 mb-3">{title}</h4>
        <div className="space-y-2">{children}</div>
    </div>
);

const DataItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium text-violet-300">{value}</span>
    </div>
);

export default VisualizePage;