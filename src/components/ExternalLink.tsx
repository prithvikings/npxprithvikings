import { Text, useInput } from "ink";

import { openUrl } from "../utils/openUrl.js";
import { theme } from "../theme.js";

interface ExternalLinkProps {
  label: string;
  url: string;
  selected: boolean;
}

export default function ExternalLink({
  label,
  url,
  selected,
}: ExternalLinkProps) {
  useInput(
    (_, key) => {
      if (selected && key.return) {
        openUrl(url);
      }
    },
    { isActive: selected }
  );

  return (
    <Text
      color={selected ? theme.primary : undefined}
      bold={selected}
    >
      {selected ? "❯ " : "  "}
      {label}
    </Text>
  );
}