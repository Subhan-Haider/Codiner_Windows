import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { providerSettingsRoute } from "@/routes/settings/providers/$provider";
import type { LanguageModelProvider } from "@/ipc/ipc_types";

import { useLanguageModelProviders } from "@/hooks/useLanguageModelProviders";
import { useCustomLanguageModelProvider } from "@/hooks/useCustomLanguageModelProvider";
import { GiftIcon, PlusIcon, Trash2, Edit, Cpu, Sparkles, Circle, ExternalLink, KeyRound, ArrowRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CreateCustomProviderDialog } from "./CreateCustomProviderDialog";
import { cn } from "@/lib/utils";

// Real Logo Components (Stylized SVGs)
const ProviderLogo = ({ providerId, className }: { providerId: string; className?: string }) => {
  const normalizedId = providerId.toLowerCase();

  if (normalizedId.includes("openai")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5153-4.9066 6.0462 6.0462 0 0 0-3.9998-3.0447 5.9662 5.9662 0 0 0-5.454.9136 6.0462 6.0462 0 0 0-3.8443-1.637 5.9662 5.9662 0 0 0-4.9066.5153 6.0462 6.0462 0 0 0-3.0447 4.0001 5.9662 5.9662 0 0 0 .9136 5.454 6.0462 6.0462 0 0 0 1.637 3.844 5.9662 5.9662 0 0 0 .5153 4.907 6.0462 6.0462 0 0 0 4.0001 3.0447 5.9662 5.9662 0 0 0 5.454-.9136 6.0462 6.0462 0 0 0 3.844 1.637 5.9662 5.9662 0 0 0 4.9069-.5153 6.0462 6.0462 0 0 0 3.0447-4.0001 5.9662 5.9662 0 0 0-.9136-5.454 6.0462 6.0462 0 0 0-1.637-3.8443zm-8.816 8.1905a3.1325 3.1325 0 0 1-2.2825-1.0202l3.4346-1.983a.0935.0935 0 0 0 .0467-.0809v-4.8569l1.455.84a.0935.0935 0 0 1 .0467.081v3.9515a3.1396 3.1396 0 0 1-2.698 3.0685l-.0025.0001zm-7.8207-1.3438a3.1325 3.1325 0 0 1-.2253-2.4938l3.4346-1.983a.0935.0935 0 0 0 .0467-.0809V7.2432l-1.455-.84a.0935.0935 0 0 1-.0467-.081V2.3707a3.1396 3.1396 0 0 1 3.8643-.9185l.0025.0001-3.6195 6.4674a3.1325 3.1325 0 0 1-2.2825 1.0202l3.4346-1.983a.0935.0935 0 0 0 .0467-.0809v-4.8569l1.455.84a.0935.0935 0 0 1 .0467.081v3.9515a3.1396 3.1396 0 0 1-2.698 3.0685l-.0025.0001z" />
      </svg>
    );
  }

  if (normalizedId.includes("anthropic")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 18H4l8-18z" />
        <path d="M7 16h10" />
      </svg>
    );
  }

  if (normalizedId.includes("google") || normalizedId.includes("vertex")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.901 3.323-2.028 4.414a8.04 8.04 0 01-5.812 2.306c-4.632 0-8.432-3.755-8.432-8.38s3.8-8.38 8.432-8.38c2.511 0 4.331 1 5.672 2.275L20.5 3.975A12.067 12.067 0 0012.48 1C5.58 1 0 6.58 0 13.5S5.58 26 12.48 26c3.75 0 6.58-1.241 8.775-3.535 2.261-2.261 2.972-5.432 2.972-8.046 0-.773-.06-1.505-.18-2.221H12.48z" />
      </svg>
    );
  }

  if (normalizedId.includes("huggingface")) {
    return (
      <span className={cn("text-3xl leading-none", className)}>🤗</span>
    );
  }

  if (normalizedId.includes("deepseek")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-2-13l6 5-6 5V7z" />
      </svg>
    );
  }

  if (normalizedId.includes("openrouter")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  if (normalizedId.includes("azure")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M6.3 3L0 18.5h6.1L8.5 21l8.5-12.8L24 18.5h-5.9L12.4 8.7 6.3 3z" />
      </svg>
    );
  }

  if (normalizedId.includes("xai")) {
    return (
      <span className={cn("font-black italic text-3xl", className)}>𝕏</span>
    );
  }

  if (normalizedId.includes("bedrock") || normalizedId.includes("aws")) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M3 14v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
        <path d="M3 12h18" />
        <path d="M12 3v18" />
      </svg>
    );
  }

  if (normalizedId === "auto") {
    return (
      <div className={cn("relative", className)}>
        <Cpu className="w-full h-full text-indigo-500" />
        <Sparkles className="absolute -top-1 -right-1 w-1/2 h-1/2 text-purple-600 animate-pulse" />
      </div>
    );
  }

  return <Cpu className={cn("text-primary/40", className)} />;
};

