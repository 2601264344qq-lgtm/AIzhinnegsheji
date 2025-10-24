import React, { useState } from 'react';
import { calculateKeyConnection } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface KeyConnectionCalculatorProps {
    onCalculate: (result: CalculationResult) => void;
}

const KeyConnectionCalculator: React.FC<KeyConnectionCalculatorProps> = ({ onCalculate }) => {
    const [torque, setTorque] = useState('');
    const [shaftDia, setShaftDia] = useState('');
    const [keyWidth, setKeyWidth] = useState('');
    const [keyHeight, setKeyHeight] = useState('');
    const [keyLength, setKeyLength] = useState('');

    const handleCalculate = () => {
        // Service expects N*mm, so convert from N*m
        const torqueInNmm = parseFloat(torque) * 1000;
        const result = calculateKeyConnection(torqueInNmm, parseFloat(shaftDia), parseFloat(keyWidth), parseFloat(keyHeight), parseFloat(keyLength));
        onCalculate(result);
    };

    const handleReset = () => {
        setTorque('');
        setShaftDia('');
        setKeyWidth('');
        setKeyHeight('');
        setKeyLength('');
    };
    
    const canCalculate = torque && shaftDia && keyWidth && keyHeight && keyLength;

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">🔑</span> 平键连接校核
            </h3>
            <p className="text-sm text-gray-400 mb-6">校核平键连接的剪切和挤压强度。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input label="扭矩 T (N*m)" value={torque} onChange={setTorque} placeholder="例如: 63" />
                <Input label="轴径 d (mm)" value={shaftDia} onChange={setShaftDia} placeholder="例如: 30" />
                <Input label="键宽 b (mm)" value={keyWidth} onChange={setKeyWidth} placeholder="例如: 8" />
                <Input label="键高 h (mm)" value={keyHeight} onChange={setKeyHeight} placeholder="例如: 7" />
                <Input label="键长 l (mm)" value={keyLength} onChange={setKeyLength} placeholder="例如: 50" />
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

export default KeyConnectionCalculator;