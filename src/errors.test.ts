import { errorToString } from './errors';

describe('src/errors', () => {
  describe('errorToString', () => {
    it('should return an error\'s stack if it has one', () => {
      expect(errorToString({ stack: 'some stack' })).toEqual('some stack');
    });

    it('should return an error\'s message if it has one and no stack', () => {
      expect(errorToString({ message: 'some message' })).toEqual('some message');
    });

    it('should return the error itself if there is no stack or message', () => {
      expect(errorToString('oh no')).toEqual('oh no');
    });
  });
});
