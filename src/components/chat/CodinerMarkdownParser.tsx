import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";

import { CodinerWrite } from "./CodinerWrite";
import { CodinerRename } from "./CodinerRename";
import { CodinerDelete } from "./CodinerDelete";
import { CodinerAddDependency } from "./CodinerAddDependency";
import { CodinerExecuteSql } from "./CodinerExecuteSql";
import { CodinerAddIntegration } from "./CodinerAddIntegration";
import { CodinerEdit } from "./CodinerEdit";
import { CodinerSearchReplace } from "./CodinerSearchReplace";
import { CodinerCodebaseContext } from "./CodinerCodebaseContext";
import { CodinerThink } from "./CodinerThink";
import { CodeHighlight } from "./CodeHighlight";
import { useAtomValue } from "jotai";
import { isStreamingByIdAtom, selectedChatIdAtom } from "@/atoms/chatAtoms";
import { CustomTagState } from "./stateTypes";
import { CodinerOutput } from "./CodinerOutput";
import { CodinerProblemSummary } from "./CodinerProblemSummary";
import { IpcClient } from "@/ipc/ipc_client";
import { CodinerMcpToolCall } from "./CodinerMcpToolCall";
import { CodinerMcpToolResult } from "./CodinerMcpToolResult";
import { CodinerWebSearchResult } from "./CodinerWebSearchResult";
import { CodinerWebSearch } from "./CodinerWebSearch";
import { CodinerWebCrawl } from "./CodinerWebCrawl";
import { CodinerCodeSearchResult } from "./CodinerCodeSearchResult";
import { CodinerCodeSearch } from "./CodinerCodeSearch";
import { CodinerRead } from "./CodinerRead";
import { CodinerListFiles } from "./CodinerListFiles";
import { CodinerDatabaseSchema } from "./CodinerDatabaseSchema";
import { mapActionToButton } from "./ChatInput";
import { SuggestedAction } from "@/lib/schemas";
import { FixAllErrorsButton } from "./FixAllErrorsButton";

const CODINER_CUSTOM_TAGS = [
  "codiner-write",
  "codiner-rename",
  "codiner-delete",
  "codiner-add-dependency",
  "codiner-execute-sql",
  "codiner-add-integration",
  "codiner-output",
  "codiner-problem-report",
  "codiner-chat-summary",
  "codiner-edit",
  "codiner-search-replace",
  "codiner-codebase-context",
  "codiner-web-search-result",
  "codiner-web-search",
  "codiner-web-crawl",
  "codiner-code-search-result",
  "codiner-code-search",
  "codiner-read",
  "think",
  "codiner-command",
  "codiner-mcp-tool-call",
  "codiner-mcp-tool-result",
  "codiner-list-files",
  "codiner-database-schema",
  "codiner-security-finding",
  "codiner-write",
  "codiner-rename",
  "codiner-delete",
  "codiner-add-dependency",
  "codiner-execute-sql",
  "codiner-add-integration",
  "codiner-output",
  "codiner-problem-report",
  "codiner-chat-summary",
  "codiner-edit",
  "codiner-search-replace",
  "codiner-codebase-context",
  "codiner-web-search-result",
  "codiner-web-search",
  "codiner-web-crawl",
  "codiner-code-search-result",
  "codiner-code-search",
  "codiner-read",
  "codiner-command",
  "codiner-mcp-tool-call",
  "codiner-mcp-tool-result",
  "codiner-list-files",
  "codiner-database-schema",
  "codiner-security-finding",
];

interface CodinerMarkdownParserProps {
  content: string;
}

type CustomTagInfo = {
  tag: string;
  attributes: Record<string, string>;
  content: string;
  fullMatch: string;
  inProgress?: boolean;
};

type ContentPiece =
  | { type: "markdown"; content: string }
  | { type: "custom-tag"; tagInfo: CustomTagInfo };

const customLink = ({
  node: _node,
  ...props
}: {
  node?: any;
  [key: string]: any;
}) => (
  <a
    {...props}
    onClick={(e) => {
      const url = props.href;
      if (url) {
        e.preventDefault();
        IpcClient.getInstance().openExternalUrl(url);
      }
    }}
  />
);

