export interface DocsPage {
  sections: DocsPageSection[];
}

export interface DocsPageSection {
  componentName: null | string;
  markdown: null | string;
}
