"use client";
import { Step } from "@/types/workflow";
import dayjs from "dayjs";
import {
  CheckCircle,
  ChevronDown,
  CirclePlay,
  Clock4,
  FileCheckCorner,
  FileText,
  GitMerge,
  Plus,
  Users,
} from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import utc from "dayjs/plugin/utc";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const WorkflowCanvas = ({
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
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 bg-[#ffffff] p-4 py-[32px] border-b-1 border-[#D7E7EC]">
        <h3 className="font-semibold text-primary-gray text-[16px]">
          Workflow Editor
        </h3>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center space-y-1">
            {/* Start Node */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-blue flex items-center justify-center text-white">
                <CirclePlay className="w-8 h-8" />
              </div>
              <p className="mt-2 text-[15px] font-medium text-brand-blue uppercase">
                START
              </p>
            </div>

            <WorkflowArrow />

            {/* Steps */}
            {steps.map((step, index) => (
              <Fragment key={step.id}>
                <WorkflowStepNode
                  step={step}
                  isSelected={selectedStep?.id === step.id}
                  onSelect={() => onSelectStep(step)}
                />
                {index < steps.length - 1 && <WorkflowArrow />}
                {index === steps.length - 1 && steps.length < 4 && (
                  <WorkflowArrow />
                )}
              </Fragment>
            ))}

            {/* Empty State */}
            {steps.length === 0 && (
              <div className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <GitMerge className="mx-auto mb-3" size={64} color="#CCCCCC" />
                <p className="text-primary-gray mb-2 text-sm font-medium">
                  Your first step will appear here
                </p>
                <p className="text-sm font-medium text-primary-gray mb-4">
                  Add a step using the sidebar
                </p>
              </div>
            )}

            {/* Add Step Button */}
            {steps.length < 4 && (
              <button
                onClick={onAddStep}
                className="w-12 h-12 rounded-full border border-dashed border-[#464646] flex items-center justify-center hover:border-brand-blue transition-colors"
              >
                <Plus className="w-6 h-6" color="#464646" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Workflow Arrow Component
const WorkflowArrow = () => (
  <div className="flex flex-col items-center">
    <div className="h-2 w-2 rounded bg-[#464646] rotate-45 transform translate-y-[2px]"></div>
    <div className="w-0.5 h-8 bg-[#464646]"></div>
    <div className="">
      <ChevronDown
        className="h-4 w-4 transform translate-y-[-10px]"
        color="#464646"
      />
    </div>
  </div>
);

// Workflow Step Node Component
const WorkflowStepNode = ({
  step,
  isSelected,
  onSelect,
}: {
  step: Step;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <div
      className={`w-full max-w-md border-dashed rounded-lg p-6 cursor-pointer transition-all ${
        isSelected
          ? "border-[#D7E7EC] border-2 bg-[#F6FDFF] shadow-lg"
          : step.configured
          ? "border-[#D7E7EC] border-4 bg-[#F6FDFF] hover:border-[#D7E7EC] shadow-lg"
          : "border-dashed border-gray-300 bg-white hover:border-gray-400"
      }`}
      onClick={onSelect}
    >
      {step.configured && (
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {step.stepName}
          </h3>
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
      )}

      {step.configured ? (
        <div className="space-y-2">
          <div className="flex items-center gap-[12px] text-sm">
            <span className="flex items-center px-3 py-2 bg-[#FFF6E5] text-[#AD8434] rounded-[20px] text-[16px] gap-[8px]">
              <Users color="#AD8434" size={16} />
              {step.approverType === "RoleBased"
                ? "Role-based"
                : "Specific Users"}
            </span>
            {step.deadline && (
              <span className="px-3 py-2 bg-blue-100 text-brand-blue rounded-[20px] text-[16px] flex items-center gap-[8px]">
                <Clock4 size={16} />
                {dayjs.utc(step.deadline).format("YYYY-MM-DD")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="px-3 py-2 bg-[#F6ECFF] text-[#A565DD] rounded-[20px] text-[16px] flex items-center gap-[8px]">
              <FileCheckCorner color="#A565DD" size={16} />
              {step.approverMode === "AllApprovers"
                ? "All approvers must approve"
                : "Anyone can approve"}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <FileText
            strokeWidth={1.5}
            size={32}
            color="#0284B2"
            className="mx-auto mb-2"
          />
          <p className="text-sm text-primary-gray">
            Fill in the form on the right sidebar to complete this step.
          </p>
          <p className="text-sm text-primary-gray">
            Your workflow will appear here as you build it
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkflowCanvas;
