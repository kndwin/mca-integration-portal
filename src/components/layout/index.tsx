import { SVGProps } from "react";
import { Outlet, Link, useLocation, LinkProps } from "react-router-dom";
import { PersonIcon, ClockIcon } from "@radix-ui/react-icons";
import { QueryParamProvider } from "use-query-params";

import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import queryString from "query-string";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSession, useLogoutMutation } from "@/feature/auth";
import { cx } from "class-variance-authority";
import { atom, useAtom } from "jotai";

export function DashboardLayout() {
  const { session } = useSession();
  const { mutate } = useLogoutMutation();
  return (
    <QueryParamProvider
      adapter={ReactRouter6Adapter}
      options={{
        searchStringToObject: queryString.parse,
        objectToSearchString: queryString.stringify,
      }}
    >
      <nav className="h-full min-h-screen w-60 bg-stone-950 text-stone-50 px-3 flex flex-col gap-2">
        <Logo className="h-10 mx-auto mt-8 mb-6" />
        {session.modules?.includes("scheduler") && (
          <NavLink to="/dashboard/scheduler">
            <ClockIcon />
            Scheduler
          </NavLink>
        )}
        {session.modules?.includes("user-management") && (
          <NavLink to="/dashboard/user-management">
            <PersonIcon />
            User Management
          </NavLink>
        )}
      </nav>
      <div className="flex-1 flex-col">
        <header className="h-24 w-full flex items-center px-8 justify-between">
          <SelectEnvironment />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                  <AvatarFallback>{session.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => mutate()}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <Outlet />
      </div>
    </QueryParamProvider>
  );
}

const envAtom = atom("development");

export const useEnv = () => {
  const [env, setEnv] = useAtom(envAtom);
  return [env, setEnv] as const;
};

function SelectEnvironment() {
  const [env, setEnv] = useEnv();
  return (
    <Select
      value={env ?? "development"}
      onValueChange={(envChange) => setEnv(envChange)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="development">Development</SelectItem>
        <SelectItem value="staging">Staging</SelectItem>
        <SelectItem value="production">Production</SelectItem>
      </SelectContent>
    </Select>
  );
}

function NavLink({ to, children }: LinkProps) {
  const { pathname } = useLocation();

  return (
    <Link
      className={cx(
        "flex gap-2 px-4 py-2 rounded  text-lg items-center",
        "w-full justify-start gap-2 hover:bg-background/10 hover:text-stone-100",
        pathname.includes(to.toString()) &&
          "bg-stone-100 text-stone-900 border-stone-100  hover:bg-stone-100 hover:text-stone-900"
      )}
      to={to}
    >
      {children}
    </Link>
  );
}

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg width={98} height={54} viewBox="0 0 98 54" fill="none" {...props}>
    <path
      fill="#fff"
      d="M61.042 31.823v-20.74L43.642 0v20.883l17.4 10.94ZM62.121 31.823v-20.74L79.521 0v20.883l-17.4 10.94ZM98 11.084v20.739l-17.4-10.94V0L98 11.084ZM25.402 53.502h1.471c.267 0 .44-.202.44-.5V36.426c0-.297-.21-.575-.44-.498l-1.47.498c-.277.106-.44.202-.44.499v16.079c0 .297.182.498.44.498ZM38.562 37.998c-1.938 0-3.552.172-5.138.69v14.315c0 .326-.21.498-.42.498h-1.49c-.238 0-.439-.172-.439-.498V39.196c0-1.457.267-1.889 1.26-2.416 1.29-.662 3.935-1.093 5.349-1.093h.735c.143 0 .41.067.41.498v1.42c0 .23-.057.393-.267.393Z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M63.926 53.99c1.557 0 2.97-.258 3.82-.46 2.025-.556 2.464-1.093 2.455-3.432v-9.502c0-1.553-.058-3.116-1.557-4.008-.85-.537-2.206-.863-4.288-.863-2.674 0-6.226.643-7.172 1.026-.229.096-.334.288-.296.49.048.277.268 1.466.268 1.466.038.192.181.269.296.269.04 0 .084-.01.126-.018l.055-.011c1.203-.326 4.202-.959 6.465-.959 1.29 0 2.11.134 2.674.403 1.031.431 1.089 1.285 1.089 2.349v1.553l-6.618 1.035a75.13 75.13 0 0 1-.226.041l-.076.014c-2.751.494-4.779.858-4.779 5.142 0 5.37 5.234 5.465 7.764 5.465Zm-2.502-8.571 6.437-1.026v6.894c-1.232.46-2.617.661-3.906.661-1.939 0-5.386-.23-5.386-3.547 0-2.417 1.229-2.66 2.53-2.917.108-.021.217-.042.325-.065Z"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      d="M86.703 52.811c0 .297-.172.384-.277.431-.736.365-5.062.758-6.8.758-5.49 0-6.933-2.915-6.933-9.109 0-6.222 1.442-9.137 6.933-9.137 1.738 0 5.644.604 6.389.968a.323.323 0 0 0 .024.015l.009.005.011.007c.102.057.266.15.233.405-.02.134-.22 1.294-.22 1.294-.057.269-.143.46-.535.355-.62-.192-4.24-.892-5.796-.892-3.524 0-4.641 1.688-4.641 6.961 0 5.302 1.117 6.99 4.64 6.99 1.557 0 5.502-.432 6.208-.623.268-.077.478-.03.535.354 0-.01.22 1.017.22 1.218ZM16.426 35.754c3.495 0 5.052 1.956 5.052 5.494l-.02 11.764c0 .298-.171.499-.439.499h-1.47c-.258 0-.44-.201-.44-.499V41.305c-.057-1.994-.783-3.432-2.76-3.432h-1.671c-2.025-.01-2.76.757-2.76 2.943v12.196c0 .298-.172.499-.44.499h-1.47c-.258 0-.44-.201-.44-.499V40.816c0-2.186-.734-2.943-2.788-2.943H5.11c-1.978 0-2.703 1.428-2.76 3.432v11.707c0 .298-.173.499-.44.499H.44c-.259 0-.44-.201-.44-.499V41.248c0-3.538 1.557-5.494 5.052-5.494h1.786c1.776 0 3.065.374 3.896 1.16.83-.796 2.12-1.16 3.896-1.16h1.796ZM46.383 53.501c-.296 0-.525-.2-.61-.527l-4.776-16.261c-.095-.346.086-.595.258-.595h1.767c.296 0 .382.202.44.432l4.402 15.034h.124L52.39 36.55c.057-.23.143-.432.44-.432h1.766c.172 0 .363.269.258.595l-4.775 16.261c-.086.326-.315.527-.611.527h-3.085ZM37.645 3.199c1.995-1.1 3.77-2.08 4.909-3.199v20.883c-2.703 5.312-17.81 11.19-17.81 11.19s-1.5-10.356 1.126-17.547c2.214-6.054 7.5-8.97 11.775-11.327Z"
    />
  </svg>
);

export function IndexPage() {
  return <div>Index Page</div>;
}
