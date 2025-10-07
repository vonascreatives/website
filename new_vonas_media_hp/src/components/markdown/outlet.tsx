import { PropsWithChildren } from "react";

export default function Outlet({ children, path }: PropsWithChildren & { path?: string }) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {children}
    </div>
  );
}

export function OutletCard({ title, description, href }: { title: string; description?: string; href: string }) {
  return (
    <a
      href={href}
      className="border rounded-md p-4 no-underline flex flex-col gap-0.5 hover:bg-muted/50 transition-colors"
    >
      <h4 className="!my-0 font-semibold">{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground !my-0">{description}</p>
      )}
    </a>
  );
}