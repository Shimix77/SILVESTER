# Silvester 2026 – Emanuel, Boh s nami

Stránka silvestrovskej púte mladých vo Vysokej nad Uhom (29. 12. 2026 – 1. 1. 2027).
Je to obyčajná statická stránka: žiadny build, žiadne knižnice. Stačí upraviť súbor a pushnúť do vetvy `main` –
Render ju nasadí sám (Auto-Deploy: On Commit, Publish Directory: `.`).

## Kde čo je

| Súbor / priečinok | Čo obsahuje |
|---|---|
| `index.html` | celý obsah stránky (texty, odkazy, otázky) |
| `css/style.css` | vzhľad; farby sú hore v `:root` |
| `js/main.js` | menu na mobile, odpočítavanie, galéria, prepínanie dní programu |
| `img/hero/` | plagát 16:9 (počítač) a 4:5 (mobil) |
| `img/galeria/` | fotky: `NN.jpg` (veľká), `NN-800.*` a `NN-400.webp` (náhľady) |
| `img/partneri/` | logá partnerov |
| `fonts/` | písma uložené priamo na webe (licencia SIL OFL, texty licencií sú priložené) |

## Najčastejšie úpravy

**Hostia** – v `index.html` nájdi `KEĎ BUDÚ HOSTIA ZNÁMI`. Zmaž blok „Čoskoro zverejníme“ nad komentárom,
odkomentuj zoznam `<ul class="guests">` a doplň mená. Fotky daj do `img/hostia/` (štvorec, cca 800 × 800 px).

**Program** – nájdi `KEĎ BUDE PROGRAM ZNÁMY`. Zmaž zoznam štyroch dní a vetu „Podrobný program čoskoro zverejníme“,
odkomentuj blok `<div class="schedule" data-tabs>` a prepíš časy. Časy v predlohe sú z minulého roka.

**Registračný formulár** – odkaz `https://forms.gle/…` je v `index.html` na 4 miestach (hlavička, pás pod plagátom,
téma, prihlasovanie). Pri zmene nahraď všetky.

**Termíny a ceny** – sekcia `id="prihlasovanie"` a otázky v sekcii `id="otazky"`.

**Odpočítavanie** – atribúty `data-start` a `data-end` pri `id="countdown"` v `index.html`.

**Nová fotka do galérie** – pridaj ďalšiu položku `<li class="grid__item">` podľa vzoru ostatných.
Veľká fotka má mať šírku 1600 px, náhľady 800 px a 400 px.

## Na ďalší ročník

Vymeň plagáty v `img/hero/`, obrázok `img/nahlad-zdielanie.jpg` (1200 × 630 px, zobrazuje sa pri zdieľaní odkazu),
texty témy, dátumy, dni v programe, termíny prihlasovania a odkaz na formulár. Farby stačí zmeniť v `:root` v `css/style.css`.

## Bezpečnosť

Stránka nenačítava nič z cudzích serverov (žiadne Google Fonts, analytika ani cookies). V hlavičke `index.html`
je pravidlo Content-Security-Policy, ktoré povoľuje len vlastné súbory. Ak niekedy pridáš vložené video alebo mapu,
treba toto pravidlo rozšíriť, inak sa nezobrazia.
