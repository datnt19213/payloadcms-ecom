import React from 'react';

const SkeletonRow = ({ header }) => {
  const cellCount = header ? 5 : 5; // Adjust the count based on your table columns
  return (
    <tr className="bg-white border-b">
      {[...Array(cellCount)].map((_, index) => (
        <td key={index} className="py-4 px-6">
          <div className={`h-2.5 bg-gray-300 rounded-md ${!header && 'animate-pulse'}`}></div>
        </td>
      ))}
    </tr>
  );
};

const SkeletonHeader = () => {
  return <SkeletonRow header={true} />;
};

const SkeletonBodyRow = () => {
  return <SkeletonRow header={false} />;
};

export { SkeletonHeader, SkeletonBodyRow };
