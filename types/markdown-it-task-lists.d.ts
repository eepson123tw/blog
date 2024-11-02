declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it';

  interface TaskListOptions {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }

  function taskLists(md: MarkdownIt, options?: TaskListOptions): void;
  export default taskLists;
}


declare module 'markdown-it-custom-attrs' {
  import type MarkdownIt from 'markdown-it';

  interface CustomAttrsOptions {
    tag?: string;
    attr?: Record<string, string>;
  }

  function markdownItCustomAttrs(md: MarkdownIt, tag?: string, attr?: Record<string, string>): void;
  export default markdownItCustomAttrs;
}
