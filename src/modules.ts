import * as _ from 'lodash';

function isFileNameTypeScriptOrJavaScript(fileName: string) {
  return /.\.(ts|js)$/i.test(fileName);
}

function isFileNameDeclarationFile(fileName: string) {
  return /\.d.ts$/i.test(fileName);
}

function removeFileExtension(fileName: string) {
  return fileName.slice(0, -3);
}

export function getUniqueModuleNames(fileNames: string[]) {
  const moduleNames = _
    .chain(fileNames)
    .filter((fileName) => !isFileNameDeclarationFile(fileName))
    .filter(isFileNameTypeScriptOrJavaScript)
    .map(removeFileExtension)
    .uniq()
    .value();

  return moduleNames;
}
