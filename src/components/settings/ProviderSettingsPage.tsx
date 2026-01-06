import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useLanguageModelProviders } from "@/hooks/useLanguageModelProviders";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { } from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { showError } from "@/lib/toast";
import {
  UserSettings,
  AzureProviderSetting,
  VertexProviderSetting,
} from "@/lib/schemas";

import { ProviderSettingsHeader } from "./ProviderSettingsHeader";
import { ApiKeyConfiguration } from "./ApiKeyConfiguration";
import { ModelsSection } from "./ModelsSection";

interface ProviderSettingsPageProps {
  provider: string;
}

export function ProviderSettingsPage({ provider }: ProviderSettingsPageProps) {
  const {
    settings,
    envVars,
    loading: settingsLoading,
    error: settingsError,
    updateSettings,
  } = useSettings();

  // Fetch all providers
  const {
    data: allProviders,
    isLoading: providersLoading,
    error: providersError,
  } = useLanguageModelProviders();

  // Find the specific provider data from the fetched list
  const providerData = allProviders?.find((p) => p.id === provider);
  useEffect(() => {
    const layoutMainContentContainer = document.getElementById(
      "layout-main-content-container",
    );
    if (layoutMainContentContainer) {
      layoutMainContentContainer.scrollTo(0, 0);
    }
  }, [providerData?.id]);

  const supportsCustomModels =
    providerData?.type === "custom" || providerData?.type === "cloud";

  const isCodiner = provider === "auto";

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const router = useRouter();

  // Use fetched data (or defaults for Codiner)
  const providerDisplayName = isCodiner
    ? "Codiner"
    : (providerData?.name ?? "Unknown Provider");
  const providerWebsiteUrl = isCodiner
    ? "https://academy.codiner.online/settings"
    : providerData?.websiteUrl;
  const hasFreeTier = isCodiner ? false : providerData?.hasFreeTier;
  const envVarName = isCodiner ? undefined : providerData?.envVarName;

  // Use provider ID (which is the 'provider' prop)
  const userApiKey = settings?.providerSettings?.[provider]?.apiKey?.value;

  // --- Configuration Logic --- Updated Priority ---
  const isValidUserKey =
    !!userApiKey &&
    !userApiKey.startsWith("Invalid Key") &&
    userApiKey !== "Not Set";
  const hasEnvKey = !!(envVarName && envVars[envVarName]);

  const azureSettings = settings?.providerSettings?.azure as
    | AzureProviderSetting
    | undefined;
  const azureApiKeyFromSettings = (azureSettings?.apiKey?.value ?? "").trim();
  const azureResourceNameFromSettings = (
    azureSettings?.resourceName ?? ""
  ).trim();
  const azureHasSavedSettings = Boolean(
    azureApiKeyFromSettings && azureResourceNameFromSettings,
  );
  const azureHasEnvConfiguration = Boolean(
    envVars["AZURE_API_KEY"] && envVars["AZURE_RESOURCE_NAME"],
  );

  const vertexSettings = settings?.providerSettings?.vertex as
    | VertexProviderSetting
    | undefined;
  const isVertexConfigured = Boolean(
    vertexSettings?.projectId &&
    vertexSettings?.location &&
    vertexSettings?.serviceAccountKey?.value,
  );

  const isAzureConfigured =
    provider === "azure"
      ? azureHasSavedSettings || azureHasEnvConfiguration
      : false;

  const isConfigured =
    provider === "azure"
      ? isAzureConfigured
      : provider === "vertex"
        ? isVertexConfigured
        : isValidUserKey || hasEnvKey; // Configured if either is set

  // --- Save Handler ---
  const handleSaveKey = async (value: string) => {
    if (!value.trim()) {
      setSaveError("API Key cannot be empty.");
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      const settingsUpdate: Partial<UserSettings> = {
        providerSettings: {
          ...settings?.providerSettings,
          [provider]: {
            ...settings?.providerSettings?.[provider],
            apiKey: {
              value,
            },
          },
        },
      };
      if (isCodiner) {
        settingsUpdate.enableCodinerPro = true;
      }
      await updateSettings(settingsUpdate);
      setApiKeyInput(""); // Clear input on success
      // Optionally show a success message
    } catch (error: any) {
      console.error("Error saving API key:", error);
      setSaveError(error.message || "Failed to save API key.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Delete Handler ---
  const handleDeleteKey = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateSettings({
        providerSettings: {
          ...settings?.providerSettings,
          [provider]: {
            ...settings?.providerSettings?.[provider],
            apiKey: undefined,
          },
        },
      });
      // Optionally show a success message
    } catch (error: any) {
      console.error("Error deleting API key:", error);
      setSaveError(error.message || "Failed to delete API key.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Toggle Codiner Pro Handler ---
  const handleToggleCodinerPro = async (enabled: boolean) => {
    setIsSaving(true);
    try {
      await updateSettings({
        enableCodinerPro: enabled,
      });
    } catch (error: any) {
      showError(`Error toggling Codiner Pro: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Effect to clear input error when input changes
  useEffect(() => {
    if (saveError) {
      setSaveError(null);
    }
  }, [apiKeyInput]);

  // --- Loading State for Providers ---
  if (providersLoading) {
    return (
      <div className="min-h-screen px-4 md:px-12 py-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <Skeleton className="h-10 md:h-12 w-32 rounded-xl md:rounded-2xl" />
          <Skeleton className="h-48 md:h-64 w-full rounded-2xl md:rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Skeleton className="h-40 md:h-48 w-full rounded-2xl md:rounded-3xl" />
            <Skeleton className="h-40 md:h-48 w-full rounded-2xl md:rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // --- Error State for Providers ---
  if (providersError) {
    return (
      <div className="min-h-screen px-4 md:px-12 py-10">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => router.navigate({ to: "/settings" })}
            variant="ghost"
            className="flex items-center gap-2 mb-8 hover:bg-red-500/10 text-red-600 font-bold px-4 py-6 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
          <Alert variant="destructive" className="rounded-2xl md:rounded-3xl border-2 p-6 md:p-8 shadow-2xl">
            <AlertTriangle className="h-8 w-8 mb-4" />
            <AlertTitle className="text-xl md:text-2xl font-black tracking-tight mb-2">Error Loading Provider</AlertTitle>
            <AlertDescription className="text-sm md:text-lg font-medium opacity-90 leading-relaxed">
              {providersError.message}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Handle case where provider is not found (e.g., invalid ID in URL)
  if (!providerData && !isCodiner) {
    return (
      <div className="min-h-screen px-4 md:px-12 py-10">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => router.navigate({ to: "/settings" })}
            variant="ghost"
            className="flex items-center gap-2 mb-8 hover:bg-primary/10 text-primary font-bold px-4 py-6 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
          <div className="p-8 md:p-12 rounded-[2rem] md:rounded-3xl glass-card border-primary/20 text-center shadow-2xl">
            <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-6" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Provider Not Found</h1>
            <p className="text-sm md:text-lg text-muted-foreground font-medium mb-8">
              The AI provider "{provider}" could not be located in our system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-12 py-6 md:py-10 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <ProviderSettingsHeader
          providerDisplayName={providerDisplayName}
          isConfigured={isConfigured}
          isLoading={settingsLoading}
          hasFreeTier={hasFreeTier}
          providerWebsiteUrl={providerWebsiteUrl}
          isCodiner={isCodiner}
          onBackClick={() => router.navigate({ to: "/settings" })}
        />

        {settingsLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-3xl" />
          </div>
        ) : settingsError ? (
          <Alert variant="destructive" className="rounded-3xl border-2 shadow-xl p-6">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold">Settings Sync Error</AlertTitle>
            <AlertDescription className="font-medium">
              We couldn't synchronize your AI configuration: {settingsError.message}
            </AlertDescription>
          </Alert>
        ) : (
          <ApiKeyConfiguration
            provider={provider}
            providerDisplayName={providerDisplayName}
            settings={settings}
            envVars={envVars}
            envVarName={envVarName}
            isSaving={isSaving}
            saveError={saveError}
            apiKeyInput={apiKeyInput}
            onApiKeyInputChange={setApiKeyInput}
            onSaveKey={handleSaveKey}
            onDeleteKey={handleDeleteKey}
            isCodiner={isCodiner}
            updateSettings={updateSettings}
          />
        )}

        {isCodiner && !settingsLoading && (
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 bg-primary/5 rounded-[2rem] md:rounded-3xl border-2 border-primary/10 shadow-xl transition-all hover:border-primary/30 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-primary leading-none">Enable Codiner Pro</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm">
                Unlock advanced machine-learning orchestration and unlimited requests.
              </p>
            </div>
            <Switch
              checked={settings?.enableCodinerPro}
              onCheckedChange={handleToggleCodinerPro}
              disabled={isSaving}
              className="scale-125 md:scale-150"
            />
          </div>
        )}

        {/* Conditionally render CustomModelsSection */}
        {supportsCustomModels && providerData && (
          <ModelsSection providerId={providerData.id} />
        )}
        <div className="h-32"></div>
      </div>
    </div>
  );
}
