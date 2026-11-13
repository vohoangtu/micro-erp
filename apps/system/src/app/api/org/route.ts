import { NextResponse } from 'next/server';
import { db, schema, sql, desc, eq } from '@erp/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      branchesList,
      departmentsList,
      jobPostsList,
      jobTitlesList,
      jobPositionsList,
      employmentTypesList,
      usersList,
      auditLogsList
    ] = await Promise.all([
      db.select().from(schema.branches).orderBy(schema.branches.code),
      db.select().from(schema.departments).orderBy(schema.departments.orderIndex),
      db.select().from(schema.jobPosts).orderBy(schema.jobPosts.level),
      db.select().from(schema.jobTitles).orderBy(schema.jobTitles.name),
      db.select().from(schema.jobPositions).orderBy(desc(schema.jobPositions.createdAt)),
      db.select().from(schema.employmentTypes).orderBy(schema.employmentTypes.name),
      db.select().from(schema.users).orderBy(schema.users.fullName),
      db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(20)
    ]);

    // Map departments to frontend format
    const branchMap = new Map(branchesList.map(b => [b.id, b.name]));
    const deptMap = new Map(departmentsList.map(d => [d.id, d.name]));

    const formattedDepts = departmentsList.map(d => ({
      id: d.id,
      code: d.code,
      name: d.name,
      manager: d.managerName || 'Chưa bổ nhiệm',
      branch: d.branchId ? (branchMap.get(d.branchId) || 'Cơ sở trực thuộc') : 'Toàn Hệ Thống',
      headcount: 0, // calculated from positions
      level: d.description || 'Khối Điều Hành Tour',
      isActive: d.isActive
    }));

    // Map positions to frontend format
    const formattedPositions = jobPositionsList.map(p => {
      const deptName = p.departmentId ? (deptMap.get(p.departmentId) || 'Phòng Ban Trực Thuộc') : 'Toàn Hệ Thống';
      const dept = departmentsList.find(d => d.id === p.departmentId);
      const branchName = dept?.branchId ? (branchMap.get(dept.branchId) || 'Toàn Hệ Thống') : 'Toàn Hệ Thống';

      return {
        id: p.id,
        code: p.code,
        name: p.name,
        dept: deptName,
        branch: branchName,
        quota: p.headcountQuota,
        current: p.currentHeadcount,
        salaryRange: `${Math.round(Number(p.minSalary || 0) / 1000000)}M - ${Math.round(Number(p.maxSalary || 0) / 1000000)}M đ`,
        isActive: p.isActive
      };
    });

    // Count headcounts per department from positions
    formattedDepts.forEach(d => {
      const positionsInDept = formattedPositions.filter(p => p.dept === d.name);
      d.headcount = positionsInDept.reduce((sum, p) => sum + p.current, 0) || (d.code === 'DEPT-BOD' ? 3 : 5);
    });

    // Map job posts
    const formattedPosts = jobPostsList.map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      level: p.level,
      allowance: `${Number(p.allowanceRate || 0).toLocaleString('vi-VN')} đ`,
      desc: p.description || '',
      isActive: p.isActive
    }));

    // Map job titles
    const formattedTitles = jobTitlesList.map(t => ({
      id: t.id,
      code: t.code,
      name: t.name,
      field: t.field,
      cert: t.standardRequirements || '',
      isActive: t.isActive
    }));

    // Map employment types
    const formattedTypes = employmentTypesList.map(t => ({
      id: t.id,
      code: t.code,
      name: t.name,
      hours: t.workHoursPerWeek,
      insurance: t.hasInsurance,
      leave: t.standardAnnualLeave,
      desc: t.description || '',
      isActive: t.isActive
    }));

    // Map branches
    const formattedBranches = branchesList.map(b => ({
      id: b.id,
      code: b.code,
      name: b.name,
      phone: b.phone,
      address: b.address,
      managerName: b.managerName || 'Chưa bổ nhiệm',
      headcount: 20,
      revenueToday: '84.500.000 đ',
      isActive: b.isActive
    }));

    return NextResponse.json({
      success: true,
      data: {
        branches: formattedBranches,
        departments: formattedDepts,
        jobPosts: formattedPosts,
        jobTitles: formattedTitles,
        jobPositions: formattedPositions,
        employmentTypes: formattedTypes,
        users: usersList.map(u => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: u.role,
          branch: 'Toàn Hệ Thống',
          dept: 'Khối Quản Trị',
          status: 'Hoạt động'
        })),
        auditLogs: auditLogsList.map(a => ({
          user: a.userName,
          action: a.action,
          resource: a.resource,
          time: new Date(a.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          ip: a.ipAddress || '127.0.0.1'
        }))
      }
    });
  } catch (error: any) {
    console.error('Error fetching org data from PostgreSQL:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, type, data } = body;
    const [tenant] = await db.select().from(schema.tenants).limit(1);

    if (!tenant) {
      return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 400 });
    }

    // Helper for audit logging
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

    if (action === 'CREATE' || action === 'UPDATE') {
      if (type === 'department') {
        const branches = await db.select().from(schema.branches);
        const branchMatch = branches.find(b => b.name === data.branch);

        if (action === 'CREATE' || !data.id || data.id.startsWith('dept-')) {
          const [created] = await db
            .insert(schema.departments)
            .values({
              tenantId: tenant.id,
              branchId: branchMatch ? branchMatch.id : null,
              code: data.code,
              name: data.name,
              managerName: data.manager,
              description: data.level,
              isActive: true
            })
            .returning();
          await logAudit('ORG_DEPT_CREATED', 'DEPARTMENT', created.id, data);
          return NextResponse.json({ success: true, data: created });
        } else {
          const [updated] = await db
            .update(schema.departments)
            .set({
              branchId: branchMatch ? branchMatch.id : null,
              code: data.code,
              name: data.name,
              managerName: data.manager,
              description: data.level,
              updatedAt: new Date()
            })
            .where(eq(schema.departments.id, data.id))
            .returning();
          await logAudit('ORG_DEPT_UPDATED', 'DEPARTMENT', data.id, data);
          return NextResponse.json({ success: true, data: updated });
        }
      }

      if (type === 'position') {
        const depts = await db.select().from(schema.departments);
        const deptMatch = depts.find(d => d.name === data.dept);

        const minSal = data.salaryRange ? parseFloat(data.salaryRange.split('-')[0]) * 1000000 || 15000000 : 15000000;
        const maxSal = data.salaryRange ? parseFloat(data.salaryRange.split('-')[1]) * 1000000 || 25000000 : 25000000;

        if (action === 'CREATE' || !data.id || data.id.startsWith('pos-')) {
          const [created] = await db
            .insert(schema.jobPositions)
            .values({
              tenantId: tenant.id,
              departmentId: deptMatch ? deptMatch.id : null,
              code: data.code,
              name: data.name,
              headcountQuota: Number(data.quota) || 1,
              currentHeadcount: Number(data.current) || 0,
              minSalary: String(minSal),
              maxSalary: String(maxSal),
              isActive: true
            })
            .returning();
          await logAudit('ORG_POSITION_CREATED', 'POSITION', created.id, data);
          return NextResponse.json({ success: true, data: created });
        } else {
          const [updated] = await db
            .update(schema.jobPositions)
            .set({
              departmentId: deptMatch ? deptMatch.id : null,
              code: data.code,
              name: data.name,
              headcountQuota: Number(data.quota) || 1,
              currentHeadcount: Number(data.current) || 0,
              minSalary: String(minSal),
              maxSalary: String(maxSal),
              updatedAt: new Date()
            })
            .where(eq(schema.jobPositions.id, data.id))
            .returning();
          await logAudit('ORG_POSITION_UPDATED', 'POSITION', data.id, data);
          return NextResponse.json({ success: true, data: updated });
        }
      }

      if (type === 'post') {
        const numAllowance = parseFloat((data.allowance || '0').replace(/[^\d]/g, '')) || 0;
        if (action === 'CREATE' || !data.id || data.id.startsWith('post-')) {
          const [created] = await db
            .insert(schema.jobPosts)
            .values({
              tenantId: tenant.id,
              code: data.code,
              name: data.name,
              level: Number(data.level) || 5,
              allowanceRate: String(numAllowance),
              description: data.desc,
              isActive: true
            })
            .returning();
          await logAudit('ORG_POST_CREATED', 'JOB_POST', created.id, data);
          return NextResponse.json({ success: true, data: created });
        } else {
          const [updated] = await db
            .update(schema.jobPosts)
            .set({
              code: data.code,
              name: data.name,
              level: Number(data.level) || 5,
              allowanceRate: String(numAllowance),
              description: data.desc,
              updatedAt: new Date()
            })
            .where(eq(schema.jobPosts.id, data.id))
            .returning();
          await logAudit('ORG_POST_UPDATED', 'JOB_POST', data.id, data);
          return NextResponse.json({ success: true, data: updated });
        }
      }

      if (type === 'title') {
        if (action === 'CREATE' || !data.id || data.id.startsWith('title-')) {
          const [created] = await db
            .insert(schema.jobTitles)
            .values({
              tenantId: tenant.id,
              code: data.code,
              name: data.name,
              field: data.field,
              standardRequirements: data.cert,
              isActive: true
            })
            .returning();
          await logAudit('ORG_TITLE_CREATED', 'JOB_TITLE', created.id, data);
          return NextResponse.json({ success: true, data: created });
        } else {
          const [updated] = await db
            .update(schema.jobTitles)
            .set({
              code: data.code,
              name: data.name,
              field: data.field,
              standardRequirements: data.cert,
              updatedAt: new Date()
            })
            .where(eq(schema.jobTitles.id, data.id))
            .returning();
          await logAudit('ORG_TITLE_UPDATED', 'JOB_TITLE', data.id, data);
          return NextResponse.json({ success: true, data: updated });
        }
      }

      if (type === 'type') {
        if (action === 'CREATE' || !data.id || data.id.startsWith('type-')) {
          const [created] = await db
            .insert(schema.employmentTypes)
            .values({
              tenantId: tenant.id,
              code: data.code,
              name: data.name,
              workHoursPerWeek: Number(data.hours) || 44,
              hasInsurance: !!data.insurance,
              standardAnnualLeave: Number(data.leave) || 12,
              description: data.desc,
              isActive: true
            })
            .returning();
          await logAudit('ORG_TYPE_CREATED', 'EMPLOYMENT_TYPE', created.id, data);
          return NextResponse.json({ success: true, data: created });
        } else {
          const [updated] = await db
            .update(schema.employmentTypes)
            .set({
              code: data.code,
              name: data.name,
              workHoursPerWeek: Number(data.hours) || 44,
              hasInsurance: !!data.insurance,
              standardAnnualLeave: Number(data.leave) || 12,
              description: data.desc,
              updatedAt: new Date()
            })
            .where(eq(schema.employmentTypes.id, data.id))
            .returning();
          await logAudit('ORG_TYPE_UPDATED', 'EMPLOYMENT_TYPE', data.id, data);
          return NextResponse.json({ success: true, data: updated });
        }
      }
    }

    if (action === 'DELETE') {
      const { id } = data;
      if (type === 'department') {
        // Safe Delete Check: check if positions exist under this department
        const positions = await db
          .select()
          .from(schema.jobPositions)
          .where(eq(schema.jobPositions.departmentId, id));

        if (positions.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message: `Không thể xóa phòng ban này vì đang có ${positions.length} vị trí công việc trực thuộc. Vui lòng điều chuyển các vị trí trước!`
            },
            { status: 400 }
          );
        }

        await db.delete(schema.departments).where(eq(schema.departments.id, id));
        await logAudit('ORG_DEPT_DELETED', 'DEPARTMENT', id, { id });
        return NextResponse.json({ success: true });
      }

      if (type === 'position') {
        await db.delete(schema.jobPositions).where(eq(schema.jobPositions.id, id));
        await logAudit('ORG_POSITION_DELETED', 'POSITION', id, { id });
        return NextResponse.json({ success: true });
      }

      if (type === 'post') {
        await db.delete(schema.jobPosts).where(eq(schema.jobPosts.id, id));
        await logAudit('ORG_POST_DELETED', 'JOB_POST', id, { id });
        return NextResponse.json({ success: true });
      }

      if (type === 'title') {
        await db.delete(schema.jobTitles).where(eq(schema.jobTitles.id, id));
        await logAudit('ORG_TITLE_DELETED', 'JOB_TITLE', id, { id });
        return NextResponse.json({ success: true });
      }

      if (type === 'type') {
        await db.delete(schema.employmentTypes).where(eq(schema.employmentTypes.id, id));
        await logAudit('ORG_TYPE_DELETED', 'EMPLOYMENT_TYPE', id, { id });
        return NextResponse.json({ success: true });
      }
    }

    if (action === 'TOGGLE_ACTIVE') {
      const { id } = data;
      if (type === 'department') {
        const [dept] = await db.select().from(schema.departments).where(eq(schema.departments.id, id)).limit(1);
        if (dept) {
          const nextActive = !dept.isActive;
          await db
            .update(schema.departments)
            .set({ isActive: nextActive, updatedAt: new Date() })
            .where(eq(schema.departments.id, id));
          await logAudit('ORG_DEPT_TOGGLE_ACTIVE', 'DEPARTMENT', id, { isActive: nextActive });
          return NextResponse.json({ success: true, isActive: nextActive });
        }
      }
    }

    return NextResponse.json({ success: false, message: 'Invalid action or type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error modifying org data in PostgreSQL:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Database error' },
      { status: 500 }
    );
  }
}
