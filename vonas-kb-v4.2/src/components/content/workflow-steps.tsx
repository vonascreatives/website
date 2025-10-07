import { CheckCircle, Circle, Clock } from 'lucide-react'

interface WorkflowStep {
  _type: 'workflowStep'
  stepNumber: number
  headline: string
  description: string
  duration?: string
  status?: 'pending' | 'in-progress' | 'completed'
}

interface WorkflowStepsProps {
  steps: WorkflowStep[]
}

export function WorkflowSteps({ steps }: WorkflowStepsProps) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const StatusIcon = step.status === 'completed' 
          ? CheckCircle 
          : step.status === 'in-progress' 
            ? Clock
            : Circle

        const statusColor = step.status === 'completed'
          ? 'text-green-600'
          : step.status === 'in-progress'
            ? 'text-yellow-600'
            : 'text-gray-400'

        return (
          <div key={index} className="flex gap-4 group">
            {/* Step Number and Status */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                {step.stepNumber}
              </div>
              <div className={`mt-2 ${statusColor}`}>
                <StatusIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {step.headline}
                </h3>
                {step.duration && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {step.duration}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}