"use client";
import { useGetDocumentsIdQuery } from "@/hooks/api/useDocumentQuery";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function DocumentDetailsPage() {
  const params = useParams();

  const { data: documentDetails, isLoading } = useGetDocumentsIdQuery(
    params.id as string
  );

  console.log(documentDetails, "Documents");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <div className="text-center text-[18px]">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <div className="px-[24px]">
      <h4>Document details page</h4>
    </div>
  );
}
