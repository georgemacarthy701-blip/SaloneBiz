# 🎨 SaloneBiz Professional Design System

## Enterprise-Grade Design for Sierra Leone's Service Industry

This document establishes the professional design standards for SaloneBiz, balancing international best practices with local market sensibilities.

---

## 1. Color Palette

### Primary Colors
- **Deep Blue** (#1e3a8a): Trust, professionalism, stability
- **Vibrant Blue** (#2563eb): Primary actions, engagement
- **Light Blue** (#3b82f6): Secondary, hover states

### Status Colors
- **Success Green** (#16a34a): Approvals, active status
- **Warning Amber** (#d97706): Pending, review needed
- **Error Red** (#dc2626): Rejections, errors
- **Neutral Gray** (#6b7280): Secondary text, disabled

### Context
- Developed world standard colors signaling professionalism and trust
- Accessible contrast ratios (WCAG AA compliant)
- Meaningful color use (green=success, amber=caution, red=error)

---

## 2. Typography Hierarchy

### Font Family
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
(System fonts for performance and readability)
```

### Font Sizes & Weights

| Usage | Size | Weight | Example |
|-------|------|--------|---------|
| Page Heading | 32-36px | Bold (700) | Admin Dashboard |
| Section Heading | 24px | Bold (700) | Verification Action |
| Card Heading | 20px | Semibold (600) | Business Name |
| Label/Button | 14-16px | Semibold (600) | Category * |
| Body Text | 14-16px | Regular (400) | Description paragraph |
| Small/Secondary | 12-13px | Regular (400) | Timestamp, helper text |
| Tiny/Badge | 11-12px | Semibold (600) | Status badges |

### Line Height
- Headings: 1.2-1.3 (tight, for impact)
- Body: 1.5-1.6 (readable, comfortable)
- Form Labels: 1.4

---

## 3. Spacing System (8px Grid)

### Base Unit: 8px
All spacing must be multiples of 8px for consistency

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Fine details, icon padding |
| sm | 8px | Element spacing, small gaps |
| md | 16px | Card padding, moderate gaps |
| lg | 24px | Section padding |
| xl | 32px | Major section spacing |
| 2xl | 48px | Page-level spacing |
| 3xl | 64px | Hero sections |

### Examples
```
- Card padding: 24px (3x base unit)
- Button padding: 12px horizontal, 8px vertical
- Input height: 44px (accessibility minimum)
- Section gap: 32px between sections
```

---

## 4. Component Styling Standards

### Buttons

**Primary Action (CTA)**
```
Background: Blue gradient (from-blue-600 to-blue-700)
Text: White, semibold (600)
Padding: 12px horizontal, 8px vertical (minimum 44px height)
Border Radius: 8px
Hover: Darker gradient
Active: Darker with slight scale
Disabled: 50% opacity
```

**Secondary Action**
```
Background: Light gray (from-gray-100)
Text: Gray-900, semibold
Border: Gray-300, 2px
Hover: Gray-200 background
```

**Danger Action (Reject)**
```
Background: Red gradient (from-red-600 to-red-700)
Text: White, semibold
Hover: Darker red
```

### Form Inputs

**Standard Input Field**
```
Border: 2px solid gray-300
Border Radius: 8px
Padding: 12px horizontal, 10px vertical (44px min height)
Background: White
Text Color: Gray-900, semibold (600)
Placeholder: Gray-400, text-sm
Focus State:
  - Border color: Blue-500
  - Ring: Blue-500, 2px
  - Shadow: Subtle blue glow
Disabled: 50% opacity, gray background
```

### Cards & Containers

**Business Card**
```
Background: White
Border: Subtle (gray-200)
Border Radius: 8-12px
Shadow: Light (shadow-md)
Hover: Slightly elevated (shadow-lg)
Padding: 16px
Gap between elements: 12-16px
```

**Admin Table Row**
```
Padding: 16px
Border-bottom: Gray-200, 1px
Alternate Rows: White / Gray-50
Hover: Light blue background
```

### Badges & Status Indicators

**Status Badge**
```
Pending: Amber background (bg-amber-100), amber text (text-amber-800)
Approved: Green background (bg-green-100), green text (text-green-800)
Rejected: Red background (bg-red-100), red text (text-red-800)
Border Radius: 999px (fully rounded)
Padding: 8px 12px
Font Size: 12-13px, semibold (600)
```

---

## 5. Professional Design Principles

### 1. Clarity Over Decoration
- ✓ Clear hierarchy
- ✓ Readable typography
- ✓ Obvious CTAs
- ❌ Excessive effects
- ❌ Confusing layouts

### 2. Consistency
- Same components look the same everywhere
- Consistent spacing relationships
- Predictable interactions
- Unified color usage

### 3. Accessibility
- Contrast ratio: 4.5:1 minimum (WCAG AA)
- Input height: 44px minimum (thumb-friendly)
- Focus states: Always visible
- Labels: Always associated with inputs

### 4. Mobile-First
- Responsive breakpoints:
  - Mobile: < 640px (full width)
  - Tablet: 640px - 1024px (2 columns)
  - Desktop: > 1024px (3+ columns)
- Touch targets: 44px minimum
- Readable text without zoom

### 5. Performance
- No heavy effects on mobile
- Optimized images (Cloudinary)
- Fast interactions (no lag)
- Smooth animations (200-300ms)

---

## 6. Layout Standards

### Page Layout
```
Header (Navbar)
   ↓
Page Content
   ├── Hero Section (if applicable)
   ├── Main Content (padded 24-48px)
   └── Footer (optional)
```

### Section Spacing
```
Vertical gap between sections: 48px (desktop), 32px (mobile)
Horizontal padding: 24px (mobile), 48px (tablet), 96px (desktop)
Max content width: 1280px
```

### Form Layout
```
Labels above inputs
Single column: Mobile/Tablet
Two columns: Desktop (when logical)
Gap between fields: 24px
Helper text below input: 8px gap
```

---

## 7. Interactive States

### All Interactive Elements Should Have

**Default State**
- Clear visual treatment
- Obvious it's clickable

**Hover State** (Desktop)
- Visual feedback
- Usually: darker color, elevation, or subtle change
- Duration: 150-200ms transition

**Focus State** (Keyboard Navigation)
- Visible focus ring
- Usually: 2-4px colored border
- Important for accessibility

**Active/Pressed State**
- Indicates interaction in progress
- Visual confirmation
- Duration: Instant

**Disabled State**
- 50% opacity or grayed out
- Cursor: not-allowed
- No interactions

---

## 8. Professional Messaging

### Button Labels
```
✓ "Approve Business"      ✓ "Review Application"
✗ "Ok"                    ✗ "Go"
✓ "Reject & Send Feedback" ✓ "Resubmit"
✗ "No"                    ✗ "Bad"
```

### Error Messages
```
✓ "Please provide rejection notes before rejecting"
✗ "Error"

✓ "Phone number must start with +232 for Sierra Leone"
✗ "Bad phone"
```

### Success Messages
```
✓ "Business created successfully! Your listing is pending admin approval."
✗ "Done"

✓ "This will be reviewed within 24-48 hours."
✗ "Processing..."
```

---

## 9. Dark Mode (Future Extension)

SaloneBiz is currently light-mode only for clarity and professional appearance in local context. Dark mode can be added later with:

- Light gray backgrounds (#f3f4f6)
- Adjusted contrast colors
- Preserved hierarchy

---

## 10. Sierra Leone Market Context

### Local Considerations
- ✓ Professional English for business listings
- ✓ Phone format: +232 preferred
- ✓ Currency: Le (Sierra Leone Leone)
- ✓ Date format: DD/MM/YYYY or DD Mon YYYY
- ✓ Respect for business traditions
- ✓ Trust-building through verification

### International Standards
- ✓ Modern design trends
- ✓ Enterprise-grade UX
- ✓ Accessibility compliance
- ✓ Performance optimization
- ✓ Security best practices

---

## 11. Component Implementation Checklist

When building new components:

- [ ] Follows spacing grid (8px multiples)
- [ ] Uses defined color palette
- [ ] Proper typography hierarchy
- [ ] Minimum 44px touch targets
- [ ] Clear focus states
- [ ] Responsive at all breakpoints
- [ ] Accessible color contrast
- [ ] Consistent with existing components
- [ ] Professional messaging
- [ ] No spelling/grammar errors

---

## 12. Design Files & Assets

### Current Implementation
- Built with: Tailwind CSS
- Icons: Emoji (for compatibility)
- Images: Cloudinary CDN
- Typography: System fonts
- No external design files (code-first approach)

### Adding New Assets
1. Always optimize before upload (Cloudinary)
2. Test responsive behavior
3. Verify color contrast
4. Check on actual devices (mobile/tablet)

---

## 13. QA Checklist for Professional Polish

- [ ] All text is spell-checked and grammatically correct
- [ ] No inconsistent styling across pages
- [ ] Buttons are clearly distinguishable from links
- [ ] Form validation messages are clear
- [ ] Loading states are obvious (spinners, disabled state)
- [ ] Error states don't hide important information
- [ ] Success confirmations are visible
- [ ] No layout shifts or jumps
- [ ] Images load properly (with fallbacks)
- [ ] Mobile looks intentional, not broken
- [ ] Navbar/footer consistent across all pages
- [ ] Color contrast passes WCAG AA
- [ ] Touch targets are at least 44x44px
- [ ] Animations are smooth and not choppy

---

## 14. Professional Standards Summary

| Aspect | Standard |
|--------|----------|
| **Design Framework** | Tailwind CSS + Custom System |
| **Color Palette** | Blue-based professional scheme |
| **Typography** | System fonts, clear hierarchy |
| **Spacing** | 8px grid, consistent gaps |
| **Components** | Reusable, predictable, accessible |
| **Accessibility** | WCAG AA compliant |
| **Responsiveness** | Mobile-first, 3-breakpoint system |
| **Performance** | Optimized images, smooth interactions |
| **Branding** | SaloneBiz gradient logo + blue theme |
| **Target Market** | Sierra Leone + International |

---

**Design System Version:** 1.0  
**Last Updated:** June 2026  
**Maintenance:** Review quarterly, update as needed

This design system ensures SaloneBiz maintains professional standards while serving the unique needs of Sierra Leone's vibrant service industry with international quality.
