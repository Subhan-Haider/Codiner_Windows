import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { ImportAppDialog } from "./ImportAppDialog";

export function ImportAppButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="default"
          className="glass-card hover:bg-primary/10 hover:border-primary/30 transition-all duration-500 rounded-full px-8 py-6 group shadow-sm hover:shadow-md"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="bg-primary/10 p-2 rounded-full mr-3 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <Upload className="h-4 w-4" />
          </div>
          <span className="font-semibold text-primary">Import Existing App</span>
        </Button>
      </div>
      <ImportAppDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
