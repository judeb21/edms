"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const workflowSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Workflow name cannot be empty or just spaces"),
    description: z.string(),
    scope: z.enum(["Global", "Department", "DocumentType"], {
      message: "Scope is required",
    }),
    scopeValue: z.string().optional(),
    stepNo: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          const trimmed = val.trim();
          if (trimmed === "") return undefined;
          const parsed = parseInt(trimmed, 10);
          return isNaN(parsed) ? undefined : parsed;
        }
        return val;
      },
      z
        .number({
          message: "Number of steps is required",
        })
        .min(1, "Number of steps must be at least 1"),
    ),
  })
  .superRefine((data, ctx) => {
    const scopeIsDepartment = data.scope === "Department";
    const scopeIsDocumentType = data.scope === "DocumentType";
    if (scopeIsDepartment) {
      if (!data.scopeValue || data.scopeValue.trim() === "") {
        ctx.addIssue({
          path: ["scopeValue"],
          code: z.ZodIssueCode.custom,
          message: "Select department for scope",
        });
      }
    }
    if (scopeIsDocumentType) {
      if (!data.scopeValue || data.scopeValue.trim() === "") {
        ctx.addIssue({
          path: ["scopeValue"],
          code: z.ZodIssueCode.custom,
          message: "Select document type for scope",
        });
      }
    }
  });

export const WorkflowCreationValidation = () =>
  useForm({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      scope: "Global" as const,
      scopeValue: "",
      stepNo: "" as any,
    },
  });
