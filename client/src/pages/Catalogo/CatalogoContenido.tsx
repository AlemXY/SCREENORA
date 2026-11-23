import { CONFIG } from "../../config";
import { useCategorias } from "./useCategorias";
import { ProductosCategoria } from "./productos/ProductosCategoria";

export const CatalogoContenido = () => {
  const {
    categorias,
    cargando,
    error,
    hasCategorias,
    refetch,
    seleccionarCategoria,
    idCategoriaSeleccionada,
    nombreCategoriaSeleccionada,
    totalCategoriaSeleccionada,
  } = useCategorias();

  const categoriaActual =
    categorias.find((categoria) => categoria._id === idCategoriaSeleccionada) ??
    categorias[0];

  if (cargando) {
    return (
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="h-7 w-36 animate-pulse rounded bg-white/10" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>

        <div className="space-y-5">
          <div className="h-40 animate-pulse rounded-3xl bg-white/5" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-2/3 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/5 px-6 py-10 text-center">
        <h2 className="text-lg font-bold text-white">
          No pudimos cargar el catálogo
        </h2>

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

  if (!hasCategorias) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-16 text-center">
        <h2 className="text-lg font-bold text-white">
          No hay categorías registradas
        </h2>

        <p className="mt-2 text-sm text-white/50">
          Próximamente encontrarás nuevas colecciones en SCREENORA.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-10">
      <aside className="h-fit min-w-0 rounded-2xl border border-white/10 bg-[#10152b] p-5 lg:sticky lg:top-24">
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-screenora-purple">
            Descubre contenido
          </p>

          <h2 className="mt-2 text-xl font-extrabold text-white">Categorías</h2>
        </div>

        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-3 lg:mx-0 lg:flex-col lg:overflow-visible lg:pb-0">
          {categorias.map((categoria) => {
            const seleccionada = idCategoriaSeleccionada === categoria._id;

            return (
              <button
                key={categoria._id}
                type="button"
                onClick={() => seleccionarCategoria(categoria._id)}
                aria-pressed={seleccionada}
                className={`group flex w-62.5 shrink-0 items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-300 lg:w-full ${
                  seleccionada
                    ? "border-screenora-purple/60 bg-screenora-purple/10 shadow-lg shadow-screenora-purple/5"
                    : "border-white/5 bg-white/2 hover:border-white/15 hover:bg-white/6"
                }`}
              >
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#171c35]">
                  <img
                    src={`${CONFIG.API_URL}${categoria.foto}`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-bold transition-colors ${
                      seleccionada
                        ? "text-white"
                        : "text-white/75 group-hover:text-white"
                    }`}
                  >
                    {categoria.nombre}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {categoria.total} títulos
                  </p>
                </div>

                <span
                  className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
                    seleccionada
                      ? "bg-screenora-purple text-white"
                      : "bg-white/5 text-white/55"
                  }`}
                >
                  {categoria.total}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="min-w-0">
        <header className="relative isolate mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#10152b] px-6 py-8 sm:px-8 sm:py-9">
          {categoriaActual && (
            <img
              src={`${CONFIG.API_URL}${categoriaActual.foto}`}
              alt=""
              aria-hidden="true"
              className="absolute right-0 top-0 -z-20 h-full w-[65%] object-cover object-center opacity-20"
            />
          )}

          <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#10152b] via-[#10152b]/90 to-[#10152b]/50" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-screenora-violet">
                Explora nuestro catálogo
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                {nombreCategoriaSeleccionada}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
                {categoriaActual?.descripcion ??
                  "Descubre películas y series seleccionadas para ti."}
              </p>
            </div>

            <div className="flex h-fit shrink-0 items-center gap-2 self-start rounded-full border border-white/15 bg-black/20 px-4 py-2 backdrop-blur-md sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-screenora-purple" />
              <span className="text-xs font-bold text-white">
                {totalCategoriaSeleccionada} títulos
              </span>
            </div>
          </div>
        </header>

        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-white sm:text-xl">
            Explorar colección
          </h3>

          <span className="text-xs font-medium text-white/40">
            {totalCategoriaSeleccionada} resultados
          </span>
        </div>

        <ProductosCategoria idCategoria={idCategoriaSeleccionada} />
      </section>
    </div>
  );
};
