const logoModules = import.meta.glob('../assets/Cute_Animal_3D_Icons/*.png', { import: 'default' });
const logoPaths = Object.keys(logoModules).sort((left, right) => left.localeCompare(right));

function pickRandomLogoPath() {
  if (!logoPaths.length) {
    return '';
  }

  const index = Math.floor(Math.random() * logoPaths.length);

  return logoPaths[index];
}

const selectedLogoPath = pickRandomLogoPath();

export const selectedLogoFileName = selectedLogoPath.split('/').pop() || '';

let selectedLogo;
let appLogoPromise;

export function loadAppLogo() {
  if (!selectedLogoPath || !logoModules[selectedLogoPath]) {
    return Promise.resolve(null);
  }

  if (selectedLogo) {
    return Promise.resolve(selectedLogo);
  }

  if (!appLogoPromise) {
    appLogoPromise = logoModules[selectedLogoPath]().then((src) => {
      selectedLogo = {
        fileName: selectedLogoFileName,
        src,
      };

      return selectedLogo;
    });
  }

  return appLogoPromise;
}
