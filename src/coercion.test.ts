import { coerceValue } from './coercion';

describe('src/coercion', () => {
  describe('coerceValue', () => {
    it('should coerce strings to strings', () => {
      expect(coerceValue('123', String, '')).toStrictEqual('123');
      expect(coerceValue(undefined, String, 'some default value')).toStrictEqual('some default value');
      expect(coerceValue(['1', '2', 'yo'], String, [])).toStrictEqual(['1', '2', 'yo']);
    });

    it('should coerce strings to strings', () => {
      expect(coerceValue('123', Number, 0)).toStrictEqual(123);
      expect(coerceValue('123', Number, 0)).not.toStrictEqual('123');
      expect(coerceValue(undefined, Number, 8008135)).toStrictEqual(8008135);
      expect(coerceValue(['1', '2', '3'], Number, [])).toStrictEqual([1, 2, 3]);
    });

    it('should coerce strings to strings', () => {
      expect(coerceValue('true', Boolean, false)).toStrictEqual(true);
      expect(coerceValue('123', Boolean, false)).not.toStrictEqual('123');
      expect(coerceValue('123', Boolean, false)).not.toStrictEqual(123);
      expect(coerceValue(undefined, Boolean, false)).toStrictEqual(false);
      expect(coerceValue(undefined, Boolean, true)).toStrictEqual(true);
      expect(coerceValue(['true', 'false', 'true'], Boolean, [])).toStrictEqual([true, false, true]);
    });
  });
});
