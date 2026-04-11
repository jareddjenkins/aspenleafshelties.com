# Repository Instructions

- Do not assume `node`, `npm`, or `ng` are installed on the host machine.
- Prefer running Node/Angular/npm workflows through Docker for this repository.
- When package scripts or Angular commands are needed, use the Docker setup first:
  - `docker compose up frontend-dev`
  - `docker compose run --rm frontend-dev npm <script>`
  - `docker compose run --rm frontend-dev npx ng <command>`
- Avoid asking the user to install npm locally unless they explicitly want to change that workflow.
- Prefer Angular Material component defaults for visual styling.
- Use local CSS primarily for layout and responsive behavior with shared primitives like `section`, `container`, `stack`, `cluster`, `split`, and visibility utilities.
- Avoid one-off component styling unless it clearly supports branding, responsiveness, or usability.
