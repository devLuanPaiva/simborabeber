import { createOrder } from "./actions";
import { serverPost } from "@/lib/api/serverPost";
import { OrderType, PaymentMethod, ProductCategory } from "@/data/models";

jest.mock("@/lib/api/serverPost", () => ({
  serverPost: jest.fn(),
}));

const mockedServerPost = serverPost as jest.MockedFunction<typeof serverPost>;

function buildFormData(fields: Record<string, string>): FormData {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

const cartItemsJson = JSON.stringify([
  { productId: "product-1", name: "Coca-cola", price: 8, quantity: 2, category: ProductCategory.SOFT_DRINKS },
]);

describe("createOrder", () => {
  beforeEach(() => {
    mockedServerPost.mockReset();
  });

  it("posts the expected body and returns success with the created order id", async () => {
    mockedServerPost.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", results: { id: "order-123" } }),
    } as Response);

    const formData = buildFormData({
      type: OrderType.DELIVERY,
      customerName: "João",
      customerPhone: "(11) 99999-9999",
      deliveryAddress: "Rua das Flores, 123",
      paymentMethod: PaymentMethod.PIX,
      notes: "Tocar a campainha",
      items: cartItemsJson,
    });

    const result = await createOrder(formData, "bar-do-joao");

    expect(mockedServerPost).toHaveBeenCalledWith(
      "/order/by-bar/bar-do-joao",
      expect.objectContaining({
        type: OrderType.DELIVERY,
        customerName: "João",
        customerPhone: "11999999999",
        deliveryAddress: "Rua das Flores, 123",
        paymentMethod: PaymentMethod.PIX,
        notes: "Tocar a campainha",
        items: [{ productId: "product-1", quantity: 2 }],
      }),
    );
    expect(result).toEqual({ success: true, orderId: "order-123" });
  });

  it("returns the API error detail when the request fails", async () => {
    mockedServerPost.mockResolvedValue({
      ok: false,
      json: async () => ({
        status: "error",
        message: "Pedido mínimo não atingido",
        errors: { detail: "O pedido mínimo para entrega neste bar é de 20.00" },
      }),
    } as Response);

    const formData = buildFormData({
      type: OrderType.DELIVERY,
      customerName: "João",
      customerPhone: "11999999999",
      deliveryAddress: "Rua das Flores, 123",
      paymentMethod: PaymentMethod.PIX,
      items: cartItemsJson,
    });

    const result = await createOrder(formData, "bar-do-joao");

    expect(result).toEqual({
      success: false,
      error: "O pedido mínimo para entrega neste bar é de 20.00",
    });
  });

  it("rejects without calling the API when the cart is empty", async () => {
    const formData = buildFormData({
      type: OrderType.PICKUP,
      customerName: "João",
      customerPhone: "11999999999",
      paymentMethod: PaymentMethod.CASH,
      items: "[]",
    });

    const result = await createOrder(formData, "bar-do-joao");

    expect(result.success).toBe(false);
    expect(mockedServerPost).not.toHaveBeenCalled();
  });

  it("rejects a DELIVERY order without an address before calling the API", async () => {
    const formData = buildFormData({
      type: OrderType.DELIVERY,
      customerName: "João",
      customerPhone: "11999999999",
      paymentMethod: PaymentMethod.PIX,
      items: cartItemsJson,
    });

    const result = await createOrder(formData, "bar-do-joao");

    expect(result.success).toBe(false);
    expect(mockedServerPost).not.toHaveBeenCalled();
  });

  it("does not require an address for PICKUP orders", async () => {
    mockedServerPost.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success", results: { id: "order-456" } }),
    } as Response);

    const formData = buildFormData({
      type: OrderType.PICKUP,
      customerName: "João",
      customerPhone: "11999999999",
      paymentMethod: PaymentMethod.CASH,
      items: cartItemsJson,
    });

    const result = await createOrder(formData, "bar-do-joao");

    expect(result).toEqual({ success: true, orderId: "order-456" });
    expect(mockedServerPost).toHaveBeenCalledWith(
      "/order/by-bar/bar-do-joao",
      expect.not.objectContaining({ deliveryAddress: expect.anything() }),
    );
  });
});
