# Intent Map

Maps active goals to concrete repository areas.

## Intent 1 — Keep documentation architecture aligned

- **Goal**: Ensure README/architecture/structure docs reflect the real repository.
- **Primary files**:
  - `README.md`
  - `Excel-Based-Data-Analzer/README.md`
  - `Excel-Based-Data-Analzer/specify/architecture/architecture.md`
  - `Excel-Based-Data-Analzer/specify/project_structure/project_structure.md`
  - `Excel-Based-Data-Analzer/CLAUDE.md`

## Intent 2 — Maintain clean Hook Engine boundary

- **Goal**: Keep hook system logic isolated in a dedicated folder.
- **Primary files**:
  - `Excel-Based-Data-Analzer/src/hooks/hook-engine.js`

## Intent 3 — Preserve orchestration traceability

- **Goal**: Track intent state and key updates with minimal overhead.
- **Primary files**:
  - `Excel-Based-Data-Analzer/.orchestration/active_intents.yaml`
  - `Excel-Based-Data-Analzer/.orchestration/agent_trace.jsonl`
  - `Excel-Based-Data-Analzer/.orchestration/intent_map.md`

## Update Rule

When structure changes, update the following together in one pass:

1. `README.md` (workspace root)
2. `Week1_TRP1_Intent_based_planning/README.md` (app-level)
3. `specify/project_structure/project_structure.md`


