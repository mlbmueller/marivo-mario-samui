# Unabhängige Prüfung

## 1. Automatisch auf GitHub (empfohlen)

Bei jedem Push prüft GitHub den Code auf eigenen Servern – unabhängig von der Umgebung, in der
er entwickelt wurde: Workflow `.github/workflows/ci.yml`, Reiter **Actions** im Repository.

Erster Lauf: [CI #1](https://github.com/mlbmueller/marivo-mario-samui/actions/runs/37157576038)
für Commit `11a269d`, Ergebnis **success**:

| Schritt | Ergebnis |
| --- | --- |
| `npm ci` | ok |
| Lint, Typprüfung | ok |
| Unit-Tests | ok (57) |
| Freigabeprüfung Vorschau | ok (listet 19 Pflichtpunkte) |
| Freigabeprüfung Produktion | bricht wie vorgesehen ab |
| Build | ok |
| Browser-Tests (Chrome 153, Desktop + Mobil) | 56 bestanden, 14 übersprungen (gerätespezifisch) |
| Screenshots | als Artefakt «review-screenshots» herunterladbar |

## 2. Selbst ausführen

Siehe `PRUEFEN.md` im Quellcode-ZIP bzw. README: `npm ci`, dann `npm run dev`
(Vorschau auf http://localhost:3000) und die Prüfbefehle.

## Grenzen

Der Formularversand ist nur gegen simulierte Antworten geprüft; ein echter Versanddienst ist noch
nicht konfiguriert. Safari/iOS wird von der CI nicht abgedeckt (manuelle Liste: `docs/DEVICE_CHECKLIST.md`).
