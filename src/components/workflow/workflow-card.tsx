"use-client";

import { FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export interface WorkflowTemplateCardProps {
  title: string;
  isNew: boolean;
  link: string;
  onclick?: () => void;
}

export default function WorkflowTemplateCard({
  title,
  isNew = false,
  link,
  onclick,
}: WorkflowTemplateCardProps) {
  const router = useRouter();

  const goToNewWorkflow = () => {
    router.push(`${link}`);
  };

  return (
    <div
      className="cursor-pointer mt-6 md:w-[250px] w-full p-[16px] border-1 rounded-[8px] border-[#CCCCCCCC]"
      onClick={goToNewWorkflow}
    >
      <div className="bg-[#F8FAFC] py-[30px]">
        <FileText strokeWidth={1} className="w-[36px] h-[36px] mx-auto" />
      </div>
      <div className="w-full mt-3 flex items-center justify-betweeen gap-3">
        <div className="w-full">
          <h6 className="font-semibold text-primary-gray text-[13px]">
            {title}
          </h6>
          <p className="text-[#A9A9A9] text-[12px] font-medium">
            {isNew ? "Start from scratch" : `Created Jun 24, 2025`}
          </p>
        </div>
        {!isNew && (
          <div className="h-[24px] w-[24px] p-[10px] cursor-pointer">
            <Trash2 color="#FC5A5A" className="w-4 h-4 mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
}
