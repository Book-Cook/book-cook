# Unified Recipe Gallery - Technical Specification

## Overview
Consolidate the current separate "Recipes" and "Discover" pages into a unified interface with tab-based navigation for better UX and reduced cognitive load.

## User Experience Goals
- Single source of truth for all recipe browsing
- Seamless switching between personal and community recipes
- Persistent search across tabs
- Modern, clean tab interface
- Mobile-optimized responsive design
- Fast, smooth transitions

## Technical Requirements

### 1. Component Architecture
```
UnifiedRecipeGallery/
├── UnifiedRecipeGallery.tsx          # Main component with tab logic
├── UnifiedRecipeGallery.styles.ts    # Fluent UI styling
├── UnifiedRecipeGallery.types.ts     # TypeScript interfaces
├── UnifiedRecipeGallery.test.tsx     # Jest test suite
└── index.ts                          # Barrel export
```

### 2. Tab Interface Design
- **Tab Labels**: "My Recipes" | "Community" 
- **Active State**: Clear visual distinction with Fluent UI primary color
- **Hover States**: Subtle hover effects for better interactivity
- **Smooth Transitions**: 200ms ease-in-out transitions between tabs
- **Focus Management**: Proper keyboard navigation and focus indicators
- **Mobile Layout**: Tabs remain horizontal but optimized for touch

### 3. State Management
- **Tab Selection**: React state with URL parameter sync (`?tab=community`)
- **Search Context**: Shared search state persists across tab switches
- **Filter Context**: Tag filters and sort preferences maintain separately per tab
- **Loading States**: Independent loading for each tab content
- **Error Handling**: Graceful error states for both personal and community content

### 4. URL Structure
- `/recipes` - Default to "My Recipes" tab
- `/recipes?tab=community` - Direct link to Community tab
- `/recipes?tab=my-recipes&search=pasta` - Deep linking with search
- Browser back/forward navigation support

### 5. Performance Considerations
- **Lazy Loading**: Only load active tab content
- **Caching**: Maintain React Query cache across tab switches
- **Search Debouncing**: 300ms debounce for search input
- **Animation Performance**: Use CSS transforms for smooth transitions

### 6. Accessibility Requirements
- **ARIA Labels**: Proper role="tablist" and aria-selected attributes
- **Keyboard Navigation**: Arrow keys for tab navigation, Enter/Space to select
- **Screen Reader**: Clear announcements for tab changes
- **Focus Management**: Focus moves to tab content when switched
- **Color Contrast**: Meets WCAG AA standards (4.5:1 ratio minimum)

### 7. Visual Design Specifications
- **Tab Bar Height**: 48px for desktop, 44px for mobile
- **Tab Spacing**: 24px horizontal padding, 12px vertical
- **Active Tab Indicator**: 2px bottom border with primary color
- **Typography**: Fluent UI Body1 for tab labels
- **Animations**: Smooth underline transition for active state
- **Shadow/Elevation**: Subtle shadow below tab bar for depth

### 8. Content Area Requirements
- **Height Management**: Tabs take minimal space, content area fills remaining
- **Scroll Behavior**: Independent scrolling for each tab content
- **Empty States**: Appropriate messaging for each tab when no content
- **Loading States**: Consistent spinner/skeleton for both tabs

### 9. Integration Points
- **Search Bar**: Single SearchBar component works for both tabs
- **Tag Picker**: Separate tag state per tab (personal tags vs community tags)
- **Recipe Cards**: Same RecipeCard component with context-appropriate actions
- **Fallback Screens**: Reuse existing loading/error/empty state components

### 10. Testing Requirements
- **Unit Tests**: Component rendering, tab switching, state management
- **Integration Tests**: Search functionality across tabs, URL parameter handling
- **Accessibility Tests**: Screen reader compatibility, keyboard navigation
- **Visual Regression Tests**: Screenshot comparisons for consistent styling
- **Mobile Testing**: Responsive behavior on various screen sizes

### 11. Migration Strategy
- **Phase 1**: Build UnifiedRecipeGallery component alongside existing pages
- **Phase 2**: Update /recipes route to use new component
- **Phase 3**: Redirect /discover to /recipes?tab=community
- **Phase 4**: Remove old Discover page and components
- **Phase 5**: Clean up unused imports and dependencies

### 12. Quality Gates
- [ ] All existing functionality preserved
- [ ] Search works seamlessly across tabs
- [ ] Mobile experience is smooth and touch-friendly
- [ ] Loading times are comparable or better than current implementation
- [ ] Zero accessibility violations in automated testing
- [ ] Visual design matches Fluent UI standards
- [ ] Code coverage >85% for new components
- [ ] No TypeScript errors or warnings
- [ ] Lint passes with zero issues

### 13. Success Metrics
- **User Engagement**: Increased time spent browsing recipes
- **Navigation Efficiency**: Reduced page reloads between personal/community
- **Search Usage**: Higher search completion rates
- **Performance**: Page load time <2s, tab switching <200ms
- **Accessibility Score**: 100% Lighthouse accessibility score

### 14. Risk Mitigation
- **Fallback Strategy**: Keep old pages during transition period
- **Performance Impact**: Monitor bundle size and lazy load appropriately  
- **User Confusion**: Clear visual cues and onboarding for new interface
- **Mobile Issues**: Extensive testing on actual devices, not just dev tools

## Implementation Order
1. Create component structure and basic tab interface
2. Integrate existing RecipeGallery and PublicRecipeGallery
3. Implement URL state management and navigation
4. Add comprehensive styling and animations
5. Write test suite and accessibility features
6. Visual validation and responsive optimization
7. Migration and cleanup

## Definition of Done
- All functionality works as specified
- Visual screenshots validate design quality
- Tests pass with high coverage
- Accessibility audit passes
- Mobile experience is optimized
- Code review approved
- Performance benchmarks met