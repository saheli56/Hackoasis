declare module 'csv-parser' {
  function csv(options?: Record<string, unknown>): NodeJS.ReadableStream;
  export = csv;
}