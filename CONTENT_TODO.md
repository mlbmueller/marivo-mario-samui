# Offene Punkte – priorisiert

Stand: 3. Oktober 2026. Startsprachen: **Englisch und Deutsch** (verbindlich).
Thai, Französisch und Italienisch bleiben in der Vorschau prüfbar, sind aber in der
Produktionsfassung abgeschaltet und blockieren den Start nicht.

**Spalte «Start»:** ⛔ = vor Veröffentlichung nötig (Build-Sperre) · ⚠️ = vor Veröffentlichung
dringend empfohlen, sonst ausgeblendet · ⏳ = später möglich (Bereich bleibt bis dahin aus).
`npm run check:release` zeigt den aktuellen Stand automatisch.

## A · Angaben und Dateien vom Betreiber

| # | Punkt | benötigte Angabe / Datei | warum erforderlich | Start |
| --- | --- | --- | --- | --- |
| 1 | Logo-Webfassung | Ihr OK zum zugeschnittenen Rahmen (`docs/review/logo-comparison.png`) | Logo ist zentral; nur transparenter Rand entfernt | ⛔ |
| 2 | Domain | ✅ erledigt: www.nickyfashionsamui.com (GoDaddy) – DNS-Verknüpfung siehe docs/DOMAIN_SETUP.md | Canonical, Sitemap, Teilen-Vorschau | – |
| 3 | Betreiberangaben | rechtlicher Name, Adresse, Registrierung, Kontakt | Impressum | ⛔ |
| 4 | Datenschutz | Freigabe des Textes passend zum gewählten Versanddienst und Speicherdauer | Pflicht bei Kontaktformular | ⛔ |
| 5 | WhatsApp | mindestens eine Nummer (zentral oder je Geschäft), international | wichtigste Kontaktaktion; ohne Nummer kein Link | ⛔ |
| 6 | Adresse Chaweng | vollständige Adresse wie auf der Seite | Standortseite, Google-Abgleich | ⛔ |
| 7 | Adresse Fisherman’s Village | dito | dito | ⛔ |
| 8 | Kartenlink Chaweng | Google- oder Apple-Maps-Link auf den genauen Eingang | Anfahrt; keine geschätzten Pins | ⛔ |
| 9 | Kartenlink Fisherman’s Village | dito | dito | ⛔ |
| 10 | Fassadenfoto Chaweng | Foto mit aktueller Beschilderung | Wiedererkennung vor Ort | ⛔ |
| 11 | Fassadenfoto Fisherman’s Village | dito | dito | ⛔ |
| 12 | Titelbild | fertiges Outfit, siehe Bildbedarf | zentrales Motiv der Startseite | ⛔ |
| 13 | Mario | Porträt oder Beratungsszene | Vertrauen, Teamabschnitt | ⛔ |
| 14 | Sortiment | Bestätigung der Stilwelten Suits / Linen & Holiday / Women / Weddings und der Kleidungslisten | nur Bestätigtes wird gezeigt; mindestens eine nötig | ⛔ |
| 15 | Stilwelten-Fotos | je bestätigter Stilwelt ein Foto | ohne Bild leere Karte | ⛔ (je bestätigter Welt) |
| 16 | Sechs Looks | 6 echte Arbeiten: Foto, Titel, Kategorie, Anlass, Stoff falls bekannt | Kern des neuen Auftritts | ⛔ |
| 17 | Texte EN/DE | Ihre Freigabe der englischen und deutschen Texte (inkl. Hero-Aussage zum Sortiment) | keine unbestätigten Aussagen | ⛔ |
| 18 | Öffnungszeiten | je Geschäft | Besuchsplanung | ⚠️ |
| 19 | Telefon | je Geschäft | zweiter Kontaktweg | ⚠️ |
| 20 | Anfahrtshinweise | kurzer Text EN/DE je Geschäft | Orientierung | ⚠️ |
| 21 | Mario-Text | Freigabe des kurzen Einführungstexts | sonst nur Name + «Owner» | ⚠️ |
| 22 | Ablauf (4 Schritte) | Bestätigung durch Mario | sonst Abschnitt ausgeblendet | ⚠️ |
| 23 | Preise | THB mit Umfang und Aufpreisen – oder Entscheid «keine Preise online» | sonst Hinweis auf persönliche Offerte | ⏳ |
| 24 | James | Titel, Aufgaben, Standort, Porträt | sonst nur Name | ⏳ |
| 25 | Weitere Mitarbeitende | Name, Rolle, Standort, Porträtfreigabe | – | ⏳ |
| 26 | Teamfoto, Innenräume, Detailbilder | siehe Bildbedarf | Bildwelt | ⏳ |
| 27 | Favicon | Freigabe Vorschlag A oder B (`docs/proposals/`) | sonst Browser-Standardsymbol | ⏳ |
| 28 | Gestaltungsoptionen | tatsächlich angebotene Optionen | Text bleibt allgemein | ⏳ |
| 29 | Fertigungs-/Anprobezeiten | Regeln | werden nicht erwähnt | ⏳ |
| 30 | Anzahlung / Zahlung | Regeln | werden nicht erwähnt | ⏳ |
| 31 | Änderungen / Versand | Regeln | werden nicht erwähnt | ⏳ |
| 32 | Stoffe | Marken, Herkunft, Fertigungsort; «handmade»/«bespoke» nur bei Bestätigung | werden nicht erwähnt | ⏳ |
| 33 | Zusatzleistungen | Hotelabholung, Villa-Beratung, Lieferung, Versand: Bedingungen, Gebiet, Kosten, Anfrageweg | vorbereitet, inaktiv | ⏳ |
| 34 | Nachbestellung | was wird geprüft, wie | Seite beschreibt persönliche Prüfung | ⏳ |
| 35 | Kundenstimmen | echte Zitate mit Einwilligung, Quelle, Geschäft | Abschnitt bleibt aus | ⏳ |
| 36 | Frühere Namen | welcher Name gehörte zu welchem Geschäft; Datum der Umstellung | Übergangsseite bleibt aus | ⏳ |
| 37 | Atelierfilm | 20–30 s mit Untertiteln (optional) | – | ⏳ |
| 38 | Thai / Französisch / Italienisch | Prüfung durch Muttersprachler, dann Freischaltung | nicht Teil des Starts | ⏳ |
| 39 | Russisch | Übersetzung (geplant) | – | ⏳ |
| 40 | Konten | Zugang zu Versanddienst und Upstash (siehe B) bzw. Freigabe, dass ich sie anlege | Formular kann sonst nicht senden | ⛔ |

