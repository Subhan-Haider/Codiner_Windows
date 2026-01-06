import React, { useState, useEffect } from "react";
import { usePrompts } from "@/hooks/usePrompts";
import {
  CreatePromptDialog,
  CreateOrEditPromptDialog,
} from "@/components/CreatePromptDialog";
import { DeleteConfirmationDialog } from "@/components/DeleteConfirmationDialog";
import { useDeepLink } from "@/contexts/DeepLinkContext";
import { AddPromptDeepLinkData } from "@/ipc/deep_link_data";
import { showInfo } from "@/lib/toast";

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LibraryPage() {
  const { prompts, isLoading, createPrompt, updatePrompt, deletePrompt } =
    usePrompts();
  const { lastDeepLink, clearLastDeepLink } = useDeepLink();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [prefillData, setPrefillData] = useState<
    | {
      title: string;
      description: string;
      content: string;
    }
    | undefined
  >(undefined);

  useEffect(() => {
    const handleDeepLink = async () => {
      if (lastDeepLink?.type === "add-prompt") {
        const deepLink = lastDeepLink as AddPromptDeepLinkData;
        const payload = deepLink.payload;
        showInfo(`Prefilled prompt: ${payload.title}`);
        setPrefillData({
          title: payload.title,
          description: payload.description,
          content: payload.content,
        });
        setDialogOpen(true);
        clearLastDeepLink();
      }
    };
    handleDeepLink();
  }, [lastDeepLink?.timestamp, clearLastDeepLink]);

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Clear prefill data when dialog closes
      setPrefillData(undefined);
    }
  };

  return (
    <div className="min-h-screen px-8 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-start gap-4 mb-6">
          <h1 className="text-3xl font-bold text-[#1a1b4b]">Library: Prompts</h1>
          <CreateOrEditPromptDialog
            mode="create"
            onCreatePrompt={createPrompt}
            prefillData={prefillData}
            isOpen={dialogOpen}
            onOpenChange={handleDialogClose}
            trigger={
              <Button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md px-4 py-2 h-auto text-sm font-medium transition-colors">
                <Plus className="mr-2 h-4 w-4" /> New Prompt
              </Button>
            }
          />
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Sparkles className="w-8 h-8 text-[#7c3aed]" />
            </div>
            <h3 className="text-xl font-bold mb-2">No prompts yet</h3>
            <p className="text-muted-foreground max-w-sm mb-8 text-base">
              Create reusable prompts to speed up your specific tasks.
            </p>
            <Button
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-md px-6 py-2 h-auto text-base font-medium shadow-md transition-all hover:scale-105"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" /> Create Your First Prompt
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {prompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onUpdate={updatePrompt}
                onDelete={deletePrompt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PromptCard({
  prompt,
  onUpdate,
  onDelete,
}: {
  prompt: {
    id: number;
    title: string;
    description: string | null;
    content: string;
  };
  onUpdate: (p: {
    id: number;
    title: string;
    description?: string;
    content: string;
  }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  return (
    <div
      data-testid="prompt-card"
      className="border rounded-lg p-4 bg-(--background-lightest) min-w-80"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{prompt.title}</h3>
            {prompt.description && (
              <p className="text-sm text-muted-foreground">
                {prompt.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <CreateOrEditPromptDialog
              mode="edit"
              prompt={prompt}
              onUpdatePrompt={onUpdate}
            />
            <DeleteConfirmationDialog
              itemName={prompt.title}
              itemType="Prompt"
              onDelete={() => onDelete(prompt.id)}
            />
          </div>
        </div>
        <pre className="text-sm whitespace-pre-wrap bg-transparent border rounded p-2 max-h-48 overflow-auto">
          {prompt.content}
        </pre>
      </div>
    </div>
  );
}
