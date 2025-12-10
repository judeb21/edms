"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DocumentFiles } from "@/types/documents";
import Image from "next/image";

type SwiperCardProp = {
  files: DocumentFiles[];
};

export function DocumentSwiperCard({ files }: SwiperCardProp) {
  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  return (
    <Carousel className="w-full max-w-full">
      <CarouselContent>
        {files.map((file, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className={`h-[400px] border-0 shadow-md p-0`}>
                <CardContent className="flex items-center justify-center h-full p-0">
                  {isImage(file.blobPath) ? (
                    <Image
                      src={file.blobPath}
                      alt="Document preview"
                      width={360}
                      height={120}
                      className="md:w-[400px] w-full mx-auto object-cover rounded"
                    />
                  ) : (
                    <iframe
                      src={file?.blobPath}
                      className="w-full h-[400px] mx-auto border rounded"
                      title={file.blobPath}
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
