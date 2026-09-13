import { render, screen, waitFor } from "@testing-library/react";
import { CheckoutForm } from "./CheckoutForm";
import { CartProvider } from "@/data/cart/CartContext";
import { ProductCategory } from "@/data/models";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

const SLUG = "bar-do-joao";

function seedCart() {
  window.localStorage.setItem(
    `cart:${SLUG}`,
    JSON.stringify([
      { productId: "product-1", name: "Coca-cola", price: 8, quantity: 2, category: ProductCategory.SOFT_DRINKS },
    ]),
  );
}

function renderCheckout() {
  return render(
    <CartProvider barSlug={SLUG}>
      <CheckoutForm slug={SLUG} deliveryFee={5} minOrderValue={10} />
    </CartProvider>,
  );
}

describe("CheckoutForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the empty-cart message when there is nothing to check out", async () => {
    renderCheckout();

    expect(await screen.findByText(/carrinho está vazio/i)).toBeInTheDocument();
  });

  it("renders the order form once the cart has items", async () => {
    seedCart();
    renderCheckout();

    await waitFor(() => expect(screen.getByLabelText(/nome/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar pedido/i })).toBeInTheDocument();
  });

  it("shows the delivery address field by default (DELIVERY is the initial type)", async () => {
    seedCart();
    renderCheckout();

    expect(await screen.findByLabelText(/endereço de entrega/i)).toBeInTheDocument();
  });
});
