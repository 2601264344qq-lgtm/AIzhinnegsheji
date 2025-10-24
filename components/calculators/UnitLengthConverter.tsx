import React, { useState } from 'react';
import { convertLengthUnit } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons'; // Assuming these icons are suitable

interface UnitLengthConverterProps {
    onConvert: (result: CalculationResult) => void;
}

const units = ['mm', 'cm', 'm', 'km', 'inch', 'ft'];

const UnitLengthConverter: React.FC<UnitLengthConverterProps> = ({ onConvert }) => {
    const [value, setValue] = useState<string>('');
    const [fromUnit, setFromUnit] = useState<string>('mm');
    const [toUnit, setToUnit] = useState<string>('m');
    const [isLoading, setIsLoading] = useState(false);

    const handleConvert = () => {
        setIsLoading(true);
        const numValue = parseFloat(value);
        const result = convertLengthUnit(numValue, fromUnit, toUnit);
        onConvert(result);
        setIsLoading(false);
    };

    const handleReset = () => {
        setValue('');
        setFromUnit('mm');
        setToUnit('m');
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">📏</span> 单位长度转换
            </h3>
            <p className="text-sm text-gray-400 mb-6">将长度数值从一种单位转换为另一种。</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">数值</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="例如: 100"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">来源单位</label>
                    <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">目标单位</label>
                    <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value)}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                        {units.map(unit => <option key={unit} value={unit}>{unit}</option>)}
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
                    onClick={handleConvert}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !value}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            转换中...
                        </>
                    ) : (
                        <>
                            <PlayIcon className="w-4 h-4" />
                            转换
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default UnitLengthConverter;