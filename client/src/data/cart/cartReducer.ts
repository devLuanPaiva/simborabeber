import { ICartItem } from "@/data/models";

export interface CartState {
    items: ICartItem[];
}

export type CartAction =
    | { type: "ADD_ITEM"; item: ICartItem }
    | { type: "REMOVE_ITEM"; key: string }
    | { type: "SET_QUANTITY"; key: string; quantity: number }
    | { type: "SET_NOTES"; key: string; notes: string }
    | { type: "CLEAR" }
    | { type: "HYDRATE"; items: ICartItem[] };

export const emptyCartState: CartState = { items: [] };

/**
 * Identifies a distinct cart line. productId alone is not enough once a
 * product can carry a size, a second flavor and add-ons: two pizzas with
 * the same base product but different configurations must stay separate
 * lines, while the exact same configuration should merge quantities.
 */
export function cartItemKey(item: Pick<ICartItem, "productId" | "variantId" | "extraProductId" | "addonIds">): string {
    const addons = item.addonIds?.length ? [...item.addonIds].sort().join(",") : "";
    return [item.productId, item.variantId ?? "", item.extraProductId ?? "", addons].join("|");
}

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const newKey = cartItemKey(action.item);
            const exists = state.items.some((i) => cartItemKey(i) === newKey);

            if (!exists) {
                return { items: [...state.items, action.item] };
            }

            return {
                items: state.items.map((i) =>
                    cartItemKey(i) === newKey
                        ? { ...i, quantity: i.quantity + action.item.quantity }
                        : i,
                ),
            };
        }

        case "SET_QUANTITY": {
            if (action.quantity <= 0) {
                return { items: state.items.filter((i) => cartItemKey(i) !== action.key) };
            }

            return {
                items: state.items.map((i) =>
                    cartItemKey(i) === action.key ? { ...i, quantity: action.quantity } : i,
                ),
            };
        }

        case "SET_NOTES":
            return {
                items: state.items.map((i) =>
                    cartItemKey(i) === action.key ? { ...i, notes: action.notes } : i,
                ),
            };

        case "REMOVE_ITEM":
            return { items: state.items.filter((i) => cartItemKey(i) !== action.key) };

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
