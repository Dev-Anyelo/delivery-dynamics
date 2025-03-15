import { Badge } from "./badge";
import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Edit2, Save, X } from "lucide-react";
import { LineItem, Order } from "@/types/types";

export const OrderCardDetailGuide = ({ order }: { order: Order }) => {
  // State to track which item is being edited
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // State to store edited values
  const [editedItems, setEditedItems] = useState<Record<number, LineItem>>({});

  // Calculate the total order value based on current line items
  const calculateOrderTotal = () => {
    if (!order.lineItems) return 0;

    return order.lineItems.reduce(
      (total: number, item: LineItem, index: number): number => {
        // Use edited values if this item is being edited
        if (editingItemIndex === index && editedItems[index]) {
          const editedItem: LineItem = editedItems[index];
          return total + editedItem.quantity * editedItem.unitPrice;
        }
        return total + item.quantity * item.unitPrice;
      },
      0
    );
  };

  // Start editing an item
  const handleEdit = (index: number) => {
    setEditingItemIndex(index);
    // Initialize edited item with current values
    setEditedItems({
      ...editedItems,
      [index]: { ...order.lineItems![index] },
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingItemIndex(null);
  };

  // Save edited item
  const handleSave = () => {
    // Here you would typically call an API to update the item
    // For now, we're just updating the local state
    setEditingItemIndex(null);
    // In a real application, you would update the order data here
  };

  // Update item field and recalculate total
  const handleItemChange = (
    index: number,
    field: keyof LineItem,
    value: number
  ) => {
    const updatedItem = {
      ...editedItems[index],
      [field]: value,
    };

    setEditedItems({
      ...editedItems,
      [index]: updatedItem,
    });
  };

  // Get current value for an item (either edited or original)
  const getCurrentItemValue = (item: LineItem, index: number) => {
    return editingItemIndex === index && editedItems[index]
      ? editedItems[index]
      : item;
  };

  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <h5 className="font-medium">Orden #{order.id}</h5>
        <Badge variant="secondary">
          Total: $
          {editingItemIndex !== null
            ? calculateOrderTotal().toFixed(2)
            : order.value.toFixed(2)}
        </Badge>
      </div>

      {order.lineItems && order.lineItems.length > 0 ? (
        <div className="mt-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground mb-2 md:grid">
            <div className="col-span-4">Producto</div>
            <div className="col-span-2 text-right">Cantidad</div>
            <div className="col-span-2 text-right">Cantidad Actual</div>
            <div className="col-span-1 text-right">Precio Unitario</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1 text-right">Acciones</div>
          </div>

          <div className="space-y-2">
            {order.lineItems.map((item: LineItem, itemIdx: number) => {
              const currentItem = getCurrentItemValue(item, itemIdx);
              const isEditing = editingItemIndex === itemIdx;
              const itemTotal = currentItem.quantity * currentItem.unitPrice;

              return (
                <div
                  key={itemIdx}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-2 p-2 rounded-md text-sm ${
                    isEditing
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/40"
                  }`}
                >
                  <div className="col-span-4 font-medium">
                    {item.product?.description || "Producto desconocido"}
                    {item.product?.code && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({item.product.code})
                      </span>
                    )}
                  </div>

                  {/* Quantity - Mobile */}
                  <div className="flex justify-between md:hidden text-muted-foreground">
                    <span>Cantidad:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentItem.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            itemIdx,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-7 text-right"
                      />
                    ) : (
                      <span>{currentItem.quantity}</span>
                    )}
                  </div>

                  {/* Quantity - Desktop */}
                  <div className="md:col-span-2 md:text-right hidden md:block">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentItem.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            itemIdx,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-7 text-right ml-auto"
                      />
                    ) : (
                      currentItem.quantity
                    )}
                  </div>

                  {/* Actual Quantity - Mobile */}
                  <div className="flex justify-between md:hidden text-muted-foreground">
                    <span>Cantidad Actual:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentItem.actualQuantity}
                        onChange={(e) =>
                          handleItemChange(
                            itemIdx,
                            "actualQuantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-7 text-right"
                      />
                    ) : (
                      <span>{currentItem.actualQuantity}</span>
                    )}
                  </div>

                  {/* Actual Quantity - Desktop */}
                  <div className="md:col-span-2 md:text-right hidden md:block">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentItem.actualQuantity}
                        onChange={(e) =>
                          handleItemChange(
                            itemIdx,
                            "actualQuantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-7 text-right ml-auto"
                      />
                    ) : (
                      currentItem.actualQuantity
                    )}
                  </div>

                  {/* Unit Price - Mobile */}
                  <div className="flex justify-between md:hidden text-muted-foreground">
                    <span>Precio Unitario:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentItem.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            itemIdx,
                            "unitPrice",
                            Number(e.target.value)
                          )
                        }
                        className="w-24 h-7 text-right"
                        step="0.01"
                      />
                    ) : (
                      <span>${currentItem.unitPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Unit Price - Desktop */}
                  <div className="md:col-span-1 md:text-right hidden md:block">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={currentItem.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            itemIdx,
                            "unitPrice",
                            Number(e.target.value)
                          )
                        }
                        className="w-24 h-7 text-right ml-auto"
                        step="0.01"
                      />
                    ) : (
                      `$${currentItem.unitPrice.toFixed(2)}`
                    )}
                  </div>

                  {/* Total - Mobile */}
                  <div className="flex justify-between md:hidden text-muted-foreground">
                    <span>Total:</span>
                    <span>${itemTotal.toFixed(2)}</span>
                  </div>

                  {/* Total - Desktop */}
                  <div className="md:col-span-2 md:text-right font-medium hidden md:block">
                    ${itemTotal.toFixed(2)}
                  </div>

                  {/* Actions - Mobile */}
                  <div className="flex justify-end mt-2 md:hidden">
                    {isEditing ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                          className="h-7 px-2"
                        >
                          <X className="h-4 w-4 mr-1" /> Cancelar
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleSave}
                          className="h-7 px-2 ml-2"
                        >
                          <Save className="h-4 w-4 mr-1" /> Guardar
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(itemIdx)}
                        className="h-7 px-2"
                      >
                        <Edit2 className="h-4 w-4 mr-1" /> Editar
                      </Button>
                    )}
                  </div>

                  {/* Actions - Desktop */}
                  <div className="md:col-span-1 md:text-right hidden md:flex md:justify-end">
                    {isEditing ? (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancel}
                          className="h-7 w-7"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSave}
                          className="h-7 w-7"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(itemIdx)}
                        className="h-7 w-7"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No hay ítems en la orden
        </p>
      )}
    </div>
  );
};