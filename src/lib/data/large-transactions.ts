export interface LargeTransaction {
  slug: string;
  vendor: string;
  date: string;
  amount: string;
  method: string;
  tags: { label: string; style: string }[];
  icon: string;
  hasReceipt: boolean;
  receiptNote: string;
  flagged: boolean;
}

export const allTransactions: LargeTransaction[] = [
  {
    slug: "precision-architectural",
    vendor: "Precision Architectural Studio",
    date: "Oct 24, 2023 \u2022 14:32 PM",
    amount: "$8,245.00",
    method: "Bank Transfer",
    tags: [
      { label: "Renovation", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Main St. Loft", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "electric_bolt",
    hasReceipt: true,
    receiptNote: "\u201CPhase 2 design fees for the master suite expansion.\u201D",
    flagged: false,
  },
  {
    slug: "eden-landscaping",
    vendor: "Eden Landscaping Group",
    date: "Oct 22, 2023 \u2022 09:15 AM",
    amount: "$4,500.00",
    method: "Amex Platinum",
    tags: [
      { label: "Maintenance", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Oak Ridge Estate", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "park",
    hasReceipt: false,
    receiptNote: "",
    flagged: true,
  },
  {
    slug: "city-power-grid",
    vendor: "City Power & Grid",
    date: "Oct 20, 2023 \u2022 11:45 AM",
    amount: "$2,489.55",
    method: "Auto-Pay",
    tags: [
      { label: "Utilities", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Downtown Plaza", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "electric_bolt",
    hasReceipt: true,
    receiptNote: "\u201CHigh seasonal consumption due to pool heating.\u201D",
    flagged: false,
  },
  {
    slug: "elite-security-systems",
    vendor: "Elite Security Systems",
    date: "Oct 18, 2023 \u2022 16:20 PM",
    amount: "$3,750.00",
    method: "Wire Transfer",
    tags: [
      { label: "Security", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Main St. Loft", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "security",
    hasReceipt: true,
    receiptNote: "\u201CQuarterly surveillance system maintenance and camera upgrades.\u201D",
    flagged: false,
  },
  {
    slug: "royal-plumbing",
    vendor: "Royal Plumbing & Heating",
    date: "Oct 16, 2023 \u2022 10:00 AM",
    amount: "$1,875.00",
    method: "Chase Business",
    tags: [
      { label: "Maintenance", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Main St. Loft", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "plumbing",
    hasReceipt: true,
    receiptNote: "\u201CEmergency boiler repair and pipe replacement.\u201D",
    flagged: true,
  },
  {
    slug: "summit-insurance",
    vendor: "Summit Property Insurance",
    date: "Oct 14, 2023 \u2022 08:30 AM",
    amount: "$6,200.00",
    method: "Auto-Pay",
    tags: [
      { label: "Insurance", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "All Properties", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "shield",
    hasReceipt: true,
    receiptNote: "\u201CAnnual premium for comprehensive property coverage.\u201D",
    flagged: false,
  },
  {
    slug: "premier-cleaning",
    vendor: "Premier Cleaning Co.",
    date: "Oct 12, 2023 \u2022 13:45 PM",
    amount: "$1,200.00",
    method: "Amex Platinum",
    tags: [
      { label: "Maintenance", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Downtown Plaza", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "cleaning_services",
    hasReceipt: false,
    receiptNote: "",
    flagged: false,
  },
  {
    slug: "metro-elevator",
    vendor: "Metro Elevator Services",
    date: "Oct 10, 2023 \u2022 11:15 AM",
    amount: "$4,100.00",
    method: "Wire Transfer",
    tags: [
      { label: "Capital Improvement", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Downtown Plaza", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "elevator",
    hasReceipt: true,
    receiptNote: "\u201CElevator modernization — phase 1 of 3.\u201D",
    flagged: false,
  },
  {
    slug: "luxe-interiors",
    vendor: "Luxe Interiors & Design",
    date: "Oct 08, 2023 \u2022 15:00 PM",
    amount: "$12,500.00",
    method: "Wire Transfer",
    tags: [
      { label: "Renovation", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Oak Ridge Estate", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "design_services",
    hasReceipt: true,
    receiptNote: "\u201CKitchen redesign consultation and material sourcing.\u201D",
    flagged: false,
  },
  {
    slug: "coastal-roofing",
    vendor: "Coastal Roofing Experts",
    date: "Oct 05, 2023 \u2022 09:30 AM",
    amount: "$7,800.00",
    method: "Bank Transfer",
    tags: [
      { label: "Capital Improvement", style: "bg-secondary-fixed-dim/30 text-on-secondary-container" },
      { label: "Oak Ridge Estate", style: "bg-primary-fixed-dim/30 text-primary-container" },
    ],
    icon: "roofing",
    hasReceipt: true,
    receiptNote: "\u201CComplete roof inspection and shingle replacement.\u201D",
    flagged: true,
  },
];
