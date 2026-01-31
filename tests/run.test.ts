import { jest, describe, it, expect } from '@jest/globals';

// Mock child_process before importing the module that uses it
jest.unstable_mockModule('child_process', () => ({
  execSync: jest.fn(),
}));

describe('run function', () => {
  it('should execute the command', async () => {
    const { execSync } = await import('child_process');
    const { run } = await import('../run');

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    run('git status');
    
    expect(execSync).toHaveBeenCalledWith('git status', { stdio: 'inherit' });
    expect(consoleSpy).toHaveBeenCalledWith('Run command: git status');
    
    consoleSpy.mockRestore();
  });
});
