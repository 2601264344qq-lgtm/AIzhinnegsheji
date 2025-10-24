import React from 'react';
import { FileTextIcon, EyeIcon } from '../icons/Icons';
import type { AnalysisData } from '../../types'; // Import AnalysisData

interface ReportPageProps {
    hasData: boolean;
    initialData: AnalysisData | null; // Pass initialData to populate the report
}

const ReportPage: React.FC<ReportPageProps> = ({ hasData, initialData }) => {
    const reportDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-violet-200 mb-2">报告生成</h2>
            <p className="text-gray-400 mb-8">一键生成专业的设计分析报告，包含完整的设计数据和优化建议</p>

            <Section title="报告配置">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputGroup label="报告类型" name="reportType" as="select">
                        <option>设计分析报告</option>
                        <option>优化建议报告</option>
                        <option>完整技术报告</option>
                    </InputGroup>
                    <InputGroup label="报告格式" name="reportFormat" as="select">
                        <option>PDF</option>
                        <option>Word (DOCX)</option>
                        <option>Markdown</option>
                    </InputGroup>
                    <InputGroup label="语言" name="reportLanguage" as="select">
                        <option>中文</option>
                        <option>English</option>
                    </InputGroup>
                </div>
            </Section>
            
            <div className="flex gap-4 pt-8 mb-8">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-50" disabled={!hasData}>
                    <FileTextIcon className="w-5 h-5" />
                    生成报告
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/70 border border-violet-500/50 text-violet-200 font-semibold rounded-lg hover:bg-slate-700/70 transition-colors disabled:opacity-50" disabled={!hasData}>
                    <EyeIcon className="w-5 h-5" />
                    预览报告
                </button>
            </div>

            <Section title="报告预览">
                <div className="prose prose-invert prose-p:text-gray-400 prose-h3:text-violet-200 prose-h4:text-violet-300 max-w-none">
                    <div className="text-center mb-10">
                        <h3>机械设计分析报告</h3>
                        <p className="text-sm text-gray-500">生成日期：{reportDate}</p>
                    </div>
                    <h4>1. 项目概述</h4>
                    <p>本报告对机械零件的设计方案进行了全面的分析与评估。通过AI智能优化算法，对零件的几何参数、材料选择和结构设计进行了系统性优化。</p>
                    <h4>2. 设计参数</h4>
                    <p>
                        <strong>零件类型：</strong>{hasData ? (initialData?.params?.partType || '未知') : '待定'} <br/>
                        <strong>材料：</strong>{hasData ? (initialData?.params?.materialType || '未知') : '待定'} <br/>
                        <strong>外径：</strong>{hasData ? `${initialData?.params?.outerDia?.toFixed(2) || '未知'} mm` : '待定'} <br/>
                        <strong>内径：</strong>{hasData ? `${initialData?.params?.innerDia?.toFixed(2) || '未知'} mm` : '待定'} <br/>
                        <strong>长度：</strong>{hasData ? `${initialData?.params?.length?.toFixed(2) || '未知'} mm` : '待定'} <br/>
                    </p>
                     <h4>3. 分析结果</h4>
                    <p>
                        {hasData ? (
                            <>
                                经过仔细分析，该设计方案在强度、刚度和稳定性方面均满足要求。主要分析结果如下：<br/>
                                <strong>最大应力：</strong> {initialData?.visualData.stress.max?.toFixed(2) || '未知'} MPa (位置: {initialData?.visualData.stress.location || '未知'})<br/>
                                <strong>最大变形：</strong> {initialData?.visualData.deformation.max?.toFixed(2) || '未知'} mm (位置: {initialData?.visualData.deformation.location || '未知'})<br/>
                                <strong>材料利用率：</strong> {initialData?.visualData.utilization?.toFixed(1) || '未知'}%
                            </>
                        ) : '暂无分析结果。请先在对话页面上传文件进行分析。'}
                    </p>
                     <h4>4. 结论</h4>
                    <p>{hasData ? '该设计方案技术可行，满足所有性能指标要求。建议进一步考虑在极端工况下的表现。' : '暂无结论。'}</p>
                </div>
            </Section>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-900/60 backdrop-blur-lg p-7 rounded-2xl border border-violet-500/30">
        <h3 className="text-xl font-semibold mb-6 text-violet-200">{title}</h3>
        {children}
    </div>
);

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    label: string;
    as?: 'input' | 'select';
}

const InputGroup: React.FC<InputGroupProps> = ({ label, as = 'input', children, ...props }) => {
    const commonClasses = "w-full bg-slate-800/80 border border-violet-500/40 rounded-lg py-2.5 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500";
    const Component = as;
    return (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            <Component className={commonClasses} {...props}>
                {children}
            </Component>
        </div>
    );
};

export default ReportPage;