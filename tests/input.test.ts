import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// We need to mock readline at the module level
const mockQuestion = jest.fn();
const mockClose = jest.fn();

jest.unstable_mockModule('readline', () => ({
  default: {
    createInterface: jest.fn(() => ({
      question: mockQuestion,
      close: mockClose,
    })),
  },
}));

describe('input module', () => {
  let inputFn: (text: string) => Promise<string>;
  let closeInputFn: () => void;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mod = await import('../components/input');
    inputFn = mod.input;
    closeInputFn = mod.closeInput;
  });

  describe('input function', () => {
    it('should return user answer via resolved promise', async () => {
      mockQuestion.mockImplementation((_prompt: unknown, cb: unknown) => {
        (cb as (answer: string) => void)('hello');
      });

      const result = await inputFn('Enter something: ');

      expect(result).toBe('hello');
    });

    it('should pass the prompt text to readline question', async () => {
      mockQuestion.mockImplementation((_prompt: unknown, cb: unknown) => {
        (cb as (answer: string) => void)('test');
      });

      await inputFn('My custom prompt: ');

      expect(mockQuestion).toHaveBeenCalledWith('My custom prompt: ', expect.any(Function));
    });

    it('should resolve with empty string when user enters nothing', async () => {
      mockQuestion.mockImplementation((_prompt: unknown, cb: unknown) => {
        (cb as (answer: string) => void)('');
      });

      const result = await inputFn('Enter: ');

      expect(result).toBe('');
    });

    it('should resolve with whitespace-only input as-is', async () => {
      mockQuestion.mockImplementation((_prompt: unknown, cb: unknown) => {
        (cb as (answer: string) => void)('   ');
      });

      const result = await inputFn('Enter: ');

      expect(result).toBe('   ');
    });

    it('should handle special characters in user input', async () => {
      mockQuestion.mockImplementation((_prompt: unknown, cb: unknown) => {
        (cb as (answer: string) => void)('hello "world" & more');
      });

      const result = await inputFn('Enter: ');

      expect(result).toBe('hello "world" & more');
    });
  });

  describe('closeInput function', () => {
    it('should call rl.close()', () => {
      closeInputFn();

      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });
});
