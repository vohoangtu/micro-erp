import { z } from 'zod';
import { UserRole, CustomerTier, BookingStatus, OrderStatus, PaymentMethod } from './enums.js';

// Base Tenant & Audit
export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().default('default-tenant'),
  createdAt: z.date(),
  updatedAt: z.date()
});

// User & Auth
export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean().default(true)
});
export type User = z.infer<typeof UserSchema>;

// CRM Customer
export const CustomerSchema = BaseEntitySchema.extend({
  phoneNumber: z.string().min(9),
  fullName: z.string().min(2),
  email: z.string().email().optional().nullable(),
  tier: z.nativeEnum(CustomerTier).default(CustomerTier.STANDARD),
  loyaltyPoints: z.number().int().default(0),
  totalSpent: z.number().default(0),
  notes: z.string().optional().nullable()
});
export type Customer = z.infer<typeof CustomerSchema>;

// Booking Appointment
export const BookingSchema = BaseEntitySchema.extend({
  bookingCode: z.string(),
  customerId: z.string().uuid(),
  customerName: z.string(),
  customerPhone: z.string(),
  employeeId: z.string().uuid().optional().nullable(),
  serviceName: z.string(),
  appointmentTime: z.date(),
  durationMinutes: z.number().default(60),
  status: z.nativeEnum(BookingStatus).default(BookingStatus.PENDING),
  price: z.number().default(0),
  notes: z.string().optional().nullable()
});
export type Booking = z.infer<typeof BookingSchema>;

// POS Order & Items
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative()
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = BaseEntitySchema.extend({
  orderCode: z.string(),
  customerId: z.string().uuid().optional().nullable(),
  customerName: z.string().optional().nullable(),
  cashierId: z.string().uuid(),
  subtotal: z.number(),
  discount: z.number().default(0),
  totalAmount: z.number(),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PAID),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
  items: z.array(OrderItemSchema)
});
export type Order = z.infer<typeof OrderSchema>;

// HR Employee & Commission
export const EmployeeSchema = BaseEntitySchema.extend({
  employeeCode: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  department: z.string(),
  baseSalary: z.number().default(0),
  commissionRate: z.number().default(0.05), // 5% default
  isActive: z.boolean().default(true)
});
export type Employee = z.infer<typeof EmployeeSchema>;

// AI Copilot Query & Insight
export const AiQueryRequestSchema = z.object({
  query: z.string().min(1),
  tenantId: z.string().default('default-tenant'),
  contextScope: z.enum(['BI_REPORT', 'CUSTOMER_INSIGHT', 'SCHEDULE_OPTIMIZATION', 'ALL']).default('ALL')
});
export type AiQueryRequest = z.infer<typeof AiQueryRequestSchema>;

export const AiQueryResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(z.string()).optional(),
  suggestedActions: z.array(z.string()).optional()
});
export type AiQueryResponse = z.infer<typeof AiQueryResponseSchema>;
