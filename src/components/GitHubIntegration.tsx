import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Trash2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { showSuccess, showError } from "@/lib/toast";
import { IpcClient } from "@/ipc/ipc_client";

export function GitHubIntegration() {
  const { settings, updateSettings } = useSettings();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleDisconnectFromGithub = async () => {
    setIsDisconnecting(true);
    try {
      const result = await updateSettings({
        githubAccessToken: undefined,
      });
      if (result) {
        showSuccess("Successfully disconnected from GitHub");
      } else {
        showError("Failed to disconnect from GitHub");
      }
    } catch (err: any) {
      showError(
        err.message || "An error occurred while disconnecting from GitHub",
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnectToGithub = async () => {
    setIsConnecting(true);
    try {
      await IpcClient.getInstance().startGithubDeviceFlow(null);
    } catch (err: any) {
      showError(
        err.message || "Failed to start GitHub connection",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const isConnected = !!settings?.githubAccessToken;

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center text-center space-y-4 p-6 md:p-8 bg-zinc-500/5 rounded-[2rem] md:rounded-3xl border border-zinc-500/10 transition-all hover:bg-zinc-500/10">
        <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border border-zinc-500/10">
          <Github className="h-6 w-6 md:h-8 md:w-8 text-[#181717] dark:text-white" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg md:text-xl font-black tracking-tight leading-none">GitHub Infrastructure</h3>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm mx-auto">
            Connect your GitHub account to sync repositories and enable collaboration
          </p>
          <p className="text-xs text-muted-foreground/60 font-medium">Secure OAuth device flow authentication</p>
        </div>

        <Button
          onClick={handleConnectToGithub}
          disabled={isConnecting}
          className="h-12 md:h-14 px-6 md:px-8 rounded-xl font-black gap-3 shadow-lg shadow-blue-500/10 text-xs md:text-sm uppercase tracking-widest bg-[#238636] hover:bg-[#2ea043] text-white"
        >
          {isConnecting ? "Connecting..." : "Connect to GitHub"}
          <Github className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 md:p-8 bg-zinc-500/5 rounded-[2rem] md:rounded-3xl border border-zinc-500/10 transition-all hover:bg-zinc-500/10">
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-sm border border-zinc-500/10">
        <Github className="h-6 w-6 md:h-8 md:w-8 text-[#181717] dark:text-white" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg md:text-xl font-black tracking-tight leading-none">GitHub Infrastructure</h3>
        <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm mx-auto">
          Connected as <span className="text-white font-bold bg-zinc-500/20 px-2 py-0.5 rounded-lg">{settings?.githubUser?.email || "Authenticated User"}</span>
        </p>
        <p className="text-xs text-muted-foreground/60 font-medium">Link active via GitHub secure protocols</p>
      </div>

      <Button
        onClick={handleDisconnectFromGithub}
        variant="destructive"
        disabled={isDisconnecting}
        className="h-12 md:h-14 px-6 md:px-8 rounded-xl font-black gap-3 shadow-lg shadow-red-500/10 text-xs md:text-sm uppercase tracking-widest"
      >
        {isDisconnecting ? "Disconnecting..." : "Terminate GitHub Session"}
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
