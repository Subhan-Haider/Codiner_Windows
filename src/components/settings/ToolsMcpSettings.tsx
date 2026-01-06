import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMcp, type Transport } from "@/hooks/useMcp";
import { showError, showInfo, showSuccess } from "@/lib/toast";
import { Edit2, Plus, Save, Trash2, X, Box, Binary } from "lucide-react";
import { useDeepLink } from "@/contexts/DeepLinkContext";
import { AddMcpServerDeepLinkData } from "@/ipc/deep_link_data";

type KeyValue = { key: string; value: string };

function parseEnvJsonToArray(
  envJson?: Record<string, string> | string | null,
): KeyValue[] {
  if (!envJson) return [];
  try {
    const obj =
      typeof envJson === "string"
        ? (JSON.parse(envJson) as unknown as Record<string, string>)
        : (envJson as Record<string, string>);
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: String(value ?? ""),
    }));
  } catch {
    return [];
  }
}

function arrayToEnvObject(envVars: KeyValue[]): Record<string, string> {
  const env: Record<string, string> = {};
  for (const { key, value } of envVars) {
    if (key.trim().length === 0) continue;
    env[key.trim()] = value;
  }
  return env;
}

function EnvVarsEditor({
  serverId,
  envJson,
  disabled,
  onSave,
  isSaving,
}: {
  serverId: number;
  envJson?: Record<string, string> | null;
  disabled?: boolean;
  onSave: (envVars: KeyValue[]) => Promise<void>;
  isSaving: boolean;
}) {
  const initial = useMemo(() => parseEnvJsonToArray(envJson), [envJson]);
  const [envVars, setEnvVars] = useState<KeyValue[]>(initial);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingKeyValue, setEditingKeyValue] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  React.useEffect(() => {
    setEnvVars(initial);
  }, [serverId, initial]);

  const saveAll = async (next: KeyValue[]) => {
    await onSave(next);
    setEnvVars(next);
  };

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      showError("Both key and value are required");
      return;
    }
    if (envVars.some((e) => e.key === newKey.trim())) {
      showError("Environment variable with this key already exists");
      return;
    }
    const next = [...envVars, { key: newKey.trim(), value: newValue.trim() }];
    await saveAll(next);
    setNewKey("");
    setNewValue("");
    setIsAddingNew(false);
    showSuccess("Environment variables saved");
  };

  const handleEdit = (kv: KeyValue) => {
    setEditingKey(kv.key);
    setEditingKeyValue(kv.key);
    setEditingValue(kv.value);
  };

  const handleSaveEdit = async () => {
    if (!editingKey) return;
    if (!editingKeyValue.trim() || !editingValue.trim()) {
      showError("Both key and value are required");
      return;
    }
    if (
      envVars.some(
        (e) => e.key === editingKeyValue.trim() && e.key !== editingKey,
      )
    ) {
      showError("Environment variable with this key already exists");
      return;
    }
    const next = envVars.map((e) =>
      e.key === editingKey
        ? { key: editingKeyValue.trim(), value: editingValue.trim() }
        : e,
    );
    await saveAll(next);
    setEditingKey(null);
    setEditingKeyValue("");
    setEditingValue("");
    showSuccess("Environment variables saved");
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditingKeyValue("");
    setEditingValue("");
  };

  const handleDelete = async (key: string) => {
    const next = envVars.filter((e) => e.key !== key);
    await saveAll(next);
    showSuccess("Environment variables saved");
  };

  return (
    <div className="mt-3 space-y-3">
      {isAddingNew ? (
        <div className="space-y-3 p-3 border rounded-md bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor={`env-new-key-${serverId}`}>Key</Label>
            <Input
              id={`env-new-key-${serverId}`}
              placeholder="e.g., PATH"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              autoFocus
              disabled={disabled || isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`env-new-value-${serverId}`}>Value</Label>
            <Input
              id={`env-new-value-${serverId}`}
              placeholder="e.g., /usr/local/bin"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              disabled={disabled || isSaving}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              size="sm"
              disabled={disabled || isSaving}
            >
              <Save size={14} />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={() => {
                setIsAddingNew(false);
                setNewKey("");
                setNewValue("");
              }}
              variant="outline"
              size="sm"
            >
              <X size={14} />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          variant="outline"
          className="w-full"
          disabled={disabled}
        >
          <Plus size={14} />
          Add Environment Variable
        </Button>
      )}

      <div className="space-y-2">
        {envVars.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No environment variables configured
          </p>
        ) : (
          envVars.map((kv) => (
            <div
              key={kv.key}
              className="flex items-center space-x-2 p-2 border rounded-md"
            >
              {editingKey === kv.key ? (
                <>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={editingKeyValue}
                      onChange={(e) => setEditingKeyValue(e.target.value)}
                      placeholder="Key"
                      className="h-8"
                      disabled={disabled || isSaving}
                    />
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      placeholder="Value"
                      className="h-8"
                      disabled={disabled || isSaving}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={handleSaveEdit}
                      size="sm"
                      variant="outline"
                      disabled={disabled || isSaving}
                    >
                      <Save size={14} />
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{kv.key}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {kv.value}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleEdit(kv)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      disabled={disabled}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(kv.key)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={disabled || isSaving}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ToolsMcpSettings() {
  const {
    servers,
    toolsByServer,
    consentsMap,
    createServer,
    toggleEnabled: toggleServerEnabled,
    deleteServer,
    setToolConsent: updateToolConsent,
    updateServer,
    isUpdatingServer,
  } = useMcp();
  const [consents, setConsents] = useState<Record<string, any>>({});
  const [name, setName] = useState("");
  const [transport, setTransport] = useState<Transport>("stdio");
  const [command, setCommand] = useState("");
  const [args, setArgs] = useState<string>("");
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(true);
  const { lastDeepLink, clearLastDeepLink } = useDeepLink();

  useEffect(() => {
    const handleDeepLink = async () => {
      if (lastDeepLink?.type === "add-mcp-server") {
        const deepLink = lastDeepLink as AddMcpServerDeepLinkData;
        const payload = deepLink.payload;
        showInfo(`Prefilled ${payload.name} MCP server`);
        setName(payload.name);
        setTransport(payload.config.type);
        if (payload.config.type === "stdio") {
          const [command, ...args] = payload.config.command.split(" ");
          setCommand(command);
          setArgs(args.join(" "));
        } else {
          setUrl(payload.config.url);
        }
        clearLastDeepLink();
      }
    };
    handleDeepLink();
  }, [lastDeepLink?.timestamp]);

  useEffect(() => {
    setConsents(consentsMap);
  }, [consentsMap]);

  const onCreate = async () => {
    const parsedArgs = (() => {
      const trimmed = args.trim();
      if (!trimmed) return null;
      if (trimmed.startsWith("[")) {
        try {
          const arr = JSON.parse(trimmed);
          return Array.isArray(arr) && arr.every((x) => typeof x === "string")
            ? (arr as string[])
            : null;
        } catch {
          // fall through
        }
      }
      return trimmed.split(" ").filter(Boolean);
    })();
    await createServer({
      name,
      transport,
      command: command || null,
      args: parsedArgs,
      url: url || null,
      enabled,
    });
    setName("");
    setCommand("");
    setArgs("");
    setUrl("");
    setEnabled(true);
  };

  const onSetToolConsent = async (
    serverId: number,
    toolName: string,
    consent: "ask" | "always" | "denied",
  ) => {
    await updateToolConsent(serverId, toolName, consent);
    setConsents((prev) => ({ ...prev, [`${serverId}:${toolName}`]: consent }));
  };

  return (
    <div className="w-full space-y-12 flex flex-col items-center">
      {/* Add Server Header */}
      <div className="w-full max-w-2xl bg-primary/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-primary/10 shadow-inner flex flex-col items-center space-y-8 md:space-y-10">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h3 className="text-xl md:text-2xl font-black tracking-tight">Register MCP Protocol</h3>
          <p className="text-muted-foreground font-medium text-xs md:text-sm">Expand your agent's knowledge graph with a new server connection.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Memory Server"
              className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-primary/10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Transport Layer</Label>
            <Select value={transport} onValueChange={(v) => setTransport(v as Transport)}>
              <SelectTrigger className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-primary/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stdio">Local (Stdio)</SelectItem>
                <SelectItem value="http">Network (HTTP)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {transport === "stdio" && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Binary Command</Label>
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="node"
                  className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Execution Args</Label>
                <Input
                  value={args}
                  onChange={(e) => setArgs(e.target.value)}
                  placeholder="server.js --secure"
                  className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-primary/10"
                />
              </div>
            </>
          )}
          {transport === "http" && (
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Protocol URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="h-12 rounded-xl bg-white/50 dark:bg-black/20 border-primary/10"
              />
            </div>
          )}
          <div className="flex items-center gap-3 bg-white/40 dark:bg-black/20 p-4 rounded-2xl border border-primary/5 col-span-1 md:col-span-2 justify-center">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <span className="font-bold text-sm">Initialize on Startup</span>
          </div>
        </div>

        <Button onClick={onCreate} disabled={!name.trim()} className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-sm md:text-lg premium-gradient shadow-xl uppercase tracking-widest">
          <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Initialize Connection
        </Button>
      </div>

      {/* Active Servers List */}
      <div className="w-full space-y-6 md:space-y-8">
        <div className="flex flex-col items-center space-y-1 mb-4 text-center">
          <h3 className="text-lg md:text-xl font-black tracking-tight">Active Protocol Cluster</h3>
          <p className="text-muted-foreground text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] md:tracking-widest">Currently managing {servers.length} server nodes</p>
        </div>

        <div className="grid grid-cols-1 gap-6 w-full max-w-4xl mx-auto">
          {servers.map((s) => (
            <div key={s.id} className="relative group overflow-hidden glass-card border-primary/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 transition-all hover:border-primary/40 shadow-xl">
              <div className="absolute top-0 right-0 p-6 md:p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-all group-hover:scale-125 rotate-12">
                <Box className="w-24 h-24 md:w-32 md:h-32" />
              </div>

              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
                  <div className="space-y-3 w-full md:w-auto">
                    <h4 className="text-2xl md:text-3xl font-black tracking-tight leading-none break-all">{s.name}</h4>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary/10">
                        {s.transport} Layer
                      </span>
                      {s.url && <code className="text-[10px] md:text-xs text-muted-foreground font-mono opacity-80 break-all">{s.url}</code>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={!!s.enabled}
                      onCheckedChange={() => toggleServerEnabled(s.id, !!s.enabled)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteServer(s.id)} className="h-10 w-10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl bg-red-500/5">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                {s.transport === "stdio" && (
                  <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-black/5 dark:bg-white/5 border border-primary/5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Binary className="h-4 w-4 text-primary opacity-60" />
                      <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground text-center md:text-left w-full">Orchestration Variables</span>
                    </div>
                    <EnvVarsEditor
                      serverId={s.id}
                      envJson={s.envJson}
                      disabled={!s.enabled}
                      isSaving={!!isUpdatingServer}
                      onSave={async (pairs) => {
                        await updateServer({
                          id: s.id,
                          envJson: arrayToEnvObject(pairs),
                        });
                      }}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4 text-primary opacity-60" />
                    <span className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Capability Matrix</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(toolsByServer[s.id] || []).map((t) => (
                      <div key={t.name} className="p-5 rounded-2xl bg-white/40 dark:bg-black/20 border border-primary/5 space-y-4 group/tool transition-all hover:bg-white/60">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-mono text-sm font-black text-primary truncate">{t.name}</span>
                          <Select
                            value={consents[`${s.id}:${t.name}`] || "ask"}
                            onValueChange={(v) => onSetToolConsent(s.id, t.name, v as any)}
                          >
                            <SelectTrigger className="w-[120px] h-9 rounded-xl border-primary/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ask">Authorize</SelectItem>
                              <SelectItem value="always">Continuous</SelectItem>
                              <SelectItem value="denied">Restricted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {t.description && (
                          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed line-clamp-2 italic opacity-80">
                            {t.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {(toolsByServer[s.id] || []).length === 0 && (
                    <div className="text-center py-6 bg-primary/5 rounded-2xl border border-dashed border-primary/20 text-xs text-muted-foreground font-medium">
                      Discovering tools... Synchronizing protocol definitions.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {servers.length === 0 && (
            <div className="text-center py-16 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10 flex flex-col items-center space-y-4">
              <Box className="w-12 h-12 text-primary opacity-20" />
              <p className="text-lg text-muted-foreground font-bold tracking-tight">No protocol expansions detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
