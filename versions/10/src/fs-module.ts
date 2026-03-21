import type { byte, int } from "@tsonic/core/types.js";
import { DateTimeOffset } from "@tsonic/dotnet/System.js";
import type { DateTime } from "@tsonic/dotnet/System.js";
import {
  Directory,
  DirectoryNotFoundException,
  DirectoryInfo,
  File,
  FileNotFoundException,
  FileInfo,
  Path,
} from "@tsonic/dotnet/System.IO.js";
import { Encoding } from "@tsonic/dotnet/System.Text.js";

const parseEncoding = (value?: string): Encoding => {
  const normalized = value?.toLowerCase() ?? "utf-8";
  switch (normalized) {
    case "utf-8":
    case "utf8":
      return Encoding.UTF8;
    case "ascii":
      return Encoding.ASCII;
    case "utf-16":
    case "utf16":
    case "utf16le":
    case "utf-16le":
    case "ucs2":
    case "ucs-2":
      return Encoding.Unicode;
    case "utf-32":
    case "utf32":
      return Encoding.UTF32;
    case "latin1":
    case "binary":
      return Encoding.Latin1;
    default:
      return Encoding.UTF8;
  }
};

const toUnixMilliseconds = (value: DateTime): number =>
  Number(new DateTimeOffset(value).ToUnixTimeMilliseconds());

const toJsDate = (value: DateTime): Date =>
  new Date(toUnixMilliseconds(value));

const buildFileStats = (info: FileInfo): Stats =>
  new Stats(
    Number(info.Length),
    true,
    false,
    toJsDate(info.LastAccessTime),
    toJsDate(info.LastWriteTime),
    toJsDate(info.CreationTime),
    toJsDate(info.CreationTime)
  );

const buildDirectoryStats = (info: DirectoryInfo): Stats =>
  new Stats(
    0,
    false,
    true,
    toJsDate(info.LastAccessTime),
    toJsDate(info.LastWriteTime),
    toJsDate(info.CreationTime),
    toJsDate(info.CreationTime)
  );

const deleteDirectoryIfExists = (path: string, recursive: boolean): void => {
  if (Directory.Exists(path)) {
    Directory.Delete(path, recursive);
  }
};

export class MkdirOptions {
  public recursive?: boolean;
  public mode?: int;
}

export class Stats {
  public readonly mode: int;
  public readonly atimeMs: number;
  public readonly mtimeMs: number;
  public readonly ctimeMs: number;
  public readonly birthtimeMs: number;

  public constructor(
    public readonly size: number,
    public readonly isFile: boolean,
    public readonly isDirectory: boolean,
    public readonly atime: Date,
    public readonly mtime: Date,
    public readonly ctime: Date,
    public readonly birthtime: Date
  ) {
    this.mode = 0 as int;
    this.atimeMs = atime.getTime();
    this.mtimeMs = mtime.getTime();
    this.ctimeMs = ctime.getTime();
    this.birthtimeMs = birthtime.getTime();
  }

  public IsFile(): boolean {
    return this.isFile;
  }

  public IsDirectory(): boolean {
    return this.isDirectory;
  }

  public IsSymbolicLink(): boolean {
    return false;
  }

  public IsBlockDevice(): boolean {
    return false;
  }

  public IsCharacterDevice(): boolean {
    return false;
  }

  public IsFIFO(): boolean {
    return false;
  }

  public IsSocket(): boolean {
    return false;
  }
}

export const accessSync = (path: string, _mode: int = 0 as int): void => {
  if (!File.Exists(path) && !Directory.Exists(path)) {
    throw new FileNotFoundException(`No such file or directory: ${path}`);
  }
};

export const access = async (
  path: string,
  mode: int = 0 as int
): Promise<void> => {
  accessSync(path, mode);
};

export const appendFileSync = (
  path: string,
  data: string,
  encoding: string = "utf-8"
): void => {
  File.AppendAllText(path, data, parseEncoding(encoding));
};

