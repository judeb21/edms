"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetUserInfinite } from "@/hooks/api/useSmartUserQuery";
import dayjs from "dayjs";
import {
  ConditionsType,
  Step,
  WorkFlowConfigurationPayload,
  WorkflowRetrievedSteps,
  WorkflowStatus,
  WorkflowUserType,
} from "@/types/workflow";
import {
  useActivateWorkflow,
  useConfigureWorkflow,
  useDeactivateWorkflow,
  useGetConfiguredWorkflowSteps,
  useValidateWorkflow,
} from "@/hooks/api/useWorkflowQuery";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import SuccessModal from "@/components/workflow/modal-successful";
import WorkflowHeader from "@/components/editor/workflow-editor-header";
import WorkflowSidebar from "@/components/editor/workflow-editor-sidebar";
import GettingStartedPanel from "@/components/editor/get-started-panel";
import StepOverviewPanel from "@/components/editor/step-overview-panel";
import StepEditFormPanel from "@/components/editor/step-edit-panel";
import ValidationErrorsModal from "@/components/editor/validation-modal";
import WorkflowCanvas from "@/components/editor/workflow-canvas";

interface FormData {
  id: string;
  stepName: string;
  approverType: "RoleBased" | "SpecificUsers";
  role: string;
  users: WorkflowUserType[];
  approverMode: "AllApprovers" | "Anyone";
  deadline: string;
  enableEscalation: "yes" | "no";
  escalationUsers: WorkflowUserType[];
  conditions?: ConditionsType;
}

