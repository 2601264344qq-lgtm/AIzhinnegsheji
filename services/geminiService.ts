import { GoogleGenAI, Type } from "@google/genai";
import type { UploadedFile, AnalysisData } from '../types';

// Fix: Initialize GoogleGenAI with API_KEY from environment variables directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a text response from the Gemini model based on a prompt.
 */
export async function generateResponse(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                systemInstruction: `你是小顾，一个专业的机械设计AI助手。你具备深厚的机械工程知识，包括机械设计原理、强度分析、材料选择、零件设计（齿轮、轴、轴承等）、工程计算、参数优化、结构分析、CAD设计、制造工艺和质量控制。请用专业、友好的语气回答用户的机械设计问题。回答要准确专业，结构清晰，使用markdown格式。`
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get response from AI model.");
    }
}

/**
 * Analyzes uploaded files (images) along with a text prompt.
 * Simulates data extraction and returns both a text response and structured data.
 */
export async function analyzeFileContent(prompt: string, files: UploadedFile[]): Promise<{ text: string, analysisData: AnalysisData | null }> {
    const imageParts = files
        .filter(file => file.type.startsWith('image/'))
        .map(file => ({
            inlineData: {
                mimeType: file.type,
                data: file.base64,
            },
        }));

    if (imageParts.length === 0) {
        return { text: "请上传图片文件进行分析。", analysisData: null };
    }
    
    // Fix: Use responseSchema for reliable JSON output, a more robust method than prompt engineering. This also fixes a bug where the user's prompt was ignored.
    const analysisPrompt = `${prompt || 'Analyze the provided engineering drawing image.'} Extract the key parameters and provide a summary.`;
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            partType: { type: Type.STRING, description: "Part type, e.g., 齿轮" },
            materialType: { type: Type.STRING, description: "Material type, e.g., 45钢" },
            outerDia: { type: Type.NUMBER },
            innerDia: { type: Type.NUMBER },
            length: { type: Type.NUMBER },
            stressMax: { type: Type.NUMBER },
            deformationMax: { type: Type.NUMBER },
            utilization: { type: Type.NUMBER },
            summary: { type: Type.STRING, description: "A brief, one-paragraph technical summary of the drawing." }
        },
        required: ["partType", "materialType", "outerDia", "innerDia", "length", "stressMax", "deformationMax", "utilization", "summary"]
    };


    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [...imageParts, { text: analysisPrompt }] }],
            // Fix: Added config for JSON mode.
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            }
        });

        const parsed = JSON.parse(response.text);

        const analysisData: AnalysisData = {
            params: {
                partType: parsed.partType || '未知',
                materialType: parsed.materialType || '未知',
                outerDia: Number(parsed.outerDia) || 0,
                innerDia: Number(parsed.innerDia) || 0,
                length: Number(parsed.length) || 0,
            },
            visualData: {
                stress: { max: Number(parsed.stressMax) || 0, location: 'AI分析' },
                deformation: { max: Number(parsed.deformationMax) || 0, location: 'AI分析' },
                utilization: Number(parsed.utilization) || 0,
            },
        };

        return { text: parsed.summary || "分析完成，请查看同步数据。", analysisData };

    } catch (error) {
        console.error("Gemini file analysis failed:", error);
        // Fallback to mock analysis on error
        return {
            text: "AI分析时遇到错误，已使用模拟数据填充。这份模拟数据显示了一个齿轮传动系统的分析结果。",
            analysisData: getMockAnalysisData()
        };
    }
}

function getMockAnalysisData(): AnalysisData {
    return {
        params: {
            partType: '齿轮',
            materialType: '45钢',
            outerDia: 50,
            innerDia: 20,
            length: 100
        },
        visualData: {
            stress: { max: 245.6, location: 'X:25mm, Y:10mm' },
            deformation: { max: 0.42, location: 'X:50mm, Y:0mm' },
            utilization: 87.3
        }
    };
}