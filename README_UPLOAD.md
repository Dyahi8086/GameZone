# GameZone v2 — upload guide (Android, GitHub app/browser)
## Before anything: make a backup (2 min)
1. Open your repo in Chrome → Desktop site. Tap **main** (branch) → type `backup-classic` → **Create branch**. This freezes your current site. To restore: switch the Pages source branch to `backup-classic` (Settings → Pages), or copy files back.
2. Switch back to **main**.
## Upload
1. Unzip GameZone-v2.zip on your phone (Files app).
2. Repo → **Add file → Upload files**. Upload `index.html`, `library.html`, and the folders `css`, `js`, `games` (Chrome lets you select folders via the file picker; if not, upload files one folder at a time and keep the folder names).
3. Commit to main. Do NOT delete `script.js`, `style.css` or `index (2).html`; they're simply unused.
4. Wait ~1 min, open https://dyahi8086.github.io/GameZone/ (hard-refresh).
## Structure
index.html · library.html · css/style.css · js/{common,games,landing,library}.js · games/{space-shooter,neon-racer,adventure-quest}.html
## Notes
- Easter egg: tap the logo 7 times (or Konami code) → "Ghost" badge + theme.
- Scores/badges live in localStorage on that device only.
