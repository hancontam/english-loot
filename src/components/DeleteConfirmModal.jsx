import { useEffect, useState } from 'react';
import { loadAppLogo } from '../utils/appLogo.js';

export default function DeleteConfirmModal({ description, isOpen, onCancel, onConfirm, title }) {
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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(24_24_24_/_0.32)] p-4"
      onClick={onCancel}
    >
      <section
        aria-describedby="delete-confirm-description"
        aria-labelledby="delete-confirm-title"
        aria-modal="true"
        className="delete-confirm-modal w-full max-w-[420px] overflow-hidden rounded-[32px] border border-loot-border bg-loot-card text-center"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 pb-8 pt-8">
          <div className="mx-auto mb-6 grid h-32 w-32 place-items-center overflow-hidden rounded-[24px]">
            {mascot?.src ? (
              <img className="h-32 w-32 object-contain" src={mascot.src} alt="" title={mascot.fileName} />
            ) : (
              <span className="h-20 w-20 rounded-[24px] bg-loot-selected" aria-hidden="true" />
            )}
          </div>

          <h2 id="delete-confirm-title" className="text-lg font-medium text-loot-text">
            {title}
          </h2>

          <p id="delete-confirm-description" className="mt-3 text-sm font-normal leading-6 text-loot-muted">
            {description}
          </p>
        </div>

        <div className="grid gap-3 border-t border-loot-border bg-loot-card p-5 sm:grid-cols-2">
          <button
            className="h-11 rounded-xl bg-loot-selected px-4 text-sm font-medium text-loot-text transition-colors hover:bg-loot-border"
            type="button"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button
            className="h-11 rounded-xl bg-[#E95A1A] px-4 text-sm font-medium text-white transition-colors hover:bg-[#D94F14]"
            type="button"
            onClick={onConfirm}
          >
            Có, xóa tất cả
          </button>
        </div>
      </section>
    </div>
  );
}
