export default function BookingReceipt({ receipt }) {
  const rows = [
    ["Bank", receipt.bank_name],
    ["Principal", `₹${receipt.principal_amount.toLocaleString("en-IN")}`],
    ["Rate", `${receipt.interest_rate}% p.a.`],
    ["Duration", receipt.tenor_display],
    ["Interest Earned", `₹${receipt.interest_earned.toLocaleString("en-IN")}`],
    [
      "TDS",
      receipt.tds_applicable
        ? `₹${receipt.tds_amount.toLocaleString("en-IN")}`
        : "None",
    ],
    ["Booking Date", receipt.booking_date],
    ["Maturity Date", receipt.maturity_date],
    ["PAN", receipt.pan_number],
    ["Nominee", receipt.nominee_name],
  ];

  return (
    <div className="bg-white border-2 border-dashed border-saffron rounded-2xl p-5 w-full max-w-sm shadow-lg">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-2xl mb-1">🎉</div>
        <p className="font-bold text-charcoal text-lg">FD Booked Successfully!</p>
        <p className="text-xs text-muted font-mono mt-1 tracking-wider">
          {receipt.reference_number}
        </p>
        <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
          ✓ {receipt.status}
        </span>
      </div>

      {/* Maturity highlight */}
      <div className="bg-saffron-light rounded-xl p-4 mb-4 text-center">
        <p className="text-muted text-xs">You will receive on maturity</p>
        <p className="text-3xl font-bold text-saffron mt-1">
          ₹{receipt.net_maturity.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-muted mt-1">on {receipt.maturity_date}</p>
      </div>

      {/* Details table */}
      <div className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between items-start gap-2">
            <span className="text-muted flex-shrink-0">{label}</span>
            <span className="font-medium text-charcoal text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* DICGC badge */}
      {receipt.dicgc_insured && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-700 text-center">
          ✅ Insured up to ₹5 Lakh by DICGC (RBI)
        </div>
      )}

      {!receipt.dicgc_insured && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700 text-center">
          ⚠️ This is an NBFC — not covered by DICGC insurance
        </div>
      )}
    </div>
  );
}
