# Domain www.nickyfashionsamui.com verknüpfen (GitHub → Vercel → GoDaddy)

GitHub speichert nur den Code und kann diese Webseite nicht selbst ausführen. GitHub Pages
liefert nur statische Dateien aus; das Anfrageformular braucht aber einen Server. Deshalb läuft
die Seite bei einem Hosting-Anbieter, empfohlen **Vercel** (vom Hersteller von Next.js, Gratis-Tarif
für den Anfang). Die Kette: **GitHub (Code) → Vercel (Hosting) → GoDaddy (Domain zeigt auf Vercel)**.

> ⚠️ Solange Inhalte fehlen, bricht der Produktions-Build ab (`docs/RELEASE_GATE.md`).
> Die Domain erst auf die Seite zeigen lassen, wenn sie veröffentlicht werden darf. Bis dahin
> nur die geschützte Vercel-Testadresse verwenden.

## Stand: Coming-soon-Seite → reduzierter Start

Solange in Vercel für **Production** `SITE_MODE` nicht `production` ist, zeigt die Domain nur die
Coming-soon-Seite (`src/app/coming-soon/`, Sprachen EN/DE/TH/FR/IT über `?lang=`).

**Volle Seite live schalten (reduzierter Start, Entscheid 4.10.2026, `src/content/launch.ts`):**
Vercel → Settings → Environment Variables → `SITE_MODE` → Wert für **Production** auf `production`
setzen (Preview bleibt `preview`) → Deployments → letztes Deployment → **Redeploy**.
Danach: kein Formular (Kontakt per WhatsApp/Telefon), Bereiche ohne freigegebenes Foto
ausgeblendet, Impressum mit den bestätigten Kontaktdaten, Datenschutz ohne Formular
(`src/content/privacy-no-form.ts`), nur EN/DE, Suchmaschinen erlaubt.
Zurück zur Coming-soon-Seite: Wert wieder auf `preview` setzen und neu deployen.

## 1. Code auf den Hauptzweig bringen

Der Code liegt auf dem Zweig `claude/new-session-3cwc2d`, `main` ist noch leer.
Auf GitHub: **Pull requests → New pull request**, base `main` ← compare `claude/new-session-3cwc2d`
→ «Create pull request» → «Merge». (Oder ich erstelle den Pull Request auf Anfrage.)

## 2. Vercel-Projekt anlegen (ca. 10 Minuten)

1. vercel.com → «Sign up» → **Continue with GitHub**.
2. «Add New… → Project» → Repository `mlbmueller/marivo-mario-samui` → **Import**.
   Framework wird als Next.js erkannt; Build-Einstellungen nicht ändern.
3. **Environment Variables** – zuerst für eine geschützte Vorschau:
   | Name | Wert |
   | --- | --- |
   | `SITE_MODE` | `preview` |
   Für den Start später (`docs/FORM_DELIVERY.md`): `SITE_MODE=production`, `INQUIRY_DELIVERY` +
   Zugangsdaten, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. `SITE_URL` ist nicht nötig,
   die Domain ist im Code hinterlegt.
4. **Deploy**. Vercel zeigt eine Adresse wie `marivo-mario-samui.vercel.app`.
5. **Settings → Deployment Protection**: Schutz aktivieren, damit nur eingeloggte Personen die
   Vorschau sehen (welche Adressen der Gratis-Tarif schützt, zeigt Vercel dort an).

## 3. Domain in Vercel eintragen

**Settings → Domains → Add**: `www.nickyfashionsamui.com` hinzufügen. Vercel schlägt vor, auch
`nickyfashionsamui.com` hinzuzufügen und auf `www` umzuleiten – annehmen. Vercel zeigt danach die
genauen DNS-Werte an; **diese Werte gelten**, falls sie von der Tabelle unten abweichen.

## 4. DNS bei GoDaddy umstellen (erst zum Start)

GoDaddy → **Meine Produkte → Domain nickyfashionsamui.com → DNS** (DNS-Einträge verwalten).

| Typ | Name | Wert (Standard bei Vercel) | Aktion |
| --- | --- | --- | --- |
| A | `@` | `76.76.21.21` | vorhandene A-Einträge für `@` ersetzen |
| CNAME | `www` | `cname.vercel-dns.com` | vorhandenen `www`-Eintrag ersetzen |

Wichtig:
- **MX-, TXT- und andere Einträge nicht löschen.** Sonst kann E-Mail über die Domain ausfallen.
- Eine GoDaddy-«Weiterleitung» (Forwarding) oder ein GoDaddy-Websitebaukasten muss für die Domain
  ausgeschaltet sein. Derzeit zeigt die Domain auf GoDaddy-Server (13.248.243.5 / 76.223.105.230);
  die Seite dort habe ich nicht prüfen können.
- Nameserver bleiben bei GoDaddy, sie müssen nicht geändert werden.

Die Umstellung wirkt meist nach Minuten, kann aber bis 48 Stunden dauern. Vercel zeigt bei der
Domain «Valid Configuration» und stellt das HTTPS-Zertifikat automatisch aus.

## 5. Prüfen nach dem Umschalten

- `https://nickyfashionsamui.com` leitet auf `https://www.nickyfashionsamui.com/en` weiter
- Schloss-Symbol (HTTPS) im Browser
- Testanfrage über das Formular kommt an (`docs/FORM_DELIVERY.md`)
- Google-Profile erst danach anpassen (`docs/GOOGLE_BUSINESS_CHECKLIST.md`)
- Falls unter der Domain bisher eine andere Seite mit Unterseiten lief: alte Adressen in
  `docs/REDIRECTS.md` eintragen, damit Links weiter funktionieren
