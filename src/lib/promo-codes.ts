export interface PromoCodeDefinition {
  code: string
  description: string
  isNewUserOnly: boolean
  minOrderAmount?: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
}

export const PROMO_CODES: Record<string, PromoCodeDefinition> = {
  FLATS: {
    code: 'FLATS',
    description: 'Flat 5% off on Pre-Paid Order',
    isNewUserOnly: true,
    discountType: 'percentage',
    discountValue: 5,
  },
  SAMV20: {
    code: 'SAMV20',
    description: 'Shop more than ₹1200, get ₹200 off',
    isNewUserOnly: false,
    minOrderAmount: 1200,
    discountType: 'fixed',
    discountValue: 200,
  },
  SAMV30: {
    code: 'SAMV30',
    description: 'Shop more than ₹1600, get ₹300 off',
    isNewUserOnly: false,
    minOrderAmount: 1600,
    discountType: 'fixed',
    discountValue: 300,
  },
}

export function isNewUser(userCreatedAt: Date | string): boolean {
  const createdAt = typeof userCreatedAt === 'string' 
    ? new Date(userCreatedAt) 
    : userCreatedAt
  const now = new Date()
  const daysSinceSignup = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceSignup <= 15
}

export function calculateDiscount(
  promoCode: string,
  subtotal: number,
  isNewUser: boolean
): number {
  const promo = PROMO_CODES[promoCode.toUpperCase()]
  if (!promo) {
    return 0
  }

  // Check if new user requirement is met
  if (promo.isNewUserOnly && !isNewUser) {
    return 0
  }

  // Check minimum order amount
  if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
    return 0
  }

  // Calculate discount
  if (promo.discountType === 'percentage') {
    return Math.round((subtotal * promo.discountValue) / 100)
  } else {
    return Math.min(promo.discountValue, subtotal) // Don't exceed subtotal
  }
}

export function validatePromoCode(
  promoCode: string,
  subtotal: number,
  isNewUser: boolean
): { valid: boolean; error?: string; discount?: number } {
  const code = promoCode.toUpperCase().trim()
  const promo = PROMO_CODES[code]

  if (!promo) {
    return { valid: false, error: 'Invalid promo code' }
  }

  if (promo.isNewUserOnly && !isNewUser) {
    return { valid: false, error: 'This promo code is only available for new users' }
  }

  if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
    return {
      valid: false,
      error: `Minimum order amount of ₹${promo.minOrderAmount} required for this promo code`,
    }
  }

  const discount = calculateDiscount(code, subtotal, isNewUser)
  return { valid: true, discount }
}

export function getPromoCodeDescription(code: string): string | undefined {
  return PROMO_CODES[code.toUpperCase()]?.description
}

