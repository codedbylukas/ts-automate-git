import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock child_process before importing the module that uses it
const mockExecSync = jest.fn();
jest.unstable_mockModule('child_process', () => ({
  execSync: mockExecSync,
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit called with ${code}`);
});

describe('run function', () => {
  let run: (command: string) => void;
  let consoleLogSpy: ReturnType<typeof jest.spyOn>;
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(async () => {
    const mod = await import('../components/run');
    run = mod.run;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  it('should execute the command using execSync', async () => {
    run('git status');

    expect(mockExecSync).toHaveBeenCalledWith('git status', { stdio: 'inherit' });
  });

  it('should log the command being run', async () => {
    run('git status');

    expect(consoleLogSpy).toHaveBeenCalledWith('Run command: git status');
  });

  it('should execute different commands correctly', async () => {
    run('git add .');

    expect(mockExecSync).toHaveBeenCalledWith('git add .', { stdio: 'inherit' });
    expect(consoleLogSpy).toHaveBeenCalledWith('Run command: git add .');
  });

  it('should handle git commit command with message', async () => {
    run('git commit -m "test message"');

    expect(mockExecSync).toHaveBeenCalledWith('git commit -m "test message"', { stdio: 'inherit' });
    expect(consoleLogSpy).toHaveBeenCalledWith('Run command: git commit -m "test message"');
  });

  it('should handle git push command', async () => {
    run('git push');

    expect(mockExecSync).toHaveBeenCalledWith('git push', { stdio: 'inherit' });
  });

  it('should handle git pull command', async () => {
    run('git pull');

    expect(mockExecSync).toHaveBeenCalledWith('git pull', { stdio: 'inherit' });
  });

  it('should log error and exit with code 1 when execSync throws', async () => {
    const testError = new Error('command failed');
    mockExecSync.mockImplementation(() => { throw testError; });

    expect(() => run('git push')).toThrow('process.exit called with 1');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: git push');
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error details: ${testError}`);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should log the failing command name on error', async () => {
    mockExecSync.mockImplementation(() => { throw new Error('fail'); });

    expect(() => run('git add .')).toThrow('process.exit called with 1');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: git add .');
  });

  it('should still log the command before it fails', async () => {
    mockExecSync.mockImplementation(() => { throw new Error('fail'); });

    expect(() => run('git commit -m "x"')).toThrow();

    expect(consoleLogSpy).toHaveBeenCalledWith('Run command: git commit -m "x"');
  });
});