export function ProviderSettingsGrid() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] =
    useState<LanguageModelProvider | null>(null);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);

  const {
    data: providers,
    isLoading,
    error,
    isProviderSetup,
    refetch,
  } = useLanguageModelProviders();

  const { deleteProvider, isDeleting } = useCustomLanguageModelProvider();

  const handleProviderClick = (providerId: string) => {
    navigate({
      to: "/settings/providers/$provider",
      params: { provider: providerId },
    });
  };

  const handleDeleteProvider = async () => {
    if (providerToDelete) {
      await deleteProvider(providerToDelete);
      setProviderToDelete(null);
      refetch();
    }
  };

  const handleEditProvider = (provider: LanguageModelProvider) => {
    setEditingProvider(provider);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Skeleton key={i} className="h-48 md:h-56 w-full rounded-[2rem] md:rounded-[3rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-12 flex flex-col items-center text-center">
        <Alert variant="destructive" className="rounded-[2rem] md:rounded-[3rem] border-2 p-6 md:p-10 shadow-2xl max-w-2xl">
          <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 mb-4" />
          <AlertTitle className="text-xl md:text-2xl font-black mb-2 tracking-tight">Cloud Synchronization Error</AlertTitle>
          <AlertDescription className="font-medium text-sm md:text-lg opacity-90 leading-relaxed">
            {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
        {providers
          ?.filter((p) => p.type !== "local")
          .map((provider: LanguageModelProvider) => {
            const isCustom = provider.type === "custom";
            const isSetup = isProviderSetup(provider.id);

            return (
              <div
                key={provider.id}
                className={cn(
                  "group relative p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] transition-all duration-500 cursor-pointer overflow-hidden",
                  "bg-white/40 dark:bg-zinc-900/40 border-2 backdrop-blur-md flex flex-col items-center text-center",
                  isSetup
                    ? "border-primary/10 hover:border-primary opacity-100 hover:shadow-[0_30px_60px_-15px_rgba(var(--primary-rgb),0.3)]"
                    : "border-orange-500/10 hover:border-orange-500 opacity-90 hover:opacity-100 hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.2)]"
                )}
                onClick={() => handleProviderClick(provider.id)}
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 group-hover:scale-150 group-hover:rotate-12">
                  <ProviderLogo providerId={provider.id} className="w-40 h-40" />
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-6 w-full">
                  <div className="bg-primary/5 p-5 rounded-[2rem] group-hover:bg-primary/10 transition-colors shadow-inner">
                    <ProviderLogo providerId={provider.id} className="w-10 h-10 text-primary" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-primary tracking-tight leading-none group-hover:scale-105 transition-transform">
                      {provider.name}
                    </h3>
                    <div className={cn(
                      "flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all",
                      isSetup
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                    )}>
                      <Circle className={cn("h-2.5 w-2.5 fill-current", isSetup && "animate-pulse-soft")} />
                      {isSetup ? "Operational" : "Configure Required"}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 mt-auto">
                    {provider.hasFreeTier && (
                      <span className="px-3 py-1 bg-blue-500/5 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-500/10 backdrop-blur-sm">
                        Free Access
                      </span>
                    )}
                    <span className="px-3 py-1 bg-zinc-500/5 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-zinc-500/10">
                      {provider.type === "custom" ? "Custom LLM" : provider.id === 'auto' ? "Optimized" : "Cloud Native"}
                    </span>
                  </div>

                  <div className="pt-6 w-full flex items-center justify-center border-t border-primary/5 group-hover:border-primary/20 transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary flex items-center gap-2 transition-all">
                      Connect Engine <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {isCustom && (
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProvider(provider);
                      }}
                      className="h-8 w-8 bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProviderToDelete(provider.id);
                      }}
                      className="h-8 w-8 bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white rounded-xl"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

        {/* Add custom provider button */}
        <div
          className="group relative p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] transition-all duration-500 cursor-pointer overflow-hidden border-2 border-dashed border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 min-h-[14rem] md:min-h-[16rem]"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="bg-primary/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] group-hover:scale-110 group-hover:rotate-90 transition-all duration-700 shadow-xl border border-primary/10">
            <PlusIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-lg md:text-xl font-black text-primary tracking-tight">Expand Portfolio</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium max-w-[10rem] md:max-w-[12rem] mx-auto leading-relaxed">
              Register localized or proprietary LLM endpoints for unified access.
            </p>
          </div>
        </div>
      </div>

      <CreateCustomProviderDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingProvider(null);
        }}
        onSuccess={() => {
          setIsDialogOpen(false);
          refetch();
          setEditingProvider(null);
        }}
        editingProvider={editingProvider}
      />

      <AlertDialog
        open={!!providerToDelete}
        onOpenChange={(open) => !open && setProviderToDelete(null)}
      >
        <AlertDialogContent className="rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border-2 shadow-2xl flex flex-col items-center text-center max-w-[90vw] md:max-w-lg">
          <AlertDialogHeader className="space-y-4 md:space-y-6">
            <div className="bg-red-500/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] w-fit mx-auto shadow-inner border border-red-500/10">
              <Trash2 className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <AlertDialogTitle className="text-2xl md:text-3xl font-black tracking-tight">Decommission Provider?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm md:text-lg font-medium opacity-80 leading-relaxed max-w-sm mx-auto">
                This will permanently purge this integration and all specialized models within. This operation is non-reversible.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 md:mt-10 gap-3 md:gap-4 w-full flex-col sm:flex-row justify-center">
            <AlertDialogCancel disabled={isDeleting} className="h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl font-bold bg-muted/50">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProvider}
              disabled={isDeleting}
              className="h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl font-black bg-red-600 hover:bg-red-700 shadow-xl shadow-red-500/20 min-w-[160px] md:min-w-[200px]"
            >
              {isDeleting ? "Decommissioning..." : "Confirm Purge"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