export const VanillaMarkdownParser = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      components={{
        code: CodeHighlight,
        a: customLink,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

/**
 * Custom component to parse markdown content with Codiner-specific tags
 */
export const CodinerMarkdownParser: React.FC<CodinerMarkdownParserProps> = ({
  content,
}) => {
  const chatId = useAtomValue(selectedChatIdAtom);
  const isStreaming = useAtomValue(isStreamingByIdAtom).get(chatId!) ?? false;
  // Extract content pieces (markdown and custom tags)
  const contentPieces = useMemo(() => {
    return parseCustomTags(content);
  }, [content]);

  // Extract error messages and track positions
  const { errorMessages, lastErrorIndex, errorCount } = useMemo(() => {
    const errors: string[] = [];
    let lastIndex = -1;
    let count = 0;

    contentPieces.forEach((piece, index) => {
      if (
        piece.type === "custom-tag" &&
        (piece.tagInfo.tag === "codiner-output" || piece.tagInfo.tag === "Codiner-output") &&
        piece.tagInfo.attributes.type === "error"
      ) {
        const errorMessage = piece.tagInfo.attributes.message;
        if (errorMessage?.trim()) {
          errors.push(errorMessage.trim());
          count++;
          lastIndex = index;
        }
      }
    });

    return {
      errorMessages: errors,
      lastErrorIndex: lastIndex,
      errorCount: count,
    };
  }, [contentPieces]);

  return (
    <>
      {contentPieces.map((piece, index) => (
        <React.Fragment key={index}>
          {piece.type === "markdown"
            ? piece.content && (
              <ReactMarkdown
                components={{
                  code: CodeHighlight,
                  a: customLink,
                }}
              >
                {piece.content}
              </ReactMarkdown>
            )
            : renderCustomTag(piece.tagInfo, { isStreaming })}
          {index === lastErrorIndex &&
            errorCount > 1 &&
            !isStreaming &&
            chatId && (
              <div className="mt-3 w-full flex">
                <FixAllErrorsButton
                  errorMessages={errorMessages}
                  chatId={chatId}
                />
              </div>
            )}
        </React.Fragment>
      ))}
    </>
  );
};

/**
 * Pre-process content to handle unclosed custom tags
 * Adds closing tags at the end of the content for any unclosed custom tags
 * Assumes the opening tags are complete and valid
 * Returns the processed content and a map of in-progress tags
 */
function preprocessUnclosedTags(content: string): {
  processedContent: string;
  inProgressTags: Map<string, Set<number>>;
} {
  let processedContent = content;
  // Map to track which tags are in progress and their positions
  const inProgressTags = new Map<string, Set<number>>();

  // For each tag type, check if there are unclosed tags
  for (const tagName of CODINER_CUSTOM_TAGS) {
    // Count opening and closing tags
    const openTagPattern = new RegExp(`<${tagName}(?:\\s[^>]*)?>`, "g");
    const closeTagPattern = new RegExp(`</${tagName}>`, "g");

    // Track the positions of opening tags
    const openingMatches: RegExpExecArray[] = [];
    let match;

    // Reset regex lastIndex to start from the beginning
    openTagPattern.lastIndex = 0;

    while ((match = openTagPattern.exec(processedContent)) !== null) {
      openingMatches.push({ ...match });
    }

    const openCount = openingMatches.length;
    const closeCount = (processedContent.match(closeTagPattern) || []).length;

    // If we have more opening than closing tags
    const missingCloseTags = openCount - closeCount;
    if (missingCloseTags > 0) {
      // Add the required number of closing tags at the end
      processedContent += Array(missingCloseTags)
        .fill(`</${tagName}>`)
        .join("");

      // Mark the last N tags as in progress where N is the number of missing closing tags
      const inProgressIndexes = new Set<number>();
      const startIndex = openCount - missingCloseTags;
      for (let i = startIndex; i < openCount; i++) {
        inProgressIndexes.add(openingMatches[i].index);
      }
      inProgressTags.set(tagName, inProgressIndexes);
    }
  }

  return { processedContent, inProgressTags };
}

/**
 * Parse the content to extract custom tags and markdown sections into a unified array
 */
function parseCustomTags(content: string): ContentPiece[] {
  const { processedContent, inProgressTags } = preprocessUnclosedTags(content);

  const tagPattern = new RegExp(
    `<(${CODINER_CUSTOM_TAGS.join("|")})\\s*([^>]*)>(.*?)<\\/\\1>`,
    "gs",
  );

  const contentPieces: ContentPiece[] = [];
  let lastIndex = 0;
  let match;

  // Find all custom tags
  while ((match = tagPattern.exec(processedContent)) !== null) {
    const [fullMatch, tag, attributesStr, tagContent] = match;
    const startIndex = match.index;

    // Add the markdown content before this tag
    if (startIndex > lastIndex) {
      contentPieces.push({
        type: "markdown",
        content: processedContent.substring(lastIndex, startIndex),
      });
    }

    // Parse attributes
    const attributes: Record<string, string> = {};
    const attrPattern = /(\w+)="([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrPattern.exec(attributesStr)) !== null) {
      attributes[attrMatch[1]] = attrMatch[2];
    }

    // Check if this tag was marked as in progress
    const tagInProgressSet = inProgressTags.get(tag);
    const isInProgress = tagInProgressSet?.has(startIndex);

    // Add the tag info
    contentPieces.push({
      type: "custom-tag",
      tagInfo: {
        tag,
        attributes,
        content: tagContent,
        fullMatch,
        inProgress: isInProgress || false,
      },
    });

    lastIndex = startIndex + fullMatch.length;
  }

  // Add the remaining markdown content
  if (lastIndex < processedContent.length) {
    contentPieces.push({
      type: "markdown",
      content: processedContent.substring(lastIndex),
    });
  }

  return contentPieces;
}

function getState({
  isStreaming,
  inProgress,
}: {
  isStreaming?: boolean;
  inProgress?: boolean;
}): CustomTagState {
  if (!inProgress) {
    return "finished";
  }
  return isStreaming ? "pending" : "aborted";
}

/**
 * Render a custom tag based on its type
 */
function renderCustomTag(
  tagInfo: CustomTagInfo,
  { isStreaming }: { isStreaming: boolean },
): React.ReactNode {
  const { tag, attributes, content, inProgress } = tagInfo;

  switch (tag) {
    case "codiner-read":
    case "Codiner-read":
    case "codiner-read":
      return (
        <CodinerRead
          node={{
            properties: {
              path: attributes.path || "",
            },
          }}
        >
          {content}
        </CodinerRead>
      );
    case "codiner-web-search":
    case "Codiner-web-search":
    case "codiner-web-search":
      return (
        <CodinerWebSearch
          node={{
            properties: {},
          }}
        >
          {content}
        </CodinerWebSearch>
      );
    case "codiner-web-crawl":
    case "Codiner-web-crawl":
    case "codiner-web-crawl":
      return (
        <CodinerWebCrawl
          node={{
            properties: {},
          }}
        >
          {content}
        </CodinerWebCrawl>
      );
    case "codiner-code-search":
    case "Codiner-code-search":
    case "codiner-code-search":
      return (
        <CodinerCodeSearch
          node={{
            properties: {},
          }}
        >
          {content}
        </CodinerCodeSearch>
      );
    case "codiner-code-search-result":
    case "Codiner-code-search-result":
    case "codiner-code-search-result":
      return (
        <CodinerCodeSearchResult
          node={{
            properties: {},
          }}
        >
          {content}
        </CodinerCodeSearchResult>
      );
    case "codiner-web-search-result":
    case "Codiner-web-search-result":
    case "codiner-web-search-result":
      return (
        <CodinerWebSearchResult
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerWebSearchResult>
      );
    case "think":
      return (
        <CodinerThink
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerThink>
      );
    case "codiner-write":
    case "Codiner-write":
    case "codiner-write":
      return (
        <CodinerWrite
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerWrite>
      );

    case "codiner-rename":
    case "Codiner-rename":
    case "codiner-rename":
      return (
        <CodinerRename
          node={{
            properties: {
              from: attributes.from || "",
              to: attributes.to || "",
            },
          }}
        >
          {content}
        </CodinerRename>
      );

    case "codiner-delete":
    case "Codiner-delete":
    case "codiner-delete":
      return (
        <CodinerDelete
          node={{
            properties: {
              path: attributes.path || "",
            },
          }}
        >
          {content}
        </CodinerDelete>
      );

    case "codiner-add-dependency":
    case "Codiner-add-dependency":
    case "codiner-add-dependency":
      return (
        <CodinerAddDependency
          node={{
            properties: {
              packages: attributes.packages || "",
            },
          }}
        >
          {content}
        </CodinerAddDependency>
      );

    case "codiner-execute-sql":
    case "Codiner-execute-sql":
    case "codiner-execute-sql":
      return (
        <CodinerExecuteSql
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
              description: attributes.description || "",
            },
          }}
        >
          {content}
        </CodinerExecuteSql>
      );

    case "codiner-add-integration":
    case "Codiner-add-integration":
    case "codiner-add-integration":
      return (
        <CodinerAddIntegration
          node={{
            properties: {
              provider: attributes.provider || "",
            },
          }}
        >
          {content}
        </CodinerAddIntegration>
      );

    case "codiner-edit":
    case "Codiner-edit":
    case "codiner-edit":
      return (
        <CodinerEdit
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerEdit>
      );

    case "codiner-search-replace":
    case "Codiner-search-replace":
    case "codiner-search-replace":
      return (
        <CodinerSearchReplace
          node={{
            properties: {
              path: attributes.path || "",
              description: attributes.description || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerSearchReplace>
      );

    case "codiner-codebase-context":
    case "Codiner-codebase-context":
    case "codiner-codebase-context":
      return (
        <CodinerCodebaseContext
          node={{
            properties: {
              files: attributes.files || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerCodebaseContext>
      );

    case "codiner-mcp-tool-call":
    case "Codiner-mcp-tool-call":
    case "codiner-mcp-tool-call":
      return (
        <CodinerMcpToolCall
          node={{
            properties: {
              serverName: attributes.server || "",
              toolName: attributes.tool || "",
            },
          }}
        >
          {content}
        </CodinerMcpToolCall>
      );

    case "codiner-mcp-tool-result":
    case "Codiner-mcp-tool-result":
    case "codiner-mcp-tool-result":
      return (
        <CodinerMcpToolResult
          node={{
            properties: {
              serverName: attributes.server || "",
              toolName: attributes.tool || "",
            },
          }}
        >
          {content}
        </CodinerMcpToolResult>
      );

    case "codiner-output":
    case "Codiner-output":
    case "codiner-output":
      return (
        <CodinerOutput
          type={attributes.type as "warning" | "error"}
          message={attributes.message}
        >
          {content}
        </CodinerOutput>
      );

    case "codiner-problem-report":
    case "Codiner-problem-report":
    case "codiner-problem-report":
      return (
        <CodinerProblemSummary summary={attributes.summary}>
          {content}
        </CodinerProblemSummary>
      );

    case "codiner-chat-summary":
    case "Codiner-chat-summary":
    case "codiner-chat-summary":
      // Don't render anything for summary tags
      return null;

    case "codiner-command":
    case "Codiner-command":
    case "codiner-command":
      if (attributes.type) {
        const action = {
          id: attributes.type,
        } as SuggestedAction;
        return <>{mapActionToButton(action)}</>;
      }
      return null;

    case "codiner-list-files":
    case "Codiner-list-files":
    case "codiner-list-files":
      return (
        <CodinerListFiles
          node={{
            properties: {
              directory: attributes.directory || "",
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerListFiles>
      );

    case "codiner-database-schema":
    case "Codiner-database-schema":
    case "codiner-database-schema":
      return (
        <CodinerDatabaseSchema
          node={{
            properties: {
              state: getState({ isStreaming, inProgress }),
            },
          }}
        >
          {content}
        </CodinerDatabaseSchema>
      );

    case "codiner-security-finding":
    case "codiner-security-finding":
      return (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 my-2">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${attributes.level === "critical" ? "bg-red-600 text-white" :
              attributes.level === "high" ? "bg-red-500 text-white" :
                attributes.level === "medium" ? "bg-orange-500 text-white" :
                  "bg-yellow-500 text-white"
              }`}>
              {attributes.level || "finding"}
            </span>
            <h4 className="font-bold text-sm">{attributes.title}</h4>
          </div>
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      );

    default:
      return null;
  }
}
