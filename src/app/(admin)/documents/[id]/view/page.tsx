"use client";
import { PageBreadcrumb } from "@/components/common/pageBreadCrumbs";
import { DocumentSwiperCard } from "@/components/documents/documentDetailsSwiperCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDocumentsIdQuery } from "@/hooks/api/useDocumentQuery";
import { DocumentFiles } from "@/types/documents";
import { formatFileSize } from "@/utils/formatFileSize";
import dayjs from "dayjs";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function DocumentDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const { data: documentDetails, isLoading } = useGetDocumentsIdQuery(
    params.id as string
  );

  const breadcrumbItems = [
    { label: "Document Management", href: "/overview" },
    { label: "Document" },
  ];

  const goBack = () => {
    router.push('/documents');
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

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
    <div className="bg-[#CCCCCC] min-h-screen font-[family-name:var(--font-dm)]">
      {/* Page Breadcrumbs */}
      <div className="flex justify-between items-center py-[20px] px-[40px] bg-white">
        <PageBreadcrumb items={breadcrumbItems} />

        {/* <Button
          className="bg-brand-blue hover:bg-brand-blue"
          onClick={goToNewDocument}
        >
          <Plus />
          Upload Document
        </Button> */}
      </div>

      {/* Page Body */}
      <div className="bg-white mt-1 p-8 min-h-screen">
        <div className="px-[12px]">
          <Button
            variant="ghost"
            className="group relative cursor-pointer !px-0 hover:bg-inherit"
            onClick={goBack}
          >
            <ArrowLeft
              color="#464646"
              className="translate-x-0 transition-all duration-500 ease-in-out group-hover:-translate-x-[0.9px]"
            />
            <span className="font-[family-name:var(--font-dm)] text-[#A9A9A9]">
              Back to document list
            </span>
          </Button>
        </div>

        {/* Content */}
        <div className="px-[12px] mt-4">
          <h4 className="text-[20px] font-semibold">Document Details</h4>

          <div className="my-[30px] translate-y-8">
            {documentDetails?.files.length === 1 && (
              <div>
                <Card
                  className={`h-[400px] border-0 shadow-md py-3 w-[80%] mx-auto`}
                >
                  <CardContent className="flex items-center justify-center h-full p-0">
                    {isImage(documentDetails?.files[0]?.blobPath) ? (
                      <Image
                        src={documentDetails?.files[0]?.blobPath}
                        alt="Documemt preview"
                        width={360}
                        height={120}
                        className="md:w-[400px] w-full h-full mx-auto object-contain rounded"
                      />
                    ) : (
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(documentDetails?.files[0]?.blobPath)}&embedded=true`}
                        className="w-[80%] h-[400px] mx-auto border rounded"
                        title={documentDetails?.files[0]?.blobPath}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* multiple file uploads */}
            {Number(documentDetails?.files?.length) > 1 && (
              <div className="w-[80%] mx-auto">
                <DocumentSwiperCard
                  files={documentDetails?.files as DocumentFiles[]}
                />
              </div>
            )}
          </div>

          <div className="mt-[70px]">
            <div className="grid grid-cols-2 gap-5 px-[30px]">
              <div className="">
                <h4 className="font-semibold mb-[8px] capitalize">
                  Document Title
                </h4>
                <p className="font-medium text-primary-gray text-[14px]">
                  {documentDetails?.title}
                </p>
              </div>
              <div className="text-right">
                <h4 className="font-semibold mb-[8px] capitalize">
                  Department
                </h4>
                <p className="font-medium text-primary-gray text-[14px]">
                  {documentDetails?.department}
                </p>
              </div>
              <div className="">
                <h4 className="font-semibold mb-[8px] capitalize">Date</h4>
                <p className="font-medium text-primary-gray text-[14px]">
                  {dayjs(documentDetails?.files[0]?.createdAt).format(
                    "DD MMMM, YYYY"
                  )}
                </p>
              </div>
              <div className="text-right">
                <h4 className="font-semibold mb-[8px] capitalize">Category</h4>
                <p className="font-medium text-primary-gray text-[14px]">
                  {documentDetails?.category}
                </p>
              </div>
              <div className="">
                <h4 className="font-semibold mb-[8px] capitalize">
                  Properties
                </h4>
                <p className="font-medium text-primary-gray text-[14px]">
                  <span>
                    {" "}
                    {formatFileSize(
                      Number(
                        documentDetails?.files?.reduce(
                          (acc, f) => acc + f.fileSize,
                          0
                        )
                      )
                    )}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <h4 className="font-semibold mb-[8px] capitalize">status</h4>
                <p className="font-medium text-primary-gray text-[14px]">
                  <span>{documentDetails?.status}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
