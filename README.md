# Obsidian Restaurant

A premium, modern Japanese-French fusion restaurant website scaffolding. Designed with a dark luxury "obsidian" theme accented by fluid gold elements.

![Obsidian Website Screenshot Placeholder](assets/screenshot_placeholder.jpg)

## Features

- **Semantic HTML & Modern CSS**: Fluid typography, responsive grid/masonry, and BEM modular component styling.
- **AI Concierge**: Simulated Anthropic API integration providing intelligent chat-based reservations.
- **AI Dish Storyteller**: Generates a poetic culinary backstory for each select menu item dynamically (simulated).
- **AI Sommelier & Chef's Mood Planner**: Interactive widgets offering custom pairing suggestions.
- **Scroll Animations**: Smooth entrance animations using Intersection Observer.

## AI Implementation Details
The AI functionalities are handled in `js/ai.js`. Currently, they simulate an Anthropic response using `setTimeout` for frontend demonstration. 

### How to configure Anthropic API
1. Remove the mock timeout functions in `js/ai.js`.
2. Connect `callAnthropicMock` to your secure backend endpoint (never store Anthropic keys in frontend JS).
3. The server should build the prompt structure using the `SYSTEM_PROMPT` provided inside `ai.js` and call the Anthropic `v1/messages` endpoint utilizing the `claude-3-5-sonnet-20240620` model.

## Setup Instructions
The site is built with vanilla HTML, CSS, and JS. No build steps are required.

To run:
1. Open the project folder in VS Code.
2. Start **Live Server**.
3. Alternatively, run `npx serve` in the project root.

## File Structure
```
obsidian-restaurant/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── typography.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── ai.js
│   ├── menu.js
│   ├── reservations.js
│   └── animations.js
├── assets/
└── README.md
```

## Browser Support
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)

## Design System
- **Colors**: Obsidian (`#0A0A0A`), Gold (`#C9A84C`), Ivory (`#F5F0E8`)
- **Typography**: Playfair Display (Headings), Cormorant Garamond (Body), JetBrains Mono (Labels/UI)

## Contributing
1. Create a descriptive branch (`feat/new-animation`).
2. Adhere to BEM methodology in CSS.
3. Test layout on mobile before PR.
