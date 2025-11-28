/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Step, WorkflowUserType } from "@/types/workflow";
import { AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { DepartmentType, RolesType } from "@/types/smartUserTypes";
import { MultiSelect } from "../ui/multi-select";
import {
  useGetDepartmentsQuery,
  useGetRolesQuery,
  useGetUserInfinite,
} from "@/hooks/api/useSmartUserQuery";
import React from "react";

const StepEditFormPanel = ({
  step,
  formData,
  onClose,
  onSave,
  onChange,
  isSaving,
}: {
  step: Step;
  formData: any;
  onClose: () => void;
  onSave: () => void;
  onChange: (data: any) => void;
  isSaving: boolean;
}) => {
  const [search, setSearch] = React.useState("");
  const {
    data: userData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserInfinite(search);

  const { data: departmentsData } = useGetDepartmentsQuery();

  const { data: rolesData } = useGetRolesQuery();

  const departments = React.useMemo(() => {
    const sortedData =
      departmentsData?.data?.sort((a, b) =>
        a.departmentName
          .trim()
          .localeCompare(b.departmentName.trim(), undefined, {
            sensitivity: "base",
          })
      ) ?? ([] as DepartmentType[]);

    return sortedData;
  }, [departmentsData]);

  const roles = React.useMemo(() => {
    const sortedData =
      rolesData?.sort((a, b) =>
        a.name
          .trim()
          .localeCompare(b.name.trim(), undefined, { sensitivity: "base" })
      ) ?? ([] as RolesType[]);

    return sortedData;
  }, [rolesData]);

  const userOptions = React.useMemo(() => {
    return (
      userData?.pages
        ?.flatMap((p) => p.data)
        .map((u) => ({
          label: u.firstName + " " + u.lastName,
          value: u.id,
          _key: `${u.id}_${search}`, // unique key per search
          dept: u.departmentId,
          email: u.email,
          role: u.roles,
        })) ?? []
    );
  }, [userData, search]);

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Approval Step - {step.stepName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Step Name
          </label>
          <input
            type="text"
            value={formData.stepName}
            onChange={(e) =>
              onChange({ ...formData, stepName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder="Initial Review (Draft)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Approver Type
          </label>
          <div className="flex space-x-3">
            <RadioGroup
              defaultValue="RoleBased"
              className="flex gap-3"
              value={formData.approverType}
              onValueChange={(e) => {
                onChange({
                  ...formData,
                  approverType: e as "RoleBased" | "SpecificUsers",
                });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="RoleBased"
                  id="option-one"
                  className="data-[state=checked]:border-[#0284B2] data-[state=checked]:bg-white focus-visible:ring-2 focus-visible:ring-blue"
                />
                <Label htmlFor="option-one">Role-based</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="SpecificUsers"
                  id="option-two"
                  className="data-[state=checked]:border-[#0284B2] data-[state=checked]:bg-white focus-visible:ring-2 focus-visible:ring-blue"
                />
                <Label htmlFor="option-two">Specific Users</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {formData.approverType === "RoleBased" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => onChange({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
            >
              <option value="">Select a role</option>
              {roles?.map((role) => (
                <option key={role?.id} value={role?.name}>
                  {role?.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.approverType === "SpecificUsers" && (
          <div className="mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Users
            </label>
            <MultiSelect
              options={userOptions}
              onValueChange={(userIds) => console.log("User IDs:", userIds)} // Optional: keep for debugging
              onSelectionChange={(selectedUsers) => {
                // This receives the full option objects with all properties
                const formattedUsers = selectedUsers.map((user) => ({
                  id: user.value,
                  email: user.email,
                  name: user.label,
                  dept: user.dept,
                  role: user?.role?.length ? user.role[0] : "",
                }));
                onChange({ ...formData, users: formattedUsers });
              }}
              onLoadMore={fetchNextPage}
              hasMore={hasNextPage}
              defaultOptions={formData.users.map((u: WorkflowUserType) => ({
                label: u.name,
                value: u.id,
                _key: `${u.id}_${search}`,
              }))}
              // formData.users.map((u) => u.id
              isLoading={isFetchingNextPage}
              onSearch={setSearch}
              placeholder="Select users"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Approver Mode
          </label>
          <div className="space-y-2">
            <div className="flex space-x-3">
              <RadioGroup
                defaultValue="all-approve"
                className="flex gap-3"
                value={formData.approverMode}
                onValueChange={(e) => {
                  onChange({
                    ...formData,
                    approverMode: e as "AllApprovers" | "Anyone",
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="AllApprovers"
                    id="approval-option-one"
                    className="data-[state=checked]:border-[#0284B2] data-[state=checked]:bg-white focus-visible:ring-2 focus-visible:ring-blue"
                  />
                  <Label htmlFor="approval-option-one">
                    All approvers must approve
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Anyone"
                    id="approval-option-two"
                    className="data-[state=checked]:border-[#0284B2] data-[state=checked]:bg-white focus-visible:ring-2 focus-visible:ring-blue"
                  />
                  <Label htmlFor="approval-option-two">Anyone</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {step.order === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Conditions per Department (Optional)
            </label>
            <div className="space-y-2">
              <div className="flex space-x-3 items-center flex-wrap wrap text-[14px]">
                <p>If the department is</p>
                <select
                  className="w-30 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  value={formData?.conditions?.department}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      conditions: {
                        department: e.target.value,
                        flowToRole: formData?.conditions?.flowToRole as string,
                      },
                    })
                  }
                >
                  <option value="">Select a department</option>
                  {departments?.map((department) => (
                    <option
                      key={department?.departmentId}
                      value={department?.departmentName}
                    >
                      {department?.departmentName}
                    </option>
                  ))}
                </select>
                <p>It should flow to</p>
                <select
                  className="w-40 mt-2 px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
                  value={formData?.conditions?.flowToRole}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      conditions: {
                        department: formData?.conditions?.department as string,
                        flowToRole: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Select role</option>
                  {roles?.map((role) => (
                    <option key={role?.id} value={role?.name}>
                      {role?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Set Deadline
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                onChange({
                  ...formData,
                  deadline: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="00"
            />
            {/* <div>Hours</div> */}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Enable Escalation
          </label>
          <div className="flex space-x-3">
            <RadioGroup
              defaultValue="all-approve"
              className="flex gap-3"
              value={formData.enableEscalation}
              onValueChange={(e) => {
                onChange({
                  ...formData,
                  enableEscalation: e as "yes" | "no",
                });
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="yes"
                  id="escalation-option-one"
                  className="data-[state=checked]:border-[#0284B2] data-[state=checked]:bg-white focus-visible:ring-2 focus-visible:ring-blue"
                />
                <Label htmlFor="escalation-option-one">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="no"
                  id="escalation-option-two"
                  className="data-[state=checked]:border-[#0284B2] data-[state=checked]:bg-white focus-visible:ring-2 focus-visible:ring-blue"
                />
                <Label htmlFor="escalation-option-two">No</Label>
              </div>
            </RadioGroup>
          </div>
          {formData.enableEscalation === "yes" && (
            <div className="mt-2 flex items-start text-xs text-[#DD6A57]">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
              <span>Escalation will happen after deadline elapses</span>
            </div>
          )}
        </div>

        {formData.enableEscalation === "yes" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escalate to
            </label>
            <MultiSelect
              options={userOptions}
              onValueChange={(userIds) =>
                console.log("Escalated User IDs:", userIds)
              } // Optional: keep for debugging
              onSelectionChange={(selectedUsers) => {
                // This receives the full option objects with all properties
                const formattedUsers = selectedUsers.map((user) => ({
                  id: user.value,
                  email: user.email,
                  name: user.label,
                  dept: user.dept,
                  role: user?.role?.length ? user.role[0] : "",
                }));
                onChange({
                  ...formData,
                  escalationUsers: formattedUsers,
                });
              }}
              onLoadMore={fetchNextPage}
              hasMore={hasNextPage}
              defaultOptions={formData.escalationUsers.map(
                (u: WorkflowUserType) => ({
                  label: u.name,
                  value: u.id,
                  _key: `${u.id}_${search}`,
                })
              )}
              isLoading={isFetchingNextPage}
              onSearch={setSearch}
              placeholder="Select users"
            />
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-200">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="w-full px-4 py-2 bg-brand-blue text-white rounded hover:brand-blue/10 font-medium"
        >
          {isSaving && <Loader2 className="animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
};

export default StepEditFormPanel;
