export default function FDCard({ fd }) {
  const rateColor =
    fd.interest_rate >= 8.5
      ? "text-green-600"
      : fd.interest_rate >= 7.5
      ? "text-amber-600"
      : "text-blue-600";

  return (
    <div className="bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-charcoal text-sm leading-tight">
            {fd.bank_name}
          </p>
          <p className="text-xs text-muted mt-0.5">{fd.bank_type}</p>
        </div>
        {fd.tag && (
          <span className="text-xs bg-saffron-light text-saffron font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
            {fd.tag}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1 mb-3">
        <span className={`text-3xl font-bold ${rateColor}`}>
          {fd.interest_rate}%
        </span>
        <span className="text-muted text-sm mb-1">p.a.</span>
        {fd.senior_citizen_extra > 0 && (
          <span className="text-xs text-green-600 mb-1 ml-1">
            +{fd.senior_citizen_extra}% for seniors
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-cream rounded-lg p-2">
          <p className="text-muted">Tenor</p>
          <p className="font-medium text-charcoal">{fd.tenor_months} months</p>
        </div>
        <div className="bg-cream rounded-lg p-2">
          <p className="text-muted">Min Amount</p>
          <p className="font-medium text-charcoal">
            ₹{fd.min_amount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-cream rounded-lg p-2">
          <p className="text-muted">₹10K grows to</p>
          <p className="font-medium text-charcoal">
            ₹{fd.maturity_on_10000.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-cream rounded-lg p-2">
          <p className="text-muted">DICGC Insured</p>
          <p
            className={`font-medium ${
              fd.dicgc_insured ? "text-green-600" : "text-red-500"
            }`}
          >
            {fd.dicgc_insured ? "✓ Yes" : "✗ No"}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex justify-between items-center text-xs text-muted">
        <span>{fd.payout_type} payout</span>
        {fd.premature_withdrawal && (
          <span>🔓 {fd.premature_withdrawal}</span>
        )}
      </div>
    </div>
  );
}
