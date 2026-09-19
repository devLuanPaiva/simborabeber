import { ICartItem, ICartItemAddon, ICartItemSizeOption } from "@/data/models";

export interface CartState {
    items: ICartItem[];
}

export type CartAction =
    | { type: "ADD_ITEM"; item: ICartItem }
    | { type: "REMOVE_ITEM"; key: string }
    | { type: "SET_QUANTITY"; key: string; quantity: number }
    | { type: "SET_NOTES"; key: string; notes: string }
    | { type: "SET_VARIANT"; key: string; variant: ICartItemSizeOption }
    | { type: "SET_ADDONS"; key: string; addons: ICartItemAddon[] }
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

function setQuantity(items: ICartItem[], key: string, quantity: number): ICartItem[] {
    if (quantity <= 0) {
        return items.filter((i) => cartItemKey(i) !== key);
    }

    return items.map((i) => (cartItemKey(i) === key ? { ...i, quantity } : i));
}

function setVariant(items: ICartItem[], key: string, variant: ICartItemSizeOption): ICartItem[] {
    const item = items.find((i) => cartItemKey(i) === key);
    if (!item) return items;

    const updated: ICartItem = {
        ...item,
        variantId: variant.id,
        variantLabel: variant.label,
        price: variant.price,
        sizeOptions: undefined,
    };

    return upsertItem(items.filter((i) => cartItemKey(i) !== key), updated);
}

/**
 * Addon selection can change from the cart, but the line's price only ever
 * stores the total (base + addons), so the base has to be recovered from the
 * previous snapshot before the new addons total is applied.
 */
function setAddons(items: ICartItem[], key: string, addons: ICartItemAddon[]): ICartItem[] {
    const item = items.find((i) => cartItemKey(i) === key);
    if (!item) return items;

    const oldAddonsTotal = (item.addonsSnapshot ?? []).reduce((sum, a) => sum + a.price, 0);
    const newAddonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const basePrice = item.price - oldAddonsTotal;

    const updated: ICartItem = {
        ...item,
        price: basePrice + newAddonsTotal,
        addonIds: addons.length ? addons.map((a) => a.id) : undefined,
        addonsSnapshot: addons.length ? addons : undefined,
    };

    return upsertItem(items.filter((i) => cartItemKey(i) !== key), updated);
}

function combineItems(items: ICartItem[], primaryKey: string, secondaryKey: string): ICartItem[] {
    if (primaryKey === secondaryKey) return items;

    const primary = items.find((i) => cartItemKey(i) === primaryKey);
    const secondary = items.find((i) => cartItemKey(i) === secondaryKey);

    const canCombine =
        primary &&
        secondary &&
        !primary.extraProductId &&
        !secondary.extraProductId &&
        primary.variantId &&
        primary.variantLabel === secondary.variantLabel &&
        primary.category === secondary.category &&
        primary.productId !== secondary.productId;

    if (!primary || !secondary || !canCombine) return items;

    const combined: ICartItem = {
        ...primary,
        name: `${primary.name} / ${secondary.name}`,
        quantity: 1,
        extraProductId: secondary.productId,
        extraProductName: secondary.name,
    };

    const decremented = decrementOrRemove(decrementOrRemove(items, primaryKey), secondaryKey);
    return upsertItem(decremented, combined);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM":
            return { items: upsertItem(state.items, action.item) };

        case "SET_QUANTITY":
            return { items: setQuantity(state.items, action.key, action.quantity) };

        case "SET_NOTES":
            return {
                items: state.items.map((i) =>
                    cartItemKey(i) === action.key ? { ...i, notes: action.notes } : i,
                ),
            };

        case "SET_VARIANT": {
            const items = setVariant(state.items, action.key, action.variant);
            return items === state.items ? state : { items };
        }

        case "SET_ADDONS": {
            const items = setAddons(state.items, action.key, action.addons);
            return items === state.items ? state : { items };
        }

        case "COMBINE_ITEMS": {
            const items = combineItems(state.items, action.primaryKey, action.secondaryKey);
            return items === state.items ? state : { items };
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
