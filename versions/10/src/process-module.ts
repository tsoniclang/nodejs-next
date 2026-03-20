import type { int } from "@tsonic/core/types.js";
import { Environment } from "@tsonic/dotnet/System.js";
import { Directory, File, Path } from "@tsonic/dotnet/System.IO.js";
import {
  OSPlatform,
  RuntimeInformation,
} from "@tsonic/dotnet/System.Runtime.InteropServices.js";

const archToNodeName = (value: string): string => {
  const normalized = value.toLowerCase();
  if (
    normalized === "x64" ||
    normalized === "arm64" ||
    normalized === "arm" ||
    normalized === "wasm" ||
    normalized === "s390x"
  ) {
    return normalized;
  }
  if (normalized === "x86") {
    return "ia32";
  }
  return normalized;
};

const platformToNodeName = (): string => {
  if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) {
    return "win32";
  }
  if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX)) {
    return "darwin";
  }
  if (RuntimeInformation.IsOSPlatform(OSPlatform.FreeBSD)) {
    return "freebsd";
  }
  return "linux";
};

const toInt32 = (value: number): int | undefined => {
  if (
    Number.isInteger(value) &&
    value >= -2147483648 &&
    value <= 2147483647
  ) {
    return value as int;
  }

  return undefined;
};

let currentExitCode: int | undefined = undefined;

let currentArgv = Environment.GetCommandLineArgs();
let currentArgv0 = currentArgv.length > 0 ? currentArgv[0] : "";

export const pid = Environment.ProcessId;
export const execPath =
  Environment.ProcessPath ??
  (currentArgv.length > 0 ? Path.GetFullPath(currentArgv[0]) : "");
export const arch = archToNodeName(
  RuntimeInformation.ProcessArchitecture.toString()
);
export const platform = platformToNodeName();
export const version = "v24.0.0-tsonic";

export class ProcessVersions {
  public node: string = "24.0.0";
  public v8: string = "0.0.0";
  public dotnet: string = Environment.Version.ToString();
  public tsonic: string = "0.0.74";
}

const currentVersions = new ProcessVersions();

export const cwd = (): string => Directory.GetCurrentDirectory();

export const chdir = (directory: string): void => {
  if (directory.length === 0) {
    throw new Error("Directory path cannot be null or empty.");
  }

  if (!Directory.Exists(directory)) {
    throw new Error(`Directory not found: ${directory}`);
  }

  Directory.SetCurrentDirectory(directory);
};

export const exit = (code?: int): void => {
  const resolved = code ?? currentExitCode ?? (0 as int);
  Environment.Exit(resolved);
};

const getParentProcessId = (): int => {
  if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows)) {
    return 0 as int;
  }

  const statPath = `/proc/${String(pid)}/stat`;
  if (!File.Exists(statPath)) {
    return 0 as int;
  }

  const stat = File.ReadAllText(statPath);
  const parts = stat.split(" ");
  if (parts.length <= 3) {
    return 0 as int;
  }

  const parsed = Number.parseInt(parts[3] ?? "", 10);
  return toInt32(parsed) ?? (0 as int);
};

export class ProcessModule {
  public get argv(): string[] {
    return currentArgv;
  }

  public set argv(value: string[] | undefined) {
    currentArgv = value ?? [];
  }

  public get argv0(): string {
    return currentArgv0;
  }

  public set argv0(value: string | undefined) {
    currentArgv0 = value ?? "";
  }

  public get pid(): int {
    return pid;
  }

  public get execPath(): string {
    return execPath;
  }

  public get arch(): string {
    return arch;
  }

  public get platform(): string {
    return platform;
  }

  public get ppid(): int {
    return getParentProcessId();
  }

  public get version(): string {
    return version;
  }

  public get versions(): ProcessVersions {
    return currentVersions;
  }

  public get exitCode(): int | undefined {
    return currentExitCode;
  }

  public set exitCode(value: int | undefined) {
    currentExitCode = value;
  }

  public cwd(): string {
    return cwd();
  }

  public chdir(directory: string): void {
    chdir(directory);
  }

  public exit(code?: int): void {
    exit(code);
  }
}

export const process = new ProcessModule();
