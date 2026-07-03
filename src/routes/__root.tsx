import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Portfolio Pro — Build a Portfolio That Gets You Hired" },
      {
        name: "description",
        content:
          "Portfolio Pro is the premium platform for designers, developers, photographers and creators to build stunning portfolios in minutes — no code required.",
      },
      { name: "author", content: "Portfolio Pro" },
      { property: "og:title", content: "Portfolio Pro — Build a Portfolio That Gets You Hired" },
      {
        property: "og:description",
        content:
          "Build a beautiful personal website in minutes and showcase your work like a professional.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Portfolio Pro — Build a Portfolio That Gets You Hired" },
      { name: "description", content: "Portfolio Pro is a premium SaaS web application for creators to build stunning professional portfolios." },
      { property: "og:description", content: "Portfolio Pro is a premium SaaS web application for creators to build stunning professional portfolios." },
      { name: "twitter:description", content: "Portfolio Pro is a premium SaaS web application for creators to build stunning professional portfolios." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/37d45cf5-cae5-405f-bd02-49d3e9faeb9b/id-preview-b49cc779--c96f9f83-f389-408b-a1ce-a40b31cb153a.lovable.app-1782521219660.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/37d45cf5-cae5-405f-bd02-49d3e9faeb9b/id-preview-b49cc779--c96f9f83-f389-408b-a1ce-a40b31cb153a.lovable.app-1782521219660.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&display=swap",
      },
    ],


  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>

        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { SoundProvider } from "../lib/sound";
import { ContactProvider } from "../lib/contact-modal";
import { MouseGlow } from "../components/MouseGlow";
import { AuthProvider } from "../lib/auth";
import "../lib/i18n";

import { hydrateLanguage } from "../lib/i18n";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Apply the user's stored language AFTER hydration to avoid SSR/CSR mismatch.
  useEffect(() => {
    hydrateLanguage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SoundProvider>
          <ContactProvider>
            <MouseGlow />
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </ContactProvider>
        </SoundProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