export const appendFile = async (
  path: string,
  data: string,
  encoding: string = "utf-8"
): Promise<void> => {
  await File.AppendAllTextAsync(path, data, parseEncoding(encoding));
};

export const existsSync = (path: string): boolean =>
  File.Exists(path) || Directory.Exists(path);

export function mkdirSync(path: string): void;
export function mkdirSync(path: string, recursive: boolean): void;
export function mkdirSync(path: string, options: MkdirOptions): void;
export function mkdirSync(
  path: string,
  options?: boolean | MkdirOptions
): void {
  const recursive =
    typeof options === "boolean" ? options : options?.recursive ?? false;
  if (recursive) {
    Directory.CreateDirectory(path);
    return;
  }

  const parent = Path.GetDirectoryName(path);
  if (
    parent !== undefined &&
    parent.length > 0 &&
    !Directory.Exists(parent)
  ) {
    throw new DirectoryNotFoundException(
      `Parent directory does not exist: ${parent}`
    );
  }

  Directory.CreateDirectory(path);
}

export function mkdir(path: string): Promise<void>;
export function mkdir(path: string, recursive: boolean): Promise<void>;
export function mkdir(path: string, options: MkdirOptions): Promise<void>;
export async function mkdir(
  path: string,
  options?: boolean | MkdirOptions
): Promise<void> {
  if (options === undefined) {
    mkdirSync(path);
    return;
  }

  if (typeof options === "boolean") {
    mkdirSync(path, options);
    return;
  }

  mkdirSync(path, options);
}

export function readFileSync(path: string): byte[];
export function readFileSync(path: string, encoding: string): string;
export function readFileSync(path: string, encoding?: string): string | byte[] {
  if (encoding === undefined) {
    return File.ReadAllBytes(path);
  }

  return File.ReadAllText(path, parseEncoding(encoding));
}

export const readFileSyncBytes = (path: string): byte[] =>
  File.ReadAllBytes(path);

export function readFile(path: string): Promise<byte[]>;
export function readFile(path: string, encoding: string): Promise<string>;
export async function readFile(
  path: string,
  encoding?: string
): Promise<string | byte[]> {
  if (encoding === undefined) {
    return await File.ReadAllBytesAsync(path);
  }

  return await File.ReadAllTextAsync(path, parseEncoding(encoding));
}

export const readFileBytes = async (path: string): Promise<byte[]> =>
  await File.ReadAllBytesAsync(path);

export const readdirSync = (path: string): string[] =>
  Directory.GetFileSystemEntries(path)
    .map((entry) => Path.GetFileName(entry) ?? "")
    .filter((entry) => entry.length > 0);

export const readdir = async (path: string): Promise<string[]> =>
  readdirSync(path);

export const realpathSync = (path: string): string => Path.GetFullPath(path);

export const realpath = async (path: string): Promise<string> =>
  realpathSync(path);

export const renameSync = (oldPath: string, newPath: string): void => {
  if (File.Exists(oldPath)) {
    File.Move(oldPath, newPath);
    return;
  }

  if (Directory.Exists(oldPath)) {
    Directory.Move(oldPath, newPath);
    return;
  }

  throw new FileNotFoundException(`No such file or directory: ${oldPath}`);
};

export const rename = async (
  oldPath: string,
  newPath: string
): Promise<void> => {
  renameSync(oldPath, newPath);
};

export const rmSync = (path: string, recursive: boolean = false): void => {
  if (File.Exists(path)) {
    File.Delete(path);
    return;
  }

  deleteDirectoryIfExists(path, recursive);
};

export const rm = async (
  path: string,
  recursive: boolean = false
): Promise<void> => {
  rmSync(path, recursive);
};

