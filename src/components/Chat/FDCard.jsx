import { useState } from "react";

// Compound interest — quarterly compounding, same formula as booking_service.py
function calcMaturity(principal, rate, tenorMonths) {
  const n = 4; // quarterly
  const t = tenorMonths / 12;
  const r = rate / 100;
  return Math.round(principal * Math.pow(1 + r / n, n * t));
}

function formatINR(num) {
  return "₹" + Number(num).toLocaleString("en-IN");
}

export default function FDCard({ fd, onExplain }) {
  const [showCalc, setShowCalc] = useState(false);
  const [amount, setAmount] = useState("");

  const rateColor =
    fd.interest_rate >= 8.5
      ? "text-green-600"
      : fd.interest_rate >= 7.5
        ? "text-amber-600"
        : "text-blue-600";

  // Calculator derived values — only compute when amount is a valid number
  const principal = parseFloat(amount.replace(/,/g, ""));
  const hasValidAmount = !isNaN(principal) && principal > 0;
  const maturity = hasValidAmount ? calcMaturity(principal, fd.interest_rate, fd.tenor_months) : 0;
  const interest = hasValidAmount ? maturity - principal : 0;
  const annualInterest = hasValidAmount ? principal * (fd.interest_rate / 100) : 0;
  const tdsApplies = annualInterest > 40000;
  const tds = tdsApplies ? Math.round(interest * 0.1) : 0;
  const net = maturity - tds;

  return (
    <div className="bg-white border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm">
      {/* Bank name + tag */}
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

      {/* Rate */}
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

      {/* Info grid */}
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
            className={`font-medium ${fd.dicgc_insured ? "text-green-600" : "text-red-500"
              }`}
          >
            {fd.dicgc_insured ? "✓ Yes" : "✗ No"}
          </p>
        </div>
      </div>

      {/* Payout / withdrawal */}
      <div className="mt-3 pt-3 border-t border-border flex justify-between items-center text-xs text-muted">
        <span>{fd.payout_type} payout</span>
        {fd.premature_withdrawal && (
          <span>🔓 {fd.premature_withdrawal}</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setShowCalc((v) => !v)}
          className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-saffron text-saffron hover:bg-saffron hover:text-white transition-all"
        >
          {showCalc ? "✕ Close" : "🧮 Calculate Returns"}
        </button>
        {onExplain && (
          <button
            onClick={() => onExplain(fd)}
            className="flex-1 text-xs font-medium py-1.5 rounded-lg border border-border text-charcoal hover:border-saffron hover:text-saffron transition-all"
          >
            💬 Sathi, samjhao
          </button>
        )}
      </div>

      {/* Inline Calculator */}
      {showCalc && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs font-semibold text-charcoal mb-2">
            Calculate your returns
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted">₹</span>
            <input
              type="number"
              min="0"
              placeholder={`Min ₹${fd.min_amount.toLocaleString("en-IN")}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent bg-cream"
            />
          </div>

          {hasValidAmount ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted">Principal</span>
                <span className="font-medium text-charcoal">{formatINR(principal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Interest earned</span>
                <span className="font-medium text-green-600">+ {formatINR(interest)}</span>
              </div>
              {tdsApplies && (
                <div className="flex justify-between">
                  <span className="text-muted">TDS (10%)</span>
                  <span className="font-medium text-red-500">− {formatINR(tds)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-border">
                <span className="font-semibold text-charcoal">You receive</span>
                <span className="font-bold text-saffron text-sm">{formatINR(net)}</span>
              </div>
              <p className="text-muted text-center pt-1">
                After {fd.tenor_months} months · {fd.interest_rate}% p.a. quarterly compounding
                {tdsApplies && " · TDS deducted"}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted text-center py-1">
              Enter an amount to see your returns
            </p>
          )}
        </div>
      )}
    </div>
  );
}