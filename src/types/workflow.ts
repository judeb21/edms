export interface WorkflowTypes {
  id: string;
  name: string;
  description: string;
  scopeType: string;
  scopeValue?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowPayload {
  name: string;
  description: string;
  scope: {
    type: string;
    value: string;
  };
}

export interface WorkflowUserType {
  id: string;
  email: string;
  name: string;
  dept: string;
  roles: string[];
}

export interface ConditionsType {
  department: string;
  flowToRole: string;
}

export interface Step {
  createdAt?: string;
  id: string;
  order: number;
  stepName: string;
  configured: boolean;
  approverType: "RoleBased" | "SpecificUsers";
  roles: string[];
  users: WorkflowUserType[];
  approverMode: "AllApprovers" | "Anyone";
  deadline: string;
  enableEscalation: boolean;
  escalationUsers: WorkflowUserType[];
  conditions?: ConditionsType[];
  updatedAt?: string;
}

export interface StepTemplate {
  createdAt?: string;
  id?: string;
  order: number;
  stepName: string;
  configured?: boolean;
  approverType: "RoleBased" | "SpecificUsers";
  roles: string[];
  users: WorkflowUserType[];
  approverMode: "AllApprovers" | "Anyone";
  deadline: string;
  enableEscalation: boolean;
  escalationUsers: WorkflowUserType[];
  conditions?: ConditionsType[];
  updatedAt?: string;
}

export interface WorkFlowConfigurationPayload {
  useTemplate: boolean;
  templateId?: string;
  saveAsTemplate: boolean;
  templateName: string;
  steps: StepTemplate[];
}

export interface WorkFlowTemplatePayload {
  templateName: string;
  steps: StepTemplate[];
}

export interface ValidateWorkflowPayload {
  steps: StepTemplate[];
}

export interface WorkflowRetrievedSteps {
  id: string;
  stepName: string;
  approvalType: "RoleBased" | "SpecificUsers";
  roles: string[];
  users: WorkflowUserType[];
  approverMode: "AllApprovers" | "Anyone";
  deadline: string;
  enableEscalation: boolean;
  escalationUsers: WorkflowUserType[];
  conditions?: ConditionsType[];
}

export interface WorkflowDetails {
  workflowId: string;
  name: string;
  status: WorkflowStatus;
  steps: WorkflowRetrievedSteps[];
}

export interface TemplatesResponse {
  id: string;
  templateName: string;
  createdAt: string;
}

export enum WorkflowStatus {
  Draft = "Draft",
  Configured = "Configured",
}

export interface TemplateWorkflowDetails {
  id: string;
  templateName: string;
  createdAt: string;
  template: WorkflowRetrievedSteps[];
}
