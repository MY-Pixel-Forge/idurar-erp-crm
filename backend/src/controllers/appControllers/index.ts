import createCRUDController from '../middlewaresControllers/createCRUDController';
import { routesList } from '../../models/utils';

import { globSync } from 'glob';
import path from 'path';

// Pattern to locate controller directories (each controller should export handlers)
const pattern = './src/controllers/appControllers/*/**/';
const controllerPaths = globSync(pattern);

// controllers keyed by controllerName; each controller exposes CRUD handlers
const controllers: Record<string, Record<string, (...args: any[]) => any>> = {};
const hasCustomControllers: string[] = [];

// Start loading custom controllers asynchronously. We intentionally do not await
// imports here so startup remains fast; routes will look up handlers at request time.
for (const controllerPath of controllerPaths) {
  const controllerName = path.basename(controllerPath);
  // import the controller's index file if present
  const controllerIndex = path.resolve(controllerPath, 'index.ts');
  import(controllerIndex)
    .then((mod) => {
      const customController = (mod as any)?.default || (mod as any);
      if (customController) {
        hasCustomControllers.push(controllerName);
        controllers[controllerName] = customController;
      }
    })
    .catch((err) => {
      // Log and continue; missing or broken controller modules will be ignored
      console.error('Failed loading controller:', controllerPath, err?.message || err);
    });
}

// Provide default CRUD controllers for models that don't have a custom controller
routesList.forEach(({ modelName, controllerName }) => {
  if (!hasCustomControllers.includes(controllerName)) {
    controllers[controllerName] = createCRUDController(modelName);
  }
});

export default controllers;
