import {
  seed,
  randUser,
  randPastDate,
  type User,
  randUuid,
  randProductName,
  randJobTitle,
} from "@ngneat/falso";
import { createStore } from "zustand/vanilla";

export type Env = "development" | "staging" | "production";

const initState = (env: Env) => {
  seed(env);
  const users: User[] = arrayOf(100, () => ({
    ...randUser(),
    createdAt: randPastDate(),
    role: Math.random() < 0.9 ? "user" : "admin",
    jobTitle: randJobTitle(),
  }));

  const cronJobs = users.map((u) => ({
    id: randUuid(),
    name: randProductName(),
    userId: u.id,
    status: Math.random() < 0.9 ? "active" : "inactive",
    createdAt: randPastDate(),
    email: u.email,
  }));

  return { users, cronJobs };
};

const arrayOf = (length: number, fn: (index: number) => any) =>
  Array.from({ length }, (_, i) => fn(i));

export const store = createStore(() => ({
  development: initState("development"),
  staging: initState("staging"),
  production: initState("production"),
}));
