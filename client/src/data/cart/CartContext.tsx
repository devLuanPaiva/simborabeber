"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { ICartItem } from "@/data/models";
import { cartReducer, cartSubtotal, cartItemCount, emptyCartState } from "./cartReducer";

interface CartContextValue {
    items: ICartItem[];
    subtotal: number;
    itemCount: number;
    addItem: (item: ICartItem) => void;
    removeItem: (key: string) => void;
    setQuantity: (key: string, quantity: number) => void;
    setNotes: (key: string, notes: string) => void;
    clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function storageKey(barSlug: string) {
    return `cart:${barSlug}`;
}

function readFromStorage(barSlug: string): ICartItem[] {
    try {
        const raw = window.localStorage.getItem(storageKey(barSlug));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeToStorage(barSlug: string, items: ICartItem[]) {
    try {
        window.localStorage.setItem(storageKey(barSlug), JSON.stringify(items));
    } catch {
        // localStorage indisponível (modo anônimo, storage bloqueado, etc.) - carrinho segue só em memória.
    }
}

export function CartProvider({ barSlug, children }: Readonly<{ barSlug: string; children: React.ReactNode }>) {
    const [state, dispatch] = useReducer(cartReducer, emptyCartState);
    const hydrated = useRef(false);

    useEffect(() => {
        dispatch({ type: "HYDRATE", items: readFromStorage(barSlug) });
        hydrated.current = true;
    }, [barSlug]);

    useEffect(() => {
        if (!hydrated.current) return;
        writeToStorage(barSlug, state.items);
    }, [barSlug, state.items]);

    const addItem = useCallback((item: ICartItem) => dispatch({ type: "ADD_ITEM", item }), []);
    const removeItem = useCallback((key: string) => dispatch({ type: "REMOVE_ITEM", key }), []);
    const setQuantity = useCallback(
        (key: string, quantity: number) => dispatch({ type: "SET_QUANTITY", key, quantity }),
        [],
    );
    const setNotes = useCallback(
        (key: string, notes: string) => dispatch({ type: "SET_NOTES", key, notes }),
        [],
    );
    const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

    const value = useMemo<CartContextValue>(
        () => ({
            items: state.items,
            subtotal: cartSubtotal(state),
            itemCount: cartItemCount(state),
            addItem,
            removeItem,
            setQuantity,
            setNotes,
            clear,
        }),
        [state, addItem, removeItem, setQuantity, setNotes, clear],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart deve ser usado dentro de um CartProvider");
    }
    return context;
}
