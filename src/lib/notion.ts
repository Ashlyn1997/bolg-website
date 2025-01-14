import { Client } from "@notionhq/client";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";

const notion = new Client({
  auth: "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",
});

export async function getDatabase() {
  const response = await notion.databases.query({
    database_id: "16732fc7754d8014bd45f159a406dfcd",
    filter: {
      property: "status",
      select: {
        equals: "Published"
      }
    }
  });

  const articleList = response.results.map((item) => {
    const { properties, id, cover } = item;

    return {
      id,
      category: properties.category.select?.name,
      date: properties.date.date?.start,
      status: properties.status.select?.name,
      title: properties.title.title[0]?.plain_text,
      tags: properties.tags.multi_select.map((tag) => tag.name),
      cover: cover?.external?.url || "",
      AISummary: properties['AI summary']?.rich_text[0]?.plain_text
    };
  });

  return articleList;
}

// 获取页面内容和元数据
export async function getPage(pageId: string) {
  // 获取页面属性
  const page = await notion.pages.retrieve({
    page_id: pageId,
  });

  // 获取页面内容块
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });

  // 处理不同类型的块并转换为HTML
  const content = blocks.results
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          const text = block.paragraph.rich_text
            .map((t) => {
              let textContent = t.plain_text;
              if (t.annotations.bold)
                textContent = `<strong>${textContent}</strong>`;
              if (t.annotations.italic) textContent = `<em>${textContent}</em>`;
              if (t.annotations.code)
                textContent = `<code>${textContent}</code>`;
              if (t.href)
                textContent = `<a href="${t.href}" class="text-blue-500 hover:underline">${textContent}</a>`;
              return textContent;
            })
            .join("");
          return `<p class="mb-4">${text}</p>`;

        case "heading_1":
          return `<h1 class="text-3xl font-bold mt-8 mb-4">${
            block.heading_1.rich_text[0]?.plain_text || ""
          }</h1>`;

        case "heading_2":
          return `<h2 class="text-2xl font-bold mt-6 mb-3">${
            block.heading_2.rich_text[0]?.plain_text || ""
          }</h2>`;

        case "heading_3":
          return `<h3 class="text-xl font-bold mt-5 mb-2">${
            block.heading_3.rich_text[0]?.plain_text || ""
          }</h3>`;

        case "bulleted_list_item":
          return `<li class="ml-4 list-disc">${
            block.bulleted_list_item.rich_text[0]?.plain_text || ""
          }</li>`;

        case "numbered_list_item":
          return `<li class="ml-4 list-decimal">${
            block.numbered_list_item.rich_text[0]?.plain_text || ""
          }</li>`;

        case "code":
          const codeContent = block.code.rich_text[0]?.plain_text || "";
          const language = block.code.language || "plaintext";

          // 规范化代码缩进
          const lines = codeContent.split("\n");
          // 过滤掉空行，避免影响最小缩进计算
          const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
          const minIndent = nonEmptyLines.reduce((min, line) => {
            const indent = line.match(/^\s*/)[0].length;
            return indent < min ? indent : min;
          }, Infinity);

          // 应用缩进修正
          const normalizedCode = lines
            .map((line) => {
              if (line.trim().length === 0) return "";
              return line.slice(
                Math.min(minIndent, line.match(/^\s*/)[0].length)
              );
            })
            .join("\n")
            .trim();

          // 使用 Prism 进行语法高亮
          const highlightedCode = Prism.highlight(
            normalizedCode,
            Prism.languages[language] || Prism.languages.plaintext,
            language
          );

          return `
              <div class="relative group">
                <pre class="bg-gray-100 dark:bg-gray-800 rounded-lg my-4 overflow-hidden"><code class="block p-4 overflow-x-auto text-sm language-${language}">${highlightedCode}</code></pre>
                ${
                  language !== "plaintext"
                    ? `<div class="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        ${language}
                      </div>`
                    : ""
                }
              </div>`;

        case "quote":
          return `<blockquote class="border-l-4 border-gray-300 pl-4 my-4 italic">
          ${block.quote.rich_text[0]?.plain_text || ""}
        </blockquote>`;

        case "callout":
          const calloutIcon = block.callout.icon?.emoji || "💡";
          const calloutText = block.callout.rich_text[0]?.plain_text || "";
          const calloutColor = block.callout.color || "default";
          
          let bgColorClass = "bg-gray-100 dark:bg-gray-800";
          let borderColorClass = "border-gray-200 dark:border-gray-700";
          
          if (calloutColor === "blue") {
            bgColorClass = "bg-blue-50 dark:bg-blue-900/20";
            borderColorClass = "border-blue-200 dark:border-blue-800";
          } else if (calloutColor === "red") {
            bgColorClass = "bg-red-50 dark:bg-red-900/20";
            borderColorClass = "border-red-200 dark:border-red-800";
          } else if (calloutColor === "green") {
            bgColorClass = "bg-green-50 dark:bg-green-900/20";
            borderColorClass = "border-green-200 dark:border-green-800";
          } else if (calloutColor === "yellow") {
            bgColorClass = "bg-yellow-50 dark:bg-yellow-900/20";
            borderColorClass = "border-yellow-200 dark:border-yellow-800";
          }

          return `
            <div class="flex p-4 my-4 rounded-lg border ${bgColorClass} ${borderColorClass}">
              <div class="text-xl mr-4">${calloutIcon}</div>
              <div class="flex-1">${calloutText}</div>
            </div>
          `;

        case "image":
          const imageUrl =
            block.image.type === "external"
              ? block.image.external.url
              : block.image.file.url;
          return `<img src="${imageUrl}" alt="文章图片" class="my-4 rounded-lg max-w-full h-auto" />`;

        default:
          return "";
      }
    })
    .join("\n");

  // 从页面属性中提取元数据
  const metadata = {
    title: page.properties.title.title[0]?.plain_text,
    category: page.properties.category.select?.name,
    date: page.properties.date.date?.start,
    tags: page.properties.tags.multi_select.map((tag) => tag.name),
    cover: page.cover?.external?.url || "",
    author: 'Ashlyn Tu',
    content,
  };

  return metadata;
}