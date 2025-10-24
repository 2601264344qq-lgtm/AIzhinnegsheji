// Fix: Import `ReactNode` to resolve the "Cannot find namespace 'React'" error.
import type { ReactNode } from 'react';

export type Page = 'home' | 'chat' | 'calculator' | 'optimize' | 'visualize' | 'report';

export interface NavItem {
    id: Page;
    label: string;
    icon: ReactNode;
}

export interface UploadedFile {
    name: string;
    type: string;
    size: number;
    base64: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    attachments?: UploadedFile[];
}

export interface AnalysisData {
    params: {
        partType: string;
        materialType: string;
        outerDia: number;
        innerDia: number;
        length: number;
    };
    visualData: {
        stress: { max: number; location: string };
        deformation: { max: number; location: string };
        utilization: number;
    };
}

export interface CalculationResult {
    id: string; // Unique ID for the result
    title: string; // Title of the calculation, e.g., "轴承寿命计算结果"
    inputs: { label: string; value: string | number }[]; // Key input parameters
    output: { label: string; value: string | number }[]; // Key output results
    description?: string; // Optional detailed description
}