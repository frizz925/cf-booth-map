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

declare namespace Modernizr {
  export function on(feature: string, callback: (result: boolean) => void): void;
}
