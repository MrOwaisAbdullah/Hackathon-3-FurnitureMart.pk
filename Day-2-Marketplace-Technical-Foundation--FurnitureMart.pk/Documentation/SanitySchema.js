// !!!Important Note!!! Wrote these Schemas as objects because, there only has to be one schema in a single file

// Store details about furniture products.
const ProductSchema = {
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    { name: "name", type: "string", title: "Product Name" },
    { name: "slug", type: "slug", title: "Slug" },
    { name: "price", type: "number", title: "Price" },
    { name: "description", type: "text", title: "Description" },
    { name: "image", type: "image", title: "Product Image" },
    { name: "category", type: "string", title: "Category" },
    { name: "stock", type: "number", title: "Stock Level" },
    { name: "tags", type: "array", of: [{ type: "string" }], title: "Tags" },
    {
      name: "customizationOptions",
      type: "array",
      of: [{ type: "string" }],
      title: "Customization Options",
      description:
        "List of available customization options (e.g., colors, sizes).",
    },
    {
      name: "customizationRequest",
      type: "text",
      title: "Customization Request",
      description: "Allow users to write their customization requirements.",
    },
    {
      name: "seller",
      type: "reference",
      to: [{ type: "seller" }],
      title: "Seller",
      description: "The seller/showroom offering this product.",
    },
  ],
};

// Store details about sellers/showrooms.
const sellerSchema = {
  name: "seller",
  type: "document",
  title: "Seller",
  fields: [
    { name: "name", type: "string", title: "Name" },
    { name: "email", type: "string", title: "Email" },
    { name: "phone", type: "string", title: "Phone" },
    { name: "address", type: "text", title: "Address" },
    { name: "logo", type: "image", title: "Logo" },
    {
      name: "products",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      title: "Products",
      description: "List of products offered by this seller.",
    },
  ],
};


// Store cart data in Sanity
const cart = {
  name: "cart",
  type: "document",
  title: "Cart",
  fields: [
    {
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "User",
      description: "The user who owns this cart",
    },
    {
      name: "items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
              title: "Product",
            },
            {
              name: "quantity",
              type: "number",
              title: "Quantity",
            },
          ],
        },
      ],
      title: "Cart Items",
      description: "List of products in the cart",
    },
    {
      name: "totalPrice",
      type: "number",
      title: "Total Price",
    },
  ],
};



// Store details about customer orders.
const orders = {
  name: "order",
  type: "document",
  title: "Order",
  fields: [
    {
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "user",
      description: "The customer who placed this order.",
    },
    {
      name: "products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
              title: "Product",
            },
            { name: "quantity", type: "number", title: "Quantity" },
          ],
        },
      ],
      title: "Products",
      description: "List of products in this order.",
    },
    { name: "totalPrice", type: "number", title: "Total Price" },
    { name: "paymentStatus", type: "string", title: "Payment Status" },
    { name: "trackingNumber", type: "string", title: "Tracking Number" },
    { name: "orderDate", type: "datetime", title: "Order Date" },
  ],
};

// Store customer reviews for products.
const reviews = {
  name: "review",
  type: "document",
  title: "Review",
  fields: [
    {
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      title: "Product",
      description: "The product being reviewed.",
    },
    {
      name: "user",
      type: "reference",
      to: [{ type: "user" }],
      title: "user",
      description: "The customer who wrote this review.",
    },
    { name: "rating", type: "number", title: "Rating" },
    { name: "comment", type: "text", title: "Comment" },
    { name: "date", type: "datetime", title: "Date" },
    {
      name: "moderationStatus",
      type: "string",
      title: "Moderation Status",
      options: { list: ["Pending", "Approved", "Rejected"] },
    },
  ],
};


// Store details about the user.
const user = {
  name: "user",
  type: "document",
  title: "User",
  fields: [
    { name: "name", type: "string", title: "Full Name" },
    { name: "email", type: "string", title: "Email" },
    {
      name: "password",
      type: "string",
      title: "Password",
      description: "Store hashed passwords only!",
    },
    { name: "phone", type: "string", title: "Phone Number" },
    { name: "address", type: "text", title: "Address" },
  ],
};

