import React, { useState } from 'react';
import { queryToleranceFit } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface ToleranceFitQueryProps {
    onQuery: (result: CalculationResult) => void;
}

const ToleranceFitQuery: React.FC<ToleranceFitQueryProps> = ({ onQuery }) => {
    const [basicSize, setBasicSize] = useState('');
    const [hole, setHole] = useState('H7');
    const [shaft, setShaft] = useState('g6');

    const handleQuery = () => {
        const result = queryToleranceFit(parseFloat(basicSize), hole, shaft);
        onQuery(result);
    };

    const handleReset = () => {
        setBasicSize('');
        setHole('H7');
        setShaft('g6');
    };

    const canQuery = basicSize && hole && shaft;

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">📐</span> 公差配合查询
            </h3>
            <p className="text-sm text-gray-400 mb-6">查询孔轴配合的极限偏差和配合类型 (GB/T 1800)。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input label="基本尺寸 (mm)" value={basicSize} onChange={setBasicSize} placeholder="例如: 25" type="number" />
                <Input label="孔公差代号" value={hole} onChange={setHole} placeholder="例如: H7" />
                <Input label="轴公差代号" value={shaft} onChange={setShaft} placeholder="例如: g6" />
            </div>
            <div className="flex gap-3 justify-end">
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors">
                    <RotateCcwIcon className="w-4 h-4" />
                    重置
                </button>
                <button onClick={handleQuery} disabled={!canQuery} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50">
                    <PlayIcon className="w-4 h-4" />
                    查询
                </button>
            </div>
        </div>
    );
};

interface InputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    type?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder={placeholder}
            min={type === 'number' ? '0' : undefined}
        />
    </div>
);

export default ToleranceFitQuery;