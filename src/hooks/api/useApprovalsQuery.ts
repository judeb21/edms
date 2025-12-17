import {
  ApprovalQueueResponse,
  ApprovalQueueResponseDetails,
  FetchApprovalQueueObject,
  QueueActions,
} from "@/types/documents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, authenticatedAxios } from "@/lib/apiClient";
import { APPROVAL_KEYS } from "./query-keys";

// Helper function to build query strings
function buildQuery(params: FetchApprovalQueueObject): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString();
}

// Get Approval Queues
export const fetchApprovalQueues = async (
  payload: FetchApprovalQueueObject
) => {
  const queryString = buildQuery(payload);
  const data = await apiFetch<ApprovalQueueResponse>(
    `/admin/workflows/api/approval-queue?${queryString}`,
    { method: "GET" }
  );

  return data;
};

//Hook to get Approval Queues
export function useGetApprovalQueueQuery(payload: FetchApprovalQueueObject) {
  return useQuery({
    queryKey: ["approvals", "queues"],
    queryFn: () => fetchApprovalQueues(payload), // no cache
  });
}

// Get template steps
export const fetchApprovalQueueById = (id: string) =>
  apiFetch<ApprovalQueueResponseDetails>(
    `/admin/workflows/api/approval-queue/step-details/${id}`,
    {
      method: "GET",
    }
  );

export function useGetApprovalQueuesIdQuery(id: string) {
  return useQuery({
    queryKey: ["queues", "approvals", "documents", id],
    queryFn: () => fetchApprovalQueueById(id), // no cache
    enabled: !!id,
  });
}

// Approve queue step
async function approveQueue(id: string, payload: QueueActions) {
  const { data } = await authenticatedAxios.post(
    `/admin/workflows/step/${id}/approve`,
    payload
  );
  return data;
}

// Hook to approve documents
export function useApproveQueueMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: QueueActions }) =>
      approveQueue(id, payload),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: APPROVAL_KEYS.details(id) });
    },
  });
}

// Reject queue step
async function rejectQueue(id: string, payload: QueueActions) {
  const { data } = await authenticatedAxios.post(
    `/admin/workflows/step/${id}/reject`,
    payload
  );
  return data;
}

// Hook to reject documents
export function useRejectQueueMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: QueueActions }) =>
      rejectQueue(id, payload),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: APPROVAL_KEYS.details(id) });
    },
  });
}

// Reject queue step
async function requestChangeQueue(id: string, payload: QueueActions) {
  const { data } = await authenticatedAxios.post(
    `/admin/workflows/step/${id}/request-changes`,
    payload
  );
  return data;
}

// Hook to reject documents
export function useRequestChangeQueueMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: QueueActions }) =>
      requestChangeQueue(id, payload),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: APPROVAL_KEYS.details(id) });
    },
  });
}

export function useInvalidateWorkflows() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: APPROVAL_KEYS.all });
}
