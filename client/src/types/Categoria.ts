export interface Categoria {
  _id: string;
  nombre: string;
  descripcion: string;
  foto: string;
  total: number;
}

export interface RespuestaCategorias {
  success: boolean;
  data: Categoria[];
}
