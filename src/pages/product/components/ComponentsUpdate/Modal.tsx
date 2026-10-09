import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const Modal = ({ variant, onClose, stockLocations, onSave }) => {
  const [selectedStockLocations, setSelectedStockLocations] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    if (variant) {
      const initialQuantities = {};
      const initialSelectedLocations = [];
      stockLocations.forEach((location) => {
        const quantity = variant.quantities?.[location.id] || 0;
        initialQuantities[location.id] = quantity;
        if (quantity > 0) {
          initialSelectedLocations.push(location.id);
        }
      });

      setQuantities(initialQuantities);
      setSelectedStockLocations(initialSelectedLocations);
      setSku(variant.sku || "");
      setBarcode(variant.barcode || "");
    }
  }, [variant, stockLocations]);

  const handleCheckboxChange = (locationId) => {
    setSelectedStockLocations((prevSelected) =>
      prevSelected.includes(locationId)
        ? prevSelected.filter((id) => id !== locationId)
        : [...prevSelected, locationId]
    );
  };

  const handleQuantityChange = (locationId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [locationId]: Math.max(0, quantity), // Ensure quantity is non-negative
    }));

    if (quantity > 0) {
      setSelectedStockLocations((prevSelected) =>
        prevSelected.includes(locationId)
          ? prevSelected
          : [...prevSelected, locationId]
      );
    } else {
      setSelectedStockLocations((prevSelected) =>
        prevSelected.filter((id) => id !== locationId)
      );
    }
  };

  const handleSave = () => {
    onSave(selectedStockLocations, quantities, sku, barcode);
    onClose();
  };

  if (!variant) return null;

  return (
    <div className="inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-lg font-semibold mb-4">
          Edit {variant.optionValues.join(" / ")}
        </h2>
        <div className="flex items-center mb-4">
          <input type="checkbox" checked className="mr-2" readOnly />
          <label className="text-sm">Create this variant</label>
        </div>
        <h3 className="text-md font-semibold mt-6 mb-2">Inventory</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              id="sku"
              className="mt-1 block w-full p-2 border rounded dark:border-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Barcode (ISBN, UPC, GTIN, etc.)
            </label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              id="barcode"
              className="mt-1 block w-full p-2 border rounded dark:border-zinc-600"
            />
          </div>
        </div>
        <div className="space-y-4">
          {stockLocations.map((location) => (
            <div
              key={location?.id}
              className="flex justify-between items-center p-4 bg-gray-200 rounded-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  aria-hidden="true"
                  alt="location-icon"
                  src="https://openui.fly.dev/openui/24x24.svg?text=🏢"
                />
                <span className="text-gray-800">{location?.name}</span>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer mx-4">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() => handleCheckboxChange(location.id)}
                    checked={selectedStockLocations.includes(location.id)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
                {selectedStockLocations.includes(location.id) && (
                  <div className="flex items-center">
                    <button
                      className="p-2 border rounded-l"
                      onClick={() =>
                        handleQuantityChange(
                          location.id,
                          parseInt(quantities[location.id] || 0) - 1
                        )
                      }
                    >
                      <FaMinus />
                    </button>
                    <input
                      type="number"
                      value={quantities[location.id]}
                      onChange={(e) =>
                        handleQuantityChange(
                          location.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="p-2 border-t border-b"
                      style={{ width: "60px", textAlign: "center" }}
                      min="0"
                    />
                    <button
                      className="p-2 border rounded-r"
                      onClick={() =>
                        handleQuantityChange(
                          location.id,
                          parseInt(quantities[location.id] || 0) + 1
                        )
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-muted text-muted-foreground p-2 rounded hover:bg-muted/80"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-primary-foreground p-2 rounded hover:bg-primary/80"
            onClick={handleSave}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
