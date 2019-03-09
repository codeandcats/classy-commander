import * as fs from 'fs';
import { rootPath } from 'get-root-path';
import * as path from 'path';

fs.copyFileSync(path.join(rootPath, 'package.json'), path.join(rootPath, 'dist/package.json'));

fs.copyFileSync(path.join(rootPath, 'README.md'), path.join(rootPath, 'dist/README.md'));

const packageObject = JSON.parse(fs.readFileSync('dist/package.json', 'utf8'));

delete packageObject.private;
delete packageObject.scripts;
delete packageObject.devDependencies;
delete packageObject.husky;

fs.writeFileSync(path.join(rootPath, 'dist/package.json'), JSON.stringify(packageObject, null, '  '), 'utf8');
