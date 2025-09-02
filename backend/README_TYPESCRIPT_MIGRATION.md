# TypeScript Migration

This backend codebase is being migrated to TypeScript. All `.js` files will be renamed to `.ts`, and type annotations will be added incrementally.

## Steps
1. All backend `.js` files are renamed to `.ts`.
2. TypeScript config (`tsconfig.json`) is added.
3. Type dependencies are added to `package.json`.
4. Type errors will be fixed incrementally.

Run `npx tsc` to check for type errors after migration.
