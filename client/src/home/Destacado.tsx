import {
  useReducer,
  useRef,
  type CSSProperties,
  type TransitionEvent,
} from "react";

import fondoObsession from "../assets/destacado/fondo-obsession.jpg";
import obsession1 from "../assets/destacado/obsession-1.jpg";
import obsession2 from "../assets/destacado/obsession-2.jpg";
import obsession3 from "../assets/destacado/obsession-3.jpg";
import obsession4 from "../assets/destacado/obsession-4.jpg";
import obsession5 from "../assets/destacado/obsession-5.jpg";

import obsessionVideo from "../assets/banner/videos/obsession.mp4";

const imagenes = [obsession1, obsession2, obsession3, obsession4, obsession5];

type Fase = "lista" | "preparando" | "animando" | "reajustando";

type EstadoDestacado = {
  seleccionada: number;
  anterior: number | null;
  inicio: number;
  direccion: -1 | 0 | 1;
  fase: Fase;
  videoIniciado: boolean;
  videoVisible: boolean;
  errorVideo: boolean;
};

type AccionDestacado =
  | {
      type: "CAMBIAR";
      indice: number;
      direccion: -1 | 0 | 1;
    }
  | { type: "ANIMAR" }
  | { type: "FINALIZAR" }
  | { type: "REARMAR" }
  | { type: "INICIAR_VIDEO" }
  | { type: "MOSTRAR_VIDEO" }
  | { type: "DETENER_VIDEO" }
  | { type: "ERROR_VIDEO" };

const estadoInicial: EstadoDestacado = {
  seleccionada: 0,
  anterior: null,
  inicio: 0,
  direccion: 0,
  fase: "lista",
  videoIniciado: false,
  videoVisible: false,
  errorVideo: false,
};

