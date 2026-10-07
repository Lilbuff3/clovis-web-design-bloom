## 2024-05-18 - Missing ARIA label and focus styles on modal close button
**Learning:** Found an accessibility issue pattern where an icon-only button (such as a close button with a text character `✕`) lacks an `aria-label` attribute and visible focus states for keyboard users.
**Action:** Always add `aria-label` to icon-only or character-only buttons, and verify `focus-visible:ring-2` styles are included for keyboard accessibility.

## 2023-10-25 - Form Accessibility and Keyboard Navigation
**Learning:** Discovered that custom selectable 'chips' (used in multi-step or quick-select forms like Contact and LeadLeakAudit) lacked `aria-pressed` states, semantic `role="group"` wrappers with `aria-labelledby`, and clear `focus-visible` outlines, making them difficult for screen reader and keyboard users to navigate and understand their selected state. Inputs also relied solely on nesting for labels rather than explicit `htmlFor` / `id` bindings.
**Action:** Always add `aria-pressed` to toggleable buttons, semantic `role="group"` containers, explicit `focus-visible:ring-2` utility classes for clear keyboard focus indicators, and strict `htmlFor`/`id` bindings on all form inputs.

## 2024-05-18 - Accordion and Toggle Panel Accessibility
**Learning:** Found that custom accordion buttons (such as the FAQ section) lacked proper WAI-ARIA pairings and keyboard focus indicators. The buttons toggling visibility did not associate semantically with the content panels they controlled.
**Action:** Always use React's `useId()` hook to link toggle buttons with their content panels using `aria-controls`, `aria-labelledby`, and `role="region"`. Also, ensure buttons have explicit `focus-visible:ring-2` utility classes for keyboard accessibility.
