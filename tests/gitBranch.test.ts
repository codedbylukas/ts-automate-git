import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Track call order for input mock to return different values for sequential calls
let inputCallIndex: number;
let inputReturnValues: string[];

// Mock dependencies
jest.unstable_mockModule('../components/input', () => ({
  input: jest.fn().mockImplementation(() => {
    const value = inputReturnValues[inputCallIndex] ?? '';
    inputCallIndex++;
    return Promise.resolve(value);
  }),
}));

jest.unstable_mockModule('../components/run', () => ({
  run: jest.fn(),
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit called with ${code}`);
});

describe('gitBranch', () => {
  let inputMock: any;
  let runMock: any;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let gitBranch: () => Promise<void>;

  beforeEach(async () => {
    inputCallIndex = 0;
    inputReturnValues = [];

    const inputModule = await import('../components/input');
    inputMock = inputModule.input;
    const runModule = await import('../components/run');
    runMock = runModule.run;
    const branchModule = await import('../components/gitBranch');
    gitBranch = branchModule.gitBranch;

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    inputCallIndex = 0;
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('showBegining output', () => {
    it('should print the branch menu header', async () => {
      inputReturnValues = ['2', 'main'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      try { await gitBranch(); } catch (_) { /* process.exit expected */ }

      expect(consoleLogSpy).toHaveBeenCalledWith('\n--- Git Branch ---');
    });

    it('should print switch and create options', async () => {
      inputReturnValues = ['2', 'main'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      try { await gitBranch(); } catch (_) { /* process.exit expected */ }

      expect(consoleLogSpy).toHaveBeenCalledWith('1. Switch to a branch');
      expect(consoleLogSpy).toHaveBeenCalledWith('2. Create a new branch');
    });
  });

  describe('switchBranch (choice "1")', () => {
    it('should switch to the given branch and show branches', async () => {
      inputReturnValues = ['1', 'feature-x'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      try { await gitBranch(); } catch (_) { /* process.exit expected */ }

      expect(runMock).toHaveBeenCalledWith('git switch feature-x');
      expect(runMock).toHaveBeenCalledWith('git branch');
    });

    it('should print error when branch name is empty', async () => {
      inputReturnValues = ['1', ''];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      await gitBranch();

      expect(consoleLogSpy).toHaveBeenCalledWith('Branch name cannot be empty');
      expect(runMock).not.toHaveBeenCalled();
    });

    it('should print error when branch name is only whitespace', async () => {
      inputReturnValues = ['1', '   '];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      await gitBranch();

      expect(consoleLogSpy).toHaveBeenCalledWith('Branch name cannot be empty');
      expect(runMock).not.toHaveBeenCalled();
    });
  });

  describe('createBranch (choice "2")', () => {
    it('should create a new branch and show branches', async () => {
      inputReturnValues = ['2', 'new-feature'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      try { await gitBranch(); } catch (_) { /* process.exit expected */ }

      expect(runMock).toHaveBeenCalledWith('git switch -c new-feature');
      expect(runMock).toHaveBeenCalledWith('git branch');
    });

    it('should print error when branch name is empty for create', async () => {
      inputReturnValues = ['2', ''];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      await gitBranch();

      expect(consoleLogSpy).toHaveBeenCalledWith('Branch name cannot be empty');
      expect(runMock).not.toHaveBeenCalled();
    });

    it('should print error when branch name is only whitespace for create', async () => {
      inputReturnValues = ['2', '   '];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      await gitBranch();

      expect(consoleLogSpy).toHaveBeenCalledWith('Branch name cannot be empty');
      expect(runMock).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle error when run() throws during switch', async () => {
      inputReturnValues = ['1', 'bad-branch'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });
      runMock.mockImplementation(() => { throw new Error('git switch failed'); });

      await gitBranch();

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    });

    it('should handle error when run() throws during create', async () => {
      inputReturnValues = ['2', 'bad-branch'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });
      runMock.mockImplementation(() => { throw new Error('git switch -c failed'); });

      await gitBranch();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    });

    it('should handle error when input itself rejects', async () => {
      const error = new Error('input failed');
      inputMock.mockRejectedValue(error);

      await expect(gitBranch()).rejects.toEqual(error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ' + error);
    });
  });

  describe('choice input', () => {
    it('should ask for choice with correct prompt', async () => {
      inputReturnValues = ['2', 'test'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      try { await gitBranch(); } catch (_) { /* process.exit expected */ }

      // First call is for the choice
      expect(inputMock).toHaveBeenCalledWith('Enter your choice (1/2) (default: 2): ');
    });

    it('should ask for branch name after choice', async () => {
      inputReturnValues = ['1', 'my-branch'];
      inputMock.mockImplementation(() => {
        const val = inputReturnValues[inputCallIndex] ?? '';
        inputCallIndex++;
        return Promise.resolve(val);
      });

      try { await gitBranch(); } catch (_) { /* process.exit expected */ }

      // Second call is for the branch name
      expect(inputMock).toHaveBeenCalledWith('Enter your branch name: ');
    });
  });
});
