import { useState } from "react";
import { AlertTriangle, PlusIcon, TrashIcon, Cpu, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateCustomModelDialog } from "@/components/CreateCustomModelDialog";
import { EditCustomModelDialog } from "@/components/EditCustomModelDialog";
import { useLanguageModelsForProvider } from "@/hooks/useLanguageModelsForProvider";
import { useDeleteCustomModel } from "@/hooks/useDeleteCustomModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface ModelsSectionProps {
  providerId: string;
}

export function ModelsSection({ providerId }: ModelsSectionProps) {
  const [isCustomModelDialogOpen, setIsCustomModelDialogOpen] = useState(false);
  const [isEditModelDialogOpen, setIsEditModelDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [modelToEdit, setModelToEdit] = useState<any | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const invalidateModels = () => {
    queryClient.invalidateQueries({
      queryKey: ["language-models", providerId],
    });
    queryClient.invalidateQueries({
      queryKey: ["language-models-by-providers"],
    });
  };

  const {
    data: models,
    isLoading: modelsLoading,
    error: modelsError,
  } = useLanguageModelsForProvider(providerId);

  const { mutate: deleteModel, isPending: isDeleting } = useDeleteCustomModel({
    onSuccess: () => {
      invalidateModels();
    },
    onError: (error: Error) => {
      console.error("Failed to delete model:", error);
    },
  });

  const handleDeleteClick = (modelApiName: string) => {
    setModelToDelete(modelApiName);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleEditClick = (model: any) => {
    setModelToEdit(model);
    setIsEditModelDialogOpen(true);
  };

  const handleModelClick = (modelApiName: string) => {
    setSelectedModel(selectedModel === modelApiName ? null : modelApiName);
  };

  const handleModelDoubleClick = (model: any) => {
    if (model.type === "custom") {
      handleEditClick(model);
    }
  };

  const handleConfirmDelete = () => {
    if (modelToDelete) {
      deleteModel({ providerId, modelApiName: modelToDelete });
      setModelToDelete(null);
    }
    setIsConfirmDeleteDialogOpen(false);
  };

  return (
    <div className="mt-16 pt-12 border-t border-primary/10 flex flex-col items-center">
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <div className="space-y-3">
          <h2 className="text-4xl font-black tracking-tight text-gradient">AI Model Engine</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl text-center">
            Configure specifically engineered models to power your development orchestration.
          </p>
        </div>
        {providerId !== "auto" && (
          <Button
            onClick={() => setIsCustomModelDialogOpen(true)}
            className="rounded-[1.5rem] h-16 px-10 font-black shadow-2xl transition-all duration-500 hover:scale-[1.05] active:scale-[0.95] premium-gradient border-none"
          >
            <PlusIcon className="mr-2 h-6 w-6" /> Add Custom Model
          </Button>
        )}
      </div>

      {modelsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      )}

      {modelsError && (
        <Alert variant="destructive" className="rounded-2xl border-2 w-full">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Error Loading Models</AlertTitle>
          <AlertDescription className="font-medium">{modelsError.message}</AlertDescription>
        </Alert>
      )}

      {!modelsLoading && !modelsError && models && models.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {models.map((model) => (
            <div
              key={model.apiName + model.displayName}
              className={cn(
                "group relative p-6 rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden",
                "bg-white/40 dark:bg-zinc-900/40 border-2 backdrop-blur-md",
                selectedModel === model.apiName
                  ? "border-primary shadow-2xl ring-4 ring-primary/10"
                  : "border-primary/10 hover:border-primary/30 hover:shadow-xl hover:translate-y-[-4px]"
              )}
              onClick={() => handleModelClick(model.apiName)}
              onDoubleClick={() => handleModelDoubleClick(model)}
            >
              {/* Subtle background decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                {model.type === "cloud" ? <Cpu className="w-16 h-16" /> : <Sparkles className="w-16 h-16" />}
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-primary tracking-tight">
                      {model.displayName}
                    </h4>
                    <p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 w-fit px-2 py-0.5 rounded-md">
                      {model.apiName}
                    </p>
                  </div>
                  {model.type === "custom" && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(model);
                        }}
                        className="bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl h-10 w-10 transition-all shadow-sm"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(model.apiName);
                        }}
                        disabled={isDeleting}
                        className="bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white rounded-xl h-10 w-10 transition-all shadow-sm"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>

                {model.description && (
                  <p className="text-base text-muted-foreground font-medium mb-4 line-clamp-2 leading-relaxed">
                    {model.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {model.contextWindow && (
                    <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-0.5">Context</p>
                      <p className="text-sm font-bold text-primary">{model.contextWindow.toLocaleString()} tokens</p>
                    </div>
                  )}
                  {model.maxOutputTokens && (
                    <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground mb-0.5">Max Output</p>
                      <p className="text-sm font-bold text-purple-600">{model.maxOutputTokens.toLocaleString()} tokens</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    model.type === "cloud"
                      ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/30"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                  )}>
                    {model.type === "cloud" ? "Built-in Engine" : "Custom Model"}
                  </span>

                  {model.tag && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 shadow-sm">
                      {model.tag}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!modelsLoading && !modelsError && (!models || models.length === 0) && (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 w-full">
          <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Layers className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No custom models yet</h3>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">
            Add your own fine-tuned models or custom deployments to expand your AI capabilities.
          </p>
        </div>
      )}

      {/* Render the dialogs */}
      <CreateCustomModelDialog
        isOpen={isCustomModelDialogOpen}
        onClose={() => setIsCustomModelDialogOpen(false)}
        onSuccess={() => {
          setIsCustomModelDialogOpen(false);
          invalidateModels();
        }}
        providerId={providerId}
      />

      <EditCustomModelDialog
        isOpen={isEditModelDialogOpen}
        onClose={() => setIsEditModelDialogOpen(false)}
        onSuccess={() => {
          setIsEditModelDialogOpen(false);
          invalidateModels();
        }}
        providerId={providerId}
        model={modelToEdit}
      />

      <AlertDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this model?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              custom model "
              {modelToDelete
                ? models?.find((m) => m.apiName === modelToDelete)
                  ?.displayName || modelToDelete
                : ""}
              " (API Name: {modelToDelete}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setModelToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Yes, delete it"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
