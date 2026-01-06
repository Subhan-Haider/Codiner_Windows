import { useState, useEffect } from "react";
import {
    Folder,
    File,
    Cpu,
    Database,
    Github,
    Layout,
    Settings,
    ShieldCheck,
    Zap,
    ChevronRight,
    ChevronDown,
    Box,
    Binary,
    Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
    id: string;
    name: string;
    type: "folder" | "file";
    icon?: any;
    color?: string;
    label?: string;
    children?: Node[];
    isDetected?: boolean;
}

const PROJECT_STRUCTURE: Node[] = [
    {
        id: "ai-context",
        name: "Intelligence Context",
        type: "folder",
        icon: Cpu,
        color: "text-purple-500",
        label: "Neural Instructions",
        children: [
            { id: ".claude", name: ".claude", type: "folder", isDetected: true, icon: Zap, label: "Claude Protocol" },
            { id: ".cursor", name: ".cursor", type: "folder", isDetected: true, icon: Cpu, label: "Cursor Rules" },
            { id: ".cursorignore", name: ".cursorignore", type: "file" },
        ]
    },
    {
        id: "infrastructure",
        name: "Core Infrastructure",
        type: "folder",
        icon: Database,
        color: "text-blue-500",
        label: "Execution Layer",
        children: [
            { id: "drizzle", name: "drizzle", type: "folder", isDetected: true, icon: Database, label: "ORM Schema" },
            { id: "supabase", name: "supabase", type: "folder", isDetected: true, icon: Zap, label: "Cloud DB" },
            { id: ".devcontainer", name: ".devcontainer", type: "folder", isDetected: true, icon: Box, label: "Environments" },
        ]
    },
    {
        id: "orchestration",
        name: "Global Orchestration",
        type: "folder",
        icon: Github,
        color: "text-indigo-500",
        label: "CI/CD & Source",
        children: [
            { id: ".github", name: ".github", type: "folder", isDetected: true, icon: Github, label: "GitHub Actions" },
            { id: ".husky", name: ".husky", type: "folder", isDetected: true, icon: ShieldCheck, label: "Git Hooks" },
            { id: "scripts", name: "scripts", type: "folder", icon: Binary },
        ]
    },
    {
        id: "visual-assets",
        name: "Architectural Assets",
        type: "folder",
        icon: Layout,
        color: "text-pink-500",
        label: "Visual DNA",
        children: [
            {
                id: "assets",
                name: "assets",
                type: "folder",
                children: [
                    { id: "icon", name: "icon", type: "folder", icon: Settings, label: "App Brand" },
                    { id: "logo.png", name: "logo.png", type: "file", icon: Code, label: "Master Logo" },
                    { id: "logo.svg", name: "logo.svg", type: "file", icon: Code },
                ]
            },
        ]
    }
];

export function WorkspaceTopology() {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["ai-context", "infrastructure", "visual-assets"]));

    const toggleNode = (id: string) => {
        const next = new Set(expandedNodes);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedNodes(next);
    };

    const renderNode = (node: Node, depth: number = 0) => {
        const isExpanded = expandedNodes.has(node.id);
        const Icon = node.icon || (node.type === "folder" ? Folder : File);

        return (
            <div key={node.id} className="w-full">
                <div
                    onClick={() => node.children && toggleNode(node.id)}
                    className={cn(
                        "group flex items-center py-3 px-4 rounded-2xl transition-all duration-300 cursor-pointer select-none gap-3",
                        "hover:bg-white/40 dark:hover:bg-white/5 border border-transparent hover:border-white/20",
                        depth === 0 ? "mb-2" : "mb-1 ml-6"
                    )}
                >
                    {node.children ? (
                        <div className="w-4 flex items-center justify-center">
                            {isExpanded ? <ChevronDown className="h-4 w-4 opacity-40 group-hover:opacity-100" /> : <ChevronRight className="h-4 w-4 opacity-40 group-hover:opacity-100" />}
                        </div>
                    ) : (
                        <div className="w-4" />
                    )}

                    <div className={cn(
                        "p-2 rounded-xl transition-all duration-500",
                        node.isDetected ? "bg-primary/20 scale-110 shadow-lg shadow-primary/10" : "bg-black/5 dark:bg-white/5",
                        node.color
                    )}>
                        <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex flex-col">
                        <span className={cn(
                            "text-xs md:text-sm font-black tracking-tight",
                            depth === 0 ? "text-primary uppercase tracking-widest" : "text-foreground/80"
                        )}>
                            {node.name}
                        </span>
                        {node.label && (
                            <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-wider leading-none mt-0.5">
                                {node.label}
                            </span>
                        )}
                    </div>

                    {node.isDetected && (
                        <div className="ml-auto flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                            <span className="text-[8px] font-black text-primary uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Detected</span>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {isExpanded && node.children && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            {node.children.map(child => renderNode(child, depth + 1))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-4 mb-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Structural X-Ray</span>
                    <span className="text-xl md:text-2xl font-black tracking-tight">Project DNA Signature</span>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Cpu className="h-3 w-3" />
                        AI Optimized
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    {PROJECT_STRUCTURE.slice(0, 2).map(node => renderNode(node))}
                </div>
                <div className="space-y-2">
                    {PROJECT_STRUCTURE.slice(2).map(node => renderNode(node))}
                </div>
            </div>

            {/* Visual Indicator of Assets */}
            <div className="mt-8 p-6 md:p-8 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-primary/10 flex items-center gap-6 group">
                <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-white shadow-xl rotate-[-4deg] group-hover:rotate-0 transition-all duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <img src="/logo.png" className="w-full h-full object-contain p-2" alt="Project Icon"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as any).parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-primary font-black">DNA</div>';
                        }}
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <h4 className="text-sm md:text-base font-black tracking-tight flex items-center gap-2">
                        Visual Brand Engine
                        <div className="px-2 py-0.5 rounded-mf bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-tighter">Verified</div>
                    </h4>
                    <p className="text-[10px] md:text-xs text-muted-foreground font-medium max-w-sm">
                        All structural assets including master icons and branding templates have been synchronized with the neural cluster.
                    </p>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/20 hover:bg-white shadow-lg transition-all active:scale-90">
                    <Box className="h-5 w-5 text-primary" />
                </Button>
            </div>
        </div>
    );
}
