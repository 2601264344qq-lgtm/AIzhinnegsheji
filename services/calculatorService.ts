import type { CalculationResult } from '../types';

// Expanded material properties based on common GB standards
export const materialProperties: { [key: string]: { density: number; yieldStrength: number; ultimateStrength: number; modulusE: number; modulusG: number; } } = {
    // Carbon Structural Steel (GB/T 700)
    'Q235': { density: 7850, yieldStrength: 235, ultimateStrength: 370, modulusE: 200, modulusG: 79 },
    'Q275': { density: 7850, yieldStrength: 275, ultimateStrength: 420, modulusE: 200, modulusG: 79 },
    // High-Quality Carbon Structural Steel (GB/T 699)
    '20钢': { density: 7850, yieldStrength: 245, ultimateStrength: 410, modulusE: 210, modulusG: 80 },
    '45钢': { density: 7850, yieldStrength: 355, ultimateStrength: 600, modulusE: 210, modulusG: 80 },
    // Alloy Structural Steel (GB/T 3077)
    '40Cr': { density: 7850, yieldStrength: 785, ultimateStrength: 980, modulusE: 210, modulusG: 80 },
    '20CrMnTi': { density: 7850, yieldStrength: 835, ultimateStrength: 1080, modulusE: 210, modulusG: 80 },
    '42CrMo': { density: 7850, yieldStrength: 930, ultimateStrength: 1080, modulusE: 210, modulusG: 80 },
    // Stainless Steel (GB/T 20878)
    '304不锈钢': { density: 7930, yieldStrength: 205, ultimateStrength: 515, modulusE: 193, modulusG: 75 },
    '316不锈钢': { density: 7980, yieldStrength: 205, ultimateStrength: 520, modulusE: 193, modulusG: 75 },
    // Gray Cast Iron (GB/T 9439)
    'HT200': { density: 7200, yieldStrength: 0, ultimateStrength: 200, modulusE: 100, modulusG: 40 }, // No defined yield
    'HT250': { density: 7250, yieldStrength: 0, ultimateStrength: 250, modulusE: 120, modulusG: 46 }, // No defined yield
    // Nodular Cast Iron (GB/T 1348)
    'QT400-18': { density: 7100, yieldStrength: 250, ultimateStrength: 400, modulusE: 169, modulusG: 65 },
    'QT500-7': { density: 7100, yieldStrength: 320, ultimateStrength: 500, modulusE: 169, modulusG: 65 },
    // Aluminum Alloy
    '6061-T6': { density: 2700, yieldStrength: 276, ultimateStrength: 310, modulusE: 69, modulusG: 26 },
    // Copper Alloy
    'H62黄铜': { density: 8500, yieldStrength: 205, ultimateStrength: 370, modulusE: 105, modulusG: 39 },
};

export function calculateBearingLife(C: number, P: number, n: number, isBallBearing: boolean): CalculationResult {
    const p = isBallBearing ? 3 : 10 / 3;
    const L10 = (C / P) ** p;
    const L10h = (1e6 / (60 * n)) * L10;

    return {
        id: `bearing-${Date.now()}`,
        title: '轴承寿命计算结果',
        inputs: [
            { label: '额定动载荷 C', value: `${C} kN` },
            { label: '当量动载荷 P', value: `${P} kN` },
            { label: '转速 n', value: `${n} rpm` },
            { label: '轴承类型', value: isBallBearing ? '球轴承' : '滚子轴承' },
        ],
        output: [
            { label: '基本额定寿命 L10', value: `${L10.toFixed(2)} 百万转` },
            { label: '额定寿命 L10h', value: `${L10h.toFixed(2)} 小时` },
        ],
        description: 'L10h 是指在90%可靠性下的轴承额定寿命（以小时为单位）。',
    };
}

const lengthConversionFactors: { [key: string]: number } = {
    mm: 1, cm: 10, m: 1000, km: 1e6, inch: 25.4, ft: 304.8,
};

export function convertLengthUnit(value: number, fromUnit: string, toUnit: string): CalculationResult {
    const valueInMm = value * lengthConversionFactors[fromUnit];
    const convertedValue = valueInMm / lengthConversionFactors[toUnit];

    return {
        id: `convert-${Date.now()}`,
        title: '单位长度转换结果',
        inputs: [
            { label: '数值', value: value },
            { label: '来源单位', value: fromUnit },
            { label: '目标单位', value: toUnit },
        ],
        output: [
            { label: '转换后数值', value: `${convertedValue.toPrecision(6)} ${toUnit}` },
        ],
    };
}

