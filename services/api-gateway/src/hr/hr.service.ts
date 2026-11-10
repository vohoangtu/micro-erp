import { Injectable } from '@nestjs/common';
import { db, schema, eq, desc } from '@erp/database';
import { eventBus } from '@erp/event-bus';
import { EventChannels } from '@erp/shared-types';

@Injectable()
export class HrService {
  async getEmployees() {
    let emps = await db.select().from(schema.employees).orderBy(desc(schema.employees.createdAt)).limit(100);
    if (emps.length === 0) {
      // Seed initial sample staff
      let [tenant] = await db.select().from(schema.tenants).limit(1);
      if (!tenant) {
        [tenant] = await db.insert(schema.tenants).values({ name: 'Default Tenant', slug: 'default' }).returning();
      }
      emps = await db
        .insert(schema.employees)
        .values([
          {
            tenantId: tenant.id,
            employeeCode: 'EMP-001',
            fullName: 'Nguyễn Thị Mai',
            email: 'mai.nguyen@bhn.vn',
            phoneNumber: '0901234567',
            department: 'Kỹ thuật viên Trị liệu',
            baseSalary: '10000000',
            commissionRate: '0.08' // 8%
          },
          {
            tenantId: tenant.id,
            employeeCode: 'EMP-002',
            fullName: 'Trần Văn Hoàng',
            email: 'hoang.tran@bhn.vn',
            phoneNumber: '0912345678',
            department: 'Tư vấn & Chăm sóc KH',
            baseSalary: '9000000',
            commissionRate: '0.05' // 5%
          }
        ])
        .returning();
    }
    return emps;
  }

  async createEmployee(data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    department: string;
    baseSalary: number;
    commissionRate?: number;
  }) {
    let [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      [tenant] = await db.insert(schema.tenants).values({ name: 'Default Tenant', slug: 'default' }).returning();
    }

    const employeeCode = `EMP-${Date.now().toString(36).toUpperCase()}`;

    const [emp] = await db
      .insert(schema.employees)
      .values({
        tenantId: tenant.id,
        employeeCode,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        department: data.department,
        baseSalary: data.baseSalary.toString(),
        commissionRate: (data.commissionRate || 0.05).toString()
      })
      .returning();

    return emp;
  }

  async calculateMonthlyPayroll(employeeId: string, monthPeriod: string) {
    const [emp] = await db.select().from(schema.employees).where(eq(schema.employees.id, employeeId)).limit(1);
    if (!emp) return null;

    const baseAmount = Number(emp.baseSalary);
    // Estimated commission calculation for the period
    const commissionAmount = 2500000;
    const bonusAmount = 500000;
    const deductionAmount = 0;
    const netAmount = baseAmount + commissionAmount + bonusAmount - deductionAmount;

    let [tenant] = await db.select().from(schema.tenants).limit(1);

    const [entry] = await db
      .insert(schema.payrollEntries)
      .values({
        tenantId: tenant.id,
        employeeId: emp.id,
        monthPeriod,
        baseAmount: baseAmount.toString(),
        commissionAmount: commissionAmount.toString(),
        bonusAmount: bonusAmount.toString(),
        deductionAmount: deductionAmount.toString(),
        netAmount: netAmount.toString(),
        isPaid: false
      })
      .returning();

    await eventBus.publish(EventChannels.PAYROLL_COMMISSION_CALCULATED, entry);

    return entry;
  }

  async getPayrollEntries() {
    return db.select().from(schema.payrollEntries).orderBy(desc(schema.payrollEntries.createdAt)).limit(100);
  }
}
