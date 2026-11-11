# Priority: a Trello Power-Up

Gives every Trello card a priority level, shows it on the card, and sorts lists by it.

- **Back of the card:** a "Priority" section with five one-click levels. Clicking the selected level again clears it.
- **Front of the card:** a colored badge with the level name. Cards with no priority get no badge.
- **List menu:** Sort By… → **Priority (highest first)**. Cards with no priority go last, and cards at the same level keep their current order.
- **Board settings:** rename the five levels for each board.
- **Guests / non-members:** can see priorities but not change them.

| Level | Default name | Badge color |
|-------|--------------|-------------|
| 1     | Highest      | red         |
| 2     | High         | orange      |
| 3     | Medium       | yellow      |
| 4     | Low          | blue        |
| 5     | Lowest       | gray        |

Priorities are stored on each card, and level names on each board, in Trello's shared Power-Up data, so everyone on the board sees the same thing. No server or database is involved, and the app needs no API key.

Cards store the level number (1–5), not its name. Renaming a level updates every card at that level right away.

To change the default names or colors, edit `js/priority.js` and `css/powerup.css`, then run the tests.

## Install it for your workspace

You need to be an **admin of the Trello workspace**.

### 1. Host the files over HTTPS

Trello loads Power-Ups from a public HTTPS URL. Any static host works. Upload the whole folder except `dev/` and `test/`, which are optional.

- **GitHub Pages:** push this folder to a repo, then go to Settings → Pages → Deploy from branch `main` / root. Your URL looks like `https://<you>.github.io/<repo>/`.
- **Netlify:** drag the folder onto <https://app.netlify.com/drop>.

Check that `https://<your-host>/index.html` loads. It shows a blank page, which is expected.

### 2. Register the Power-Up

1. Open <https://trello.com/power-ups/admin> and choose your workspace.
2. Click **New** and fill in:
   - **Name:** Priority
   - **Workspace:** yours
   - **Iframe connector URL:** `https://<your-host>/index.html`
3. Open the **Capabilities** tab and turn on:
   - `card-badges`
   - `card-back-section`
   - `list-sorters`
   - `show-settings`
4. Optionally, under **Basic information**, set the icon to `https://<your-host>/img/icon.svg`.

### 3. Turn it on for a board

On a board in that workspace, open **Power-Ups → Custom** and click **Add** next to Priority. To rename levels, open **Power-Ups → Priority → ⋯ → Settings**.

## Develop

```bash
npm test               # priority logic tests
npm run preview        # local preview server on port 8791
```

Then open <http://localhost:8791/dev/preview.html>. It's a fake Trello board that runs the real Power-Up code, so you can try setting priorities, sorting, renaming levels, dark theme and view-only mode without deploying.

### Files

| Path | What it is |
|------|------------|
| `index.html`, `js/client.js` | Connector Trello loads in the background: badges, card-back section, list sorter, settings |
| `section.html`, `js/section.js` | The level picker on the back of a card |
| `settings.html`, `js/settings.js` | Board settings popup for renaming levels |
| `js/priority.js` | Levels, names, badges, sorting (no Trello code) |
| `js/ui.js`, `css/powerup.css` | Shared helpers and styles for the two iframes |
| `img/` | Icons |
| `test/` | Unit tests for `js/priority.js` |
| `dev/` | Local preview only: mock Trello, preview board, static server |
