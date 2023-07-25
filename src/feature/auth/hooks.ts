import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type Module = "scheduler" | "user-management";
type Session = {
  token: string;
  modules: Module[];
  name: string;
  email: string;
  initials: string;
};

const sessionAtom = atomWithStorage<Session>("session", {} as Session);

export const useSession = () => {
  const [session, setSession] = useAtom(sessionAtom);

  return {
    session,
    setSession,
  };
};
