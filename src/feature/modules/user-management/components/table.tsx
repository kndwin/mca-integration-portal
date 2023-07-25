import {
  ColumnDef,
  getSortedRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getFacetedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryParam, JsonParam, StringParam } from "use-query-params";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTable } from "@/components/ui/data-table";
import { DataTableHeader } from "@/components/ui/data-table-header";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  status: "loading" | "error" | "success";
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "role",
    header: "Role",
    size: 50,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <Badge variant={"outline"} className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableHeader column={column} title="Name" />,
  },
  {
    accessorKey: "jobTitle",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Job Title" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableHeader column={column} title="Email" />,
  },
  {
    id: "view-user",
    header: "Action",
    size: 100,
    cell: ({ row }) => {
      const [, setId] = useQueryParam("id", StringParam);
      return (
        <div className="flex justify-end w-full gap-1">
          <Button
            variant={"outline"}
            onClick={() => setId(row.original.id)}
            size="sm"
          >
            View
          </Button>
        </div>
      );
    },
  },
];

export function UserTable<TData, TValue>({
  columns,
  data,
  status,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useQueryParam("filters", JsonParam);
  const [sorting, setSorting] = useQueryParam("sorting", JsonParam);
  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <>
      <div className="w-full flex items-center mb-6 gap-2">
        <Input
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          placeholder="Search..."
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableFacetedFilter
          column={table.getColumn("role")}
          title="Role"
          options={[
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
          ]}
        />
      </div>

      <DataTable
        maxHeight="calc(100vh - 16rem)"
        table={table}
        columns={columns}
        status={status}
      />
    </>
  );
}
