import {
  DocumentBatchDetails,
  DocumentFormDataPayload,
  DocumentResponse,
  FetchDocumentObject,
} from "@/types/documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_BASE_URL, apiFetch } from "@/lib/apiClient";
import { DOCUMENT_KEYS } from "./query-keys";

// Helper function to build query strings
function buildQuery(params: FetchDocumentObject): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString();
}

// https://workflow-dev.digitvant.com/api/documents/api/documents?page=1&pageSize=5
// https://workflow-dev.digitvant.com/api/documents/api/documents/page=1&pageSize=10

export function toFormData(data: DocumentFormDataPayload): FormData {
  const formData = new FormData();

  // 1. Append multiple files
  data.file.forEach((f) => {
    formData.append("file", f);
  });

  // 2. Append simple string fields
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("department", data.department);

  // 3. Append array of tags
  data.tags.forEach((tag) => {
    formData.append("tags", tag);
  });

  // 4. Append boolean safely as a string
  formData.append("addWorkflow", String(data.addWorkflow));

  // 5. Append workflow only if provided
  if (data.workflowName) {
    formData.append("workflowName", data.workflowName);
  }

  return formData;
}

async function uploadProcessDocument(payload: DocumentFormDataPayload) {
  const formData = toFormData(payload);

  return axios.post(
    `${API_BASE_URL}/documents/api/documents/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export function useUploadProcessQuery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DocumentFormDataPayload) =>
      uploadProcessDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all });
    },
  });
}

// Get documents
export const fetchDocuments = async (payload: FetchDocumentObject) => {
  const queryString = buildQuery(payload);
  const data = await apiFetch<DocumentResponse>(
    `/documents/api/documents?${queryString}`,
    { method: "GET" },
    true
  );

  return data;
};

//Hook to get Documents
export function useGetDocuments(payload: FetchDocumentObject) {
  return useQuery({
    queryKey: ["documents", payload],
    queryFn: () => fetchDocuments(payload), // no cache
  });
}

// Get template steps
export const fetchDocumentBatchById = (id: string) =>
  apiFetch<DocumentBatchDetails>(
    `/documents/api/documents/batch/${id}`,
    { method: "GET" },
    true
  );

export function useGetDocumentsIdQuery(id: string) {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchDocumentBatchById(id), // no cache
  });
}

export function useInvalidateWorkflows() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: DOCUMENT_KEYS.all });
}
