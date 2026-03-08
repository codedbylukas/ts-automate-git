import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock child_process before importing the module that uses it
const mockSpawnSync = jest.fn();
jest.unstable_mockModule('child_process', () => ({
  spawnSync: mockSpawnSync,
}));

// Mock process.exit
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
  throw new Error(`process.exit called with ${code}`);
});

describe('run function', () => {
  let run: (command: string, args?: string[]) => void;
  let consoleLogSpy: ReturnType<typeof jest.spyOn>;
  let consoleErrorSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(async () => {
    const mod = await import('../components/run');
    run = mod.run;
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    mockSpawnSync.mockReturnValue({ status: 0 }); // Default successful return
  });

  it('should execute the command using spawnSync', async () => {
    run('git status');

    expect(mockSpawnSync).toHaveBeenCalledWith('git status', [], { stdio: 'inherit', shell: true });
  });

  it('should log the command being run', async () => {
    run('git status');

    expect(consoleLogSpy).toHaveBeenCalledWith('Executing: git status ');
  });

  it('should execute different commands correctly', async () => {
    run('git add .');

    expect(mockSpawnSync).toHaveBeenCalledWith('git add .', [], { stdio: 'inherit', shell: true });
    expect(consoleLogSpy).toHaveBeenCalledWith('Executing: git add . ');
  });

  it('should handle git commit command with message', async () => {
    run('git commit -m "test message"');

    expect(mockSpawnSync).toHaveBeenCalledWith('git commit -m "test message"', [], { stdio: 'inherit', shell: true });
    expect(consoleLogSpy).toHaveBeenCalledWith('Executing: git commit -m "test message" ');
  });

  it('should handle git push command', async () => {
    run('git push');

    expect(mockSpawnSync).toHaveBeenCalledWith('git push', [], { stdio: 'inherit', shell: true });
  });

  it('should handle git pull command', async () => {
    run('git pull');

    expect(mockSpawnSync).toHaveBeenCalledWith('git pull', [], { stdio: 'inherit', shell: true });
  });

  it('should handle commands with arguments array', async () => {
    run('git', ['pull']);

    expect(mockSpawnSync).toHaveBeenCalledWith('git', ['pull'], { stdio: 'inherit', shell: true });
    expect(consoleLogSpy).toHaveBeenCalledWith('Executing: git pull');
  });

  it('should log error and exit with code 1 when spawnSync returns error object', async () => {
    const testError = new Error('command failed');
    mockSpawnSync.mockReturnValue({ error: testError, status: null });

    expect(() => run('git push')).toThrow('process.exit called with 1');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to start command: command failed');
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should log error and exit when command exits with non-zero status', async () => {
    mockSpawnSync.mockReturnValue({ status: 2 });

    expect(() => run('git add .')).toThrow('process.exit called with 2');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Command exited with code: 2');
    expect(mockExit).toHaveBeenCalledWith(2);
  });

  it('should still log the command before it fails', async () => {
    mockSpawnSync.mockReturnValue({ error: new Error('fail'), status: null });

    expect(() => run('git commit -m "x"')).toThrow();

    expect(consoleLogSpy).toHaveBeenCalledWith('Executing: git commit -m "x" ');
  });
});
