export interface Director {
  _id: string;
  nombre: string;
  obraRelacionada: string;
  tipoProduccion: "Cine" | "Serie" | "Animación";
  imagen: string;
}

export interface RespuestaDirectores {
  success: boolean;
  data: Director[];
}
