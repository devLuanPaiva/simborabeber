"use client";
import { ApiResponse, useAPI } from "../hooks";
import { createContext, useCallback, useContext, useMemo } from "react";
import { IUser, IUserContextProps } from "../models";
import { decodeTokenToUser } from "../functions";

export const UserContext = createContext({} as IUserContextProps);

export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { httpGET, httpPOST, httpPATCH, httpDELETE } = useAPI();

  const getUsers = useCallback(async (): Promise<ApiResponse<IUser[]>> => {
    return await httpGET<IUser[]>("/user");
  }, [httpGET]);

  const getUserById = useCallback(
    async (id: string): Promise<ApiResponse<IUser>> => {
      return await httpGET<IUser>(`/user/${id}`);
    },
    [httpGET]
  );

  const createUser = useCallback(
    async (user: Partial<IUser>): Promise<ApiResponse<IUser>> => {
      return await httpPOST<IUser>("/user", {
        method: "POST",
        body: user,
      });
    },
    [httpPOST]
  );

  const updateUser = useCallback(
    async (id: string, user: Partial<IUser>): Promise<ApiResponse<IUser>> => {
      return await httpPATCH<IUser>(`/user/${id}`, {
        method: "PATCH",
        body: user,
      });
    },
    [httpPATCH]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<ApiResponse<null>> => {
      return await httpDELETE<null>(`/user/${id}`);
    },
    [httpDELETE]
  );

  const getCurrentUser = useCallback((): Partial<IUser | null> => {
    let token: string | null = null;
    if (typeof window !== "undefined") {
      token = sessionStorage.getItem("access_token");
    }
    if (token) {
      const userData = decodeTokenToUser(token);
      return userData;
    }
    return {};
  }, []);

  const values = useMemo(
    () => ({
      getUsers,
      getUserById,
      createUser,
      updateUser,
      getCurrentUser,
      deleteUser,
    }),
    [getUsers, getUserById, createUser, updateUser, getCurrentUser, deleteUser]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
export default UserProvider;

export const useUser = () => useContext(UserContext);