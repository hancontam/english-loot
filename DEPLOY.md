# English Loot Deployment

English Loot is a Vite React app with static JSON data and browser-only progress storage.

## Vercel Settings

- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: none required for the current MVP

## Deploy Steps

1. Import the repository into Vercel.
2. Confirm the Vercel settings above.
3. Deploy the project.
4. After deployment, open the generated Vercel URL and test the main routes.

## Custom Domain

Planned custom domain:

`english.tamcontech.online`

Add this domain later in Vercel under Project Settings > Domains.

## DNS Note

For the `english` subdomain, Vercel commonly asks for a CNAME record:

- Type: `CNAME`
- Name/Host: `english`
- Value/Target: `cname.vercel-dns.com`

Always follow the exact DNS value shown by Vercel during domain setup if it differs. DNS changes can take time to propagate before Vercel marks the domain as valid.

## localStorage Note

English Loot stores progress in the user's browser `localStorage`. Progress is device/browser-specific and does not sync across devices. Clearing browser data resets progress.

## Known Limitations

- No backend, login, or database yet.
- Learning data is static JSON in the app bundle.
- Web Speech API voices and pronunciation can vary by browser and operating system.
- Cute animal PNG assets are large, so Vite may show build size warnings.
- The favicon and sidebar logo are app assets, not a final optimized production icon set yet.
