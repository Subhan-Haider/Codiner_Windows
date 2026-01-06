import { Info, KeyRound, Trash2, Clipboard, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AzureConfiguration } from "./AzureConfiguration";
import { VertexConfiguration } from "./VertexConfiguration";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserSettings } from "@/lib/schemas";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { showError } from "@/lib/toast";

// Helper function to mask ENV API keys (move or duplicate if needed elsewhere)
const maskEnvApiKey = (key: string | undefined): string => {
  if (!key) return "Not Set";
  if (key.length < 8) return "****";
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

interface ApiKeyConfigurationProps {
  provider: string;
  providerDisplayName: string;
  settings: UserSettings | null | undefined;
  envVars: Record<string, string | undefined>;
  envVarName?: string;
  isSaving: boolean;
  saveError: string | null;
  apiKeyInput: string;
  onApiKeyInputChange: (value: string) => void;
  onSaveKey: (value: string) => Promise<void>;
  onDeleteKey: () => Promise<void>;
  isCodiner: boolean;
  updateSettings: (settings: Partial<UserSettings>) => Promise<UserSettings>;
}

export function ApiKeyConfiguration({
  provider,
  providerDisplayName,
  settings,
  envVars,
  envVarName,
  isSaving,
  saveError,
  apiKeyInput,
  onApiKeyInputChange,
  onSaveKey,
  onDeleteKey,
  isCodiner,
  updateSettings,
}: ApiKeyConfigurationProps) {
  // Special handling for Azure OpenAI which requires environment variables
  if (provider === "azure") {
    return (
      <AzureConfiguration
        settings={settings}
        envVars={envVars}
        updateSettings={updateSettings}
      />
    );
  }
  // Special handling for Google Vertex AI which uses service account credentials
  if (provider === "vertex") {
    return <VertexConfiguration />;
  }

  const envApiKey = envVarName ? envVars[envVarName] : undefined;
  const userApiKey = settings?.providerSettings?.[provider]?.apiKey?.value;

  const isValidUserKey =
    !!userApiKey &&
    !userApiKey.startsWith("Invalid Key") &&
    userApiKey !== "Not Set";
  const hasEnvKey = !!envApiKey;

  const activeKeySource = isValidUserKey
    ? "settings"
    : hasEnvKey
      ? "env"
      : "none";

  const defaultAccordionValue = [];
  if (isValidUserKey || !hasEnvKey) {
    defaultAccordionValue.push("settings-key");
  }
  if (!isCodiner && hasEnvKey) {
    defaultAccordionValue.push("env-key");
  }

  return (
    <div className="w-full space-y-6">
      <div className={cn(
        "p-10 rounded-[2.5rem] glass-card border-primary/20 bg-primary/5 flex flex-col items-center text-center transition-all duration-500",
        isValidUserKey && "ring-2 ring-primary/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)]"
      )}>
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="bg-primary/10 p-4 rounded-[1.5rem] text-primary">
            <KeyRound className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-black tracking-tight">API Key Management</h3>
            <p className="text-muted-foreground font-medium">Securely configure your access credentials</p>
          </div>
        </div>

        {isValidUserKey && (
          <div className="w-full max-w-2xl mb-10 p-6 rounded-[2rem] bg-white/50 dark:bg-black/20 border border-primary/10 backdrop-blur-md relative group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Currently Active Key</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-xs font-black text-green-600 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20">
                  <Circle className="h-2 w-2 fill-current animate-pulse-soft" />
                  STATION ONLINE
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDeleteKey}
                  disabled={isSaving}
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="font-mono text-lg break-all text-primary font-bold tracking-tight px-2">{userApiKey}</p>
          </div>
        )}

        <div className="w-full max-w-2xl space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="relative group">
                <Input
                  id="apiKeyInput"
                  value={apiKeyInput}
                  onChange={(e) => onApiKeyInputChange(e.target.value)}
                  placeholder={`Paste your ${providerDisplayName} key here`}
                  className={cn(
                    "h-16 pl-8 pr-16 rounded-[1.5rem] border-2 transition-all duration-500 bg-white/60 dark:bg-black/30 focus-visible:ring-offset-0 focus-visible:ring-primary/10 text-lg font-medium text-center",
                    saveError ? "border-red-500/50" : "border-primary/10 focus:border-primary/50"
                  )}
                />
                <button
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) onApiKeyInputChange(text);
                    } catch (error) {
                      showError("Clipboard access denied");
                    }
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all active:scale-90"
                  title="Paste from clipboard"
                >
                  <Clipboard className="h-6 w-6" />
                </button>
              </div>

              <Button
                onClick={() => onSaveKey(apiKeyInput)}
                disabled={isSaving || !apiKeyInput}
                className="h-16 w-full rounded-[1.5rem] text-lg font-black shadow-2xl transition-all duration-500 hover:scale-[1.01] active:scale-[0.98] premium-gradient border-none mb-4"
              >
                {isSaving ? "Syncing Credentials..." : "Activate API Key"}
              </Button>
            </div>
            {saveError && <p className="text-sm font-black text-red-500 mb-2">{saveError}</p>}
            <div className="flex items-center justify-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60">
              <Info className="h-3.5 w-3.5" />
              <span>AES-256 Cloud Encryption Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {!isCodiner && envVarName && (
        <div className={cn(
          "p-6 rounded-3xl border-2 transition-all duration-300",
          hasEnvKey
            ? "bg-muted/30 border-muted-foreground/10"
            : "bg-yellow-500/5 border-yellow-500/20"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2.5 rounded-xl",
                hasEnvKey ? "bg-muted-foreground/10" : "bg-yellow-500/10"
              )}>
                <Info className={cn(
                  "h-6 w-6",
                  hasEnvKey ? "text-muted-foreground" : "text-yellow-600"
                )} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Env Variable: {envVarName}</h3>
                <p className="text-xs font-medium text-muted-foreground">Managed via system environment</p>
              </div>
            </div>
            {hasEnvKey && activeKeySource === "env" && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <Circle className="h-2 w-2 fill-current animate-pulse-soft" />
                In Use
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/30 dark:bg-black/10 border border-muted-foreground/5 mb-4">
            <code className="text-sm font-mono break-all opacity-80">
              {hasEnvKey ? maskEnvApiKey(envApiKey) : "Variable not detected in system environment"}
            </code>
          </div>

          <p className="text-xs font-medium text-muted-foreground italic px-1 leading-relaxed opacity-70">
            {hasEnvKey
              ? activeKeySource === "settings"
                ? "This key is currently being overridden by the specific key set in your Settings above."
                : "This key is active because no override has been set in the Settings section above."
              : "To use this method, set the environment variable and restart the application."
            }
          </p>
        </div>
      )}
    </div>
  );
}
