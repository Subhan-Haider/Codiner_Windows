import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  GiftIcon,
  Sparkles,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Settings,
  Folder,
} from "lucide-react";
import { providerSettingsRoute } from "@/routes/settings/providers/$provider";

import SetupProviderCard from "@/components/SetupProviderCard";

import { useState, useEffect, useCallback } from "react";
import { IpcClient } from "@/ipc/ipc_client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NodeSystemInfo } from "@/ipc/ipc_types";
import { usePostHog } from "posthog-js/react";
import { useLanguageModelProviders } from "@/hooks/useLanguageModelProviders";
import { useScrollAndNavigateTo } from "@/hooks/useScrollAndNavigateTo";
import logo from "../../assets/new-logo.png";
import { showError } from "@/lib/toast";
import { useSettings } from "@/hooks/useSettings";

type NodeInstallStep =
  | "install"
  | "waiting-for-continue"
  | "continue-processing"
  | "finished-checking";

export function SetupBanner() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  // const [isOnboardingVisible, setIsOnboardingVisible] = useState(true);
  const { isAnyProviderSetup, isLoading: loading } =
    useLanguageModelProviders();
  const [nodeSystemInfo, setNodeSystemInfo] = useState<NodeSystemInfo | null>(
    null,
  );
  const [nodeCheckError, setNodeCheckError] = useState<boolean>(false);
  const [nodeInstallStep, setNodeInstallStep] =
    useState<NodeInstallStep>("install");
  const checkNode = useCallback(async () => {
    try {
      setNodeCheckError(false);
      const status = await IpcClient.getInstance().getNodejsStatus();
      setNodeSystemInfo(status);
    } catch (error) {
      console.error("Failed to check Node.js status:", error);
      setNodeSystemInfo(null);
      setNodeCheckError(true);
    }
  }, [setNodeSystemInfo, setNodeCheckError]);
  const [showManualConfig, setShowManualConfig] = useState(false);
  const [isSelectingPath, setIsSelectingPath] = useState(false);
  const { updateSettings } = useSettings();

  // Add handler for manual path selection
  const handleManualNodeConfig = useCallback(async () => {
    setIsSelectingPath(true);
    try {
      const result = await IpcClient.getInstance().selectNodeFolder();
      if (result.path) {
        await updateSettings({ customNodePath: result.path });
        await IpcClient.getInstance().reloadEnvPath();
        await checkNode();
        setNodeInstallStep("finished-checking");
        setShowManualConfig(false);
      } else if (result.path === null && result.canceled === false) {
        showError(
          `Could not find Node.js at the path "${result.selectedPath}"`,
        );
      }
    } catch (error) {
      showError("Error setting Node.js path:" + error);
    } finally {
      setIsSelectingPath(false);
    }
  }, [checkNode]);

  useEffect(() => {
    checkNode();
  }, [checkNode]);

  const settingsScrollAndNavigateTo = useScrollAndNavigateTo("/settings", {
    behavior: "smooth",
    block: "start",
  });

  const handleGoogleSetupClick = () => {
    posthog.capture("setup-flow:ai-provider-setup:google:click");
    navigate({
      to: providerSettingsRoute.id,
      params: { provider: "google" },
    });
  };

  const handleOpenRouterSetupClick = () => {
    posthog.capture("setup-flow:ai-provider-setup:openrouter:click");
    navigate({
      to: providerSettingsRoute.id,
      params: { provider: "openrouter" },
    });
  };
  const handleCodinerProSetupClick = () => {
    posthog.capture("setup-flow:ai-provider-setup:codiner:click");
    IpcClient.getInstance().openExternalUrl(
      "https://www.codiner.online/pro?utm_source=codiner-app&utm_medium=app&utm_campaign=setup-banner",
    );
  };

  const handleOtherProvidersClick = () => {
    posthog.capture("setup-flow:ai-provider-setup:other:click");
    settingsScrollAndNavigateTo("provider-settings");
  };

  const handleNodeInstallClick = useCallback(async () => {
    posthog.capture("setup-flow:start-node-install-click");
    setNodeInstallStep("waiting-for-continue");
    IpcClient.getInstance().openExternalUrl(nodeSystemInfo!.nodeDownloadUrl);
  }, [nodeSystemInfo, setNodeInstallStep]);

  const finishNodeInstall = useCallback(async () => {
    posthog.capture("setup-flow:continue-node-install-click");
    setNodeInstallStep("continue-processing");
    await IpcClient.getInstance().reloadEnvPath();
    await checkNode();
    setNodeInstallStep("finished-checking");
  }, [checkNode, setNodeInstallStep]);

  // We only check for node version because pnpm is not required for the app to run.
  const isNodeSetupComplete = Boolean(nodeSystemInfo?.nodeVersion);

  const itemsNeedAction: string[] = [];
  if (!isNodeSetupComplete && nodeSystemInfo) {
    itemsNeedAction.push("node-setup");
  }
  if (!isAnyProviderSetup() && !loading) {
    itemsNeedAction.push("ai-setup");
  }

  if (itemsNeedAction.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mb-10 mt-6 animate-float">
        <img src={logo} alt="Codiner" className="h-16 w-auto mb-4 drop-shadow-2xl" />
        <h1 className="text-center text-6xl font-extrabold tracking-tight">
          <span className="text-gradient">Build your dream app</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-lg font-medium opacity-80">
          The most powerful AI coding assistant on your machine.
        </p>
      </div>
    );
  }

  const bannerClasses = cn(
    "w-full mb-6 border rounded-xl shadow-sm overflow-hidden",
    "border-zinc-200 dark:border-zinc-700",
  );

  const getStatusIcon = (isComplete: boolean, hasError: boolean = false) => {
    if (hasError) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return isComplete ? (
      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
    );
  };

  return (
    <>
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 tracking-tight">
          Setup Codiner
        </h2>
        <p className="text-xl text-muted-foreground font-medium opacity-80">Complete these steps to get started</p>
      </div>

      <div className="w-full mb-6 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-lg overflow-hidden">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={[...itemsNeedAction, "ai-setup"]}
        >
          <AccordionItem
            value="node-setup"
            className={cn(
              "transition-all duration-200",
              nodeCheckError
                ? "bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/30 dark:to-red-950/10 border-red-200 dark:border-red-900/50"
                : isNodeSetupComplete
                  ? "bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/10 border-green-200 dark:border-green-900/50"
                  : "bg-gradient-to-r from-purple-50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/10 border-purple-200 dark:border-purple-900/50",
              "border-b"
            )}
          >
            <AccordionTrigger className="px-6 py-4 transition-all hover:no-underline group">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(isNodeSetupComplete, nodeCheckError)}
                  </div>
                  <span className="font-semibold text-base group-hover:text-primary transition-colors">
                    1. Install Node.js (App Runtime)
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pt-6 pb-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-t border-inherit">
              {nodeCheckError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Error checking Node.js status. Try installing Node.js.
                </p>
              )}
              {isNodeSetupComplete ? (
                <p className="text-sm">
                  Node.js ({nodeSystemInfo!.nodeVersion}) installed.{" "}
                  {nodeSystemInfo!.pnpmVersion && (
                    <span className="text-xs text-gray-500">
                      {" "}
                      (optional) pnpm ({nodeSystemInfo!.pnpmVersion}) installed.
                    </span>
                  )}
                </p>
              ) : (
                <div className="text-sm">
                  <p>Node.js is required to run apps locally.</p>
                  {nodeInstallStep === "waiting-for-continue" && (
                    <p className="mt-1">
                      We're Codiner, a small team of developers building open-source tools
                      for other developers. We don't sell your data, we don't track yourk, try{" "}
                      <a
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                        onClick={() => {
                          IpcClient.getInstance().openExternalUrl(
                            "https://nodejs.org/en/download",
                          );
                        }}
                      >
                        more download options
                      </a>
                      .
                    </p>
                  )}
                  <NodeInstallButton
                    nodeInstallStep={nodeInstallStep}
                    handleNodeInstallClick={handleNodeInstallClick}
                    finishNodeInstall={finishNodeInstall}
                  />

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowManualConfig(!showManualConfig)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Node.js already installed? Configure path manually →
                    </button>

                    {showManualConfig && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Button
                          onClick={handleManualNodeConfig}
                          disabled={isSelectingPath}
                          variant="outline"
                          size="sm"
                        >
                          {isSelectingPath ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Selecting...
                            </>
                          ) : (
                            <>
                              <Folder className="mr-2 h-4 w-4" />
                              Browse for Node.js folder
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <NodeJsHelpCallout />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="ai-setup"
            className={cn(
              "transition-all duration-200",
              isAnyProviderSetup()
                ? "bg-gradient-to-r from-green-50 to-emerald-50/50 dark:from-green-950/30 dark:to-emerald-950/10 border-green-200 dark:border-green-900/50"
                : "bg-gradient-to-r from-purple-50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/10 border-purple-200 dark:border-purple-900/50",
              "border-b"
            )}
          >
            <AccordionTrigger
              className="px-6 py-4 transition-all hover:no-underline group"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(isAnyProviderSetup())}
                  </div>
                  <span className="font-semibold text-base group-hover:text-primary transition-colors">
                    2. Setup AI Access
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-8 pt-6 pb-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-t border-inherit">
              <p className="text-base mb-6 text-muted-foreground font-medium">
                Not sure what to do? Watch the Get Started video above ☝️
              </p>

              {/* Top row - Free options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <SetupProviderCard
                  className="h-full"
                  variant="google"
                  onClick={handleGoogleSetupClick}
                  tabIndex={isNodeSetupComplete ? 0 : -1}
                  leadingIcon={
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  }
                  title="Setup Google Gemini API Key"
                  chip={<>Free</>}
                />

                <SetupProviderCard
                  className="h-full"
                  variant="openrouter"
                  onClick={handleOpenRouterSetupClick}
                  tabIndex={isNodeSetupComplete ? 0 : -1}
                  leadingIcon={
                    <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  }
                  title="Setup OpenRouter API Key"
                  chip={<>Free</>}
                />
              </div>

              {/* Recommended option */}
              <SetupProviderCard
                className="mb-4"
                variant="codiner"
                onClick={handleCodinerProSetupClick}
                tabIndex={isNodeSetupComplete ? 0 : -1}
                leadingIcon={
                  <img src={logo} alt="Codiner Logo" className="w-6 h-6 mr-0.5 rounded-md shadow-sm" />
                }
                title="Setup Codiner Pro"
                subtitle="Access all AI models with one plan"
                chip={<>Recommended</>}
              />

              {/* Other providers */}
              <div
                className="p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200"
                onClick={handleOtherProvidersClick}
                role="button"
                tabIndex={isNodeSetupComplete ? 0 : -1}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 dark:bg-gray-700 p-2.5 rounded-lg">
                      <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                        Setup other AI providers
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        OpenAI, Anthropic and more
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

function NodeJsHelpCallout() {
  return (
    <div className="mt-3 p-3 bg-(--background-lighter) border rounded-lg text-sm">
      <p>
        If you run into issues, read our{" "}
        <a
          onClick={() => {
            IpcClient.getInstance().openExternalUrl(
              "https://www.codiner.online/docs/help/nodejs",
            );
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Node.js troubleshooting guide
        </a>
        .{" "}
      </p>
      <p className="mt-2">
        Still stuck? Click the <b>Help</b> button in the bottom-left corner and
        then <b>Report a Bug</b>.
      </p>
    </div>
  );
}

function NodeInstallButton({
  nodeInstallStep,
  handleNodeInstallClick,
  finishNodeInstall,
}: {
  nodeInstallStep: NodeInstallStep;
  handleNodeInstallClick: () => void;
  finishNodeInstall: () => void;
}) {
  switch (nodeInstallStep) {
    case "install":
      return (
        <Button className="mt-3" onClick={handleNodeInstallClick}>
          Install Node.js Runtime
        </Button>
      );
    case "continue-processing":
      return (
        <Button className="mt-3" onClick={finishNodeInstall} disabled>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking Node.js setup...
          </div>
        </Button>
      );
    case "waiting-for-continue":
      return (
        <Button className="mt-3" onClick={finishNodeInstall}>
          <div className="flex items-center gap-2">
            Continue | I installed Node.js
          </div>
        </Button>
      );
    case "finished-checking":
      return (
        <div className="mt-3 text-sm text-red-600 dark:text-red-400">
          Node.js not detected. Closing and re-opening Codiner usually fixes this.
        </div>
      );
    default:
      const _exhaustiveCheck: never = nodeInstallStep;
  }
}

export const OpenRouterSetupBanner = ({
  className,
}: {
  className?: string;
}) => {
  const posthog = usePostHog();
  const navigate = useNavigate();
  return (
    <SetupProviderCard
      className={cn("mt-2", className)}
      variant="openrouter"
      onClick={() => {
        posthog.capture("setup-flow:ai-provider-setup:openrouter:click");
        navigate({
          to: providerSettingsRoute.id,
          params: { provider: "openrouter" },
        });
      }}
      tabIndex={0}
      leadingIcon={
        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      }
      title="Setup OpenRouter API Key"
      chip={
        <>
          <GiftIcon className="w-3 h-3" />
          Free models available
        </>
      }
    />
  );
};
