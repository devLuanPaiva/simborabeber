import { getNextOrderStatuses } from "./getNextOrderStatuses";
import { OrderStatus, OrderType } from "@/data/models";

describe("getNextOrderStatuses", () => {
  it("allows RECEIVED to move to PREPARING or CANCELLED", () => {
    expect(getNextOrderStatuses({ status: OrderStatus.RECEIVED, type: OrderType.DELIVERY })).toEqual([
      OrderStatus.PREPARING,
      OrderStatus.CANCELLED,
    ]);
  });

  it("only offers OUT_FOR_DELIVERY after READY for a DELIVERY order", () => {
    expect(getNextOrderStatuses({ status: OrderStatus.READY, type: OrderType.DELIVERY })).toEqual([
      OrderStatus.OUT_FOR_DELIVERY,
    ]);
  });

  it("skips straight to COMPLETED after READY for a PICKUP order", () => {
    expect(getNextOrderStatuses({ status: OrderStatus.READY, type: OrderType.PICKUP })).toEqual([
      OrderStatus.COMPLETED,
    ]);
  });

  it("never offers CANCELLED once the order is OUT_FOR_DELIVERY", () => {
    expect(getNextOrderStatuses({ status: OrderStatus.OUT_FOR_DELIVERY, type: OrderType.DELIVERY })).toEqual([
      OrderStatus.COMPLETED,
    ]);
  });

  it("returns no further transitions for a terminal status", () => {
    expect(getNextOrderStatuses({ status: OrderStatus.COMPLETED, type: OrderType.DELIVERY })).toEqual([]);
    expect(getNextOrderStatuses({ status: OrderStatus.CANCELLED, type: OrderType.PICKUP })).toEqual([]);
  });
});
