# ERP Table Component

A comprehensive, production-ready table system built with React, TanStack Table, Tailwind CSS, and shadcn/ui.

## Features

- **Compact Density**: Optimized for ERP use with `h-10` row height
- **Row Selection**: Built-in checkbox selection with bulk actions
- **Responsive**: Horizontal scroll for overflow content
- **Loading States**: Skeleton loader with animated placeholders
- **Empty States**: Customizable empty state with icon and message
- **Bulk Actions**: Floating action bar when rows are selected
- **Type-Safe**: Full TypeScript support with generics
- **Flexible**: Highly customizable with all TanStack Table features

## Installation

The component requires these dependencies (already in your project):

```bash
npm install @tanstack/react-table lucide-react
```

## Basic Usage

```tsx
import { ERPTable } from "@/components/erp-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  totalOrders: number;
}

const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "totalOrders",
    header: "Total Orders",
  },
];

export const CustomersTable = () => {
  const data: Customer[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      totalOrders: 24,
    },
    // ... more data
  ];

  return (
    <ERPTable
      data={data}
      columns={columns}
      enableRowSelection
      bulkActions={
        <>
          <button className="px-3 py-1.5 text-sm">Export</button>
          <button className="px-3 py-1.5 text-sm">Delete</button>
        </>
      }
    />
  );
};
```

## Props

### ERPTable

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | Required | Array of data to display |
| `columns` | `ColumnDef<TData>[]` | Required | Column definitions |
| `isLoading` | `boolean` | `false` | Show skeleton loader |
| `emptyMessage` | `string` | `"No data available"` | Message when no data |
| `emptyIcon` | `ReactNode` | `<FileQuestion />` | Icon for empty state |
| `enableRowSelection` | `boolean` | `false` | Enable row selection |
| `enableMultiRowSelection` | `boolean` | `true` | Allow multiple row selection |
| `onRowSelectionChange` | `(rows: TData[]) => void` | - | Callback when selection changes |
| `bulkActions` | `ReactNode` | - | Actions shown when rows selected |
| `className` | `string` | - | Table element classes |
| `containerClassName` | `string` | - | Container wrapper classes |
| `skeletonRows` | `number` | `5` | Number of skeleton rows |
| `skeletonColumns` | `number` | `columns.length` | Number of skeleton columns |

## Advanced Examples

### With Actions Column

```tsx
const columns: ColumnDef<Customer>[] = [
  // ... other columns
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <button onClick={() => handleEdit(row.original)}>Edit</button>
        <button onClick={() => handleDelete(row.original)}>Delete</button>
      </div>
    ),
    size: 100,
  },
];
```

### With Custom Cell Rendering

```tsx
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.getValue("status") as string;
    return (
      <span
        className={cn(
          "inline-flex px-2 py-1 text-xs font-medium rounded-full",
          status === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
        )}
      >
        {status}
      </span>
    );
  },
}
```

### With Loading State

```tsx
const { data, isLoading } = useQuery({
  queryKey: ["customers"],
  queryFn: fetchCustomers,
});

return (
  <ERPTable
    data={data ?? []}
    columns={columns}
    isLoading={isLoading}
    skeletonRows={10}
  />
);
```

### With Bulk Actions

```tsx
const [selectedRows, setSelectedRows] = useState<Customer[]>([]);

return (
  <ERPTable
    data={data}
    columns={columns}
    enableRowSelection
    onRowSelectionChange={setSelectedRows}
    bulkActions={
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExport(selectedRows)}
        >
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(selectedRows)}
        >
          Delete
        </Button>
      </>
    }
  />
);
```

## Design Specifications

### Density
- Row height: `h-10` (40px)
- Cell padding: `px-4 py-2`
- Compact layout optimized for data-dense views

### Typography
- Header: `text-xs uppercase tracking-wide font-medium`
- Cell: `text-sm`
- All text uses theme-aware colors

### Interactions
- Hover: `hover:bg-muted/50`
- Selected: `data-[state=selected]:bg-primary/5`
- Focus states follow shadcn/ui patterns

### Colors
- Headers: `text-muted-foreground` on `bg-muted/50`
- Borders: `border-border`
- Theme-aware with full dark mode support

## Component Architecture

```
erp-table/
├── ERPTable.tsx              # Main table wrapper with TanStack Table
├── ERPTableHeader.tsx        # Header cell component
├── ERPTableRow.tsx           # Row component with selection state
├── ERPTableCell.tsx          # Cell component
├── ERPTableEmptyState.tsx    # Empty state display
├── ERPTableSkeleton.tsx      # Loading skeleton
├── ERPTableBulkActionBar.tsx # Floating action bar
└── index.ts                  # Exports
```

## Styling Guidelines

The table follows these design principles:

1. **Compact by default**: Optimized for viewing many rows
2. **Consistent spacing**: Uses design system spacing tokens
3. **Theme-aware**: Respects light/dark mode
4. **Accessible**: Proper ARIA labels and keyboard navigation
5. **Responsive**: Horizontal scroll on small screens

## Tips

- Use `size` property on columns to control widths
- Add `enableSorting: false` to columns that shouldn't sort
- Use `enableHiding: false` for required columns like select/actions
- The bulk action bar floats at bottom-center when rows are selected
- All components are fully typed for excellent IDE autocomplete
