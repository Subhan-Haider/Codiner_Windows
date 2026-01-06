import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Info, KeyRound, Globe, Server, ShieldCheck, Activity } from "lucide-react";
import type { AzureProviderSetting, UserSettings } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface AzureConfigurationProps {
  settings: UserSettings | null | undefined;
  envVars: Record<string, string | undefined>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<UserSettings>;
}

const AZURE_API_KEY_VAR = "AZURE_API_KEY";
const AZURE_RESOURCE_NAME_VAR = "AZURE_RESOURCE_NAME";

export function AzureConfiguration({
  settings,
  envVars,
  updateSettings,
}: AzureConfigurationProps) {
  const existing =
    (settings?.providerSettings?.azure as AzureProviderSetting | undefined) ??
    {};
  const existingApiKey = existing.apiKey?.value ?? "";
  const existingResourceName = existing.resourceName ?? "";

  const [apiKey, setApiKey] = useState(existingApiKey);
  const [resourceName, setResourceName] = useState(existingResourceName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(existingApiKey);
    setResourceName(existingResourceName);
  }, [existingApiKey, existingResourceName]);

  const envApiKey = envVars[AZURE_API_KEY_VAR];
  const envResourceName = envVars[AZURE_RESOURCE_NAME_VAR];

  const hasSavedSettings = Boolean(existingApiKey && existingResourceName);
  const hasEnvConfiguration = Boolean(envApiKey && envResourceName);
  const isConfigured = hasSavedSettings || hasEnvConfiguration;
  const usingEnvironmentOnly = hasEnvConfiguration && !hasSavedSettings;

  const hasUnsavedChanges = useMemo(() => {
    return apiKey !== existingApiKey || resourceName !== existingResourceName;
  }, [apiKey, existingApiKey, resourceName, existingResourceName]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const trimmedApiKey = apiKey.trim();
      const trimmedResourceName = resourceName.trim();

      const azureSettings: AzureProviderSetting = {
        ...existing,
      };

      if (trimmedResourceName) {
        azureSettings.resourceName = trimmedResourceName;
      } else {
        delete azureSettings.resourceName;
      }

      if (trimmedApiKey) {
        azureSettings.apiKey = { value: trimmedApiKey };
      } else {
        delete azureSettings.apiKey;
      }

      const providerSettings = {
        ...settings?.providerSettings,
        azure: azureSettings,
      };

      await updateSettings({
        providerSettings,
      });

      setSaved(true);
    } catch (e: any) {
      setError(e?.message || "Failed to save Azure settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Status indicator */}
        <div className={cn(
          "rounded-[2.5rem] p-10 border-2 transition-all duration-500 shadow-2xl flex flex-col items-center text-center space-y-6",
          isConfigured
            ? "bg-primary/5 border-primary/20"
            : "bg-orange-500/5 border-orange-500/20"
        )}>
          <div className={cn(
            "p-5 rounded-[2rem]",
            isConfigured ? "bg-primary/10" : "bg-orange-500/10"
          )}>
            {isConfigured ? (
              <ShieldCheck className="h-10 w-10 text-primary" />
            ) : (
              <Activity className="h-10 w-10 text-orange-600 animate-pulse" />
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-gradient">
              {isConfigured ? "Azure Integration Active" : "Authentication Required"}
            </h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-lg">
              {isConfigured
                ? "Your enterprise Azure OpenAI resource is successfully synchronized with the Codiner engine."
                : "Enter your Microsoft Azure resource identity and secure credentials to unlock cloud models."}
            </p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="glass-card border-primary/20 p-10 rounded-[3.5rem] shadow-2xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Globe className="h-4 w-4 text-primary opacity-60" />
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Resource Identity</label>
              </div>
              <Input
                value={resourceName}
                onChange={(e) => {
                  setResourceName(e.target.value);
                  setSaved(false);
                  setError(null);
                }}
                placeholder="azure-resource-id"
                className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-primary/10 transition-all focus:border-primary/50 text-center font-bold"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <KeyRound className="h-4 w-4 text-primary opacity-60" />
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Secret Key</label>
              </div>
              <Input
                value={apiKey}
                type="password"
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setSaved(false);
                  setError(null);
                }}
                placeholder="••••••••••••••••"
                className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-primary/10 transition-all focus:border-primary/50 text-center font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-6 border-t border-primary/5">
            <Button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className="h-16 px-12 rounded-2xl font-black text-lg premium-gradient shadow-2xl transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
            >
              {saving ? "Authenticating..." : "Connect Azure Engine"}
            </Button>

            {saved && !error && (
              <div className="flex items-center gap-2 text-green-600 bg-green-500/10 px-6 py-2 rounded-full border border-green-500/20 font-black text-sm uppercase tracking-widest animate-in zoom-in-50">
                <CheckCircle2 className="h-4 w-4" />
                Securely Synchronized
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-3xl border-2 p-6 shadow-xl">
              <Info className="h-6 w-6" />
              <AlertTitle className="text-xl font-bold">Authentication Failure</AlertTitle>
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="env-vars" className="border-none">
              <AccordionTrigger className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:no-underline opacity-60 hover:opacity-100 transition-opacity">
                ADVANCED ENVIRONMENT ARCHITECTURE
              </AccordionTrigger>
              <AccordionContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <span className="font-mono text-xs opacity-60">{AZURE_RESOURCE_NAME_VAR}</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      envResourceName ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    )}>
                      {envResourceName ? "Detected" : "Missing"}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                    <span className="font-mono text-xs opacity-60">{AZURE_API_KEY_VAR}</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      envApiKey ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    )}>
                      {envApiKey ? "Detected" : "Missing"}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground px-2 italic opacity-60 leading-relaxed">
                  System-level environment variables provide a secondary configuration layer. Manual overrides in Settings will always take precedence for the current session.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
