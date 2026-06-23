import { type ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { TableV1 } from "@/components/shared/table-v1"
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  stock: number
  status: "available" | "low_stock" | "out_of_stock"
}

const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
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
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("sku")}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("category")}</div>
    ),
    size: 120,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number
      return (
        <div className="font-medium">
          ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
      )
    },
    size: 100,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      return (
        <div
          className={cn(
            "font-medium",
            stock === 0
              ? "text-red-600 dark:text-red-400"
              : stock < 10
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-muted-foreground"
          )}
        >
          {stock}
        </div>
      )
    },
    size: 80,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-1 text-xs font-medium",
            status === "available"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : status === "low_stock"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          )}
        >
          {status.replace("_", " ")}
        </span>
      )
    },
    size: 120,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const product = row.original

      const handleView = () => {
        console.log("View product:", product.id)
      }

      const handleEdit = () => {
        console.log("Edit product:", product.id)
      }

      const handleDelete = () => {
        console.log("Delete product:", product.id)
      }

      return (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleView}
            aria-label="View product"
          >
            <IconEye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleEdit}
            aria-label="Edit product"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            aria-label="Delete product"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 150,
  },
]

const mockProducts: Product[] = [
  {
    id: "1",
    sku: "PRD-001",
    name: "Wireless Keyboard",
    category: "Electronics",
    price: 79.99,
    stock: 45,
    status: "available",
  },
  {
    id: "2",
    sku: "PRD-002",
    name: "USB-C Cable",
    category: "Accessories",
    price: 12.99,
    stock: 8,
    status: "low_stock",
  },
  {
    id: "3",
    sku: "PRD-003",
    name: "Laptop Stand",
    category: "Accessories",
    price: 49.99,
    stock: 0,
    status: "out_of_stock",
  },
  {
    id: "4",
    sku: "PRD-004",
    name: "Mechanical Mouse",
    category: "Electronics",
    price: 59.99,
    stock: 120,
    status: "available",
  },
  {
    id: "5",
    sku: "PRD-005",
    name: "Monitor Arm",
    category: "Accessories",
    price: 129.99,
    stock: 15,
    status: "available",
  },
]

export const ProductsTableExample = () => {
  const handleExport = () => {
    console.log("Export products")
  }

  const handleBulkDelete = () => {
    console.log("Delete selected products")
  }

  const handleBulkUpdateStatus = () => {
    console.log("Update status for selected products")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your product inventory
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Product Inventory</h2>
            <Button>Add Product</Button>
          </div>
        </div>

        <TableV1
          data={mockProducts}
          columns={columns}
          enableRowSelection
          bulkActions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkUpdateStatus}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                Update Status
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulkDelete}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                Delete
              </Button>
            </>
          }
        />
      </div>
    </div>
  )
}