export function calculateBeamBending(F: number, L: number, b: number, h: number): CalculationResult {
    const E = 2.1e5; // Young's Modulus for steel in MPa (N/mm^2)
    const I = (b * h ** 3) / 12; // Moment of Inertia in mm^4
    const M_max = (F * L) / 4; // Max bending moment in N*mm
    const sigma_max = M_max * (h / 2) / I; // Max bending stress in MPa
    const y_max = (F * L ** 3) / (48 * E * I); // Max deflection in mm

    return {
        id: `beam-${Date.now()}`,
        title: '简支梁弯曲计算结果',
        inputs: [
            { label: '集中力 F', value: `${F} N` },
            { label: '梁长 L', value: `${L} mm` },
            { label: '截面宽 b', value: `${b} mm` },
            { label: '截面高 h', value: `${h} mm` },
        ],
        output: [
            { label: '最大弯矩 M_max', value: `${M_max.toFixed(2)} N*mm` },
            { label: '最大弯曲应力 σ_max', value: `${sigma_max.toFixed(2)} MPa` },
            { label: '最大挠度 y_max', value: `${y_max.toFixed(4)} mm` },
        ],
        description: '计算基于均质材料、矩形截面的简支梁在中心点受集中载荷的情况。材料假定为钢材 (E=210 GPa)。',
    };
}

export function calculateShaftTorsion(P: number, n: number, d: number): CalculationResult {
    const T = (P * 9550 * 1000) / n; // Torque in N*mm
    const Wt = (Math.PI * d ** 3) / 16; // Torsional section modulus in mm^3
    const tau_max = T / Wt; // Max torsional shear stress in MPa

    return {
        id: `shaft-${Date.now()}`,
        title: '轴扭转计算结果',
        inputs: [
            { label: '功率 P', value: `${P} kW` },
            { label: '转速 n', value: `${n} rpm` },
            { label: '轴径 d', value: `${d} mm` },
        ],
        output: [
            { label: '扭矩 T', value: `${T.toFixed(2)} N*mm` },
            { label: '最大扭转剪应力 τ_max', value: `${tau_max.toFixed(2)} MPa` },
        ],
        description: '计算基于传递功率和转速得出的实心圆轴的扭矩和最大剪应力。',
    };
}

export function checkBoltStrength(grade: string, d: number, F: number): CalculationResult {
    const gradeMap: { [key: string]: { sigma_b: number, sigma_s: number } } = {
        '4.6': { sigma_b: 400, sigma_s: 240 },
        '8.8': { sigma_b: 800, sigma_s: 640 },
        '10.9': { sigma_b: 1000, sigma_s: 900 },
    };
    const { sigma_b, sigma_s } = gradeMap[grade];
    // Approximate tensile stress area for metric coarse thread
    const As = 0.7854 * (d - 0.9382 * 1.5) ** 2; // Approximation, not exact for all pitches
    const sigma_calc = F / As;
    const isSafe = sigma_calc < sigma_s;

    return {
        id: `bolt-${Date.now()}`,
        title: '螺栓强度校核结果',
        inputs: [
            { label: '螺栓等级', value: grade },
            { label: '公称直径 d', value: `${d} mm` },
            { label: '轴向拉力 F', value: `${F} N` },
        ],
        output: [
            { label: '螺栓材料屈服强度 σ_s', value: `${sigma_s} MPa` },
            { label: '计算拉应力 σ_calc', value: `${sigma_calc.toFixed(2)} MPa` },
            { label: '强度校核', value: isSafe ? '✅ 安全' : '❌ 不安全' },
        ],
        description: `校核基于计算拉应力与材料屈服强度的比较。安全系数未计入。`,
    };
}

