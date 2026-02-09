# Logo images for dashboard strips

Put your logo image files in this folder. They will appear in:

- **Sponsor Dashboard** – "Event Organizers" strip (colleges, summits)
- **Organizer Dashboard** – "Our Sponsors" strip (brand logos)

## How to attach images

1. **Add image files here**  
   Save your logo files in `public/logos/`, for example:
   - `tech-summit.png`
   - `iit-delhi.png`
   - `techcorp.png`
   - etc.

2. **Match the names in `lib/mockData.js`**  
   The mock data already points to:
   - **Organizer logos:** `tech-summit.png`, `iit-delhi.png`, `startup-con.png`, `bits-pilani.png`, `innovation-fest.png`, `nit-trichy.png`
   - **Brand logos:** `techcorp.png`, `cloudvault.png`, `ecobrand.png`, `vc-partners.png`, `medtech.png`, `sponsor-co.png`

   Either name your files to match these, or edit `lib/mockData.js` and set `imageUrl` to your filename, e.g. `imageUrl: '/logos/your-logo.png'`.

3. **Supported formats**  
   PNG, JPG, JPEG, WebP, SVG (for SVG you may need to use a regular `<img>` or Next.js config).

If a file is missing, the strip will show the logo name as text until the image is added.
