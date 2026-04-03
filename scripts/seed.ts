import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required. Set it in .env.local");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

// ─── Seed Data ──────────────────────────────────────────

const ORG_ID = "00000000-0000-4000-a000-000000000001";
const USER_ID = "00000000-0000-4000-a000-000000000010";

const PROPERTY_IDS = [
  "00000000-0000-4000-a000-000000000101",
  "00000000-0000-4000-a000-000000000102",
  "00000000-0000-4000-a000-000000000103",
  "00000000-0000-4000-a000-000000000104",
  "00000000-0000-4000-a000-000000000105",
  "00000000-0000-4000-a000-000000000107",
];

const TENANT_IDS = [
  "00000000-0000-4000-a000-000000000201",
  "00000000-0000-4000-a000-000000000202",
  "00000000-0000-4000-a000-000000000203",
  "00000000-0000-4000-a000-000000000204",
  "00000000-0000-4000-a000-000000000205",
  "00000000-0000-4000-a000-000000000206",
  "00000000-0000-4000-a000-000000000207",
  "00000000-0000-4000-a000-000000000208",
  "00000000-0000-4000-a000-000000000209",
  "00000000-0000-4000-a000-000000000210",
  "00000000-0000-4000-a000-000000000211",
  "00000000-0000-4000-a000-000000000212",
  "00000000-0000-4000-a000-000000000213",
  "00000000-0000-4000-a000-000000000214",
];

const VENDOR_IDS = [
  "00000000-0000-4000-a000-000000000301",
  "00000000-0000-4000-a000-000000000302",
  "00000000-0000-4000-a000-000000000303",
  "00000000-0000-4000-a000-000000000304",
  "00000000-0000-4000-a000-000000000305",
  "00000000-0000-4000-a000-000000000306",
  "00000000-0000-4000-a000-000000000307",
];

const CASE_IDS = [
  "00000000-0000-4000-a000-000000000401",
  "00000000-0000-4000-a000-000000000402",
  "00000000-0000-4000-a000-000000000403",
  "00000000-0000-4000-a000-000000000404",
  "00000000-0000-4000-a000-000000000405",
  "00000000-0000-4000-a000-000000000406",
  "00000000-0000-4000-a000-000000000407",
  "00000000-0000-4000-a000-000000000408",
  "00000000-0000-4000-a000-000000000409",
  "00000000-0000-4000-a000-000000000410",
];

