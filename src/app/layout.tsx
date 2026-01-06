import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "../contexts/ThemeContext";
import { DeepLinkProvider } from "../contexts/DeepLinkContext";
import { MadeWithCodiner } from "@/components/made-with-codiner";
import { TitleBar } from "./TitleBar";
import { useEffect, type ReactNode } from "react";
import { useRunApp } from "@/hooks/useRunApp";
import { useAtomValue, useSetAtom } from "jotai";
import {
  appConsoleEntriesAtom,
  previewModeAtom,
  selectedAppIdAtom,
} from "@/atoms/appAtoms";
import { useSettings } from "@/hooks/useSettings";
import type { ZoomLevel } from "@/lib/schemas";
import { selectedComponentsPreviewAtom } from "@/atoms/previewAtoms";
import { chatInputValueAtom } from "@/atoms/chatAtoms";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const DEFAULT_ZOOM_LEVEL: ZoomLevel = "100";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { refreshAppIframe } = useRunApp();
  const previewMode = useAtomValue(previewModeAtom);
  const { settings } = useSettings();
  const setSelectedComponentsPreview = useSetAtom(
    selectedComponentsPreviewAtom,
  );
  const setChatInput = useSetAtom(chatInputValueAtom);
  const selectedAppId = useAtomValue(selectedAppIdAtom);
  const location = useLocation();
  const setConsoleEntries = useSetAtom(appConsoleEntriesAtom);

  useEffect(() => {
    const zoomLevel = settings?.zoomLevel ?? DEFAULT_ZOOM_LEVEL;
    const zoomFactor = Number(zoomLevel) / 100;

    const electronApi = (
      window as Window & {
        electron?: {
          webFrame?: {
            setZoomFactor: (factor: number) => void;
          };
        };
      }
    ).electron;

    if (electronApi?.webFrame?.setZoomFactor) {
      electronApi.webFrame.setZoomFactor(zoomFactor);

      return () => {
        electronApi.webFrame?.setZoomFactor(Number(DEFAULT_ZOOM_LEVEL) / 100);
      };
    }

    return () => { };
  }, [settings?.zoomLevel]);
  // Global keyboard listener for refresh events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+R (Windows/Linux) or Cmd+R (macOS)
      if (event.key === "r" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault(); // Prevent default browser refresh
        if (previewMode === "preview") {
          refreshAppIframe(); // Use our custom refresh function instead
        }
      }
    };

    // Add event listener to document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [refreshAppIframe, previewMode]);

  useEffect(() => {
    setChatInput("");
    setSelectedComponentsPreview([]);
    setConsoleEntries([]);
  }, [selectedAppId]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative selection:bg-primary/30">
      {/* Mesh Gradient Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
      </div>

      <ThemeProvider>
        <DeepLinkProvider>
          <SidebarProvider>
            <TitleBar />
            <div className="-mt-20">
              <AppSidebar />
            </div>
            <div
              id="layout-main-content-container"
              className="flex h-275 w-full overflow-x-hidden overflow-y-auto mt-40 mr-2 border border-border/40 rounded-2xl bg-background/60 backdrop-blur-xl transition-all duration-300 ease-in-out shadow-sm"
            >
              {children}
            </div>
            <MadeWithCodiner />
          </SidebarProvider>
        </DeepLinkProvider>
      </ThemeProvider>
    </div>
  );
}
