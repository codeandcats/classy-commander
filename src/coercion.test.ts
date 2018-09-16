import { coerceValue } from './coercion';

describe('src/coercion', () => {
  describe('coerceValue', () => {
    it('should coerce strings to strings', () => {
      expect(coerceValue('123', String)).toStrictEqual('123');
    });

    it('should coerce strings to strings', () => {
      expect(coerceValue('123', Number)).toStrictEqual(123);
      expect(coerceValue('123', Number)).not.toStrictEqual('123');
    });

    it('should coerce strings to strings', () => {
      expect(coerceValue('true', Boolean)).toStrictEqual(true);
      expect(coerceValue('123', Boolean)).not.toStrictEqual('123');
      expect(coerceValue('123', Boolean)).not.toStrictEqual(123);
    });
  });
});
