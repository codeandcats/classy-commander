import * as root from 'app-root-path';
import * as fs from 'fs';

fs.copyFileSync(root.resolve('./package.json'), root.resolve('./dist/package.json'));

fs.copyFileSync(root.resolve('./README.md'), root.resolve('./dist/README.md'));

const packageObject = JSON.parse(fs.readFileSync('./dist/package.json', 'utf8'));

delete packageObject.private;
delete packageObject.scripts;
delete packageObject.devDependencies;
delete packageObject.husky;

fs.writeFileSync(root.resolve('./dist/package.json'), JSON.stringify(packageObject, null, '  '), 'utf8');
