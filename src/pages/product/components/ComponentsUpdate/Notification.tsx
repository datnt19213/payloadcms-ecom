import React from "react";
import { FaCheckCircle } from "react-icons/fa";
interface NotificationProps {
  title: string;
  status: string;
}

const Notification: React.FC<NotificationProps> = ({ title, status }) => {
  return (
    <div className="bg-gray-100 mb-5 shadow-sm">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <p className="text-lg font-semibold text-gray-800">{title}</p>
          <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700">
            Duplicate
          </button>
          <button className="text-gray-500 hover:text-gray-700">Preview</button>
          <button className="text-gray-500 hover:text-gray-700" disabled>
            Share
          </button>
          <div className="relative">
            <button className="text-gray-500 hover:text-gray-700">
              More actions
              <span className="inline-block transform rotate-90">&#x25B6;</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg hidden">
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Action 1
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Action 2
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex items-center">
          <FaCheckCircle className="mr-2" />
          <p className="font-semibold">
            Congratulations! You added your first product.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
