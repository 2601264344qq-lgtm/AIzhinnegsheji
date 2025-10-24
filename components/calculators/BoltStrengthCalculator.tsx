import React, { useState } from 'react';
import { checkBoltStrength } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface BoltStrengthCalculatorProps {
    onCalculate: (result: CalculationResult) => void;
}

const BoltStrengthCalculator: React.FC<BoltStrengthCalculatorProps> = ({ onCalculate }) => {
    const [grade, setGrade] = useState('8.8');
    const [diameter, setDiameter] = useState('');
    const [force, setForce] = useState('');

    const handleCalculate = () => {
        const result = checkBoltStrength(grade, parseFloat(diameter), parseFloat(force));
        onCalculate(result);
    };

    const handleReset = () => {
        setGrade('8.8');
        setDiameter('');
        setForce('');
    };
    
    const canCalculate = grade && diameter && force;

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">🔩</span> 螺栓强度校核
            </h3>
            <p className="text-sm text-gray-400 mb-6">校核螺栓连接的抗拉强度。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">螺栓等级</label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
                        <option value="4.6">4.6</option>
                        <option value="8.8">8.8</option>
                        <option value="10.9">10.9</option>
                    </select>
                </div>
                <Input label="公称直径 d (mm)" value={diameter} onChange={setDiameter} placeholder="例如: 10 (M10)" />
                <Input label="轴向拉力 F (N)" value={force} onChange={setForce} placeholder="例如: 20000" />
            </div>
            <div className="flex gap-3 justify-end">
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors">
                    <RotateCcwIcon className="w-4 h-4" />
                    重置
                </button>
                <button onClick={handleCalculate} disabled={!canCalculate} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
                    <PlayIcon className="w-4 h-4" />
                    校核
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

export default BoltStrengthCalculator;