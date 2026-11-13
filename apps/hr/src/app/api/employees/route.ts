import { NextResponse } from 'next/server';
import { db, schema, sql, desc, eq } from '@erp/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 400 });
    }

    const [employeesList, usersList, branchesList, departmentsList] = await Promise.all([
      db.select().from(schema.employees).orderBy(schema.employees.employeeCode),
      db.select().from(schema.users),
      db.select().from(schema.branches),
      db.select().from(schema.departments)
    ]);

    const branchMap = new Map(branchesList.map(b => [b.id, b.name]));
    const deptMap = new Map(departmentsList.map(d => [d.id, d.name]));

    // Map each employee to user account status
    const userByEmpId = new Map(usersList.filter(u => u.employeeId).map(u => [u.employeeId as string, u]));
    const userByEmail = new Map(usersList.map(u => [u.email, u]));

    const formattedEmployees = employeesList.map(emp => {
      const linkedUser = userByEmpId.get(emp.id) || userByEmail.get(emp.workEmail || emp.email);
      const branchName = emp.branchId ? (branchMap.get(emp.branchId) || 'Toàn Hệ Thống') : 'Toàn Hệ Thống';
      const deptName = emp.departmentId ? (deptMap.get(emp.departmentId) || emp.department) : emp.department;

      return {
        id: emp.id,
        code: emp.employeeCode,
        name: emp.fullName,
        dept: deptName,
        branch: branchName,
        phone: emp.phoneNumber,
        email: emp.workEmail || emp.email,
        citizenId: emp.citizenId || '',
        salary: Number(emp.baseSalary) || 15000000,
        rate: `${(Number(emp.commissionRate) * 100).toFixed(1)}%`,
        comm: Math.round(Number(emp.baseSalary) * 0.15) || 2500000,
        allowance: 1500000,
        insurance: Math.round(Number(emp.baseSalary) * 0.105) || 1200000,
        net: Math.round(Number(emp.baseSalary) * 1.045) || 15300000,
        status: emp.status || (emp.isActive ? 'ACTIVE' : 'TERMINATED'),
        // System Account Link
        hasUserAccount: !!linkedUser,
        userEmail: linkedUser?.email,
        userActive: linkedUser?.isActive ?? false,
        userRole: linkedUser?.role
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        employees: formattedEmployees,
        total: formattedEmployees.length,
        activeCount: formattedEmployees.filter(e => e.status === 'ACTIVE' || e.status === 'PROBATION').length,
        hasAccountCount: formattedEmployees.filter(e => e.hasUserAccount).length,
        noAccountCount: formattedEmployees.filter(e => !e.hasUserAccount).length
      }
    });
  } catch (error: any) {
    console.error('Error fetching HR employees from PostgreSQL:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;
    const [tenant] = await db.select().from(schema.tenants).limit(1);

    if (!tenant) {
      return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 400 });
    }

    const logAudit = async (act: string, res: string, resId: string, diff: any) => {
      try {
        await db.insert(schema.auditLogs).values({
          tenantId: tenant.id,
          userName: 'Viet Travel HR Manager',
          action: act,
          resource: res,
          resourceId: resId,
          diff,
          ipAddress: '127.0.0.1'
        });
      } catch (e) {
        console.error('Audit log failed:', e);
      }
    };

    // 1. ACTION: THÊM MỚI NHÂN VIÊN (CREATE)
    if (action === 'CREATE') {
      const [newEmp] = await db
        .insert(schema.employees)
        .values({
          tenantId: tenant.id,
          employeeCode: data.code || `NV-HN-${Date.now().toString(36).slice(-3).toUpperCase()}`,
          fullName: data.name,
          email: data.email,
          workEmail: data.email,
          phoneNumber: data.phone || '0901 000 000',
          citizenId: data.citizenId || '',
          department: data.dept || 'Phòng Điều Hành Tour Outbound',
          baseSalary: String(data.salary || 15000000),
          commissionRate: '0.0500',
          status: 'ACTIVE',
          isActive: true
        })
        .returning();

      await logAudit('HR_EMPLOYEE_CREATED', 'EMPLOYEE', newEmp.id, data);
      return NextResponse.json({ success: true, data: newEmp, message: `Tiếp nhận nhân sự "${newEmp.fullName}" thành công!` });
    }

    // 2. ACTION: CHẤM DỨT HỢP ĐỒNG / NGHỈ VIỆC (TERMINATE) => TỰ ĐỘNG KHÓA TÀI KHOẢN HỆ THỐNG
    if (action === 'TERMINATE') {
      const { id } = data;
      const [emp] = await db.select().from(schema.employees).where(eq(schema.employees.id, id)).limit(1);

      if (!emp) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy hồ sơ nhân sự!' }, { status: 404 });
      }

      // Update employee status to TERMINATED
      await db
        .update(schema.employees)
        .set({ status: 'TERMINATED', isActive: false, updatedAt: new Date() })
        .where(eq(schema.employees.id, id));

      await logAudit('HR_EMPLOYEE_TERMINATED', 'EMPLOYEE', id, {
        code: emp.employeeCode,
        fullName: emp.fullName
      });

      // Automated Deprovisioning: Lock linked system user account immediately
      const linkedUsers = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.employeeId, id));

      for (const u of linkedUsers) {
        await db
          .update(schema.users)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(schema.users.id, u.id));

        await logAudit('USER_ACCOUNT_AUTO_LOCKED_ON_TERMINATION', 'USER_ACCOUNT', u.id, {
          email: u.email,
          reason: `Employee ${emp.fullName} (${emp.employeeCode}) was terminated in HR.`
        });
      }

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật trạng thái thôi việc cho nhân viên "${emp.fullName}". Hệ thống đã tự động khóa tài khoản truy cập tương ứng (${linkedUsers.length} tài khoản)!`
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in HR employees API:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error' },
      { status: 500 }
    );
  }
}
