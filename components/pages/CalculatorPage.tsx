import React, { useState } from 'react';
import type { CalculationResult } from '../../types';

import BearingLifeCalculator from '../calculators/BearingLifeCalculator';
import UnitLengthConverter from '../calculators/UnitLengthConverter';
import CalculationResultModal from '../CalculationResultModal';
import BeamBendingCalculator from '../calculators/BeamBendingCalculator';
import ShaftTorsionCalculator from '../calculators/ShaftTorsionCalculator';
import BoltStrengthCalculator from '../calculators/BoltStrengthCalculator';
import MaterialQueryCalculator from '../calculators/MaterialQueryCalculator';
import GearCalculator from '../calculators/GearCalculator';
import SpringCalculator from '../calculators/SpringCalculator';
import BeltDriveCalculator from '../calculators/BeltDriveCalculator';
import PressureVesselCalculator from '../calculators/PressureVesselCalculator';
import KeyConnectionCalculator from '../calculators/KeyConnectionCalculator';
import WeldStrengthCalculator from '../calculators/WeldStrengthCalculator';
import ToleranceFitQuery from '../calculators/ToleranceFitQuery';

const CalculatorPage: React.FC = () => {
    const [modalResult, setModalResult] = useState<CalculationResult | null>(null);

    const handleCalculate = (result: CalculationResult) => {
        setModalResult(result);
    };

    const handleCloseModal = () => {
        setModalResult(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-violet-200 mb-2">工程计算器</h2>
            <p className="text-gray-400 mb-8">涵盖梁、轴、齿轮、螺栓等10+种专业计算工具</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BearingLifeCalculator onCalculate={handleCalculate} />
                <ShaftTorsionCalculator onCalculate={handleCalculate} />
                <BeamBendingCalculator onCalculate={handleCalculate} />
                <BoltStrengthCalculator onCalculate={handleCalculate} />
                <GearCalculator onCalculate={handleCalculate} />
                <SpringCalculator onCalculate={handleCalculate} />
                <BeltDriveCalculator onCalculate={handleCalculate} />
                <PressureVesselCalculator onCalculate={handleCalculate} />
                <KeyConnectionCalculator onCalculate={handleCalculate} />
                <WeldStrengthCalculator onCalculate={handleCalculate} />
                <ToleranceFitQuery onQuery={handleCalculate} />
                <UnitLengthConverter onConvert={handleCalculate} />
                <MaterialQueryCalculator onQuery={handleCalculate} />
            </div>

            <CalculationResultModal result={modalResult} onClose={handleCloseModal} />
        </div>
    );
};

export default CalculatorPage;