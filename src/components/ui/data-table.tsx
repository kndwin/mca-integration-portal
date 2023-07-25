import {
  Table as TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type Table, type ColumnDef, flexRender } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { createContext, useContext } from "react";

export type Status = "loading" | "success" | "error";
type DataTableToolbarProps<TData, TValue> = {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  maxHeight?: number | string;
  status?: Status;
};

export function DataTable<TData, TValue>({
  table,
  columns,
  maxHeight = "100%",
  status = "success",
}: DataTableToolbarProps<TData, TValue>) {
  const hasData = table.getRowModel().rows?.length > 0;
  return (
    <Root maxHeight={maxHeight}>
      <Headers table={table} />
      <Body columns={columns} maxHeight={maxHeight}>
        {status === "loading" && <BodyLoading />}
        {status === "success" && hasData && <BodyData table={table} />}
        {status === "success" && !hasData && <BodyEmpty />}
        {status === "error" && <BodyError />}
      </Body>
    </Root>
  );
}

function Root({
  children,
  maxHeight,
}: {
  children: React.ReactNode;
  maxHeight: number | string;
}) {
  return (
    <div
      style={{ maxHeight }}
      className="rounded-md border w-full overflow-auto relative"
    >
      <TableRoot>{children}</TableRoot>
    </div>
  );
}

function Headers<TData>({ table }: { table: Table<TData> }) {
  return (
    <TableHeader className="sticky top-0 bg-background border-b">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                style={{
                  width:
                    header.getSize() !== 150 ? header.getSize() : undefined,
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}

const BodyContext = createContext({ colSpan: 0 });

function Body<TData, TValue>({
  columns,
  children,
  maxHeight,
}: {
  columns: ColumnDef<TData, TValue>[];
  children: React.ReactNode;
  maxHeight: string | number;
}) {
  return (
    <BodyContext.Provider value={{ colSpan: columns.length }}>
      <TableBody style={{ maxHeight }} className="w-full overflow-y-auto">
        {children}
      </TableBody>
    </BodyContext.Provider>
  );
}

function BodyData<TData>({ table }: { table: Table<TData> }) {
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function BodyLoading() {
  const { colSpan } = useContext(BodyContext);
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        <Loader2 className="animate-spin w-4 h-4 m-auto" />
      </TableCell>
    </TableRow>
  );
}

function BodyError() {
  const { colSpan } = useContext(BodyContext);
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="h-24 text-center bg-red-200 dark:bg-red-900 dark:text-red-50"
      >
        Something went wrong with fetching the data
      </TableCell>
    </TableRow>
  );
}

function BodyEmpty() {
  const { colSpan } = useContext(BodyContext);
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        No results
      </TableCell>
    </TableRow>
  );
}
