import { CONFIG } from "../../config";
import { useDirectores } from "./useDirectores";

export const DirectoresContenido = () => {
  const query = useDirectores();

  if (query.isPending) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#10152b]"
          >
            <div className="aspect-3/4 animate-pulse bg-white/10" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-lg font-bold text-white">
          No pudimos cargar los directores
        </p>
        <p className="mt-2 text-sm text-white/55">{query.error.message}</p>
        <button
          type="button"
          onClick={() => query.refetch()}
          className="mt-6 rounded-full bg-screenora-purple px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110"
        >
          Volver a intentar
        </button>
      </div>
    );
  }

  const directores = query.data ?? [];

  if (directores.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
        <p className="text-lg font-bold text-white">
          No hay directores registrados
        </p>
        <p className="mt-2 text-sm text-white/50">
          Próximamente encontrarás nuevos perfiles en esta sección.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {directores.map((director) => {
        const imagenURL = `${CONFIG.API_URL}${director.imagen}`;

        return (
          <article
            key={director._id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10152b] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-screenora-purple/50 hover:shadow-xl hover:shadow-screenora-purple/10"
          >
            <figure className="relative aspect-3/4 overflow-hidden bg-[#171c35]">
              <img
                src={imagenURL}
                alt={`Fotografía de ${director.nombre}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#080b1d] via-transparent to-black/5 opacity-80" />

              <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-[#080b1d]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {director.tipoProduccion}
              </span>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-screenora-purple transition-all duration-500 group-hover:w-full" />
            </figure>

            <div className="p-4 sm:p-5">
              <h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-white transition-colors duration-300 group-hover:text-screenora-violet sm:text-lg">
                {director.nombre}
              </h2>

              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                  Obra relacionada
                </p>

                <p className="mt-1.5 line-clamp-1 text-sm font-medium text-white/75">
                  {director.obraRelacionada}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
