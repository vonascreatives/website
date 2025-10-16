import NextLink from "next/link";
import { ComponentProps } from "react";

export default function Link({ href, ...props }: ComponentProps<"a">) {
  if (!href) return null;
  
  // Check if it's an external link
  const isExternal = href.startsWith("http") || href.startsWith("https");
  
  if (isExternal) {
    return (
      <a
        href={href}
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      />
    );
  }
  
  return (
    <NextLink
      href={href}
      {...props}
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    />
  );
}
