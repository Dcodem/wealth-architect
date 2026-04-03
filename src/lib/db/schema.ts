import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  real,
  jsonb,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────

export const propertyTypeEnum = pgEnum("property_type", [
  "residential",
  "commercial",
]);

export const caseSourceEnum = pgEnum("case_source", ["email", "sms"]);

export const caseCategoryEnum = pgEnum("case_category", [
  "maintenance",
  "noise_complaint",
  "lease_question",
  "payment",
  "emergency",
  "general",
]);

export const caseUrgencyEnum = pgEnum("case_urgency", [
  "critical",
  "high",
  "medium",
  "low",
]);

export const caseStatusEnum = pgEnum("case_status", [
  "open",
  "in_progress",
  "waiting_on_vendor",
  "waiting_on_tenant",
  "resolved",
  "closed",
]);

export const vendorTradeEnum = pgEnum("vendor_trade", [
  "plumber",
  "electrician",
  "hvac",
  "general",
  "locksmith",
  "appliance_repair",
  "pest_control",
  "cleaning",
  "landscaping",
  "roofing",
  "painting",
  "other",
]);

// ─── Tables ──────────────────────────────────────────────

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  emailAddress: text("email_address").unique(),
  twilioPhoneNumber: text("twilio_phone_number"),
  spendingLimit: integer("spending_limit").default(50000),
  emergencySpendingLimit: integer("emergency_spending_limit").default(100000),
  defaultUrgencyTimers: jsonb("default_urgency_timers").$type<{
    critical: { vendorResponse: number; reminder: number; nextVendor: number; pmEscalation: number };
    high: { vendorResponse: number; reminder: number; nextVendor: number; pmEscalation: number };
    medium: { vendorResponse: number; reminder: number; nextVendor: number; pmEscalation: number };
    low: { vendorResponse: number; reminder: number; nextVendor: number; pmEscalation: number };
  }>(),
  confidenceThresholds: jsonb("confidence_thresholds").$type<{
    high: number;
    medium: number;
  }>().default({ high: 0.85, medium: 0.5 }),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  orgId: uuid("org_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  name: text("name").notNull(),
  role: text("role").notNull().default("owner"),
  notificationPreferences: jsonb("notification_preferences").$type<{
    urgentChannel: "sms" | "email";
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
    quietHoursTimezone: string;
  }>().default({
    urgentChannel: "sms",
    quietHoursStart: null,
    quietHoursEnd: null,
    quietHoursTimezone: "America/New_York",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  address: text("address").notNull(),
  unitCount: integer("unit_count").default(1),
  type: propertyTypeEnum("type").default("residential").notNull(),
  accessInstructions: text("access_instructions"),
  parkingInstructions: text("parking_instructions"),
  unitAccessNotes: text("unit_access_notes"),
  specialInstructions: text("special_instructions"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .references(() => properties.id, { onDelete: "cascade" })
    .notNull(),
  orgId: uuid("org_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  unitNumber: text("unit_number"),
  leaseStart: timestamp("lease_start"),
  leaseEnd: timestamp("lease_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  trade: vendorTradeEnum("trade").notNull(),
  email: text("email"),
  phone: text("phone"),
  rateNotes: text("rate_notes"),
  availabilityNotes: text("availability_notes"),
  preferenceScore: real("preference_score").default(0.5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cases = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  propertyId: uuid("property_id").references(() => properties.id),
  source: caseSourceEnum("source").notNull(),
  rawMessage: text("raw_message").notNull(),
  category: caseCategoryEnum("category"),
  urgency: caseUrgencyEnum("urgency"),
  confidenceScore: real("confidence_score"),
  status: caseStatusEnum("status").default("open").notNull(),
  spendingAuthorized: integer("spending_authorized"),
  spendingApprovedBy: text("spending_approved_by"),
  vendorId: uuid("vendor_id").references(() => vendors.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
});

export const caseTimeline = pgTable("case_timeline", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id")
    .references(() => cases.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  details: text("details"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const processedMessages = pgTable("processed_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  externalMessageId: text("external_message_id").notNull(),
  source: caseSourceEnum("source").notNull(),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});

export const messageLogDirectionEnum = pgEnum("message_log_direction", [
  "inbound",
  "outbound",
]);

export const messageLogStatusEnum = pgEnum("message_log_status", [
  "sent",
  "delivered",
  "failed",
  "bounced",
  "received",
]);

export const messageLog = pgTable("message_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  caseId: uuid("case_id").references(() => cases.id),
  direction: messageLogDirectionEnum("direction").notNull(),
  channel: caseSourceEnum("channel").notNull(), // reuse "email" | "sms"
  externalMessageId: text("external_message_id"),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  messageType: text("message_type").notNull(), // tenant_reply, pm_notification, etc.
  status: messageLogStatusEnum("status").notNull(),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MessageLog = typeof messageLog.$inferSelect;
export type NewMessageLog = typeof messageLog.$inferInsert;

// ─── Type Exports ────────────────────────────────────────

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;
export type CaseTimelineEntry = typeof caseTimeline.$inferSelect;
export type NewCaseTimelineEntry = typeof caseTimeline.$inferInsert;