## B · Technische Aufgaben – kann ich selbst abschliessen

| Aufgabe | Voraussetzung | Start |
| --- | --- | --- |
| Formularversand aktivieren (Webhook oder Resend), Test auf Staging, Fehlerfall prüfen | Konto/Zugang aus Punkt 40 | ⛔ |
| Gemeinsamen Anfragezähler (Upstash Redis) anbinden | Konto/Zugang aus Punkt 40 | ⛔ |
| Domain eintragen (`SITE_URL`), Canonical/Sitemap/Open Graph prüfen | Punkt 2 | ⛔ |
| Fotos optimieren, mit Fokuspunkt einbinden, Rechte/Quelle eintragen | Fotos | ⛔ |
| Logo-Webfassung als freigegeben markieren | Punkt 1 | ⛔ |
| Bestätigte Daten eintragen (Adressen, Nummern, Zeiten, Texte) | Angaben aus A | ⛔ |
| Favicon einbauen | Punkt 27 | ⏳ |
| Open-Graph-Bild aus Logo + Titelbild | Punkte 1, 12 | ⚠️ |
| Weiterleitungen alter Adressen | alte Domains/URLs | ⚠️ |
| Hosting/Deployment (z. B. Vercel), Staging-Abnahme | gesonderter Auftrag | ⛔ |
| Lighthouse-/Barrierefreiheitsmessung auf Staging | Staging | ⚠️ |
| Sprachen TH/FR/IT freischalten (`launch: true`) | Punkt 38 | ⏳ |
