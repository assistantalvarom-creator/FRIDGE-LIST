# Fridge Shopping List

Tap an NFC sticker on the fridge → phone opens this page → add or view what
needs to be bought. Two screens: **Add** (quick add + your frequent items)
and **Cart** (the current list, with a Clear button once shopping is done).
Data syncs live across every phone in the household via Firebase Firestore.

## 1. Firebase setup (~5 min, one time)

1. Go to https://console.firebase.google.com → **Add project** → name it
   (e.g. `fridge-list`) → you can disable Google Analytics → **Create**.
2. In the left menu, open **Build → Firestore Database** → **Create
   database** → choose a location close to you → start in **production
   mode** → **Enable**.
3. Go to the **Rules** tab of Firestore and replace the contents with the
   rules below, then **Publish**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   This keeps the list open (no login) so any phone can read/write it. That's
   fine for a private household list — the only way in is knowing the config
   values below, which only live in your own deployed app. If you'd rather
   add real access control later, that's a small follow-up (Firebase
   Anonymous Auth), just ask.

4. Go to **Project settings** (gear icon) → scroll to **Your apps** → click
   the **Web** icon (`</>`) → register an app (any nickname) → you do **not**
   need Firebase Hosting for this. Copy the `firebaseConfig` object shown.
5. Open `firebase-config.js` in this folder and paste your 6 values in,
   replacing the `YOUR_...` placeholders.

## 2. Deploy to GitHub Pages (~3 min)

1. Go to https://github.com/new → create a new **public** repo (e.g.
   `fridge-list`) → don't initialize with a README (this folder already has
   one).
2. Upload all the files in this folder (`index.html`, `style.css`, `app.js`,
   `catalog.js`, `firebase-config.js` with your real keys, `manifest.json`,
   the `icons/` folder) via the repo's **Add file → Upload files** button,
   then commit. If you're re-uploading after an update, GitHub will ask to
   overwrite the existing files — confirm that.
3. Go to the repo's **Settings → Pages** → under "Build and deployment"
   choose **Deploy from a branch** → branch `main`, folder `/ (root)` →
   **Save**.
4. Wait ~1 minute, then your app is live at:
   `https://<your-github-username>.github.io/fridge-list/`

Any time you want to change something, edit the file on GitHub (or push via
git) — Pages redeploys automatically in under a minute.

## 3. Write the NFC sticker

Use a free NFC-writing app (e.g. **NFC Tools** — available on both Android
and iOS) to write a **URL / URI record** to the sticker, pointing at your
GitHub Pages URL from step 2.4.

- **Android**: phones read NFC tags automatically anywhere — tapping the tag
  opens the URL directly, even from lock screen (make sure NFC is on in
  Settings).
- **iPhone (XS or later, iOS 14+)**: also reads NFC tags automatically with
  no app needed — briefly hold the top of the phone near the tag, a
  notification appears, tap it to open the URL in Safari. No Shortcuts app
  required.

Stick the tag on the fridge at phone height. Test with 2-3 phones before
trusting it.

## Notes

- "Frequently added" chips are built automatically from everything anyone
  has ever added — no manual curation needed. It just gets more useful over
  time.
- "Clear list" requires tapping twice (confirms, no accidental wipes) and
  clears the list for everyone instantly.
- Tapping an item in the Cart screen checks it off (useful while walking
  the aisles); Clear still wipes checked and unchecked items alike once
  you're done shopping.
- No login, no backend server to maintain — Firestore's free tier is far
  more than enough for a household list (50k reads / 20k writes per day).
- Typing in the Add box also shows a live dropdown of matching products from
  a built-in list of ~230 common Spanish supermarket items (`catalog.js`),
  each with a category icon. This is a fixed list bundled with the app, not
  fetched from any store live — Mercadona doesn't offer a public API for
  outside apps, so there's no reliable way to pull their real product photos.
  Want more items added to the list, or different categories? Just ask.
