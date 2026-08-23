import { useEffect, useState } from "react";

export interface TerminalSize {
  columns: number;
  rows: number;
}

function getTerminalSize(): TerminalSize {
  return {
    columns: process.stdout.columns ?? 80,
    rows: process.stdout.rows ?? 24,
  };
}

export function useTerminalSize(): TerminalSize {
  const [size, setSize] = useState<TerminalSize>(getTerminalSize);

  useEffect(() => {
    const handleResize = () => setSize(getTerminalSize());

    process.stdout.on("resize", handleResize);

    return () => {
      process.stdout.off("resize", handleResize);
    };
  }, []);

  return size;
}
