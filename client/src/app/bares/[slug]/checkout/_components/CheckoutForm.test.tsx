import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckoutForm } from "./CheckoutForm";
import { CartProvider } from "@/data/cart/CartContext";
import { IDeliveryCity, ProductCategory } from "@/data/models";

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

function renderCheckout(deliveryCities: IDeliveryCity[] = []) {
  return render(
    <CartProvider barSlug={SLUG}>
      <CheckoutForm slug={SLUG} deliveryFee={5} minOrderValue={10} deliveryCities={deliveryCities} />
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

  it("overrides the flat delivery fee with the selected city's fee and shows the surcharge legend", async () => {
    seedCart();
    const user = userEvent.setup();
    renderCheckout([{ id: "city-1", name: "Cidade Vizinha", fee: 12 }]);

    await screen.findByLabelText(/endereço de entrega/i);
    expect(screen.getByText(/taxa de entrega$/i)).toBeInTheDocument();

    await user.click(screen.getByText("Cidade Vizinha"));

    expect(screen.getByText(/\+ R\$\s?12,00 de acréscimo/i)).toBeInTheDocument();
    expect(screen.getByText(/taxa de entrega \(cidade vizinha\)/i)).toBeInTheDocument();
  });

  it("does not show a surcharge legend for a delivery city with no extra fee", async () => {
    seedCart();
    renderCheckout([{ id: "city-1", name: "Cidade de Origem", fee: 0 }]);

    await screen.findByLabelText(/endereço de entrega/i);

    expect(screen.getByText("Cidade de Origem")).toBeInTheDocument();
    expect(screen.queryByText(/de acréscimo/i)).not.toBeInTheDocument();
  });
});
