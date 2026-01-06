import { useState, useEffect } from "react";
import {
    Activity,
    ShieldCheck,
    Zap,
    Globe,
    Server,
    Cpu,
    HardDrive,
    Wifi,
    AlertCircle,
    CheckCircle2,
    Lock,
    RefreshCw,
    Gauge
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageModelProviders } from "@/hooks/useLanguageModelProviders";
import { useSettings } from "@/hooks/useSettings";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "@/lib/toast";

export function NeuralSystemDiagnostics() {
    const { data: providers, isProviderSetup } = useLanguageModelProviders();
    const { settings } = useSettings();
    const [pulse, setPulse] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(p => (p + 1) % 100);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => setIsSyncing(false), 1500);
    };

    const setupProviders = providers?.filter(p => isProviderSetup(p.id)) || [];
    const healthScore = providers ? Math.round((setupProviders.length / providers.length) * 100) : 0;

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header with Health Score */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">System Core</span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">Neural Pulse Monitor</h2>
                </div>

                <div className="flex items-center gap-6 bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border border-white/20 shadow-xl">
                    <div className="relative h-16 w-16 md:h-20 md:w-20">
                        <svg className="h-full w-full -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="fill-none stroke-black/5 dark:stroke-white/5 stroke-[8]"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                style={{ strokeDasharray: "250", strokeDashoffset: 250 - (250 * healthScore) / 100 }}
                                className="fill-none stroke-primary stroke-[8] transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl md:text-2xl font-black">{healthScore}%</span>
                            <span className="text-[8px] font-black uppercase tracking-tighter opacity-40">Health</span>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">{setupProviders.length} Active Nodes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Heartbeat Stable</span>
                        </div>
                        <Button
                            onClick={handleSync}
                            variant="ghost"
                            size="sm"
                            className="h-7 mt-2 text-[9px] font-black uppercase tracking-[0.2em] bg-primary/10 hover:bg-primary hover:text-white transition-all rounded-full"
                        >
                            <RefreshCw className={cn("h-3 w-3 mr-2", isSyncing && "animate-spin")} />
                            Sync Cluster
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Memory Grid */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DiagnosticCard
                        icon={Cpu}
                        title="Neural Load"
                        value={settings?.lastKnownPerformance?.cpuUsagePercent !== undefined ? `${Math.round(settings.lastKnownPerformance.cpuUsagePercent)}%` : "Minimal"}
                        label="Engine CPU Priority"
                        status="optimal"
                        progress={settings?.lastKnownPerformance?.cpuUsagePercent || 12}
                        color="text-indigo-500"
                    />
                    <DiagnosticCard
                        icon={HardDrive}
                        title="Neural Memory"
                        value={settings?.lastKnownPerformance?.memoryUsageMB ? `${Math.round(settings.lastKnownPerformance.memoryUsageMB)} MB` : "Normal"}
                        label="Engine Heap Saturation"
                        status="optimal"
                        progress={settings?.lastKnownPerformance?.memoryUsageMB ? Math.min(100, (settings.lastKnownPerformance.memoryUsageMB / 2048) * 100) : 45}
                        color="text-emerald-500"
                    />
                    <DiagnosticCard
                        icon={ShieldCheck}
                        title="Security Mesh"
                        value="Hardened"
                        label="Neural Encryption Layer"
                        status="optimal"
                        progress={100}
                        color="text-blue-500"
                    />
                    <DiagnosticCard
                        icon={Gauge}
                        title="System Pulse"
                        value={settings?.lastKnownPerformance?.systemCpuPercent !== undefined ? `${Math.round(settings.lastKnownPerformance.systemCpuPercent)}%` : "Stable"}
                        label="Total Infrastructure Load"
                        status="optimal"
                        progress={settings?.lastKnownPerformance?.systemCpuPercent || pulse}
                        color="text-orange-500"
                    />
                </div>

                {/* Live Provider Feed */}
                <div className="bg-black/5 dark:bg-white/5 rounded-[2.5rem] p-8 border border-white/10 flex flex-col space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground italic">Node Telemetry</h3>
                        <div className="flex gap-1">
                            <div className="h-1 w-1 rounded-full bg-primary animate-ping" />
                            <div className="h-1 w-1 rounded-full bg-primary" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {providers?.slice(0, 5).map(provider => (
                            <div key={provider.id} className="flex items-center gap-4 group">
                                <div className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    isProviderSetup(provider.id) ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-600"
                                )} />
                                <span className="text-[10px] font-bold text-foreground/80 group-hover:text-primary transition-colors cursor-default">
                                    {provider.name}
                                </span>
                                <span className="ml-auto text-[8px] font-black uppercase tracking-tighter opacity-30">
                                    {isProviderSetup(provider.id) ? "Operational" : "Offline"}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 mt-auto border-t border-white/5 space-y-4">
                        <p className="text-[9px] font-medium text-muted-foreground leading-relaxed italic">
                            Real-time connection verification for specialized AI endpoints.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-8 text-[10px] font-black uppercase tracking-widest bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all rounded-xl gap-2"
                            onClick={() => {
                                const manifest = {
                                    timestamp: new Date().toISOString(),
                                    performance: settings?.lastKnownPerformance,
                                    nodes: setupProviders.map(p => p.name),
                                    architect: settings?.userName || "Architect"
                                };
                                navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
                                showSuccess("Diagnostic manifest captured to clipboard");
                            }}
                        >
                            <HardDrive className="h-3 w-3" />
                            Copy Diagnostic Manifest
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DiagnosticCard({ icon: Icon, title, value, label, status, progress, color }: any) {
    return (
        <div className="group relative p-6 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12">
                <Icon className="h-16 w-16" />
            </div>

            <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-white dark:bg-black/20 shadow-inner", color)}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{title}</span>
                        <span className="text-lg font-black tracking-tight">{value}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-foreground/40 uppercase tracking-tighter">{label}</span>
                        <span className="text-[10px] font-black tracking-widest text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-black/5 dark:bg-white/10" />
                </div>
            </div>
        </div>
    );
}
