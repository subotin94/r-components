import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/** Regular expression that matches example comments. */
const exampleCommentRegex = /<!--\s*example\(([^)]+)\)\s*-->/g;

const rComponentsPath = 'libs/r-components/src/lib/components/';
const demoPath = 'apps/demo/src/assets/docs';

export function rDocs() {
  getDialogDocsMd();
}

export function getDialogDocsMd() {
  const md = generateJsonDocs(
    readFileSync(
      join(process.cwd(), `${rComponentsPath}/popups/dialog/dialog.md`)
    )?.toString()
  );
  writeFileSync(join(process.cwd(), `${demoPath}/dialog.json`), JSON.stringify({content: md}));
}

function generateJsonDocs(md: string): string {
  return md.replace(exampleCommentRegex, (_match: string, content: string) => {
    // using [\s\S]* because .* does not match line breaks
    if (content.match(/\{[\s\S]*\}/g)) {
      const { example, file, region } = JSON.parse(content) as {
        example: string;
        file: string;
        region: string;
      };
      return `<div class="_example_ ${example} ${file} ${region}"></div>`;
    } else {
      return `<div class="_example_ ${content}"></div>`;
    }
  });
}