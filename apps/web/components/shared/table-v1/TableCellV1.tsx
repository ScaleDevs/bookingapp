import { flexRender, type Cell } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface TableCellV1Props<TData> {
  cell: Cell<TData, unknown>;
  className?: string;
}

export const TableCellV1 = <TData,>({
  cell,
  className,
}: TableCellV1Props<TData>) => {
  const meta = cell.column.columnDef.meta as
    | { cellClassName?: string }
    | undefined

  return (
    <td className={cn("h-10 px-4 py-2 text-sm", meta?.cellClassName, className)}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
