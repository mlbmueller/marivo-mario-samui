# Bildbedarf – konkrete Liste für das Fotoshooting

Stand 3. Oktober 2026. **Vorhandene geeignete Bilder: keine.** Das gelieferte Paket enthält nur
Logo-Dateien (SVG, PNG, Druckdaten) und eine Logo-Vorschau. Die in den Druckhinweisen erwähnten
KI-Fassadenbilder sind keine Fotos der echten Geschäfte und werden nicht verwendet.
Die endgültige Bildwirkung bleibt offen, bis echte Fotos eingebunden sind.

Allgemein: echtes Licht, heller Atelier-/Inselcharakter, Menschen und Kleidung im Mittelpunkt,
schriftliche Einwilligung jeder erkennbaren Person, keine Fremdbilder. Lieferung als JPEG
(höchste Qualität) oder Original-RAW; ich optimiere und schneide zu. Angaben = **Mindestauflösung**,
in Klammern die empfohlene Grösse.

## Priorität 1 – nötig für den Start

| Position | Motiv | Seitenverhältnis | Mindestauflösung (empfohlen) | Hinweise |
| --- | --- | --- | --- | --- |
| Titelbild (Startseite) | fertiges Outfit, ganze Figur, an echter Kundin/echtem Kunden oder Model, heller Hintergrund | 4:5 hoch | 1600 × 2000 (2400 × 3000) | Mobil wird 4:3 gezeigt: zusätzlich eine **querformatige 4:3-Version** (1600 × 1200) liefern oder Motiv mit Luft oben/unten fotografieren |
| Titelbild Ergänzung | Beratungs- oder Anprobeszene im Geschäft (Mario mit Kunde) | 4:3 quer | 1200 × 900 (1600 × 1200) | erscheint am Desktop überlappend klein |
| Mario | Mario bei Beratung oder Anprobe, Gesicht erkennbar, natürliches Licht | 4:5 hoch | 1200 × 1500 (1600 × 2000) | kein Studio-Look nötig; Hände/Massband willkommen |
| Stilwelt «Suits» | Anzug an Person, ganze Figur | 4:5 hoch | 1200 × 1500 (1600 × 2000) | je Welt ein **anderes** starkes Motiv |
| Stilwelt «Linen & Holiday» | Leinenhemd/-anzug, helles Insel-Setting | 4:5 hoch | 1200 × 1500 (1600 × 2000) | |
| Stilwelt «Women» | Damen-Outfit an Person, ganze Figur | 4:5 hoch | 1200 × 1500 (1600 × 2000) | |
| Stilwelt «Weddings» | Hochzeitsoutfit oder Trauzeugengruppe | 4:5 hoch | 1200 × 1500 (1600 × 2000) | |
| Sechs Looks | sechs echte Arbeiten, vollständiges Outfit; je Look: Titel, Kategorie, Anlass, Stoff (falls bekannt) | 3:4 hoch | 1200 × 1600 (1800 × 2400) | möglichst je 1–2 Detailbilder (Revers, Knopfloch, Futter) 1:1 oder 3:4 |
| Fassade Chaweng | Ladenfront mit aktueller Beschilderung, Tageslicht | 4:3 quer | 1600 × 1200 (2400 × 1800) | Eingang erkennbar, keine Passanten im Fokus |
| Fassade Fisherman’s Village | dito | 4:3 quer | 1600 × 1200 (2400 × 1800) | |

## Priorität 2 – nach dem Start möglich

| Position | Motiv | Seitenverhältnis | Mindestauflösung |
| --- | --- | --- | --- |
| Innenraum Chaweng / Fisherman’s Village | Stoffauswahl, Anprobebereich | 4:3 quer | 1600 × 1200 |
| James | Porträt im Stil von Mario | 4:5 hoch | 1200 × 1500 |
| Teamfoto | Team gemeinsam | 3:2 quer | 1800 × 1200 |
| Stoffdetail | Stoffmuster in der Hand / Regal | 4:3 quer | 1600 × 1200 |
| Massnehmen | Hände, Massband, ohne Gesicht | 4:3 quer | 1600 × 1200 |
| Verarbeitung | Revers, Knopfloch, Futter in Nahaufnahme | 4:3 quer | 1600 × 1200 |
| Atelierfilm (optional) | 20–30 s, ruhig, ohne Musikpflicht, mit Untertiteln | 16:9 | 1920 × 1080 |
| Favicon | Freigabe eines Vorschlags aus `docs/proposals/` | 1:1 | Vektor |

## Einbindung (macht der Entwickler)

Datei nach `public/images/`, in `src/content/media.ts`: `src`, `width`, `height`, `source`
(Fotograf, Jahr), `rights: 'approved'`, optional `focus` (Bildfokus, z. B. `'50% 30%'`) und
`mobileSrc` (eigener Handy-Zuschnitt). Looks zusätzlich in `src/content/looks.ts` auf
`status: 'confirmed'` setzen und Titel in den Sprachdateien eintragen.
