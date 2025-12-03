"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Info } from "lucide-react";
// import { useRouter } from "next/navigation";

export default function TemplatesPage() {
//   const router = useRouter();
  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Upload Document" },
  ];

  return (
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="flex justify-between items-center py-[20px] px-[40px] bg-white">
        <PageBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="bg-white mt-1 p-8 min-h-screen">
        <h4 className="font-semibold text-[20px] text-primary-gray">
          Upload Document
        </h4>
        <p className="mt-[8px] text-[14px] text-primary-gray">
          {`Securely add new files by selecting documents from your computer,
          providing key details such as title, department and the contributor's
          name.`}
        </p>

        <form className="my-[30px] font-[family-name:var(--font-dm)]">
          <div className="shadow-md p-[24px]">
            <div className="flex items-center justify-center flex-col border-dashed border-1 border-brand-blue bg-[#EFFBFF] py-[50px] rounded-[12px]">
              <div className="flex items-center gap-[8px] flex-col justify-center">
                <div className="w-[40px] h-[40px] rounded-full bg-[#F0F2F5] relative flex items-center justify-center">
                  <CloudUpload className="text-[#475367]" />
                </div>
                <div className="text-center mt-[12px]">
                  <h6
                    className="text-[14px] text-[#0EA9A3] font-[700] cursor-pointer"
                    //   onClick={handleFileButtonClick}
                  >
                    Click to Upload
                  </h6>
                  <p className="text-[12px] text-primary-gray">
                    Supports: PDF, DOCX, XLSX, PPT, JPG, PNG. (Max Size: 10MB)
                  </p>
                </div>
              </div>
              <div className="my-6 flex items-center justify-center w-full">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="mx-4 text-[12px] text-[#98A2B3]">OR</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>
              <div>
                <Button
                  type="button"
                  role="button"
                  className="bg-[#EFFBFF] hover:bg-[#EFFBFF] text-center h-[40px] text-[14px] font-medium border-brand-blue border-1 text-brand-blue rounded-[4px]"
                  // onClick={handleFileButtonClick}
                >
                  Browse Files
                </Button>
              </div>
            </div>
            <div className="flex gap-2 items-center mt-[16px]">
              <Info color="#AD8434" size={16} />
              <span className="text-[#AD8434] text-[14px]">
                Kindly note that once you upload this document, the file will be
                submitted automatically
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-[36px]">
            <Label>Document Title</Label>
            <Input
              placeholder="Add Document Title"
              className="focus-visible:ring-0 h-[50px] rounded-[8px] border-[#cccccc]"
            />
          </div>

          <div className="space-y-2 mt-[36px]">
            <Label>Document Description</Label>
            <Textarea
              placeholder="Add Document Description"
              className="focus-visible:ring-0 resize-none h-30 rounded-[8px] border-[#cccccc]"
            />
          </div>

          <div className="space-y-2 mt-[36px]">
            <Label>Category</Label>
            <Input
              placeholder="Add Category"
              className="focus-visible:ring-0 h-[50px] rounded-[8px] border-[#cccccc]"
            />
          </div>

          <div className="space-y-2 mt-[36px]">
            <Label>Department</Label>
            <Select>
              <SelectTrigger className="w-full !h-[50px]">
                <SelectValue placeholder="Select Departments" />
              </SelectTrigger>
              <SelectContent className="">
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 mt-[36px]">
            <Label>Add Workflow</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="workflow-mode" className="text-[#A9A9A9]">
                Click on the toggle to add workflow
              </Label>
              <Switch id="workflow-mode" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
