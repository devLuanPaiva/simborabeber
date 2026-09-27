import { IOrder, OrderStatus, OrderType } from "@/data/models";

/**
 * Mirrors the API's status transition rules (OrderService.NEXT_STATUSES) so the
 * panel only ever offers buttons for transitions the backend will actually accept.
 * The real enforcement stays server-side - this is UI-only.
 */
export function getNextOrderStatuses(order: Pick<IOrder, "status" | "type">): OrderStatus[] {
    switch (order.status) {
        case OrderStatus.RECEIVED:
            return [OrderStatus.PREPARING, OrderStatus.CANCELLED];
        case OrderStatus.PREPARING:
            return [OrderStatus.READY, OrderStatus.CANCELLED];
        case OrderStatus.READY:
            return order.type === OrderType.DELIVERY
                ? [OrderStatus.OUT_FOR_DELIVERY]
                : [OrderStatus.COMPLETED];
        case OrderStatus.OUT_FOR_DELIVERY:
            return [OrderStatus.COMPLETED];
        default:
            return [];
    }
}
