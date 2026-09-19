import { cartReducer, cartSubtotal, cartItemCount, cartItemKey, emptyCartState } from "./cartReducer";
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

const pizzaGCalabresa: ICartItem = {
  productId: "product-3",
  name: "Calabresa (G)",
  price: 45.9,
  quantity: 1,
  category: ProductCategory.PIZZA,
  variantId: "variant-g",
  variantLabel: "G",
};

const pizzaMCalabresa: ICartItem = {
  ...pizzaGCalabresa,
  name: "Calabresa (M)",
  price: 35.9,
  variantId: "variant-m",
  variantLabel: "M",
};

const pizzaGCalabresaComBorda: ICartItem = {
  ...pizzaGCalabresa,
  name: "Calabresa (G) + Borda Catupiry",
  price: 53.9,
  addonIds: ["addon-1"],
  addonsSnapshot: [{ id: "addon-1", name: "Borda Catupiry", price: 8 }],
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
    const cleared = cartReducer(withCola, { type: "SET_QUANTITY", key: cartItemKey(cola), quantity: 0 });

    expect(cleared.items).toHaveLength(0);
  });

  it("updates the quantity of an existing line", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const updated = cartReducer(withCola, { type: "SET_QUANTITY", key: cartItemKey(cola), quantity: 7 });

    expect(updated.items[0].quantity).toBe(7);
  });

  it("updates the notes of an existing line without touching other fields", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const annotated = cartReducer(withCola, { type: "SET_NOTES", key: cartItemKey(cola), notes: "sem gelo" });

    expect(annotated.items[0]).toEqual({ ...cola, notes: "sem gelo" });
  });

  it("removes a line explicitly", () => {
    const withCola = cartReducer(emptyCartState, { type: "ADD_ITEM", item: cola });
    const removed = cartReducer(withCola, { type: "REMOVE_ITEM", key: cartItemKey(cola) });

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

  describe("pizza configurations (size, second flavor, add-ons)", () => {
    it("keeps different sizes of the same product as separate lines", () => {
      const state = [pizzaGCalabresa, pizzaMCalabresa].reduce(
        (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
        emptyCartState,
      );

      expect(state.items).toHaveLength(2);
    });

    it("keeps the same size with different add-ons as separate lines", () => {
      const state = [pizzaGCalabresa, pizzaGCalabresaComBorda].reduce(
        (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
        emptyCartState,
      );

      expect(state.items).toHaveLength(2);
    });

    it("merges quantity when the exact same configuration is added again", () => {
      const state = [pizzaGCalabresaComBorda, { ...pizzaGCalabresaComBorda, quantity: 2 }].reduce(
        (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
        emptyCartState,
      );

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it("treats add-on order as irrelevant when matching configurations", () => {
      const sameAddonsDifferentOrder = { ...pizzaGCalabresaComBorda, addonIds: ["addon-2", "addon-1"] };
      const state = cartReducer(
        cartReducer(emptyCartState, { type: "ADD_ITEM", item: { ...pizzaGCalabresaComBorda, addonIds: ["addon-1", "addon-2"] } }),
        { type: "ADD_ITEM", item: sameAddonsDifferentOrder },
      );

      expect(state.items).toHaveLength(1);
    });
  });

  describe("SET_VARIANT (quick-add finishing size selection in the cart)", () => {
    const pendingCalabresa: ICartItem = {
      productId: "product-3",
      name: "Calabresa",
      price: 35.9,
      quantity: 1,
      category: ProductCategory.PIZZA,
      sizeOptions: [
        { id: "variant-m", label: "M", price: 35.9 },
        { id: "variant-g", label: "G", price: 45.9 },
      ],
    };

    it("assigns the chosen size, updates the price and clears sizeOptions", () => {
      const withPending = cartReducer(emptyCartState, { type: "ADD_ITEM", item: pendingCalabresa });
      const key = cartItemKey(pendingCalabresa);

      const updated = cartReducer(withPending, {
        type: "SET_VARIANT",
        key,
        variant: { id: "variant-g", label: "G", price: 45.9 },
      });

      expect(updated.items).toEqual([
        { ...pendingCalabresa, variantId: "variant-g", variantLabel: "G", price: 45.9, sizeOptions: undefined },
      ]);
    });

    it("merges into an existing line if the chosen size already matches another line", () => {
      const withBoth = [pendingCalabresa, pizzaGCalabresa].reduce(
        (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
        emptyCartState,
      );

      const updated = cartReducer(withBoth, {
        type: "SET_VARIANT",
        key: cartItemKey(pendingCalabresa),
        variant: { id: "variant-g", label: "G", price: 45.9 },
      });

      expect(updated.items).toHaveLength(1);
      expect(updated.items[0].quantity).toBe(2);
    });

    it("is a no-op when the key does not match any line", () => {
      const withPending = cartReducer(emptyCartState, { type: "ADD_ITEM", item: pendingCalabresa });

      const updated = cartReducer(withPending, {
        type: "SET_VARIANT",
        key: "does-not-exist",
        variant: { id: "variant-g", label: "G", price: 45.9 },
      });

      expect(updated).toBe(withPending);
    });
  });

  describe("SET_ADDONS (choosing add-ons from the cart)", () => {
    it("adds the addons total to the price and stores the snapshot", () => {
      const withPizza = cartReducer(emptyCartState, { type: "ADD_ITEM", item: pizzaGCalabresa });

      const updated = cartReducer(withPizza, {
        type: "SET_ADDONS",
        key: cartItemKey(pizzaGCalabresa),
        addons: [{ id: "addon-1", name: "Borda Catupiry", price: 8 }],
      });

      expect(updated.items).toEqual([
        {
          ...pizzaGCalabresa,
          price: 53.9,
          addonIds: ["addon-1"],
          addonsSnapshot: [{ id: "addon-1", name: "Borda Catupiry", price: 8 }],
        },
      ]);
    });

    it("recovers the base price before applying a different set of addons", () => {
      const withAddon = cartReducer(emptyCartState, { type: "ADD_ITEM", item: pizzaGCalabresaComBorda });

      const updated = cartReducer(withAddon, {
        type: "SET_ADDONS",
        key: cartItemKey(pizzaGCalabresaComBorda),
        addons: [],
      });

      expect(updated.items).toEqual([
        { ...pizzaGCalabresaComBorda, price: 45.9, addonIds: undefined, addonsSnapshot: undefined },
      ]);
    });

    it("merges into an existing line if the new addon set already matches another line", () => {
      const withBoth = [pizzaGCalabresa, pizzaGCalabresaComBorda].reduce(
        (acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }),
        emptyCartState,
      );

      const updated = cartReducer(withBoth, {
        type: "SET_ADDONS",
        key: cartItemKey(pizzaGCalabresa),
        addons: [{ id: "addon-1", name: "Borda Catupiry", price: 8 }],
      });

      expect(updated.items).toHaveLength(1);
      expect(updated.items[0].quantity).toBe(2);
    });

    it("is a no-op when the key does not match any line", () => {
      const withPizza = cartReducer(emptyCartState, { type: "ADD_ITEM", item: pizzaGCalabresa });

      const updated = cartReducer(withPizza, {
        type: "SET_ADDONS",
        key: "does-not-exist",
        addons: [{ id: "addon-1", name: "Borda Catupiry", price: 8 }],
      });

      expect(updated).toBe(withPizza);
    });
  });

  describe("COMBINE_ITEMS (half-and-half decided in the cart)", () => {
    const calabresaG: ICartItem = {
      productId: "product-calabresa",
      name: "Calabresa",
      price: 45.9,
      quantity: 2,
      category: ProductCategory.PIZZA,
      variantId: "variant-g",
      variantLabel: "G",
    };

    const frangoG: ICartItem = {
      productId: "product-frango",
      name: "Frango",
      price: 45.9,
      quantity: 1,
      category: ProductCategory.PIZZA,
      variantId: "variant-g",
      variantLabel: "G",
    };

    function seed(items: ICartItem[]) {
      return items.reduce((acc, item) => cartReducer(acc, { type: "ADD_ITEM", item }), emptyCartState);
    }

    it("takes one unit from each line and creates a combined half-and-half line", () => {
      const state = seed([calabresaG, frangoG]);

      const combined = cartReducer(state, {
        type: "COMBINE_ITEMS",
        primaryKey: cartItemKey(calabresaG),
        secondaryKey: cartItemKey(frangoG),
      });

      const comboLine = combined.items.find((i) => i.extraProductId === "product-frango");
      expect(comboLine).toMatchObject({
        name: "Calabresa / Frango",
        quantity: 1,
        price: 45.9,
        variantId: "variant-g",
        extraProductId: "product-frango",
        extraProductName: "Frango",
      });

      const leftoverCalabresa = combined.items.find((i) => i.productId === "product-calabresa" && !i.extraProductId);
      expect(leftoverCalabresa?.quantity).toBe(1);

      const leftoverFrango = combined.items.find((i) => i.productId === "product-frango" && !i.extraProductId);
      expect(leftoverFrango).toBeUndefined();
    });

    it("does not combine lines with different sizes", () => {
      const state = seed([calabresaG, { ...frangoG, variantId: "variant-m", variantLabel: "M" }]);

      const combined = cartReducer(state, {
        type: "COMBINE_ITEMS",
        primaryKey: cartItemKey(calabresaG),
        secondaryKey: cartItemKey({ ...frangoG, variantId: "variant-m" }),
      });

      expect(combined).toEqual(state);
    });

    it("does not combine a line that is already a combo", () => {
      const alreadyCombined = { ...calabresaG, extraProductId: "product-frango", extraProductName: "Frango" };
      const state = seed([alreadyCombined, frangoG]);

      const combined = cartReducer(state, {
        type: "COMBINE_ITEMS",
        primaryKey: cartItemKey(alreadyCombined),
        secondaryKey: cartItemKey(frangoG),
      });

      expect(combined).toEqual(state);
    });

    it("is a no-op when either key does not exist", () => {
      const state = seed([calabresaG, frangoG]);

      const combined = cartReducer(state, {
        type: "COMBINE_ITEMS",
        primaryKey: cartItemKey(calabresaG),
        secondaryKey: "does-not-exist",
      });

      expect(combined).toBe(state);
    });
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

describe("cartItemKey", () => {
  it("is stable for the same configuration regardless of add-on order", () => {
    const a = cartItemKey({ productId: "p1", variantId: "v1", addonIds: ["a", "b"] });
    const b = cartItemKey({ productId: "p1", variantId: "v1", addonIds: ["b", "a"] });

    expect(a).toBe(b);
  });

  it("differs when the variant differs", () => {
    const a = cartItemKey({ productId: "p1", variantId: "v1" });
    const b = cartItemKey({ productId: "p1", variantId: "v2" });

    expect(a).not.toBe(b);
  });

  it("differs when the second flavor differs", () => {
    const a = cartItemKey({ productId: "p1", extraProductId: "p2" });
    const b = cartItemKey({ productId: "p1", extraProductId: "p3" });

    expect(a).not.toBe(b);
  });
});
