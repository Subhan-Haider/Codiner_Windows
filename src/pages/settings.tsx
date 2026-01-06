import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { ProviderSettingsGrid } from "@/components/ProviderSettings";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { IpcClient } from "@/ipc/ipc_client";
import { showSuccess, showError } from "@/lib/toast";
import { AutoApproveSwitch } from "@/components/AutoApproveSwitch";
import { TelemetrySwitch } from "@/components/TelemetrySwitch";
import { MaxChatTurnsSelector } from "@/components/MaxChatTurnsSelector";
import { ThinkingBudgetSelector } from "@/components/ThinkingBudgetSelector";
import { useSettings } from "@/hooks/useSettings";
import { useAppVersion } from "@/hooks/useAppVersion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Settings, Workflow, Cpu, Trash2, AlertTriangle,
  Github, GitBranch, ShieldCheck, Activity, Box, Binary,
  Globe, Monitor, Command, HelpCircle, Minus, Square, X, Bug,
  User, Fingerprint, Sparkles, Languages, Zap, Palette, Sun, Moon
} from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { GitHubIntegration } from "@/components/GitHubIntegration";
import { VercelIntegration } from "@/components/VercelIntegration";
import { SupabaseIntegration } from "@/components/SupabaseIntegration";
import { Switch } from "@/components/ui/switch";
import { AutoFixProblemsSwitch } from "@/components/AutoFixProblemsSwitch";
import { AutoUpdateSwitch } from "@/components/AutoUpdateSwitch";
import { ReleaseChannelSelector } from "@/components/ReleaseChannelSelector";
import { NeonIntegration } from "@/components/NeonIntegration";
import { RuntimeModeSelector } from "@/components/RuntimeModeSelector";
import { NodePathSelector } from "@/components/NodePathSelector";
import { ToolsMcpSettings } from "@/components/settings/ToolsMcpSettings";
import { AgentToolsSettings } from "@/components/settings/AgentToolsSettings";
import { WorkspaceTopology } from "@/components/settings/WorkspaceTopology";
import { NeuralSystemDiagnostics } from "@/components/settings/NeuralSystemDiagnostics";
import { ZoomSelector } from "@/components/ZoomSelector";
import { useSetAtom } from "jotai";
import { activeSettingsSectionAtom } from "@/atoms/viewAtoms";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const appVersion = useAppVersion();
  const { settings, updateSettings } = useSettings();
  const router = useRouter();
  const setActiveSettingsSection = useSetAtom(activeSettingsSectionAtom);

  useEffect(() => {
    setActiveSettingsSection("general-settings");
  }, [setActiveSettingsSection]);

  const handleResetEverything = async () => {
    setIsResetting(true);
    try {
      const ipcClient = IpcClient.getInstance();
      await ipcClient.resetAll();
      showSuccess("Successfully reset everything. Restart the application.");
    } catch (error) {
      console.error("Error resetting:", error);
      showError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsResetting(false);
      setIsResetDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 md:px-12 space-y-16 md:space-y-24 animate-in fade-in duration-700">

      {/* Settings Hero */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-purple-500/20">
          <Settings className="h-8 w-8 md:h-10 md:w-10 text-white animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gradient leading-none">Settings Hub</h1>
          <p className="text-base md:text-xl text-muted-foreground font-medium max-w-sm mx-auto">Calibrate your architectural engine for maximum autonomous velocity.</p>
        </div>
      </div>

      <div className="space-y-32">
        {/* General Section */}
        <GeneralSettings appVersion={appVersion} />

        {/* Identity Section */}
        <IdentitySettings />

        {/* Visual Mechanics Section */}
        <VisualMechanics />

        {/* Workflow Section */}
        <WorkflowSettings />

        {/* Neural Pulse Section */}
        <div id="neural-pulse" className="space-y-8 md:space-y-10 group">
          <NeuralSystemDiagnostics />
        </div>

        {/* AI Configuration Section */}
        <AISettings />

        {/* Support Section */}
        <SupportSection />

        {/* Workspace Topology Section */}
        <div id="workspace-dna" className="space-y-8 md:space-y-10 group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-emerald-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all group-hover:scale-110 group-hover:rotate-3">
              <Box className="h-6 w-6 md:h-8 md:w-8 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Neural Architecture</h2>
              <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md">Visualization of the structural DNA and configuration archetypes detected in this project.</p>
            </div>
          </div>
          <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from- emerald-500/5 via-transparent to-transparent pointer-events-none" />
            <WorkspaceTopology />
          </div>
        </div>

        {/* AI Providers Section */}
        <div id="provider-settings" className="space-y-8 md:space-y-10 group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-purple-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all group-hover:scale-110 group-hover:rotate-6">
              <Globe className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">AI Command Center</h2>
              <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md">Connect specialized intelligence units to your development cycle.</p>
            </div>
          </div>
          <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <ProviderSettingsGrid />
          </div>
        </div>

        {/* Monitor Section */}
        <div id="telemetry" className="space-y-8 md:space-y-10 group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-blue-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all group-hover:scale-110">
              <Activity className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Engine Analytics</h2>
              <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md">Securely monitor architectural performance and diagnostic syncs.</p>
            </div>
          </div>

          <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl flex flex-col items-center space-y-8 md:space-y-12 bg-white/20 dark:bg-black/10">
            <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Telemetry Stream</h3>
                <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-sm leading-relaxed">Help us refine the Codiner engine by sharing anonymous utilization metrics.</p>
              </div>
              <TelemetrySwitch />
            </div>

            <div className="w-full flex flex-col items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3">
                <Binary className="h-4 w-4 text-primary opacity-40" />
                <span className="font-bold text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Unique Signature</span>
              </div>
              <code className="bg-white/40 dark:bg-black/40 px-6 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-3xl text-primary font-black text-sm md:text-xl shadow-inner border border-primary/10 tracking-[0.2em] md:tracking-[0.3em] font-mono break-all text-center">
                {settings ? settings.telemetryUserId : "UNIDENTIFIED"}
              </code>
            </div>
          </div>
        </div>

        {/* Integrations Section */}
        <div id="integrations" className="space-y-8 md:space-y-10 group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-indigo-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all group-hover:scale-110 group-hover:-rotate-6">
              <Github className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Nexus Cluster</h2>
              <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md">Synchronize your local environment with global cloud deployments.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:gap-8 w-full">
            <GitHubIntegration />
            <VercelIntegration />
            <SupabaseIntegration />
            <NeonIntegration />
          </div>
        </div>

        {/* Tools Section */}
        <div id="tools-mcp" className="space-y-8 md:space-y-10 group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-amber-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all group-hover:scale-110">
              <Box className="h-6 w-6 md:h-8 md:w-8 text-amber-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Capability Modules</h2>
              <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md">Inject external functionality via Model Context Protocol (MCP).</p>
            </div>
          </div>
          <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-16 shadow-2xl flex flex-col items-center">
            <ToolsMcpSettings />

            {settings?.experiments?.enableLocalAgent && (
              <div className="mt-16 md:mt-24 pt-16 md:pt-24 border-t border-primary/10 w-full space-y-10 md:space-y-16 flex flex-col items-center">
                <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
                  <div className="bg-primary/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-lg">
                    <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-gradient-indigo">Agent Privileges</h3>
                  <p className="text-base md:text-lg text-muted-foreground font-medium">Fine-tune internal execution permissions.</p>
                </div>
                <AgentToolsSettings />
              </div>
            )}
          </div>
        </div>

        {/* Experiments */}
        <div id="experiments" className="space-y-8 md:space-y-10 group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-emerald-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all group-hover:scale-110">
              <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Fusion Labs</h2>
              <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md">Toggle bleeding-edge architectural features for the build engine.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="glass-card border-primary/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-xl transition-all hover:border-primary/40 flex flex-col items-center text-center space-y-6 md:space-y-8 bg-white/20 dark:bg-black/10">
              <div className="bg-primary/10 p-4 md:p-5 rounded-[1rem] md:rounded-[1.5rem] shadow-sm">
                <GitBranch className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Native Git Ledger</h3>
                <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto">
                  High-frequency repository operations using an embedded C++ git provider.
                </p>
              </div>
              <Switch
                checked={!!settings?.enableNativeGit}
                onCheckedChange={(checked) => updateSettings({ enableNativeGit: checked })}
                className="scale-125 md:scale-150"
              />
            </div>

            <div className="glass-card border-primary/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-xl transition-all hover:border-primary/40 flex flex-col items-center text-center space-y-6 md:space-y-8 bg-white/20 dark:bg-black/10">
              <div className="bg-primary/10 p-4 md:p-5 rounded-[1rem] md:rounded-[1.5rem] shadow-sm">
                <Command className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">Agent Nexus v2.5</h3>
                <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto">
                  Autonomous local orchestration with enhanced multi-tool reasoning kernels.
                </p>
              </div>
              <Switch
                checked={!!settings?.experiments?.enableLocalAgent}
                onCheckedChange={(checked) => updateSettings({
                  experiments: { ...settings?.experiments, enableLocalAgent: checked }
                })}
                className="scale-125 md:scale-150"
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div id="danger-zone" className="space-y-8 md:space-y-10 group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-red-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] transition-all group-hover:scale-110 group-hover:animate-shake">
              <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gradient-error">Terminal Actions</h2>
              <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md">Irreversible destructive commands for system management.</p>
            </div>
          </div>

          <div className="rounded-[2rem] md:rounded-[3.5rem] p-10 md:p-20 border-2 md:border-4 border-dashed border-red-500/20 bg-red-500/5 shadow-2xl flex flex-col items-center space-y-8 md:space-y-12 text-center transition-all hover:bg-red-500/10">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-red-600 leading-tight">Engine Decommission</h3>
              <p className="text-sm md:text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
                Instantly purge all applications, secure keys, and architectural configurations from this node.
              </p>
            </div>
            <Button
              onClick={() => setIsResetDialogOpen(true)}
              disabled={isResetting}
              variant="destructive"
              className="h-16 md:h-24 px-8 md:px-16 rounded-[1.5rem] md:rounded-[2rem] text-lg md:text-2xl font-black shadow-2xl shadow-red-500/30 hover:scale-[1.05] active:scale-95 transition-all uppercase tracking-widest"
            >
              {isResetting ? "Purging..." : "Execute Wipe"}
            </Button>
          </div>
        </div>

        <div className="h-40"></div>
      </div>
      <ConfirmationDialog
        isOpen={isResetDialogOpen}
        title="Critical System Reset"
        message="Are you sure you want to proceed? Every single application, chat message, and configured setting will be permanently deleted from this machine."
        confirmText="Yes, Destroy Everything"
        cancelText="Cancel Operation"
        onConfirm={handleResetEverything}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </div>
  );
}

export function GeneralSettings({ appVersion }: { appVersion: string | null }) {
  const { theme, setTheme } = useTheme();

  return (
    <div id="general-settings" className="space-y-12 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary/10 p-5 rounded-[2rem] transition-all group-hover:scale-110">
          <Monitor className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-gradient">System UI Core</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md">Interface personality and foundational orchestration parameters.</p>
        </div>
      </div>

      <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl space-y-12 md:space-y-20 flex flex-col items-center bg-white/20 dark:bg-black/10">
        <div className="flex flex-col items-center text-center space-y-6 md:space-y-10 w-full">
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Visual Theme</h3>
            <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed">Align the engine's aesthetics with your creative flow.</p>
          </div>

          <div className="bg-primary/5 p-2 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] flex border border-primary/10 shadow-inner w-full max-w-md">
            {(["system", "light", "dark"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setTheme(option)}
                className={cn(
                  "flex-1 py-3 md:py-5 text-[10px] md:text-sm font-black uppercase tracking-widest rounded-[1rem] md:rounded-[1.5rem] transition-all duration-700",
                  theme === option
                    ? "bg-white dark:bg-primary text-primary dark:text-white shadow-2xl ring-1 ring-primary/10 scale-[1.05] z-10"
                    : "text-muted-foreground hover:text-primary hover:bg-white/50 dark:hover:bg-black/20"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 w-full text-center items-center">
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <Command className="h-4 w-4 text-primary opacity-40" />
              <span className="font-bold text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Stable Build</span>
            </div>
            <div className="px-10 md:px-14 py-6 md:py-10 rounded-[2rem] md:rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 flex flex-col items-center gap-3 md:gap-4 shadow-inner group/version transition-all hover:bg-indigo-500/10">
              <span className="font-black text-4xl md:text-6xl text-gradient tracking-tighter">v{appVersion || "0.0.0"}</span>
              <div className="px-4 md:px-6 py-1.5 md:py-2 bg-green-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg shadow-green-500/20">
                Active Node
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <Box className="h-4 w-4 text-primary opacity-40" />
              <span className="font-bold text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Optics Magnitude</span>
            </div>
            <div className="w-full max-w-xs scale-100 md:scale-110">
              <ZoomSelector />
            </div>
          </div>
        </div>

        <div className="pt-12 md:pt-20 border-t border-primary/10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="space-y-6 md:space-y-8 flex flex-col items-center text-center">
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-xl md:text-2xl font-black tracking-tight">Sync Stream</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">Continuous delivery of optimizations.</p>
            </div>
            <AutoUpdateSwitch />
          </div>

          <div className="space-y-6 md:space-y-8 flex flex-col items-center text-center">
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-xl md:text-2xl font-black tracking-tight">Stability Tier</h3>
              <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">Select the risk magnitude for synchronization.</p>
            </div>
            <div className="w-full max-w-xs">
              <ReleaseChannelSelector />
            </div>
          </div>
        </div>

        <div className="pt-12 md:pt-20 border-t border-primary/10 w-full">
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 w-full">
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-primary">Runtime Framework</h3>
              <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed max-w-xl mx-auto">Execution layer for localized hosting.</p>
            </div>
            <div className="w-full flex flex-col gap-8 md:gap-12 bg-black/5 dark:bg-white/5 p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] border border-primary/5 shadow-inner">
              <div className="w-full flex justify-center scale-100 md:scale-110">
                <RuntimeModeSelector />
              </div>
              <div className="space-y-6 md:space-y-8 flex flex-col items-center">
                <span className="font-bold text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Node.js Binary Cluster</span>
                <div className="w-full max-w-lg">
                  <NodePathSelector />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkflowSettings() {
  const { settings, updateSettings } = useSettings();
  return (
    <div id="workflow-settings" className="space-y-12 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary/10 p-5 rounded-[2rem] transition-all group-hover:scale-110">
          <Workflow className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-gradient">Orchestration Logic</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md">Define the cognitive independence for your agent cluster.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl transition-all hover:bg-white/30 dark:hover:bg-black/20 flex flex-col items-center text-center space-y-6 md:space-y-10 group/card">
          <div className="bg-primary/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm transition-all group-hover/card:scale-110">
            <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          </div>
          <div className="space-y-2 md:space-y-4">
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">Autonomous Pulse</h3>
            <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
              Enable the agent to execute code modifications instantly without human intervention.
            </p>
          </div>
          <div className="scale-110 md:scale-125">
            <AutoApproveSwitch showToast={false} />
          </div>
        </div>

        <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl transition-all hover:bg-white/30 dark:hover:bg-black/20 flex flex-col items-center text-center space-y-6 md:space-y-10 group/card">
          <div className="bg-red-500/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm transition-all group-hover/card:scale-110">
            <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
          </div>
          <div className="space-y-2 md:space-y-4">
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">Diagnostic Healing</h3>
            <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
              Instantly resolve TypeScript errors and environment inconsistencies during build.
            </p>
          </div>
          <div className="scale-110 md:scale-125">
            <AutoFixProblemsSwitch />
          </div>
        </div>

        <div className="glass-card border-amber-500/20 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl transition-all hover:bg-white/30 dark:hover:bg-black/20 flex flex-col items-center text-center space-y-6 md:space-y-10 group/card">
          <div className="bg-amber-500/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm transition-all group-hover/card:scale-110">
            <Zap className="h-8 w-8 md:h-10 md:w-10 text-amber-500" />
          </div>
          <div className="space-y-2 md:space-y-4">
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">Neural Haptics</h3>
            <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
              Enable tactile micro-interactions and sensory feedback during complex architectural operations.
            </p>
          </div>
          <div className="scale-110 md:scale-125">
            <Switch
              checked={settings?.enableHaptics ?? true}
              onCheckedChange={(checked) => updateSettings({ enableHaptics: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AISettings() {
  return (
    <div id="ai-settings" className="space-y-12 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary/10 p-5 rounded-[2rem] transition-all group-hover:scale-110">
          <Cpu className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-gradient">Neural Parameters</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md">Global directives for token context and reasoning budgets.</p>
        </div>
      </div>

      <div className="glass-card border-primary/20 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-20 shadow-2xl flex flex-col items-center space-y-16 md:space-y-24 bg-white/20 dark:bg-black/10">
        <div className="space-y-8 md:space-y-12 w-full flex flex-col items-center text-center">
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">Thinking Magnitude</h3>
              <div className="bg-primary text-white px-4 md:px-5 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-primary/20">Reasoning Depth</div>
            </div>
            <p className="text-base md:text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
              Configure the maximum computational effort per architectural thought cycle.
            </p>
          </div>
          <div className="w-full max-w-2xl scale-100 md:scale-110">
            <ThinkingBudgetSelector />
          </div>
        </div>

        <div className="space-y-8 md:space-y-12 w-full flex flex-col items-center text-center">
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">History Retention</h3>
              <div className="bg-indigo-500 text-white px-4 md:px-5 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-indigo-500/20">Context Window</div>
            </div>
            <p className="text-base md:text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
              Synchronize the token buffer to maintain optimal reasoning velocity.
            </p>
          </div>
          <div className="w-full max-w-md scale-100 md:scale-110">
            <MaxChatTurnsSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SupportSection() {
  const handleReportBug = () => {
    IpcClient.getInstance().openExternalUrl("https://github.com/codiner-sh/codiner/issues/new");
  };

  const handleOpenDocs = () => {
    IpcClient.getInstance().openExternalUrl("https://www.codiner.online/docs");
  };

  return (
    <div id="support" className="space-y-12 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-primary/10 p-5 rounded-[2rem] transition-all group-hover:scale-110">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-gradient">Support Hub</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md">Connect with the neural collective or report system anomalies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="glass-card border-primary/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all hover:bg-white/30 dark:hover:bg-black/20 flex flex-col items-center text-center space-y-6 md:space-y-8 group/card">
          <div className="bg-blue-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm transition-all group-hover/card:scale-110">
            <Globe className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter">Documentation</h3>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xs">
              Explore the architectural blue-prints and integration guides for the Codiner engine.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-2xl px-8 h-12 font-bold border-primary/20 hover:bg-primary/10"
            onClick={handleOpenDocs}
          >
            Visit Website
          </Button>
        </div>

        <div className="glass-card border-red-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all hover:bg-white/30 dark:hover:bg-black/20 flex flex-col items-center text-center space-y-6 md:space-y-8 group/card">
          <div className="bg-red-500/10 p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm transition-all group-hover/card:scale-110">
            <Bug className="h-8 w-8 md:h-10 md:w-10 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter">Report Anomaly</h3>
            <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-xs">
              Detected a logic leak or system drift? File a report in the neural repository.
            </p>
          </div>
          <Button
            variant="destructive"
            className="rounded-2xl px-8 h-12 font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30"
            onClick={handleReportBug}
          >
            Report Bug
          </Button>
        </div>
      </div>
    </div>
  );
}

export function IdentitySettings() {
  const { settings, updateSettings } = useSettings();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ userName: e.target.value });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSettings({ customSystemPrompt: e.target.value });
  };

  return (
    <div id="personalization" className="space-y-12 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-indigo-500/10 p-5 rounded-[2rem] transition-all group-hover:scale-110">
          <Fingerprint className="h-8 w-8 text-indigo-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-gradient">Neural Identity</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md">Personalize how the system recognizes and interacts with you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* User Persona Card */}
        <div className="glass-card border-indigo-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/20 dark:bg-black/10">
          <div className="relative group/avatar">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 transition-all group-hover/avatar:scale-105 group-hover/avatar:rotate-3">
              <User className="h-10 w-10 md:h-14 md:w-14" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg animate-pulse">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 ml-1">Architect Designation</Label>
              <Input
                value={settings?.userName || "Architect"}
                onChange={handleNameChange}
                placeholder="How should I address you?"
                className="bg-white/50 dark:bg-black/20 border-indigo-500/10 focus:border-indigo-500/30 h-14 rounded-2xl px-6 text-lg font-bold"
              />
            </div>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-muted-foreground font-medium">Unique Neural Signature</p>
              <code className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-uppercase tracking-tighter">
                {settings?.telemetryUserId ? `NS-${settings.telemetryUserId.slice(0, 12).toUpperCase()}` : "NEURAL-CORE-ACTIVE"}
              </code>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-medium px-1">
            This name and signature will be used across the interface and by the AI when addressing you in architectural dialogues.
          </p>
        </div>
      </div>

      {/* Global Directives Card */}
      <div className="glass-card border-purple-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 bg-white/20 dark:bg-black/10 group/soul">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="bg-purple-500/10 p-4 rounded-2xl group-hover/soul:scale-110 transition-transform">
              <Languages className="h-6 w-6 text-purple-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight">System Persona</h3>
              <p className="text-sm text-muted-foreground font-medium">Inject a specialized global directive into the model's neural core.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            value={settings?.customSystemPrompt || ""}
            onChange={handlePromptChange}
            placeholder="e.g. Always respond in a highly technical tone, or prioritize accessibility and clean code patterns..."
            className="min-h-[160px] bg-white/50 dark:bg-black/20 border-purple-500/10 focus:border-purple-500/30 rounded-[1.5rem] p-6 text-base leading-relaxed font-medium resize-none shadow-inner"
          />
          <div className="flex items-center gap-2 px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Applied globally to all cognitive cycles</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualMechanics() {
  const { theme, setTheme } = useTheme();

  return (
    <div id="visual-settings" className="space-y-12 group">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-pink-500/10 p-5 rounded-[2rem] transition-all group-hover:scale-110">
          <Palette className="h-8 w-8 text-pink-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-gradient">Visual Mechanics</h2>
          <p className="text-muted-foreground font-medium text-lg max-w-md">Calibrate the luminous intensity and scale of your architectural interface.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Theme Card */}
        <div className="glass-card border-pink-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col items-center text-center space-y-8 bg-white/20 dark:bg-black/10 group/theme">
          <div className="bg-pink-500/10 p-4 rounded-2xl group-hover/theme:scale-110 transition-transform">
            <Sun className="h-6 w-6 text-pink-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter">Digital Ambience</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-xs leading-relaxed">Select the primary photon emission mode for your workspace.</p>
          </div>

          <div className="flex bg-white/50 dark:bg-black/30 p-2 rounded-2xl border border-pink-500/10 w-full max-w-xs">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all",
                  theme === t
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105"
                    : "hover:bg-pink-500/10 text-muted-foreground hover:text-pink-500"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Card */}
        <div className="glass-card border-orange-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl flex flex-col items-center text-center space-y-8 bg-white/20 dark:bg-black/10 group/scale">
          <div className="bg-orange-500/10 p-4 rounded-2xl group-hover/scale:scale-110 transition-transform">
            <Monitor className="h-6 w-6 text-orange-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter">Interface Density</h3>
            <p className="text-sm text-muted-foreground font-medium max-w-xs leading-relaxed">Adjust the retinal magnitude of the architectural elements.</p>
          </div>

          <div className="w-full max-w-xs">
            <ZoomSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
