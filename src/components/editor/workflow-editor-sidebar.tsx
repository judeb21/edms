"use client";

import { Step } from "@/types/workflow";
import { CheckCircle, ChevronRight, GitMerge, Plus } from "lucide-react";
import { Button } from "../ui/button";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const WorkflowSidebar = ({
  steps,
  selectedStep,
  onAddStep,
  onSelectStep,
}: {
  steps: Step[];
  selectedStep: Step | null;
  onAddStep: () => void;
  onSelectStep: (step: Step) => void;
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="">
        <div className="flex items-center justify-between mb-4 bg-[#F6FAFC] p-4 py-[32px] border-b-1 border-[#D7E7EC]">
          <h3 className="font-semibold text-primary-gray">Workflow Steps</h3>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-8 p-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white border border-dashed border-primary-gray flex items-center justify-center">
              <GitMerge color="#CCCCCC" />
            </div>
            <p className="text-[18px] text-primary-gray mb-2 font-semibold">
              No Steps Yet
            </p>
            <p className="font-medium text-[14px] text-primary-gray mb-4">
              Click the button below to set your first approval step
            </p>
            <Button
              onClick={onAddStep}
              className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-brand-blue text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Approval Step
            </Button>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`p-3 border border-dashed border-[4px] rounded-lg cursor-pointer transition-colors ${
                  selectedStep?.id === step.id
                    ? "border-brand-blue bg-cyan-50"
                    : "border-[#D7E7EC] bg-white hover:border-[#D7E7EC]"
                }`}
                onClick={() => onSelectStep(step)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {step.stepName}
                  </span>
                  {step.configured && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[12px] text-primary-gray">
                    {step.approverType === "RoleBased"
                      ? "Role-based"
                      : "Specific Users"}
                  </span>
                  <span className="h-[8px] w-[8px] rounded bg-[#D9D9D9]"></span>
                  {step.deadline && (
                    <span className="text-[12px] text-primary-gray">
                      {dayjs.utc(step.deadline).format("YYYY-MM-DD")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowSidebar;
