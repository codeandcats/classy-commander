import { getUniqueModuleNames } from './modules';

describe('src/modules', () => {
  describe('getUniqueModuleNames', () => {
    it('should return a unique list of module names from a list of filenames', () => {
      const input = [
        'commands/add.ts',
        'commands/add.md',
        'commands/remove.ts',
        'commands/remove.js',
        'commands/set.js',
        'commands/types.d.ts',
        'commands/readme.md',
      ];

      const actual = getUniqueModuleNames(input);

      expect(actual).toEqual([
        'commands/add',
        'commands/remove',
        'commands/set'
      ]);
    });
  });
});
