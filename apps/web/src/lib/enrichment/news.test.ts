import { describe, expect, it } from "vitest";
import { parseNewsRss } from "./news";

describe("parseNewsRss", () => {
  it("extracts top five Google News RSS items", () => {
    const xml = `<rss><channel>${Array.from(
      { length: 6 },
      (_, i) =>
        `<item><title><![CDATA[Story ${i}]]></title><link>https://news.test/${i}</link><pubDate>Date ${i}</pubDate><source>Source ${i}</source></item>`,
    ).join("")}</channel></rss>`;

    const items = parseNewsRss(xml);

    expect(items).toHaveLength(5);
    expect(items[0]).toEqual({
      title: "Story 0",
      link: "https://news.test/0",
      pubDate: "Date 0",
      source: "Source 0",
    });
  });

  it("returns empty results for an empty channel", () => {
    expect(parseNewsRss("<rss><channel></channel></rss>")).toEqual([]);
  });

  it("rejects malformed RSS", () => {
    expect(() => parseNewsRss("not xml")).toThrow();
  });
});
