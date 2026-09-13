import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Socket } from "socket.io-client";
import { PedidosBoard } from "./PedidosBoard";
import { connectOrderSocket } from "@/lib/socket/orderSocket";
import { updateOrderStatus } from "../actions";
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

jest.mock("../actions", () => ({
  updateOrderStatus: jest.fn(),
}));

const mockedConnect = connectOrderSocket as jest.MockedFunction<typeof connectOrderSocket>;
const mockedUpdateStatus = updateOrderStatus as jest.MockedFunction<typeof updateOrderStatus>;

function buildOrder(overrides: Partial<IOrder> = {}): IOrder {
  return {
    id: "order-1",
    type: OrderType.PICKUP,
    status: OrderStatus.RECEIVED,
    customerName: "João",
    customerPhone: "11999999999",
    deliveryFee: 0,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.PENDING,
    totalValue: 16,
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

describe("PedidosBoard", () => {
  beforeEach(() => {
    mockedUpdateStatus.mockReset();
    mockedUpdateStatus.mockResolvedValue({ success: true });
  });

  it("groups the initial orders into the column matching their status", () => {
    mockedConnect.mockReturnValue(createFakeSocket() as unknown as Socket);

    render(
      <PedidosBoard
        slug="bar-do-joao"
        initialOrders={[buildOrder({ status: OrderStatus.RECEIVED }), buildOrder({ id: "order-2", status: OrderStatus.PREPARING })]}
      />,
    );

    expect(screen.getByRole("heading", { name: /recebido/i })).toHaveTextContent("1");
    expect(screen.getByRole("heading", { name: /preparando/i })).toHaveTextContent("1");
  });

  it("prepends a new order to the board when order_created arrives", () => {
    const socket = createFakeSocket();
    mockedConnect.mockReturnValue(socket as unknown as Socket);

    render(<PedidosBoard slug="bar-do-joao" initialOrders={[]} />);

    act(() => {
      socket.trigger("order_created", { order: buildOrder({ customerName: "Maria" }) });
    });

    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("moves an order to a different column when order_status_updated arrives", () => {
    const socket = createFakeSocket();
    mockedConnect.mockReturnValue(socket as unknown as Socket);

    render(<PedidosBoard slug="bar-do-joao" initialOrders={[buildOrder({ status: OrderStatus.RECEIVED })]} />);

    act(() => {
      socket.trigger("order_status_updated", { order: buildOrder({ status: OrderStatus.READY }) });
    });

    expect(screen.getByRole("heading", { name: /pronto/i })).toHaveTextContent("1");
    expect(screen.getByRole("heading", { name: /recebido/i })).toHaveTextContent("0");
  });

  it("calls updateOrderStatus with the order id and target status when a transition button is clicked", async () => {
    mockedConnect.mockReturnValue(createFakeSocket() as unknown as Socket);
    const user = userEvent.setup();

    render(<PedidosBoard slug="bar-do-joao" initialOrders={[buildOrder({ status: OrderStatus.RECEIVED })]} />);

    await user.click(screen.getByRole("button", { name: /aceitar e preparar/i }));

    expect(mockedUpdateStatus).toHaveBeenCalledWith("order-1", OrderStatus.PREPARING, "bar-do-joao");
  });

  it("disconnects the socket on unmount", () => {
    const socket = createFakeSocket();
    mockedConnect.mockReturnValue(socket as unknown as Socket);

    const { unmount } = render(<PedidosBoard slug="bar-do-joao" initialOrders={[]} />);
    unmount();

    expect(socket.disconnect).toHaveBeenCalled();
  });
});
