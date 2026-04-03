import Link from "next/link";
import Image from "next/image";

type Property = {
  id: string;
  address: string;
  unitCount: number | null;
  type: string;
  purchasePrice: number | null;
  currentValue: number | null;
  ownershipPercentage: number | null;
  monthlyRent: number | null;
  imageUrl: string | null;
};

const TYPE_GRADIENTS: Record<string, string> = {
  residential: "from-blue-900/80 via-blue-800/60 to-slate-900/80",
  commercial: "from-primary/80 via-primary-container/60 to-slate-900/80",
};

const TYPE_ICONS: Record<string, string> = {
  residential: "home",
  commercial: "corporate_fare",
};

// Map property addresses to AI-generated photos
const PROPERTY_PHOTOS: Record<string, string> = {
  "142 Oak Street, Austin, TX 78701": "/properties/142-oak-street.jpg",
  "88 Commerce Blvd, Austin, TX 78702": "/properties/88-commerce-blvd.jpg",
  "7 Maple Lane, Austin, TX 78703": "/properties/7-maple-lane.jpg",
  "310 Congress Ave, Austin, TX 78701": "/properties/310-congress-ave.jpg",
  "45 Rainey Street, Austin, TX 78701": "/properties/45-rainey-street.jpg",
  "22 Barton Springs Rd, Austin, TX 78704": "/properties/22-barton-springs.jpg",
};

export function PropertyCard({
  property,
  activeCases,
}: {
  property: Property;
  activeCases: number;
}) {
  const gradient = TYPE_GRADIENTS[property.type] ?? TYPE_GRADIENTS.residential;
  const photo = PROPERTY_PHOTOS[property.address];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/10 hover:border-primary/20 hover:shadow-lg transition-all duration-300 card-shadow"
    >
      <div className="h-48 overflow-hidden relative">
        {photo ? (
          <Image
            src={photo}
            alt={property.address}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} group-hover:scale-105 transition-transform duration-500`} />
        )}
        <div className="absolute top-3 right-3">
          {activeCases > 0 ? (
            <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-[11px] font-bold uppercase tracking-wider shadow-sm">
              {activeCases} Active {activeCases === 1 ? "Case" : "Cases"}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-success-container text-on-success-container text-[11px] font-bold uppercase tracking-wider shadow-sm">
              No Issues
            </span>
          )}
        </div>
      </div>
      <div className="p-6 text-left space-y-3">
        <div>
          <h4 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
            {property.address}
          </h4>
          <div className="flex items-center gap-1 text-on-surface-variant mt-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-sm capitalize">{property.type}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Value</p>
            <p className="text-base font-bold text-on-surface tabular-nums">
              {property.currentValue
                ? `$${(property.currentValue / 1000).toFixed(0)}K`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Rent/mo</p>
            <p className="text-base font-bold text-on-surface tabular-nums">
              {property.monthlyRent
                ? `$${property.monthlyRent.toLocaleString()}`
                : "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Units</p>
            <p className="text-base font-bold text-on-surface">{property.unitCount ?? 1}</p>
          </div>
        </div>
        {/* Activity summary */}
        <div className={`pt-2 border-t border-outline-variant/10 flex items-center gap-1.5 ${
          activeCases > 0 ? "text-warning-dim" : "text-success-dim"
        }`}>
          <span className="material-symbols-outlined text-sm">
            {activeCases > 0 ? "build" : "check_circle"}
          </span>
          <span className="text-xs font-medium">
            {activeCases > 0
              ? `${activeCases} active case${activeCases > 1 ? "s" : ""} \u2014 needs attention`
              : "All clear \u2014 no open issues"}
          </span>
        </div>
      </div>
    </Link>
  );
}
