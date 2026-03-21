/**
 * Node.js child_process module.
 *
 * child_process is heavily substrate-dependent. Class shapes and method
 * signatures are ported; actual process spawning/IPC requires native
 * platform integration and is marked TODO.
 *
 * Baseline: nodejs-clr/src/nodejs/child_process/
 */
import { ChildProcess, ExecOptions } from "./child-process.ts";
import { SpawnSyncReturns } from "./spawn-sync-returns.ts";

export { ChildProcess, ExecOptions } from "./child-process.ts";
export { SpawnSyncReturns } from "./spawn-sync-returns.ts";

// ==================== execSync ====================

/**
 * Synchronous version of exec() that will block until the child process exits.
 * Returns the stdout from the command as a Uint8Array.
 *
 * @param command - The command to run, with space-separated arguments.
 * @returns The stdout from the command.
 */
export const execSync = (
  command: string,
  options?: ExecOptions | null,
): string | Uint8Array => {
  // TODO: substrate-dependent -- requires native process spawning
  void command;
  void options;
  throw new Error("child_process.execSync is not yet implemented (substrate-dependent)");
};

// ==================== spawnSync ====================

/**
 * Synchronous version of spawn() that will block until the child process
 * exits.
 *
 * @param command - The command to run.
 * @param args - List of string arguments.
 * @param options - Options object.
 * @returns SpawnSyncReturns object containing pid, output, stdout, stderr,
 *   status, signal.
 */
export const spawnSync = (
  command: string,
  args?: string[] | null,
  options?: ExecOptions | null,
): SpawnSyncReturns<Uint8Array> => {
  // TODO: substrate-dependent -- requires native process spawning
  void command;
  void args;
  void options;
  throw new Error("child_process.spawnSync is not yet implemented (substrate-dependent)");
};

/**
 * Synchronous version of spawn() that will block until the child process
 * exits. Returns string output when encoding is specified.
 *
 * @param command - The command to run.
 * @param args - List of string arguments.
 * @param options - Options object.
 * @returns SpawnSyncReturns object with string stdout/stderr.
 */
export const spawnSyncString = (
  command: string,
  args?: string[] | null,
  options?: ExecOptions | null,
): SpawnSyncReturns<string> => {
  // TODO: substrate-dependent -- requires native process spawning
  void command;
  void args;
  void options;
  throw new Error("child_process.spawnSyncString is not yet implemented (substrate-dependent)");
};

// ==================== execFileSync ====================

/**
 * Synchronous version of execFile() that spawns the command directly
 * without a shell.
 *
 * @param file - The name or path of the executable file to run.
 * @param args - List of string arguments.
 * @param options - Options object.
 * @returns The stdout from the command (Uint8Array or string depending on
 *   encoding option).
 */
export const execFileSync = (
  file: string,
  args?: string[] | null,
  options?: ExecOptions | null,
): string | Uint8Array => {
  // TODO: substrate-dependent -- requires native process spawning
  void file;
  void args;
  void options;
  throw new Error("child_process.execFileSync is not yet implemented (substrate-dependent)");
};

// ==================== Async Methods ====================

/**
 * Async version of execSync(). Spawns a shell and runs a command within
 * that shell.
 *
 * @param command - The command to run.
 * @param optionsOrCallback - Either options object or callback function.
 * @param callback - Callback function (error, stdout, stderr).
 */
export function exec(
  command: string,
  callback: (error: Error | null, stdout: string, stderr: string) => void,
): void;
export function exec(
  command: string,
  options: ExecOptions | null,
  callback: (error: Error | null, stdout: string, stderr: string) => void,
): void;
export function exec(
  command: string,
  optionsOrCallback:
    | ExecOptions
    | null
    | ((error: Error | null, stdout: string, stderr: string) => void),
  callback?: (error: Error | null, stdout: string, stderr: string) => void,
): void {
  // TODO: substrate-dependent -- requires native process spawning
  void command;
  void optionsOrCallback;
  void callback;
  throw new Error("child_process.exec is not yet implemented (substrate-dependent)");
}

/**
 * Spawns a new process asynchronously using the given command.
 *
 * @param command - The command to run.
 * @param args - List of string arguments.
 * @param options - Options object.
 * @returns ChildProcess instance.
 */
export const spawn = (
  command: string,
  args?: string[] | null,
  options?: ExecOptions | null,
): ChildProcess => {
  // TODO: substrate-dependent -- requires native process spawning
  void command;
  void args;
  void options;
  throw new Error("child_process.spawn is not yet implemented (substrate-dependent)");
};

/**
 * Async version of execFileSync().
 *
 * @param file - The name or path of the executable file to run.
 * @param args - List of string arguments.
 * @param options - Options object.
 * @param callback - Callback function (error, stdout, stderr).
 */
export const execFile = (
  file: string,
  args: string[] | null,
  options: ExecOptions | null,
  callback: (error: Error | null, stdout: string, stderr: string) => void,
): void => {
  // TODO: substrate-dependent -- requires native process spawning
  void file;
  void args;
  void options;
  void callback;
  throw new Error("child_process.execFile is not yet implemented (substrate-dependent)");
};

/**
 * Fork a new Node.js process.
 * Note: This is a simplified implementation that spawns a new process.
 * Full IPC channel support would require additional implementation.
 *
 * @param modulePath - The module to run in the child process.
 * @param args - List of string arguments.
 * @param options - Options object.
 * @returns ChildProcess instance with IPC channel.
 */
export const fork = (
  modulePath: string,
  args?: string[] | null,
  options?: ExecOptions | null,
): ChildProcess => {
  // TODO: substrate-dependent -- requires native process spawning + IPC
  void modulePath;
  void args;
  void options;
  throw new Error("child_process.fork is not yet implemented (substrate-dependent)");
};
