import { flexRender, type Header } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface TableHeaderV1Props<TData> {
  header: Header<TData, unknown>;
  className?: string;
}

export const TableHeaderV1 = <TData,>({
  header,
  className,
}: TableHeaderV1Props<TData>) => {
  const meta = header.column.columnDef.meta as
    | { headerClassName?: string }
    | undefined

  return (
    <th
      className={cn(
        "h-10 px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide",
        meta?.headerClassName,
        className,
      )}
      style={{
        width: header.getSize() !== 150 ? header.getSize() : undefined,
      }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  );
};
