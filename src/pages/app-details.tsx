import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { normalizePath } from "../../shared/normalizePath";
import { useAtom, useSetAtom } from "jotai";
import { appsListAtom, selectedAppIdAtom } from "@/atoms/appAtoms";
import { IpcClient } from "@/ipc/ipc_client";
import { useLoadApps } from "@/hooks/useLoadApps";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MoreVertical,
  MessageCircle,
  Pencil,
  Folder,
  Download,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GitHubConnector } from "@/components/GitHubConnector";
import { SupabaseConnector } from "@/components/SupabaseConnector";
import { showError, showSuccess } from "@/lib/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { invalidateAppQuery } from "@/hooks/useLoadApp";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckName } from "@/hooks/useCheckName";
import { AppUpgrades } from "@/components/AppUpgrades";
import { CapacitorControls } from "@/components/CapacitorControls";

export default function AppDetailsPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const search = useSearch({ from: "/app-details" as const });
  const [appsList] = useAtom(appsListAtom);
  const { refreshApps } = useLoadApps();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isRenameConfirmDialogOpen, setIsRenameConfirmDialogOpen] =
    useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [isRenameFolderDialogOpen, setIsRenameFolderDialogOpen] =
    useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);

  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [newCopyAppName, setNewCopyAppName] = useState("");
  const [isChangeLocationDialogOpen, setIsChangeLocationDialogOpen] =
    useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const queryClient = useQueryClient();
  const setSelectedAppId = useSetAtom(selectedAppIdAtom);

  const debouncedNewCopyAppName = useDebounce(newCopyAppName, 150);
  const { data: checkNameResult, isLoading: isCheckingName } = useCheckName(
    debouncedNewCopyAppName,
  );
  const nameExists = checkNameResult?.exists ?? false;

  // Get the appId from search params and find the corresponding app
  const appId = search.appId ? Number(search.appId) : null;
  const selectedApp = appId ? appsList.find((app) => app.id === appId) : null;

  const handleDeleteApp = async () => {
    if (!appId) return;

    try {
      setIsDeleting(true);
      await IpcClient.getInstance().deleteApp(appId);
      setIsDeleteDialogOpen(false);
      await refreshApps();
      navigate({ to: "/", search: {} });
    } catch (error) {
      setIsDeleteDialogOpen(false);
      showError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenRenameDialog = () => {
    if (selectedApp) {
      setNewAppName(selectedApp.name);
      setIsRenameDialogOpen(true);
    }
  };

  const handleOpenRenameFolderDialog = () => {
    if (selectedApp) {
      setNewFolderName(
        normalizePath(selectedApp.path).split("/").pop() || selectedApp.path,
      );
      setIsRenameFolderDialogOpen(true);
    }
  };

  const handleRenameApp = async (renameFolder: boolean) => {
    if (!appId || !selectedApp || !newAppName.trim()) return;

    try {
      setIsRenaming(true);

      // Determine the new path based on user's choice
      const appPath = renameFolder ? newAppName : selectedApp.path;

      await IpcClient.getInstance().renameApp({
        appId,
        appName: newAppName,
        appPath,
      });

      setIsRenameDialogOpen(false);
      setIsRenameConfirmDialogOpen(false);
      await refreshApps();
    } catch (error) {
      console.error("Failed to rename app:", error);
      const errorMessage = (
        error instanceof Error ? error.message : String(error)
      ).replace(/^Error invoking remote method 'rename-app': Error: /, "");
      showError(errorMessage);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleRenameFolderOnly = async () => {
    if (!appId || !selectedApp || !newFolderName.trim()) return;

    try {
      setIsRenamingFolder(true);
      await IpcClient.getInstance().renameApp({
        appId,
        appName: selectedApp.name, // Keep the app name the same
        appPath: newFolderName, // Change only the folder path
      });

      setIsRenameFolderDialogOpen(false);
      await refreshApps();
    } catch (error) {
      console.error("Failed to rename folder:", error);
      const errorMessage = (
        error instanceof Error ? error.message : String(error)
      ).replace(/^Error invoking remote method 'rename-app': Error: /, "");
      showError(errorMessage);
    } finally {
      setIsRenamingFolder(false);
    }
  };

  const handleAppNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCopyAppName(e.target.value);
  };

  const handleOpenCopyDialog = () => {
    if (selectedApp) {
      setNewCopyAppName(`${selectedApp.name}-copy`);
      setIsCopyDialogOpen(true);
    }
  };

  const handleChangeLocation = async () => {
    if (!selectedApp || !appId) return;

    try {
      // Get the current parent directory as default
      const currentPath = selectedApp.resolvedPath || "";
      const currentParentDir = currentPath
        ? currentPath.replace(/[/\\][^/\\]*$/, "") // Remove last path component
        : undefined;

      const response =
        await IpcClient.getInstance().selectAppLocation(currentParentDir);
      if (!response.canceled && response.path) {
        await changeLocationMutation.mutateAsync({
          appId,
          parentDirectory: response.path,
        });
        setIsChangeLocationDialogOpen(false);
      } else {
        // User canceled the file dialog, close the change location dialog
        setIsChangeLocationDialogOpen(false);
      }
    } catch {
      // Error is already shown by the mutation's onError
      setIsChangeLocationDialogOpen(false);
    }
  };

  const copyAppMutation = useMutation({
    mutationFn: async ({ withHistory }: { withHistory: boolean }) => {
      if (!appId || !newCopyAppName.trim()) {
        throw new Error("Invalid app ID or name for copying.");
      }
      return IpcClient.getInstance().copyApp({
        appId,
        newAppName: newCopyAppName,
        withHistory,
      });
    },
    onSuccess: async (data) => {
      const appId = data.app.id;
      setSelectedAppId(appId);
      await invalidateAppQuery(queryClient, { appId });
      await refreshApps();
      await IpcClient.getInstance().createChat(appId);
      setIsCopyDialogOpen(false);
      navigate({ to: "/app-details", search: { appId } });
    },
    onError: (error) => {
      showError(error);
    },
  });

  const changeLocationMutation = useMutation({
    mutationFn: async (params: { appId: number; parentDirectory: string }) => {
      return IpcClient.getInstance().changeAppLocation(params);
    },
    onSuccess: async () => {
      await invalidateAppQuery(queryClient, { appId });
      await refreshApps();
      showSuccess("App location updated");
    },
    onError: (error) => {
      showError(error);
    },
  });

  const handleExportAsZip = async () => {
    if (!appId) return;

    try {
      setIsExporting(true);
      await IpcClient.getInstance().exportAppAsZip({ appId });
      showSuccess("App exported as ZIP successfully");
    } catch (error: any) {
      console.error("Failed to export app as ZIP:", error);
      const errorMessage = (
        error instanceof Error ? error.message : String(error)
      ).replace(/^Error invoking remote method 'export-app-as-zip': Error: /, "");
      showError(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  if (!selectedApp) {
    return (
      <div className="relative min-h-screen p-8">
        <Button
          onClick={() => router.history.back()}
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 flex items-center gap-1 bg-(--background-lightest) py-5"
        >
          <ArrowLeft className="h-3 w-4" />
          Back
        </Button>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold">App not found</h2>
        </div>
      </div>
    );
  }

  const currentAppPath = selectedApp.resolvedPath || "";

  return (
    <div
      className="relative min-h-screen p-6 w-full"
      data-testid="app-details-page"
    >
      <Button
        onClick={() => router.history.back()}
        variant="ghost"
        size="sm"
        className="absolute top-6 left-6 flex items-center gap-2 hover:bg-primary/10 transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back</span>
      </Button>

      <div className="w-full max-w-4xl mx-auto mt-16">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 mb-6 border border-primary/20 shadow-lg relative overflow-hidden">
          {/* Decorative gradient orb */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                  {selectedApp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold">{selectedApp.name}</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-primary/10"
                      onClick={handleOpenRenameDialog}
                      data-testid="app-details-rename-app-button"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(selectedApp.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Overflow Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-primary/10"
                    data-testid="app-details-more-options-button"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="end">
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={handleOpenRenameFolderDialog}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                    >
                      Rename folder
                    </Button>
                    <Button
                      onClick={() => setIsChangeLocationDialogOpen(true)}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                    >
                      Move folder
                    </Button>
                    <Button
                      onClick={handleOpenCopyDialog}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                    >
                      Copy app
                    </Button>
                    <Button
                      onClick={handleExportAsZip}
                      disabled={isExporting}
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                    >
                      {isExporting ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download ZIP
                    </Button>
                    <Button
                      onClick={() => setIsDeleteDialogOpen(true)}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* App Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Last Updated
                </span>
                <p className="text-base font-medium mt-1">
                  {new Date(selectedApp.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Location
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-primary/10"
                    onClick={() => {
                      IpcClient.getInstance().showItemInFolder(currentAppPath);
                    }}
                    title="Show in folder"
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                  <span className="text-sm truncate flex-1" title={currentAppPath}>
                    {currentAppPath}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Button
            onClick={() => {
              if (!appId) {
                console.error("No app id found");
                return;
              }
              navigate({ to: "/chat" });
            }}
            size="lg"
            className="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Open in Chat
          </Button>
        </div>

        {/* Integration Cards */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              GitHub Integration
            </h3>
            <GitHubConnector appId={appId} folderName={selectedApp.path} />
          </div>

          {appId && (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.9 1.9c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                  </svg>
                </div>
                Supabase Integration
              </h3>
              <SupabaseConnector appId={appId} />
            </div>
          )}

          {appId && (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                Capacitor Controls
              </h3>
              <CapacitorControls appId={appId} />
            </div>
          )}

          <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-800/50 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              App Upgrades
            </h3>
            <AppUpgrades appId={appId} />
          </div>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>Rename App</DialogTitle>
          </DialogHeader>
          <Input
            value={newAppName}
            onChange={(e) => setNewAppName(e.target.value)}
            placeholder="Enter new app name"
            className="my-2"
            autoFocus
          />
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              disabled={isRenaming}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsRenameDialogOpen(false);
                setIsRenameConfirmDialogOpen(true);
              }}
              disabled={isRenaming || !newAppName.trim()}
              size="sm"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Folder Dialog */}
      <Dialog
        open={isRenameFolderDialogOpen}
        onOpenChange={setIsRenameFolderDialogOpen}
      >
        <DialogContent className="max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>Rename app folder</DialogTitle>
            <DialogDescription className="text-xs">
              This will change only the folder name, not the app name.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Enter new folder name"
            className="my-2"
            autoFocus
          />
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRenameFolderDialogOpen(false)}
              disabled={isRenamingFolder}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameFolderOnly}
              disabled={isRenamingFolder || !newFolderName.trim()}
              size="sm"
            >
              {isRenamingFolder ? (
                <>
                  <svg
                    className="animate-spin h-3 w-3 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Renaming...
                </>
              ) : (
                "Rename Folder"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Confirmation Dialog */}
      <Dialog
        open={isRenameConfirmDialogOpen}
        onOpenChange={setIsRenameConfirmDialogOpen}
      >
        <DialogContent className="max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">
              How would you like to rename "{selectedApp.name}"?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Choose an option:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 my-2">
            <Button
              variant="outline"
              className="w-full justify-start p-2 h-auto relative text-sm"
              onClick={() => handleRenameApp(true)}
              disabled={isRenaming}
            >
              <div className="absolute top-1 right-1">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 text-[10px]">
                  Recommended
                </span>
              </div>
              <div className="text-left">
                <p className="font-medium text-xs">Rename app and folder</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Renames the folder to match the new app name.
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start p-2 h-auto text-sm"
              onClick={() => handleRenameApp(false)}
              disabled={isRenaming}
            >
              <div className="text-left">
                <p className="font-medium text-xs">Rename app only</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The folder name will remain the same.
                </p>
              </div>
            </Button>
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsRenameConfirmDialogOpen(false)}
              disabled={isRenaming}
              size="sm"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy App Dialog */}
      {selectedApp && (
        <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
          <DialogContent className="max-w-md p-4">
            <DialogHeader className="pb-2">
              <DialogTitle>Copy "{selectedApp.name}"</DialogTitle>
              <DialogDescription className="text-sm">
                <p>Create a copy of this app.</p>
                <p>
                  Note: this does not copy over the Supabase project or GitHub
                  project.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 my-2">
              <div>
                <Label htmlFor="newAppName">New app name</Label>
                <div className="relative mt-1">
                  <Input
                    id="newAppName"
                    value={newCopyAppName}
                    onChange={handleAppNameChange}
                    placeholder="Enter new app name"
                    className="pr-8"
                    disabled={copyAppMutation.isPending}
                  />
                  {isCheckingName && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                {nameExists && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                    An app with this name already exists. Please choose
                    another name.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start p-2 h-auto relative text-sm"
                  onClick={() =>
                    copyAppMutation.mutate({ withHistory: true })
                  }
                  disabled={
                    copyAppMutation.isPending ||
                    nameExists ||
                    !newCopyAppName.trim() ||
                    isCheckingName
                  }
                >
                  {copyAppMutation.isPending &&
                    copyAppMutation.variables?.withHistory === true && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                  <div className="absolute top-1 right-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 text-[10px]">
                      Recommended
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-xs">
                      Copy app with history
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Copies the entire app, including the Git version
                      history.
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start p-2 h-auto text-sm"
                  onClick={() =>
                    copyAppMutation.mutate({ withHistory: false })
                  }
                  disabled={
                    copyAppMutation.isPending ||
                    nameExists ||
                    !newCopyAppName.trim() ||
                    isCheckingName
                  }
                >
                  {copyAppMutation.isPending &&
                    copyAppMutation.variables?.withHistory === false && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                  <div className="text-left">
                    <p className="font-medium text-xs">
                      Copy app without history
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Useful if the current app has a Git-related issue.
                    </p>
                  </div>
                </Button>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCopyDialogOpen(false)}
                disabled={copyAppMutation.isPending}
                size="sm"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Change Location Dialog */}
      <Dialog
        open={isChangeLocationDialogOpen}
        onOpenChange={setIsChangeLocationDialogOpen}
      >
        <DialogContent className="max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>Change App Location</DialogTitle>
            <DialogDescription className="text-xs">
              Select a folder where this app will be stored. The app folder
              name will remain the same.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsChangeLocationDialogOpen(false)}
              disabled={changeLocationMutation.isPending}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeLocation}
              disabled={changeLocationMutation.isPending}
              size="sm"
            >
              {changeLocationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Moving...
                </>
              ) : (
                "Select Folder"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle>Delete "{selectedApp.name}"?</DialogTitle>
            <DialogDescription className="text-xs">
              This action is irreversible. All app files and chat history will
              be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteApp}
              disabled={isDeleting}
              className="flex items-center gap-1"
              size="sm"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin h-3 w-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                "Delete App"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
