"use client";

import { Info, X } from "lucide-react";

const GettingStartedPanel = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="w-80 bg-white border-l border-gray-200">
      <div className="flex items-center justify-between mb-4 bg-[#F6FAFC] p-4 py-[32px] border-b-1 border-[#D7E7EC]">
        <h3 className="font-semibold text-primary-gray">Getting Started</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-2 p-6 rounded-lg">
        <div className="border border-[#D7E7EC] p-[24px]">
          <div className="w-10 h-10 bg-brand-blue rounded flex items-center justify-center text-white mb-3">
            <Info color="white" className="w-6 h-6" />
          </div>
          <h4 className="font-semibold text-primary-gray mb-2 text-[14px]">
            Build Your Workflow
          </h4>
          <p className="text-[12px] text-primary-gray font-medium">
            Add approval steps from the right sidebar. Each step represents a
            point where someone needs to review and approve.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <h4 className="font-medium text-gray-900">Quick Tips</h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-brand-blue rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Click Add Approval Step to begin
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-brand-blue rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">Click any step to configure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedPanel;
