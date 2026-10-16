'use client';

import React, { useEffect } from 'react';

export default function AdsterraAd() {
  useEffect(() => {
    const containerId = 'container-91018cf29ba0529315096e8cb307cfb5';
    if (document.getElementById(containerId)?.innerHTML !== '') return;

    // Ensure banner script is loaded in client
    const scriptId = 'adsterra-banner-91018cf29ba0529315096e8cb307cfb5';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://bauval.org/21/91018cf29ba0529315096e8cb307cfb5';
      script.onerror = () => {
        console.warn('[Adsterra] Banner script blocked or unavailable');
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center my-8">
      <p className="text-[10px] text-gray-500 mb-2 tracking-widest">إعلان</p>
      <div className="w-full max-w-[728px] min-h-[90px] bg-[#1e1e32] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
        {/* Adsterra Banner */}
        <div id="container-91018cf29ba0529315096e8cb307cfb5"></div>
      </div>
      <script async data-cfasync="false" src="https://bauval.org/21/91018cf29ba0529315096e8cb307cfb5"></script>
    </div>
  );
}
