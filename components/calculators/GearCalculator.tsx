import React, { useState } from 'react';
import { calculateGearParameters } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface GearCalculatorProps {
    onCalculate: (result: CalculationResult) => void;
}

const GearCalculator: React.FC<GearCalculatorProps> = ({ onCalculate }) => {
    const [modulus, setModulus] = useState('');
    const [teeth, setTeeth] = useState('');

    const handleCalculate = () => {
        const result = calculateGearParameters(parseFloat(modulus), parseInt(teeth, 10));
        onCalculate(result);
    };

    const handleReset = () => {
        setModulus('');
        setTeeth('');
    };
    
    const canCalculate = modulus && teeth;

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">⚙️</span> 齿轮参数计算
            </h3>
            <p className="text-sm text-gray-400 mb-6">计算标准齿轮的模数、齿数、中心距等参数。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input label="模数 m (mm)" value={modulus} onChange={setModulus} placeholder="例如: 2" />
                <Input label="齿数 z" value={teeth} onChange={setTeeth} placeholder="例如: 30" />
            </div>
            <div className="flex gap-3 justify-end">
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors">
                    <RotateCcwIcon className="w-4 h-4" />
                    重置
                </button>
                <button onClick={handleCalculate} disabled={!canCalculate} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
                    <PlayIcon className="w-4 h-4" />
                    计算
                </button>
            </div>
        </div>
    );
};

const Input: React.FC<{ label: string, value: string, onChange: (val: string) => void, placeholder: string }> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder={placeholder}
            min="0"
        />
    </div>
);

export default GearCalculator;