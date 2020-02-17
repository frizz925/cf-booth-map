declare module '*.png' {
  const content: string;
  export = content;
}

declare module '*.webp' {
  const content: string;
  export = content;
}

declare module '*.html' {
  const content: string;
  export = content;
}

declare module '*.md' {
  const content: string;
  export = content;
}

type MapStageLoader = (stage: Element) => void;
