/// <reference types="vite/client" />

interface Window {
  chatwootSDK: {
    run: (config: { websiteToken: string; baseUrl: string }) => void;
    open: () => void;
    close: () => void;
  };
}