async function seed() {
  console.log("🌱 Seeding PropAgent database...\n");

  // ─── Clean existing seed data ───────────────────────
  console.log("  Cleaning existing seed data...");
  await db.delete(schema.caseTimeline).execute();
  await db.delete(schema.messageLog).execute();
  await db.delete(schema.processedMessages).execute();
  await db.delete(schema.cases).execute();
  await db.delete(schema.tenants).execute();
  await db.delete(schema.vendors).execute();
  await db.delete(schema.properties).execute();
  await db.delete(schema.users).execute();
  await db.delete(schema.organizations).execute();

  // ─── Organization ───────────────────────────────────
  console.log("  Creating organization...");
  await db.insert(schema.organizations).values({
    id: ORG_ID,
    name: "Sunrise Property Management",
    slug: "sunrise-pm",
    emailAddress: "inbox@sunrise.propagent.dev",
    twilioPhoneNumber: "+15550001234",
    spendingLimit: 50000,
    emergencySpendingLimit: 100000,
    confidenceThresholds: { high: 0.85, medium: 0.5 },
    defaultUrgencyTimers: {
      critical: { vendorResponse: 10, reminder: 15, nextVendor: 20, pmEscalation: 30 },
      high: { vendorResponse: 30, reminder: 60, nextVendor: 120, pmEscalation: 180 },
      medium: { vendorResponse: 1440, reminder: 2160, nextVendor: 2880, pmEscalation: 2880 },
      low: { vendorResponse: 2880, reminder: 4320, nextVendor: 10080, pmEscalation: 10080 },
    },
    onboardingCompleted: true,
  });

  // ─── User ───────────────────────────────────────────
  const userEmail = process.argv[2] || "pm@sunrise-pm.com";
  console.log(`  Creating user (${userEmail})...`);
  await db.insert(schema.users).values({
    id: USER_ID,
    orgId: ORG_ID,
    email: userEmail,
    phone: "+15550009999",
    name: "Alex Rivera",
    role: "owner",
    notificationPreferences: {
      urgentChannel: "sms",
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      quietHoursTimezone: "America/New_York",
    },
  });

  // ─── Properties ─────────────────────────────────────
  console.log("  Creating properties...");
  await db.insert(schema.properties).values([
    {
      id: PROPERTY_IDS[0],
      orgId: ORG_ID,
      address: "142 Oak Street, Austin, TX 78701",
      unitCount: 4,
      type: "residential",
      accessInstructions: "Lockbox code: 4821. Located on front porch.",
      parkingInstructions: "Visitor parking in rear lot, spots 20-24.",
      unitAccessNotes: "Units 1A-1B on ground floor, 2A-2B on second floor.",
      specialInstructions: "Quiet hours enforced 10pm-8am per HOA.",
      notes: "Built in 2018. Last full inspection: Jan 2026.",
    },
    {
      id: PROPERTY_IDS[1],
      orgId: ORG_ID,
      address: "88 Commerce Blvd, Austin, TX 78702",
      unitCount: 1,
      type: "commercial",
      accessInstructions: "Key with front desk. After hours, call building security at 555-0188.",
      parkingInstructions: "Underground garage, any unmarked spot.",
      notes: "Commercial lease. Tenant handles interior maintenance.",
    },
    {
      id: PROPERTY_IDS[2],
      orgId: ORG_ID,
      address: "7 Maple Lane, Austin, TX 78703",
      unitCount: 2,
      type: "residential",
      accessInstructions: "Garage code: 7734. Side door is always unlocked during business hours.",
      parkingInstructions: "Driveway or street parking.",
      unitAccessNotes: "Unit A is downstairs duplex, Unit B is upstairs.",
      notes: "Older property, plumbing can be finicky. Prefer AceFix Plumbing for this address.",
    },
    {
      id: PROPERTY_IDS[3],
      orgId: ORG_ID,
      address: "310 Congress Ave, Austin, TX 78701",
      unitCount: 8,
      type: "residential",
      accessInstructions: "Fob entry. Visitor buzzer at front door, dial unit number.",
      parkingInstructions: "Garage access via alley. Visitor spots labeled V1-V4.",
      unitAccessNotes: "Units 101-104 ground floor, 201-204 second floor. Elevator available.",
      specialInstructions: "No smoking anywhere on property. Pet deposit required.",
      notes: "Mid-rise built 2021. Roof inspection due Oct 2026.",
    },
    {
      id: PROPERTY_IDS[4],
      orgId: ORG_ID,
      address: "45 Rainey Street, Austin, TX 78701",
      unitCount: 6,
      type: "residential",
      accessInstructions: "Keypad code: 9102. After hours, use side gate code: 5577.",
      parkingInstructions: "Assigned spots in covered garage. No visitor parking — use street.",
      unitAccessNotes: "Three floors, two units per floor (A/B).",
      notes: "High-demand area. Full occupancy since opening. Last HVAC service: Feb 2026.",
    },
    {
      id: PROPERTY_IDS[5],
      orgId: ORG_ID,
      address: "22 Barton Springs Rd, Austin, TX 78704",
      unitCount: 4,
      type: "residential",
      accessInstructions: "Lockbox on gate: 3356. Ring doorbell camera for tenant.",
      parkingInstructions: "Two-car driveway per unit. Street parking also available.",
      unitAccessNotes: "Townhome-style. Each unit has private entrance.",
      specialInstructions: "Landscaping maintained by ClearView Landscaping, bi-weekly schedule.",
      notes: "Townhomes built 2019. Solar panels on all units — tenants get credit on electric bill.",
    },
  ]);

  // ─── Tenants ────────────────────────────────────────
  console.log("  Creating tenants...");
  await db.insert(schema.tenants).values([
    {
      id: TENANT_IDS[0],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Jordan Chen",
      email: "jordan.chen@email.com",
      phone: "+15550101001",
      unitNumber: "1A",
      leaseStart: new Date("2025-06-01"),
      leaseEnd: new Date("2026-05-31"),
    },
    {
      id: TENANT_IDS[1],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Samantha Okafor",
      email: "s.okafor@email.com",
      phone: "+15550101002",
      unitNumber: "1B",
      leaseStart: new Date("2025-09-01"),
      leaseEnd: new Date("2026-08-31"),
    },
    {
      id: TENANT_IDS[2],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Marcus Williams",
      email: "m.williams@email.com",
      phone: "+15550101003",
      unitNumber: "2A",
      leaseStart: new Date("2025-03-01"),
      leaseEnd: new Date("2026-02-28"),
    },
    {
      id: TENANT_IDS[3],
      propertyId: PROPERTY_IDS[0],
      orgId: ORG_ID,
      name: "Priya Patel",
      email: "priya.p@email.com",
      phone: "+15550101004",
      unitNumber: "2B",
      leaseStart: new Date("2025-07-01"),
      leaseEnd: new Date("2026-06-30"),
    },
    {
      id: TENANT_IDS[4],
      propertyId: PROPERTY_IDS[2],
      orgId: ORG_ID,
      name: "Emily Larsson",
      email: "emily.l@email.com",
      phone: "+15550101005",
      unitNumber: "A",
      leaseStart: new Date("2025-01-15"),
      leaseEnd: new Date("2026-01-14"),
    },
    {
      id: TENANT_IDS[5],
      propertyId: PROPERTY_IDS[2],
      orgId: ORG_ID,
      name: "David Kim",
      email: "d.kim@email.com",
      phone: "+15550101006",
      unitNumber: "B",
      leaseStart: new Date("2025-11-01"),
      leaseEnd: new Date("2026-10-31"),
    },
    // 310 Congress Ave tenants
    {
      id: TENANT_IDS[6],
      propertyId: PROPERTY_IDS[3],
      orgId: ORG_ID,
      name: "Olivia Reyes",
      email: "olivia.reyes@email.com",
      phone: "+15550101007",
      unitNumber: "101",
      leaseStart: new Date("2025-04-01"),
      leaseEnd: new Date("2026-03-31"),
    },
    {
      id: TENANT_IDS[7],
      propertyId: PROPERTY_IDS[3],
      orgId: ORG_ID,
      name: "James Thornton",
      email: "j.thornton@email.com",
      phone: "+15550101008",
      unitNumber: "202",
      leaseStart: new Date("2025-08-15"),
      leaseEnd: new Date("2026-08-14"),
    },
    {
      id: TENANT_IDS[8],
      propertyId: PROPERTY_IDS[3],
      orgId: ORG_ID,
      name: "Aisha Mohammed",
      email: "aisha.m@email.com",
      phone: "+15550101009",
      unitNumber: "204",
      leaseStart: new Date("2025-10-01"),
      leaseEnd: new Date("2026-09-30"),
    },
    // 45 Rainey Street tenants
    {
      id: TENANT_IDS[9],
      propertyId: PROPERTY_IDS[4],
      orgId: ORG_ID,
      name: "Ben Nakamura",
      email: "ben.n@email.com",
      phone: "+15550101010",
      unitNumber: "1A",
      leaseStart: new Date("2025-05-01"),
      leaseEnd: new Date("2026-04-30"),
    },
    {
      id: TENANT_IDS[10],
      propertyId: PROPERTY_IDS[4],
      orgId: ORG_ID,
      name: "Sofia Gutierrez",
      email: "sofia.g@email.com",
      phone: "+15550101011",
      unitNumber: "2B",
      leaseStart: new Date("2025-07-01"),
      leaseEnd: new Date("2026-06-30"),
    },
    {
      id: TENANT_IDS[11],
      propertyId: PROPERTY_IDS[4],
      orgId: ORG_ID,
      name: "Tyler Washington",
      email: "t.washington@email.com",
      phone: "+15550101012",
      unitNumber: "3A",
      leaseStart: new Date("2025-02-01"),
      leaseEnd: new Date("2026-01-31"),
    },
    // 22 Barton Springs tenants
    {
      id: TENANT_IDS[12],
      propertyId: PROPERTY_IDS[5],
      orgId: ORG_ID,
      name: "Rachel Park",
      email: "rachel.park@email.com",
      phone: "+15550101013",
      unitNumber: "1",
      leaseStart: new Date("2025-06-15"),
      leaseEnd: new Date("2026-06-14"),
    },
    {
      id: TENANT_IDS[13],
      propertyId: PROPERTY_IDS[5],
      orgId: ORG_ID,
      name: "Derek Okonkwo",
      email: "derek.o@email.com",
      phone: "+15550101014",
      unitNumber: "3",
      leaseStart: new Date("2025-09-01"),
      leaseEnd: new Date("2026-08-31"),
    },
  ]);

  // ─── Vendors ────────────────────────────────────────
  console.log("  Creating vendors...");
  await db.insert(schema.vendors).values([
    {
      id: VENDOR_IDS[0],
      orgId: ORG_ID,
      name: "AceFix Plumbing",
      trade: "plumber",
      email: "dispatch@acefix.com",
      phone: "+15550201001",
      rateNotes: "$95/hr, $150 emergency call-out fee",
      availabilityNotes: "M-F 7am-6pm, emergency line 24/7",
      preferenceScore: 0.9,
    },
    {
      id: VENDOR_IDS[1],
      orgId: ORG_ID,
      name: "BrightSpark Electric",
      trade: "electrician",
      email: "jobs@brightspark.com",
      phone: "+15550201002",
      rateNotes: "$110/hr, free estimates",
      availabilityNotes: "M-F 8am-5pm, Sat by appointment",
      preferenceScore: 0.85,
    },
    {
      id: VENDOR_IDS[2],
      orgId: ORG_ID,
      name: "CoolBreeze HVAC",
      trade: "hvac",
      email: "service@coolbreeze.com",
      phone: "+15550201003",
      rateNotes: "$125/hr, seasonal maintenance packages available",
      availabilityNotes: "M-Sat 7am-7pm, emergency 24/7 Jun-Sep",
      preferenceScore: 0.75,
    },
    {
      id: VENDOR_IDS[3],
      orgId: ORG_ID,
      name: "HandyPro Services",
      trade: "general",
      email: "book@handypro.com",
      phone: "+15550201004",
      rateNotes: "$75/hr, minimum 2 hours",
      availabilityNotes: "M-F 9am-5pm",
      preferenceScore: 0.7,
    },
    {
      id: VENDOR_IDS[4],
      orgId: ORG_ID,
      name: "LockTight Security",
      trade: "locksmith",
      email: "service@locktight.com",
      phone: "+15550201005",
      rateNotes: "$85 lockout, $150 rekey, $250+ smart lock install",
      availabilityNotes: "24/7 emergency lockout service",
      preferenceScore: 0.88,
    },
    {
      id: VENDOR_IDS[5],
      orgId: ORG_ID,
      name: "ClearView Landscaping",
      trade: "landscaping",
      email: "team@clearviewlandscape.com",
      phone: "+15550201006",
      rateNotes: "$200/visit standard, $350/visit full service",
      availabilityNotes: "M-Sat, seasonal contracts available",
      preferenceScore: 0.82,
    },
    {
      id: VENDOR_IDS[6],
      orgId: ORG_ID,
      name: "AppliancePro Repair",
      trade: "appliance_repair",
      email: "dispatch@appliancepro.com",
      phone: "+15550201007",
      rateNotes: "$95 diagnostic + parts/labor, most repairs under $300",
      availabilityNotes: "M-F 8am-6pm, Sat 9am-2pm",
      preferenceScore: 0.78,
    },
  ]);

  // ─── Cases ──────────────────────────────────────────
  console.log("  Creating cases...");
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);

  await db.insert(schema.cases).values([
    {
      id: CASE_IDS[0],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[0],
      propertyId: PROPERTY_IDS[0],
      source: "sms",
      rawMessage: "Hey, the kitchen sink is leaking badly. Water is pooling on the floor under the cabinet. Can someone come fix this ASAP?",
      category: "maintenance",
      urgency: "high",
      confidenceScore: 0.92,
      status: "in_progress",
      vendorId: VENDOR_IDS[0],
      createdAt: hoursAgo(3),
      updatedAt: hoursAgo(1),
    },
    {
      id: CASE_IDS[1],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[2],
      propertyId: PROPERTY_IDS[0],
      source: "email",
      rawMessage: "There's a burning smell coming from the electrical outlet in the living room. I've unplugged everything but the smell persists. This feels dangerous.",
      category: "emergency",
      urgency: "critical",
      confidenceScore: 0.97,
      status: "waiting_on_vendor",
      vendorId: VENDOR_IDS[1],
      createdAt: hoursAgo(1),
      updatedAt: hoursAgo(0.5),
    },
    {
      id: CASE_IDS[2],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[4],
      propertyId: PROPERTY_IDS[2],
      source: "email",
      rawMessage: "Hi, I wanted to ask about my lease renewal options. My lease ends in January and I'd like to discuss terms for staying another year.",
      category: "lease_question",
      urgency: "low",
      confidenceScore: 0.88,
      status: "waiting_on_tenant",
      createdAt: hoursAgo(48),
      updatedAt: hoursAgo(24),
    },
    {
      id: CASE_IDS[3],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[1],
      propertyId: PROPERTY_IDS[0],
      source: "sms",
      rawMessage: "The people in unit 2A are playing really loud music again. It's past midnight and I can't sleep. This is the third time this month.",
      category: "noise_complaint",
      urgency: "medium",
      confidenceScore: 0.78,
      status: "resolved",
      createdAt: hoursAgo(72),
      updatedAt: hoursAgo(48),
      resolvedAt: hoursAgo(48),
    },
    // Case 5: HVAC issue at 310 Congress
    {
      id: CASE_IDS[4],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[6],
      propertyId: PROPERTY_IDS[3],
      source: "email",
      rawMessage: "The AC in my unit has been blowing warm air since yesterday. It's 95 degrees outside and my apartment is getting really uncomfortable. I've checked the thermostat and filter — both seem fine.",
      category: "maintenance",
      urgency: "high",
      confidenceScore: 0.91,
      status: "waiting_on_vendor",
      vendorId: VENDOR_IDS[2],
      createdAt: hoursAgo(8),
      updatedAt: hoursAgo(6),
    },
    // Case 6: Lockout at 45 Rainey
    {
      id: CASE_IDS[5],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[9],
      propertyId: PROPERTY_IDS[4],
      source: "sms",
      rawMessage: "Hi, I locked myself out of my unit and my spare key is inside. Is there someone who can help me get back in? I'm standing outside 1A right now.",
      category: "emergency",
      urgency: "high",
      confidenceScore: 0.95,
      status: "in_progress",
      vendorId: VENDOR_IDS[4],
      createdAt: hoursAgo(2),
      updatedAt: hoursAgo(1.5),
    },
    // Case 7: Payment question at 310 Congress
    {
      id: CASE_IDS[6],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[7],
      propertyId: PROPERTY_IDS[3],
      source: "email",
      rawMessage: "I noticed my rent payment didn't go through this month. My bank shows the transfer was rejected. Can you check on your end? I want to make sure I don't get a late fee.",
      category: "payment",
      urgency: "medium",
      confidenceScore: 0.86,
      status: "waiting_on_tenant",
      createdAt: hoursAgo(36),
      updatedAt: hoursAgo(12),
    },
    // Case 8: Appliance repair at Barton Springs
    {
      id: CASE_IDS[7],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[12],
      propertyId: PROPERTY_IDS[5],
      source: "sms",
      rawMessage: "The dishwasher in my unit stopped working mid-cycle. It's making a grinding noise and won't drain. Water is sitting in the bottom.",
      category: "maintenance",
      urgency: "medium",
      confidenceScore: 0.89,
      status: "open",
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(5),
    },
    // Case 9: Pest control at 45 Rainey (resolved)
    {
      id: CASE_IDS[8],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[10],
      propertyId: PROPERTY_IDS[4],
      source: "email",
      rawMessage: "I've been seeing small ants in the kitchen, especially near the sink area. They come in trails from under the baseboard. I've tried store-bought spray but they keep coming back.",
      category: "maintenance",
      urgency: "low",
      confidenceScore: 0.83,
      status: "resolved",
      createdAt: hoursAgo(168),
      updatedAt: hoursAgo(96),
      resolvedAt: hoursAgo(96),
    },
    // Case 10: Noise at Barton Springs (closed)
    {
      id: CASE_IDS[9],
      orgId: ORG_ID,
      tenantId: TENANT_IDS[13],
      propertyId: PROPERTY_IDS[5],
      source: "sms",
      rawMessage: "The construction crew next door starts at 6:30 AM every morning. Is there anything the building can do? My lease says quiet hours until 8 AM.",
      category: "noise_complaint",
      urgency: "low",
      confidenceScore: 0.72,
      status: "closed",
      createdAt: hoursAgo(240),
      updatedAt: hoursAgo(192),
      resolvedAt: hoursAgo(200),
      closedAt: hoursAgo(192),
    },
  ]);

  // ─── Timeline Entries ───────────────────────────────
  console.log("  Creating timeline entries...");
  await db.insert(schema.caseTimeline).values([
    // Case 1: Kitchen sink leak (high, in_progress)
    { caseId: CASE_IDS[0], type: "case_created", details: "Case created from inbound SMS", createdAt: hoursAgo(3) },
    { caseId: CASE_IDS[0], type: "classified", details: "AI classified as maintenance/high (confidence: 0.92)", metadata: { category: "maintenance", urgency: "high", confidence: 0.92 }, createdAt: hoursAgo(2.95) },
    { caseId: CASE_IDS[0], type: "replied_to_tenant", details: "Acknowledged issue and informed tenant a plumber is being contacted", createdAt: hoursAgo(2.9) },
    { caseId: CASE_IDS[0], type: "pm_notified", details: "PM notified via SMS about high-urgency maintenance case", createdAt: hoursAgo(2.9) },
    { caseId: CASE_IDS[0], type: "vendor_dispatched", details: "Work order sent to AceFix Plumbing", metadata: { vendorId: VENDOR_IDS[0], vendorName: "AceFix Plumbing" }, createdAt: hoursAgo(2.85) },
    { caseId: CASE_IDS[0], type: "vendor_accepted", details: "AceFix Plumbing accepted. ETA: 2 hours", metadata: { eta: "2 hours" }, createdAt: hoursAgo(2.5) },
    { caseId: CASE_IDS[0], type: "status_change", details: "Status changed to in progress", createdAt: hoursAgo(2.5) },
    { caseId: CASE_IDS[0], type: "replied_to_tenant", details: "Informed tenant: plumber confirmed, arriving in approximately 2 hours", createdAt: hoursAgo(2.45) },

    // Case 2: Electrical emergency (critical, waiting on vendor)
    { caseId: CASE_IDS[1], type: "case_created", details: "Case created from inbound email", createdAt: hoursAgo(1) },
    { caseId: CASE_IDS[1], type: "classified", details: "AI classified as emergency/critical (confidence: 0.97)", metadata: { category: "emergency", urgency: "critical", confidence: 0.97 }, createdAt: hoursAgo(0.98) },
    { caseId: CASE_IDS[1], type: "replied_to_tenant", details: "URGENT: Acknowledged. Do not use the outlet. If you see smoke, evacuate and call 911. An electrician is being dispatched now.", createdAt: hoursAgo(0.97) },
    { caseId: CASE_IDS[1], type: "pm_notified", details: "PM notified via SMS about CRITICAL electrical emergency", createdAt: hoursAgo(0.97) },
    { caseId: CASE_IDS[1], type: "vendor_dispatched", details: "Emergency work order sent to BrightSpark Electric", metadata: { vendorId: VENDOR_IDS[1], vendorName: "BrightSpark Electric" }, createdAt: hoursAgo(0.95) },
    { caseId: CASE_IDS[1], type: "status_change", details: "Status changed to waiting on vendor", createdAt: hoursAgo(0.95) },

    // Case 3: Lease question (low, waiting on tenant)
    { caseId: CASE_IDS[2], type: "case_created", details: "Case created from inbound email", createdAt: hoursAgo(48) },
    { caseId: CASE_IDS[2], type: "classified", details: "AI classified as lease_question/low (confidence: 0.88)", metadata: { category: "lease_question", urgency: "low", confidence: 0.88 }, createdAt: hoursAgo(47.9) },
    { caseId: CASE_IDS[2], type: "replied_to_tenant", details: "Thanked tenant for reaching out. Informed them the PM will follow up with renewal options.", createdAt: hoursAgo(47.8) },
    { caseId: CASE_IDS[2], type: "pm_notified", details: "PM notified via email about lease renewal inquiry", createdAt: hoursAgo(47.8) },
    { caseId: CASE_IDS[2], type: "status_change", details: "Status changed to waiting on tenant", createdAt: hoursAgo(24) },

    // Case 4: Noise complaint (medium, resolved)
    { caseId: CASE_IDS[3], type: "case_created", details: "Case created from inbound SMS", createdAt: hoursAgo(72) },
    { caseId: CASE_IDS[3], type: "classified", details: "AI classified as noise_complaint/medium (confidence: 0.78)", metadata: { category: "noise_complaint", urgency: "medium", confidence: 0.78 }, createdAt: hoursAgo(71.9) },
    { caseId: CASE_IDS[3], type: "replied_to_tenant", details: "Acknowledged complaint. PM has been notified and will address the issue with the other tenant.", createdAt: hoursAgo(71.8) },
    { caseId: CASE_IDS[3], type: "pm_notified", details: "PM notified via SMS about noise complaint — third incident this month", createdAt: hoursAgo(71.8) },
    { caseId: CASE_IDS[3], type: "note", details: "Spoke with tenant in 2A. They apologized and agreed to keep music volume down after 10pm.", createdAt: hoursAgo(60) },
    { caseId: CASE_IDS[3], type: "replied_to_tenant", details: "Issue has been addressed with the neighboring tenant. Please let us know if it happens again.", createdAt: hoursAgo(50) },
    { caseId: CASE_IDS[3], type: "status_change", details: "Status changed to resolved", createdAt: hoursAgo(48) },

    // Case 5: HVAC issue (high, waiting_on_vendor)
    { caseId: CASE_IDS[4], type: "case_created", details: "Case created from inbound email", createdAt: hoursAgo(8) },
    { caseId: CASE_IDS[4], type: "classified", details: "AI classified as maintenance/high (confidence: 0.91)", metadata: { category: "maintenance", urgency: "high", confidence: 0.91 }, createdAt: hoursAgo(7.95) },
    { caseId: CASE_IDS[4], type: "replied_to_tenant", details: "We're sorry about the AC issue. An HVAC technician is being dispatched today.", createdAt: hoursAgo(7.9) },
    { caseId: CASE_IDS[4], type: "pm_notified", details: "PM notified about HVAC failure at 310 Congress #101 — high temps forecasted", createdAt: hoursAgo(7.9) },
    { caseId: CASE_IDS[4], type: "vendor_dispatched", details: "Work order sent to CoolBreeze HVAC", metadata: { vendorId: VENDOR_IDS[2], vendorName: "CoolBreeze HVAC" }, createdAt: hoursAgo(7.8) },
    { caseId: CASE_IDS[4], type: "status_change", details: "Status changed to waiting on vendor", createdAt: hoursAgo(6) },

    // Case 6: Lockout (high, in_progress)
    { caseId: CASE_IDS[5], type: "case_created", details: "Case created from inbound SMS", createdAt: hoursAgo(2) },
    { caseId: CASE_IDS[5], type: "classified", details: "AI classified as emergency/high (confidence: 0.95)", metadata: { category: "emergency", urgency: "high", confidence: 0.95 }, createdAt: hoursAgo(1.98) },
    { caseId: CASE_IDS[5], type: "replied_to_tenant", details: "Help is on the way! A locksmith has been contacted and should arrive within 30 minutes.", createdAt: hoursAgo(1.95) },
    { caseId: CASE_IDS[5], type: "vendor_dispatched", details: "Emergency dispatch to LockTight Security", metadata: { vendorId: VENDOR_IDS[4], vendorName: "LockTight Security" }, createdAt: hoursAgo(1.9) },
    { caseId: CASE_IDS[5], type: "vendor_accepted", details: "LockTight Security accepted. ETA: 25 minutes", metadata: { eta: "25 minutes" }, createdAt: hoursAgo(1.8) },
    { caseId: CASE_IDS[5], type: "status_change", details: "Status changed to in progress", createdAt: hoursAgo(1.5) },

    // Case 7: Payment question (medium, waiting_on_tenant)
    { caseId: CASE_IDS[6], type: "case_created", details: "Case created from inbound email", createdAt: hoursAgo(36) },
    { caseId: CASE_IDS[6], type: "classified", details: "AI classified as payment/medium (confidence: 0.86)", metadata: { category: "payment", urgency: "medium", confidence: 0.86 }, createdAt: hoursAgo(35.9) },
    { caseId: CASE_IDS[6], type: "pm_notified", details: "PM notified about payment issue for James Thornton, unit 202", createdAt: hoursAgo(35.8) },
    { caseId: CASE_IDS[6], type: "replied_to_tenant", details: "We've checked and the payment was returned by your bank. No late fee will be applied if resolved within 5 business days. Please retry the payment or contact your bank.", createdAt: hoursAgo(24) },
    { caseId: CASE_IDS[6], type: "status_change", details: "Status changed to waiting on tenant", createdAt: hoursAgo(12) },

    // Case 8: Dishwasher (medium, open)
    { caseId: CASE_IDS[7], type: "case_created", details: "Case created from inbound SMS", createdAt: hoursAgo(5) },
    { caseId: CASE_IDS[7], type: "classified", details: "AI classified as maintenance/medium (confidence: 0.89)", metadata: { category: "maintenance", urgency: "medium", confidence: 0.89 }, createdAt: hoursAgo(4.95) },
    { caseId: CASE_IDS[7], type: "replied_to_tenant", details: "Thanks for reporting this. Please avoid running the dishwasher until a technician can take a look. We'll schedule a repair.", createdAt: hoursAgo(4.9) },
    { caseId: CASE_IDS[7], type: "pm_notified", details: "PM notified about broken dishwasher at 22 Barton Springs #1", createdAt: hoursAgo(4.9) },

    // Case 9: Pest control (low, resolved)
    { caseId: CASE_IDS[8], type: "case_created", details: "Case created from inbound email", createdAt: hoursAgo(168) },
    { caseId: CASE_IDS[8], type: "classified", details: "AI classified as maintenance/low (confidence: 0.83)", metadata: { category: "maintenance", urgency: "low", confidence: 0.83 }, createdAt: hoursAgo(167.9) },
    { caseId: CASE_IDS[8], type: "replied_to_tenant", details: "We'll arrange pest control for your unit. In the meantime, try to keep food in sealed containers and wipe down surfaces.", createdAt: hoursAgo(167.8) },
    { caseId: CASE_IDS[8], type: "note", details: "Scheduled pest control treatment for building. Notified all tenants of treatment window.", createdAt: hoursAgo(144) },
    { caseId: CASE_IDS[8], type: "replied_to_tenant", details: "Pest control treated your unit and common areas. Please report if you see any further activity after 48 hours.", createdAt: hoursAgo(120) },
    { caseId: CASE_IDS[8], type: "note", details: "Tenant confirmed ants are gone after follow-up check.", createdAt: hoursAgo(98) },
    { caseId: CASE_IDS[8], type: "status_change", details: "Status changed to resolved", createdAt: hoursAgo(96) },

    // Case 10: Construction noise (low, closed)
    { caseId: CASE_IDS[9], type: "case_created", details: "Case created from inbound SMS", createdAt: hoursAgo(240) },
    { caseId: CASE_IDS[9], type: "classified", details: "AI classified as noise_complaint/low (confidence: 0.72)", metadata: { category: "noise_complaint", urgency: "low", confidence: 0.72 }, createdAt: hoursAgo(239.9) },
    { caseId: CASE_IDS[9], type: "replied_to_tenant", details: "We understand the frustration. We're looking into the construction schedule and will follow up.", createdAt: hoursAgo(239.8) },
    { caseId: CASE_IDS[9], type: "pm_notified", details: "PM notified about early-morning construction noise complaint", createdAt: hoursAgo(239.8) },
    { caseId: CASE_IDS[9], type: "note", details: "Contacted construction site manager. They agreed to delay start time to 7:30 AM on weekdays.", createdAt: hoursAgo(216) },
    { caseId: CASE_IDS[9], type: "replied_to_tenant", details: "Construction crew has agreed to start no earlier than 7:30 AM. The project is expected to wrap up in 3 weeks.", createdAt: hoursAgo(210) },
    { caseId: CASE_IDS[9], type: "status_change", details: "Status changed to resolved", createdAt: hoursAgo(200) },
    { caseId: CASE_IDS[9], type: "status_change", details: "Status changed to closed — construction completed", createdAt: hoursAgo(192) },
  ]);

  console.log("\n✅ Seed complete!\n");
  console.log("  Organization: Sunrise Property Management");
  console.log("  Properties:   6");
  console.log("  Tenants:      14");
  console.log("  Vendors:      7");
  console.log("  Cases:        10 (with 60+ timeline entries)");
  console.log(`  User email:   ${userEmail}`);
  console.log(`  User ID:      ${USER_ID}`);
  console.log("");
  console.log("⚠️  IMPORTANT: Create a matching Supabase Auth user:");
  console.log(`  1. Go to your Supabase dashboard → Authentication → Users`);
  console.log(`  2. Click "Add user" → "Create new user"`);
  console.log(`  3. Email: ${userEmail}`);
  console.log(`  4. Password: set a password`);
  console.log(`  5. User UID: ${USER_ID}`);
  console.log(`     (If Supabase auto-generates a different UID, update the`);
  console.log(`      users table: UPDATE users SET id = '<new-uid>' WHERE id = '${USER_ID}')`);
  console.log("");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
