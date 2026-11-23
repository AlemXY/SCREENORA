import { useQuery } from "@tanstack/react-query";
import { fetchDirectores } from "../../services/directores.service";

export const useDirectores = () =>
  useQuery({
    queryKey: ["directores"],
    queryFn: ({ signal }) => fetchDirectores(signal),
  });
