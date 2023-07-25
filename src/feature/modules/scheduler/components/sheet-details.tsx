import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQueryParam, StringParam } from "use-query-params";
import { Badge } from "@/components/ui/badge";

import { useSchedulerQuery } from "../api";

export function SheetDetails() {
  const [id, setId] = useQueryParam("id", StringParam);

  const { data } = useSchedulerQuery();

  const cronJob = data?.find((job: any) => job.id === id);

  return (
    <Sheet open={Boolean(id)} onOpenChange={() => setId(undefined)}>
      <SheetContent className="w-[400px]">
        <SheetHeader>
          <SheetTitle>
            {cronJob?.createdAt}
            <Badge className="w-fit capitalize" variant={"outline"}>
              {cronJob?.status}
            </Badge>
          </SheetTitle>
        </SheetHeader>
        <p>{cronJob?.email}</p>
      </SheetContent>
    </Sheet>
  );
}
