import { WorkflowUserType } from "./workflow";

export interface DocumentFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  department: string;
  workflowAdded: boolean;
  workflow?: string;
}

export interface FetchDocumentObject {
  keyword?: string;
  category?: string;
  department?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
}

export interface DocumentFormDataPayload {
  file: File[];
  title: string;
  description: string;
  category: string;
  tags?: string[];
  department: string;
  addWorkflow: boolean;
  workflowName?: string;
}

export interface DocumentDetails {
  documentId: string;
  batchId: string;
  blobPath: string | null;
  url: string;
  title: string;
  description: string;
  category: string;
  tagsCsv: string[];
  department: string;
  status: string;
  createdAt: string;
  storageInfo: string | null;
}

export interface QueueDocumentDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  tagsCsv: null;
  department: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
  blobPath: string;
  fileSize: number;
  contentType: string;
  workflowInstanceId: null;
  workflowDefinitionId: null;
  workflowName: string;
  batchId: string;
}

export interface DocumentResponse {
  items: Array<DocumentDetails>;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DocumentFiles {
  documentId: string;
  originalName: string | null;
  blobPath: string;
  url: string;
  container: string | null;
  size?: number;
  fileSize: number;
  contentType: string;
  createdAt?: string;
}

export interface DocumentBatchDetails {
  batchId: string;
  documentId: string;
  title: string;
  category: string;
  department: string;
  status: string;
  files: DocumentFiles[];
}

export interface DocumentSharePayload {
  documentId?: string;
  shareWithEmail: string[];
  permission: "viewer" | "commenter" | "editor";
  message?: string;
}

export interface FetchApprovalQueueObject {
  reviewEmail?: string;
  category?: string;
  department?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface ApprovalQueueDetails {
  stepInstanceId: string;
  workflowInstanceId: string;
  documentId: string;
  documentTitle: string;
  documentType: string;
  department: string;
  submittedBy: string;
  submittedAt: string;
  stepName: string;
  status: number;
  createdAt: string;
  deadline: string;
  canApprove: boolean;
  canReject: boolean;
  canRequestChanges: boolean;
  assignedApprovers: WorkflowUserType[];
}

export interface ApprovalQueueResponse {
  items: ApprovalQueueDetails[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApprovalQueueResponseDetails {
  activeStep: ApprovalQueueDetails;
  document: QueueDocumentDetails;
}

export interface QueueActions {
  approverEmail: string;
  comment: string;
}
