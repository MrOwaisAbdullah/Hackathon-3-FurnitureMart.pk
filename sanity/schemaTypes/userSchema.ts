import { defineType, defineField } from "sanity";

export const userSchema = defineType({
  name: "user",
  title: "User",
  type: "document",
  fields: [
    defineField({
      name: "clerkId",
      title: "Clerk ID",
      type: "string",
      description: "The ID of the user in Clerk.",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "The name of the user.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "The email of the user.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobile",
      title: "Mobile Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        defineField({
          name: "street",
          title: "Street",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
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
          validation: (Rule) => Rule.required(),
        }),
      ],
      description: "The address of the user.",
    }),
    defineField({
      name: "addressHistory",
      type: "array",
      title: "Address History",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "street",
              title: "Street",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "city",
              title: "City",
              type: "string",
              validation: (Rule) => Rule.required(),
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
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description: "The address History of the user.",
    }),
    defineField({
      name: 'previousPhones',
      type: 'array',
      title: 'Previous Phone Numbers',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'previousEmails',
      type: 'array',
      title: 'Previous Emails',
      of: [{ type: 'string' }],
    }),
  ],
});
