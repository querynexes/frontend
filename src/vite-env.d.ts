/// <reference types="vite/client" />

interface Window {
  chatwootSettings?: Record<string, unknown>;
  chatwootSDK: {
    run: (config: { websiteToken: string; baseUrl: string }) => void;
    open: () => void;
    close: () => void;
  };
}
