import React, { useState } from 'react';
import { calculateBearingLife } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons'; // Assuming these icons are suitable

interface BearingLifeCalculatorProps {
    onCalculate: (result: CalculationResult) => void;
}

const BearingLifeCalculator: React.FC<BearingLifeCalculatorProps> = ({ onCalculate }) => {
    const [dynamicLoadRating, setDynamicLoadRating] = useState<string>(''); // C
    const [equivalentDynamicLoad, setEquivalentDynamicLoad] = useState<string>(''); // P
    const [speedRPM, setSpeedRPM] = useState<string>(''); // n
    const [bearingType, setBearingType] = useState<'ball' | 'roller'>('ball');
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = () => {
        setIsLoading(true);
        const C = parseFloat(dynamicLoadRating);
        const P = parseFloat(equivalentDynamicLoad);
        const n = parseFloat(speedRPM);

        const result = calculateBearingLife(C, P, n, bearingType === 'ball');
        onCalculate(result);
        setIsLoading(false);
    };

    const handleReset = () => {
        setDynamicLoadRating('');
        setEquivalentDynamicLoad('');
        setSpeedRPM('');
        setBearingType('ball');
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">⚙️</span> 轴承寿命计算
            </h3>
            <p className="text-sm text-gray-400 mb-6">计算滚动轴承的额定寿命 (L10h)。</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">额定动载荷 C (kN)</label>
                    <input
                        type="number"
                        value={dynamicLoadRating}
                        onChange={(e) => setDynamicLoadRating(e.target.value)}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="例如: 20"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">当量动载荷 P (kN)</label>
                    <input
                        type="number"
                        value={equivalentDynamicLoad}
                        onChange={(e) => setEquivalentDynamicLoad(e.target.value)}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="例如: 5"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">转速 n (rpm)</label>
                    <input
                        type="number"
                        value={speedRPM}
                        onChange={(e) => setSpeedRPM(e.target.value)}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="例如: 1000"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">轴承类型</label>
                    <select
                        value={bearingType}
                        onChange={(e) => setBearingType(e.target.value as 'ball' | 'roller')}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="ball">球轴承</option>
                        <option value="roller">滚子轴承</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3 justify-end">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors"
                    disabled={isLoading}
                >
                    <RotateCcwIcon className="w-4 h-4" />
                    重置
                </button>
                <button
                    onClick={handleCalculate}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !dynamicLoadRating || !equivalentDynamicLoad || !speedRPM}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            计算中...
                        </>
                    ) : (
                        <>
                            <PlayIcon className="w-4 h-4" />
                            计算
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default BearingLifeCalculator;