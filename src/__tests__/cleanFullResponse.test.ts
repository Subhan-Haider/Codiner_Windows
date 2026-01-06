import { cleanFullResponse } from "@/ipc/utils/cleanFullResponse";
import { describe, it, expect } from "vitest";

describe("cleanFullResponse", () => {
  it("should replace < characters in codiner-write attributes", () => {
    const input = `<codiner-write path="src/file.tsx" description="Testing <a> tags.">content</codiner-write>`;
    const expected = `<codiner-write path="src/file.tsx" description="Testing ＜a＞ tags.">content</codiner-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should replace < characters in multiple attributes", () => {
    const input = `<codiner-write path="src/<component>.tsx" description="Testing <div> tags.">content</codiner-write>`;
    const expected = `<codiner-write path="src/＜component＞.tsx" description="Testing ＜div＞ tags.">content</codiner-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle multiple nested HTML tags in a single attribute", () => {
    const input = `<codiner-write path="src/file.tsx" description="Testing <div> and <span> and <a> tags.">content</codiner-write>`;
    const expected = `<codiner-write path="src/file.tsx" description="Testing ＜div＞ and ＜span＞ and ＜a＞ tags.">content</codiner-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle complex example with mixed content", () => {
    const input = `
      BEFORE TAG
  <codiner-write path="src/pages/locations/neighborhoods/louisville/Highlands.tsx" description="Updating Highlands neighborhood page to use <a> tags.">
import React from 'react';
</codiner-write>
AFTER TAG
    `;

    const expected = `
      BEFORE TAG
  <codiner-write path="src/pages/locations/neighborhoods/louisville/Highlands.tsx" description="Updating Highlands neighborhood page to use ＜a＞ tags.">
import React from 'react';
</codiner-write>
AFTER TAG
    `;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle other codiner tag types", () => {
    const input = `<codiner-rename from="src/<old>.tsx" to="src/<new>.tsx"></codiner-rename>`;
    const expected = `<codiner-rename from="src/＜old＞.tsx" to="src/＜new＞.tsx"></codiner-rename>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle codiner-delete tags", () => {
    const input = `<codiner-delete path="src/<component>.tsx"></codiner-delete>`;
    const expected = `<codiner-delete path="src/＜component＞.tsx"></codiner-delete>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should not affect content outside codiner tags", () => {
    const input = `Some text with <regular> HTML tags. <codiner-write path="test.tsx" description="With <nested> tags.">content</codiner-write> More <html> here.`;
    const expected = `Some text with <regular> HTML tags. <codiner-write path="test.tsx" description="With ＜nested＞ tags.">content</codiner-write> More <html> here.`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle empty attributes", () => {
    const input = `<codiner-write path="src/file.tsx">content</codiner-write>`;
    const expected = `<codiner-write path="src/file.tsx">content</codiner-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });

  it("should handle attributes without < characters", () => {
    const input = `<codiner-write path="src/file.tsx" description="Normal description">content</codiner-write>`;
    const expected = `<codiner-write path="src/file.tsx" description="Normal description">content</codiner-write>`;

    const result = cleanFullResponse(input);
    expect(result).toBe(expected);
  });
});
