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
  page: number;
  pageSize: number;
}

export interface DocumentFormDataPayload {
  file: File[];
  title: string;
  description: string;
  category: string;
  tags: string[];
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
  size: number;
  contentType: string;
}

export interface DocumentBatchDetails {
  batchId: string;
  title: string;
  category: string;
  department: string;
  status: string;
  files: DocumentFiles[];
}
