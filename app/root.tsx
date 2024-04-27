import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { getAuthFromRequest } from "./auth/session";
import "./styles.css";

export async function loader({ request }: LoaderFunctionArgs) {
  let auth = await getAuthFromRequest(request);
  return json({ auth });
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/fonts/inter/inter.css?url" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  let { auth } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="mx-auto max-w-xl p-4 lg:max-w-7xl">
        <div>
          <header>
            <div className="flex justify-between items-center lg:pt-1 lg:pb-5">
              <a
                href="https://ryanyogan.com"
                rel="noreferrer"
                target="_blank"
                className="uppercase"
              >
                <span className="text-gray-500">Ryan</span>{" "}
                <span className="font-semibold text-gray-200">Yogan</span>
              </a>
            </div>
            <div className="my-20 lg:my-28">
              <div className="text-center">
                <h1 className="text-5xl font-semibold tracking-tighter text-gray-100 lg:text-7xl">
                  <Link to="/">The Journal</Link>
                </h1>
                <p className="mt-2 tracking-tight text-gray-500 lg:mt-4 lg:text-2xl">
                  Learnings and Doings
                </p>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-3xl">{children}</main>
          <footer className="text-center my-10 w-full max-w-xl p-4 lg:max-w-7xl space-y-1">
            <p className="text-gray-500 text-xs">
              The Journal is my twitter replacement
            </p>
            <p className="text-gray-500 text-xs">
              <a
                href="https://ryanyogan.com"
                target="_blank"
                rel="noreferrer"
                className="text-sky-500"
              >
                www.ryanyogan.com
              </a>
            </p>
            <div className="text-gray-500 text-xs font-medium hover:text-gray-200">
              {auth ? (
                <Form method="post" action="/logout">
                  <button>Logout</button>
                </Form>
              ) : (
                <Link to="/login">login</Link>
              )}
            </div>
          </footer>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <p className="text-3xl">Whoops!</p>

        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} – {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p>{error.message}</p>
        ) : (
          <p>Something happened.</p>
        )}

        <Scripts />
      </body>
    </html>
  );
}