const reducerDestacado = (
  estado: EstadoDestacado,
  accion: AccionDestacado,
): EstadoDestacado => {
  switch (accion.type) {
    case "CAMBIAR":
      return {
        ...estado,
        anterior: estado.seleccionada,
        seleccionada: accion.indice,
        direccion: accion.direccion,
        fase: "preparando",
        videoIniciado: false,
        videoVisible: false,
        errorVideo: false,
      };

    case "ANIMAR":
      return {
        ...estado,
        fase: "animando",
      };

    case "FINALIZAR":
      return {
        ...estado,
        inicio:
          (estado.inicio + estado.direccion + imagenes.length) %
          imagenes.length,
        anterior: null,
        direccion: 0,
        fase: "reajustando",
      };

    case "REARMAR":
      return {
        ...estado,
        fase: "lista",
      };

    case "INICIAR_VIDEO":
      return {
        ...estado,
        videoIniciado: true,
        videoVisible: false,
        errorVideo: false,
      };

    case "MOSTRAR_VIDEO":
      return {
        ...estado,
        videoVisible: true,
      };

    case "DETENER_VIDEO":
      return {
        ...estado,
        videoIniciado: false,
        videoVisible: false,
      };

    case "ERROR_VIDEO":
      return {
        ...estado,
        videoIniciado: false,
        videoVisible: false,
        errorVideo: true,
      };

    default:
      return estado;
  }
};

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 15 6-6 6 6" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const Destacado = () => {
  const [estado, dispatch] = useReducer(reducerDestacado, estadoInicial);

  const videoRef = useRef<HTMLVideoElement>(null);
  const ocupadoRef = useRef(false);
  const temporizadorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const miniaturas = Array.from({ length: 6 }, (_, posicion) => {
    const indice =
      (estado.inicio + posicion - 1 + imagenes.length) % imagenes.length;

    return {
      indice,
      imagen: imagenes[indice],
    };
  });

  const detenerTrailer = () => {
    const video = videoRef.current;

    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    dispatch({ type: "DETENER_VIDEO" });
  };

  const finalizarCambio = () => {
    if (!ocupadoRef.current) {
      return;
    }

    ocupadoRef.current = false;

    if (temporizadorRef.current !== null) {
      clearTimeout(temporizadorRef.current);
      temporizadorRef.current = null;
    }

    dispatch({ type: "FINALIZAR" });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dispatch({ type: "REARMAR" });
      });
    });
  };

  const cambiarImagen = async (indice: number, direccion: -1 | 0 | 1) => {
    if (ocupadoRef.current) {
      return;
    }

    if (indice === estado.seleccionada) {
      detenerTrailer();
      return;
    }

    ocupadoRef.current = true;
    detenerTrailer();

    const imagenNueva = new Image();
    imagenNueva.src = imagenes[indice];

    try {
      await imagenNueva.decode();
    } catch {}

    dispatch({
      type: "CAMBIAR",
      indice,
      direccion,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dispatch({ type: "ANIMAR" });

        temporizadorRef.current = setTimeout(finalizarCambio, 850);
      });
    });
  };

  const siguiente = () => {
    const indice = (estado.seleccionada + 1) % imagenes.length;

    void cambiarImagen(indice, 1);
  };

  const anterior = () => {
    const indice =
      (estado.seleccionada - 1 + imagenes.length) % imagenes.length;

    void cambiarImagen(indice, -1);
  };

  const seleccionarImagen = (indice: number) => {
    void cambiarImagen(indice, 0);
  };

  const terminarTransicion = (evento: TransitionEvent<HTMLImageElement>) => {
    if (
      evento.target === evento.currentTarget &&
      evento.propertyName === "opacity" &&
      estado.fase === "animando"
    ) {
      finalizarCambio();
    }
  };

  const reproducirTrailer = () => {
    if (ocupadoRef.current) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.src = obsessionVideo;
    video.currentTime = 0;

    dispatch({ type: "INICIAR_VIDEO" });

    void video.play().catch(() => {
      dispatch({ type: "ERROR_VIDEO" });
    });
  };

  const mostrarVideo = () => {
    dispatch({ type: "MOSTRAR_VIDEO" });
  };

  const finalizarVideo = () => {
    dispatch({ type: "DETENER_VIDEO" });
  };

  const manejarErrorVideo = () => {
    dispatch({ type: "ERROR_VIDEO" });
  };

  let pasos = 1;

  if (estado.fase === "animando") {
    if (estado.direccion === 1) {
      pasos = 2;
    }

    if (estado.direccion === -1) {
      pasos = 0;
    }
  }

  const estiloPista = {
    "--desplazamiento-horizontal": `calc(-${pasos * 25}% - ${pasos * 2}px)`,

    "--desplazamiento-vertical": `calc(-${(pasos * 100) / 6}% - ${pasos * 2}px)`,

    transition:
      estado.fase === "reajustando"
        ? "none"
        : "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
  } as CSSProperties;

  const imagenBase =
    estado.anterior !== null
      ? imagenes[estado.anterior]
      : imagenes[estado.seleccionada];

  return (
    <section
      className="relative isolate overflow-hidden bg-[#080b1d] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16"
      style={{
        backgroundImage: `url(${fondoObsession})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>
        {`
        .screenora-destacado-miniatura {
          flex: 0 0 calc((100% - 24px) / 4);
        }

        .screenora-destacado-pista {
          transform: translate3d(
            var(--desplazamiento-horizontal),
            0,
            0
          );
        }

        @media (min-width: 768px) {
          .screenora-destacado-miniatura {
            flex: 0 0 auto;
            width: 100%;
          }

          .screenora-destacado-pista {
            transform: translate3d(
              0,
              var(--desplazamiento-vertical),
              0
            );
          }
        }
      `}
      </style>

      <div className="pointer-events-none absolute inset-0 bg-[#080b1d]/65 backdrop-blur-[2px]" />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#080b1d]/80 via-[#080b1d]/65 to-[#080b1d]/45" />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#080b1d] via-transparent to-[#080b1d]/40" />

      <div className="relative z-10 mx-auto max-w-screen-2xl">
        <div className="mb-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-screenora-violet">
            Selección especial
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Destacado en SCREENORA
          </h2>

          <p className="mt-2 text-sm text-white/50">
            Una historia que merece toda tu atención.
          </p>
        </div>

        <div className="grid items-center gap-9 xl:grid-cols-[0.85fr_1.35fr] xl:gap-14">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-screenora-purple/30 bg-screenora-purple/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-screenora-violet" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white sm:text-xs">
                Película destacada
              </span>
            </div>

            <h3 className="text-5xl font-extrabold leading-none tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Obsession
            </h3>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/70 sm:text-sm">
              <span className="rounded-full border border-screenora-purple/30 bg-screenora-purple/10 px-3 py-2 text-white">
                Terror
              </span>

              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">
                Suspenso
              </span>

              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">
                Misterio
              </span>
            </div>

            <p className="mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              Un deseo convierte el amor de Bear en realidad, pero pronto
              descubre que algunas obsesiones tienen un precio aterrador.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                title="Próximamente: ver película completa"
                className="flex cursor-pointer items-center gap-3 rounded-full bg-linear-to-r from-screenora-purple to-screenora-violet px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-screenora-purple/20 transition-all duration-300 hover:-translate-y-1 hover:brightness-110"
              >
                <PlayIcon />
                Ver ahora
              </button>

              <button
                type="button"
                aria-label="Añadir a mi lista"
                title="Próximamente: añadir a mi lista"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:border-screenora-purple/60 hover:bg-white/10"
              >
                <PlusIcon />
              </button>
            </div>

            <div className="mt-9 border-t border-white/10 pt-5">
              <div className="flex items-center gap-3 text-xs text-white/45">
                <span className="font-bold uppercase tracking-wider">
                  Galería de escenas
                </span>

                <span className="h-px flex-1 bg-white/10" />

                <span>
                  {estado.seleccionada + 1} / {imagenes.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_125px] lg:grid-cols-[minmax(0,1fr)_145px]">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
              <img
                src={imagenBase}
                alt={`Escena ${estado.anterior !== null ? estado.anterior + 1 : estado.seleccionada + 1} de Obsession`}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  estado.videoVisible ? "opacity-0" : "opacity-100"
                }`}
              />

              {estado.anterior !== null && (
                <img
                  src={imagenes[estado.seleccionada]}
                  alt={`Escena ${estado.seleccionada + 1} de Obsession`}
                  onTransitionEnd={terminarTransicion}
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover"
                  style={{
                    opacity: estado.fase === "animando" ? 1 : 0,
                    transform:
                      estado.fase === "animando" ? "scale(1)" : "scale(1.045)",
                    transition:
                      "opacity 550ms ease-in-out, transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              )}

              <video
                ref={videoRef}
                controls={estado.videoIniciado}
                playsInline
                preload="none"
                onPlaying={mostrarVideo}
                onEnded={finalizarVideo}
                onError={manejarErrorVideo}
                className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700 ${
                  estado.videoVisible
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              />

              {!estado.videoIniciado && (
                <button
                  type="button"
                  onClick={reproducirTrailer}
                  aria-label="Reproducir tráiler de Obsession"
                  className="absolute left-1/2 top-1/2 z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-black/40 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-screenora-purple sm:h-16 sm:w-16"
                >
                  <PlayIcon />
                </button>
              )}

              {estado.videoIniciado && !estado.videoVisible && (
                <p className="pointer-events-none absolute bottom-4 left-4 z-30 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  Preparando tráiler...
                </p>
              )}

              {estado.errorVideo && (
                <p
                  role="alert"
                  className="absolute bottom-4 left-4 right-4 z-30 rounded-xl border border-red-400/20 bg-black/75 p-3 text-sm text-red-300"
                >
                  No se pudo reproducir el tráiler.
                </p>
              )}
            </div>

            <div className="relative flex min-w-0 items-center rounded-2xl border border-white/10 bg-[#080b1d]/65 px-10 py-3 backdrop-blur-lg md:flex-col md:px-3 md:py-10">
              <button
                type="button"
                onClick={anterior}
                aria-label="Imagen anterior"
                className="absolute left-1 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-screenora-purple md:hidden"
              >
                <ArrowLeftIcon />
              </button>

              <button
                type="button"
                onClick={anterior}
                aria-label="Imagen anterior"
                className="absolute top-2 hidden h-8 w-12 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-white transition-colors hover:bg-screenora-purple md:flex"
              >
                <ArrowUpIcon />
              </button>

              <div className="relative w-full min-w-0 overflow-hidden">
                <div
                  aria-hidden="true"
                  className="invisible flex w-full gap-2 md:flex-col md:gap-3"
                >
                  {[0, 1, 2, 3].map((numero) => (
                    <div
                      key={numero}
                      className="screenora-destacado-miniatura aspect-video"
                    />
                  ))}
                </div>

                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="screenora-destacado-pista flex w-full gap-2 md:flex-col md:gap-3"
                    style={estiloPista}
                  >
                    {miniaturas.map((miniatura, posicion) => (
                      <button
                        key={`${posicion}-${miniatura.indice}`}
                        type="button"
                        onClick={() => seleccionarImagen(miniatura.indice)}
                        aria-label={`Seleccionar escena ${miniatura.indice + 1}`}
                        aria-pressed={estado.seleccionada === miniatura.indice}
                        className={`screenora-destacado-miniatura aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                          estado.seleccionada === miniatura.indice
                            ? "border-screenora-violet opacity-100 shadow-lg shadow-screenora-purple/20"
                            : "border-transparent opacity-50 hover:border-white/40 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={miniatura.imagen}
                          alt={`Escena ${miniatura.indice + 1} de Obsession`}
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={siguiente}
                aria-label="Siguiente imagen"
                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-screenora-purple md:hidden"
              >
                <ArrowRightIcon />
              </button>

              <button
                type="button"
                onClick={siguiente}
                aria-label="Siguiente imagen"
                className="absolute bottom-2 hidden h-8 w-12 cursor-pointer items-center justify-center rounded-lg bg-white/5 text-white transition-colors hover:bg-screenora-purple md:flex"
              >
                <ArrowDownIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destacado;
