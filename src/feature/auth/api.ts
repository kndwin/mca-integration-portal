import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LoginValues } from ".";
import { useSession } from "./hooks";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const { setSession } = useSession();
  return useMutation({
    mutationFn: async (params: LoginValues) => {
      const loginRes = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(params),
      });

      const { token } = await loginRes.json();

      const meRes = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const me = await meRes.json();

      return { token, ...me };
    },

    onSuccess: (res) => {
      setSession(res);
      navigate("/dashboard");
    },
  });
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const { setSession } = useSession();
  return useMutation({
    mutationFn: async () => {
      setSession({} as any);
    },
    onSuccess: () => {
      navigate("/");
    },
  });
};
