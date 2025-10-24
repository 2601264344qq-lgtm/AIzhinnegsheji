import React, { useState } from 'react';
import { calculateSpringDesign } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface SpringCalculatorProps {
    onCalculate: (result: CalculationResult) => void;
}

const SpringCalculator: React.FC<SpringCalculatorProps> = ({ onCalculate }) => {
    const [wireDia, setWireDia] = useState('');
    const [meanDia, setMeanDia] = useState('');
    const [activeCoils, setActiveCoils] = useState('');
    const [force, setForce] = useState('');

    const handleCalculate = () => {
        const result = calculateSpringDesign(parseFloat(wireDia), parseFloat(meanDia), parseFloat(activeCoils), parseFloat(force));
        onCalculate(result);
    };

    const handleReset = () => {
        setWireDia('');
        setMeanDia('');
        setActiveCoils('');
        setForce('');
    };
    
    const canCalculate = wireDia && meanDia && activeCoils && force;

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">🌀</span> 弹簧设计计算
            </h3>
            <p className="text-sm text-gray-400 mb-6">设计压缩弹簧，计算刚度、应力和变形。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input label="钢丝直径 d (mm)" value={wireDia} onChange={setWireDia} placeholder="例如: 2" />
                <Input label="中径 D (mm)" value={meanDia} onChange={setMeanDia} placeholder="例如: 20" />
                <Input label="有效圈数 n" value={activeCoils} onChange={setActiveCoils} placeholder="例如: 10" />
                <Input label="工作载荷 F (N)" value={force} onChange={setForce} placeholder="例如: 100" />
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

export default SpringCalculator;