export interface DocumentFormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  department: string;
  workflowAdded: boolean;
  workflow?: string;
}