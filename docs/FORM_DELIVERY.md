# Formularversand – Stand und Einrichtung

## Vorhandene Integration (geprüft)

`POST /api/inquiry` → `src/lib/server/handle-inquiry.ts` → Adapter aus `src/lib/server/delivery.ts`:

| Adapter | Wann | Ergebnis |
| --- | --- | --- |
| `demo` | Vorschau ohne Konfiguration | nichts wird versendet, Anzeige «Testanfrage – nicht versendet» |
| `webhook` | `INQUIRY_DELIVERY=webhook` + `INQUIRY_WEBHOOK_URL` | JSON-POST, optional HMAC-Signatur `X-Signature` |
| `resend` | `INQUIRY_DELIVERY=resend` + `RESEND_API_KEY`, `INQUIRY_EMAIL_TO`, `INQUIRY_EMAIL_FROM` | E-Mail über die Resend-API, Antwortadresse = Kunden-E-Mail |
| keiner | Produktion ohne gültige Konfiguration | Formular meldet «Anfragen können im Moment nicht gesendet werden» – **nie** ein Scheinerfolg |

Erfolg wird nur angezeigt, wenn der Dienst mit HTTP 2xx antwortet. Bei Fehlern bleibt die Eingabe
erhalten. Durch automatisierte Tests mit simulierten Diensten abgedeckt. **Mit einem echten
Dienst ist noch nichts gesendet worden.**

## Fehlende Konfiguration

- [ ] Entscheid: E-Mail (Resend) **oder** Automatisierung (Webhook zu z. B. Make, Zapier, n8n, Google Sheet)
- [ ] Zieladresse bzw. Ziel-System
- [ ] Zugangsdaten (siehe unten), hinterlegt als Umgebungsvariablen beim Hosting – nie im Code
- [ ] Upstash Redis für die Anfragebegrenzung (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
- [ ] Datenschutztext um Dienstname und Speicherdauer ergänzen

## Variante A – E-Mail mit Resend (empfohlen, wenn Anfragen per E-Mail kommen sollen)

1. Konto auf resend.com anlegen (Betreiber).
2. Absender-Domain der künftigen Website verifizieren (DNS-Einträge SPF/DKIM beim Domain-Anbieter).
3. API-Schlüssel mit Recht «Sending access» erstellen.
4. Beim Hosting setzen:
   `INQUIRY_DELIVERY=resend`, `RESEND_API_KEY=…`, `INQUIRY_EMAIL_TO=anfragen@…`,
   `INQUIRY_EMAIL_FROM="Nicky Fashion <website@…>"`.

## Variante B – Webhook

1. Im Ziel-System (z. B. Make/n8n) einen Webhook anlegen, der JSON annimmt und erst nach
   erfolgreicher Weiterleitung mit 2xx antwortet.
2. Gemeinsames Geheimnis erzeugen und im Ziel-System prüfen: `X-Signature: sha256=<HMAC-SHA256 des Bodys>`.
3. Beim Hosting setzen: `INQUIRY_DELIVERY=webhook`, `INQUIRY_WEBHOOK_URL=…`, `INQUIRY_WEBHOOK_SECRET=…`.

Gesendete Felder: `id, receivedAt, type, interest, look, arrival, departure, datesOpen, store,
suggestDate, preferredDate, name, contactMethod, contactValue, message, locale`.

## Anfragebegrenzung

Konto bei upstash.com (Redis, Region nahe am Hosting), REST-URL und Token als
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` setzen. Ohne diese Werte zählt jede
Server-Instanz separat – für eine verteilte Produktion nicht ausreichend, deshalb Build-Sperre.

## Abnahmetest auf Staging (vor dem Start)

1. Echte Testanfrage auf EN und DE senden → kommt an, Anzeige «Your request has been sent …».
2. Ziel-URL vorübergehend ungültig machen → Fehlermeldung sichtbar, Eingaben bleiben erhalten.
3. Sechs Anfragen in kurzer Folge → ab der sechsten Hinweis «Zu viele Anfragen».
4. Server-Logs prüfen: nur ID, Adapter und Ergebnis – keine Namen, Kontakte oder Nachrichten.
