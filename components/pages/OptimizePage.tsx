import React, { useState, useEffect } from 'react';
import type { AnalysisData } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface OptimizePageProps {
    initialData: AnalysisData | null;
}

const OptimizePage: React.FC<OptimizePageProps> = ({ initialData }) => {
    const [params, setParams] = useState({
        partType: '齿轮',
        materialType: '45钢',
        outerDia: '50',
        innerDia: '20',
        length: '100',
        optimizeTarget: '最小化重量',
        algorithm: '遗传算法',
        iterations: '100',
    });
    const [optimizationResults, setOptimizationResults] = useState<{ weightReduction: string; strengthIncrease: string; costReduction: string; } | null>(null);
    const [isLoadingOptimize, setIsLoadingOptimize] = useState(false);

    useEffect(() => {
        if (initialData?.params) {
            setParams(prev => ({
                ...prev,
                partType: initialData.params.partType,
                materialType: initialData.params.materialType,
                outerDia: String(initialData.params.outerDia),
                innerDia: String(initialData.params.innerDia),
                length: String(initialData.params.length),
            }));
        }
    }, [initialData]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleStartOptimization = () => {
        setIsLoadingOptimize(true);
        setOptimizationResults(null); // Clear previous results

        setTimeout(() => {
            // Simulate optimization results
            setOptimizationResults({
                weightReduction: '15%',
                strengthIncrease: '20%',
                costReduction: '10%',
            });
            setIsLoadingOptimize(false);
        }, 2000); // Simulate 2 seconds of optimization
    };

    const handleResetParams = () => {
        setParams({
            partType: '齿轮',
            materialType: '45钢',
            outerDia: '50',
            innerDia: '20',
            length: '100',
            optimizeTarget: '最小化重量',
            algorithm: '遗传算法',
            iterations: '100',
        });
        setOptimizationResults(null); // Clear results on reset
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-violet-200 mb-2">参数优化</h2>
            <p className="text-gray-400 mb-8">AI智能优化设计参数，提升设计性能和效率</p>

            <div className="space-y-6">
                <Section title="基本参数设置">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputGroup label="零件类型" name="partType" value={params.partType} onChange={handleChange} as="select">
                           <option>齿轮</option>
                           <option>轴</option>
                           <option>轴承</option>
                           <option>螺栓</option>
                           <option>螺母</option>
                           <option>弹簧</option>
                           <option>联轴器</option>
                           <option>键</option>
                           <option>销</option>
                           <option>铆钉</option>
                           <option>垫圈</option>
                           <option>支架</option>
                           <option>箱体</option>
                           <option>法兰</option>
                           <option>活塞</option>
                           <option>连杆</option>
                           <option>曲轴</option>
                           <option>凸轮</option>
                           <option>涡轮叶片</option>
                           <option>密封件</option>
                           <option>其他</option>
                        </InputGroup>
                         <InputGroup label="材料类型" name="materialType" value={params.materialType} onChange={handleChange} as="select">
                            <optgroup label="碳素结构钢">
                               <option>Q195</option>
                               <option>Q215</option>
                               <option>Q235</option>
                               <option>Q275</option>
                            </optgroup>
                            <optgroup label="优质碳素结构钢">
                               <option>20号钢</option>
                               <option>35号钢</option>
                               <option>45钢</option>
                            </optgroup>
                            <optgroup label="合金结构钢">
                               <option>20Cr</option>
                               <option>40Cr</option>
                               <option>20CrMnTi</option>
                               <option>42CrMo</option>
                            </optgroup>
                            <optgroup label="弹簧钢">
                               <option>65Mn</option>
                               <option>60Si2Mn</option>
                            </optgroup>
                            <optgroup label="轴承钢">
                               <option>GCr15</option>
                            </optgroup>
                            <optgroup label="不锈钢">
                               <option>304 (06Cr19Ni10)</option>
                               <option>316 (06Cr17Ni12Mo2)</option>
                            </optgroup>
                             <optgroup label="铸铁">
                               <option>HT200 (灰口铸铁)</option>
                               <option>HT250 (灰口铸铁)</option>
                               <option>QT400-18 (球墨铸铁)</option>
                               <option>QT500-7 (球墨铸铁)</option>
                            </optgroup>
                            <optgroup label="铸钢">
                                <option>ZG230-450</option>
                                <option>ZG270-500</option>
                            </optgroup>
                             <optgroup label="工具钢">
                                <option>T8A</option>
                                <option>T10A</option>
                                <option>Cr12MoV</option>
                            </optgroup>
                             <optgroup label="有色金属">
                                <option>6061 (铝合金)</option>
                                <option>7075 (铝合金)</option>
                                <option>H62 (黄铜)</option>
                                <option>QSn6.5-0.1 (锡青铜)</option>
                                <option>TC4 (钛合金)</option>
                            </optgroup>
                        </InputGroup>
                    </div>
                </Section>
                 <Section title="几何参数">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <InputGroup label="外径 (mm)" name="outerDia" value={params.outerDia} onChange={handleChange} type="number" />
                         <InputGroup label="内径 (mm)" name="innerDia" value={params.innerDia} onChange={handleChange} type="number" />
                         <InputGroup label="长度 (mm)" name="length" value={params.length} onChange={handleChange} type="number" />
                    </div>
                </Section>
                <Section title="优化目标">
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InputGroup label="优化目标" name="optimizeTarget" value={params.optimizeTarget} onChange={handleChange} as="select">
                           <option>最小化重量</option><option>最大化强度</option><option>最低成本</option>
                        </InputGroup>
                        <InputGroup label="优化算法" name="algorithm" value={params.algorithm} onChange={handleChange} as="select">
                           <option>遗传算法</option><option>深度学习</option>
                        </InputGroup>
                        <InputGroup label="迭代次数" name="iterations" value={params.iterations} onChange={handleChange} type="number" />
                    </div>
                </Section>

                {optimizationResults && (
                    <Section title="优化结果">
                        <div className="grid md:grid-cols-3 gap-6">
                            <DataBox title="重量优化">
                                <DataItem label="减少" value={`${optimizationResults.weightReduction}`} />
                            </DataBox>
                            <DataBox title="强度提升">
                                <DataItem label="增加" value={`${optimizationResults.strengthIncrease}`} />
                            </DataBox>
                            <DataBox title="成本降低">
                                <DataItem label="节省" value={`${optimizationResults.costReduction}`} />
                            </DataBox>
                        </div>
                    </Section>
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleStartOptimization}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoadingOptimize}
                    >
                        {isLoadingOptimize ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                优化中...
                            </>
                        ) : (
                            <>
                                <PlayIcon className="w-5 h-5" />
                                开始优化
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleResetParams}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors disabled:opacity-50"
                        disabled={isLoadingOptimize}
                    >
                        <RotateCcwIcon className="w-5 h-5" />
                        重置参数
                    </button>
                </div>
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

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    label: string;
    as?: 'input' | 'select';
}

const InputGroup: React.FC<InputGroupProps> = ({ label, as = 'input', children, ...props }) => {
    const commonClasses = "w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500";
    const Component = as;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            <Component className={commonClasses} {...props}>
                {children}
            </Component>
        </div>
    );
};

// Re-using DataBox and DataItem from VisualizePage for consistency
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


export default OptimizePage;