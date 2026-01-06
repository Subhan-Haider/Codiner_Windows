import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useAgentTools,
  type AgentToolName,
  type AgentTool,
} from "@/hooks/useAgentTools";
import { Loader2, ChevronRight, ShieldCheck } from "lucide-react";
import type { AgentToolConsent } from "@/ipc/ipc_types";
import { cn } from "@/lib/utils";

export function AgentToolsSettings() {
  const { tools, isLoading, setConsent } = useAgentTools();
  const [showAutoApproved, setShowAutoApproved] = useState(false);

  const handleConsentChange = (
    toolName: AgentToolName,
    consent: AgentToolConsent,
  ) => {
    setConsent({ toolName, consent });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const autoApprovedTools =
    tools?.filter((t: AgentTool) => t.isAllowedByDefault) || [];
  const requiresApprovalTools =
    tools?.filter((t: AgentTool) => !t.isAllowedByDefault) || [];

  return (
    <div className="w-full space-y-8 md:space-y-10 flex flex-col items-center">
      <p className="text-base md:text-lg text-muted-foreground font-medium text-center max-w-md px-4">
        Define the granular execution boundaries for all internal agent capabilities.
      </p>

      {/* Requires approval tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl px-4">
        {requiresApprovalTools.map((tool: AgentTool) => (
          <ToolConsentRow
            key={tool.name}
            name={tool.name}
            description={tool.description}
            consent={tool.consent}
            onConsentChange={(consent) =>
              handleConsentChange(tool.name as AgentToolName, consent)
            }
          />
        ))}
      </div>

      {/* Auto-approved tools (collapsed by default) */}
      <div className="w-full flex flex-col items-center space-y-4 md:space-y-6 pt-8 md:pt-10 border-t border-primary/5">
        <button
          type="button"
          onClick={() => setShowAutoApproved(!showAutoApproved)}
          className="flex items-center gap-3 px-5 md:px-6 py-2 md:py-3 rounded-full bg-primary/5 hover:bg-primary/10 text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.2em] transition-all border border-primary/10 shadow-sm"
        >
          <ChevronRight
            className={cn("h-4 w-4 transition-transform", showAutoApproved && "rotate-90")}
          />
          <span>Default Protocols ({autoApprovedTools.length})</span>
        </button>
        {showAutoApproved && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl animate-in fade-in slide-in-from-top-4 duration-500 px-4">
            {autoApprovedTools.map((tool: AgentTool) => (
              <ToolConsentRow
                key={tool.name}
                name={tool.name}
                description={tool.description}
                consent={tool.consent}
                onConsentChange={(consent) =>
                  handleConsentChange(tool.name as AgentToolName, consent)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolConsentRow({
  name,
  description,
  consent,
  onConsentChange,
}: {
  name: string;
  description: string;
  consent: AgentToolConsent;
  onConsentChange: (consent: AgentToolConsent) => void;
}) {
  return (
    <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/40 dark:bg-black/20 border border-primary/5 transition-all hover:bg-white/60 shadow-sm flex flex-col items-center text-center space-y-3 md:space-y-4">
      <div className="space-y-1">
        <div className="font-mono text-[11px] md:text-sm font-black text-primary tracking-tight">{name}</div>
        <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium leading-relaxed italic opacity-80 line-clamp-2">
          {description}
        </p>
      </div>
      <Select
        value={consent}
        onValueChange={(v) => onConsentChange(v as AgentToolConsent)}
      >
        <SelectTrigger className="w-full max-w-[140px] md:max-w-[160px] h-9 md:h-10 rounded-xl border-primary/10 bg-white/50 text-xs md:text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ask">Authorize</SelectItem>
          <SelectItem value="always">Continuous</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
