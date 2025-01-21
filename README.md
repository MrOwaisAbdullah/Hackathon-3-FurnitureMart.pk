# **FurnitureMart.pk – Hackathon Project**

FurnitureMart.pk is a dynamic chair marketplace developed during a 7-day hackathon. This repository contains the complete source code, reports, and documentation for the project. The platform enables users to browse furniture products, manage a cart, and perform seamless checkout operations.

---

## **Features**
- **Product Browsing**: Responsive product listing with search, filtering, and pagination.
- **Product Details**: Detailed product information, including related products and social sharing.
- **Cart Management**: Add, remove, and persist cart items with toast notifications.
- **Error Handling**: Graceful fallback messages for API failures and empty states.
- **Performance Optimization**: Optimized for fast loading on desktop and mobile devices.
- **Responsive Design**: Fully responsive across all screen sizes.

---

## **Day-Wise Summary**

### **Day 1: Marketplace Planning**
- Defined the purpose, business goals, and data schema for the marketplace.
- Focused on solving local challenges, such as lack of online presence for furniture sellers.
- **Outcome**: Clear plan for the marketplace's hybrid model (online + offline).

### **Day 2: Technical Foundation**
- Created Sanity schemas for `products`, `categories`, `users`, `orders`, and `reviews`.
- Planned API endpoints for cart, payment, and shipment integrations.
- **Outcome**: Detailed system architecture and API design.

### **Day 3: Data Migration and API Integration**
- Imported product and category data from external APIs into Sanity CMS.
- Created a migration script using `dotenv` and `@sanity/client`.
- **Outcome**: Successfully populated Sanity CMS with data and integrated APIs.

### **Day 4: Dynamic Frontend Development**
- Built reusable components: `ProductCard`, `ProductDetail`, `Cart`, `Header`, `Footer`, `Toast`, `FilterPanel`, `SearchBar`, `Pagination`, and `RelatedProducts`.
- Integrated dynamic data from Sanity CMS.
- **Outcome**: Interactive and responsive frontend for the marketplace.

### **Day 5: Testing and Performance Optimization**
- Tested key features such as cart persistence, filters, pagination, and error handling.
- Optimized performance using **GTmetrix**, **Lighthouse**, and **Google PageSpeed Insights**.
- **Outcome**: Achieved high performance scores and verified functionality.

### **Day 6: Deployment Preparation**
- Consolidated all code, documents, and reports into a single repository.
- Deployed the project to **Vercel**, ensuring a seamless staging environment.
- **Outcome**: Successfully deployed project with environment variables securely configured.

---
### **Tech Stack**
Frontend: Next.js, TypeScript, Tailwind CSS
Backend: Sanity CMS
APIs: Stripe (payment), ShipEngine (shipment tracking)
Deployment: Vercel
Testing: Cypress, Lighthouse, GTmetrix

---

- 📫 How to reach me **mrowaisabdullah@gmail.com**