export function queryMaterialProperties(material: string): CalculationResult {
    // Case-insensitive and alias matching
    const key = Object.keys(materialProperties).find(k => k.toLowerCase() === material.toLowerCase() || k.replace('不锈钢', '') === material);
    const props = key ? materialProperties[key] : null;
    return {
        id: `material-${Date.now()}`,
        title: '材料属性查询结果',
        inputs: [{ label: '材料名称', value: material }],
        output: props ? [
            { label: '密度', value: `${props.density} kg/m³` },
            { label: '屈服强度 (σs)', value: `${props.yieldStrength > 0 ? props.yieldStrength + ' MPa' : '---'}` },
            { label: '抗拉强度 (σb)', value: `${props.ultimateStrength} MPa` },
            { label: '弹性模量 (E)', value: `${props.modulusE} GPa` },
            { label: '剪切模量 (G)', value: `${props.modulusG} GPa` },
        ] : [{ label: '错误', value: '未在库中找到该材料' }],
    };
}

export function calculateGearParameters(m: number, z: number): CalculationResult {
    return {
        id: `gear-${Date.now()}`,
        title: '齿轮参数计算结果',
        inputs: [
            { label: '模数 m', value: `${m} mm` },
            { label: '齿数 z', value: z },
        ],
        output: [
            { label: '分度圆直径 d', value: `${(m * z).toFixed(2)} mm` },
            { label: '齿顶高 ha', value: `${m.toFixed(2)} mm` },
            { label: '齿根高 hf', value: `${(1.25 * m).toFixed(2)} mm` },
            { label: '齿顶圆直径 da', value: `${(m * (z + 2)).toFixed(2)} mm` },
            { label: '齿根圆直径 df', value: `${(m * (z - 2.5)).toFixed(2)} mm` },
            { label: '中心距 (与同参数齿轮)', value: `${(m * z).toFixed(2)} mm` },
        ],
        description: '计算基于标准直齿圆柱齿轮，压力角为20°。',
    };
}


export function calculateSpringDesign(d: number, D: number, n: number, F: number): CalculationResult {
    const G = 80000; // Shear modulus for steel in MPa
    const C = D / d; // Spring index
    const K = ((4 * C - 1) / (4 * C - 4)) + (0.615 / C); // Wahl factor
    const tau = (8 * F * D * K) / (Math.PI * d ** 3); // Shear stress
    const k = (G * d ** 4) / (8 * D ** 3 * n); // Stiffness
    const delta = F / k; // Deflection

    return {
        id: `spring-${Date.now()}`,
        title: '弹簧设计计算结果',
        inputs: [
            { label: '钢丝直径 d', value: `${d} mm` },
            { label: '中径 D', value: `${D} mm` },
            { label: '有效圈数 n', value: n },
            { label: '工作载荷 F', value: `${F} N` },
        ],
        output: [
            { label: '弹簧刚度 k', value: `${k.toFixed(2)} N/mm` },
            { label: '工作变形量 δ', value: `${delta.toFixed(2)} mm` },
            { label: '修正后剪应力 τ', value: `${tau.toFixed(2)} MPa` },
        ],
        description: '计算基于圆截面钢丝的圆柱螺旋压缩弹簧。材料假定为弹簧钢 (G=80 GPa)。',
    };
}

export function calculateBeltDrive(D: number, d: number, a: number, n_small: number): CalculationResult {
    const i = D / d;
    const L = 2 * a + (Math.PI * (D + d)) / 2 + ((D - d) ** 2) / (4 * a);
    const v = (Math.PI * d * n_small) / (60 * 1000);
    const n_large = n_small / i;

    return {
        id: `belt-${Date.now()}`,
        title: '带传动计算结果',
        inputs: [
            { label: '大轮直径 D', value: `${D} mm` },
            { label: '小轮直径 d', value: `${d} mm` },
            { label: '中心距 a', value: `${a} mm` },
            { label: '小轮转速 n', value: `${n_small} rpm` },
        ],
        output: [
            { label: '传动比 i', value: i.toFixed(2) },
            { label: '带长 L', value: `${L.toFixed(2)} mm` },
            { label: '带速 v', value: `${v.toFixed(2)} m/s` },
            { label: '大轮转速 n_large', value: `${n_large.toFixed(2)} rpm` },
        ],
    };
}

