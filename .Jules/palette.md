## 2024-05-18 - Missing ARIA label and focus styles on modal close button
**Learning:** Found an accessibility issue pattern where an icon-only button (such as a close button with a text character `✕`) lacks an `aria-label` attribute and visible focus states for keyboard users.
**Action:** Always add `aria-label` to icon-only or character-only buttons, and verify `focus-visible:ring-2` styles are included for keyboard accessibility.

## 2023-10-25 - Form Accessibility and Keyboard Navigation
**Learning:** Discovered that custom selectable 'chips' (used in multi-step or quick-select forms like Contact and LeadLeakAudit) lacked `aria-pressed` states, semantic `role="group"` wrappers with `aria-labelledby`, and clear `focus-visible` outlines, making them difficult for screen reader and keyboard users to navigate and understand their selected state. Inputs also relied solely on nesting for labels rather than explicit `htmlFor` / `id` bindings.
**Action:** Always add `aria-pressed` to toggleable buttons, semantic `role="group"` containers, explicit `focus-visible:ring-2` utility classes for clear keyboard focus indicators, and strict `htmlFor`/`id` bindings on all form inputs.

## 2024-06-25 - Custom Interactive Elements Missing Focus Styles
**Learning:** Found that custom interactive UI components like accordions, toggles, and tab switches often lack explicit `focus-visible` styling, unlike standard buttons. This creates a poor experience for keyboard users who cannot easily tell which element is focused.
**Action:** Always verify and add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-persimmon focus-visible:ring-offset-2` (or similar appropriate design token utilities) to custom interactive components for clear keyboard accessibility.
