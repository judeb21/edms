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
  role: string[];
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
  role: string;
  users: WorkflowUserType[];
  approverMode: "AllApprovers" | "Anyone";
  deadline: string;
  enableEscalation: boolean;
  escalationUsers: WorkflowUserType[];
  conditions?: ConditionsType[];
  updatedAt?: string;
}

export interface WorkFlowConfigurationPayload {
  steps: Step[];
}

export interface WorkflowRetrievedSteps {
  id: string;
  stepName: string;
  approvalType: "RoleBased" | "SpecificUsers";
  role: string;
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

export enum WorkflowStatus {
  Draft = 'Draft',
  Configured = 'Configured',
}
