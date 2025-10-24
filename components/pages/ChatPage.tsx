import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { ChatMessage, UploadedFile, AnalysisData } from '../../types';
import { SendIcon, PlusIcon, PaperclipIcon, XIcon, FileIcon, ImageIcon } from '../icons/Icons';
import { generateResponse, analyzeFileContent } from '../../services/geminiService';

interface ChatPageProps {
    onAnalysisComplete: (data: AnalysisData) => void;
}

const WelcomeScreen: React.FC<{ onPromptClick: (prompt: string) => void }> = ({ onPromptClick }) => (
    <div className="text-center max-w-3xl mx-auto my-16 animate-fadeIn">
        <h1 className="text-4xl font-bold text-violet-200 mb-4">🤖 与小顾对话</h1>
        <p className="text-lg text-gray-400 mb-8">你的专业机械设计伙伴，随时为您解答设计问题</p>
        <div className="grid md:grid-cols-2 gap-4 text-left">
            <PromptCard title="🔧 设计验证" text="帮我分析设计参数是否合理" onClick={() => onPromptClick('帮我分析一下这个齿轮的设计参数是否合理')} />
            <PromptCard title="🎯 选型建议" text="推荐适合的零件类型" onClick={() => onPromptClick('请推荐适合的轴承类型和选型方法')} />
            <PromptCard title="⚙️ 优化建议" text="提供结构优化方案" onClick={() => onPromptClick('如何优化这个机械结构的强度和重量')} />
            <PromptCard title="🛠️ 工艺分析" text="解释加工工艺选择" onClick={() => onPromptClick('请解释一下这个加工工艺的选择依据')} />
        </div>
    </div>
);

const PromptCard: React.FC<{ title: string, text: string, onClick: () => void }> = ({ title, text, onClick }) => (
    <div onClick={onClick} className="bg-slate-900/60 p-5 rounded-lg border border-violet-500/30 cursor-pointer transition-all duration-200 hover:bg-violet-500/20 hover:border-violet-400">
        <h4 className="font-semibold text-violet-200 mb-1">{title}</h4>
        <p className="text-sm text-gray-400">{text}</p>
    </div>
);

const ChatPage: React.FC<ChatPageProps> = ({ onAnalysisComplete }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatAreaRef.current?.scrollTo({ top: chatAreaRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Fix: Explicitly type `files` as `File[]` to resolve errors where properties on `file` were not found.
        const files: File[] = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const filePromises = files.map(file => {
            return new Promise<UploadedFile>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = (e.target?.result as string).split(',')[1];
                    resolve({ name: file.name, type: file.type, size: file.size, base64 });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(newFiles => {
            setUploadedFiles(prev => [...prev, ...newFiles]);
        });
        
        if(event.target) event.target.value = ''; // Allow re-uploading same file
    };

    const handleSendMessage = useCallback(async () => {
        const trimmedInput = userInput.trim();
        if ((!trimmedInput && uploadedFiles.length === 0) || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: trimmedInput || '请分析上传的文件。',
            attachments: uploadedFiles,
        };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setUploadedFiles([]);
        setIsLoading(true);

        try {
            let responseContent = '';
            if (uploadedFiles.length > 0) {
                const result = await analyzeFileContent(trimmedInput, uploadedFiles);
                responseContent = result.text;
                if (result.analysisData) {
                    onAnalysisComplete(result.analysisData);
                    responseContent += `\n\n💡 分析数据已同步到参数优化、结果可视化和报告生成页面。`;
                }
            } else {
                responseContent = await generateResponse(trimmedInput);
            }
            
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent,
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '抱歉，我遇到了一些问题，请稍后再试。',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [userInput, uploadedFiles, isLoading, onAnalysisComplete]);

    const handlePromptClick = (prompt: string) => {
        setUserInput(prompt);
    };
    
    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col h-full">
            <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 ? (
                    <WelcomeScreen onPromptClick={handlePromptClick} />
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex gap-4 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                             {msg.role === 'assistant' && <div className="w-8 h-8 rounded-md flex-shrink-0 bg-gradient-to-br from-violet-500 to-blue-500 text-white flex items-center justify-center font-bold">AI</div>}
                            <div className={`max-w-2xl p-4 rounded-xl ${msg.role === 'user' ? 'bg-violet-500/20 rounded-br-none' : 'bg-slate-800/60 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {msg.attachments.map((file, idx) => (
                                            <div key={idx} className="bg-slate-700/50 p-2 rounded-lg flex items-center gap-2">
                                                {file.type.startsWith('image/') ? <img src={`data:${file.type};base64,${file.base64}`} alt={file.name} className="w-16 h-16 object-cover rounded-md" /> : <FileIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />}
                                                <span className="text-xs text-gray-300 truncate">{file.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {msg.role === 'user' && <div className="w-8 h-8 rounded-md flex-shrink-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold">U</div>}
                        </div>
                    ))
                )}
                {isLoading && (
                     <div className="flex gap-4 items-start">
                         <div className="w-8 h-8 rounded-md flex-shrink-0 bg-gradient-to-br from-violet-500 to-blue-500 text-white flex items-center justify-center font-bold">AI</div>
                         <div className="max-w-2xl p-4 rounded-xl bg-slate-800/60 rounded-bl-none">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                <span>正在思考...</span>
                            </div>
                         </div>
                    </div>
                )}
            </div>
            <div className="p-4 bg-slate-900/70 backdrop-blur-lg border-t border-violet-500/30">
                <div className="max-w-3xl mx-auto">
                    {uploadedFiles.length > 0 && (
                        <div className="mb-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {uploadedFiles.map((file, i) => (
                                <div key={i} className="relative bg-slate-800 p-2 rounded-md flex items-center gap-2 text-sm">
                                    {file.type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-violet-400 flex-shrink-0"/> : <PaperclipIcon className="w-5 h-5 text-gray-400 flex-shrink-0"/>}
                                    <span className="truncate text-gray-300">{file.name}</span>
                                    <button onClick={() => removeFile(i)} className="absolute -top-1 -right-1 bg-gray-700 rounded-full p-0.5 hover:bg-red-500">
                                        <XIcon className="w-3 h-3 text-white"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-gray-400 hover:bg-violet-500/20 hover:text-violet-300 transition-colors">
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="请输入您的设计问题或需求，或点击+上传文件..."
                            rows={1}
                            className="w-full bg-slate-800 border border-violet-500/40 rounded-lg py-3 pr-20 pl-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none max-h-40 overflow-y-auto"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <button onClick={handleSendMessage} disabled={isLoading} className="p-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;