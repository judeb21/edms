import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function Settings() {
  return (
    <div className="px-[24px]">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="text-muted-foreground mb-4 h-16 w-16" />
          <h3 className="mb-2 text-xl font-semibold">
            Settings Coming Soon
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}
