declare module 'typed.js' {
  interface TypedOptions {
    strings?: string[];
    stringsElement?: string;
    typeSpeed?: number;
    startDelay?: number;
    backSpeed?: number;
    smartBackspace?: boolean;
    shuffle?: boolean;
    backDelay?: number;
    fadeOut?: boolean;
    fadeOutClass?: string;
    fadeOutDelay?: number;
    loop?: boolean;
    loopCount?: number;
    showCursor?: boolean;
    cursorChar?: string;
    autoInsertCss?: boolean;
    attr?: string;
    bindInputFocusEvents?: boolean;
    contentType?: string;
  }

  class Typed {
    constructor(element: string | Element, options?: TypedOptions);
    destroy(): void;
    reset(restart?: boolean): void;
    start(): void;
    stop(): void;
    toggle(): void;
  }

  export = Typed;
}
