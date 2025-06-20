import type { Price } from '@prisma/client'

/**
 * Enumerates subscription plan names.
 * These are used as unique identifiers in both the database and Stripe dashboard.
 */
export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  LOCAL: 'local',
  VISITING: 'visiting',
} as const

export type Plan = (typeof PLANS)[keyof typeof PLANS]

/**
 * Enumerates billing intervals for subscription plans.
 */
export const INTERVALS = {
  YEAR: 'year',
} as const

export type Interval = (typeof INTERVALS)[keyof typeof INTERVALS]

/**
 * Enumerates supported currencies for billing.
 */
export const CURRENCIES = {
  DEFAULT: 'usd',
  USD: 'usd',
  EUR: 'eur',
} as const

export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES]

/**
 * Defines the structure for each subscription plan.
 *
 * Note:
 * - Running the Prisma seed will create these plans in your Stripe Dashboard and populate the database.
 * - Each plan includes pricing details for each interval and currency.
 * - Plan IDs correspond to the Stripe plan IDs for easy identification.
 * - 'name' and 'description' fields are used in Stripe Checkout and client UI.
 */
export const PRICING_PLANS = {
  [PLANS.FREE]: {
    id: PLANS.FREE,
    name: 'Free',
    description: 'Start with the basics, upgrade anytime.',
    prices: {
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0,
      },
    },
  },
  [PLANS.PRO]: {
    id: PLANS.PRO,
    name: 'Pro',
    description: 'Access to all features and unlimited projects.',
    prices: {
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 1990,
        [CURRENCIES.EUR]: 1990,
      },
    },
  },
  [PLANS.LOCAL]: {
    id: PLANS.LOCAL,
    name: 'Local',
    description: 'Access to our local club chat and voting rights.',
    prices: {
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 8500,
        [CURRENCIES.EUR]: 8500,
      },
    },
  },
  [PLANS.VISITING]: {
    id: PLANS.VISITING,
    name: 'Visiting',
    description: 'Access to all features and unlimited projects.',
    prices: {
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 3500,
        [CURRENCIES.EUR]: 3500,
      },
    },
  },


} satisfies PricingPlan

/**
 * A type helper defining prices for each billing interval and currency.
 */
type PriceInterval<I extends Interval = Interval, C extends Currency = Currency> = {
  [interval in I]: {
    [currency in C]: Price['amount']
  }
}

/**
 * A type helper defining the structure for subscription pricing plans.
 * All plans use yearly billing intervals.
 */
type PricingPlan<T extends Plan = Plan> = {
  [key in T]: {
    id: string
    name: string
    description: string
    prices: PriceInterval
  }
}
