# 🎨 Toast Notifications - Visual Examples

## Success Notifications

### Enrollment Success
```
╔════════════════════════════════════════════════╗
║  ✨  Enrollment Successful! 🎉                ║
║                                                ║
║  You're now enrolled in "React Masterclass".  ║
║  Start learning today!                        ║
╚════════════════════════════════════════════════╝
```
**Background**: Purple gradient (#667eea → #764ba2)
**Icon**: Sparkles (animated bounce)
**Duration**: 4 seconds

### Payment Success
```
╔════════════════════════════════════════════════╗
║  💳  Payment Successful! 💳                   ║
║                                                ║
║  ₹999 paid for "React Masterclass".          ║
║  Receipt sent to your email.                  ║
╚════════════════════════════════════════════════╝
```
**Background**: Purple gradient (#667eea → #764ba2)
**Icon**: CreditCard (animated bounce)
**Duration**: 5 seconds

### Login Success
```
╔════════════════════════════════════════════════╗
║  ✓  Welcome back, John! 👋                    ║
║                                                ║
║  You've successfully logged in.               ║
╚════════════════════════════════════════════════╝
```
**Background**: Purple gradient (#667eea → #764ba2)
**Icon**: UserCheck (animated bounce)
**Duration**: 3 seconds

### Registration Success
```
╔════════════════════════════════════════════════╗
║  ✓  Account Created! 🎊                       ║
║                                                ║
║  Welcome to SparksStream! You can now log in. ║
╚════════════════════════════════════════════════╝
```
**Background**: Purple gradient (#667eea → #764ba2)
**Icon**: CheckCircle (animated bounce)
**Duration**: 4 seconds

### Course Created
```
╔════════════════════════════════════════════════╗
║  📚  Course Created! 📚                        ║
║                                                ║
║  "React Masterclass" has been created         ║
║  successfully.                                ║
╚════════════════════════════════════════════════╝
```
**Background**: Purple gradient (#667eea → #764ba2)
**Icon**: BookOpen (animated bounce)
**Duration**: 4 seconds

### Profile Updated
```
╔════════════════════════════════════════════════╗
║  ✓  Profile Updated! ✨                       ║
║                                                ║
║  Your profile has been updated successfully.  ║
╚════════════════════════════════════════════════╝
```
**Background**: Purple gradient (#667eea → #764ba2)
**Icon**: CheckCircle (animated bounce)
**Duration**: 3 seconds

### Password Reset Success
```
╔════════════════════════════════════════════════╗
║  ✓  Password Reset! 🔐                        ║
║                                                ║
║  Your password has been updated successfully. ║
╚════════════════════════════════════════════════╝
```
**Background**: Purple gradient (#667eea → #764ba2)
**Icon**: CheckCircle (animated bounce)
**Duration**: 4 seconds

## Error Notifications

### Enrollment Error
```
╔════════════════════════════════════════════════╗
║  ❌  Enrollment Failed                         ║
║                                                ║
║  Course is full. Please try again later.      ║
╚════════════════════════════════════════════════╝
```
**Background**: Pink-red gradient (#f093fb → #f5576c)
**Icon**: XCircle (animated bounce)
**Duration**: 4 seconds

### Payment Error
```
╔════════════════════════════════════════════════╗
║  ❌  Payment Failed                            ║
║                                                ║
║  Payment could not be processed.              ║
║  Please try again.                            ║
╚════════════════════════════════════════════════╝
```
**Background**: Pink-red gradient (#f093fb → #f5576c)
**Icon**: XCircle (animated bounce)
**Duration**: 4 seconds

### Login Error
```
╔════════════════════════════════════════════════╗
║  ❌  Login Failed                              ║
║                                                ║
║  Invalid credentials. Please try again.       ║
╚════════════════════════════════════════════════╝
```
**Background**: Pink-red gradient (#f093fb → #f5576c)
**Icon**: XCircle (animated bounce)
**Duration**: 4 seconds

### Registration Error
```
╔════════════════════════════════════════════════╗
║  ❌  Registration Failed                       ║
║                                                ║
║  Email already exists. Please use another.    ║
╚════════════════════════════════════════════════╝
```
**Background**: Pink-red gradient (#f093fb → #f5576c)
**Icon**: XCircle (animated bounce)
**Duration**: 4 seconds

## Warning Notifications

### Generic Warning
```
╔════════════════════════════════════════════════╗
║  ⚠️  Warning!                                  ║
║                                                ║
║  Please check your input before submitting.   ║
╚════════════════════════════════════════════════╝
```
**Background**: Orange gradient (#ffecd2 → #fcb69f)
**Icon**: AlertCircle (animated bounce)
**Duration**: 3 seconds

## Info Notifications

### Generic Info
```
╔════════════════════════════════════════════════╗
║  ℹ️  Info                                      ║
║                                                ║
║  Your session will expire in 5 minutes.       ║
╚════════════════════════════════════════════════╝
```
**Background**: Cyan-pink gradient (#a8edea → #fed6e3)
**Icon**: Info (animated bounce)
**Duration**: 3 seconds

## Animation Sequence

### Slide In Animation
```
Frame 1:  [Toast off-screen right] →
Frame 2:  [Toast 75% visible]      →
Frame 3:  [Toast 100% visible]     ✓
```
**Duration**: 0.3 seconds
**Easing**: ease-out

### Bounce Animation (Icon)
```
Frame 1:  ○ (scale: 1.0)
Frame 2:  ◉ (scale: 1.1)  ← Bounce
Frame 3:  ○ (scale: 1.0)
```
**Duration**: 0.6 seconds
**Easing**: ease-in-out

### Fade Out Animation
```
Frame 1:  [Toast 100% visible]
Frame 2:  [Toast 50% visible]
Frame 3:  [Toast 0% visible]  → Removed
```
**Duration**: 0.2 seconds
**Easing**: ease-in

## Positioning

### Desktop
```
┌─────────────────────────────────────────┐
│                                    ╔════╗│
│                                    ║ 🎉 ║│
│                                    ╚════╝│
│                                         │
│                                         │
│                                         │
│         [Main Content]                  │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```
**Position**: top-right
**Margin**: 16px from top and right

### Mobile
```
┌─────────────────────────┐
│    ╔════════════════╗   │
│    ║ 🎉 Success!   ║   │
│    ╚════════════════╝   │
│                         │
│   [Main Content]        │
│                         │
└─────────────────────────┘
```
**Position**: top-center
**Width**: 90vw (max)
**Margin**: 16px from top

## Stacking (Multiple Toasts)

```
┌─────────────────────────────────────────┐
│                                    ╔════╗│
│                                    ║ 🎉 ║│ ← Toast 1
│                                    ╚════╝│
│                                    ╔════╗│
│                                    ║ ✓  ║│ ← Toast 2
│                                    ╚════╝│
│                                    ╔════╗│
│                                    ║ ℹ️  ║│ ← Toast 3
│                                    ╚════╝│
└─────────────────────────────────────────┘
```
**Gap**: 8px between toasts
**Max Visible**: 3 toasts
**Older toasts**: Auto-dismissed

## Color Palette

### Success (Purple Gradient)
```
Start: #667eea (Indigo)
End:   #764ba2 (Purple)
Text:  #ffffff (White)
```

### Error (Pink-Red Gradient)
```
Start: #f093fb (Pink)
End:   #f5576c (Red)
Text:  #ffffff (White)
```

### Warning (Orange Gradient)
```
Start: #ffecd2 (Light Orange)
End:   #fcb69f (Peach)
Text:  #333333 (Dark Gray)
```

### Info (Cyan-Pink Gradient)
```
Start: #a8edea (Cyan)
End:   #fed6e3 (Light Pink)
Text:  #333333 (Dark Gray)
```

## Typography

### Title
- **Font Weight**: 700 (Bold)
- **Font Size**: 1rem (16px)
- **Line Height**: 1.2
- **Margin Bottom**: 0.25rem

### Message
- **Font Weight**: 400 (Regular)
- **Font Size**: 0.875rem (14px)
- **Line Height**: 1.4
- **Opacity**: 0.9

## Icon Specifications

### Size
- **Desktop**: 24px
- **Mobile**: 20px

### Container
- **Size**: 40px × 40px
- **Border Radius**: 50% (circle)
- **Background**: rgba(255, 255, 255, 0.2)
- **Display**: flex, center aligned

### Animation
- **Type**: Bounce
- **Duration**: 0.6s
- **Timing**: ease-in-out
- **Iterations**: 1

## Responsive Breakpoints

### Mobile (< 768px)
```javascript
{
  width: '90vw',
  maxWidth: '400px',
  padding: '1rem',
  fontSize: '0.875rem',
}
```

### Tablet (768px - 1024px)
```javascript
{
  width: '400px',
  padding: '1rem 1.25rem',
  fontSize: '0.875rem',
}
```

### Desktop (> 1024px)
```javascript
{
  minWidth: '300px',
  maxWidth: '500px',
  padding: '1rem 1.25rem',
  fontSize: '1rem',
}
```

## Accessibility

### Screen Reader Text
```html
<div role="alert" aria-live="polite">
  Enrollment Successful! You're now enrolled in React Masterclass.
</div>
```

### Keyboard Navigation
- **Dismiss**: Click anywhere on toast
- **Auto-dismiss**: After duration expires
- **Focus**: Not focusable (non-interactive)

## Summary

✅ Beautiful gradient backgrounds
✅ Smooth slide-in animation (0.3s)
✅ Icon bounce animation (0.6s)
✅ Responsive design (mobile, tablet, desktop)
✅ Auto-dismiss (3-5 seconds)
✅ Stacking support (max 3 visible)
✅ Professional appearance
✅ Accessible (ARIA labels)

**Result**: Professional, eye-catching notifications that enhance user experience!
