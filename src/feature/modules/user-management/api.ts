import { useQuery } from "@tanstack/react-query";
import { useEnv } from "@/components/layout";

export const useUsersQuery = () => {
  const [env] = useEnv();
  return useQuery({
    queryKey: ["get-users", env],
    queryFn: async () => {
      const res = await fetch("/api/users?env=" + env);
      const json = await res.json();
      return json;
    },
    select: (data) =>
      data.map((user: any) => ({
        ...user,
        name: user.firstName + " " + user.lastName,
      })),
  });
};
