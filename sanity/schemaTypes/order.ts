import { defineType, defineField } from "sanity";

export const orderSchema = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      description: "A unique identifier for the order.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "user" }], // Reference to the user schema
      description: "The customer who placed the order.",
    }),
    defineField({
      name: "sellers",
      title: "Sellers",
      type: "array", 
      of: [
        {
          type: "reference",
          to: [{ type: "seller" }], // Reference to the seller schema
        },
      ],
      description: "The sellers associated with this order.",
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "products" }], // Reference to the product schema
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        },
      ],
      description: "List of products in the order.",
    }),
    defineField({
      name: "total",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
      description: "Total amount of the order.",
    }),
    defineField({
      name: "paymentDetails",
      title: "Payment Details",
      type: "object",
      fields: [
        defineField({
          name: "amountPaid",
          title: "Amount Paid",
          type: "number",
          validation: (Rule) => Rule.required().min(0),
          description: "Amount paid by the customer in advance.",
        }),
        defineField({
          name: "paymentMethod",
          title: "Payment Method",
          type: "string",
          options: {
            list: [
              { title: "Cash", value: "cash" },
              { title: "Credit Card", value: "credit_card" },
              { title: "Bank Transfer", value: "bank_transfer" },
              { title: "Other", value: "other" },
            ],
          },
          validation: (Rule) => Rule.required(),
          description: "Payment method used by the customer.",
        }),
        defineField({
          name: "transactionId",
          title: "Transaction ID",
          type: "string",
          description: "Transaction ID for the payment (if applicable).",
        }),
      ],
      description: "Details of the payment made by the customer.",
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: "Current status of the order.",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Partially Paid", value: "partially_paid" },
          { title: "Failed", value: "failed" },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: "Payment status of the order.",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({
          name: "street",
          title: "Street",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "state",
          title: "State",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
      ],
      description: "Shipping address for the order.",
    }),
  ],
  preview: {
    select: {
      customer: "customer.name",
      total: "total",
      status: "status",
      createdAt: "createdAt",
    },
    prepare(selection) {
      const { customer, total, status, createdAt } = selection;
      return {
        title: `Order by ${customer}`,
        subtitle: `Total: $${total} | Status: ${status} | Date: ${new Date(
          createdAt
        ).toLocaleDateString()}`,
      };
    },
  },
});