import React, { useEffect, useRef } from 'react';

interface AdsterraNativeBannerProps {
  isAdmin?: boolean;
}

export const AdsterraNativeBanner: React.FC<AdsterraNativeBannerProps> = ({ isAdmin = false }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Never show ads for admins or supervisors
    if (isAdmin) return;

    const el = bannerRef.current;
    if (!el) return;

    // Reset container to avoid duplicate scripts on lesson switch or remount
    el.innerHTML = '<div id="container-91018cf29ba0529315096e8cb307cfb5" style="min-height:250px; width:100%;"></div>';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://bauval.org/21/91018cf29ba0529315096e8cb307cfb5';

    el.appendChild(script);

    return () => {
      if (el) {
        el.innerHTML = '';
      }
    };
  }, [isAdmin]);

  // If user is admin, render nothing
  if (isAdmin) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      className="w-full my-4 rounded-xl overflow-hidden bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-center transition-all"
      style={{ minHeight: '250px' }}
    >
      <div id="container-91018cf29ba0529315096e8cb307cfb5" style={{ minHeight: '250px', width: '100%' }}></div>
    </div>
  );
};
