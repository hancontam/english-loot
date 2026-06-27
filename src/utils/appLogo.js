const logoModules = import.meta.glob('../assets/Cute_Animal_3D_Icons/*.png', { import: 'default' });
const logoPaths = Object.keys(logoModules).sort((left, right) => left.localeCompare(right));

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(index);
  }

  return Math.abs(hash);
}

const selectedLogoPath = logoPaths.length ? logoPaths[hashString(getTodayKey()) % logoPaths.length] : '';

export const selectedLogoFileName = selectedLogoPath.split('/').pop() || '';

let appLogoPromise;

export function loadAppLogo() {
  if (!selectedLogoPath || !logoModules[selectedLogoPath]) {
    return Promise.resolve(null);
  }

  if (!appLogoPromise) {
    appLogoPromise = logoModules[selectedLogoPath]().then((src) => ({
      fileName: selectedLogoFileName,
      src,
    }));
  }

  return appLogoPromise;
}
