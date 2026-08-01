# JERN — treningslogg

Installerbar webapp (PWA). Ingen server, ingen konto, ingen avhengigheter.
All data ligger lokalt i nettleseren på telefonen din.

## Filer

| Fil | Hva den gjør |
|---|---|
| `index.html` | Hele appen — markup, stil og logikk i én fil |
| `manifest.webmanifest` | Gjør at Android installerer den som en ekte app (WebAPK) |
| `sw.js` | Service worker — appen virker uten nett |
| `icon-*.png`, `apple-touch-icon.png`, `favicon.png` | Ikoner |

## Legg den ut (GitHub Pages, gratis)

1. Lag et nytt repo på GitHub, f.eks. `jern`. Kan godt være privat — Pages fungerer for privat repo på gratisplanen for personlige kontoer.
2. Last opp alle filene i denne mappa til roten av repoet.
3. `Settings` → `Pages` → `Source: Deploy from a branch` → branch `main`, mappe `/ (root)` → `Save`.
4. Vent ett minutt. Adressen blir `https://<brukernavn>.github.io/jern/`.

HTTPS er et krav for at service worker og installasjon skal fungere. GitHub Pages gir deg det gratis.

## Installer på telefonen

**Android (Chrome):** åpne adressen → menyen (⋮) → `Installer app`.
Da lages en WebAPK: eget ikon i app-skuffen, ingen nettleserlinje, egen oppføring i multitasking.

**iPhone (Safari):** åpne adressen → Del → `Legg til på Hjem-skjerm`.

## Oppdatere appen senere

Last opp ny `index.html` og øk `CACHE`-navnet øverst i `sw.js` (`jern-v1` → `jern-v2`).
Uten det endrede navnet serverer service workeren den gamle versjonen fra cache.

## Ta backup

Innstillinger (⚙) → `Eksporter data` gir deg en JSON-fil med alt.
Gjør det innimellom. Tømmer du nettleserdata, er loggen borte.

## Videre: ekte APK uten Play Store

PWA-en er en gyldig kilde for en Trusted Web Activity, altså en signert `.apk`
med samme kode. To veier:

- **PWABuilder** (`pwabuilder.com`) — lim inn adressen, last ned Android-pakke. Ingen verktøy å installere.
- **Bubblewrap** — `npm i -g @bubblewrap/cli`, så `bubblewrap init --manifest https://.../manifest.webmanifest`. Krever Java (JDK 17) og Android SDK.

Begge produserer en fil du overfører til telefonen og installerer direkte.
Google Play er ikke nødvendig, og for en privat app er det heller ikke å anbefale:
personlige utviklerkontoer må kjøre lukket testing med 12 testere i 14 dager før publisering.

## Kjent begrensning

Timeren fryses hvis operativsystemet suspenderer fana — typisk på iPhone med låst skjerm.
Appen ber om wake lock under aktiv økt, som holder skjermen på i Chrome på Android.
Ligger telefonen låst i lomma, må du regne med at nedtellingen tar igjen det tapte når du åpner den igjen.
