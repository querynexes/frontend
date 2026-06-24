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

    (function (d, t) {
      const BASE_URL = 'https://app.chatwoot.com';
      const g = d.createElement(t), s = d.getElementsByTagName(t)[0];
      g.src = BASE_URL + '/packs/js/sdk.js';
      g.async = true;
      s.parentNode.insertBefore(g, s);
      g.onload = function () {
        window.chatwootSDK.run({
          websiteToken: 'khtyxzTy9Rgx4sMAiYQLJdHu',
          baseUrl: BASE_URL,
        });
      };
    })(document, 'script');
  }, []);

  return null;
}
