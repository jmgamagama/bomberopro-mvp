import React from 'react';
import { ExternalLink } from 'lucide-react';
import { resolverFuente } from '../data/fuentesOficiales';

/** Texto de la fuente y, si es verificable (URL oficial o BOE-A-…), enlace al texto oficial. */
export default function FuenteOficial({ fuente, documento, extra, className }: {
  fuente: string | null | undefined;
  documento?: string | null;
  extra?: string;
  className?: string;
}) {
  const f = resolverFuente(fuente, documento);
  return (
    <span className={className}>
      {f.texto}{extra ?? ''}
      {f.url && (
        <>
          {' '}
          <a href={f.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-indigo-700 underline hover:text-orange-700">
            {f.etiqueta}<ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </>
      )}
    </span>
  );
}
