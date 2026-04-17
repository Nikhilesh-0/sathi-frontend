import { useApp } from "../../context/AppContext";

const LANGUAGES = [
  { code: "hindi", label: "हिंदी" },
  { code: "punjabi", label: "ਪੰਜਾਬੀ" },
  { code: "bengali", label: "বাংলা" },
];

export default function LanguagePicker() {
  const { language, changeLanguage } = useApp();

  return (
    <div className="flex gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            language === lang.code
              ? "bg-saffron text-white shadow-md"
              : "bg-white text-muted border border-border hover:border-saffron hover:text-saffron"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
