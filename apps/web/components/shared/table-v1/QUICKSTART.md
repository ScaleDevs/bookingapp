# ERPTable System - Quick Start Guide

A production-ready table component system for ERP applications built with TanStack Table.

## What Was Created

### Components Created
```
src/components/erp-table/
├── ERPTable.tsx                    # Main table wrapper with TanStack Table
├── ERPTableHeader.tsx              # Header cell component
├── ERPTableRow.tsx                 # Row component with selection state
├── ERPTableCell.tsx                # Cell component
├── ERPTableEmptyState.tsx          # Empty state display
├── ERPTableSkeleton.tsx            # Loading skeleton
├── ERPTableBulkActionBar.tsx       # Floating bulk action bar
├── index.ts                        # Barrel exports
├── README.md                       # Full documentation
└── examples/
    └── ProductsTableExample.tsx    # Advanced example with actions

src/components/ui/
└── checkbox.tsx                    # Radix UI checkbox component
```

### Updated Files
- `src/routes/_mainlayout/_authenticated/customers.tsx` - Updated to use ERPTable

## Design Specifications Met

✅ **Density**: `h-10` row height, `px-4 py-2` cell padding
✅ **Header Style**: `text-xs uppercase tracking-wide text-muted-foreground font-medium`
✅ **Hover State**: `hover:bg-muted/50`
✅ **Selected State**: `data-[state=selected]:bg-primary/5`
✅ **Select-all checkbox** column pattern
✅ **Action column** aligned right
✅ **Bulk action bar** appears when rows selected
✅ **Overflow container**: `overflow-x-auto`

## Quick Usage

### 1. Import Components

```tsx
import { ERPTable } from "@/components/erp-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
```

### 2. Define Your Data Type

```tsx
interface Customer {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  totalOrders: number;
}
```

### 3. Create Column Definitions

```tsx
const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
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
    id: "actions",
    header: "",
    cell: () => <ActionButtons />,
    size: 60,
  },
];
```

### 4. Use the Table

```tsx
<ERPTable
  data={customers}
  columns={columns}
  enableRowSelection
  bulkActions={
    <>
      <Button variant="ghost" size="sm">Export</Button>
      <Button variant="ghost" size="sm">Delete</Button>
    </>
  }
/>
```

## Key Features

### 1. Row Selection
- Built-in checkbox column pattern
- Select all functionality
- Individual row selection
- Tracks selected rows

### 2. Bulk Actions
- Floating action bar at bottom-center
- Only appears when rows are selected
- Shows count of selected items
- Clear selection button

### 3. Loading State
```tsx
<ERPTable
  data={data}
  columns={columns}
  isLoading={true}
  skeletonRows={10}
/>
```

### 4. Empty State
```tsx
<ERPTable
  data={[]}
  columns={columns}
  emptyMessage="No customers found"
  emptyIcon={<UsersIcon />}
/>
```

### 5. Custom Cell Rendering
```tsx
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = row.getValue("status");
    return <StatusBadge status={status} />;
  },
}
```

### 6. Action Columns
```tsx
{
  id: "actions",
  header: "",
  cell: ({ row }) => (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={() => handleEdit(row.original)}>Edit</Button>
      <Button onClick={() => handleDelete(row.original)}>Delete</Button>
    </div>
  ),
  size: 100,
}
```

## Examples

### Basic Table (See customers.tsx)
The `customers.tsx` file shows a basic implementation with:
- Select-all checkbox
- Individual row selection
- Status badges
- Action column
- Bulk actions (Export, Delete)

### Advanced Table (See ProductsTableExample.tsx)
The `ProductsTableExample.tsx` file shows an advanced implementation with:
- Multiple action buttons per row
- Custom cell rendering (price formatting, stock colors)
- Conditional styling based on data
- More complex bulk actions

## Component Props

### ERPTable
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `TData[]` | ✅ | - | Array of data to display |
| `columns` | `ColumnDef<TData>[]` | ✅ | - | Column definitions |
| `isLoading` | `boolean` | ❌ | `false` | Show loading skeleton |
| `emptyMessage` | `string` | ❌ | `"No data available"` | Empty state message |
| `enableRowSelection` | `boolean` | ❌ | `false` | Enable checkbox selection |
| `bulkActions` | `ReactNode` | ❌ | - | Actions for selected rows |
| `onRowSelectionChange` | `(rows: TData[]) => void` | ❌ | - | Selection change callback |

## TanStack Table Features Available

All TanStack Table features are available through column definitions:
- ✅ Sorting
- ✅ Filtering
- ✅ Pagination
- ✅ Row selection
- ✅ Column visibility
- ✅ Column sizing
- ✅ Custom cell rendering
- ✅ Custom header rendering

## Styling Tokens

The table uses your design system tokens:
- `border-border` - Table borders
- `bg-muted/50` - Header background
- `text-muted-foreground` - Secondary text
- `hover:bg-muted/50` - Row hover
- `bg-primary/5` - Selected row
- `h-10` - Row height
- `px-4 py-2` - Cell padding

## Best Practices

1. **Column Sizing**: Use the `size` prop on columns to control widths
   ```tsx
   { accessorKey: "name", header: "Name", size: 200 }
   ```

2. **Disable Sorting/Hiding**: For select and action columns
   ```tsx
   { id: "select", enableSorting: false, enableHiding: false }
   ```

3. **Type Safety**: Always define your data interface
   ```tsx
   interface MyData { id: string; name: string; }
   const columns: ColumnDef<MyData>[] = [...]
   ```

4. **Responsive**: Wrap in a card with border for consistent styling
   ```tsx
   <div className="rounded-lg border border-border bg-card">
     <ERPTable ... />
   </div>
   ```

5. **Loading State**: Always provide a loading state for async data
   ```tsx
   const { data, isLoading } = useQuery(...);
   <ERPTable data={data ?? []} isLoading={isLoading} />
   ```

## Next Steps

1. ✅ Component system is ready to use
2. ✅ Example implementations provided
3. 📖 Read the full documentation in `README.md`
4. 🎨 Customize styles if needed
5. 🚀 Start building your tables!

## Support

- Full documentation: `src/components/erp-table/README.md`
- Basic example: `src/routes/_mainlayout/_authenticated/customers.tsx`
- Advanced example: `src/components/erp-table/examples/ProductsTableExample.tsx`
- TanStack Table docs: https://tanstack.com/table/latest
