import { useQuery } from "@tanstack/react-query";
import { useEnv } from "@/components/layout";

export const useSchedulerQuery = () => {
  const [env] = useEnv();
  return useQuery({
    queryKey: ["get-schedules", env],
    queryFn: async () => {
      const res = await fetch("/api/scheduler/cron-jobs?env=" + env);
      const json = await res.json();
      return json;
    },
  });
};
