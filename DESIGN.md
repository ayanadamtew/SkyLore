# Product

SkyLore is a personal astronomy instrument for discovering what is above you tonight, why it matters, and how to share the sky in a way that remains understandable outside the app.

# Visual Direction

Editorial celestial instrument. The sky is the hero, the UI behaves like a precision control surface, and the story layer feels closer to a planetarium program note than a generic dashboard.

# Personality

Curious, precise, cinematic, quiet, scientific, and human.

# Avoid

Generic SaaS dashboards, excessive glassmorphism, purple-blue AI gradients, card spam, unnecessary pills, decorative blobs, arbitrary animation, and visual systems that change from page to page.

# Typography

Display uses a restrained editorial serif stack for the product voice. Interface copy uses a system sans stack for clarity. Coordinates and measurements use a monospace stack. Use no more than these three modes.

# Colors

Use semantic tokens:

- `--space-void`: deepest background
- `--space-deep`: sky body and submerged panels
- `--star-primary`: warm starlight
- `--star-secondary`: moon-silver text
- `--cosmic-accent`: dust blue/teal for navigational emphasis
- `--planet-accent`: solar amber for active discoveries
- `--surface-glass`: restrained translucent instrument surfaces
- `--text-primary`: readable ivory
- `--text-secondary`: quiet blue-grey

# Spacing

Use an 8px-root rhythm with steps at 4, 8, 12, 16, 24, 32, 48, 64, 96, and 128. Major sky/story transitions can breathe. Controls, coordinates, and metadata stay compact.

# Radius

Controls use 4px to 8px radii. The sky dome, celestial markers, and orbital glyphs may be circular because the subject calls for it. Do not use large rounded rectangles as decoration.

# Motion

Motion must communicate orientation, feedback, transition, discovery, emphasis, or atmosphere. Micro interactions last 120-180ms. UI transitions last 200-300ms. Object focus can take 400-700ms. Major scene transitions can take 800-1500ms. Respect reduced motion by removing camera sweeps and large transforms.

# Components

Astronomy components own sky rendering: SkyCanvas, StarField, PlanetLayer, MoonLayer, ConstellationLayer, CelestialGrid, HorizonLayer, Compass, ObjectMarker, and ObjectLabel.

Product components own use flows: LocationPicker, TimePicker, DatePicker, Search, ObjectPanel, StoryPanel, ShareButton, SkyCard, and EventCard.

Marketing components own narrative transitions: Hero, StorySection, FeatureSection, DemoSection, CTASection, and Footer.

# Accessibility

Every icon-only control needs an accessible label. Keyboard focus must be visible. Search results, modals, location denial, and share/download states need semantic feedback. The primary sky has a text alternative through the selected object panel and tonight recommendations.

# Responsive

Desktop uses a three-part instrument layout: controls, sky, story. Mobile prioritizes the sky first, then presents object details as a bottom sheet and places location/time controls below without hiding the product.

# Performance

Use Three.js for the astronomy scene, Astronomy Engine for verified positions, memoized calculations, GPU point fields, and renderer quality levels: LOW, MEDIUM, HIGH. Mobile receives fewer stars and simpler motion by default.
