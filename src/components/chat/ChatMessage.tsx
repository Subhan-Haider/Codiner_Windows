import type { Message } from "@/ipc/ipc_types";
import {
  CodinerMarkdownParser,
  VanillaMarkdownParser,
} from "./CodinerMarkdownParser";
import { motion } from "framer-motion";
import { useStreamChat } from "@/hooks/useStreamChat";
import {
  CheckCircle,
  XCircle,
  Clock,
  GitCommit,
  Copy,
  Check,
  Info,
  Bot,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useVersions } from "@/hooks/useVersions";
import { useAtomValue } from "jotai";
import { selectedAppIdAtom } from "@/atoms/appAtoms";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
}

const ChatMessage = ({ message, isLastMessage }: ChatMessageProps) => {
  const { isStreaming } = useStreamChat();
  const appId = useAtomValue(selectedAppIdAtom);
  const { versions: liveVersions } = useVersions(appId);
  //handle copy chat
  const { copyMessageContent, copied } = useCopyToClipboard();
  const handleCopyFormatted = async () => {
    await copyMessageContent(message.content);
  };
  // Find the version that was active when this message was sent
  const messageVersion = useMemo(() => {
    if (
      message.role === "assistant" &&
      message.commitHash &&
      liveVersions.length
    ) {
      return (
        liveVersions.find(
          (version) =>
            message.commitHash &&
            version.oid.slice(0, 7) === message.commitHash.slice(0, 7),
        ) || null
      );
    }
    return null;
  }, [message.commitHash, message.role, liveVersions]);

  // handle copy request id
  const [copiedRequestId, setCopiedRequestId] = useState(false);
  const copiedRequestIdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (copiedRequestIdTimeoutRef.current) {
        clearTimeout(copiedRequestIdTimeoutRef.current);
      }
    };
  }, []);

  // Format the message timestamp
  const formatTimestamp = (timestamp: string | Date) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours =
      (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return formatDistanceToNow(messageTime, { addSuffix: true });
    } else {
      return format(messageTime, "MMM d, yyyy 'at' h:mm a");
    }
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        message.role === "assistant" ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "max-w-[85%] group",
        message.role === "assistant" ? "mr-auto" : "ml-auto"
      )}>
        <div
          className={cn(
            "rounded-2xl p-5 transition-all duration-200",
            message.role === "assistant"
              ? "bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30"
              : "bg-primary text-primary-foreground shadow-md"
          )}
        >
          {message.role === "assistant" &&
            !message.content &&
            isStreaming &&
            isLastMessage ? (
            <div className="flex h-8 items-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "prose dark:prose-invert prose-headings:mb-4 prose-p:my-2 prose-pre:my-3 prose-ul:my-2 prose-ol:my-2 max-w-none break-words",
                message.role === "assistant"
                  ? "text-base leading-relaxed"
                  : "text-base leading-relaxed prose-p:text-primary-foreground prose-headings:text-primary-foreground prose-strong:text-primary-foreground prose-code:text-primary-foreground/90"
              )}
              suppressHydrationWarning
            >
              {message.role === "assistant" ? (
                <>
                  <CodinerMarkdownParser content={message.content} />
                  {isLastMessage && isStreaming && (
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-sm text-primary/70 font-medium px-3 py-2 bg-primary/5 rounded-lg"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Codiner is thinking...</span>
                    </motion.div>
                  )}
                </>
              ) : (
                <VanillaMarkdownParser content={message.content} />
              )}
            </div>
          )}
          {(message.role === "assistant" && message.content && !isStreaming) ||
            message.approvalState ? (
            <div
              className={cn(
                "mt-3 pt-3 border-t flex items-center text-xs",
                message.role === "assistant"
                  ? "border-border justify-between"
                  : "border-primary-foreground/20 justify-end"
              )}
            >
              {message.role === "assistant" &&
                message.content &&
                !isStreaming && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          data-testid="copy-message-button"
                          onClick={handleCopyFormatted}
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200",
                            "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                          <span className="text-xs font-medium">{copied ? "Copied" : "Copy"}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copied ? "Copied to clipboard!" : "Copy message"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              <div className="flex flex-wrap gap-2 items-center">
                {message.approvalState && (
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                    message.approvalState === "approved"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  )}>
                    {message.approvalState === "approved" ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Approved</span>
                      </>
                    ) : message.approvalState === "rejected" ? (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Rejected</span>
                      </>
                    ) : null}
                  </div>
                )}
                {message.role === "assistant" && message.model && (
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md",
                    message.role === "assistant"
                      ? "text-muted-foreground bg-muted/50"
                      : "text-primary-foreground/70 bg-primary-foreground/10"
                  )}>
                    <Bot className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{message.model}</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
        {/* Timestamp and commit info for assistant messages - only visible on hover */}
        {message.role === "assistant" && message.createdAt && (
          <div className="mt-1 flex flex-wrap items-center justify-start space-x-2 text-xs text-gray-500 dark:text-gray-400 ">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimestamp(message.createdAt)}</span>
            </div>
            {messageVersion && messageVersion.message && (
              <div className="flex items-center space-x-1">
                <GitCommit className="h-3 w-3" />
                {messageVersion && messageVersion.message && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="max-w-50 truncate font-medium">
                        {
                          messageVersion.message
                            .replace(/^\[(Codiner|codiner)\]\s*/i, "")
                            .split("\n")[0]
                        }
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{messageVersion.message}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
            {message.requestId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (!message.requestId) return;
                        navigator.clipboard
                          .writeText(message.requestId)
                          .then(() => {
                            setCopiedRequestId(true);
                            if (copiedRequestIdTimeoutRef.current) {
                              clearTimeout(copiedRequestIdTimeoutRef.current);
                            }
                            copiedRequestIdTimeoutRef.current = setTimeout(
                              () => setCopiedRequestId(false),
                              2000,
                            );
                          })
                          .catch(() => {
                            // noop
                          });
                      }}
                      className="flex items-center space-x-1 px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200 cursor-pointer"
                    >
                      {copiedRequestId ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span className="text-xs">
                        {copiedRequestId ? "Copied" : "Request ID"}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copiedRequestId
                      ? "Copied!"
                      : `Copy Request ID: ${message.requestId.slice(0, 8)}...`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isLastMessage && message.totalTokens && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1 px-1 py-0.5">
                      <Info className="h-3 w-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Max tokens used: {message.totalTokens.toLocaleString()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
