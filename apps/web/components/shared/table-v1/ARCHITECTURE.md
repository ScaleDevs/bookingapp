# ERP Table System Architecture

## Component Hierarchy

```
ERPTable (Main Container)
│
├── <div className="overflow-x-auto">          # Responsive wrapper
│   └── <table>
│       ├── <thead>
│       │   └── <tr>
│       │       └── ERPTableHeader              # Header cells
│       │           • text-xs uppercase
│       │           • text-muted-foreground
│       │           • tracking-wide
│       │
│       └── <tbody>
│           ├── ERPTableRow                     # Data rows
│           │   │   • h-10 height
│           │   │   • hover:bg-muted/50
│           │   │   • data-[state=selected]:bg-primary/5
│           │   │
│           │   └── ERPTableCell                # Data cells
│           │       • px-4 py-2
│           │       • text-sm
│           │
│           ├── ERPTableSkeleton                # Loading state
│           │   • Animated placeholders
│           │   • Configurable rows/columns
│           │
│           └── ERPTableEmptyState              # Empty state
│               • Custom icon
│               • Custom message
│
└── ERPTableBulkActionBar                       # Floating action bar
    • Fixed bottom-center position
    • Shows selected count
    • Custom action buttons
    • Clear selection button
```

## Data Flow

```
1. User Data → ERPTable
   ↓
2. ERPTable initializes TanStack Table
   ↓
3. TanStack Table processes:
   • Column definitions
   • Sorting state
   • Filter state
   • Selection state
   • Pagination state
   ↓
4. ERPTable renders:
   • Headers via ERPTableHeader
   • Rows via ERPTableRow
   • Cells via ERPTableCell
   ↓
5. User interactions trigger:
   • Row selection changes
   • Bulk action callbacks
   • Custom cell actions
```

## State Management

```
ERPTable Internal State:
├── sorting: SortingState
├── columnFilters: ColumnFiltersState
├── columnVisibility: VisibilityState
├── rowSelection: RowSelectionState
└── pagination: PaginationState

All managed by TanStack Table's useReactTable hook
```

## Column Definition Pattern

```tsx
const columns: ColumnDef<TData>[] = [
  // 1. SELECT COLUMN (optional)
  {
    id: "select",
    header: ({ table }) => <Checkbox ... />,
    cell: ({ row }) => <Checkbox ... />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  
  // 2. DATA COLUMNS
  {
    accessorKey: "fieldName",
    header: "Display Name",
    cell: ({ row }) => <CustomCell data={row.getValue("fieldName")} />,
    size: 150, // optional width
  },
  
  // 3. ACTION COLUMN (optional)
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionButtons data={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
];
```

## Style System

### Design Tokens Used
```css
/* Spacing */
h-10          /* Row height (40px) */
px-4 py-2     /* Cell padding */

/* Typography */
text-xs       /* Header text size */
text-sm       /* Cell text size */
uppercase     /* Header text transform */
tracking-wide /* Header letter spacing */
font-medium   /* Header font weight */

/* Colors */
bg-muted/50              /* Header background */
text-muted-foreground    /* Header and secondary text */
border-border            /* All borders */
bg-card                  /* Container background */

/* Interactions */
hover:bg-muted/50                    /* Row hover */
data-[state=selected]:bg-primary/5   /* Selected row */

/* Components */
bg-primary               /* Bulk action bar background */
text-primary-foreground  /* Bulk action bar text */
```

## Component Responsibilities

### ERPTable (Main Component)
- Initialize TanStack Table
- Manage all table state
- Handle row selection
- Coordinate sub-components
- Render bulk action bar

### ERPTableHeader
- Render header cells
- Apply header styling
- Handle column sizing
- Support custom header content

### ERPTableRow
- Render data rows
- Apply row styling
- Handle selection state
- Manage hover states

### ERPTableCell
- Render cell content
- Apply cell styling
- Support custom cell rendering

### ERPTableEmptyState
- Show when no data
- Display custom message/icon
- Span all columns

### ERPTableSkeleton
- Show during loading
- Animate placeholders
- Match column count

### ERPTableBulkActionBar
- Show when rows selected
- Display selection count
- Render custom actions
- Handle clear selection

## Integration Points

### With TanStack Table
```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  // ... more features available
});
```

### With TanStack Query (Example)
```tsx
const { data, isLoading } = useQuery({
  queryKey: ["customers"],
  queryFn: fetchCustomers,
});

<ERPTable
  data={data ?? []}
  columns={columns}
  isLoading={isLoading}
/>
```

### With Form Libraries (Example)
```tsx
const [selectedRows, setSelectedRows] = useState([]);

<ERPTable
  data={data}
  columns={columns}
  enableRowSelection
  onRowSelectionChange={setSelectedRows}
/>

<Button onClick={() => processRows(selectedRows)}>
  Process Selected
</Button>
```

## Extensibility

The system is designed to be extended:

1. **Custom Cell Renderers**: Define in column.cell
2. **Custom Header Renderers**: Define in column.header
3. **Sorting Logic**: Use column.sortingFn
4. **Filtering Logic**: Use column.filterFn
5. **Custom Styling**: Override className props
6. **Additional Features**: All TanStack Table features available

## Performance Considerations

- ✅ Uses React.memo internally where appropriate
- ✅ Efficient re-renders via TanStack Table
- ✅ Supports virtualization (can be added)
- ✅ Pagination built-in
- ✅ Column visibility for large datasets
- ✅ Memoized callbacks

## Accessibility

- ✅ Proper ARIA labels on checkboxes
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ Semantic HTML (table, thead, tbody, tr, th, td)

## Browser Support

Supports all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Dependencies

Required:
- `@tanstack/react-table` - Table logic
- `@radix-ui/react-checkbox` - Checkbox component
- `lucide-react` - Icons
- `tailwindcss` - Styling
- `class-variance-authority` - Variant management
- `clsx` & `tailwind-merge` - Class name utilities

All dependencies already installed in your project.
