"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const workflowSchema = z
  .object({
    name: z.string().min(1, {
      message: "Workflow name is required",
    }),
    description: z.string(),
    scope: z.enum(["Global", "Department", "DocumentType"], {
      error: "Scope is required",
    }),
    scopeValue: z.string().optional(),
    stepNo: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          const parsed = parseInt(val, 10);
          return isNaN(parsed) ? undefined : parsed;
        }
        return val;
      },
      z.number().min(1, "Steps must be greater than 0")
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
      scope: "Global",
      scopeValue: "",
      stepNo: undefined,
    },
  });
