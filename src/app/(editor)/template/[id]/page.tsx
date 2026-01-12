"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ConditionsType,
  Step,
  StepTemplate,
  WorkFlowConfigurationPayload,
  WorkflowRetrievedSteps,
  WorkFlowTemplatePayload,
  WorkflowUserType,
} from "@/types/workflow";
import {
  useActivateWorkflow,
  useConfigureWorkflow,
  useDeactivateWorkflow,
  useGetTemplateWorkflowSteps,
  useSaveWorkflowTemplate,
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
  role: string[];
  users: WorkflowUserType[];
  approverMode: "AllApprovers" | "Anyone";
  deadlineHours: number;
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
  const [stepIsSaved, setSavedStep] = useState<boolean>(false);
  const [showSuccessModal, setSuccessModal] = useState(false);
  const [deactivatedaModal, setDeactivatedaModal] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [templateSaved, setSavedTemplate] = useState(false);
  const [templateSavedAndActivated, setSavedAndActivatedTemplate] =
    useState(false);
  const [templateSuccessSaved, setSuccessTemplate] = useState(false);
  const [isActivating, setActivating] = useState(false);
  const [message, setMessage] = useState("");

  const configureWorkflow = useConfigureWorkflow(params.id as string);

  // Save workflow as template
  const saveWorkflowTemplate = useSaveWorkflowTemplate(params.id as string);

  // validate workflow mutation
  const validateWorkflows = useValidateWorkflow();

  //Activate workflow mutation
  const activateWorkflows = useActivateWorkflow(params.id as string);

  //Deactivate workflow
  const deactivateWorkflows = useDeactivateWorkflow(params.id as string);

  const [formData, setFormData] = useState<FormData>({
    id: "",
    stepName: "",
    approverType: "SpecificUsers",
    role: [],
    users: [] as WorkflowUserType[],
    approverMode: "AllApprovers",
    deadlineHours: 0,
    enableEscalation: "yes",
    escalationUsers: [] as WorkflowUserType[],
    conditions: {
      department: "",
      flowToRole: "",
    },
  });

  const { data: configureStepData, isLoading } = useGetTemplateWorkflowSteps(
    params.id as string
  );

  const configureSteps: WorkflowRetrievedSteps[] = React.useMemo(() => {
    return configureStepData?.template as WorkflowRetrievedSteps[];
  }, [configureStepData, isLoading]);

  const configureStepName: string = React.useMemo(() => {
    return configureStepData?.templateName as string;
  }, [configureStepData, isLoading]);

  useEffect(() => {
    const updatedSteps: Step[] = configureSteps?.map((step, index) => {
      return {
        ...step,
        id: `step-${index + 1}`,
        order: index + 1,
        name: step.stepName,
        approverType: step.approvalType,
        roles: step?.roles,
        users: step.approvalType === "SpecificUsers" ? step.users : [],
        approverMode: step.approverMode,
        deadlineHours: step.deadlineHours,
        enableEscalation: step.enableEscalation,
        escalationUsers: step.enableEscalation ? step.escalationUsers : [],
        conditions: step.conditions,
        configured: true,
      };
    });

    // eslint-disable-next-line
    setSteps(updatedSteps?.length ? updatedSteps : []);
  }, [configureSteps]);

  const addStep = (): void => {
    if (steps.length >= Number(configureStepData?.stepCount)) {
      alert(`Maximum of ${Number(configureStepData?.stepCount)} steps allowed`);
      return;
    }

    setSavedStep(false);

    const newStep: Step = {
      id: `step-${steps.length + 1}`,
      order: steps.length + 1,
      stepName: ``,
      configured: false,
      approverType: "SpecificUsers",
      roles: [],
      approverMode: "AllApprovers",
      deadlineHours: 0,
      users: [],
      enableEscalation: false,
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
      role: [],
      approverMode: "AllApprovers",
      deadlineHours: 0,
      users: [],
      enableEscalation: "yes",
      escalationUsers: [],
    });
  };

  const saveStep = (): void => {
    if (!formData.stepName.trim()) {
      toast.warning("Step name is required", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (formData.approverType === "RoleBased" && !formData.role) {
      toast.warning("Please select a role", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (formData.approverType === "SpecificUsers" && !formData.users.length) {
      toast.warning("Please select a user", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (!formData.deadlineHours) {
      toast.warning("Step has no deadline set", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (formData.deadlineHours <= 0) {
      toast.warning("Step deadline must be greater than zero (0)", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (
      formData.enableEscalation === "yes" &&
      !formData.escalationUsers.length
    ) {
      toast.warning("Please select a users to escalate to", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
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
          roles: formData.approverType === "SpecificUsers" ? [] : formData.role,
          users:
            formData.approverType === "SpecificUsers" ? formData.users : [],
          approverMode: formData.approverMode,
          deadlineHours: formData.deadlineHours,
          enableEscalation: formData.enableEscalation === "yes" ? true : false,
          escalationUsers:
            formData.enableEscalation === "yes" ? formData.escalationUsers : [],
          conditions:
            formData.conditions && formData.conditions.department
              ? [formData.conditions as ConditionsType]
              : [],
          // configured: true,
        };
      }
      return step;
    });

    const payload: WorkFlowConfigurationPayload = {
      templateName: configureStepName,
      useTemplate: true,
      templateId: params.id as string,
      saveAsTemplate: false,
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
                formData.approverType === "SpecificUsers" ? [] : formData.role,
              users:
                formData.approverType === "SpecificUsers" ? formData.users : [],
              approverMode: formData.approverMode,
              deadlineHours: formData.deadlineHours,
              enableEscalation:
                formData.enableEscalation === "yes" ? true : false,
              escalationUsers:
                formData.enableEscalation === "yes"
                  ? formData.escalationUsers
                  : [],
              conditions:
                formData.conditions && formData.conditions.department
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

  const saveAndActivateStep = () => {
    if (!formData.stepName.trim()) {
      toast.warning("Step name is required", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (formData.approverType === "RoleBased" && !formData.role) {
      toast.warning("Please select a role", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (formData.approverType === "SpecificUsers" && !formData.users.length) {
      toast.warning("Please select a user", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (!formData.deadlineHours) {
      toast.warning("Step has no deadline set", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (formData.deadlineHours <= 0) {
      toast.warning("Step deadline must be greater than zero (0)", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (
      formData.enableEscalation === "yes" &&
      !formData.escalationUsers.length
    ) {
      toast.warning("Please select a users to escalate to", {
        unstyled: true,
        position: "top-right",
        classNames: {
          toast:
            "bg-[#ffcc00] rounded-[8px] flex md:max-w-[420px] p-[8px] items-center gap-[10px] font-[family-name:var(--font-dm)] font-[500]",
        },
      });
      return;
    }

    if (!selectedStep) return;

    setActivating(true);

    const updatedSteps = steps.map((step) => {
      if (step.id === selectedStep.id) {
        return {
          id: formData.id,
          stepName: formData.stepName,
          approvalType: formData.approverType,
          roles: formData.approverType === "SpecificUsers" ? [] : formData.role,
          users:
            formData.approverType === "SpecificUsers" ? formData.users : [],
          approverMode: formData.approverMode,
          deadlineHours: formData.deadlineHours,
          enableEscalation: formData.enableEscalation === "yes" ? true : false,
          escalationUsers:
            formData.enableEscalation === "yes" ? formData.escalationUsers : [],
          conditions:
            formData.conditions && formData.conditions.department
              ? [formData.conditions as ConditionsType]
              : [],
          // configured: true,
        };
      }
      return step;
    });

    const payload: WorkFlowTemplatePayload = {
      templateName: configureStepName,
      steps: updatedSteps as StepTemplate[],
    };

    saveWorkflowTemplate.mutate(payload, {
      onSuccess: () => {
        // setIsEditing(false);
        // setSelectedStep(null);
        // setValidated(false);
        // setMessage("Workflow Template Saved and Activated Successfully");
        // setSuccessTemplate(true);
        // setActivating(false);
        // setSavedStep(true);

        activateWorkflows.mutate(params?.id as string, {
          onSuccess: () => {
            setIsEditing(false);
            setSelectedStep(null);
            setValidated(false);
            setMessage("Workflow Template Saved and Activated Successfully");
            setSuccessTemplate(true);
            setActivating(false);
            setSavedAndActivatedTemplate(true);
            setSavedStep(true);

            const responseSteps = steps.map((step) => {
              return {
                ...step,
                configured: true,
              };
            });

            setSteps(responseSteps);

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
            setTemplateSaving(false);
            setActivating(false);
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
      },
      onError: (error) => {
        setTemplateSaving(false);
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message
            : "Failed to save workflow as template",
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
    setIsEditing(false);

    setSelectedStep(step);

    // Use setTimeout to ensure state update completes
    setTimeout(() => {
      setFormData({
        id: `step-${step.id}`,
        stepName: step.stepName,
        approverType: step.approverType,
        role: step.roles,
        approverMode: step.approverMode,
        deadlineHours: step.deadlineHours,
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

      setIsEditing(true);
    }, 0);
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

    const updatedSteps: StepTemplate[] = steps.map((step) => {
      if (step.id === selectedStep?.id) {
        return {
          id: formData.id,
          approvalType: formData.approverType,
          order: steps.length,
          stepName: formData.stepName,
          name: formData.stepName,
          approverType: formData.approverType,
          roles: formData.approverType === "SpecificUsers" ? [] : formData.role,
          users:
            formData.approverType === "SpecificUsers" ? formData.users : [],
          approverMode: formData.approverMode,
          deadlineHours: formData.deadlineHours,
          enableEscalation: formData.enableEscalation === "yes" ? true : false,
          escalationUsers:
            formData.enableEscalation === "yes" ? formData.escalationUsers : [],
          conditions:
            formData.conditions && formData.conditions.department
              ? [formData.conditions as ConditionsType]
              : [],
          configured: false,
        };
      }
      return {
        ...step,
        conditions:
          step.conditions?.length && step.conditions.filter(Boolean)
            ? [formData.conditions as ConditionsType]
            : [],
      };
    });

    setSteps(
      updatedSteps.map((step, index) => {
        return {
          ...step,
          id: `step-${index + 1}`,
          order: index + 1,
          configured: false,
        };
      })
    );

    if (steps.length === 0) {
      errors.push("At least one step is required");
    }

    updatedSteps.forEach((step, index) => {
      // if (!step.configured) {
      //   errors.push(`Step ${index + 1} is not configured`);
      // }
      if (!step.stepName.trim()) {
        errors.push(`Step ${index + 1} has no name`);
      }
      if (step.approverType === "RoleBased" && !step.roles.length) {
        errors.push(`Step ${index + 1} has no role selected`);
      }
      if (formData.approverType === "SpecificUsers" && !step.users.length) {
        errors.push(`Step ${index + 1} has no users selected`);
      }
      if (!step.deadlineHours) {
        errors.push(`Step ${index + 1} has no deadline set`);
      }
      if (step.deadlineHours <= 0) {
        errors.push(`Step ${index + 1} deadline must be greater than zero (0)`);
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
        steps: updatedSteps,
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
          unstyled: true,
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

  const saveWorkflowAsTemplate = () => {
    if (!selectedStep) return;

    setTemplateSaving(true);

    const updatedSteps = steps.map((step) => {
      if (step.id === selectedStep.id) {
        return {
          id: formData.id,
          stepName: formData.stepName,
          approvalType: formData.approverType,
          roles: formData.approverType === "SpecificUsers" ? [] : formData.role,
          users:
            formData.approverType === "SpecificUsers" ? formData.users : [],
          approverMode: formData.approverMode,
          deadlineHours: formData.deadlineHours,
          enableEscalation: formData.enableEscalation === "yes" ? true : false,
          escalationUsers:
            formData.enableEscalation === "yes" ? formData.escalationUsers : [],
          conditions:
            formData.conditions && formData.conditions.department
              ? [formData.conditions as ConditionsType]
              : [],
          // configured: true,
        };
      }
      return step;
    });

    const payload: WorkFlowTemplatePayload = {
      templateName: configureStepName,
      steps: updatedSteps as StepTemplate[],
    };

    saveWorkflowTemplate.mutate(payload, {
      onSuccess: () => {
        setTemplateSaving(false);
        setSuccessTemplate(true);
        setSavedTemplate(true);
        setMessage("Workflow Template Saved Successfully");
      },
      onError: (error) => {
        setTemplateSaving(false);
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message
            : "Failed to save workflow as template",
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
    router.push("/templates");
  };

  const viewWorkflows = () => {
    router.push("/workflow");
    setDeactivatedaModal(false);
  };

  const viewTemplates = () => {
    router.push("/templates");
    setSavedTemplate(false);
  };

  const handleStepSelection = (step: Step) => {
    setSelectedStep(step);
    setIsEditing(true);

    // Use setTimeout to ensure state update completes
    setTimeout(() => {
      setFormData({
        id: `step-${step.id}`,
        stepName: step.stepName,
        approverType: step.approverType,
        role: step.roles,
        approverMode: step.approverMode,
        deadlineHours: step.deadlineHours,
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

      setIsEditing(false);
    }, 0);
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
        workflowName={configureStepData?.templateName as string}
        status={"Draft"}
        stepIsSaved={stepIsSaved}
        stepsLength={steps.length}
        validationLoader={validationLoader}
        activationLoader={activationLoader}
        onBack={goBack}
        onValidate={validateWorkflow}
        onActivate={activateWorkflow}
        onDeactivate={deactivateWorkflow}
        handleSave={saveWorkflowAsTemplate}
        deactivateLoader={deactivateLoader}
        isDeactivated={isDeactivated}
        validated={validated}
        templateSaving={templateSaving}
        templateSuccessSaved={templateSuccessSaved}
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
          stepCount={Number(configureStepData?.stepCount)}
          onAddStep={addStep}
          onSelectStep={handleStepSelection}
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
            onActivate={saveAndActivateStep}
            isActivating={isActivating}
            onChange={setFormData}
            isSaving={loader}
            stepLength={Number(configureStepData?.stepCount)}
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

      {/* Successfully saved workflow as template */}
      <SuccessModal
        isOpen={templateSaved}
        description={message}
        buttonText="View Templates"
        buttonAdditionalText="Back"
        buttonClass="-translate-y-[20px]"
        showAdditionalButton={true}
        handleAdditionalClick={() => setSavedTemplate(false)}
        handleClick={viewTemplates}
      />

      {/* Successfully saved and activated template */}
      <SuccessModal
        isOpen={templateSavedAndActivated}
        description={message}
        buttonText="View Templates"
        buttonAdditionalText="Back"
        buttonClass="-translate-y-[20px]"
        showAdditionalButton={false}
        handleAdditionalClick={() => setSavedTemplate(false)}
        handleClick={viewTemplates}
      />
    </div>
  );
};

export default WorkflowEditor;
