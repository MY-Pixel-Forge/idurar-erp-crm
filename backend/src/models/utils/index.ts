import { basename, extname } from 'path';
import { globSync } from 'glob';

const appModelsFiles = globSync('./src/models/appModels/**/*.ts');

const pattern = './src/models/**/*.ts';

export const modelsFiles = globSync(pattern).map((filePath) => {
  const fileNameWithExtension = basename(filePath);
  const fileNameWithoutExtension = fileNameWithExtension.replace(extname(fileNameWithExtension), '');
  return fileNameWithoutExtension;
});

export const constrollersList: string[] = [];
export const appModelsList: string[] = [];
export const entityList: string[] = [];
export const routesList: Array<{ entity: string; modelName: string; controllerName: string }> = [];

for (const filePath of appModelsFiles) {
  const fileNameWithExtension = basename(filePath);
  const fileNameWithoutExtension = fileNameWithExtension.replace(extname(fileNameWithExtension), '');
  const firstChar = fileNameWithoutExtension.charAt(0);
  const modelName = fileNameWithoutExtension.replace(firstChar, firstChar.toUpperCase());
  const fileNameLowerCaseFirstChar = fileNameWithoutExtension.replace(firstChar, firstChar.toLowerCase());
  const entity = fileNameWithoutExtension.toLowerCase();

  const controllerName = fileNameLowerCaseFirstChar + 'Controller';
  constrollersList.push(controllerName);
  appModelsList.push(modelName);
  entityList.push(entity);

  const route = {
    entity: entity,
    modelName: modelName,
    controllerName: controllerName,
  };
  routesList.push(route);
}
