import { render, screen, act } from "@testing-library/react";
import type { Socket } from "socket.io-client";
import { OrderTrackingView } from "./OrderTrackingView";
import { connectOrderSocket } from "@/lib/socket/orderSocket";
import {
  IOrder,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  ProductCategory,
} from "@/data/models";

jest.mock("@/lib/socket/orderSocket", () => ({
  connectOrderSocket: jest.fn(),
}));

const mockedConnect = connectOrderSocket as jest.MockedFunction<typeof connectOrderSocket>;

function buildOrder(overrides: Partial<IOrder> = {}): IOrder {
  return {
    id: "order-1",
    type: OrderType.DELIVERY,
    status: OrderStatus.RECEIVED,
    customerName: "João",
    customerPhone: "11999999999",
    deliveryAddress: "Rua das Flores, 123",
    deliveryFee: 5,
    paymentMethod: PaymentMethod.PIX,
    paymentStatus: PaymentStatus.PENDING,
    totalValue: 21,
    items: [
      { id: "item-1", name: "Coca-cola", price: 8, quantity: 2, category: ProductCategory.SOFT_DRINKS },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createFakeSocket() {
  const handlers: Record<string, (payload?: unknown) => void> = {};
  return {
    on: jest.fn((event: string, handler: (payload?: unknown) => void) => {
      handlers[event] = handler;
    }),
    emit: jest.fn(),
    disconnect: jest.fn(),
    trigger: (event: string, payload?: unknown) => handlers[event]?.(payload),
  };
}

describe("OrderTrackingView", () => {
  it("highlights the step matching the current order status", () => {
    mockedConnect.mockReturnValue(createFakeSocket() as unknown as Socket);

    render(<OrderTrackingView slug="bar-do-joao" initialOrder={buildOrder({ status: OrderStatus.PREPARING })} />);

    const preparingItem = screen.getByText("Preparando").closest("li");
    expect(preparingItem?.querySelector("svg")).toHaveClass("text-[#F2A20C]");
  });

  it("joins the order room once the socket connects", () => {
    const socket = createFakeSocket();
    mockedConnect.mockReturnValue(socket as unknown as Socket);

    render(<OrderTrackingView slug="bar-do-joao" initialOrder={buildOrder()} />);
    act(() => socket.trigger("connect"));

    expect(socket.emit).toHaveBeenCalledWith("join_order", "order-1");
  });

  it("updates the displayed status when an order_status_updated event arrives for this order", () => {
    const socket = createFakeSocket();
    mockedConnect.mockReturnValue(socket as unknown as Socket);

    render(<OrderTrackingView slug="bar-do-joao" initialOrder={buildOrder({ status: OrderStatus.RECEIVED })} />);

    act(() => {
      socket.trigger("order_status_updated", { order: buildOrder({ status: OrderStatus.READY }) });
    });

    const readyItem = screen.getByText("Pronto").closest("li");
    expect(readyItem?.querySelector("svg")).toHaveClass("text-[#F2A20C]");
  });

  it("ignores status updates that belong to a different order", () => {
    const socket = createFakeSocket();
    mockedConnect.mockReturnValue(socket as unknown as Socket);

    render(<OrderTrackingView slug="bar-do-joao" initialOrder={buildOrder({ status: OrderStatus.RECEIVED })} />);

    act(() => {
      socket.trigger("order_status_updated", { order: buildOrder({ id: "other-order", status: OrderStatus.COMPLETED }) });
    });

    const receivedItem = screen.getByText("Recebido").closest("li");
    expect(receivedItem?.querySelector("svg")).toHaveClass("text-[#F2A20C]");
  });

  it("shows a cancelled banner instead of the step list when the order is cancelled", () => {
    mockedConnect.mockReturnValue(createFakeSocket() as unknown as Socket);

    render(<OrderTrackingView slug="bar-do-joao" initialOrder={buildOrder({ status: OrderStatus.CANCELLED })} />);

    expect(screen.getByText(/pedido foi cancelado/i)).toBeInTheDocument();
  });

  it("skips the out-for-delivery step for PICKUP orders", () => {
    mockedConnect.mockReturnValue(createFakeSocket() as unknown as Socket);

    render(
      <OrderTrackingView
        slug="bar-do-joao"
        initialOrder={buildOrder({ type: OrderType.PICKUP, status: OrderStatus.READY })}
      />,
    );

    expect(screen.queryByText("Saiu para entrega")).not.toBeInTheDocument();
  });

  it("disconnects the socket on unmount", () => {
    const socket = createFakeSocket();
    mockedConnect.mockReturnValue(socket as unknown as Socket);

    const { unmount } = render(<OrderTrackingView slug="bar-do-joao" initialOrder={buildOrder()} />);
    unmount();

    expect(socket.disconnect).toHaveBeenCalled();
  });
});
