import { z } from "zod";
import { VENDOR_TRADES } from "./constants";

export const propertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  unitCount: z.coerce.number().int().min(1).default(1),
  type: z.enum(["residential", "commercial"]),
  accessInstructions: z.string().optional(),
  parkingInstructions: z.string().optional(),
  unitAccessNotes: z.string().optional(),
  specialInstructions: z.string().optional(),
  notes: z.string().optional(),
});

export const tenantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  propertyId: z.string().uuid("Invalid property"),
  unitNumber: z.string().optional(),
  leaseStart: z.coerce.date().optional(),
  leaseEnd: z.coerce.date().optional(),
});

export const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  trade: z.enum(VENDOR_TRADES),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  rateNotes: z.string().optional(),
  availabilityNotes: z.string().optional(),
  preferenceScore: z.coerce.number().min(0).max(1).default(0.5),
});

export const confidenceThresholdsSchema = z
  .object({
    high: z.coerce.number().min(0).max(1),
    medium: z.coerce.number().min(0).max(1),
  })
  .refine((d) => d.high > d.medium, {
    message: "High threshold must be greater than medium",
  });

export const spendingLimitsSchema = z.object({
  spendingLimit: z.coerce.number().int().min(0),
  emergencySpendingLimit: z.coerce.number().int().min(0),
});
