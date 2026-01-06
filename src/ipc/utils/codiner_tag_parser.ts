import { normalizePath } from "../../../shared/normalizePath";
import log from "electron-log";
import { SqlQuery } from "../../lib/schemas";

const logger = log.scope("codiner_tag_parser");

export function getCodinerWriteTags(fullResponse: string): {
    path: string;
    content: string;
    description?: string;
}[] {
    const codinerWriteRegex = /<codiner-write([^>]*)>([\s\S]*?)<\/codiner-write>/gi;
    const pathRegex = /path="([^"]+)"/;
    const descriptionRegex = /description="([^"]+)"/;

    let match;
    const tags: { path: string; content: string; description?: string }[] = [];

    while ((match = codinerWriteRegex.exec(fullResponse)) !== null) {
        const attributesString = match[1];
        let content = match[2].trim();

        const pathMatch = pathRegex.exec(attributesString);
        const descriptionMatch = descriptionRegex.exec(attributesString);

        if (pathMatch && pathMatch[1]) {
            const path = pathMatch[1];
            const description = descriptionMatch?.[1];

            const contentLines = content.split("\n");
            if (contentLines[0]?.startsWith("```")) {
                contentLines.shift();
            }
            if (contentLines[contentLines.length - 1]?.startsWith("```")) {
                contentLines.pop();
            }
            content = contentLines.join("\n");

            tags.push({ path: normalizePath(path), content, description });
        } else {
            logger.warn(
                "Found write tag without a valid 'path' attribute:",
                match[0],
            );
        }
    }
    return tags;
}

export function getCodinerRenameTags(fullResponse: string): {
    from: string;
    to: string;
}[] {
    const codinerRenameRegex =
        /<codiner-rename from="([^"]+)" to="([^"]+)"[^>]*>([\s\S]*?)<\/codiner-rename>/g;
    let match;
    const tags: { from: string; to: string }[] = [];
    while ((match = codinerRenameRegex.exec(fullResponse)) !== null) {
        tags.push({
            from: normalizePath(match[1]),
            to: normalizePath(match[2]),
        });
    }
    return tags;
}

export function getCodinerDeleteTags(fullResponse: string): string[] {
    const codinerDeleteRegex =
        /<codiner-delete path="([^"]+)"[^>]*>([\s\S]*?)<\/codiner-delete>/g;
    let match;
    const paths: string[] = [];
    while ((match = codinerDeleteRegex.exec(fullResponse)) !== null) {
        paths.push(normalizePath(match[1]));
    }
    return paths;
}

export function getCodinerAddDependencyTags(fullResponse: string): string[] {
    const codinerAddDependencyRegex =
        /<codiner-add-dependency packages="([^"]+)">[^<]*<\/codiner-add-dependency>/g;
    let match;
    const packages: string[] = [];
    while ((match = codinerAddDependencyRegex.exec(fullResponse)) !== null) {
        packages.push(...match[1].split(" "));
    }
    return packages;
}

export function getCodinerChatSummaryTag(fullResponse: string): string | null {
    const codinerChatSummaryRegex =
        /<codiner-chat-summary>([\s\S]*?)<\/codiner-chat-summary>/g;
    const match = codinerChatSummaryRegex.exec(fullResponse);
    if (match && match[1]) {
        return match[1].trim();
    }
    return null;
}

export function getCodinerExecuteSqlTags(fullResponse: string): SqlQuery[] {
    const codinerExecuteSqlRegex =
        /<codiner-execute-sql([^>]*)>([\s\S]*?)<\/codiner-execute-sql>/g;
    const descriptionRegex = /description="([^"]+)"/;
    let match;
    const queries: { content: string; description?: string }[] = [];

    while ((match = codinerExecuteSqlRegex.exec(fullResponse)) !== null) {
        const attributesString = match[1] || "";
        let content = match[2].trim();
        const descriptionMatch = descriptionRegex.exec(attributesString);
        const description = descriptionMatch?.[1];

        // Handle markdown code blocks if present
        const contentLines = content.split("\n");
        if (contentLines[0]?.startsWith("```")) {
            contentLines.shift();
        }
        if (contentLines[contentLines.length - 1]?.startsWith("```")) {
            contentLines.pop();
        }
        content = contentLines.join("\n");

        queries.push({ content, description });
    }

    return queries;
}

export function getCodinerCommandTags(fullResponse: string): string[] {
    const codinerCommandRegex =
        /<codiner-command type="([^"]+)"[^>]*><\/codiner-command>/g;
    let match;
    const commands: string[] = [];

    while ((match = codinerCommandRegex.exec(fullResponse)) !== null) {
        commands.push(match[1]);
    }

    return commands;
}

export function getCodinerSearchReplaceTags(fullResponse: string): {
    path: string;
    content: string;
    description?: string;
}[] {
    const codinerSearchReplaceRegex =
        /<codiner-search-replace([^>]*)>([\s\S]*?)<\/codiner-search-replace>/gi;
    const pathRegex = /path="([^"]+)"/;
    const descriptionRegex = /description="([^"]+)"/;

    let match;
    const tags: { path: string; content: string; description?: string }[] = [];

    while ((match = codinerSearchReplaceRegex.exec(fullResponse)) !== null) {
        const attributesString = match[1] || "";
        let content = match[2].trim();

        const pathMatch = pathRegex.exec(attributesString);
        const descriptionMatch = descriptionRegex.exec(attributesString);

        if (pathMatch && pathMatch[1]) {
            const path = pathMatch[1];
            const description = descriptionMatch?.[1];

            // Handle markdown code fences if present
            const contentLines = content.split("\n");
            if (contentLines[0]?.startsWith("```")) {
                contentLines.shift();
            }
            if (contentLines[contentLines.length - 1]?.startsWith("```")) {
                contentLines.pop();
            }
            content = contentLines.join("\n");

            tags.push({ path: normalizePath(path), content, description });
        } else {
            logger.warn(
                "Found search-replace tag without a valid 'path' attribute:",
                match[0],
            );
        }
    }
    return tags;
}
