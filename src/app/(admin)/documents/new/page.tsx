"use client";

import LoaderButton from "@/components/common/loader-button";
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
import SuccessModal from "@/components/workflow/modal-successful";
import {
  CircleX,
  CloudAlert,
  CloudUpload,
  Eye,
  Info,
  Repeat,
  Trash,
} from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { API_BASE_URL } from "@/lib/apiClient";
import { useGetWorkflows } from "@/hooks/api/useWorkflowQuery";
import { useGetDepartmentsQuery } from "@/hooks/api/useSmartUserQuery";
import { DepartmentType } from "@/types/smartUserTypes";
import { WorkflowTypes } from "@/types/workflow";
import { DocumentFormData } from "@/types/documents";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type UploadFile = {
  file: File;
  previewUrl: string;
  uploadedUrl?: string;
  progress: number;
  uploading: boolean;
  error: boolean;
};

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
];

export default function TemplatesPage() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [successModal, showSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [formData, setFormData] = useState<DocumentFormData>({
    title: "",
    description: "",
    category: "",
    department: "",
    tags: [],
    workflowAdded: false,
    workflow: "",
  });
  const [isDragOver, setIsDragOver] = useState(false);
  // eslint-disable-next-line
  const [errors, setErrors] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Upload Document" },
  ];

  const { data } = useGetWorkflows();

  const workflows = useMemo(() => {
    const sortedData =
      data?.sort((a, b) =>
        a.name.trim().localeCompare(b.name.trim(), undefined, {
          sensitivity: "base",
        })
      ) ?? ([] as WorkflowTypes[]);
    return sortedData;
  }, [data]);

  const { data: departmentsData } = useGetDepartmentsQuery();

  const departments = useMemo(() => {
    const sortedData =
      departmentsData?.data?.sort((a, b) =>
        a.departmentName
          .trim()
          .localeCompare(b.departmentName.trim(), undefined, {
            sensitivity: "base",
          })
      ) ?? ([] as DepartmentType[]);

    return sortedData;
  }, [departmentsData]);

  const uploadDocument = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
      showSuccessModal(true);
    }, 500);
  };

  const goToDocuments = () => {
    router.push("/documents");
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);
  const formattedSize = formatFileSize(totalSize);
  const maxFormatted = formatFileSize(MAX_FILE_SIZE);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fileTransfer = e.dataTransfer.files[0];
    setIsDragOver(false);
    const files = Array.from([fileTransfer]);

    if (files.length === 0) return;

    const validFiles: UploadFile[] = [];

    let runningSize = totalSize;
    const errors = [];

    for (const file of files) {
      // Reject file invalid types
      if (!ACCEPTED_TYPES.includes(file.type)) {
        const err = `${file.name} is not an accepted file format.`;
        alert(`${file.name} is not an accepted file format.`);
        errors.push(err);
        continue;
      }

      // Reject files exceeding size limit
      if (runningSize + file.size > MAX_FILE_SIZE) {
        const error = `${file.name} skipped. Total size would exceed 10MB`;
        alert(`${file.name} skipped. Total size would exceed 10MB.`);
        errors.push(error);
        continue;
      }

      runningSize += file.size;

      const uploadFile: UploadFile = {
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        uploading: true,
        error: false,
      };

      validFiles.push(uploadFile);
    }
    setErrors(errors);

    if (validFiles.length > 0) {
      // Set state first
      setFiles((prev) => {
        const updated = [...prev, ...validFiles];

        // Trigger upload immediately for each new file
        validFiles.forEach((fileObj) => {
          uploadSingleFile(fileObj, (updatedFile) => {
            setFiles((curr) =>
              curr.map((f) =>
                f.file === fileObj.file ? { ...f, ...updatedFile } : f
              )
            );
          });
        });

        return updated;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFilesSize = selectedFiles.reduce(
      (acc, file) => acc + file.size,
      0
    );
    const validFiles: UploadFile[] = [];

    let runningSize = totalSize;

    if (totalSize + newFilesSize > MAX_FILE_SIZE) {
      alert(`Total file size exceeds 10MB. Selected files not added.`);
      return;
    }

    if (selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      if (runningSize + file.size > MAX_FILE_SIZE) {
        alert(`${file.name} skipped. Total size would exceed 10MB.`);
        continue;
      }

      runningSize += file.size;

      const uploadFile: UploadFile = {
        file,
        previewUrl: URL.createObjectURL(file),
        progress: 0,
        uploading: true,
        error: false,
      };

      validFiles.push(uploadFile);
    }

    if (validFiles.length > 0) {
      // Set state first
      setFiles((prev) => {
        const updated = [...prev, ...validFiles];

        // Trigger upload immediately for each new file
        validFiles.forEach((fileObj) => {
          uploadSingleFile(fileObj, (updatedFile) => {
            setFiles((curr) =>
              curr.map((f) =>
                f.file === fileObj.file ? { ...f, ...updatedFile } : f
              )
            );
          });
        });

        return updated;
      });
    }
  };

  const uploadSingleFile = async (
    fileData: UploadFile,
    updateCallback: (updates: Partial<UploadFile>) => void
  ) => {
    const formData = new FormData();
    formData.append("file", fileData.file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/document/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            updateCallback({ progress: percent });
          },
        }
      );

      updateCallback({
        uploading: false,
        progress: 100,
        uploadedUrl: res.data.url,
      });
    } catch {
      updateCallback({ uploading: false, error: true });
    }
  };

  const retryUpload = (file: UploadFile) => {
    // Reset UI to show progress bar
    setFiles((curr) =>
      curr.map((f) =>
        f.file === file.file
          ? { ...f, error: false, uploading: true, progress: 0 }
          : f
      )
    );
    uploadSingleFile(file, (updates) => {
      setFiles((curr) =>
        curr.map((f) => (f.file === file.file ? { ...f, ...updates } : f))
      );
    });
  };

  const removeFile = (file: UploadFile) => {
    URL.revokeObjectURL(file.previewUrl);
    setFiles((curr) => curr.filter((f) => f.file !== file.file));

    // Reset input so same file can be chosen again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + "" + sizes[i];
  }

  // eslint-disable-next-line
  const [suggestions, setSuggestions] = useState<string[]>([
    "Urgent",
    "Finance",
    "HR",
    "Marketing",
    "Client",
  ]);

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Filter suggestions as user types
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagInput(val);

    if (val.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions.filter(
      (s) =>
        s.toLowerCase().includes(val.toLowerCase()) &&
        !formData?.tags?.includes(s)
    );
    setFilteredSuggestions(filtered);
  };

  // Create tag on Space / Enter / Comma
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput.trim());
    }

    // Delete last tag when input empty and backspace pressed
    if (
      e.key === "Backspace" &&
      tagInput === "" &&
      formData?.tags?.length > 0
    ) {
      removeTag(formData?.tags?.length - 1);
    }
  };

  const addTag = (tag: string) => {
    if (!tag) return;
    const normalizedTag = tag.trim();

    // Prevent duplicates (case-insensitive)
    if (
      formData.tags.some((t) => t.toLowerCase() === normalizedTag.toLowerCase())
    )
      return;

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, normalizedTag],
    }));

    setTagInput("");
    setFilteredSuggestions([]);
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

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
          <div className="shadow-md p-[24px] rounded-sm">
            <div
              className={`flex items-center justify-center flex-col border-dashed border-1 border-brand-blue bg-[#EFFBFF] py-[50px] rounded-[12px] ${
                isDragOver
                  ? "border-brand-blue bg-[#EFFBFF]"
                  : "border-brand-blue bg-[#EFFBFF]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex items-center gap-[8px] flex-col justify-center">
                <div className="w-[40px] h-[40px] rounded-full bg-[#F0F2F5] relative flex items-center justify-center">
                  <CloudUpload className="text-brand-blue" />
                </div>
                <div className="text-center mt-[12px]">
                  <h6
                    className="text-[14px] text-primary-gray font-regular"
                    onClick={handleFileButtonClick}
                  >
                    Drag and drop your file here
                  </h6>
                  <p className="text-[12px] text-primary-gray">
                    Supports: PDF, DOCX, XLSX, PPT, JPG, PNG. (Max Size: 10MB)
                  </p>
                </div>
              </div>
              <Input
                type="file"
                ref={fileInputRef}
                accept="
                    application/pdf,
                    application/msword,
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                    application/vnd.ms-excel,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                    application/vnd.ms-powerpoint,
                    application/vnd.openxmlformats-officedocument.presentationml.presentation,
                    image/jpeg,
                    image/png
                "
                className="hidden"
                onChange={handleFileChange}
              />
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
                  onClick={handleFileButtonClick}
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {files.length > 0 ? (
              <ul className="space-y-3 mt-[16px]">
                <span className="text-sm text-gray-700">
                  {formattedSize} / {maxFormatted} used
                </span>
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="p-3 border rounded bg-gray-50 space-y-2"
                  >
                    <div className="flex justify-between text-sm items-center">
                      <span className="font-medium truncate font-[family-name:var(--font-dm)] text-[14px]">
                        {f.file.name}
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeFile(f)}
                        className="text-red-600 hover:underline cursor-pointer bg-transparent hover:bg-transparent text-center h-[36px] font-[family-name:var(--font-dm)] text-[14px] hover:text-red-600 shadow-none"
                      >
                        <Trash />
                        Delete
                      </Button>
                    </div>

                    {f.uploading && (
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <Progress
                          value={f.progress}
                          className={`bg-gray-200 ${
                            f.uploadedUrl
                              ? "[&>div]:bg-[#0EA9A3] [&>div]:rounded-full"
                              : f.error
                                ? "[&>div]:bg-[#E71D36]"
                                : "[&>div]:bg-[#0EA9A3]"
                          }`}
                        />
                      </div>
                    )}

                    {f.error && (
                      <div className="text-sm text-[#E71D36] flex items-center justify-between">
                        <div className="gap-[10px] flex items-center">
                          <CloudAlert className="text-[#F3A218]" />
                          Upload failed.
                        </div>

                        <Button
                          type="button"
                          className="!text-[#464646] hover:underline bg-transparent hover:bg-transparent text-center h-[36px] text-[14px] hover:text-[#464646] cursor-pointer shadow-none"
                          onClick={() => retryUpload(f)}
                        >
                          <Repeat />
                          Retry
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex gap-2 items-center mt-[16px]">
                <Info color="#AD8434" size={16} />
                <span className="text-[#AD8434] text-[14px]">
                  Kindly note that once you upload this document, the file will
                  be submitted automatically
                </span>
              </div>
            )}
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
            <Label>Tags</Label>
            <div className="flex flex-wrap items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-0 focus-within:ring-offset-0 transition h-auto min-h-[50px]">
              {/* Tags */}
              {/* Use Space, Enter, or Comma to create tags */}
              {formData?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-[#E2F5FC] text-brand-blue px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-red-600 cursor-pointer"
                  >
                    <CircleX size={14} strokeWidth={1} />
                  </button>
                </span>
              ))}

              {/* Input */}
              <Input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                placeholder="Add Tags"
                className="flex-1 min-w-[120px] border-none outline-none p-0 focus-visible:ring-0 text-sm shadow-none"
              />
            </div>

            {/* Suggestions dropdown */}
            {filteredSuggestions.length > 0 && (
              <ul className="border rounded-md mt-1 bg-white shadow-md max-h-40 overflow-auto text-sm">
                {filteredSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-2 cursor-pointer hover:bg-[#E6F4F3]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2 mt-[36px]">
            <Label>Department</Label>
            <Select>
              <SelectTrigger className="w-full !h-[50px]">
                <SelectValue placeholder="Select Departments" />
              </SelectTrigger>
              <SelectContent className="">
                {departments?.map((department) => (
                  <SelectItem
                    value={department.departmentName}
                    key={department.departmentId}
                  >
                    {department.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 mt-[36px]">
            <Label>Add Workflow</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="workflow-mode" className="text-[#A9A9A9]">
                Click on the toggle to add workflow
              </Label>
              <Switch
                id="workflow-mode"
                checked={formData.workflowAdded}
                onCheckedChange={(e) =>
                  setFormData({ ...formData, workflowAdded: e })
                }
              />
            </div>

            {formData.workflowAdded && (
              <div className="space-y-2 mt-[16px]">
                <Label>Select Workflow</Label>
                <Select>
                  <SelectTrigger className="w-full !h-[50px]">
                    <SelectValue placeholder="Select Workflow" />
                  </SelectTrigger>
                  <SelectContent className="">
                    {workflows?.map((workflow) => (
                      <SelectItem value={workflow.id} key={workflow.id}>
                        {workflow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mt-[30px] flex justify-end items-center gap-6">
            <Button
              variant={"ghost"}
              className="hover:bg-white text-brand-blue hover:text-brand-blue"
            >
              <Eye />
              Preview
            </Button>
            <LoaderButton
              isLoading={loader}
              buttonText="Upload Document"
              className="bg-brand-blue hover:bg-brand-blue"
              nextStep={uploadDocument}
            />
          </div>
        </form>

        {/* Successfully approved document */}
        <SuccessModal
          isOpen={successModal}
          description={
            "The Document “Employment Contract” has been uploaded successfully"
          }
          buttonText="Done"
          buttonClass="-translate-y-[20px]"
          handleClick={goToDocuments}
        />
      </div>
    </div>
  );
}
