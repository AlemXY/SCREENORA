export const CONFIG = {
  API_URL: import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://screenora-api.onrender.com",

  ENDPOINTS: {
    DIRECTORES: "/api/directores",
    CATEGORIAS: "/api/categorias",
    PRODUCTOS: "/api/productos",
  },
} as const;
