import Link from "next/link";

export function AddPropertyButton() {
  return (
    <Link
      href="/properties/new"
      className="group bg-primary-fixed/50 rounded-2xl overflow-hidden border-2 border-dashed border-outline-variant/30 hover:border-primary/50 transition-all flex flex-col items-center justify-center p-12 text-center cursor-pointer"
    >
      <div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-3xl">add_home</span>
      </div>
      <h4 className="text-xl font-extrabold text-on-surface mb-2">
        Expand Portfolio
      </h4>
      <p className="text-sm text-on-surface-variant max-w-[180px]">
        Add a new commercial or residential asset to your ledger.
      </p>
    </Link>
  );
}
