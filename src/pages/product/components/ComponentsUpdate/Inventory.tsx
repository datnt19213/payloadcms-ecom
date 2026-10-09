import React from "react";

const Inventory = ({
  hasSku,
  setHasSku,
  quantity,
  trackQuantity,
  continueSelling,
  sku,
  barcode,
  onQuantityChange,
  onTrackQuantityChange,
  onContinueSellingChange,
  onSkuChange,
  onBarcodeChange
}) => {
  return (
    <div className="p-6 bg-white rounded-md shadow-md border">
      <div className="!px-5">
        <h2 className="text-xl font-semibold mb-4">Inventory</h2>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
              checked={trackQuantity}
              onChange={(e) => onTrackQuantityChange(e.target.checked)}
            />
            <span className="ml-2 block text-sm text-gray-900">
              Track quantity
            </span>
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700 flex-grow">
            Shop location
          </label>
          <input
            type="number"
            className="mt-1 block w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
              checked={continueSelling}
              onChange={(e) => onContinueSellingChange(e.target.checked)}
            />
            <span className="ml-2 block text-sm text-gray-900">
              Continue selling when out of stock
            </span>
          </label>
          <p className="text-sm text-gray-500">
            This won't affect Shopify POS. Staff will see a warning, but can
            complete sales when available inventory reaches zero and below.
          </p>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded"
              checked={hasSku}
              onChange={(e) => setHasSku(e.target.checked)}
            />
            <span className="ml-2 block text-sm text-gray-900">
              This product has a SKU or barcode
            </span>
          </label>
        </div>
        {hasSku && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={sku}
                onChange={(e) => onSkuChange(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Barcode (ISBN, UPC, GTIN, etc.)
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={barcode}
                onChange={(e) => onBarcodeChange(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
