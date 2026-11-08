/**
 * Logotipo único de BomberoPro: la gota blanca con la gota amarilla sobre azul marino.
 * Usa el mismo icono de la PWA, el favicon, la vista previa y los correos (public/icons/icon-192.png),
 * para que la marca no se dibuje de dos maneras. No usar iconos de librería como logotipo.
 */
interface Props {
  /** Lado en píxeles (el icono es cuadrado). */
  size?: number;
  className?: string;
}

export default function BrandMark({ size = 40, className = '' }: Props) {
  return (
    <img
      src="/icons/icon-192.png"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      decoding="async"
      className={`shrink-0 rounded-xl ${className}`.trim()}
    />
  );
}
