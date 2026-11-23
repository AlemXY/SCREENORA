import { CatalogoContenido } from "./CatalogoContenido";

const Catalogo = () => {
  return (
    <main className="min-h-screen px-6 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-screenora-violet">
            Tu próxima historia comienza aquí
          </p>

          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Explora nuestro catálogo
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Descubre películas y series organizadas por categorías. Encuentra tu
            próximo contenido favorito en SCREENORA.
          </p>
        </div>

        <CatalogoContenido />
      </section>
    </main>
  );
};

export default Catalogo;
