import { PostHog } from "posthog-js";
import { toast } from "sonner";

/**
 * Toast utility functions using Sonner for UI notifications
 */

/**
 * Show a success message
 * @param message The message to display
 */
export const showSuccess = (message: string) => {
  toast.success(message);
  console.log("Success:", message);
};

/**
 * Show an error message
 * @param message The error message to display
 */
export const showError = (message: any) => {
  const errorMessage = message.toString();
  toast.error(errorMessage);
  console.error("Error:", errorMessage);
  return null; // Return null to maintain API compatibility
};

/**
 * Show a warning message
 * @param message The warning message to display
 */
export const showWarning = (message: string) => {
  toast.warning(message);
  console.warn("Warning:", message);
};

/**
 * Show an info message
 * @param message The info message to display
 */
export const showInfo = (message: string) => {
  toast.info(message);
  console.info("Info:", message);
};

/**
 * Show an input request
 * @param message The prompt message
 * @param onResponse Callback function
 */
export const showInputRequest = (
  message: string,
  onResponse: (response: "y" | "n") => void,
) => {
  toast(message, {
    action: {
      label: "Yes",
      onClick: () => onResponse("y"),
    },
    cancel: {
      label: "No",
      onClick: () => onResponse("n"),
    },
  });
  console.log("Input request:", message);
  return null;
};

/**
 * Show MCP consent toast
 */
export function showMcpConsentToast(args: {
  serverName: string;
  toolName: string;
  toolDescription?: string | null;
  inputPreview?: string | null;
  onDecision: (d: "accept-once" | "accept-always" | "decline") => void;
}) {
  const description = args.toolDescription
    ? `${args.toolDescription}${args.inputPreview ? `\nInput: ${args.inputPreview}` : ''}`
    : `Tool: ${args.toolName}${args.inputPreview ? `\nInput: ${args.inputPreview}` : ''}`;

  toast(`Allow ${args.serverName} to use ${args.toolName}?`, {
    description,
    duration: 10000,
    action: {
      label: "Accept Once",
      onClick: () => args.onDecision("accept-once"),
    },
    cancel: {
      label: "Accept Always",
      onClick: () => args.onDecision("accept-always"),
    },
    actionButtonStyle: {
      backgroundColor: "#10b981",
    },
    onDismiss: () => args.onDecision("decline"),
  });

  console.log("MCP consent request:", args.serverName, args.toolName);
  return null;
}

/**
 * Show extra files toast - logs only
 */
export const showExtraFilesToast = ({
  files,
  error,
  posthog,
}: {
  files: string[];
  error?: string;
  posthog: PostHog;
}) => {
  if (error) {
    console.error(`Error committing files ${files.join(", ")} changed outside of Codiner: ${error}`);
    posthog.capture("extra-files:error", {
      files: files,
      error,
    });
  } else {
    console.warn(`Files changed outside of Codiner have automatically been committed:\n\n${files.join("\n")}`);
    posthog.capture("extra-files:warning", {
      files: files,
    });
  }
};

// Re-export sonner toast for compatibility
export { toast } from "sonner";
