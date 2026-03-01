"use client";

interface CountryCardProps {
  flag: string;
  name: string;
  universities: string;
  color: string;
}

export default function CountryCard({
  flag,
  name,
  universities,
  color,
}: CountryCardProps) {
  return (
    <div
      className="country-card"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}55`;
        (e.currentTarget as HTMLElement).style.boxShadow =
          `0 8px 30px ${color}25`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.08)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <span className="country-flag">{flag}</span>
      <div className="country-name">{name}</div>
      <div className="country-unis">{universities} universities</div>
    </div>
  );
}
