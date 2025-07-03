
import React from 'react';
import { View, Text } from 'react-native';
import { Stage } from '../types';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { ClapperboardIcon } from './icons/ClapperboardIcon';

interface StepIndicatorProps {
  currentStage: Stage;
}

const steps = [
  { id: Stage.UPLOAD, name: '1. Process', icon: UploadCloudIcon },
  { id: Stage.SCRIPT, name: '2. Script', icon: FileTextIcon },
  { id: Stage.VIDEO, name: '3. Video', icon: ClapperboardIcon },
];

const Step: React.FC<{ step: any, stepIdx: number, currentStepIndex: number }> = ({ step, stepIdx, currentStepIndex }) => {
  const isCompleted = stepIdx < currentStepIndex;
  const isCurrent = stepIdx === currentStepIndex;

  let circleClasses = 'h-10 w-10 rounded-full items-center justify-center';
  let iconColor = '#64748b'; // text-gray-500
  
  if (isCompleted) {
    circleClasses += ' bg-indigo-500';
    iconColor = '#ffffff';
  } else if (isCurrent) {
    circleClasses += ' border-2 border-indigo-500 bg-gray-800';
    iconColor = '#818cf8'; // text-indigo-400
  } else {
    circleClasses += ' border-2 border-gray-700 bg-gray-900';
  }

  return (
    <View className="relative flex-1 items-center">
      <View className={circleClasses}>
        <step.icon width={24} height={24} color={iconColor} />
      </View>
      <Text className="absolute -bottom-6 text-xs font-inter-medium text-center text-gray-400">{step.name}</Text>
    </View>
  );
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStage }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStage);

  return (
    <View className="flex-row items-center w-full px-4 mb-4">
      {steps.map((step, stepIdx) => (
        <React.Fragment key={step.id}>
          <Step step={step} stepIdx={stepIdx} currentStepIndex={currentStepIndex} />
          {stepIdx < steps.length - 1 && (
             <View className={`flex-1 h-0.5 ${stepIdx < currentStepIndex ? 'bg-indigo-500' : 'bg-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

export default StepIndicator;
