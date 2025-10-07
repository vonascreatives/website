import { workflowSteps, type WorkflowStep } from '@/data/knowledge-base-data';

interface StepCounterProps {
  showSteps?: boolean;
}

export function StepCounter({ showSteps = true }: StepCounterProps) {
  if (!showSteps) return null;

  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const totalSteps = workflowSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;


  return (
    <div className="mb-8">
      
      <div className="space-y-4">
        {workflowSteps.map((step, index) => (
          <div 
            key={step.id} 
            className="flex items-start space-x-3"
            data-testid={`step-item-${step.id}`}
          >
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-600 font-medium">
              {index + 1}
            </span>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1" data-testid={`step-title-${step.id}`}>
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm" data-testid={`step-description-${step.id}`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
