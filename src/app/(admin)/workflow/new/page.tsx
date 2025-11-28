"use client";

import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  WorkflowCreationValidation,
  workflowSchema,
} from "@/validationSchemas/workflow/workflowSchema";
import z from "zod";
import { useCreateWorkflow } from "@/hooks/api/useWorkflowQuery";
import { WorkflowPayload } from "@/types/workflow";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import LoaderButton from "@/components/common/loader-button";
import SuccessModal from "@/components/workflow/modal-successful";
import { useGetDepartmentsQuery } from "@/hooks/api/useSmartUserQuery";
import { DepartmentType } from "@/types/smartUserTypes";

export default function WorkFlowPage() {
  const [loader, setLoader] = useState(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const router = useRouter();
  const breadcrumbItems = [
    { label: "Approval Workflows", href: "/workflow" },
    { label: "Create New Workflow" },
  ];
  const [workflowId, setWorkflowId] = useState("");

  const createWorkflow = useCreateWorkflow();

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

  const goToNewWorkflow = () => {
    setSuccessModal(false);
    router.push(`/workflow-editor/${workflowId}`);
  };

  const form = WorkflowCreationValidation();

  const goBack = () => {
    router.back();
  };

  const isScopeDepartment = form.watch("scope");

  const onSubmit = async (values: z.infer<typeof workflowSchema>) => {
    setLoader(true);

    const apiPayload: WorkflowPayload = {
      name: values.name,
      description: values?.description,
      scope: {
        type: values.scope,
        value:
          values.scope === "department" ? (values.scopeValue as string) : "",
      },
    };

    createWorkflow.mutate(apiPayload, {
      onSuccess: (response) => {
        setWorkflowId(response.id);
        setLoader(false);
        setSuccessModal(true);
      },
      onError: (error) => {
        setLoader(false);
        toast.error(
          error instanceof Error ? error.message : "Failed to create workflow",
          {
            unstyled: true,
            position: "top-right",
            classNames: {
              toast:
                "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
              title: "text-[#E71D36]",
            },
          }
        );
      },
    });
  };

  return (
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="flex justify-between items-center py-[20px] px-[40px] bg-white">
        <PageBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="bg-white mt-1 p-8 min-h-screen">
        <div className="px-[12px]">
          <Button
            variant="ghost"
            className="group relative cursor-pointer !px-0 hover:bg-inherit"
            onClick={goBack}
          >
            <ArrowLeft
              color="#464646"
              className="translate-x-0 transition-all duration-500 ease-in-out group-hover:-translate-x-[0.9px]"
            />
            <span className="font-[family-name:var(--font-dm)] text-[#A9A9A9]">
              Back to workflows
            </span>
          </Button>

          <div className="mt-[24px]">
            <h4 className="font-semibold text-[24px] text-primary-gray">
              Create New Workflow
            </h4>
            <Form {...form}>
              <form className="mt-8" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-gray font-semibold text-[15px]">
                          Workflow Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Workflow Name"
                            {...field}
                            className="focus-visible:ring-0 h-[50px] rounded-[8px] border-[#cccccc]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 mt-[24px]">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-gray font-semibold text-[15px]">
                          Workflow Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter Description"
                            className="focus-visible:ring-0 resize-none h-[80px] rounded-[8px] border-[#cccccc]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2 mt-[24px]">
                  <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[15px] text-primary-gray font-semibold">
                          Scope
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full !h-[50px]">
                                <SelectValue placeholder="Select Scope" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="">
                              <SelectItem value="global">
                                Global (Everyone)
                              </SelectItem>
                              <SelectItem value="department">
                                Department
                              </SelectItem>
                              <SelectItem value="document">
                                Document Type
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isScopeDepartment === "department" && (
                  <div className="space-y-2 mt-[24px]">
                    <FormField
                      control={form.control}
                      name="scopeValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[15px] text-primary-gray font-semibold">
                            Select Department
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full !h-[50px]">
                                  <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="">
                                {departments?.map((department) => {
                                  return (
                                    <SelectItem
                                      value={department?.departmentName}
                                      key={department?.departmentId}
                                    >
                                      {department?.departmentName}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="space-y-2 mt-[48px] flex justify-end items-center gap-4">
                  <Button
                    variant="ghost"
                    className="text-brand-blue cursor-pointer"
                    type="button"
                  >
                    Save as Template
                  </Button>
                  <LoaderButton
                    buttonText="Create Workflow"
                    isLoading={loader}
                    disabled={loader}
                    className="bg-brand-blue hover:bg-brand-blue/90"
                  />
                </div>
              </form>
            </Form>
          </div>

          <SuccessModal
            isOpen={showSuccessModal}
            subTitle="Workflow Saved"
            description="Your workflow has been saved successfully"
            buttonText="Open Workflow Editor"
            handleClick={goToNewWorkflow}
          />
        </div>
      </div>
    </div>
  );
}
