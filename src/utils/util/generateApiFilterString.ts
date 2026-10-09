import React from "react";

/* The `interface FilterData` is defining a structure for the `FilterData` object in TypeScript. It
specifies the properties that the `FilterData` object should have, which are `status`, `categories`,
`tags`, and `sales_channel`. Each property is an array of objects with `label` and `value`
properties. This interface helps enforce a specific shape for the `FilterData` object to ensure
consistency and type safety when working with filter data in the code. */
interface FilterData {
  status: {label: string; value: string}[];
  categories: {label: string; value: string}[];
  tags: {label: string; value: string}[];
  sales_channel: {label: string; value: string}[];
}
/**
 * The function `GenerateApiFilterProduct` constructs a URL with query parameters based on the provided
 * filter data.
 * @param {FilterData} data - The `GenerateApiFilterProduct` function takes in a `FilterData` object as
 * its parameter. This object typically contains the following properties:
 * @returns The function `GenerateApiFilterProduct` returns a string that represents a URL with query
 * parameters based on the provided `FilterData` object. The URL includes query parameters for tags,
 * sales channels, categories, and status.
 */
export const GenerateApiFilterProduct = (data: FilterData): string => {
  const baseUrl = "/admin/products";

  const tags = data.tags.map((tag) => tag.value).join(",");
  const salesChannels = data.sales_channel
    .map((channel) => channel.value)
    .join(",");
  const categories = data.categories
    .map((category) => category.value)
    .join(",");
  const status = data.status.map((statusItem) => statusItem.value).join(",");

  const url = `${baseUrl}?${tags && "tags[]=" + tags}&${salesChannels && "sales_channel_id[]=" + salesChannels}&${categories && "category_id[]=" + categories}&${status && "status[]=" + status}`;

  return url;
};
