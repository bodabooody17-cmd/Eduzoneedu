declare module 'next/link' {
  import React from 'react';
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children?: React.ReactNode;
  }
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/server' {
  export class NextResponse {
    static json(body: any, init?: ResponseInit): Response;
  }
  export class NextRequest extends Request {}
}

declare module 'next/script' {
  import React from 'react';
  export interface ScriptProps extends React.ScriptHTMLAttributes<HTMLScriptElement> {
    strategy?: 'afterInteractive' | 'beforeInteractive' | 'lazyOnload' | 'worker';
  }
  const Script: React.FC<ScriptProps>;
  export default Script;
}
