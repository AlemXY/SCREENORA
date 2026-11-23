import { DirectoresContenido } from "./DirectoresContenido";

const Directores = () => {
  return (
    <main className="min-h-screen px-6 pb-24 pt-32">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-screenora-violet">
            El talento detrás de cada historia
          </p>

          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Nuestros directores
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Conoce a los creadores que dan vida a algunas de las películas y
            series más destacadas de SCREENORA.
          </p>
        </div>

        <DirectoresContenido />
      </section>
    </main>
  );
};

export default Directores;
