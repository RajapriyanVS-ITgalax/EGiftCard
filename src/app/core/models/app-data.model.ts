export interface AppInfo {
  name: string;
  tagline: string;
  splashDurationMs: number;
}

export interface Promotion {
  id: string;
  title: string;
  giftCardId: string;
}

export interface VoucherPackage {
  id: string;
  name: string;
  amount: number;
  description?: string;
  badge?: string;
  badgeDetail?: string;
  validity?: string;
  note?: string;
}

export interface GiftCard {
  id: string;
  name: string;
  initials: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  color: string;
  /** Optional cover photo URL; falls back to a colour gradient. */
  image?: string;
  location?: string;
  description?: string;
  deliveryLabel?: string;
  packages?: VoucherPackage[];
  /** Preset amounts offered on the detail page. */
  amounts?: number[];
}

export interface Category {
  name: string;
  icon: string;
  color: string;
}

export interface AppData {
  app: AppInfo;
  categories: Category[];
  promotions: Promotion[];
  giftCards: GiftCard[];
}
