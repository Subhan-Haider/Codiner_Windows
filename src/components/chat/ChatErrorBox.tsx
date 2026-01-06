import { IpcClient } from "@/ipc/ipc_client";
import { AI_STREAMING_ERROR_MESSAGE_PREFIX } from "@/shared/texts";
import {
  X,
  ExternalLink as ExternalLinkIcon,
  CircleArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatErrorBox({
  onDismiss,
  error,
  isCodinerProEnabled,
}: {
  onDismiss: () => void;
  error: string;
  isCodinerProEnabled: boolean;
}) {
  const prettifyError = (msg: string) => {
    // Handle Gemini Quota Error
    if (msg.includes("generativelanguage.googleapis.com/generate_content_free_tier_requests")) {
      const waitMatch = msg.match(/retry in ([\d.]+)s/);
      const waitTime = waitMatch ? Math.ceil(parseFloat(waitMatch[1])) : null;
      return `**AI Quota Exceeded**: You've reached the limit for the **Gemini free tier**. ${waitTime ? `**Please wait approximately ${waitTime} seconds before retrying.**` : "**Please wait a moment before trying again.**"}`;
    }
    return msg;
  };

  const displayError = prettifyError(error);

  if (displayError.includes("doesn't have a free quota tier")) {
    return (
      <ChatErrorContainer onDismiss={onDismiss}>
        {displayError} Please switch to another model.
      </ChatErrorContainer>
    );
  }

  if (
    displayError.includes("Resource has been exhausted") ||
    displayError.includes("https://ai.google.dev/gemini-api/docs/rate-limits") ||
    displayError.includes("Provider returned error") ||
    displayError.includes("AI Quota Exceeded")
  ) {
    return (
      <ChatErrorContainer onDismiss={onDismiss}>
        {displayError}
        <div className="mt-2 space-y-2 space-x-2">
          <ExternalLink href="https://codiner.online/docs/help/ai-rate-limit">
            Troubleshooting guide
          </ExternalLink>

          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            onClick={onDismiss}
          >
            Keep going
          </Button>
        </div>
      </ChatErrorContainer>
    );
  }

  if (displayError.includes("LiteLLM Virtual Key expected")) {
    return (
      <ChatInfoContainer onDismiss={onDismiss}>
        <span>
          Looks like you don't have a valid API key configured. Please check your settings.
        </span>
      </ChatInfoContainer>
    );
  }
  if (isCodinerProEnabled && displayError.includes("ExceededBudget:")) {
    return (
      <ChatInfoContainer onDismiss={onDismiss}>
        <span>
          You have used all of your AI credits this month.{" "}
          <ExternalLink
            href="https://academy.codiner.online/subscription?utm_source=codiner-app&utm_medium=app&utm_campaign=exceeded-budget-error"
            variant="primary"
          >
            Manage your subscription
          </ExternalLink>{" "}
          to get more AI credits
        </span>
      </ChatInfoContainer>
    );
  }
  // This is a very long list of model fallbacks that clutters the error message.
  //
  // We are matching "Fallbacks=[{" and not just "Fallbacks=" because the fallback
  // model itself can error and we want to include the fallback model error in the error message.
  const fallbackPrefix = "Fallbacks=[{";
  let finalError = displayError;
  if (finalError.includes(fallbackPrefix)) {
    finalError = finalError.split(fallbackPrefix)[0];
  }
  return (
    <ChatErrorContainer onDismiss={onDismiss}>
      {finalError}
      <div className="mt-2 space-y-2 space-x-2">
        <ExternalLink href="https://www.codiner.online/docs/faq">
          Read docs
        </ExternalLink>
      </div>
    </ChatErrorContainer>
  );
}

function ExternalLink({
  href,
  children,
  variant = "secondary",
  icon,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}) {
  const baseClasses =
    "cursor-pointer inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2";
  const primaryClasses =
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  const secondaryClasses =
    "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 focus:ring-blue-200";
  const iconElement =
    icon ??
    (variant === "primary" ? (
      <CircleArrowUp size={18} />
    ) : (
      <ExternalLinkIcon size={14} />
    ));

  return (
    <a
      className={`${baseClasses} ${variant === "primary" ? primaryClasses : secondaryClasses
        }`}
      onClick={() => IpcClient.getInstance().openExternalUrl(href)}
    >
      <span>{children}</span>
      {iconElement}
    </a>
  );
}

function ChatErrorContainer({
  onDismiss,
  children,
}: {
  onDismiss: () => void;
  children: React.ReactNode | string;
}) {
  return (
    <div className="relative mt-2 bg-red-50 border border-red-200 rounded-md shadow-sm p-2 mx-4">
      <button
        onClick={onDismiss}
        className="absolute top-2.5 left-2 p-1 hover:bg-red-100 rounded"
      >
        <X size={14} className="text-red-500" />
      </button>
      <div className="pl-8 py-1 text-sm">
        <div className="text-red-700 text-wrap">
          {typeof children === "string" ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ children: linkChildren, ...props }) => (
                  <a
                    {...props}
                    onClick={(e) => {
                      e.preventDefault();
                      if (props.href) {
                        IpcClient.getInstance().openExternalUrl(props.href);
                      }
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {linkChildren}
                  </a>
                ),
              }}
            >
              {children}
            </ReactMarkdown>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

function ChatInfoContainer({
  onDismiss,
  children,
}: {
  onDismiss: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-2 bg-sky-50 border border-sky-200 rounded-md shadow-sm p-2 mx-4">
      <button
        onClick={onDismiss}
        className="absolute top-2.5 left-2 p-1 hover:bg-sky-100 rounded"
      >
        <X size={14} className="text-sky-600" />
      </button>
      <div className="pl-8 py-1 text-sm">
        <div className="text-sky-800 text-wrap">{children}</div>
      </div>
    </div>
  );
}
