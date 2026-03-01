import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock dependencies
jest.unstable_mockModule('../components/input', () => ({
  input: jest.fn(),
}));
jest.unstable_mockModule('../components/run', () => ({
  run: jest.fn(),
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit called with ${code}`);
});

describe('gitInit', () => {
    let inputMock: any;
    let runMock: any;
    let consoleLogSpy: any;
    let consoleErrorSpy: any;

    beforeEach(async () => {
        const inputModule = await import('../components/input');
        inputMock = inputModule.input;
        const runModule = await import('../components/run');
        runMock = runModule.run;
        
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('should run git init when user inputs "y"', async () => {
        inputMock.mockResolvedValue('y');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(inputMock).toHaveBeenCalledWith("Do you want to init it? (y/n) (default: n) ");
        expect(runMock).toHaveBeenCalledWith('git init');
    });

    it('should run git init when user inputs "Y" (uppercase)', async () => {
        inputMock.mockResolvedValue('Y');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(runMock).toHaveBeenCalledWith('git init');
    });

    it('should run git init when user inputs "  y  " (with spaces)', async () => {
        inputMock.mockResolvedValue('  y  ');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(runMock).toHaveBeenCalledWith('git init');
    });

    it('should not run git init when user inputs "n"', async () => {
        inputMock.mockResolvedValue('n');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(inputMock).toHaveBeenCalledWith("Do you want to init it? (y/n) (default: n) ");
        expect(runMock).not.toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith("Okay, I don't init it.");
    });

    it('should not run git init when user inputs "N" (uppercase)', async () => {
        inputMock.mockResolvedValue('N');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(runMock).not.toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith("Okay, I don't init it.");
    });

    it('should not run git init when user inputs empty string (default: n)', async () => {
        inputMock.mockResolvedValue('');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(runMock).not.toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith("Okay, I don't init it.");
    });

    it('should not run git init when user inputs "  " (only whitespace, default: n)', async () => {
        inputMock.mockResolvedValue('  ');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(runMock).not.toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith("Okay, I don't init it.");
    });

    it('should exit process on invalid input', async () => {
        inputMock.mockResolvedValue('invalid');
        const { gitInit } = await import('../components/gitInit');

        await expect(gitInit()).rejects.toThrow('process.exit called');
        
        expect(consoleLogSpy).toHaveBeenCalledWith("Invalid Choice");
    });

    it('should exit process on numeric input', async () => {
        inputMock.mockResolvedValue('123');
        const { gitInit } = await import('../components/gitInit');

        await expect(gitInit()).rejects.toThrow('process.exit called');
        
        expect(consoleLogSpy).toHaveBeenCalledWith("Invalid Choice");
    });

    it('should handle error when input rejects', async () => {
        const error = new Error('input failed');
        inputMock.mockRejectedValue(error);
        const { gitInit } = await import('../components/gitInit');

        await expect(gitInit()).rejects.toThrow('process.exit called with 1');

        expect(consoleErrorSpy).toHaveBeenCalledWith("An error occurred while initializing git:", error);
    });

    it('should call input with the correct prompt text', async () => {
        inputMock.mockResolvedValue('n');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(inputMock).toHaveBeenCalledTimes(1);
        expect(inputMock).toHaveBeenCalledWith("Do you want to init it? (y/n) (default: n) ");
    });
});
