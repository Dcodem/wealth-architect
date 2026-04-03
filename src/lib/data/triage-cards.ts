export interface ReviewCard {
  id: number;
  vendor: string;
  date: string;
  icon: string;
  suggestion: string;
  confidence: number;
  confDotClass: string;
  confBgClass: string;
  confTextClass: string;
  amount: string;
  property: string;
  source: string;
  location: string;
  ref: string;
  recommendation: string;
  similarTransactions: { vendor: string; date: string; amount: string }[];
}

export const initialCards: ReviewCard[] = [
  {
    id: 1,
    vendor: "GreenScape Landscaping",
    date: "Mar 13",
    icon: "local_florist",
    suggestion: "Maintenance",
    confidence: 88,
    confDotClass: "bg-green-500",
    confBgClass: "bg-green-50",
    confTextClass: "text-green-700",
    amount: "$2,420.00",
    property: "Main St. Loft",
    source: "Chase Business Checking (***4521)",
    location: "Downtown District",
    ref: "#TX-MSL-0044",
    recommendation:
      "This vendor has provided landscaping and seasonal planting for Main St. Loft common areas 6 times in the past 12 months. High confidence match to Maintenance.",
    similarTransactions: [
      { vendor: "GreenScape Landscaping", date: "Feb 10, 2024", amount: "$2,180.00" },
      { vendor: "GreenScape Landscaping", date: "Dec 22, 2023", amount: "$3,100.00" },
    ],
  },
  {
    id: 2,
    vendor: "Pinnacle Property Mgmt",
    date: "Mar 11",
    icon: "real_estate_agent",
    suggestion: "Estate Management",
    confidence: 96,
    confDotClass: "bg-green-500",
    confBgClass: "bg-green-50",
    confTextClass: "text-green-700",
    amount: "$4,500.00",
    property: "Oak Ridge Estate",
    source: "Wells Fargo Premium (***7832)",
    location: "North Highlands",
    ref: "#TX-OAK-0041",
    recommendation:
      "Quarterly property management fee from Pinnacle. This matches the recurring pattern exactly \u2014 same amount, same date window, same account. Auto-classification recommended.",
    similarTransactions: [
      { vendor: "Pinnacle Property Mgmt", date: "Dec 11, 2023", amount: "$4,500.00" },
      { vendor: "Pinnacle Property Mgmt", date: "Sep 11, 2023", amount: "$4,500.00" },
      { vendor: "Pinnacle Property Mgmt", date: "Jun 11, 2023", amount: "$4,200.00" },
    ],
  },
  {
    id: 3,
    vendor: "Heritage Restoration Co.",
    date: "Mar 10",
    icon: "diamond",
    suggestion: "Capital Improvement",
    confidence: 52,
    confDotClass: "bg-yellow-500",
    confBgClass: "bg-yellow-50",
    confTextClass: "text-yellow-700",
    amount: "$8,750.00",
    property: "Main St. Loft",
    source: "Amex Business Platinum (***3190)",
    location: "Downtown District",
    ref: "#TX-MSL-0039",
    recommendation:
      "Heritage Restoration specializes in historic building finishes. This transaction appears to be for lobby woodwork refinishing. The amount is higher than typical maintenance \u2014 manual verification is recommended to confirm whether this should be Capital Improvement or Maintenance.",
    similarTransactions: [
      { vendor: "Heritage Restoration Co.", date: "Oct 15, 2023", amount: "$6,200.00" },
      { vendor: "BuildRight Contractors", date: "Aug 3, 2023", amount: "$3,400.00" },
    ],
  },
  {
    id: 4,
    vendor: "Costco Business Center",
    date: "Mar 8",
    icon: "restaurant",
    suggestion: "Office Supplies",
    confidence: 94,
    confDotClass: "bg-green-500",
    confBgClass: "bg-green-50",
    confTextClass: "text-green-700",
    amount: "$840.00",
    property: "Oak Ridge Estate",
    source: "Wells Fargo Premium (***7832)",
    location: "North Highlands",
    ref: "#TX-OAK-0036",
    recommendation:
      "Recurring supplies order from Costco Business Center. Previous 8 transactions match this vendor and amount range. High confidence classification under Office Supplies for property maintenance stock.",
    similarTransactions: [
      { vendor: "Costco Business Center", date: "Feb 8, 2024", amount: "$780.00" },
      { vendor: "Costco Business Center", date: "Jan 8, 2024", amount: "$920.00" },
      { vendor: "Costco Business Center", date: "Dec 8, 2023", amount: "$1,050.00" },
    ],
  },
  {
    id: 5,
    vendor: "State Farm Insurance",
    date: "Mar 5",
    icon: "shield",
    suggestion: "Insurance",
    confidence: 99,
    confDotClass: "bg-green-500",
    confBgClass: "bg-green-50",
    confTextClass: "text-green-700",
    amount: "$3,250.00",
    property: "Main St. Loft",
    source: "Chase Business Checking (***4521)",
    location: "Downtown District",
    ref: "#TX-MSL-0033",
    recommendation:
      "Annual property and liability insurance premium via State Farm. Covers building structure, common areas, and landlord liability. Matches previous year exactly.",
    similarTransactions: [
      { vendor: "State Farm Insurance", date: "Mar 5, 2023", amount: "$3,100.00" },
      { vendor: "State Farm Insurance", date: "Mar 5, 2022", amount: "$2,920.00" },
    ],
  },
  {
    id: 6,
    vendor: "TruGreen Lawn Care",
    date: "Mar 3",
    icon: "park",
    suggestion: "Maintenance",
    confidence: 100,
    confDotClass: "bg-green-500",
    confBgClass: "bg-green-50",
    confTextClass: "text-green-700",
    amount: "$320.00",
    property: "Oak Ridge Estate",
    source: "Wells Fargo Premium (***7832)",
    location: "North Highlands",
    ref: "#TX-OAK-0030",
    recommendation:
      "Monthly grounds maintenance for Oak Ridge Estate. Vendor, amount, and cadence match exactly. High confidence auto-classification.",
    similarTransactions: [
      { vendor: "TruGreen Lawn Care", date: "Feb 3, 2024", amount: "$320.00" },
      { vendor: "TruGreen Lawn Care", date: "Jan 3, 2024", amount: "$320.00" },
    ],
  },
  {
    id: 7,
    vendor: "HVAC Masters Inc.",
    date: "Mar 1",
    icon: "air",
    suggestion: "Maintenance",
    confidence: 68,
    confDotClass: "bg-yellow-500",
    confBgClass: "bg-yellow-50",
    confTextClass: "text-yellow-700",
    amount: "$1,750.00",
    property: "Downtown Plaza",
    source: "Amex Business Platinum (***3190)",
    location: "Business District",
    ref: "#TX-DTP-0028",
    recommendation:
      "HVAC system service call from HVAC Masters. This vendor has been linked to both Maintenance and Capital Improvement in the past. The amount suggests a larger repair \u2014 manual review recommended to confirm classification.",
    similarTransactions: [
      { vendor: "HVAC Masters Inc.", date: "Dec 18, 2023", amount: "$1,200.00" },
      { vendor: "CoolAir Services", date: "Nov 5, 2023", amount: "$650.00" },
    ],
  },
];