export function calculatePressureVessel(P: number, Di: number, t: number, phi: number): CalculationResult {
    const sigma_h = (P * Di) / (2 * t * phi); // Hoop stress
    const sigma_l = (P * Di) / (4 * t * phi); // Longitudinal stress

    return {
        id: `vessel-${Date.now()}`,
        title: '压力容器计算结果',
        inputs: [
            { label: '内部压力 P', value: `${P} MPa` },
            { label: '内径 Di', value: `${Di} mm` },
            { label: '壁厚 t', value: `${t} mm` },
            { label: '焊缝系数 φ', value: phi },
        ],
        output: [
            { label: '环向应力 σ_h', value: `${sigma_h.toFixed(2)} MPa` },
            { label: '轴向应力 σ_l', value: `${sigma_l.toFixed(2)} MPa` },
        ],
        description: '计算基于薄壁圆筒形压力容器的理论应力。',
    };
}

export function calculateKeyConnection(T: number, d: number, b: number, h: number, l: number): CalculationResult {
    // Shear stress
    const tau = (2 * T) / (d * b * l);
    // Compressive stress (on the side)
    const sigma_c = (4 * T) / (d * h * l);

    return {
        id: `key-${Date.now()}`,
        title: '平键连接校核结果',
        inputs: [
            { label: '扭矩 T', value: `${T} N*mm` },
            { label: '轴径 d', value: `${d} mm` },
            { label: '键宽 b', value: `${b} mm` },
            { label: '键高 h', value: `${h} mm` },
            { label: '键长 l', value: `${l} mm` },
        ],
        output: [
            { label: '剪切应力 τ', value: `${tau.toFixed(2)} MPa` },
            { label: '挤压应力 σ_c', value: `${sigma_c.toFixed(2)} MPa` },
        ],
        description: '校核普通平键连接的剪切和挤压强度。请将计算结果与材料的许用应力进行比较。',
    };
}

export function calculateWeldStrength(F: number, a: number, Lw: number): CalculationResult {
    // Assuming the force is parallel to the weld length (shear)
    const A_w = 0.707 * a * Lw; // Weld throat area
    const tau = F / A_w;

    return {
        id: `weld-${Date.now()}`,
        title: '角焊缝强度计算结果',
        inputs: [
            { label: '作用力 F', value: `${F} N` },
            { label: '焊脚尺寸 a', value: `${a} mm` },
            { label: '焊缝总长 Lw', value: `${Lw} mm` },
        ],
        output: [
            { label: '焊缝剪应力 τ', value: `${tau.toFixed(2)} MPa` },
        ],
        description: '计算侧面角焊缝在平行载荷作用下的剪应力。请将结果与焊缝材料的许用剪应力比较。',
    };
}


// --- Tolerance & Fit Calculation (GB/T 1800-2009) ---

// Helper to find value from size-based tables
const findInTable = (size: number, table: number[][]) => {
    for (const row of table) {
        if (size <= row[0]) return row;
    }
    return table[table.length - 1];
};

// Standard Tolerances (IT grades in μm)
const itGradeTable = [ // [maxSize, IT6, IT7, IT8, IT9]
    [3, 8, 12, 18, 30], [6, 9, 15, 22, 36], [10, 11, 18, 27, 43], [18, 13, 21, 33, 52],
    [30, 16, 25, 39, 62], [50, 19, 30, 46, 74], [80, 22, 35, 54, 87], [120, 25, 40, 63, 100],
];

// Fundamental Deviations for Shafts (in μm)
const shaftDeviationTable: Record<string, number[][]> = {
    f: [[18, -13], [30, -20], [50, -25], [80, -32], [120, -40]],
    g: [[10, -2], [18, -4], [30, -5], [50, -7], [80, -9], [120, -10]],
    h: [[500, 0]],
    js: [[10, 4.5], [18, 5.5], [30, 6.5]], // Symmetric, value is IT/2
    k: [[18, 2], [30, 2], [50, 2], [80, 3], [120, 4]],
    m: [[10, 6], [18, 8], [30, 9], [50, 11], [80, 13], [120, 15]],
    n: [[10, 10], [18, 13], [30, 15], [50, 17], [80, 20], [120, 23]],
    p: [[10, 14], [18, 18], [30, 21], [50, 25], [80, 29], [120, 34]],
};

