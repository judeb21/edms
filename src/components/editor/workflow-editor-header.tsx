"use client";

import {
  CheckCircle,
  Save,
  Play,
  ArrowLeft,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import GenericModal from "../workflow/generic-modal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import LoaderButton from "../common/loader-button";

// Types
type WorkflowStatus = "Draft" | "Configured" | "Active";

// Header Component
const WorkflowHeader = ({
  workflowName,
  status,
  stepIsSaved,
  stepsLength,
  validationLoader,
  activationLoader,
  onBack,
  onValidate,
  onActivate,
  onDeactivate,
  handleSave,
  validated,
  deactivateLoader,
  isDeactivated,
  templateSaving,
  templateSuccessSaved,
}: {
  workflowName: string;
  status: WorkflowStatus;
  stepIsSaved: boolean;
  stepsLength: number;
  validationLoader: boolean;
  activationLoader: boolean;
  onBack: () => void;
  onValidate: () => void;
  onActivate: () => void;
  onDeactivate: (reason: string) => void;
  handleSave: () => void;
  validated: boolean;
  deactivateLoader: boolean;
  isDeactivated: boolean;
  templateSaving: boolean;
  templateSuccessSaved: boolean;
}) => {
  const [deactivateModal, setModal] = useState(false);
  const [templateConfirmationModal, setConfirmationModal] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    /* eslint-disable */
    if (isDeactivated) setModal(false);
    // eslint-enable */
  }, [isDeactivated]);

  useEffect(() => {
    /* eslint-disable */
    if (templateSuccessSaved) setConfirmationModal(false);
    // eslint-enable */
  }, [templateSuccessSaved]);

  const getStatusBadge = (status: WorkflowStatus) => {
    const styles = {
      Configured: "bg-[#10B981] px-3 py-1 text-white rounded border-[#10B981]",
      Draft: "bg-gray-100 text-gray-700 hover:bg-gray-100 px-3 py-1 rounded",
      Active: "bg-[#10B981] px-3 py-1 text-white rounded border-[#10B981]",
      Archived: "border-0 text-yellow-700",
      Inactive: "bg-[#E31D1C0D] border-0 px-3 py-1 rounded text-[#FC5A5A]",
    };

    return (
      <Badge variant="outline" className={styles[status] || styles["Draft"]}>
        {status?.toLowerCase() === "active" && <CheckCircle className="mr-1" />}
        {status}
      </Badge>
    );
  };

  const deactivateWorkflow = () => setModal(true);

  const onTemplateSave = () => setConfirmationModal(true);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <Button
          variant={"ghost"}
          className="text-[#A9A9A9] hover:text-[#A9A9A9]"
          onClick={onBack}
        >
          <ArrowLeft color="#464646" className="mr-2" /> Back
        </Button>
        <div className="flex items-center space-x-4">
          <h1 className="text-[18px] font-semibold text-primary-gray">
            {workflowName}
          </h1>
          {getStatusBadge(status as WorkflowStatus)}
        </div>
        {status !== "Active" ? (
          <div className="flex items-center space-x-3">
            {stepIsSaved && (
              <div className="flex items-center text-[#464646] text-[12px]">
                <CheckCircle className="w-4 h-4 mr-1" color="#2F9441" />
                All changes saved
              </div>
            )}
            <Button
              variant={"outline"}
              onClick={onValidate}
              disabled={!stepsLength || validationLoader}
              className={`px-4 py-[14px] rounded text-[12px] ${
                !stepsLength
                  ? "border-[#A9A9A9] text-primary-gray cursor-not-allowed"
                  : "bg-white text-primary-gray hover:bg-white border-primary-gray"
              }`}
            >
              {validationLoader ? (
                <Loader2 className="animate-spin w-[20px] h-[20px] mr-1" />
              ) : (
                <CheckCircle
                  className="w-[20px] h-[20px] mr-1"
                  color={"#464646"}
                />
              )}
              Validate
            </Button>
            <Button
              variant={"outline"}
              disabled={!stepsLength}
              className={`px-4 py-[14px] rounded text-[12px] ${
                !stepsLength
                  ? "border-[#A9A9A9] text-primary-gray cursor-not-allowed"
                  : "bg-white text-primary-gray hover:bg-white border-primary-gray"
              }`}
              onClick={onTemplateSave}
            >
              <Save className="w-[20px] h-[20px] mr-1" color={"#464646"} />
              Save As Template
            </Button>
            <Button
              onClick={onActivate}
              disabled={activationLoader}
              className={`px-4 py-[14px] rounded text-[12px] flex items-center hover:bg-brand-blue cursor-pointer ${
                validated
                  ? "bg-brand-blue text-white hover:bg-brand-blue"
                  : "bg-brand-blue text-white cursor-not-allowed"
              }`}
            >
              {activationLoader ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Play />
              )}
              Activate Workflow
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Button
              onClick={deactivateWorkflow}
              disabled={deactivateLoader}
              className={`px-4 py-[14px] rounded-[8px] text-[12px] flex items-center hover:bg-[#FC5A5A] cursor-pointer bg-[#FC5A5A] text-white`}
            >
              {deactivateLoader ? (
                <Loader2 className="animate-spin" />
              ) : (
                <TriangleAlert />
              )}
              Deactivate Workflow
            </Button>
          </div>
        )}
      </div>

      <GenericModal
        isOpen={deactivateModal}
        subTitle="Deactivate Workflow"
        description="Are you sure you want to deactivate this workflow?"
      >
        <div className="w-full">
          <Label className="text-primary-gray text-[15px] font-semibold mb-1">
            Reason for Deactivating
          </Label>
          <Textarea
            className="resize-none h-25 w-full focus-visible:ring-0"
            placeholder="Kindly state reason for deactivating"
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="mt-6 gap-[16px] flex justify-center items-center">
            <Button
              className="bg-[#FC5A5A] py-[24px] hover:bg-[#FC5A5A]"
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-brand-blue py-[24px] hover:bg-brand-blue"
              onClick={() => onDeactivate(reason)}
              disabled={deactivateLoader || reason.trim() === ""}
            >
              {deactivateLoader && <Loader2 className="animate-spin" />}
              Deactivate
            </Button>
          </div>
        </div>
      </GenericModal>

      {/* Confirm Save as Template */}
      <GenericModal
        isOpen={templateConfirmationModal}
        subTitle="Save as Template"
        description="Do you want to save this workflow as template?"
      >
        <div className="w-full">
          <div className="mt-6 gap-[16px] flex justify-center items-center">
            <Button
              className="bg-[#FC5A5A] py-[24px] hover:bg-[#FC5A5A]"
              onClick={() => setConfirmationModal(false)}
            >
              Cancel
            </Button>
            <LoaderButton
              buttonText="Save Template"
              isLoading={templateSaving}
              className="bg-brand-blue py-[24px] hover:bg-brand-blue"
              nextStep={handleSave}
            />
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default WorkflowHeader;
