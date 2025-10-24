import React, { useState } from 'react';
import { calculateBeltDrive } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface BeltDriveCalculatorProps {
    onCalculate: (result: CalculationResult) => void;
}

const BeltDriveCalculator: React.FC<BeltDriveCalculatorProps> = ({ onCalculate }) => {
    const [largePulleyDia, setLargePulleyDia] = useState('');
    const [smallPulleyDia, setSmallPulleyDia] = useState('');
    const [centerDistance, setCenterDistance] = useState('');
    const [speed, setSpeed] = useState('');

    const handleCalculate = () => {
        const result = calculateBeltDrive(parseFloat(largePulleyDia), parseFloat(smallPulleyDia), parseFloat(centerDistance), parseFloat(speed));
        onCalculate(result);
    };

    const handleReset = () => {
        setLargePulleyDia('');
        setSmallPulleyDia('');
        setCenterDistance('');
        setSpeed('');
    };
    
    const canCalculate = largePulleyDia && smallPulleyDia && centerDistance && speed;

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">🔗</span> 带传动计算
            </h3>
            <p className="text-sm text-gray-400 mb-6">V带、平带传动的设计计算和张紧力校核。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input label="大轮直径 D (mm)" value={largePulleyDia} onChange={setLargePulleyDia} placeholder="例如: 200" />
                <Input label="小轮直径 d (mm)" value={smallPulleyDia} onChange={setSmallPulleyDia} placeholder="例如: 100" />
                <Input label="中心距 a (mm)" value={centerDistance} onChange={setCenterDistance} placeholder="例如: 300" />
                <Input label="小轮转速 n (rpm)" value={speed} onChange={setSpeed} placeholder="例如: 1500" />
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

export default BeltDriveCalculator;