## 2024-05-18 - Missing ARIA label and focus styles on modal close button
**Learning:** Found an accessibility issue pattern where an icon-only button (such as a close button with a text character `✕`) lacks an `aria-label` attribute and visible focus states for keyboard users.
**Action:** Always add `aria-label` to icon-only or character-only buttons, and verify `focus-visible:ring-2` styles are included for keyboard accessibility.

## 2023-10-25 - Form Accessibility and Keyboard Navigation
**Learning:** Discovered that custom selectable 'chips' (used in multi-step or quick-select forms like Contact and LeadLeakAudit) lacked `aria-pressed` states, semantic `role="group"` wrappers with `aria-labelledby`, and clear `focus-visible` outlines, making them difficult for screen reader and keyboard users to navigate and understand their selected state. Inputs also relied solely on nesting for labels rather than explicit `htmlFor` / `id` bindings.
**Action:** Always add `aria-pressed` to toggleable buttons, semantic `role="group"` containers, explicit `focus-visible:ring-2` utility classes for clear keyboard focus indicators, and strict `htmlFor`/`id` bindings on all form inputs.


## 2024-10-03 - FAQ Accordion Accessibility
**Learning:** The FAQ accordions lacked proper ARIA associations between the toggle buttons and the content panels, making it difficult for screen reader users to understand the structure. The decorative '+' icon was also being read out, adding noise. Additionally, keyboard focus indicators were not explicitly defined.
**Action:** Used React's `useId()` to generate unique IDs and pair the `<button>` (`aria-controls`) with the `role="region"` panel (`aria-labelledby`). Added `aria-hidden="true"` to the decorative icon and explicit `focus-visible` ring utilities to the button.
