declare namespace JSX {
  interface IntrinsicElements {
    'xrpl-wallet-connector': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'primary-wallet'?: string;
        ref?: React.Ref<any>;
      },
      HTMLElement
    >;
  }
}

declare module 'xrpl-connect' {
  export class WalletConnectorElement extends HTMLElement {
    setWalletManager(manager: any): void;
  }
}

