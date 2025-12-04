"use-client";

import { GitMerge, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import dayjs from "dayjs";

export interface WorkflowTemplateCardProps {
  title: string;
  isNew: boolean;
  link: string;
  createdAt?: string;
  onclick?: () => void;
}

export default function WorkflowTemplateCard({
  title,
  isNew = false,
  createdAt,
  link,
}: WorkflowTemplateCardProps) {
  const router = useRouter();

  const goToNewWorkflow = () => {
    router.push(`${link}`);
  };

  const handleClick = () => {
    if (isNew) return goToNewWorkflow();
  };

  return (
    <div
      className={`mt-6 md:w-[250px] w-full p-[16px] border-1 rounded-[8px] border-[#CCCCCCCC] ${isNew && "cursor-pointer"}`}
      onClick={handleClick}
    >
      <div className="bg-[#F8FAFC] py-[30px]">
        <GitMerge strokeWidth={1} className="w-[36px] h-[36px] mx-auto" />
      </div>
      <div className="w-full mt-3 flex items-center justify-betweeen gap-3">
        <div className="w-full">
          <h6 className="font-semibold text-primary-gray text-[13px]">
            {title}
          </h6>
          <p className="text-[#A9A9A9] text-[12px] font-medium">
            {isNew
              ? "Start from scratch"
              : `Created ${dayjs(createdAt).format("MMM DD, YYYY")}`}
          </p>
        </div>
        {!isNew && (
          <div className="h-[24px] w-[24px] p-[10px] cursor-pointer">
            <Trash2 color="#FC5A5A" className="w-5 h-5 mx-auto" />
          </div>
        )}
      </div>
      {!isNew && (
        <Button
          className="bg-brand-blue w-full mt-4 hover:bg-brand-blue cursor-pointer"
          onClick={goToNewWorkflow}
        >
          Use Template
        </Button>
      )}
    </div>
  );
}
