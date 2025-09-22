import express from 'express';
import { catchErrors } from '../../handlers/errorHandlers';
import appControllers from '../../controllers/appControllers';
import { routesList } from '../../models/utils';

// ========== Types ==========
import type { RequestHandler } from 'express';
type ControllerShape = Record<string, RequestHandler | ((...args: any[]) => any)>;

const router = express.Router();

// Helper: create a request-time wrapper that looks up the actual handler from
// the controllers object. This makes dynamic import() of controllers safe
// because the router will resolve the latest function at call time.
const wrapHandler = (controllerName: string, handlerName: string) => {
  return ((req: any, res: any, next: any) => {
    const controller = (appControllers as any)[controllerName] as ControllerShape | undefined;
    const handler = controller?.[handlerName] as RequestHandler | undefined;
    if (!handler) {
      // Handler not yet loaded or missing -> respond with 503 until available
      return res.status(503).json({ error: 'Controller not available yet' });
    }
    return handler(req, res, next);
  }) as RequestHandler;
};

const routerApp = (entity: string, controllerName: string) => {
  router.route(`/${entity}/create`).post(catchErrors(wrapHandler(controllerName, 'create')));
  router.route(`/${entity}/read/:id`).get(catchErrors(wrapHandler(controllerName, 'read')));
  router.route(`/${entity}/update/:id`).patch(catchErrors(wrapHandler(controllerName, 'update')));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(wrapHandler(controllerName, 'delete')));
  router.route(`/${entity}/search`).get(catchErrors(wrapHandler(controllerName, 'search')));
  router.route(`/${entity}/list`).get(catchErrors(wrapHandler(controllerName, 'list')));
  router.route(`/${entity}/listAll`).get(catchErrors(wrapHandler(controllerName, 'listAll')));
  router.route(`/${entity}/filter`).get(catchErrors(wrapHandler(controllerName, 'filter')));
  router.route(`/${entity}/summary`).get(catchErrors(wrapHandler(controllerName, 'summary')));

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(catchErrors(wrapHandler(controllerName, 'mail')));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(catchErrors(wrapHandler(controllerName, 'convert')));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  routerApp(entity, controllerName);
});

export default router;
