import { useSettings } from "@/hooks/useSettings";
import { NeonDisconnectButton } from "@/components/NeonDisconnectButton";
import { Trash2 } from "lucide-react";

export function NeonIntegration() {
  const { settings } = useSettings();

  const isConnected = !!settings?.neon?.accessToken;

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 p-6 md:p-10 bg-zinc-500/5 rounded-[2rem] md:rounded-[3rem] border border-zinc-500/10 transition-all hover:bg-zinc-500/10">
      <div className="bg-white dark:bg-zinc-900 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] shadow-sm border border-zinc-500/10">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 md:h-10 md:w-10 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-gradient">Neon Database Hub</h3>
        <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-sm">
          Your serverless Postgres instances are currently synchronized with the Codiner engine.
        </p>
      </div>

      <NeonDisconnectButton className="h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black shadow-xl shadow-red-500/20 text-xs md:text-sm uppercase tracking-widest" />
    </div>
  );
}
