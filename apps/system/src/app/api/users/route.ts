import { NextResponse } from 'next/server';
import { db, schema, sql, desc, eq, and, ne } from '@erp/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 400 });
    }

    const [usersList, employeesList, branchesList, departmentsList] = await Promise.all([
      db.select().from(schema.users).orderBy(desc(schema.users.createdAt)),
      db.select().from(schema.employees).orderBy(schema.employees.employeeCode),
      db.select().from(schema.branches),
      db.select().from(schema.departments)
    ]);

    const branchMap = new Map(branchesList.map(b => [b.id, b.name]));
    const deptMap = new Map(departmentsList.map(d => [d.id, d.name]));
    const employeeMap = new Map(employeesList.map(e => [e.id, e]));

    // Track which employees already have a provisioned user account
    const provisionedEmpIds = new Set<string>();

    const formattedUsers = usersList.map(u => {
      let linkedEmp = u.employeeId ? employeeMap.get(u.employeeId) : undefined;

      // Fallback matching by email if employeeId is null
      if (!linkedEmp && u.email) {
        linkedEmp = employeesList.find(e => e.email === u.email || e.workEmail === u.email);
      }

      if (linkedEmp) {
        provisionedEmpIds.add(linkedEmp.id);
      }

      const branchName = linkedEmp?.branchId ? (branchMap.get(linkedEmp.branchId) || 'Toàn Hệ Thống') : 'Toàn Hệ Thống';
      const deptName = linkedEmp?.departmentId ? (deptMap.get(linkedEmp.departmentId) || linkedEmp.department) : (linkedEmp?.department || 'Khối Quản Trị');

      let parsedModules: string[] = ['pos'];
      try {
        if (u.allowedModules) {
          parsedModules = JSON.parse(u.allowedModules);
        }
      } catch {
        parsedModules = ['pos'];
      }

      return {
        id: u.id,
        email: u.email,
        fullName: linkedEmp?.fullName || u.fullName,
        role: u.role,
        isActive: u.isActive,
        mustChangePassword: u.mustChangePassword,
        lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('vi-VN') : 'Chưa đăng nhập',
        createdAt: new Date(u.createdAt).toLocaleDateString('vi-VN'),
        allowedModules: parsedModules,
        // Linked HR Employee Information
        isLinkedWithHR: !!linkedEmp,
        employee: linkedEmp
          ? {
              id: linkedEmp.id,
              code: linkedEmp.employeeCode,
              fullName: linkedEmp.fullName,
              phone: linkedEmp.phoneNumber,
              citizenId: linkedEmp.citizenId || '',
              workEmail: linkedEmp.workEmail || linkedEmp.email,
              branchName,
              deptName,
              status: linkedEmp.status
            }
          : null
      };
    });

    // Filter employees who do NOT have any user account yet, and are active/probation in company
    const unprovisionedEmployees = employeesList
      .filter(e => !provisionedEmpIds.has(e.id) && e.status !== 'TERMINATED')
      .map(e => {
        const branchName = e.branchId ? (branchMap.get(e.branchId) || 'Toàn Hệ Thống') : 'Toàn Hệ Thống';
        const deptName = e.departmentId ? (deptMap.get(e.departmentId) || e.department) : e.department;

        return {
          id: e.id,
          code: e.employeeCode,
          fullName: e.fullName,
          phone: e.phoneNumber,
          citizenId: e.citizenId || '',
          workEmail: e.workEmail || e.email,
          branchName,
          deptName,
          status: e.status,
          joinDate: e.joinDate ? new Date(e.joinDate).toLocaleDateString('vi-VN') : 'Đang làm việc'
        };
      });

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        unprovisionedEmployees,
        totalEmployees: employeesList.length,
        provisionedCount: formattedUsers.filter(u => u.isLinkedWithHR).length,
        unprovisionedCount: unprovisionedEmployees.length,
        lockedCount: formattedUsers.filter(u => !u.isActive).length
      }
    });
  } catch (error: any) {
    console.error('Error fetching system users from PostgreSQL:', error);
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

    // Audit logging helper
    const logAudit = async (act: string, res: string, resId: string, diff: any) => {
      try {
        await db.insert(schema.auditLogs).values({
          tenantId: tenant.id,
          userName: 'Viet Travel Administrator',
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

    // 1. ACTION: CẤP PHÁT TÀI KHOẢN (PROVISIONING)
    if (action === 'PROVISION') {
      const { employeeId, email, password, role, allowedModules, mustChangePassword } = data;

      if (!employeeId) {
        return NextResponse.json(
          { success: false, message: 'Vui lòng chọn nhân viên công ty từ Phân hệ HR để cấp phát!' },
          { status: 400 }
        );
      }

      // Check 1: Employee exists in HR
      const [emp] = await db
        .select()
        .from(schema.employees)
        .where(eq(schema.employees.id, employeeId))
        .limit(1);

      if (!emp) {
        return NextResponse.json(
          { success: false, message: 'Không tìm thấy hồ sơ nhân sự của nhân viên này trong Phân hệ HR!' },
          { status: 400 }
        );
      }

      // Check 2: Employee must not be TERMINATED
      if (emp.status === 'TERMINATED') {
        return NextResponse.json(
          {
            success: false,
            message: `Nhân viên "${emp.fullName}" (${emp.employeeCode}) đã nghỉ việc. Không thể cấp phát tài khoản!`
          },
          { status: 400 }
        );
      }

      // Check 3: 1-1 Rule - Employee must not already have a user account
      const [existingUserByEmp] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.employeeId, employeeId))
        .limit(1);

      if (existingUserByEmp) {
        return NextResponse.json(
          {
            success: false,
            message: `Nhân viên "${emp.fullName}" (${emp.employeeCode}) đã được cấp tài khoản truy cập (${existingUserByEmp.email}) trước đó!`
          },
          { status: 400 }
        );
      }

      // Check 4: Email uniqueness
      const normalizedEmail = (email || emp.workEmail || emp.email).trim().toLowerCase();
      const [existingUserByEmail] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, normalizedEmail))
        .limit(1);

      if (existingUserByEmail) {
        return NextResponse.json(
          {
            success: false,
            message: `Email đăng nhập "${normalizedEmail}" đã được sử dụng bởi một tài khoản khác trong hệ thống!`
          },
          { status: 400 }
        );
      }

      const [newUser] = await db
        .insert(schema.users)
        .values({
          tenantId: tenant.id,
          employeeId: emp.id,
          email: normalizedEmail,
          passwordHash: password || 'Travel@2026',
          fullName: emp.fullName,
          role: role || 'STAFF',
          allowedModules: JSON.stringify(allowedModules || ['pos', 'booking']),
          mustChangePassword: mustChangePassword ?? true,
          isActive: true
        })
        .returning();

      await logAudit('USER_ACCOUNT_PROVISIONED', 'USER_ACCOUNT', newUser.id, {
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        email: newUser.email,
        role: newUser.role,
        allowedModules: allowedModules || ['pos', 'booking']
      });

      return NextResponse.json({
        success: true,
        data: newUser,
        message: `Đã cấp phát thành công tài khoản "${newUser.email}" cho nhân viên "${emp.fullName}" (${emp.employeeCode})!`
      });
    }

    // 2. ACTION: KHÓA / MỞ KHÓA TÀI KHOẢN (TOGGLE LOCK)
    if (action === 'TOGGLE_LOCK') {
      const { id } = data;
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);

      if (!user) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản!' }, { status: 404 });
      }

      const nextActive = !user.isActive;
      await db
        .update(schema.users)
        .set({ isActive: nextActive, updatedAt: new Date() })
        .where(eq(schema.users.id, id));

      await logAudit(
        nextActive ? 'USER_ACCOUNT_UNLOCKED' : 'USER_ACCOUNT_LOCKED',
        'USER_ACCOUNT',
        id,
        { email: user.email, isActive: nextActive }
      );

      return NextResponse.json({
        success: true,
        isActive: nextActive,
        message: nextActive
          ? `Đã mở khóa tài khoản "${user.email}" thành công!`
          : `Đã khóa tài khoản "${user.email}". Người dùng không thể đăng nhập!`
      });
    }

    // 3. ACTION: ĐẶT LẠI MẬT KHẨU (RESET PASSWORD)
    if (action === 'RESET_PASSWORD') {
      const { id, newPassword } = data;
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);

      if (!user) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản!' }, { status: 404 });
      }

      const passwordToSet = newPassword || `Travel@${Math.floor(1000 + Math.random() * 9000)}`;

      await db
        .update(schema.users)
        .set({
          passwordHash: passwordToSet,
          mustChangePassword: true,
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, id));

      await logAudit('USER_PASSWORD_RESET', 'USER_ACCOUNT', id, {
        email: user.email,
        mustChangePassword: true
      });

      return NextResponse.json({
        success: true,
        temporaryPassword: passwordToSet,
        message: `Đã đặt lại mật khẩu cho tài khoản "${user.email}" thành công!`
      });
    }

    // 4. ACTION: CẬP NHẬT VAI TRÒ & PHÂN HỆ (UPDATE ROLE)
    if (action === 'UPDATE_ROLE') {
      const { id, role, allowedModules } = data;
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);

      if (!user) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản!' }, { status: 404 });
      }

      await db
        .update(schema.users)
        .set({
          role: role || user.role,
          allowedModules: allowedModules ? JSON.stringify(allowedModules) : user.allowedModules,
          updatedAt: new Date()
        })
        .where(eq(schema.users.id, id));

      await logAudit('USER_ROLE_UPDATED', 'USER_ACCOUNT', id, {
        email: user.email,
        oldRole: user.role,
        newRole: role,
        allowedModules
      });

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật vai trò và quyền phân hệ cho tài khoản "${user.email}"!`
      });
    }

    // 5. ACTION: THU HỒI TÀI KHOẢN (REVOKE ACCOUNT)
    if (action === 'REVOKE') {
      const { id } = data;
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);

      if (!user) {
        return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản!' }, { status: 404 });
      }

      if (user.role === 'SUPER_ADMIN') {
        return NextResponse.json(
          { success: false, message: 'Không thể thu hồi tài khoản Quản trị viên tối cao (SUPER_ADMIN)!' },
          { status: 400 }
        );
      }

      await db.delete(schema.users).where(eq(schema.users.id, id));
      await logAudit('USER_ACCOUNT_REVOKED', 'USER_ACCOUNT', id, {
        email: user.email,
        fullName: user.fullName
      });

      return NextResponse.json({
        success: true,
        message: `Đã thu hồi tài khoản "${user.email}" khỏi hệ thống! Hồ sơ nhân sự trong HR vẫn được bảo lưu nguyên vẹn.`
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error' },
      { status: 500 }
    );
  }
}
