import { type Row } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { TableCellV1 } from "./TableCellV1"

interface TableRowV1Props<TData> {
  row: Row<TData>
  className?: string
}

export const TableRowV1 = <TData,>({
  row,
  className,
}: TableRowV1Props<TData>) => {
  return (
    <tr
      data-state={row.getIsSelected() ? "selected" : undefined}
      className={cn(
        "border-b border-border hover:bg-muted/30 data-[state=selected]:bg-primary/10",
        className
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCellV1 key={cell.id} cell={cell} />
      ))}
    </tr>
  )
}
