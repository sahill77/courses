# Visual Testing Guide - SparksStream

## Quick Testing Checklist

### 1. Mobile Testing (320px - 480px)

#### Home Page
- [ ] Logo and brand name visible and not truncated
- [ ] Hamburger menu icon visible and clickable
- [ ] Hero section text readable (no overlap)
- [ ] Category cards stack vertically
- [ ] Course cards display properly
- [ ] Footer columns stack vertically
- [ ] No horizontal scrolling

#### Navigation
- [ ] Menu opens/closes smoothly
- [ ] All menu items visible when open
- [ ] Profile dropdown works
- [ ] Theme toggle accessible
- [ ] Login/Register buttons visible

#### Courses Page
- [ ] Search bar full width
- [ ] Category filters accessible
- [ ] Course grid single column
- [ ] Course cards not cut off
- [ ] Pagination visible

#### Course Detail
- [ ] Course title readable
- [ ] Price card moves to top
- [ ] Enroll button visible
- [ ] Video player responsive
- [ ] FAQ accordions work
- [ ] No content hidden

#### Admin Panel
- [ ] Mobile header with menu toggle
- [ ] Sidebar opens/closes
- [ ] Tables scroll horizontally
- [ ] All table content accessible
- [ ] Forms full width
- [ ] Buttons properly sized
- [ ] Modals fit screen

### 2. Tablet Testing (481px - 768px)

#### General
- [ ] Two-column layouts work
- [ ] Sidebar behavior appropriate
- [ ] Touch targets adequate (44x44px min)
- [ ] Forms properly sized
- [ ] Tables readable

### 3. Desktop Testing (769px+)

#### General
- [ ] Full layout displays
- [ ] Sidebar collapsible (admin)
- [ ] Hover states work
- [ ] Multi-column grids display
- [ ] All features accessible

## Device-Specific Tests

### iPhone SE (375x667)
```
- Test smallest common mobile size
- Verify all buttons tappable
- Check text readability
- Ensure no content cut off
```

### iPad (768x1024)
```
- Test tablet layout
- Verify two-column grids
- Check sidebar behavior
- Test landscape orientation
```

### Desktop (1920x1080)
```
- Test full desktop layout
- Verify max-width containers
- Check spacing and alignment
- Test all hover interactions
```

## Common Issues to Check

### Text Issues
- [ ] No text overflow
- [ ] No invisible text (white on white, etc.)
- [ ] Font sizes readable (min 14px)
- [ ] Line heights appropriate
- [ ] Text contrast sufficient

### Layout Issues
- [ ] No overlapping elements
- [ ] No content hidden behind other elements
- [ ] Proper spacing between elements
- [ ] Margins and padding consistent
- [ ] No horizontal scroll

### Interactive Elements
- [ ] All buttons clickable/tappable
- [ ] Dropdowns open properly
- [ ] Modals centered and visible
- [ ] Forms submittable
- [ ] Links work correctly

### Images
- [ ] Images load properly
- [ ] No distorted aspect ratios
- [ ] Thumbnails display correctly
- [ ] Icons visible and sized properly

### Tables
- [ ] Headers visible
- [ ] Content not cut off
- [ ] Horizontal scroll works
- [ ] Action buttons accessible
- [ ] Pagination visible

## Browser Testing

### Chrome/Edge
- [ ] Desktop view
- [ ] Mobile emulation
- [ ] DevTools responsive mode

### Firefox
- [ ] Desktop view
- [ ] Responsive design mode

### Safari
- [ ] Desktop view
- [ ] iOS Safari (real device)

## Automated Testing Commands

### Run Development Server
```bash
cd frontend
npm run dev
```

### Test Responsive Breakpoints
```
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these sizes:
   - 320px (iPhone SE)
   - 375px (iPhone X)
   - 768px (iPad)
   - 1024px (iPad Pro)
   - 1920px (Desktop)
```

### Check for Horizontal Scroll
```javascript
// Run in browser console
document.body.scrollWidth > window.innerWidth
// Should return false
```

### Check for Overlapping Elements
```javascript
// Run in browser console
const elements = document.querySelectorAll('*');
let overlaps = 0;
elements.forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    console.log('Overflow:', el);
    overlaps++;
  }
});
console.log('Total overflows:', overlaps);
```

## Visual Regression Testing

### Screenshots to Capture
1. Home page (all breakpoints)
2. Courses page (all breakpoints)
3. Course detail (all breakpoints)
4. Admin panel dashboard (all breakpoints)
5. Admin panel tables (mobile scroll)
6. Login/Register forms (mobile)
7. Navigation menu (mobile open/closed)
8. Modals (all breakpoints)

### Tools
- Browser DevTools
- Lighthouse (Performance & Accessibility)
- WAVE (Accessibility)
- Manual testing on real devices

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Logical tab order

### Screen Reader
- [ ] All images have alt text
- [ ] Form labels present
- [ ] Headings hierarchical
- [ ] ARIA labels where needed

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1)
- [ ] Interactive elements distinguishable
- [ ] Focus indicators visible

## Performance Testing

### Metrics to Check
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s
- [ ] Cumulative Layout Shift < 0.1

### Tools
```bash
# Lighthouse
npm install -g lighthouse
lighthouse http://localhost:5173 --view

# Or use Chrome DevTools > Lighthouse tab
```

## Sign-Off Checklist

Before deploying:
- [ ] All pages tested on mobile
- [ ] All pages tested on tablet
- [ ] All pages tested on desktop
- [ ] No console errors
- [ ] No horizontal scroll
- [ ] All text readable
- [ ] All buttons work
- [ ] All forms submit
- [ ] All images load
- [ ] Navigation works
- [ ] Admin panel functional
- [ ] Accessibility checks pass
- [ ] Performance acceptable

---

Last Updated: 2026-03-25
