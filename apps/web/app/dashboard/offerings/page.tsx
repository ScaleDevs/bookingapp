import { CreateFormRoot } from "@/app/dashboard/offerings/_providers/create-form-root"
import { FiltersProvider } from "@/app/dashboard/offerings/_providers/filters-context"
import { Header } from "@/app/dashboard/offerings/_components/header"
import { Table } from "@/app/dashboard/offerings/_components/table"

export default function Page() {
  return (
    <FiltersProvider>
      <CreateFormRoot>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Header />
              <Table />
            </div>
          </div>
        </div>
      </CreateFormRoot>
    </FiltersProvider>
  )
}
