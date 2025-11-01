"use client";
import { createContext, useCallback, useContext, useMemo } from "react";
import { IEstablishment, IEstablishmentContextProps } from "../models";
import { ApiResponse, useAPI } from "../hooks";

export const EstablishmentContext = createContext<IEstablishmentContextProps>(
  {} as IEstablishmentContextProps
);

export function EstablishmentProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { httpGET, httpPOST, httpPATCH, httpDELETE } = useAPI();

  const getEstablishmentsByUser = useCallback(async (): Promise<
    ApiResponse<IEstablishment[]>
  > => {
    return await httpGET<IEstablishment[]>("/establishment/user");
  }, [httpGET]);

  const createEstablishment = useCallback(
    async (
      establishmentData: Partial<IEstablishment>
    ): Promise<ApiResponse<IEstablishment>> => {
      return await httpPOST<IEstablishment>("/establishment", {
        method: "POST",
        body: establishmentData,
      });
    },
    [httpPOST]
  );

  const updateEstablishment = useCallback(
    async (
      id: string,
      establishmentData: Partial<IEstablishment>
    ): Promise<ApiResponse<IEstablishment>> => {
      return await httpPATCH<IEstablishment>(`/establishment/${id}`, {
        method: "PATCH",
        body: establishmentData,
      });
    },
    [httpPATCH]
  );

  const deleteEstablishment = useCallback(
    async (id: string): Promise<ApiResponse<null>> => {
      return await httpDELETE<null>(`/establishment/${id}`);
    },
    [httpDELETE]
  );

  const values = useMemo(
    () => ({
      getEstablishmentsByUser,
      createEstablishment,
      updateEstablishment,
      deleteEstablishment,
    }),
    [
      getEstablishmentsByUser,
      createEstablishment,
      updateEstablishment,
      deleteEstablishment,
    ]
  );

  return (
    <EstablishmentContext.Provider value={values}>
      {children}
    </EstablishmentContext.Provider>
  );
}

export default EstablishmentProvider;

export const useEstablishment = () => useContext(EstablishmentContext);
