# Foundation: UI Design System - Radix UI + shadcn/ui

**Decision:** Radix UI + shadcn/ui
**Score:** 0.84 / 1.0
**Category:** UI Components
**Status:** Active

## Stack

- **Radix UI:** Unstyled, accessible primitives (headless components)
- **shadcn/ui:** Beautiful Tailwind-styled components (copy-paste, not npm)
- **Tailwind CSS:** Utility-first styling
- **Next.js 15:** App Router + Server Components

## Why This Stack?

- **Accessibility-first:** WCAG 2.1 AA compliant (keyboard nav, screen readers)
- **Full Control:** Components are copied into your codebase (not black box npm)
- **Customizable:** Tailwind makes it easy to match brand
- **Type-safe:** Full TypeScript support
- **No Runtime JS:** Radix primitives are lean

## Example: Dialog Component

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function CreateBlueprintDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Blueprint</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Blueprint</DialogTitle>
          <DialogDescription>
            Build any app with AI-powered codegen
          </DialogDescription>
        </DialogHeader>
        <BlueprintForm />
      </DialogContent>
    </Dialog>
  );
}
```

## shadcn/ui Setup

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add components (copies into src/components/ui/)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
```

## Accessibility Features

- **Keyboard Navigation:** Tab, Arrow keys, Enter/Space
- **Screen Reader:** ARIA labels, roles, live regions
- **Focus Management:** Automatic focus trapping in modals
- **High Contrast:** Works with system preferences

## Component Library

```
Common Components:
- Button, Input, Select, Checkbox, Radio
- Dialog, Sheet, Popover, Tooltip
- Table, Tabs, Accordion, Dropdown
- Form, Label, Error Message
- Toast, Alert, Badge
```

## Theming

```tsx
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
    },
  },
};
```

## Resources

- **Radix:** https://www.radix-ui.com/primitives
- **shadcn/ui:** https://ui.shadcn.com/
- **Examples:** https://ui.shadcn.com/examples
