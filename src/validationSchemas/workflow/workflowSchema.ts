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
    scope: z.enum(["global", "department", "document"], {
      error: "Scope is required",
    }),
    scopeValue: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const scopeIsDepartment = data.scope === "department";
    if (scopeIsDepartment) {
      if (!data.scopeValue || data.scopeValue.trim() === "") {
        ctx.addIssue({
          path: ["scopeValue"],
          code: z.ZodIssueCode.custom,
          message: "Select department for scope",
        });
      }
    }
  });

export const WorkflowCreationValidation = () =>
  useForm<z.infer<typeof workflowSchema>>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: "",
      description: "",
      scope: "global",
      scopeValue: "",
    },
  });
