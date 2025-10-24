import React from 'react';
import type { CalculationResult } from '../types';
import { XIcon } from './icons/Icons';

interface CalculationResultModalProps {
    result: CalculationResult | null;
    onClose: () => void;
}

const CalculationResultModal: React.FC<CalculationResultModalProps> = ({ result, onClose }) => {
    if (!result) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900/90 w-full max-w-lg p-6 rounded-2xl border border-violet-500/40 shadow-2xl relative animate-[zoomIn_0.3s_ease-out]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/70 text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <XIcon className="w-5 h-5" />
                </button>

                <h3 className="text-2xl font-bold text-violet-200 mb-6 border-b border-violet-500/30 pb-3">
                    {result.title}
                </h3>

                <div className="space-y-4 mb-6">
                    <div>
                        <h4 className="text-lg font-semibold text-violet-300 mb-2">输入参数</h4>
                        <ul className="space-y-1 text-gray-300">
                            {result.inputs.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span className="text-gray-400">{item.label}:</span>
                                    <span className="font-medium">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-violet-300 mb-2">计算结果</h4>
                        <ul className="space-y-1 text-gray-300">
                            {result.output.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                    <span className="text-gray-400">{item.label}:</span>
                                    <span className="font-medium text-violet-200">{item.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {result.description && (
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-violet-500/20 text-sm text-gray-400 leading-relaxed">
                        <h4 className="font-semibold text-violet-300 mb-2">说明</h4>
                        <p>{result.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculationResultModal;