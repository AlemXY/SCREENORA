import { Link } from "react-router";

const Pagina404 = () => (
  <main className="flex min-h-[65vh] items-center justify-center px-5 py-20">
    <div className="w-full max-w-2xl text-center">
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-screenora-purple">
        Error 404
      </p>

      <h1 className="mb-5 text-6xl font-extrabold tracking-tight text-white md:text-8xl">
        404
      </h1>

      <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
        Página no encontrada
      </h2>

      <p className="mx-auto mb-9 max-w-lg text-base leading-relaxed text-white/60">
        Parece que el contenido que buscas no está disponible o ha sido
        trasladado. ¡Pero todavía hay mucho por descubrir en SCREENORA!
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-screenora-purple px-7 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:brightness-110"
        >
          Volver al inicio
        </Link>

        <Link
          to="/catalogo"
          className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition-all duration-300 hover:border-screenora-purple hover:bg-white/5"
        >
          Explorar catálogo
        </Link>
      </div>
    </div>
  </main>
);

export default Pagina404;
