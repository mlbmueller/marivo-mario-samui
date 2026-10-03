# Veröffentlichungssperre – Gründe und Regeln

`npm run build` führt vorher `npm run check:release` aus.

- **Vorschau** (`SITE_MODE` leer oder `preview`): Die Prüfung listet nur auf, der Build läuft
  immer durch. Die Entwicklungsfassung ist vollständig aufrufbar (alle Seiten, alle 5 Sprachen,
  Platzhalter, Demo-Formular, noindex).
- **Produktion** (`SITE_MODE=production`): Der Build bricht ab, solange zentrale Angaben
  fehlen. Optionale Inhalte werden stattdessen automatisch und nachvollziehbar deaktiviert.

## Aktuelle Abbruchgründe (19) – alle zentral

| # | Bereich | Grund | Lösung |
| --- | --- | --- | --- |
| 1 | Marke | Logo-Webfassung noch nicht visuell freigegeben | OK → `brand.logoWebCrop: confirmed(true)` |
| 2 | Marke | Domain fehlt | `SITE_URL` setzen |
| 3 | Recht | Betreiberangaben fehlen | `operator` in `brand.ts` |
| 4 | Recht | Datenschutztext nicht geprüft | Text anpassen, `privacyNotice: confirmed` |
| 5 | Kontakt | keine bestätigte WhatsApp-Nummer | `brand.whatsapp` oder `stores.*.whatsapp` |
| 6–7 | Geschäfte | Adresse Chaweng / Fisherman’s Village | `stores.*.address` |
| 8–9 | Geschäfte | Kartenlink Chaweng / Fisherman’s Village | `stores.*.mapUrl` |
| 10 | Sortiment | keine bestätigte Stilwelt | `categories.*.offered: confirmed` |
| 11 | Looks | 0 von 6 echten, freigegebenen Looks | `looks.ts` + Bilder |
| 12–15 | Bilder | Titelbild, Mario, Fassade Chaweng, Fassade Fisherman’s Village | `media.ts` |
| 16–17 | Sprachen | Englisch und Deutsch nicht freigegeben | `localeMeta.en/de.reviewed: true` |
| 18 | Integration | kein Versanddienst konfiguriert | siehe `docs/FORM_DELIVERY.md` |
| 19 | Integration | kein gemeinsamer Anfragezähler | Upstash-Variablen setzen |

## Nachvollziehbar deaktiviert statt blockiert (Auszug)

Die vollständige Liste gibt `npm run check:release` aus (aktuell 43 Einträge).

| Inhalt | Verhalten in Produktion |
| --- | --- |
| Thai, Französisch, Italienisch | keine Route (404), nicht in Sprachwahl, hreflang oder Sitemap |
| Favicon | Browser-Standardsymbol |
| unbestätigte Stilwelt | Seite 404, nicht in Navigation, Startseite oder Sitemap |
| Öffnungszeiten, Telefon, Anfahrt | Zeile entfällt |
| James’ Rolle | nur Name |
| Mario-Einführungstext, Ablauf | Abschnitt bzw. Text entfällt |
| Preise | Hinweis auf persönliche Offerte |
| Kundenstimmen, Atelierfilm, Zusatzleistungen | nicht angezeigt |
| optionale Bilder (Innenräume, Team, Details) | Bild entfällt, Text bleibt |
| «Our new name» | 404 bis zur tatsächlichen Umstellung |
| Policies (Zeiten, Anzahlung, Versand, Stoffe) | werden nicht erwähnt |

Geprüft: Ein Produktionsbuild mit übersprungener Sperre (`SITE_MODE=production npx next build`)
läuft technisch durch und erzeugt nur EN/DE. `/th`, `/fr/…` und `/en/our-work` liefern dabei 404,
hreflang nennt nur `en`, `de` und `x-default`, und es gibt kein noindex. Die Sperre
ist also eine inhaltliche, keine technische.
