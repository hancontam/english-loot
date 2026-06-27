import { useEffect, useState } from 'react';
import { loadAppLogo } from '../utils/appLogo.js';

export default function MascotBubble() {
  const [mascot, setMascot] = useState(null);

  useEffect(() => {
    let isMounted = true;

    loadAppLogo().then((logo) => {
      if (isMounted) {
        setMascot(logo);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl">
      {mascot?.src ? (
        <img className="h-10 w-10 object-contain" src={mascot.src} alt="" title={mascot.fileName} />
      ) : (
        <span className="h-5 w-5 rounded-[40px] bg-loot-border" aria-hidden="true" />
      )}
    </div>
  );
}
