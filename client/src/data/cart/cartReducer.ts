import { ICartItem } from "@/data/models";

export interface CartState {
    items: ICartItem[];
}

export type CartAction =
    | { type: "ADD_ITEM"; item: ICartItem }
    | { type: "REMOVE_ITEM"; productId: string }
    | { type: "SET_QUANTITY"; productId: string; quantity: number }
    | { type: "SET_NOTES"; productId: string; notes: string }
    | { type: "CLEAR" }
    | { type: "HYDRATE"; items: ICartItem[] };

export const emptyCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const exists = state.items.some((i) => i.productId === action.item.productId);

            if (!exists) {
                return { items: [...state.items, action.item] };
            }

            return {
                items: state.items.map((i) =>
                    i.productId === action.item.productId
                        ? { ...i, quantity: i.quantity + action.item.quantity }
                        : i,
                ),
            };
        }

        case "SET_QUANTITY": {
            if (action.quantity <= 0) {
                return { items: state.items.filter((i) => i.productId !== action.productId) };
            }

            return {
                items: state.items.map((i) =>
                    i.productId === action.productId ? { ...i, quantity: action.quantity } : i,
                ),
            };
        }

        case "SET_NOTES":
            return {
                items: state.items.map((i) =>
                    i.productId === action.productId ? { ...i, notes: action.notes } : i,
                ),
            };

        case "REMOVE_ITEM":
            return { items: state.items.filter((i) => i.productId !== action.productId) };

        case "CLEAR":
            return { items: [] };

        case "HYDRATE":
            return { items: action.items };

        default:
            return state;
    }
}

export function cartSubtotal(state: CartState): number {
    return state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function cartItemCount(state: CartState): number {
    return state.items.reduce((acc, item) => acc + item.quantity, 0);
}
