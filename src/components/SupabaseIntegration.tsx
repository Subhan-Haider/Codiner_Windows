import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DatabaseZap, Trash2, ShieldCheck, Globe } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useSupabase } from "@/hooks/useSupabase";
import { showSuccess, showError } from "@/lib/toast";
import { isSupabaseConnected } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function SupabaseIntegration() {
  const { settings, updateSettings } = useSettings();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Check if there are any connected organizations
  const isConnected = isSupabaseConnected(settings);

  const { organizations, refetchOrganizations, deleteOrganization } =
    useSupabase();

  const handleDisconnectAllFromSupabase = async () => {
    setIsDisconnecting(true);
    try {
      const result = await updateSettings({
        supabase: undefined,
        enableSupabaseWriteSqlMigration: false,
      });
      if (result) {
        showSuccess("Successfully disconnected all Supabase organizations");
        await refetchOrganizations();
      } else {
        showError("Failed to disconnect from Supabase");
      }
    } catch (err: any) {
      showError(
        err.message || "An error occurred while disconnecting from Supabase",
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleDeleteOrganization = async (organizationSlug: string) => {
    try {
      await deleteOrganization({ organizationSlug });
      showSuccess("Organization disconnected successfully");
    } catch (err: any) {
      showError(err.message || "Failed to disconnect organization");
    }
  };

  const handleMigrationSettingChange = async (enabled: boolean) => {
    try {
      await updateSettings({
        enableSupabaseWriteSqlMigration: enabled,
      });
      showSuccess("Setting updated");
    } catch (err: any) {
      showError(err.message || "Failed to update setting");
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 p-6 md:p-10 bg-zinc-500/5 rounded-[2rem] md:rounded-[3rem] border border-zinc-500/10 transition-all hover:bg-zinc-500/10">
      <div className="bg-white dark:bg-zinc-900 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] shadow-sm border border-zinc-500/10">
        <DatabaseZap className="h-8 w-8 md:h-10 md:w-10 text-[#3ecf8e]" />
      </div>

      <div className="space-y-1 md:space-y-2">
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-gradient">Supabase Orchestration</h3>
        <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-md leading-relaxed">
          {organizations.length} specialized organization{organizations.length !== 1 ? "s" : ""} connected to your backend infrastructure.
        </p>
      </div>

      <div className="w-full space-y-3">
        {organizations.map((org) => (
          <div
            key={org.organizationSlug}
            className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 rounded-2xl bg-white/40 dark:bg-black/20 border border-zinc-500/10 shadow-sm transition-all hover:bg-white/60 gap-4"
          >
            <div className="flex flex-col items-center sm:items-start gap-1">
              <span className="font-black text-primary tracking-tight">
                {org.name || `Organization ${org.organizationSlug.slice(0, 8)}`}
              </span>
              {org.ownerEmail && (
                <span className="text-[10px] md:text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-3 w-3" /> {org.ownerEmail}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 md:h-10 px-4 text-red-600 hover:bg-red-500 hover:text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest"
              onClick={() => handleDeleteOrganization(org.organizationSlug)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Purge
            </Button>
          </div>
        ))}
      </div>

      <div className="w-full pt-6 md:pt-8 border-t border-zinc-500/10 flex flex-col items-center space-y-4 md:space-y-6">
        <div className="flex flex-col items-center gap-2 md:gap-4 text-center">
          <Label
            htmlFor="supabase-migrations"
            className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2"
          >
            <ShieldCheck className="h-5 w-5 text-[#3ecf8e]" /> SQL Migration Ledger
          </Label>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium leading-relaxed max-w-xs md:max-w-sm">
            Automatically generate SQL migration logs to maintain structural version history.
          </p>
          <Switch
            id="supabase-migrations"
            checked={!!settings?.enableSupabaseWriteSqlMigration}
            onCheckedChange={handleMigrationSettingChange}
            className="scale-110 md:scale-125"
          />
        </div>
      </div>

      <Button
        onClick={handleDisconnectAllFromSupabase}
        variant="destructive"
        disabled={isDisconnecting}
        className="h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black gap-3 mt-4 shadow-xl shadow-red-500/20 text-xs md:text-sm uppercase tracking-widest"
      >
        {isDisconnecting ? "Decommissioning..." : "Terminate Full Access"}
        <DatabaseZap className="h-5 w-5" />
      </Button>
    </div>
  );
}
