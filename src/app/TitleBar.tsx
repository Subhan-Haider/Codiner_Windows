import { useAtom } from "jotai";
import { selectedAppIdAtom } from "@/atoms/appAtoms";
import { useLoadApps } from "@/hooks/useLoadApps";
import { useRouter, useLocation } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
// @ts-ignore
import logo from "../../assets/new-logo.png";
import { providerSettingsRoute } from "@/routes/settings/providers/$provider";
import { cn } from "@/lib/utils";
import { useDeepLink } from "@/contexts/DeepLinkContext";
import { useEffect, useState } from "react";
import { CodinerProSuccessDialog } from "@/components/CodinerProSuccessDialog";
import { useTheme } from "@/contexts/ThemeContext";
import { IpcClient } from "@/ipc/ipc_client";
import { useUserBudgetInfo } from "@/hooks/useUserBudgetInfo";
import { UserBudgetInfo } from "@/ipc/ipc_types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActionHeader } from "@/components/preview_panel/ActionHeader";

export const TitleBar = () => {
  const [selectedAppId] = useAtom(selectedAppIdAtom);
  const { apps } = useLoadApps();
  const { navigate } = useRouter();
  const location = useLocation();
  const { settings, refreshSettings } = useSettings();
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [showWindowControls, setShowWindowControls] = useState(false);

  useEffect(() => {
    // Check if we're running on Windows
    const checkPlatform = async () => {
      try {
        const platform = await IpcClient.getInstance().getSystemPlatform();
        setShowWindowControls(platform !== "darwin");
      } catch (error) {
        console.error("Failed to get platform info:", error);
      }
    };

    checkPlatform();
  }, []);

  const showCodinerProSuccessDialog = () => {
    setIsSuccessDialogOpen(true);
  };

  const { lastDeepLink, clearLastDeepLink } = useDeepLink();
  useEffect(() => {
    const handleDeepLink = async () => {
      if (lastDeepLink?.type === "codiner-pro-return") {
        await refreshSettings();
        showCodinerProSuccessDialog();
        clearLastDeepLink();
      }
    };
    handleDeepLink();
  }, [lastDeepLink?.timestamp]);

  // Get selected app name
  const selectedApp = apps.find((app) => app.id === selectedAppId);
  const displayText = selectedApp
    ? `App: ${selectedApp.name}`
    : "(no app selected)";

  const handleAppClick = () => {
    if (selectedApp) {
      navigate({ to: "/app-details", search: { appId: selectedApp.id } });
    }
  };

  const isCodinerPro = !!settings?.providerSettings?.auto?.apiKey?.value;
  const isCodinerProEnabled = Boolean(settings?.enableCodinerPro);

  return (
    <>
      <div className="@container z-[50] w-full h-11 backdrop-blur-xl fixed top-0 left-0 app-region-drag flex items-center border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-black/40 shadow-sm transition-all duration-500">
        <div className={`${showWindowControls ? "pl-2" : "pl-18"}`}></div>

        <img src={logo} alt="Codiner Logo" className="w-8 h-8 mr-2" />
        <Button
          data-testid="title-bar-app-name-button"
          variant="outline"
          size="sm"
          className={`hidden @2xl:block no-app-region-drag text-xs max-w-38 truncate font-medium ${selectedApp ? "cursor-pointer" : ""
            }`}
          onClick={handleAppClick}
        >
          {displayText}
        </Button>
        {isCodinerPro && <CodinerProButton isCodinerProEnabled={isCodinerProEnabled} />}

        {/* Preview Header */}
        {location.pathname === "/chat" && (
          <div className="flex-1 flex justify-end">
            <ActionHeader />
          </div>
        )}


        {showWindowControls && <WindowsControls />}
      </div>

      <CodinerProSuccessDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
      />
    </>
  );
};

function WindowsControls() {
  const ipcClient = IpcClient.getInstance();

  const minimizeWindow = () => ipcClient.minimizeWindow();
  const maximizeWindow = () => ipcClient.maximizeWindow();
  const closeWindow = () => ipcClient.closeWindow();

  return (
    <div className="ml-auto flex no-app-region-drag h-full items-stretch">
      <button
        className="w-12 h-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
        onClick={minimizeWindow}
        aria-label="Minimize"
      >
        <svg
          width="12"
          height="1"
          viewBox="0 0 12 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60 group-hover:opacity-100 transition-opacity"
        >
          <rect width="12" height="1" fill="currentColor" />
        </svg>
      </button>
      <button
        className="w-12 h-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-all group"
        onClick={maximizeWindow}
        aria-label="Maximize"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60 group-hover:opacity-100 transition-opacity"
        >
          <rect
            x="0.5"
            y="0.5"
            width="9"
            height="9"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </button>
      <button
        className="w-12 h-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group"
        onClick={closeWindow}
        aria-label="Close"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all font-bold"
        >
          <path
            d="M1 1L9 9M1 9L9 1"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>
    </div>
  );
}

export function CodinerProButton({
  isCodinerProEnabled,
}: {
  isCodinerProEnabled: boolean;
}) {
  const { navigate } = useRouter();
  const { userBudget } = useUserBudgetInfo();
  return (
    <Button
      data-testid="title-bar-codiner-pro-button"
      onClick={() => {
        navigate({
          to: "/settings/providers/$provider",
          params: { provider: "auto" },
        });
      }}
      variant="outline"
      className={cn(
        "hidden @2xl:block ml-1 no-app-region-drag h-7 bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white text-xs px-2 pt-1 pb-1",
        !isCodinerProEnabled && "bg-zinc-600 dark:bg-zinc-600",
      )}
      size="sm"
    >
      {isCodinerProEnabled ? "Pro" : "Pro (off)"}
      {userBudget && isCodinerProEnabled && (
        <AICreditStatus userBudget={userBudget} />
      )}
    </Button>
  );
}

export function AICreditStatus({ userBudget }: { userBudget: UserBudgetInfo }) {
  const remaining = Math.round(
    userBudget.totalCredits - userBudget.usedCredits,
  );
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="text-xs pl-1 mt-0.5">{remaining} credits</div>
      </TooltipTrigger>
      <TooltipContent>
        <div>
          <p>Note: there is a slight delay in updating the credit status.</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
