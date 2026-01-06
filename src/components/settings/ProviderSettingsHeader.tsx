import {
  ArrowLeft,
  ArrowUp,
  Circle,
  ExternalLink,
  GiftIcon,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IpcClient } from "@/ipc/ipc_client";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { } from "react";

interface ProviderSettingsHeaderProps {
  providerDisplayName: string;
  isConfigured: boolean;
  isLoading: boolean;
  hasFreeTier?: boolean;
  providerWebsiteUrl?: string;
  isCodiner: boolean;
  onBackClick: () => void;
}

function getKeyButtonText({
  isConfigured,
  isCodiner,
}: {
  isConfigured: boolean;
  isCodiner: boolean;
}) {
  if (isCodiner) {
    return isConfigured
      ? "Manage Codiner Pro Subscription"
      : "Setup Codiner Pro Subscription";
  }
  return isConfigured ? "Manage API Keys" : "Setup API Key";
}

export function ProviderSettingsHeader({
  providerDisplayName,
  isConfigured,
  isLoading,
  hasFreeTier,
  providerWebsiteUrl,
  isCodiner,
  onBackClick,
}: ProviderSettingsHeaderProps) {
  const handleGetApiKeyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (providerWebsiteUrl) {
      IpcClient.getInstance().openExternalUrl(providerWebsiteUrl);
    }
  };

  const ConfigureButton = (
    <Button
      onClick={handleGetApiKeyClick}
      className="mb-8 cursor-pointer py-7 w-full text-lg font-bold shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] premium-gradient border-none"
    >
      <KeyRound className="mr-3 h-6 w-6" />
      {getKeyButtonText({ isConfigured, isCodiner })}
      <ExternalLink className="ml-3 h-5 w-5 opacity-70" />
    </Button>
  );

  return (
    <>
      <Button
        onClick={onBackClick}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 mb-6 md:mb-8 hover:bg-primary/10 text-primary font-black px-4 md:px-5 py-5 md:py-6 rounded-xl transition-all active:scale-95 text-xs md:text-sm uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
        Back to Cluster
      </Button>

      <div className="relative mb-8 md:mb-10 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden glass-card border-primary/20 shadow-2xl flex flex-col items-center text-center">
        {/* Decorative background orb */}
        <div className="absolute -top-32 -right-32 w-64 md:w-80 h-64 md:h-80 bg-primary/20 rounded-full blur-[80px] md:blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-64 md:w-80 h-64 md:h-80 bg-purple-500/20 rounded-full blur-[80px] md:blur-[100px]" />

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="flex flex-col items-center gap-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gradient leading-tight">
                  Configure {providerDisplayName}
                </h1>
                {isLoading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <div className={cn(
                    "flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-black uppercase tracking-widest border-2 transition-all w-fit",
                    isConfigured
                      ? "bg-green-500/10 text-green-600 border-green-500/30"
                      : "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                  )}>
                    <Circle className={cn("h-2.5 w-2.5 md:h-3 md:w-3 fill-current animate-pulse-soft")} />
                    {isConfigured ? "Active" : "Not Set Up"}
                  </div>
                )}
              </div>
              <p className="text-sm md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                Connect your API access to unlock specialized Intelligence Units with {providerDisplayName}.
              </p>

              {!isLoading && hasFreeTier && (
                <div className="flex justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-bold bg-blue-100 dark:bg-blue-900/40 px-5 py-2.5 rounded-2xl inline-flex items-center shadow-sm border border-blue-200 dark:border-blue-800">
                    <GiftIcon className="w-4 h-4 mr-2" />
                    Free tier available
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {providerWebsiteUrl &&
        !isLoading &&
        (!isConfigured ? (
          <Popover defaultOpen>
            <PopoverTrigger asChild>{ConfigureButton}</PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="center"
              className="w-full max-w-sm py-4 px-5 glass-card text-primary shadow-2xl border-primary/30 animate-in fade-in slide-in-from-top-4 duration-500"
            >
              <div className="text-base font-bold flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <ArrowUp className="text-primary animate-bounce-soft" />
                </div>
                <span>Create your API key with {providerDisplayName}</span>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          ConfigureButton
        ))}
    </>
  );
}
