import { Text } from "ink";

interface TerminalLinkProps {
  url: string;
  children: string;
}

export default function TerminalLink({
  url,
  children,
}: TerminalLinkProps) {
  const hyperlink = `\u001B]8;;${url}\u0007${children}\u001B]8;;\u0007`;

  return <Text>{hyperlink}</Text>;
}