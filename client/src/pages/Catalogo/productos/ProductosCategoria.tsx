import { CONFIG } from "../../../config";
import { useProductos } from "./useProductos";

interface ProductosProps {
  idCategoria: string;
}

export const ProductosCategoria = ({ idCategoria }: ProductosProps) => {
  const { productos, cargando, error, hasProductos, refetch } =
    useProductos(idCategoria);

  if (cargando) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#10152b]"
          >
            <div className="aspect-2/3 animate-pulse bg-white/10" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/5 px-6 py-10 text-center">
        <h3 className="text-lg font-bold text-white">
          No pudimos cargar los contenidos
        </h3>

        <p className="mt-2 text-sm text-white/55">{error}</p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 rounded-full bg-screenora-purple px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-110"
        >
          Volver a intentar
        </button>
      </div>
    );
  }

  if (!hasProductos) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
        <p className="text-lg font-bold text-white">
          No hay contenidos disponibles
        </p>

        <p className="mt-2 text-sm text-white/50">
          Todavía no hay películas o series registradas en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
      {productos.map((producto) => {
        const imagenURL = `${CONFIG.API_URL}${producto.imagen}`;

        return (
          <article
            key={producto._id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#10152b] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-screenora-purple/50 hover:shadow-xl hover:shadow-screenora-purple/10"
          >
            <figure className="relative aspect-2/3 overflow-hidden bg-[#171c35]">
              <img
                src={imagenURL}
                alt={`Póster de ${producto.titulo}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#080b1d]/90 via-transparent to-black/10 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-[#080b1d]/80 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
                {producto.tipo}
              </span>

              <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                {producto.año}
              </span>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-screenora-purple transition-all duration-500 group-hover:w-full" />
            </figure>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-white transition-colors duration-300 group-hover:text-screenora-violet sm:text-lg">
                {producto.titulo}
              </h3>

              <div className="my-3 flex items-center gap-2 border-t border-white/10 pt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-screenora-purple" />

                <span className="text-xs font-medium text-white/50">
                  {producto.tipo}
                </span>

                <span className="ml-auto text-xs font-medium text-white/40">
                  {producto.año}
                </span>
              </div>

              <p className="line-clamp-3 text-sm leading-6 text-white/55">
                {producto.descripcion}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
};
