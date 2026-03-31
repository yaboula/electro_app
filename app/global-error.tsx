"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="flex min-h-dvh items-center justify-center bg-zinc-950 text-white">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold">Erreur Critique</h1>
          <p className="mb-6 text-zinc-400">
            Une erreur inattendue s&apos;est produite. Nos équipes ont été
            notifiées.
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
