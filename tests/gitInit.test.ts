import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock dependencies
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
    let consoleSpy: any;

    beforeEach(async () => {
        const inputModule = await import('../components/input');
        inputMock = inputModule.input;
        const runModule = await import('../components/run');
        runMock = runModule.run;
        
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should run git init when user inputs "y"', async () => {
        inputMock.mockResolvedValue('y');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(inputMock).toHaveBeenCalledWith("Do you want to init it? (y/n) (default: n) ");
        expect(runMock).toHaveBeenCalledWith('git init');
    });

    it('should not run git init when user inputs "n"', async () => {
        inputMock.mockResolvedValue('n');
        const { gitInit } = await import('../components/gitInit');
        
        await gitInit();

        expect(inputMock).toHaveBeenCalledWith("Do you want to init it? (y/n) (default: n) ");
        expect(runMock).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith("Okay, I don't init it.");
    });

    it('should exit process on invalid input', async () => {
        inputMock.mockResolvedValue('invalid');
        const { gitInit } = await import('../components/gitInit');

        await expect(gitInit()).rejects.toThrow('process.exit called');
        
        expect(consoleSpy).toHaveBeenCalledWith("Invalid Choice");
    });
});
