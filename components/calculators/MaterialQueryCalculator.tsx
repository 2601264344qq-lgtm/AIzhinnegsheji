import React, { useState } from 'react';
import { queryMaterialProperties, materialProperties } from '../../services/calculatorService';
import type { CalculationResult } from '../../types';
import { PlayIcon, RotateCcwIcon } from '../icons/Icons';

interface MaterialQueryCalculatorProps {
    onQuery: (result: CalculationResult) => void;
}

// Get material names from the service for the datalist
const materialNames = Object.keys(materialProperties);

const MaterialQueryCalculator: React.FC<MaterialQueryCalculatorProps> = ({ onQuery }) => {
    const [material, setMaterial] = useState('');

    const handleQuery = () => {
        if (!material) return;
        const result = queryMaterialProperties(material);
        onQuery(result);
    };

    const handleReset = () => {
        setMaterial('');
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-lg p-6 rounded-2xl border border-violet-500/30 transition-all duration-300 hover:border-violet-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/10">
            <h3 className="text-xl font-semibold mb-4 text-violet-200 flex items-center gap-2">
                <span className="text-3xl">🧪</span> 材料属性查询
            </h3>
            <p className="text-sm text-gray-400 mb-6">查询常用GB工程材料的机械性能参数。</p>
            <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">材料牌号</label>
                    <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="例如: 45钢, Q235, HT200..."
                        list="material-options"
                    />
                    <datalist id="material-options">
                        {materialNames.map(mat => <option key={mat} value={mat} />)}
                    </datalist>
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors"
                >
                    <RotateCcwIcon className="w-4 h-4" />
                    重置
                </button>
                <button
                    onClick={handleQuery}
                    disabled={!material}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                >
                    <PlayIcon className="w-4 h-4" />
                    查询
                </button>
            </div>
        </div>
    );
};

export default MaterialQueryCalculator;