import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { showSuccess, showError } from "@/lib/toast";
import { Trash2 } from "lucide-react";

export function VercelIntegration() {
  const { settings, updateSettings } = useSettings();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnectFromVercel = async () => {
    setIsDisconnecting(true);
    try {
      const result = await updateSettings({
        vercelAccessToken: undefined,
      });
      if (result) {
        showSuccess("Successfully disconnected from Vercel");
      } else {
        showError("Failed to disconnect from Vercel");
      }
    } catch (err: any) {
      showError(
        err.message || "An error occurred while disconnecting from Vercel",
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  const isConnected = !!settings?.vercelAccessToken;

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 md:p-8 bg-zinc-500/5 rounded-[2rem] md:rounded-3xl border border-zinc-500/10 transition-all hover:bg-zinc-500/10">
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border border-zinc-500/10">
        <svg className="h-6 w-6 md:h-8 md:w-8 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 22.525H0l12-21.05 12 21.05z" />
        </svg>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg md:text-xl font-black tracking-tight leading-none">Vercel Deployment Engine</h3>
        <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm mx-auto">
          Synchronized with the Vercel edge network for real-time architectural deployment.
        </p>
      </div>

      <Button
        onClick={handleDisconnectFromVercel}
        variant="destructive"
        disabled={isDisconnecting}
        className="h-12 md:h-14 px-6 md:px-8 rounded-xl font-black gap-3 shadow-lg shadow-red-500/10 text-xs md:text-sm uppercase tracking-widest"
      >
        {isDisconnecting ? "Disconnecting..." : "Terminate Vercel Link"}
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
