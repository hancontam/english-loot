import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadAppLogo } from '../utils/appLogo.js';

export default function NotFoundPage() {
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
    <section className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex max-w-[520px] flex-col items-center">
        <div className="loot-float mb-8 h-48 w-48 overflow-hidden rounded-[32px] md:h-64 md:w-64">
          {mascot?.src ? (
            <img
              className="h-full w-full object-contain"
              src={mascot.src}
              alt="Cute English Loot mascot"
              title={mascot.fileName}
            />
          ) : (
            <span className="block h-full w-full rounded-[32px] bg-loot-selected" aria-hidden="true" />
          )}
        </div>

        <p className="mb-4 rounded-[40px] border border-loot-border bg-loot-card px-4 py-1 text-sm font-medium text-loot-muted">
          404
        </p>

        <h1 className="mb-4 max-w-[480px] text-2xl font-medium leading-8 text-loot-text">
          Uh-oh... I think this loot took a wrong turn.
        </h1>

        <p className="mb-8 max-w-[440px] text-sm leading-6 text-loot-muted">
          Let’s get you back to where the English things live.
        </p>

        <Link
          className="inline-flex h-10 items-center justify-center rounded-[40px] bg-loot-text px-6 text-sm font-medium text-loot-card transition-colors"
          to="/"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
