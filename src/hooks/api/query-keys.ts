// api/query-keys.ts
export const WORKFLOW_KEYS = {
  all: ["workflows"] as const,
  details: (id: string) => ["workflows", id] as const,
};