export const statSync = (path: string): Stats => {
  const fileInfo = new FileInfo(path);
  if (fileInfo.Exists) {
    return buildFileStats(fileInfo);
  }

  const directoryInfo = new DirectoryInfo(path);
  if (directoryInfo.Exists) {
    return buildDirectoryStats(directoryInfo);
  }

  throw new FileNotFoundException(`No such file or directory: ${path}`);
};

export const stat = async (path: string): Promise<Stats> => statSync(path);

export const unlinkSync = (path: string): void => {
  File.Delete(path);
};

export const unlink = async (path: string): Promise<void> => {
  unlinkSync(path);
};

export const rmdirSync = (path: string, recursive: boolean = false): void => {
  Directory.Delete(path, recursive);
};

export const rmdir = async (
  path: string,
  recursive: boolean = false
): Promise<void> => {
  rmdirSync(path, recursive);
};

export const writeFileSync = (
  path: string,
  data: string,
  encoding: string = "utf-8"
): void => {
  File.WriteAllText(path, data, parseEncoding(encoding));
};

export const writeFile = async (
  path: string,
  data: string,
  encoding: string = "utf-8"
): Promise<void> => {
  await File.WriteAllTextAsync(path, data, parseEncoding(encoding));
};

export const writeFileSyncBytes = (path: string, data: byte[]): void => {
  File.WriteAllBytes(path, data);
};

export const writeFileBytes = async (
  path: string,
  data: byte[]
): Promise<void> => {
  await File.WriteAllBytesAsync(path, data);
};

export class FsPromises {
  public access(path: string, mode: int = 0 as int): Promise<void> {
    return access(path, mode);
  }

  public appendFile(
    path: string,
    data: string,
    encoding: string = "utf-8"
  ): Promise<void> {
    return appendFile(path, data, encoding);
  }

  public mkdir(path: string): Promise<void>;
  public mkdir(path: string, recursive: boolean): Promise<void>;
  public mkdir(path: string, options: MkdirOptions): Promise<void>;
  public mkdir(
    path: string,
    options?: boolean | MkdirOptions
  ): Promise<void> {
    if (options === undefined) {
      return mkdir(path);
    }

    if (typeof options === "boolean") {
      return mkdir(path, options);
    }

    return mkdir(path, options);
  }

  public readFile(path: string): Promise<byte[]>;
  public readFile(path: string, encoding: string): Promise<string>;
  public readFile(
    path: string,
    encoding?: string
  ): Promise<string | byte[]> {
    if (encoding === undefined) {
      return readFile(path);
    }

    return readFile(path, encoding);
  }

  public readFileBytes(path: string): Promise<byte[]> {
    return readFileBytes(path);
  }

  public readdir(path: string): Promise<string[]> {
    return readdir(path);
  }

  public realpath(path: string): Promise<string> {
    return realpath(path);
  }

  public rename(oldPath: string, newPath: string): Promise<void> {
    return rename(oldPath, newPath);
  }

  public rm(path: string, recursive: boolean = false): Promise<void> {
    return rm(path, recursive);
  }

  public rmdir(path: string, recursive: boolean = false): Promise<void> {
    return rmdir(path, recursive);
  }

  public stat(path: string): Promise<Stats> {
    return stat(path);
  }

  public unlink(path: string): Promise<void> {
    return unlink(path);
  }

  public writeFile(
    path: string,
    data: string,
    encoding: string = "utf-8"
  ): Promise<void> {
    return writeFile(path, data, encoding);
  }

  public writeFileBytes(path: string, data: byte[]): Promise<void> {
    return writeFileBytes(path, data);
  }
}

export class FsModuleNamespace {
  public readonly promises: FsPromises = new FsPromises();

  public access(path: string, mode: int = 0 as int): Promise<void> {
    return access(path, mode);
  }

  public accessSync(path: string, mode: int = 0 as int): void {
    return accessSync(path, mode);
  }

  public appendFile(
    path: string,
    data: string,
    encoding: string = "utf-8"
  ): Promise<void> {
    return appendFile(path, data, encoding);
  }

