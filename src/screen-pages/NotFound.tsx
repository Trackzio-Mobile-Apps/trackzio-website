import { useRouter } from "next/router";
import { useEffect, type ReactElement, type ReactNode } from "react";
import type { NextPage } from "next";

const NotFound: NextPage & { getLayout?: (page: ReactElement) => ReactNode } = () => {
  const router = useRouter();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", router.asPath);
  }, [router.asPath]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

NotFound.getLayout = (page: ReactElement) => page;

export default NotFound;
