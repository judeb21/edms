"use client";

import { Step } from "@/types/workflow";
import dayjs, { Dayjs } from "dayjs";
import { CheckCircle, Edit2, Trash2, X } from "lucide-react";
import utc from "dayjs/plugin/utc";
import calendar from "dayjs/plugin/calendar";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(calendar);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const StepOverviewPanel = ({
  step,
  onClose,
  onEdit,
  onDelete,
}: {
  step: Step;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  function formatDate(targetDate: Dayjs) {
    // dayjs.utc(selectedStep.deadline)
    const now = dayjs();
    // const targetDate = now.add(hours, "hour");

    const diffHours = targetDate.diff(now, "hour");

    // --- 1) Expired ---
    if (diffHours < 0) {
      return "expired";
    }

    // --- 2) Within 24 hours → “in 3 hours” ---
    if (diffHours < 24) {
      return targetDate.fromNow();
    }

    // --- 3) Exact day-based formatting ---
    const diffDays = targetDate.diff(now, "day");

    // 48 hours → “in 2 days”
    if (diffDays >= 1 && diffDays <= 6) {
      return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }

    // --- 4) Next week ---
    if (
      targetDate.isAfter(now.startOf("week").add(7, "day")) &&
      targetDate.isBefore(now.startOf("week").add(14, "day"))
    ) {
      return `Next ${targetDate.format("dddd")}`; // Next Monday, etc.
    }

    // --- 5) Fallback to calendar format ---
    return targetDate.calendar(null, {
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      nextWeek: "[Next] dddd",
      lastDay: "[Yesterday]",
      lastWeek: "[Last] dddd",
      sameElse: "MMM D",
    });
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Approval Step - {step.stepName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 px-3 space-y-6">
        <div className="shadow-lg rounded-[16px] py-[24px] px-[32px]">
          <h2 className="text-primary-gray text-[15px] mb-[12px] font-bold">
            Overview
          </h2>
          <div className="flex items-center mb-4 gap-2">
            <span className="text-[12px] font-medium text-[#A9A9A9] bg-[#F0F0F0] rounded-[8px] py-[8px] px-[12px]">
              Overview
            </span>
            {step?.configured && (
              <span className="px-[12px] py-[8px] bg-[#D2F7D8] text-[#10B981] rounded-[8px] text-[12px] flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Configured
              </span>
            )}
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#999999]">Step Name</span>
              <span className="text-primary-gray font-medium">
                {step.stepName}
              </span>
            </div>
            {step.createdAt && (
              <div className="flex justify-between">
                <span className="text-[#999999]">Created</span>
                <span className="text-primary-gray">
                  {dayjs(step?.createdAt).fromNow()}
                </span>
              </div>
            )}
            {step.updatedAt && (
              <div className="flex justify-between">
                <span className="text-[#999999]">Updated</span>
                <span className="text-primary-gray">
                  {dayjs(step?.updatedAt).fromNow()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="shadow-lg rounded-[16px] py-[24px] px-[32px]">
          <h4 className="text-primary-gray text-[15px] mb-[12px] font-semibold">
            Quick Stats
          </h4>
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#999999]">Approvers</span>
              <span className="text-primary-gray">
                {step.approverType === "RoleBased"
                  ? "Role-based"
                  : "Specific Users"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#999999]">Approval mode</span>
              <span className="text-primary-gray">
                {step.approverMode === "AllApprovers"
                  ? "All approvers must approve"
                  : "Anyone can approve"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#999999]">Deadline</span>
              <span className="text-primary-gray capitalize">
                {formatDate(dayjs.utc(step.deadline)) || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#999999]">Escalation</span>
              <span className="text-primary-gray">
                {step.enableEscalation ? "Enabled" : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="shadow-lg rounded-[16px] py-[24px] px-[32px]">
          <h4 className="text-[15px] font-semibold text-primary-gray mb-4">
            Quick Actions
          </h4>
          <div className="space-y-2">
            <button
              onClick={onEdit}
              className="cursor-pointer w-full flex items-center px-4 py-2 text-sm text-primary-gray hover:bg-gray-50 rounded border border-gray-200"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Step
            </button>
            <button
              onClick={onDelete}
              className="cursor-pointer w-full flex items-center px-4 py-2 text-sm text-[#FC5A5A] hover:bg-red-50 rounded border border-gray-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOverviewPanel;
