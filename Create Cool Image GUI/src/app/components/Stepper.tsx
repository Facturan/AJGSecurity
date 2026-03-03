import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex items-center gap-3">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step.completed
                  ? 'bg-blue-600 text-white'
                  : currentStep === step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </div>
            
            {/* Label */}
            <span
              className={`text-sm font-medium ${
                currentStep === step.id || step.completed
                  ? 'text-blue-900'
                  : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${
                step.completed ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
