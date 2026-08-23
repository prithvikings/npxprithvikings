import { spawn } from "node:child_process";

export function openUrl(url: string): void {
  let command: string;
  let args: string[];

  if (process.platform === "win32") {
    command = "cmd.exe";
    args = ["/c", "start", "", url];
  } else if (process.platform === "darwin") {
    command = "open";
    args = [url];
  } else {
    command = "xdg-open";
    args = [url];
  }

  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  child.on("error", (error) => {
    console.error(
      `Failed to open ${url}: ${error.message}`
    );
  });

  child.unref();
}