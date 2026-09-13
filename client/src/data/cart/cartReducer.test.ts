import { cartReducer, cartSubtotal, cartItemCount, emptyCartState } from "./cartReducer";
import { ICartItem, ProductCategory } from "@/data/models";

const cola: ICartItem = {
  productId: "product-1",
  name: "Coca-cola",
  price: 8,
  quantity: 2,
  category: ProductCategory.SOFT_DRINKS,
};

const beer: ICartItem = {
  productId: "product-2",
  name: "Cerveja",
  price: 12,
  quantity: 1,
  category: ProductCategory.BEERS,
};

describe("cartReducer", () => {
  it("adds a new product as a new line", () => {
    const state = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });

    expect(state.items).toEqual([cola]);
  });

  it("sums quantity instead of duplicating the line when the product already exists", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const withMoreCola = cartReducer(withCola, { type: "ADD_ITEM", item: { ...cola, quantity: 3 } });

    expect(withMoreCola.items).toHaveLength(1);
    expect(withMoreCola.items[0].quantity).toBe(5);
  });

  it("keeps separate lines for different products", () => {
    const state = [cola, beer].reduce(
      (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
      emptyCartState,
    );

    expect(state.items).toHaveLength(2);
  });

  it("removes the line when quantity is set to 0", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const cleared = cartReducer(withCola, { type: "SET_QUANTITY", productId: cola.productId, quantity: 0 });

    expect(cleared.items).toHaveLength(0);
  });

  it("updates the quantity of an existing line", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const updated = cartReducer(withCola, { type: "SET_QUANTITY", productId: cola.productId, quantity: 7 });

    expect(updated.items[0].quantity).toBe(7);
  });

  it("updates the notes of an existing line without touching other fields", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const annotated = cartReducer(withCola, { type: "SET_NOTES", productId: cola.productId, notes: "sem gelo" });

    expect(annotated.items[0]).toEqual({ ...cola, notes: "sem gelo" });
  });

  it("removes a line explicitly", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const removed = cartReducer(withCola, { type: "REMOVE_ITEM", productId: cola.productId });

    expect(removed.items).toHaveLength(0);
  });

  it("clears the whole cart", () => {
    const state = [cola, beer].reduce(
      (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
      emptyCartState,
    );
    const cleared = cartReducer(state, { type: "CLEAR" });

    expect(cleared.items).toHaveLength(0);
  });

  it("hydrates from a persisted list", () => {
    const state = cartReducer(emptyCartState, { type: "HYDRATE", items: [cola, beer] });

    expect(state.items).toEqual([cola, beer]);
  });
});

describe("cartSubtotal", () => {
  it("sums price * quantity across all items", () => {
    const state = [cola, beer].reduce(
      (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
      emptyCartState,
    );

    expect(cartSubtotal(state)).toBe(8 * 2 + 12 * 1);
  });

  it("is zero for an empty cart", () => {
    expect(cartSubtotal(emptyCartState)).toBe(0);
  });
});

describe("cartItemCount", () => {
  it("sums quantities, not the number of distinct lines", () => {
    const state = [cola, beer].reduce(
      (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
      emptyCartState,
    );

    expect(cartItemCount(state)).toBe(3);
  });
});
