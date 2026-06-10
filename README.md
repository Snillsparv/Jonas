# jonasvonessen.se — ny version 🧠π

En helt ny, modern version av Jonas von Essens webbplats. Byggd som en ren
statisk sajt — ingen byggprocess, inga beroenden. Öppna `index.html` i en
webbläsare så är du igång.

## Innehåll

| Sektion | Beskrivning |
|---|---|
| **Hero** | Animerad "π-himmel" (canvas) där decimaler svävar och lyser upp nära muspekaren |
| **Ticker** | Rullande meritlista |
| **Statistik** | Animerade räknare (2 VM-guld, 100 000 decimaler, 500 namn, 50+ lektioner) |
| **Om** | Berättelsen + interaktiv tidslinje 2012 → idag |
| **Föreläsningar** | Tre erbjudanden + "Känd från"-rad |
| **Böcker** | *Så får du ett superminne*, *Bli ett minnesgeni!*, *Pi-boken 2.0* med CSS-omslag |
| **Minnestips** | Fyra utfällbara tips (minnespalats, bilder, repetition, namn) |
| **π-utmaningen** | Interaktivt minnesspel — memorera decimaler, nivåer + rekord sparas lokalt |
| **Kurs** | CTA-panel som länkar till kurs.jonasvonessen.se |
| **Kontakt** | Bokningsformulär + sociala medier |

## Innan lansering — att byta ut

1. **Porträttfoto** — sektionen *Om* har en markerad platshållare
   (`.om-portrait-art` i `index.html`). Lägg en riktig bild där, t.ex.
   `<img src="assets/jonas.jpg" alt="Jonas von Essen">`.
2. **Bokningsadress** — ändra konstanten `BOOKING_EMAIL` högst upp i
   `js/main.js` (just nu en platshållare). Formuläret öppnar besökarens
   mejlprogram; vill du ha riktiga formulärutskick, koppla på t.ex.
   [Formspree](https://formspree.io) eller Netlify Forms.
3. **Bokomslag** — CSS-omslagen kan ersättas med riktiga omslagsbilder om så
   önskas.
4. **Sociala länkar** — kontrollera att Instagram/YouTube/Facebook-länkarna i
   kontaktsektionen stämmer.

## Konceptversioner

I `versioner/` ligger fem helt olika, fristående konceptversioner av sajten,
plus ett galleri (`versioner/index.html`) som länkar till alla:

1. **Minnespalatset** — vandra i sidled genom palatsets rum
2. **Resan genom π** — scrolla genom 100 000 decimaler med positionsmätare
   (decimalerna beräknas live med Gibbons spigot-algoritm)
3. **JonasOS 3.14** — hjärnan som retro-OS med dragbara fönster
4. **Sidan som glömmer** — texten bleknar tills besökaren repeterar
5. **Varietéaffischen** — sekelskiftescirkus med ridå och glödlampor

Varje fil är självständig (HTML + CSS + JS i ett) och kan öppnas direkt.

## Cache-busting

`index.html` länkar CSS/JS med en versionsparameter (`css/style.css?v=2`).
Bumpa siffran när du ändrar i `css/` eller `js/` — annars kan CDN:er
(t.ex. githack-förhandsvisningen) fortsätta servera gamla cachade filer.

## Publicering

Sajten är 100 % statisk och kan läggas var som helst:

- **GitHub Pages**: Settings → Pages → välj branch, klart.
- **Netlify/Vercel/Cloudflare Pages**: peka på repot, ingen build behövs.
- Peka sedan domänen `jonasvonessen.se` mot den nya hosten.

## Teknik

- Ren HTML/CSS/JS, inga ramverk eller byggsteg
- Typsnitt: Sora + Inter + JetBrains Mono (Google Fonts, med systemfallbackar)
- Respekterar `prefers-reduced-motion`
- Responsiv: mobil, surfplatta, desktop
- π-decimalerna i spelet och animationerna är de 100 första, korrekta decimalerna
