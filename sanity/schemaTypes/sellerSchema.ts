export const sellerSchema = {
  name: "seller",
  type: "document",
  title: "Seller",
  fields: [
    { name: "shopName", type: "string", title: "Shop Name" },
    { name: "clerkId", type: "string", title: "Clerk ID" },
    { name: "ownerName", type: "string", title: "Owner Name" },
    { name: "email", type: "string", title: "Email" },
    { name: "phone", type: "string", title: "Phone" },
    { name: "address", type: "text", title: "Address" },
    { 
      name: "businessType", 
      type: "string", 
      options: {
        list: [
          {title: "Showroom", value: "showroom"},
          {title: "Workshop", value: "workshop"},
          {title: "Both", value: "both"}
        ]
      }
    },
    { name: "isApproved", type: "boolean", initialValue: true, title: "Approved" },
    { name: "logo", type: "image", title: "Shop Logo" },
    { name: "role", type: "string", title: "Role", initialValue: "seller",
      options: {
        list: [
          {title: "Seller", value: "seller"},
          {title: "Admin", value: "admin"},
        ]
      }
    }
  ]
};