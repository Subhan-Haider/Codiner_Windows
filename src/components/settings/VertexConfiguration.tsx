import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, Cloud, MapPin, KeyRound, ShieldAlert } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import type { UserSettings, VertexProviderSetting } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function VertexConfiguration() {
  const { settings, updateSettings } = useSettings();
  const existing =
    (settings?.providerSettings?.vertex as VertexProviderSetting) ?? {};

  const [projectId, setProjectId] = useState(existing.projectId || "");
  const [location, setLocation] = useState(existing.location || "");
  const [serviceAccountKey, setServiceAccountKey] = useState(
    existing.serviceAccountKey?.value || "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProjectId(existing.projectId || "");
    setLocation(existing.location || "");
    setServiceAccountKey(existing.serviceAccountKey?.value || "");
  }, [settings?.providerSettings?.vertex]);

  const onSave = async () => {
    setError(null);
    setSaved(false);
    try {
      if (serviceAccountKey) {
        JSON.parse(serviceAccountKey);
      }
    } catch (e: any) {
      setError("Service account JSON is invalid: " + e.message);
      return;
    }

    setSaving(true);
    try {
      const settingsUpdate: Partial<UserSettings> = {
        providerSettings: {
          ...settings?.providerSettings,
          vertex: {
            ...existing,
            projectId: projectId.trim() || undefined,
            location: location || undefined,
            serviceAccountKey: serviceAccountKey
              ? { value: serviceAccountKey }
              : undefined,
          },
        },
      };
      await updateSettings(settingsUpdate);
      setSaved(true);
    } catch (e: any) {
      setError(e?.message || "Failed to save Vertex settings");
    } finally {
      setSaving(false);
    }
  };

  const isConfigured = Boolean(
    (projectId.trim() && location && serviceAccountKey) ||
    (existing.projectId &&
      existing.location &&
      existing.serviceAccountKey?.value),
  );

  return (
    <div className="space-y-10 flex flex-col items-center">
      <div className="w-full max-w-3xl glass-card border-primary/20 p-10 rounded-[3rem] shadow-2xl space-y-10 bg-primary/5">
        <div className="flex flex-col items-center text-center space-y-4 mb-4">
          <div className="bg-primary/10 p-4 rounded-3xl">
            <Cloud className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gradient">Vertex AI Enterprise</h2>
            <p className="text-muted-foreground font-medium">Configure Google Cloud platform orchestration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <KeyRound className="h-4 w-4 text-primary opacity-60" />
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Project Identifier</label>
            </div>
            <Input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="gcp-project-id"
              className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-primary/10 transition-all focus:border-primary/50 text-center font-bold"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <MapPin className="h-4 w-4 text-primary opacity-60" />
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Regional Deployment</label>
            </div>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="us-central1"
              className="h-14 rounded-2xl bg-white/50 dark:bg-black/20 border-primary/10 transition-all focus:border-primary/50 text-center font-bold"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Binary className="h-4 w-4 text-primary opacity-60" xmlns="http://www.w3.org/2000/svg" />
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Service Account Credentials (JSON)</label>
          </div>
          <Textarea
            value={serviceAccountKey}
            onChange={(e) => setServiceAccountKey(e.target.value)}
            placeholder="Paste your Google Cloud Service Account JSON key content here..."
            className="min-h-48 rounded-3xl bg-white/50 dark:bg-black/20 border-primary/10 p-6 font-mono text-sm leading-relaxed transition-all focus:border-primary/50 shadow-inner"
          />
        </div>

        <div className="flex flex-col items-center gap-6 pt-6 border-t border-primary/5">
          <Button
            onClick={onSave}
            disabled={saving}
            className="h-16 px-12 rounded-2xl font-black text-lg premium-gradient shadow-2xl transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
          >
            {saving ? "Deploying Configuration..." : "Initialize Cloud Hub"}
          </Button>

          {saved && !error && (
            <div className="flex items-center gap-2 text-green-600 bg-green-500/10 px-6 py-2 rounded-full border border-green-500/20 font-black text-sm uppercase tracking-widest animate-in zoom-in-50">
              <CheckCircle2 className="h-4 w-4" />
              Synchronization Complete
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-3xl border-2 p-6 shadow-xl animate-in shake-in duration-300">
            <ShieldAlert className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold">Policy Validation Failed</AlertTitle>
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {!isConfigured && (
        <Alert className="max-w-2xl rounded-[2rem] border-primary/10 bg-primary/5 p-8 text-center flex flex-col items-center">
          <Info className="h-8 w-8 text-primary mb-4" />
          <AlertTitle className="text-xl font-black mb-2 tracking-tight">Deployment Pre-requisites</AlertTitle>
          <AlertDescription className="text-muted-foreground font-medium leading-relaxed">
            Ensure your project identifier, location, and service account JSON possess the "Vertex AI Service Agent" and "Vertex AI User" roles for full orchestration capabilities.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
function Binary(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 22V10" />
      <path d="M14 22V2" />
      <path d="M6 22V16" />
      <path d="M18 22V12" />
    </svg>
  );
}
