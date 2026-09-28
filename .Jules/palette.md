## 2024-05-18 - Missing ARIA label on modal close button
**Learning:** Found an accessibility issue pattern in an Astro component where an icon-only button (a close button using a text character `✕`) lacks an `aria-label` attribute and visible focus states for keyboard users.
**Action:** Always add `aria-label` to icon-only or character-only buttons, and verify `focus-visible` styles are included for keyboard accessibility.
