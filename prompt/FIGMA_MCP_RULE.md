# Figma MCP Implementation Rules

This project implements Open Park screens from the Figma file below.

- Figma file: `Open-Park`
- File key: `DwdZiMSAob2nmszvtKGuKa`
- Root node: `0:1`

## Required Workflow

1. Read the target frame with Figma MCP before implementing a page or state.
2. Treat Figma MCP frame/node data as the source of truth for layout, color, font size, font weight, spacing, and dimensions.
3. Do not implement from screenshots alone. Screenshots are only visual references after the node data is read.
4. If screenshot details and Figma MCP data disagree, prefer Figma MCP data.
5. Use Tailwind classes for colors, typography, spacing, border radius, borders, shadows, and layout.
6. Use responsive layout primitives such as `flex`, `grid`, `w-full`, `max-w-*`, and `min-h-screen` unless the Figma element is explicitly fixed-size.
7. Implement icon nodes named like `icon-set:icon-name` with `@iconify/react`.
8. Implement stateful screens only when an equivalent Figma frame/node exists.
9. For API-driven text, use `src/components/ui/Skeleton.tsx` at the text-node level while loading.
10. Do not replace static labels, icons, buttons, frames, or whole components with Skeletons.

## Referenced Frames

- Login: `8:771`
- Register Step 1: `46:872`
- Register Step 2: `46:1066`
- Register Complete: `46:1115`
- Select Parking Lot: `23:155`
- Select Parking Lot Empty: `27:368`
- Create Parking Lot: `46:862`
- Create Parking Lot Fee Enabled: `46:1257`
- Main: `17:2`
- Main Empty Table: `70:2848`
- Main Menu Popup: `46:842`
- Main Manual Exit Modal: `63:477`
- Main Camera Connect Modal: `64:2382`

