import {
  ColumnDef,
  getSortedRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getFacetedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQueryParam, JsonParam, StringParam } from "use-query-params";
import { format, parseISO, differenceInMilliseconds } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVerticalIcon } from "lucide-react";

import { DataTable, type Status } from "@/components/ui/data-table";
import { DataTableHeader } from "@/components/ui/data-table-header";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  status: Status;
}

export type CronJob = {
  id: string;
  createdAt: string;
  email: string;
  status: "active" | "inactive";
};

export const columns: ColumnDef<CronJob>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableHeader column={column} title="Created At" />
    ),
    sortingFn: (a, b) => {
      const date = {
        a: parseISO(a.getValue("createdAt")),
        b: parseISO(b.getValue("createdAt")),
      };
      const diff = differenceInMilliseconds(date.a, date.b);
      return diff;
    },
    cell: ({ row }) => (
      <p>{format(parseISO(row.original.createdAt), "MMM d, yyyy")}</p>
    ),

    size: 200,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableHeader column={column} title="Email" />,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },

    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "outline" : "destructive"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "view-schedule",
    header: "Action",
    size: 100,
    cell: ({ row }) => {
      const [, setId] = useQueryParam("id", StringParam);
      return (
        <div className="flex justify-end w-full gap-1">
          <Button
            variant={"outline"}
            onClick={() => setId(row.original.id)}
            size="xs"
          >
            View
          </Button>
          <Button size="icon" className="h-6 w-6 " variant={"outline"}>
            <MoreVerticalIcon className="h-4" />
          </Button>
        </div>
      );
    },
  },
];

export function CronTable<TData, TValue>({
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
          column={table.getColumn("status")}
          title="Status"
          options={[
            {
              label: "Active",
              value: "active",
            },
            {
              label: "Inactive",
              value: "inactive",
            },
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
