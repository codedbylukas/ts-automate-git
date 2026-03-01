import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../components/input', () => ({
  input: jest.fn(),
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit called with ${code}`);
});

describe('gitPushConfig', () => {
    let inputMock: any;
    let consoleLogSpy: any;
    let consoleErrorSpy: any;

    beforeEach(async () => {
        const inputModule = await import('../components/input');
        inputMock = inputModule.input;
        
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('should return true when user inputs "y"', async () => {
        inputMock.mockResolvedValue('y');
        const { gitPushConfig } = await import('../components/gitPush');
        
        const result = await gitPushConfig();

        expect(inputMock).toHaveBeenCalledWith("Do you want to push it after every modifire? (y/n) (default: y) ");
        expect(result).toBe(true);
    });

    it('should return true when user inputs "Y" (uppercase)', async () => {
        inputMock.mockResolvedValue('Y');
        const { gitPushConfig } = await import('../components/gitPush');
        
        const result = await gitPushConfig();

        expect(result).toBe(true);
    });

    it('should return true when user inputs "  y  " (with spaces)', async () => {
        inputMock.mockResolvedValue('  y  ');
        const { gitPushConfig } = await import('../components/gitPush');
        
        const result = await gitPushConfig();

        expect(result).toBe(true);
    });

    it('should return false when user inputs "n"', async () => {
        inputMock.mockResolvedValue('n');
        const { gitPushConfig } = await import('../components/gitPush');
        
        const result = await gitPushConfig();

        expect(inputMock).toHaveBeenCalledWith("Do you want to push it after every modifire? (y/n) (default: y) ");
        expect(result).toBe(false);
    });

    it('should return false when user inputs "N" (uppercase)', async () => {
        inputMock.mockResolvedValue('N');
        const { gitPushConfig } = await import('../components/gitPush');
        
        const result = await gitPushConfig();

        expect(result).toBe(false);
    });

    it('should return false when user inputs "  n  " (with spaces)', async () => {
        inputMock.mockResolvedValue('  n  ');
        const { gitPushConfig } = await import('../components/gitPush');
        
        const result = await gitPushConfig();

        expect(result).toBe(false);
    });

    it('should return true when user inputs empty string (default)', async () => {
        inputMock.mockResolvedValue('');
        const { gitPushConfig } = await import('../components/gitPush');
        
        const result = await gitPushConfig();

        expect(inputMock).toHaveBeenCalledWith("Do you want to push it after every modifire? (y/n) (default: y) ");
        expect(result).toBe(true);
    });

    it('should log the user input', async () => {
        inputMock.mockResolvedValue('y');
        const { gitPushConfig } = await import('../components/gitPush');
        
        await gitPushConfig();

        expect(consoleLogSpy).toHaveBeenCalledWith('y');
    });

    it('should exit process on invalid input', async () => {
        inputMock.mockResolvedValue('invalid');
        const { gitPushConfig } = await import('../components/gitPush');

        await expect(gitPushConfig()).rejects.toThrow('process.exit called');
        
        expect(consoleLogSpy).toHaveBeenCalledWith("Invalid Choice");
    });

    it('should exit process on numeric input', async () => {
        inputMock.mockResolvedValue('123');
        const { gitPushConfig } = await import('../components/gitPush');

        await expect(gitPushConfig()).rejects.toThrow('process.exit called');
        
        expect(consoleLogSpy).toHaveBeenCalledWith("Invalid Choice");
    });

    it('should reject with error when input throws', async () => {
        const error = new Error('input failed');
        inputMock.mockRejectedValue(error);
        const { gitPushConfig } = await import('../components/gitPush');

        await expect(gitPushConfig()).rejects.toEqual(error);

        expect(consoleErrorSpy).toHaveBeenCalledWith("Error: " + error);
    });

    it('should call input exactly once', async () => {
        inputMock.mockResolvedValue('y');
        const { gitPushConfig } = await import('../components/gitPush');
        
        await gitPushConfig();

        expect(inputMock).toHaveBeenCalledTimes(1);
    });
});
