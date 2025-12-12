import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, apiFetch, authenticatedAxios } from "@/lib/apiClient";
import {
  TemplatesResponse,
  TemplateWorkflowDetails,
  ValidateWorkflowPayload,
  WorkFlowConfigurationPayload,
  WorkflowDetails,
  WorkflowPayload,
  WorkFlowTemplatePayload,
  WorkflowTypes,
} from "@/types/workflow";
// import axios from "axios";
import { WORKFLOW_KEYS } from "./query-keys";

// Get workflows
export const fetchWorkflows = () =>
  apiFetch<WorkflowTypes[]>("/admin/workflows", { method: "GET" });

// const createWorkflow = (payload: any): Promise<WorkflowTypes> => {
//   const url = `/admin/workflows/create`;
//   return apiFetch(url, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
// };

//Create Workflow
export const createWorkflow = async (
  payload: WorkflowPayload
): Promise<WorkflowTypes> => {
  const { data } = await authenticatedAxios.post(
    `/admin/workflows/create`,
    payload
  );
  return data;
};

//Hook to get Workflow
export function useGetWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: fetchWorkflows, // no cache
  });
}

//Hook to create workflow
export const useCreateWorkflow = () => {
  const invalidateWorkflows = useInvalidateWorkflows();

  return useMutation({
    mutationFn: (payload: WorkflowPayload) => createWorkflow(payload),
    onSuccess: () => {
      invalidateWorkflows();
    },
  });
};

export const configureWorkflow = async (
  workflowId: string,
  payload: WorkFlowConfigurationPayload
): Promise<any> => {
  const { data } = await authenticatedAxios.patch(
    `/admin/workflows/${workflowId}/configure`,
    payload
  );
  return data;
};

//Hook to configure workflow
export const useConfigureWorkflow = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkFlowConfigurationPayload) =>
      configureWorkflow(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKFLOW_KEYS.details(id) });
    },
  });
};

//Get configured steps
export const fetchConfiguredWorkflowSteps = (id: string) =>
  apiFetch<WorkflowDetails>(
    `/admin/workflows/${id}/configuration`,
    { method: "GET" }
  );


  // Hook to get configured steps
export function useGetConfiguredWorkflowSteps(id: string) {
  return useQuery({
    queryKey: ["workflows", id],
    queryFn: () => fetchConfiguredWorkflowSteps(id), // no cache
  });
}

// Get template steps
export const fetchTemplateWorkflowSteps = (id: string) =>
  apiFetch<TemplateWorkflowDetails>(
    `/templates/templates/${id}`,
    { method: "GET" }
  );

export function useGetTemplateWorkflowSteps(id: string) {
  return useQuery({
    queryKey: ["workflows", id],
    queryFn: () => fetchTemplateWorkflowSteps(id), // no cache
  });
}

//Validate Workflow
export const validateWorkflow = async (
  payload: ValidateWorkflowPayload
): Promise<WorkflowTypes> => {
  const { data } = await authenticatedAxios.post(
    `/admin/workflows/validate`,
    payload
  );
  return data;
};

//Hook to Validate workflow
export const useValidateWorkflow = () => {
  const invalidateWorkflows = useInvalidateWorkflows();

  return useMutation({
    mutationFn: (payload: ValidateWorkflowPayload) => validateWorkflow(payload),
    onSuccess: () => {
      invalidateWorkflows();
    },
  });
};

//Activate Workflow
export const activateWorkflow = async (
  workflowId: string
): Promise<WorkflowTypes> => {
  const { data } = await authenticatedAxios.post(
    `/admin/workflows/${workflowId}/activate`
  );
  return data;
};

//Hook to Validate workflow
export const useActivateWorkflow = () => {
  const invalidateWorkflows = useInvalidateWorkflows();

  return useMutation({
    mutationFn: (workflowId: string) => activateWorkflow(workflowId),
    onSuccess: () => {
      invalidateWorkflows();
    },
  });
};

//Deactivate Workflow
export const deactivateWorkflow = async (
  workflowId: string,
  payload: any
): Promise<WorkflowTypes> => {
  const { data } = await authenticatedAxios.post(
    `/admin/workflows/${workflowId}/deactivate`,
    payload
  );
  return data;
};

//Hook to Deactivate workflow
export const useDeactivateWorkflow = (workflowId: string) => {
  const invalidateWorkflows = useInvalidateWorkflows();

  return useMutation({
    mutationFn: (payload: any) => deactivateWorkflow(workflowId, payload),
    onSuccess: () => {
      invalidateWorkflows();
    },
  });
};

//Delete Workflow
export const deleteWorkflow = async (
  workflowId: string
): Promise<{ message: string }> => {
  const { data } = await authenticatedAxios.delete(
    `${API_BASE_URL}/admin/workflows/${workflowId}`
  );
  return data;
};

//Hook to Deactivate workflow
export const useDeleteWorkflow = () => {
  const invalidateWorkflows = useInvalidateWorkflows();

  return useMutation({
    mutationFn: (id: string) => deleteWorkflow(id),
    onSuccess: () => {
      invalidateWorkflows();
    },
  });
};

// save workflow as template
export const saveWorkflowTemplate = async (
  payload: WorkFlowTemplatePayload
): Promise<any> => {
  const { data } = await authenticatedAxios.post(
    `${API_BASE_URL}/templates/save-template`,
    payload
  );
  return data;
};

//Hook to save workflow as template
export const useSaveWorkflowTemplate = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkFlowTemplatePayload) =>
      saveWorkflowTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKFLOW_KEYS.details(id) });
    },
  });
};

// Get workflow templates
export const fetchWorkflowTemplates = () =>
  apiFetch<TemplatesResponse[]>(
    "/templates/fetch-templates",
    { method: "GET" },
  );

export function useGetAllTemplatesWorkflows() {
  return useQuery({
    queryKey: ["workflows", "templates"],
    queryFn: () => fetchWorkflowTemplates(), // no cache
  });
}

export function useInvalidateWorkflows() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: WORKFLOW_KEYS.all });
}
