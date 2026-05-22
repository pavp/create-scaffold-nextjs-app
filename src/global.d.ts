declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
