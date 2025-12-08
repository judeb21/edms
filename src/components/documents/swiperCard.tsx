"use client";

import { UploadFile } from "@/app/(admin)/documents/new/page";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

type SwiperCardProp = {
  files: UploadFile[];
};

export function SwiperCard({ files }: SwiperCardProp) {
  const documentIsImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  return (
    <Carousel className="w-full max-w-full">
      <CarouselContent>
        {files.map((file, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="h-[300px] border-0 shadow-md p-0">
                <CardContent className="flex items-center justify-center h-full p-0">
                  {documentIsImage(file.file) ? (
                    <Image
                      src={file.previewUrl}
                      alt="Document preview"
                      width={32}
                      height={32}
                      className="w-full h-[300px] mx-auto object-cover rounded"
                    />
                  ) : (
                    <iframe
                      src={file?.previewUrl}
                      className="w-full h-[300px] mx-auto border rounded"
                      title={file.file.name}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
