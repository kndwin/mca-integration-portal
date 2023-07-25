import { useSchedulerQuery } from "./api";
import { CronTable, columns } from "./components/table";
import { SheetDetails } from "./components/sheet-details";

export function SchedulerRoute() {
  const { data, status } = useSchedulerQuery();
  return (
    <div className="px-8 pt-2">
      <h1 className="text-3xl font-medium mb-6">Scheduler</h1>
      <CronTable columns={columns} data={data ?? []} status={status} />
      <SheetDetails />
    </div>
  );
}
