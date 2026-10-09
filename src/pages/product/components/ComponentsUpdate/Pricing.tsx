import React, { useState, useEffect } from "react";

const Pricing = ({
  productPrice,
  compareAtPrice,
  onPriceChange,
  onCompareAtPriceChange,
}) => {
  const [costPerItem, setCostPerItem] = useState(0);
  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState(0);
  const [chargeTax, setChargeTax] = useState(true); // State to handle checkbox

  useEffect(() => {
    // Tính toán profit và margin mỗi khi thay đổi giá và chi phí
    const calculatedProfit = productPrice - costPerItem;
    const calculatedMargin =
      productPrice > 0 ? (calculatedProfit / productPrice) * 100 : 0;
    setProfit(calculatedProfit);
    setMargin(calculatedMargin);
  }, [productPrice, costPerItem]);

  const handleCostPerItemChange = (value) => {
    setCostPerItem(value);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  const handlePriceChange = (value) => {
    onPriceChange(value);
  };

  const handleCompareAtPriceChange = (value) => {
    onCompareAtPriceChange(value);
  };

  const handleChargeTaxChange = (event) => {
    setChargeTax(event.target.checked); // Handler for checkbox change
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md border">
      <div className="!px-5">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formatCurrency(productPrice)}
              onChange={(e) => handlePriceChange(Number(e.target.value.replace(/\D/g, '')))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Compare-at price
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formatCurrency(compareAtPrice)}
              onChange={(e) => handleCompareAtPriceChange(Number(e.target.value.replace(/\D/g, '')))}
            />
          </div>
        </div>
        <div className="flex items-center mb-4">
          <input
            name="tax"
            type="checkbox"
            checked={chargeTax}
            onChange={handleChargeTaxChange} // Add this onChange handler
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="tax" className="ml-2 block text-sm text-gray-900">
            Charge tax on this product
          </label>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost per item
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formatCurrency(costPerItem)}
              onChange={(e) => handleCostPerItemChange(Number(e.target.value.replace(/\D/g, '')))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profit
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              readOnly
              value={formatCurrency(profit)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Margin
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              readOnly
              value={`${margin.toFixed(2)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
