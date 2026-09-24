// Single source of truth for turning a product's raw price/discount fields
// into what the customer actually pays. Used for both display (strikethrough
// price) and the amount charged (cart/buy-now), so the two can never drift.

export function getDiscountPercentage(product) {
  if (!product?.is_on_offer) return 0;
  const pct = Number(product?.discount_percentage) || 0;
  return pct > 0 && pct <= 100 ? pct : 0;
}

export function getDiscountedPrice(product) {
  const price = Number(product?.price) || 0;
  const pct = getDiscountPercentage(product);
  if (!pct) return price;
  return Math.round((price - (price * pct) / 100) * 100) / 100;
}

export function hasDiscount(product) {
  return getDiscountPercentage(product) > 0;
}
