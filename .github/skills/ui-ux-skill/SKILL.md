---
name: ui-ux-skill
user-invocable: true
description: "Use when improving the React storefront, admin interface, layout, responsiveness, accessibility, or shopping flow in this project."
---

# UI/UX Skill

## Purpose
Use this skill to improve the customer and admin experience of the Ese Luxury platform without breaking existing functionality.

## When to Use
- Fix visual inconsistencies, spacing, or hierarchy
- Improve mobile responsiveness or desktop flow
- Review product cards, checkout, navigation, forms, or admin pages
- Strengthen accessibility, readability, and feedback states
- Refine conversion paths such as cart, wishlist, search, and checkout

## Workflow
1. Identify the screen or component to improve.
2. Review the current structure in the relevant frontend files under `frontend/src/`.
3. Check whether the change fits the existing design system in `frontend/src/styles/globals.css` and existing components.
4. Improve UI details with minimal, reusable changes:
   - layout and spacing
   - typography and contrast
   - button, form, and card states
   - responsive behavior
   - empty/loading/error feedback
5. Keep the implementation consistent with the current styling tokens and component patterns.
6. Verify the result with the frontend build and confirm no obvious runtime or lint issues were introduced.

## Quality Criteria
- Clear visual hierarchy and readable content
- Responsive behavior on mobile and desktop
- Accessible contrast, labels, focus styles, and semantic structure
- Consistent use of existing colors, spacing, and components
- No regressions to shopping, auth, or admin flows
- Small, maintainable changes that match the existing project style

## Preferred Scope
- Prefer editing existing components in `frontend/src/components/` and `frontend/src/pages/`.
- Reuse existing design tokens and styles before introducing new ones.
- Keep changes focused on one user journey at a time.

## Completion Check
Before finishing, confirm that:
- the UI change matches the current design system,
- the affected page still renders correctly,
- the improvement is understandable for both customers and admins.
