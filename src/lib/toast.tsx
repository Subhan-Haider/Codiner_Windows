import { PostHog } from "posthog-js";

/**
 * Toast utility functions - disabled as notifications have been removed
 * All functions now log to console instead of showing UI notifications
 */

/**
 * Show a success message (logs to console only)
 * @param message The message to display
 */
export const showSuccess = (message: string) => {
  console.log("Success:", message);
};

/**
 * Show an error message (logs to console only)
 * @param message The error message to display
 */
export const showError = (message: any) => {
  const errorMessage = message.toString();
  console.error("Error:", errorMessage);
  return null; // Return null to maintain API compatibility
};

/**
 * Show a warning message (logs to console only)
 * @param message The warning message to display
 */
export const showWarning = (message: string) => {
  console.warn("Warning:", message);
};

/**
 * Show an info message (logs to console only)
 * @param message The info message to display
 */
export const showInfo = (message: string) => {
  console.info("Info:", message);
};

/**
 * Show an input request - disabled (notifications removed)
 * @param message The prompt message
 * @param onResponse Callback function (not called)
 */
export const showInputRequest = (
  message: string,
  onResponse: (response: "y" | "n") => void,
) => {
  console.log("Input request (disabled):", message);
  // Default to "y" for compatibility
  onResponse("y");
  return null;
};

/**
 * Show MCP consent toast - disabled (notifications removed)
 */
export function showMcpConsentToast(args: {
  serverName: string;
  toolName: string;
  toolDescription?: string | null;
  inputPreview?: string | null;
  onDecision: (d: "accept-once" | "accept-always" | "decline") => void;
}) {
  console.log("MCP consent request (disabled):", args.serverName, args.toolName);
  // Default to "accept-once" for compatibility
  args.onDecision("accept-once");
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

// Export empty toast object for compatibility
export const toast = {
  success: () => null,
  error: () => null,
  warning: () => null,
  info: () => null,
  custom: () => null,
};
