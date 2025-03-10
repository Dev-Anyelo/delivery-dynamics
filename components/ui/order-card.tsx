import { Badge } from "./badge";
import { LineItem, Order } from "@/types/types";

export const OrderCardDetailGuide = ({ order }: { order: Order }) => (
  <div className="border rounded-md p-4 space-y-3">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
      <h5 className="font-medium">Order #{order.id}</h5>
      <Badge variant="secondary">Total: ${order.value.toFixed(2)}</Badge>
    </div>

    {order.lineItems && order.lineItems.length > 0 ? (
      <div className="mt-2">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground mb-2 md:grid">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-right">Quantity</div>
          <div className="col-span-2 text-right">Unit Price</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        <div className="space-y-2">
          {order.lineItems.map((item: LineItem, itemIdx: number) => (
            <div
              key={itemIdx}
              className="grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 p-2 rounded-md bg-muted/40 text-sm"
            >
              <div className="col-span-6 font-medium">
                {item.product?.description || "Unknown Product"}
                {item.product?.code && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({item.product.code})
                  </span>
                )}
              </div>

              <div className="flex justify-between md:hidden text-muted-foreground">
                <span>Quantity:</span>
                <span>{item.quantity}</span>
              </div>
              <div className="md:col-span-2 md:text-right hidden md:block">
                {item.quantity}
              </div>

              <div className="flex justify-between md:hidden text-muted-foreground">
                <span>Unit Price:</span>
                <span>${item.unitPrice.toFixed(2)}</span>
              </div>
              <div className="md:col-span-2 md:text-right hidden md:block">
                ${item.unitPrice.toFixed(2)}
              </div>

              <div className="flex justify-between md:hidden text-muted-foreground">
                <span>Total:</span>
                <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
              </div>
              <div className="md:col-span-2 md:text-right font-medium hidden md:block">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-sm text-muted-foreground">No line items</p>
    )}
  </div>
);
