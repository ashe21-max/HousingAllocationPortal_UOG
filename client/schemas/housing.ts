import { z } from "zod";

export const housingSchema = z.object({
  buildingName: z.string().trim().min(2, "Building name must be at least 2 characters."),
  blockNumber: z.string().trim().min(1, "Block number is required."),
  roomNumber: z.string().trim().min(1, "Room number is required."),
  roomType: z.enum(["Studio", "1-Bedroom", "2-Bedroom", "3-Bedroom"]),
  condition: z.enum(["New", "Good", "Needs Repair", "Under Maintenance"]),
  status: z.enum(["Available", "Occupied", "Reserved"]),
  location: z.string().trim().min(2, "Location must be at least 2 characters."),
});

export type HousingFormValues = z.infer<typeof housingSchema>;

export const housingUpdateSchema = z
  .object({
    buildingName: z.string().trim().min(2, "Building name must be at least 2 characters."),
    blockNumber: z.string().trim().min(1, "Block number is required."),
    roomNumber: z.string().trim().min(1, "Room number is required."),
    roomType: z.enum(["Studio", "1-Bedroom", "2-Bedroom", "3-Bedroom"]),
    status: z.enum(["Available", "Occupied", "Reserved"]),
    condition: z.enum(["New", "Good", "Needs Repair", "Under Maintenance"]),
    location: z.string().trim().min(2, "Location must be at least 2 characters."),
  })
  .partial()
  .refine(
    (value) =>
      Boolean(
        value.buildingName ||
          value.blockNumber ||
          value.roomNumber ||
          value.roomType ||
          value.status ||
          value.condition ||
          value.location,
      ),
    {
      message: "Update at least one field.",
      path: ["buildingName"],
    },
  );

export type HousingUpdateFormValues = z.infer<typeof housingUpdateSchema>;
