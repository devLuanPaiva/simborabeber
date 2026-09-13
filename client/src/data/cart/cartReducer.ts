import { ICartItem, ICartItemSizeOption } from "@/data/models";

export interface CartState {
    items: ICartItem[];
}

export type CartAction =
    | { type: "ADD_ITEM"; item: ICartItem }
    | { type: "REMOVE_ITEM"; key: string }
    | { type: "SET_QUANTITY"; key: string; quantity: number }
    | { type: "SET_NOTES"; key: string; notes: string }
    | { type: "SET_VARIANT"; key: string; variant: ICartItemSizeOption }
    | { type: "COMBINE_ITEMS"; primaryKey: string; secondaryKey: string }
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

/**
 * Inserts a line, merging its quantity into an existing line with the exact
 * same configuration (same key) instead of duplicating it. Used by ADD_ITEM
 * and by anything that derives a new line from an existing one (choosing a
 * size, combining two flavors) since that can also land on a key that
 * already exists in the cart.
 */
function upsertItem(items: ICartItem[], item: ICartItem): ICartItem[] {
    const key = cartItemKey(item);
    const existingIndex = items.findIndex((i) => cartItemKey(i) === key);

    if (existingIndex === -1) {
        return [...items, item];
    }

    return items.map((i, index) =>
        index === existingIndex ? { ...i, quantity: i.quantity + item.quantity } : i,
    );
}

function decrementOrRemove(items: ICartItem[], key: string): ICartItem[] {
    return items
        .map((i) => (cartItemKey(i) === key ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM":
            return { items: upsertItem(state.items, action.item) };

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

        case "SET_VARIANT": {
            const item = state.items.find((i) => cartItemKey(i) === action.key);
            if (!item) return state;

            const updated: ICartItem = {
                ...item,
                variantId: action.variant.id,
                variantLabel: action.variant.label,
                price: action.variant.price,
                sizeOptions: undefined,
            };

            const withoutOriginal = state.items.filter((i) => cartItemKey(i) !== action.key);
            return { items: upsertItem(withoutOriginal, updated) };
        }

        case "COMBINE_ITEMS": {
            if (action.primaryKey === action.secondaryKey) return state;

            const primary = state.items.find((i) => cartItemKey(i) === action.primaryKey);
            const secondary = state.items.find((i) => cartItemKey(i) === action.secondaryKey);

            const canCombine =
                primary &&
                secondary &&
                !primary.extraProductId &&
                !secondary.extraProductId &&
                primary.variantId &&
                primary.variantLabel === secondary.variantLabel &&
                primary.category === secondary.category &&
                primary.productId !== secondary.productId;

            if (!primary || !secondary || !canCombine) return state;

            const combined: ICartItem = {
                ...primary,
                name: `${primary.name} / ${secondary.name}`,
                quantity: 1,
                extraProductId: secondary.productId,
                extraProductName: secondary.name,
            };

            const decremented = decrementOrRemove(
                decrementOrRemove(state.items, action.primaryKey),
                action.secondaryKey,
            );

            return { items: upsertItem(decremented, combined) };
        }

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
