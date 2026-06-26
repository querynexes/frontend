import { useEffect, useRef } from 'react';

export default function ChatwootWidget() {
  const ready = useRef(false);

  useEffect(() => {
    if (ready.current) return;
    ready.current = true;

    window.chatwootSettings = {
      position: 'right',
      type: 'standard',
      launcherTitle: '',
    };

    const BASE_URL = 'https://app.chatwoot.com';
    const script = document.createElement('script');
    script.src = BASE_URL + '/packs/js/sdk.js';
    script.async = true;
    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: 'khtyxzTy9Rgx4sMAiYQLJdHu',
        baseUrl: BASE_URL,
      });
    };
    document.head.appendChild(script);
  }, []);

  return null;
}
