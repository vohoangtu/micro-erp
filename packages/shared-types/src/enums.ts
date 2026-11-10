export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  CASHIER = 'CASHIER',
  MEMBER = 'MEMBER'
}

export enum CustomerTier {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CASH = 'CASH',
  VIETQR = 'VIETQR',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  WALLET_POINTS = 'WALLET_POINTS'
}

export enum EventChannels {
  BOOKING_CREATED = 'booking.created',
  BOOKING_STATUS_CHANGED = 'booking.status_changed',
  ORDER_PAID = 'order.paid',
  CUSTOMER_REGISTERED = 'customer.registered',
  CUSTOMER_POINTS_UPDATED = 'customer.points_updated',
  PAYROLL_COMMISSION_CALCULATED = 'hr.commission_calculated',
  AI_INSIGHT_REQUESTED = 'ai.insight_requested'
}
