// api/query-keys.ts
export const WORKFLOW_KEYS = {
  all: ["workflows", "workflow", "templates", "template"] as const,
  details: (id: string) => ["workflows", id] as const,
};

export const DOCUMENT_KEYS = {
  all: ["documents"] as const,
  details: (id: string) => ["documents", id] as const,
};

export const APPROVAL_KEYS = {
  all: ["approvals", "queues", "documents"] as const,
  details: (id: string) => ["documents", id] as const,
};