const WorkflowEditor = () => {
  const router = useRouter();
  const params = useParams();
  const [loader, setLoader] = useState(false);
  const [validationLoader, setValidationLoader] = useState(false);
  const [activationLoader, setActivationLoader] = useState(false);
  const [deactivateLoader, setDeactivateLoader] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showGettingStarted, setShowGettingStarted] = useState<boolean>(true);
  const [search, setSearch] = React.useState("");
  const [stepIsSaved, setSavedStep] = useState<boolean>(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [deactivatedaModal, setDeactivatedaModal] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);

  const configureWorkflow = useConfigureWorkflow(params.id as string);

  // validate workflow mutation
  const validateWorkflows = useValidateWorkflow();

  //Activate workflow mutation
  const activateWorkflows = useActivateWorkflow(params.id as string);

  //Deactivate workflow
  const deactivateWorkflows = useDeactivateWorkflow(params.id as string);

  const [formData, setFormData] = useState<FormData>({
    id: "",
    stepName: "",
    approverType: "RoleBased",
    role: "",
    users: [] as WorkflowUserType[],
    approverMode: "AllApprovers",
    deadline: "",
    enableEscalation: "yes",
    escalationUsers: [] as WorkflowUserType[],
    conditions: {
      department: "",
      flowToRole: "",
    },
  });

  const {
    data: userData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserInfinite(search);

  const { data: configureStepData, isLoading } = useGetConfiguredWorkflowSteps(
    params.id as string
  );

  const configureSteps: WorkflowRetrievedSteps[] = React.useMemo(() => {
    return configureStepData?.steps as WorkflowRetrievedSteps[];
  }, [configureStepData, isLoading]);

  useEffect(() => {
    const updatedSteps: Step[] = configureSteps?.map((step, index) => {
      return {
        ...step,
        id: `step-${index + 1}`,
        order: index + 1,
        name: step.stepName,
        approverType: step.approvalType,
        role: step.role,
        users: step.approvalType === "SpecificUsers" ? step.users : [],
        approverMode: step.approverMode,
        deadline: dayjs.utc(step.deadline).endOf("day").toISOString(),
        enableEscalation: step.enableEscalation,
        escalationUsers: step.enableEscalation ? step.escalationUsers : [],
        conditions: step.conditions,
        configured: true,
      };
    });

    setSteps(updatedSteps?.length ? updatedSteps : []);
  }, [configureSteps]);

  const addStep = (): void => {
    if (steps.length >= 4) {
      alert("Maximum of 4 steps allowed");
      return;
    }

    setSavedStep(false);

    const newStep: Step = {
      id: `step-${steps.length + 1}`,
      order: steps.length + 1,
      stepName: `Step ${steps.length + 1}`,
      configured: false,
      approverType: "RoleBased",
      role: "",
      approverMode: "AllApprovers",
      deadline: "",
      users: [],
      enableEscalation: true,
      escalationUsers: [],
      conditions: [],
    };

    setSteps([...steps, newStep]);
    setSelectedStep(newStep);
    setIsEditing(true);
    setShowGettingStarted(false);
    setValidated(false);

    setFormData({
      id: `step-${steps.length + 1}`,
      stepName: newStep.stepName,
      approverType: "RoleBased",
      role: "",
      approverMode: "AllApprovers",
      deadline: "",
      users: [],
      enableEscalation: "yes",
      escalationUsers: [],
    });
  };

  const saveStep = (): void => {
    if (!formData.stepName.trim()) {
      toast.warning("Step name is required", {
        unstyled: false,
        position: "top-right",
        // classNames: {
        //   toast:
        //     "bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        //   title: "text-[#E71D36]",
        // },
      });
      return;
    }

    if (formData.approverType === "RoleBased" && !formData.role) {
      toast.warning("Please select a role", {
        unstyled: false,
        position: "top-right",
        // classNames: {
        //   toast:
        //     "bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        //   title: "text-[#E71D36]",
        // },
      });
      return;
    }

    if (formData.approverType === "SpecificUsers" && !formData.users.length) {
      toast.warning("Please select a user", {
        unstyled: false,
        position: "top-right",
        // classNames: {
        //   toast:
        //     "bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        //   title: "text-[#E71D36]",
        // },
      });
      return;
    }

    if (
      formData.enableEscalation === "yes" &&
      !formData.escalationUsers.length
    ) {
      toast.warning("Please select a users to escalate to", {
        unstyled: false,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
          title: "text-[#E71D36]",
        },
      });
      return;
    }

    if (!selectedStep) return;

    setLoader(true);

    const updatedSteps = steps.map((step) => {
      if (step.id === selectedStep.id) {
        return {
          ...step,
          stepName: formData.stepName,
          approvalType: formData.approverType,
          role: formData.approverType === "SpecificUsers" ? "" : formData.role,
          users:
            formData.approverType === "SpecificUsers" ? formData.users : [],
          approverMode: formData.approverMode,
          deadline: dayjs.utc(formData.deadline).endOf("day").toISOString(),
          enableEscalation: formData.enableEscalation === "yes" ? true : false,
          escalationUsers:
            formData.enableEscalation === "yes" ? formData.escalationUsers : [],
          conditions:
            formData.conditions?.department?.trim() !== ""
              ? [formData.conditions as ConditionsType]
              : [],
          // configured: true,
        };
      }
      return step;
    });

    const payload: WorkFlowConfigurationPayload = {
      steps: updatedSteps,
    };

    configureWorkflow.mutate(payload, {
      onSuccess: (response) => {
        setIsEditing(false);
        setSelectedStep(null);
        setValidated(false);
        setLoader(false);
        setSavedStep(true);

        // console.log("Response", response);
        const responseSteps = steps.map((step) => {
          if (step.id === selectedStep.id) {
            return {
              ...step,
              name: formData.stepName,
              approverType: formData.approverType,
              role:
                formData.approverType === "SpecificUsers" ? "" : formData.role,
              users:
                formData.approverType === "SpecificUsers" ? formData.users : [],
              approverMode: formData.approverMode,
              deadline: dayjs.utc(formData.deadline).endOf("day").toISOString(),
              enableEscalation:
                formData.enableEscalation === "yes" ? true : false,
              escalationUsers:
                formData.enableEscalation === "yes"
                  ? formData.escalationUsers
                  : [],
              conditions:
                formData.conditions?.department?.trim() !== ""
                  ? [formData.conditions as ConditionsType]
                  : [],
              configured: response?.status === "Configured" ? true : false,
              createdAt: response?.createdAt,
              updatedAt: response?.updateAt,
            };
          }
          return step;
        });

        setSteps(responseSteps);
      },
      onError: (error) => {
        setLoader(false);
        setSavedStep(false);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to configure workflow",
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

  const editStep = (step: Step): void => {
    setSelectedStep(step);
    setIsEditing(true);
    setFormData({
      id: `step-${step.id}`,
      stepName: step.stepName,
      approverType: step.approverType,
      role: step.role,
      approverMode: step.approverMode,
      deadline: dayjs.utc(step.deadline).format("YYYY-MM-DD"),
      users: step.users,
      enableEscalation: step.enableEscalation ? "yes" : "no",
      escalationUsers: step.escalationUsers,
      conditions: step?.conditions?.length
        ? step?.conditions[0]
        : {
            department: "",
            flowToRole: "",
          },
    });
  };

  const deleteStep = (stepId: string): void => {
    setSteps(steps.filter((s) => s.id !== stepId));
    if (selectedStep?.id === stepId) {
      setSelectedStep(null);
      setIsEditing(false);
    }
    setValidated(false);
  };

  const validateWorkflow = (): void => {
    const errors: string[] = [];

    const updatedSteps = steps.map((step) => {
      if (step.id === selectedStep?.id) {
        return {
          ...step,
          stepName: formData.stepName,
          approverType: formData.approverType,
          role: formData.approverType === "SpecificUsers" ? "" : formData.role,
          users:
            formData.approverType === "SpecificUsers" ? formData.users : [],
          approverMode: formData.approverMode,
          deadline: dayjs.utc(formData.deadline).endOf("day").toISOString(),
          enableEscalation: formData.enableEscalation === "yes" ? true : false,
          escalationUsers:
            formData.enableEscalation === "yes" ? formData.escalationUsers : [],
          conditions:
            !formData.conditions ||
            formData.conditions?.department?.trim() === ""
              ? []
              : [formData.conditions as ConditionsType],
          // configured: true,
        };
      }
      return step;
    });

    setSteps(updatedSteps);

    if (steps.length === 0) {
      errors.push("At least one step is required");
    }

    steps.forEach((step, index) => {
      // if (!step.configured) {
      //   errors.push(`Step ${index + 1} is not configured`);
      // }
      if (!step.stepName.trim()) {
        errors.push(`Step ${index + 1} has no name`);
      }
      if (step.approverType === "RoleBased" && !step.role) {
        errors.push(`Step ${index + 1} has no role selected`);
      }
      if (!step.deadline) {
        errors.push(`Step ${index + 1} has no deadline set`);
      }
      if (dayjs(step.deadline) < dayjs(new Date())) {
        errors.push(`Step ${index + 1} deadline can not be in the past`);
      }
      if (step.enableEscalation && step.escalationUsers.length === 0) {
        errors.push(
          `Step ${index + 1} has escalation enabled but no users selected`
        );
      }
    });

    setValidationErrors(errors);

    if (errors.length === 0) {
      setValidationLoader(true);
      const payload = {
        steps: steps,
      };
      validateWorkflows.mutate(payload, {
        onSuccess: () => {
          setIsEditing(true);
          setValidated(true);
          setValidationLoader(false);
          setValidationErrors([]);
          toast.success("Workflow successfully validated", {
            unstyled: false,
            position: "top-right",
            classNames: {
              toast:
                "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
              title: "text-[#E71D36]",
            },
          });
        },
        onError: (error) => {
          setLoader(false);
          setValidationErrors(errors);
          setIsEditing(true);
          setValidated(false);
          setValidationLoader(false);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to validate workflow",
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
    } else {
      setValidated(false);
      toast.warning(
        `Validation failed with ${errors.length} error(s). Please check the details.`,
        {
          unstyled: false,
          position: "top-right",
          classNames: {
            toast:
              "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
            title: "text-[#E71D36]",
          },
        }
      );
    }
  };

  const activateWorkflow = (): void => {
    setActivationLoader(true);
    activateWorkflows.mutate(params?.id as string, {
      onSuccess: () => {
        setActivationLoader(false);
        setSuccessModal(true);
        toast.success("Workflow activated successfully", {
          unstyled: false,
          position: "top-right",
          classNames: {
            toast:
              "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
            title: "text-[#E71D36]",
          },
        });
      },
      onError: (error) => {
        setLoader(false);
        setActivationLoader(false);
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message
            : "Failed to activate workflow",
          {
            unstyled: true,
            position: "top-right",
            classNames: {
              toast:
                "capitalize bg-white z-10 flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
              title: "text-[#E71D36]",
            },
          }
        );
      },
    });
  };

  const deactivateWorkflow = (reason: string): void => {
    const payload = {
      reason: reason,
    };

    setDeactivateLoader(true);
    deactivateWorkflows.mutate(payload, {
      onSuccess: () => {
        setDeactivateLoader(false);
        setDeactivatedaModal(true);
        setIsDeactivated(true);
        toast.success("Workflow successfully deactivated", {
          unstyled: false,
          position: "top-right",
          classNames: {
            toast:
              "capitalize bg-[#E31D1C0D] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
            title: "text-[#E71D36]",
          },
        });
      },
      onError: (error: Error) => {
        setDeactivateLoader(false);
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message
            : "Failed to deactivate workflow",
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

  const selectStep = (step: Step): void => {
    setSelectedStep(step);
    setIsEditing(false);
  };

  const closePanel = (): void => {
    setSelectedStep(null);
    setIsEditing(false);
  };

  const goBack = () => {
    router.back();
  };

  const viewWorkflows = () => {
    router.push("/workflow");
    setDeactivatedaModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="text-center text-[18px]">
          <div className="animate-pulse">Loading workflow steps..</div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[family-name:var(--font-dm)]">
      <WorkflowHeader
        workflowName={configureStepData?.name as string}
        status={configureStepData?.status as WorkflowStatus}
        stepIsSaved={stepIsSaved}
        stepsLength={steps.length}
        validationLoader={validationLoader}
        activationLoader={activationLoader}
        onBack={goBack}
        onValidate={validateWorkflow}
        onActivate={activateWorkflow}
        onDeactivate={deactivateWorkflow}
        deactivateLoader={deactivateLoader}
        isDeactivated={isDeactivated}
        validated={validated}
      />

      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar */}
        <WorkflowSidebar
          steps={steps}
          selectedStep={selectedStep}
          onAddStep={addStep}
          onSelectStep={selectStep}
        />

        {/* Main Canvas */}
        <WorkflowCanvas
          steps={steps}
          selectedStep={selectedStep}
          onAddStep={addStep}
          onSelectStep={setSelectedStep}
        />

        {/* Right Panel - Getting Started */}
        {showGettingStarted && !selectedStep && steps.length === 0 && (
          <GettingStartedPanel onClose={() => setShowGettingStarted(false)} />
        )}

        {/* Right Panel - Step Overview */}
        {selectedStep && !isEditing && (
          <StepOverviewPanel
            step={selectedStep}
            onClose={() => closePanel()}
            onEdit={() => editStep(selectedStep)}
            onDelete={() => deleteStep(selectedStep.id)}
          />
        )}

        {/* Right Panel - Edit Form */}
        {isEditing && selectedStep && (
          <StepEditFormPanel
            step={selectedStep}
            formData={formData}
            onClose={() => setIsEditing(false)}
            onSave={saveStep}
            onChange={setFormData}
            isSaving={loader}
          />
        )}

        {/* Validation Errors Modal */}
        {validationErrors.length > 0 && (
          <ValidationErrorsModal
            errors={validationErrors}
            onClose={() => setValidationErrors([])}
          />
        )}
      </div>

      {/* Successfully activated workflow */}
      <SuccessModal
        isOpen={showSuccessModal}
        description="Workflow Activated Successully"
        buttonText="Done"
        buttonClass="-translate-y-[20px]"
        handleClick={() => setSuccessModal(false)}
      />

      {/* Successfully deactivated workflow */}
      <SuccessModal
        isOpen={deactivatedaModal}
        description="Workflow Deactivated Successfully"
        buttonText="Create New Workflow"
        buttonClass="-translate-y-[20px]"
        handleClick={viewWorkflows}
      />
    </div>
  );
};

export default WorkflowEditor;
