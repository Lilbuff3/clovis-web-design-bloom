## 2026-10-09 - Focus rings are global; FAQ accordion is done
**Learning:** Keyboard focus is already visible on every element. `src/index.css` sets `:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 3px }` in the base layer, and it shows on dark buttons, paper, citrus and the orange footer. Six Palette PRs (#4, #5, #7, #8, #11, #15) added per-button `focus-visible:outline-none focus-visible:ring-*` classes that only replaced that ring with an inconsistent one, so they are not needed. The FAQ accordion's `aria-controls` / `role="region"` / `inert` wiring is in one PR that replaces #6, #9 and #10.
**Action:** Do not add `focus-visible:*` classes to buttons or links, and do not file PRs about missing focus indicators unless keyboard focus is actually invisible when you Tab to it in a browser. Only components with their own focus style (inputs, chips) override the global ring. Before opening a PR, check open PRs for the same change. This repo uses npm: never commit `pnpm-lock.yaml`, and don't commit `tests/test-results.json` changes.

## 2024-05-18 - Missing ARIA label and focus styles on modal close button
**Learning:** Found an accessibility issue pattern where an icon-only button (such as a close button with a text character `✕`) lacks an `aria-label` attribute and visible focus states for keyboard users.
**Action:** Always add `aria-label` to icon-only or character-only buttons. Focus rings come from the global `:focus-visible` style (see 2026-10-09).

## 2023-10-25 - Form Accessibility and Keyboard Navigation
**Learning:** Discovered that custom selectable 'chips' (used in multi-step or quick-select forms like Contact and LeadLeakAudit) lacked `aria-pressed` states, semantic `role="group"` wrappers with `aria-labelledby`, and clear `focus-visible` outlines, making them difficult for screen reader and keyboard users to navigate and understand their selected state. Inputs also relied solely on nesting for labels rather than explicit `htmlFor` / `id` bindings.
**Action:** Always add `aria-pressed` to toggleable buttons, semantic `role="group"` containers, and strict `htmlFor`/`id` bindings on all form inputs. Focus rings come from the global `:focus-visible` style (see 2026-10-09); chips keep their own.

