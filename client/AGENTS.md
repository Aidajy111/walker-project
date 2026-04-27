# Frontend Rules

- Use Feature-Sliced Design for new frontend code.
- Main layers: `app`, `pages`, `widgets`, `features`, `entities`, `shared`.
- Keep styles next to components (`*.module.css` рядом с `*.jsx`).
- Store design tokens in `src/app/styles/root.css`.
- Use router configuration from `src/app/providers/router.js`.
