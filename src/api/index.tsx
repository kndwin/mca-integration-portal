import { rest } from "msw";
import { setupWorker } from "msw";
import { store, Env } from "./store";

const handlers = [
  rest.post("/api/login", async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (!email.includes("mirvac") && password.length > 2) {
      return res(
        ctx.delay(1000),
        ctx.status(400),
        ctx.json({
          error: "Invalid email or password",
        })
      );
    }

    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        token: "mocked_user_token",
      })
    );
  }),

  rest.get("/api/me", async (req, res, ctx) => {
    // check for authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return res(
        ctx.status(401),
        ctx.json({
          error: "Missing Authorization header",
        })
      );
    }
    return res(
      ctx.status(200),
      ctx.json({
        name: "Kevin Nguyen",
        initials: "KN",
        email: "kevin@mirvac.com",
        modules: ["scheduler", "user-management"],
      })
    );
  }),

  rest.get("/api/scheduler/cron-jobs", async (req, res, ctx) => {
    const env = req.url.searchParams.get("env") ?? "development";
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(store.getState()[env as Env].cronJobs)
    );
  }),

  rest.get("/api/users", async (req, res, ctx) => {
    const env = req.url.searchParams.get("env") ?? "development";
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(store.getState()[env as Env].users)
    );
  }),
];

export const worker = setupWorker(...handlers);
