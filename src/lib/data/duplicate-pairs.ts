export interface TxnEntry {
  id: string;
  vendor: string;
  date: string;
  amount: string;
  icon: string;
  method: string;
  property: string;
  category: string;
  bankAccount: string;
  description: string;
}

export interface DuplicatePair {
  label: string;
  match: number;
  level: "high" | "medium" | "low";
  reason: string;
  a: TxnEntry;
  b: TxnEntry;
}

export const pairs: DuplicatePair[] = [
  {
    label: "Pair #1",
    match: 98,
    level: "high",
    reason: "Same vendor, date, amount, and bank account — likely a bank feed sync error.",
    a: { id: "TR-8821", vendor: "Pinnacle Property Management", date: "Oct 24, 2023", amount: "$12,450.00", icon: "receipt", method: "Bank Transfer", property: "Main St. Loft", category: "Property Management", bankAccount: "Chase Business Checking (***4521)", description: "Monthly property management fee for Main St. Loft covering October 2023. Includes concierge services, maintenance coordination, and tenant relations." },
    b: { id: "TR-8822", vendor: "Pinnacle Property Management", date: "Oct 24, 2023", amount: "$12,450.00", icon: "description", method: "Bank Transfer", property: "Main St. Loft", category: "Property Management", bankAccount: "Chase Business Checking (***4521)", description: "Duplicate entry from bank feed sync. Same vendor, date, and amount as TR-8821. Likely a processing error during the October batch import." },
  },
  {
    label: "Pair #2",
    match: 74,
    level: "medium",
    reason: "Same vendor and date, but amounts differ by $50 and different payment methods were used.",
    a: { id: "TR-9104", vendor: "GreenScape Landscaping", date: "Nov 02, 2023", amount: "$2,100.00", icon: "park", method: "Auto-Pay", property: "Oak Ridge Estate", category: "Maintenance", bankAccount: "Wells Fargo Premium (***7832)", description: "Monthly landscaping and pool maintenance service for Oak Ridge Estate. Covers lawn care, hedge trimming, and seasonal planting." },
    b: { id: "TR-9107", vendor: "GreenScape Landscaping", date: "Nov 02, 2023", amount: "$2,150.00", icon: "pool", method: "Amex Platinum", property: "Oak Ridge Estate", category: "Maintenance", bankAccount: "Amex Business Platinum (***3190)", description: "Grounds servicing and emergency sprinkler repair for Oak Ridge Estate. $50 surcharge for after-hours service call to repair irrigation system." },
  },
  {
    label: "Pair #3",
    match: 42,
    level: "low",
    reason: "Same amount and category, but different vendors and dates — likely separate transactions.",
    a: { id: "TR-8950", vendor: "Aria Private Jets Ltd", date: "Oct 15, 2023", amount: "$45,000.00", icon: "flight", method: "Wire Transfer", property: "N/A — Personal", category: "Travel", bankAccount: "Chase Business Checking (***4521)", description: "Private charter flight booking for property inspection trip. Round trip to Aspen, 2 passengers. Includes crew standby fees." },
    b: { id: "TR-8973", vendor: "NetJets Executive", date: "Oct 18, 2023", amount: "$45,000.00", icon: "flight_takeoff", method: "Wire Transfer", property: "N/A — Personal", category: "Travel", bankAccount: "Chase Business Checking (***4521)", description: "Fractional jet ownership quarterly usage fee. Pre-paid block hours for Q4 2023 through NetJets executive program." },
  },
  {
    label: "Pair #4",
    match: 91,
    level: "high",
    reason: "Same vendor, same amount, and same bank account — appears to be a duplicate insurance premium payment processed twice.",
    a: { id: "TR-9210", vendor: "State Farm Property Insurance", date: "Nov 10, 2023", amount: "$8,750.00", icon: "shield", method: "Auto-Pay", property: "Downtown Plaza", category: "Insurance", bankAccount: "Amex Business Platinum (***3190)", description: "Quarterly property insurance premium for Downtown Plaza. Comprehensive coverage including flood, liability, and high-value contents protection." },
    b: { id: "TR-9211", vendor: "State Farm Property Insurance", date: "Nov 10, 2023", amount: "$8,750.00", icon: "verified_user", method: "Auto-Pay", property: "Downtown Plaza", category: "Insurance", bankAccount: "Amex Business Platinum (***3190)", description: "Duplicate auto-pay trigger for State Farm quarterly premium. System processed payment twice due to bank confirmation delay on Nov 10." },
  },
  {
    label: "Pair #5",
    match: 65,
    level: "medium",
    reason: "Same vendor and similar amounts, but transactions are 12 days apart — could be a late re-billing or a separate service call.",
    a: { id: "TR-9305", vendor: "HVAC Masters Inc.", date: "Nov 15, 2023", amount: "$3,200.00", icon: "ac_unit", method: "Bank Transfer", property: "Main St. Loft", category: "Maintenance", bankAccount: "Chase Business Checking (***4521)", description: "Scheduled annual HVAC maintenance and filter replacement for Main St. Loft. Includes inspection of all three climate zones." },
    b: { id: "TR-9342", vendor: "HVAC Masters Inc.", date: "Nov 27, 2023", amount: "$3,400.00", icon: "thermostat", method: "Bank Transfer", property: "Main St. Loft", category: "Maintenance", bankAccount: "Chase Business Checking (***4521)", description: "Emergency HVAC repair call for Main St. Loft unit 4B zone. Compressor replacement and refrigerant recharge. $200 after-hours surcharge included." },
  },
  {
    label: "Pair #6",
    match: 38,
    level: "low",
    reason: "Different vendors and different dates, but identical amount and category — most likely coincidental.",
    a: { id: "TR-9088", vendor: "Artisan Stone & Marble Co.", date: "Nov 01, 2023", amount: "$18,500.00", icon: "countertops", method: "Wire Transfer", property: "Oak Ridge Estate", category: "Renovation", bankAccount: "Wells Fargo Premium (***7832)", description: "Custom marble countertop installation for the Oak Ridge Estate kitchen remodel. Includes Calacatta Gold slab sourcing and precision cutting." },
    b: { id: "TR-9155", vendor: "Prescott Custom Cabinetry", date: "Nov 08, 2023", amount: "$18,500.00", icon: "kitchen", method: "Wire Transfer", property: "Oak Ridge Estate", category: "Renovation", bankAccount: "Wells Fargo Premium (***7832)", description: "Handcrafted walnut cabinetry for the Oak Ridge Estate kitchen renovation. Phase 2 of 3 — upper cabinets, island build-out, and hardware fitting." },
  },
  {
    label: "Pair #7",
    match: 95,
    level: "high",
    reason: "Exact match on vendor, amount, category, and bank account — strong indicator of a double-posted monthly fee.",
    a: { id: "TR-9401", vendor: "SecureWatch Protection Services", date: "Dec 01, 2023", amount: "$6,800.00", icon: "security", method: "Auto-Pay", property: "Downtown Plaza", category: "Security", bankAccount: "Amex Business Platinum (***3190)", description: "Monthly 24/7 security patrol and monitoring fee for Downtown Plaza. Includes armed response team, CCTV monitoring, and perimeter checks." },
    b: { id: "TR-9402", vendor: "SecureWatch Protection Services", date: "Dec 01, 2023", amount: "$6,800.00", icon: "local_police", method: "Auto-Pay", property: "Downtown Plaza", category: "Security", bankAccount: "Amex Business Platinum (***3190)", description: "Duplicate auto-pay entry for SecureWatch monthly fee. Same amount and date as TR-9401 — likely triggered by a billing system retry." },
  },
];