  public appendFileSync(
    path: string,
    data: string,
    encoding: string = "utf-8"
  ): void {
    return appendFileSync(path, data, encoding);
  }

  public existsSync(path: string): boolean {
    return existsSync(path);
  }

  public mkdir(path: string): Promise<void>;
  public mkdir(path: string, recursive: boolean): Promise<void>;
  public mkdir(path: string, options: MkdirOptions): Promise<void>;
  public mkdir(
    path: string,
    options?: boolean | MkdirOptions
  ): Promise<void> {
    if (options === undefined) {
      return mkdir(path);
    }

    if (typeof options === "boolean") {
      return mkdir(path, options);
    }

    return mkdir(path, options);
  }

  public mkdirSync(path: string): void;
  public mkdirSync(path: string, recursive: boolean): void;
  public mkdirSync(path: string, options: MkdirOptions): void;
  public mkdirSync(path: string, options?: boolean | MkdirOptions): void {
    if (options === undefined) {
      return mkdirSync(path);
    }

    if (typeof options === "boolean") {
      return mkdirSync(path, options);
    }

    return mkdirSync(path, options);
  }

  public readFile(path: string): Promise<byte[]>;
  public readFile(path: string, encoding: string): Promise<string>;
  public readFile(
    path: string,
    encoding?: string
  ): Promise<string | byte[]> {
    if (encoding === undefined) {
      return readFile(path);
    }

    return readFile(path, encoding);
  }

  public readFileBytes(path: string): Promise<byte[]> {
    return readFileBytes(path);
  }

  public readFileSync(path: string): byte[];
  public readFileSync(path: string, encoding: string): string;
  public readFileSync(path: string, encoding?: string): string | byte[] {
    if (encoding === undefined) {
      return readFileSync(path);
    }

    return readFileSync(path, encoding);
  }

  public readFileSyncBytes(path: string): byte[] {
    return readFileSyncBytes(path);
  }

  public readdir(path: string): Promise<string[]> {
    return readdir(path);
  }

  public readdirSync(path: string): string[] {
    return readdirSync(path);
  }

  public realpath(path: string): Promise<string> {
    return realpath(path);
  }

  public realpathSync(path: string): string {
    return realpathSync(path);
  }

  public rename(oldPath: string, newPath: string): Promise<void> {
    return rename(oldPath, newPath);
  }

  public renameSync(oldPath: string, newPath: string): void {
    return renameSync(oldPath, newPath);
  }

  public rm(path: string, recursive: boolean = false): Promise<void> {
    return rm(path, recursive);
  }

  public rmSync(path: string, recursive: boolean = false): void {
    return rmSync(path, recursive);
  }

  public rmdir(path: string, recursive: boolean = false): Promise<void> {
    return rmdir(path, recursive);
  }

  public rmdirSync(path: string, recursive: boolean = false): void {
    return rmdirSync(path, recursive);
  }

  public stat(path: string): Promise<Stats> {
    return stat(path);
  }

  public statSync(path: string): Stats {
    return statSync(path);
  }

  public unlink(path: string): Promise<void> {
    return unlink(path);
  }

  public unlinkSync(path: string): void {
    return unlinkSync(path);
  }

  public writeFile(
    path: string,
    data: string,
    encoding: string = "utf-8"
  ): Promise<void> {
    return writeFile(path, data, encoding);
  }

  public writeFileBytes(path: string, data: byte[]): Promise<void> {
    return writeFileBytes(path, data);
  }

  public writeFileSync(
    path: string,
    data: string,
    encoding: string = "utf-8"
  ): void {
    return writeFileSync(path, data, encoding);
  }

  public writeFileSyncBytes(path: string, data: byte[]): void {
    return writeFileSyncBytes(path, data);
  }
}

export const promises: FsPromises = new FsPromises();
export const fs: FsModuleNamespace = new FsModuleNamespace();
