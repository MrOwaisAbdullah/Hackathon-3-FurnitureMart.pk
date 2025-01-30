"use client";
import React, { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";

interface FilterPanelProps {
  filters: {
    query: string;
    minPrice: number;
    maxPrice: number;
    sellers: string[];
    categories: string[];
    inStockOnly: boolean;
  };
  onFilterChange: (
    newFilters: Partial<{
      query: string;
      minPrice: number;
      maxPrice: number;
      sellers: string[];
      categories: string[];
      inStockOnly: boolean;
    }>
  ) => void;
  sellers: { _id: string; shopName: string }[];
  categories: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  sellers,
  categories,
}) => {
  // Configurable limits
  const initialSellerLimit = 3; // Initial number of sellers to display
  const loadMoreIncrement = 2; // Number of sellers to load on each "Load More" click

  // State to track the number of visible sellers
  const [visibleSellers, setVisibleSellers] = useState(initialSellerLimit);

  // Load more sellers
  const handleLoadMore = () => {
    setVisibleSellers((prev) => prev + loadMoreIncrement);
  };

  return (
    <div className="rounded-[10px]">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Search Bar */}
      <SearchBar
        value={filters.query}
        onSearch={(query: string) => onFilterChange({ query })}
      />

      {/* Categories */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Categories</h4>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => {
                  const newCategories = filters.categories.includes(category)
                    ? filters.categories.filter((cat) => cat !== category)
                    : [...filters.categories, category];
                  onFilterChange({ categories: newCategories });
                }}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              onFilterChange({ minPrice: Number(e.target.value) })
            }
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              onFilterChange({ maxPrice: Number(e.target.value) || Infinity })
            }
            className="w-1/2 p-2 border rounded"
          />
        </div>
      </div>

      {/* Sellers */}
      <div className="mt-4">
        <h4 className="font-medium mb-2">Sellers</h4>
        <div className="flex flex-col gap-2">
          {sellers.slice(0, visibleSellers).map((seller) => (
            <label key={seller._id} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sellers.includes(seller._id)}
                onChange={() => {
                  const newSellers = filters.sellers.includes(seller._id)
                    ? filters.sellers.filter((id) => id !== seller._id)
                    : [...filters.sellers, seller._id];
                  onFilterChange({ sellers: newSellers });
                }}
                className="mr-2"
              />
              {seller.shopName}
            </label>
          ))}
        </div>
        {/* Load More Button */}
        {visibleSellers < sellers.length && (
          <button
            onClick={handleLoadMore}
            className="mt-2 font-medium hover:text-primary hover:underline"
          >
            Load more Seller&apos;s...
          </button>
        )}
      </div>

      {/* Availability */}
      <div className="mt-4">
      <h4 className="font-medium mb-2">Availability</h4>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="mr-2"
          />
          In Stock Only
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
