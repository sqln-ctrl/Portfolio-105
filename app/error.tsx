"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { SectionMarker } from "@/components/ui/SectionMarker";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-pad">
      <div className="container-site max-w-2xl">
        <SectionMarker index="!" label="Error" className="mb-4" />
        <h1 className="display-heading mb-4 text-4xl text-paper">
          Something went wrong.
        </h1>
        <p className="mb-10 body-lg">
          An unexpected error occurred while loading this page. You can try again
          or return to the homepage.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md border border-signal bg-signal px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-signal-hover"
          >
            Try again
          </button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
