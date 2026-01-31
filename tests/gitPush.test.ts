import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../input', () => ({
  input: jest.fn(),
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit called with ${code}`);
});

describe('gitPushConfig', () => {
    let inputMock: any;
    let consoleSpy: any;

    beforeEach(async () => {
        const inputModule = await import('../input');
        inputMock = inputModule.input;
        
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should return true when user inputs "y"', async () => {
        inputMock.mockResolvedValue('y');
        const { gitPushConfig } = await import('../gitPush');
        
        const result = await gitPushConfig();

        expect(inputMock).toHaveBeenCalledWith("Do you want to push it after every modifire? (y/n) (default: y) ");
        expect(result).toBe(true);
    });

    it('should return false when user inputs "n"', async () => {
        inputMock.mockResolvedValue('n');
        const { gitPushConfig } = await import('../gitPush');
        
        const result = await gitPushConfig();

        expect(inputMock).toHaveBeenCalledWith("Do you want to push it after every modifire? (y/n) (default: y) ");
        expect(result).toBe(false);
    });

    it('should return true when user inputs empty string (default)', async () => {
        inputMock.mockResolvedValue('');
        const { gitPushConfig } = await import('../gitPush');
        
        const result = await gitPushConfig();

        expect(inputMock).toHaveBeenCalledWith("Do you want to push it after every modifire? (y/n) (default: y) ");
        expect(result).toBe(true);

    });

    it('should exit process on invalid input', async () => {
        inputMock.mockResolvedValue('invalid');
        const { gitPushConfig } = await import('../gitPush');

        await expect(gitPushConfig()).rejects.toThrow('process.exit called');
        
        expect(consoleSpy).toHaveBeenCalledWith("Invalid Choice");
    });
});
