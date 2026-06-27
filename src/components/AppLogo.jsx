import { useEffect, useState } from 'react';
import { loadAppLogo, selectedLogoFileName } from '../utils/appLogo.js';

export default function AppLogo() {
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    loadAppLogo().then((nextLogo) => {
      if (isMounted) {
        setLogo(nextLogo);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl">
      {logo?.src ? (
        <img className="h-10 w-10 object-contain" src={logo.src} alt="" title={selectedLogoFileName} />
      ) : (
        <span className="h-5 w-5 rounded-[40px] bg-loot-border" aria-hidden="true" />
      )}
    </span>
  );
}
