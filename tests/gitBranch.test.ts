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

// Mock process.exit to do nothing instead of throwing, so it doesn't crash the Jest worker
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  return undefined as never; // Keep execution going to avoid unhandled rejections
});

// Helper to wait for the unawaited async events (because gitBranch doesn't await switchBranch/createBranch)
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 10));

describe('gitBranch', () => {
  let inputMock: any;
  let runMock: any;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let gitBranch: (pushing: boolean) => Promise<void>;

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
      await gitBranch(false);
      await flushPromises();

      expect(consoleLogSpy).toHaveBeenCalledWith('\n--- Git Branch ---');
    });

    it('should print switch and create options', async () => {
      inputReturnValues = ['2', 'main'];
      await gitBranch(false);
      await flushPromises();

      expect(consoleLogSpy).toHaveBeenCalledWith('1. Switch to a branch');
      expect(consoleLogSpy).toHaveBeenCalledWith('2. Create a new branch');
    });
  });

  describe('switchBranch (choice "1")', () => {
    it('should switch to the given branch and show branches', async () => {
      inputReturnValues = ['1', 'feature-x'];
      await gitBranch(false);
      await flushPromises();

      expect(runMock).toHaveBeenCalledWith('git switch feature-x');
      expect(runMock).toHaveBeenCalledWith('git branch');
      expect(mockExit).toHaveBeenCalledWith(); // it exits with no args on success
    });

    it('should print error when branch name is empty', async () => {
      inputReturnValues = ['1', ''];
      await gitBranch(false);
      await flushPromises();

      expect(consoleLogSpy).toHaveBeenCalledWith('Branch name cannot be empty');
      expect(runMock).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1); // it exits with 1 on invalid branch
    });

    it('should block switching to main or master branch', async () => {
      inputReturnValues = ['1', 'main'];
      await gitBranch(false);
      await flushPromises();

      expect(consoleLogSpy).toHaveBeenCalledWith('You cannot switch to main or master branch');
      expect(runMock).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should block special characters', async () => {
      inputReturnValues = ['1', 'test&&run'];
      await gitBranch(false);
      await flushPromises();

      expect(consoleLogSpy).toHaveBeenCalledWith('Invalid branch name. Please avoid using special characters.');
      expect(runMock).not.toHaveBeenCalled();
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('createBranch (choice "2")', () => {
    it('should create a new branch and show branches', async () => {
      inputReturnValues = ['2', 'new-feature'];
      await gitBranch(false);
      await flushPromises();

      expect(runMock).toHaveBeenCalledWith('git switch -c new-feature');
      expect(runMock).toHaveBeenCalledWith('git branch');
      expect(mockExit).toHaveBeenCalledWith();
    });

    it('should push if pushing is true', async () => {
      inputReturnValues = ['2', 'new-feature'];
      await gitBranch(true); // pass true for pushing
      await flushPromises();

      expect(runMock).toHaveBeenCalledWith('git switch -c new-feature');
      expect(runMock).toHaveBeenCalledWith('git push -u origin new-feature');
      expect(runMock).toHaveBeenCalledWith('git branch');
    });

    it('should print error when branch name is empty for create', async () => {
      inputReturnValues = ['2', ''];
      await gitBranch(false);
      await flushPromises();

      expect(consoleLogSpy).toHaveBeenCalledWith('Branch name cannot be empty');
      expect(runMock).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle error when run() throws during switch', async () => {
      inputReturnValues = ['1', 'bad-branch'];
      runMock.mockImplementation(() => { throw new Error('git switch failed'); });
      await gitBranch(false);
      await flushPromises();

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error IN SWITCH BRANCH FILE:'));
    });

    it('should handle error when run() throws during create', async () => {
      inputReturnValues = ['2', 'bad-branch'];
      runMock.mockImplementation(() => { throw new Error('git switch -c failed'); });
      await gitBranch(false);
      await flushPromises();

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error:'));
    });

    it('should handle error when input itself rejects in outer gitBranch scope', async () => {
      const error = new Error('input failed');
      inputMock.mockRejectedValueOnce(error);

      await expect(gitBranch(false)).rejects.toEqual(error);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error IN GIT BRANCH FILE:'));
    });
  });

  describe('choice input', () => {
    it('should ask for choice with correct prompt', async () => {
      inputReturnValues = ['2', 'test'];
      await gitBranch(false);
      await flushPromises();

      expect(inputMock).toHaveBeenCalledWith('Enter your choice (1/2) (default: 2): ');
    });

    it('should ask for branch name after choice', async () => {
      inputReturnValues = ['1', 'my-branch'];
      await gitBranch(false);
      await flushPromises();

      expect(inputMock).toHaveBeenCalledWith('Enter your branch name: ');
    });
  });
});
