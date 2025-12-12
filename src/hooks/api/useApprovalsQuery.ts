import {
  DocumentBatchDetails,
  DocumentResponse,
} from "@/types/documents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import { APPROVAL_KEYS } from "./query-keys";

// Helper function to build query strings
// function buildQuery(params: FetchDocumentObject): string {
//   const query = new URLSearchParams();

//   Object.entries(params).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== "") {
//       query.append(key, String(value));
//     }
//   });

//   return query.toString();
// }

// Get Approval Queues
export const fetchApprovalQueues = async () => {
//   const queryString = buildQuery(payload);
  const data = await apiFetch<DocumentResponse>(
    `/admin/workflows/api/approval-queue`,
    { method: "GET" }
  );

  return data;
};

//Hook to get Approval Queues
export function useGetApprovalQueueQuery() {
  return useQuery({
    queryKey: ["approvals", "queues"],
    queryFn: () => fetchApprovalQueues(), // no cache
  });
}

// Get template steps
export const fetchApprovalQueueById = (id: string) =>
  apiFetch<DocumentBatchDetails>(
    `/admin/workflows/api/approval-queue/${id}`,
    { method: "GET" },
  );

export function useGetApprovalQueuesIdQuery(id: string) {
  return useQuery({
    queryKey: ["documents", id],
    queryFn: () => fetchApprovalQueueById(id), // no cache
  });
}

export function useInvalidateWorkflows() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: APPROVAL_KEYS.all });
}
