import React, { useState, useEffect } from 'react';
import type { AnalysisData } from '../../types';
import { BarChart2Icon, ZapIcon, DownloadIcon, RefreshCwIcon } from '../icons/Icons';

interface VisualizePageProps {
    initialData: AnalysisData | null;
}

const VisualizePage: React.FC<VisualizePageProps> = ({ initialData }) => {
    const [data, setData] = useState<AnalysisData | null>(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const hasData = !!data;
    const safetyFactor = hasData && data.visualData.stress.max > 0 ? (400 / data.visualData.stress.max).toFixed(1) : '--';
    const deformAllowed = hasData ? (data.visualData.deformation.max * 1.2).toFixed(2) : '--';
    const optSpace = hasData ? (100 - data.visualData.utilization).toFixed(1) : '--';
    const suggestion = hasData ? (data.visualData.utilization > 90 ? '利用率良好' : '可进一步优化') : '暂无数据';

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-violet-200 mb-2">结果可视化</h2>
            <p className="text-gray-400 mb-8">以图表形式展示分析结果，直观理解设计性能</p>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <ChartContainer title="应力分布分析" icon={<BarChart2Icon />}>
                    {hasData ? (
                        <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                            <BarChart2Icon className="w-12 h-12 text-violet-400 mb-3" />
                            <p>正在渲染应力云图...</p>
                            <p className="text-xs mt-2">最大应力位置: {data?.visualData.stress.location}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">暂无数据，请先进行分析</p>
                    )}
                </ChartContainer>
                <ChartContainer title="变形分析" icon={<ZapIcon />}>
                     {hasData ? (
                        <div className="text-gray-400 flex flex-col items-center justify-center h-full">
                            <ZapIcon className="w-12 h-12 text-blue-400 mb-3" />
                            <p>正在渲染变形曲线...</p>
                            <p className="text-xs mt-2">最大变形位置: {data?.visualData.deformation.location}</p>
                        </div>
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
                        <DataItem label="建议" value={suggestion} />
                    </DataBox>
                </div>
            </Section>
            
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
        <div className="h-64 bg-slate-900/50 border-2 border-dashed border-violet-500/20 rounded-lg flex items-center justify-center">
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