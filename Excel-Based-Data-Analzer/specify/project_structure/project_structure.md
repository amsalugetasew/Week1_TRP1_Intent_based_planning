# Excel Analyzer — Current Project Structure

This document reflects the **current, actual repository layout** after reorganizing planning/specification documents under `specify/`.

## Root Layout

```text
Excel-Based-Data-Analzer/
├── README.md
├── specify/
│   ├── specification.md
│   ├── memory/
│   │   └── constitution.md
│   ├── plan/
│   │   └── plan.md
│   ├── architecture/
│   │   └── architecture.md
│   └── project_structure/
│       └── project_structure.md
└── src/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── main.js
        ├── config/
        │   ├── defaults.js
        │   ├── settings.js
        │   └── themes.js
        ├── events/
        │   ├── event-handlers.js
        │   └── event-system.js
        ├── modules/
        │   ├── analytics.js
        │   ├── dashboard.js
        │   ├── data-processor.js
        │   ├── exporter.js
        │   ├── file-upload.js
        │   ├── help.js
        │   ├── notifications.js
        │   ├── settings.js
        │   └── visualizer.js
        └── utils/
            ├── formatters.js
            ├── helpers.js
            └── validators.js
```

## Documentation Organization

All governance/specification/planning documents are grouped under `specify/`:

- `specify/specification.md` → product requirements/specification
- `specify/memory/constitution.md` → project constitution/principles
- `specify/plan/plan.md` → implementation plan
- `specify/architecture/architecture.md` → architecture decisions
- `specify/project_structure/project_structure.md` → this structure reference

## Source Code Organization (`src/`)

- `index.html` — main web app shell and script wiring
- `css/styles.css` — application styling
- `js/main.js` — app orchestration (upload → preview → analyze → dashboard → export)
- `js/modules/` — domain modules (upload, processing, visualization, dashboard, export, etc.)
- `js/config/` — defaults, settings, and themes
- `js/events/` — event system and handlers
- `js/utils/` — shared helper/formatter/validator utilities

## Notes

- This file is intentionally aligned to the **real folders currently in the repository**.
- If files/folders are changed again, update this document immediately to keep it accurate.
