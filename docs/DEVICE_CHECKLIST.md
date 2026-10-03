# Manuelle Geräteprüfung (iPhone/Safari und Android)

In dieser Entwicklungsumgebung steht nur Chromium zur Verfügung (Desktop und Handy-Emulation).
Safari/WebKit, echte Bildschirmtastaturen und Pinch-Zoom lassen sich hier nicht prüfen.
Automatisch geprüft (Chromium): 320–1440 px ohne Überlauf, Querformat 844 × 390,
200 % Textgrösse, Leiste weicht bei fokussiertem Feld, Tastaturbedienung des Menüs.

Prüfen auf: **iPhone (iOS 17/18, Safari)** und **Android (Chrome)**, je Hoch- und Querformat.
Dauer ca. 20 Minuten.

| # | Schritt | Erwartung | ✓ |
| --- | --- | --- | --- |
| 1 | Startseite laden | Logo scharf, drei Zeilen lesbar; Bild, Überschrift und «Plan Your Fitting» früh sichtbar | |
| 2 | Untere Leiste | sitzt am unteren Rand über dem Home-Balken (Safe Area), verdeckt nichts | |
| 3 | Menü öffnen/schliessen | alle Punkte und Sprachen erreichbar, Schliessen-Knopf funktioniert | |
| 4 | Sprache wechseln (EN ↔ DE) | gleiche Seite in der anderen Sprache | |
| 5 | «Ask about this look» | Kontaktseite mit Look-Referenz und Interesse vorausgewählt | |
| 6 | Kontaktseite: in «Name» tippen | Tastatur öffnet, Feld bleibt sichtbar, keine Leiste über dem Feld (auf Kontaktseite gibt es keine Leiste) | |
| 7 | Startseite: Datum im Modul «When are you visiting Samui?» | Datumsauswahl öffnet, Leiste verschwindet während der Eingabe | |
| 8 | Datumsfelder | Datum wählbar; Abreise vor Anreise → verständliche Fehlermeldung | |
| 9 | «My dates are still open» | Datumsfelder verschwinden | |
| 10 | Formular absenden (Vorschau) | Hinweis «Test request — not sent» | |
| 11 | Pinch-Zoom auf 200 % | Inhalt zoombar, nichts abgeschnitten | |
| 12 | Gerät drehen (quer) | kein seitliches Scrollen, Leiste niedrig, Formular bedienbar | |
| 13 | Schriftgrösse in den Systemeinstellungen gross | Texte umbrechen, nichts überlappt | |
| 14 | VoiceOver (iOS) kurz: Menü, Formularfelder | Felder werden mit Bezeichnung vorgelesen | |
| 15 | Galerie «Our Work» → Look antippen | Detailansicht öffnet, «Schliessen» bringt zurück | |

Abweichungen bitte mit Gerät, Browser-Version und Screenshot melden.
