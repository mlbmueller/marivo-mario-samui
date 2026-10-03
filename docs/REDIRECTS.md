# Legacy redirects

Previous web presences: «Nicky Fashion by Mario» and «Samui Armani By Mario».
Their domains and URLs are **not known yet**, so no redirects are guessed.

Fill in the table, then copy each confirmed row into `src/content/redirects.json`:

```json
[{ "from": "/old-path", "to": "/en/stores/chaweng", "permanent": true, "status": "confirmed" }]
```

Only rows with `"status": "confirmed"` become active (see `next.config.ts`).
Redirects from another domain (e.g. old-domain.com → new domain) are configured at the
hosting / DNS provider, not in this file.

| Old domain | Old URL / path | New target | Type | Confirmed by | Status |
| --- | --- | --- | --- | --- | --- |
| _(Nicky Fashion by Mario — domain?)_ | / | /en | 301 | | open |
| | | | | | |
| _(Samui Armani By Mario — domain?)_ | / | /en | 301 | | open |
| | | | | | |

Useful targets: `/en`, `/en/stores/chaweng`, `/en/stores/fishermans-village`,
`/en/tailoring`, `/en/contact`, `/en/our-new-name` (once active).
