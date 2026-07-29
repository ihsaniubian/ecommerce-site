export default function StarRating({ rating = 0, count, size = "md" }) {
  const stars = [1, 2, 3, 4, 5];
  const textSize = size === "sm" ? "text-xs" : "text-base";

  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <span className="text-saffron" aria-hidden="true">
        {stars.map((s) => (s <= Math.round(rating) ? "★" : "☆")).join("")}
      </span>
      {count !== undefined && <span className="text-ink/50">({count})</span>}
    </div>
  );
}