// Fundamental Deviations for Holes (in μm)
const holeDeviationTable: Record<string, number[][]> = {
    F: [[18, 13], [30, 20], [50, 25], [80, 32], [120, 40]],
    G: [[10, 2], [18, 4], [30, 5], [50, 7], [80, 9], [120, 10]],
    H: [[500, 0]],
    JS: [[10, 4.5], [18, 5.5], [30, 6.5]],
    K: [[18, -2], [30, -2], [50, -2], [80, -3], [120, -4]],
    M: [[10, -6], [18, -8], [30, -9], [50, -11], [80, -13], [120, -15]],
    N: [[10, -10], [18, -13], [30, -15], [50, -17], [80, -20], [120, -23]],
    P: [[10, -14], [18, -18], [30, -21], [50, -25], [80, -29], [120, -34]],
};

export function queryToleranceFit(basicSize: number, holeCode: string, shaftCode: string): CalculationResult {
    const parseCode = (code: string) => {
        const letter = code.match(/[a-zA-Z]+/)?.[0] || '';
        const grade = parseInt(code.match(/\d+/)?.[0] || '0');
        return { letter, grade };
    };
    
    const inputs = [
        { label: '基本尺寸', value: `${basicSize} mm` },
        { label: '孔公差', value: holeCode },
        { label: '轴公差', value: shaftCode },
    ];
    
    const { letter: holeLetter, grade: holeGrade } = parseCode(holeCode);
    const { letter: shaftLetter, grade: shaftGrade } = parseCode(shaftCode);

    const gradeRow = findInTable(basicSize, itGradeTable);
    const gradeIndex = holeGrade ? holeGrade - 5 : -1;

    if (!gradeRow || gradeIndex < 1 || gradeIndex > 4) {
        return { id: `fit-error-${Date.now()}`, title: '公差配合查询结果', inputs, output: [{ label: '错误', value: `不支持的公差等级 (支持IT6-IT9)` }] };
    }
    
    const Td = gradeRow[holeGrade - 5]; // Tolerance for hole
    const Tds = gradeRow[shaftGrade - 5]; // Tolerance for shaft
    
    const holeDevRow = holeDeviationTable[holeLetter] ? findInTable(basicSize, holeDeviationTable[holeLetter]) : null;
    const shaftDevRow = shaftDeviationTable[shaftLetter] ? findInTable(basicSize, shaftDeviationTable[shaftLetter]) : null;

    if (!holeDevRow || !shaftDevRow) {
        return { id: `fit-error-${Date.now()}`, title: '公差配合查询结果', inputs, output: [{ label: '错误', value: `不支持的基本偏差代号` }] };
    }

    let EI = holeDevRow[1];
    let ES = EI + Td;
    if (holeLetter === 'H') { EI = 0; ES = Td; }
    if (holeLetter > 'H' && holeLetter < 'P') EI = -holeDevRow[1]; // Symmetrical cases
    ES = EI + Td;


    let es = shaftDevRow[1];
    let ei = es - Tds;
    if (shaftLetter === 'h') { es = 0; ei = -Tds; }
    if (shaftLetter > 'a' && shaftLetter < 'h') es = -shaftDevRow[1];
    ei = es - Tds;

    // Convert from μm to mm
    const ES_mm = ES / 1000;
    const EI_mm = EI / 1000;
    const es_mm = es / 1000;
    const ei_mm = ei / 1000;

    const maxClearance = ES_mm - ei_mm;
    const minClearance = EI_mm - es_mm;
    
    let fitType = '';
    if (minClearance >= 0) {
        fitType = '间隙配合';
    } else if (maxClearance <= 0) {
        fitType = '过盈配合';
    } else {
        fitType = '过渡配合';
    }

    return {
        id: `fit-${Date.now()}`,
        title: '公差配合查询结果',
        inputs,
        output: [
            { label: '孔公差', value: `${EI_mm.toFixed(3)} ~ ${ES_mm.toFixed(3)} mm` },
            { label: '轴公差', value: `${ei_mm.toFixed(3)} ~ ${es_mm.toFixed(3)} mm` },
            { label: '最大间隙 (Xmax)', value: `${maxClearance.toFixed(3)} mm` },
            { label: '最小间隙 (Xmin)', value: `${minClearance.toFixed(3)} mm` },
            { label: '配合类型', value: fitType },
        ],
        description: '计算基于GB/T 1800-2009标准。结果单位为毫米(mm)。'
    };
}