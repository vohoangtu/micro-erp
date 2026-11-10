import { db, schema, sql } from './index.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export async function runSeed() {
  console.log('🌱 Starting database seed for BHN CORE ERP (2026 Edition)...');

  try {
    // 1. Create or get default Tenant
    let [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      [tenant] = await db
        .insert(schema.tenants)
        .values({
          name: 'BHN International Wellness & Clinic',
          slug: 'bhn-core',
          plan: 'enterprise',
          isActive: true
        })
        .returning();
      console.log('✅ Created Tenant:', tenant.name);
    }

    // 2. Seed Users
    const usersData = [
      {
        tenantId: tenant.id,
        email: 'admin@bhn.vn',
        passwordHash: 'Admin@2026',
        fullName: 'BHN System Administrator',
        role: 'SUPER_ADMIN'
      },
      {
        tenantId: tenant.id,
        email: 'manager@bhn.vn',
        passwordHash: 'Admin@2026',
        fullName: 'Trần Hương Giang (Quản Lý Chi Nhánh)',
        role: 'MANAGER'
      },
      {
        tenantId: tenant.id,
        email: 'cashier@bhn.vn',
        passwordHash: 'Admin@2026',
        fullName: 'Lê Thu Trang (Thu Ngân POS)',
        role: 'CASHIER'
      }
    ];

    for (const u of usersData) {
      const [existing] = await db.select().from(schema.users).where(sql`email = ${u.email}`).limit(1);
      if (!existing) {
        await db.insert(schema.users).values(u);
      }
    }
    console.log('✅ Seeded Users (admin@bhn.vn / Admin@2026)');

    // 3. Seed Products & Services
    const productsData = [
      {
        tenantId: tenant.id,
        sku: 'SRV-FACIAL-01',
        name: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell',
        category: 'Dịch vụ Spa',
        unitPrice: '450000',
        stockQuantity: 999
      },
      {
        tenantId: tenant.id,
        sku: 'SRV-MASSAGE-02',
        name: 'Massage Body Đá Nóng Himalaya 90 phút',
        category: 'Trị Liệu Thư Giãn',
        unitPrice: '550000',
        stockQuantity: 999
      },
      {
        tenantId: tenant.id,
        sku: 'SRV-COMBO-03',
        name: 'Combo Trị Liệu Trẻ Hóa Công Nghệ Cao HIFU',
        category: 'Trị Liệu Công Nghệ Cao',
        unitPrice: '2400000',
        stockQuantity: 999
      },
      {
        tenantId: tenant.id,
        sku: 'PRD-SERUM-04',
        name: 'Serum Dưỡng Ẩm Phục Hồi Chuyên Sâu B5 50ml',
        category: 'Mỹ phẩm',
        unitPrice: '620000',
        stockQuantity: 85
      },
      {
        tenantId: tenant.id,
        sku: 'PRD-SUNSCREEN-05',
        name: 'Kem Chống Nắng Phổ Rộng Bảo Vệ Toàn Diện SPF50+',
        category: 'Mỹ phẩm',
        unitPrice: '480000',
        stockQuantity: 120
      }
    ];

    for (const p of productsData) {
      const [existing] = await db.select().from(schema.products).where(sql`sku = ${p.sku}`).limit(1);
      if (!existing) {
        await db.insert(schema.products).values(p);
      }
    }
    console.log('✅ Seeded Products & Services');

    // 4. Seed CRM Customers
    const customersData = [
      {
        tenantId: tenant.id,
        phoneNumber: '0903123456',
        fullName: 'Nguyễn Thị Mai Lan',
        email: 'mailan.nguyen@gmail.com',
        tier: 'PLATINUM',
        loyaltyPoints: 640,
        totalSpent: '18500000',
        notes: 'Khách hàng VIP, dị ứng cồn mỹ phẩm nhẹ'
      },
      {
        tenantId: tenant.id,
        phoneNumber: '0912888999',
        fullName: 'Trần Văn Hoàng',
        email: 'hoang.tran@gmail.com',
        tier: 'GOLD',
        loyaltyPoints: 320,
        totalSpent: '9200000',
        notes: 'Thường xuyên đặt ca tối 18h-20h'
      },
      {
        tenantId: tenant.id,
        phoneNumber: '0988777666',
        fullName: 'Phạm Thu Hằng',
        email: 'thuhang.pham@yahoo.com',
        tier: 'SILVER',
        loyaltyPoints: 80,
        totalSpent: '2800000',
        notes: 'Quan tâm dịch vụ trị mụn công nghệ cao'
      },
      {
        tenantId: tenant.id,
        phoneNumber: '0933445566',
        fullName: 'Lê Minh Tuấn',
        email: 'tuan.leminh@corp.vn',
        tier: 'DIAMOND',
        loyaltyPoints: 1250,
        totalSpent: '35000000',
        notes: 'Khách hàng Kim Cương, ưu tiên phòng VIP 1'
      }
    ];

    let seededCustomers = [];
    for (const c of customersData) {
      let [existing] = await db.select().from(schema.customers).where(sql`phone_number = ${c.phoneNumber}`).limit(1);
      if (!existing) {
        [existing] = await db.insert(schema.customers).values(c).returning();
      }
      seededCustomers.push(existing);
    }
    console.log('✅ Seeded CRM Customers');

    // 5. Seed HR Employees
    const employeesData = [
      {
        tenantId: tenant.id,
        employeeCode: 'EMP-001',
        fullName: 'Nguyễn Thị Mai',
        email: 'mai.nguyen@bhn.vn',
        phoneNumber: '0901234567',
        department: 'Kỹ thuật viên Trị liệu',
        baseSalary: '10000000',
        commissionRate: '0.08'
      },
      {
        tenantId: tenant.id,
        employeeCode: 'EMP-002',
        fullName: 'Trần Văn Hoàng',
        email: 'hoang.tran@bhn.vn',
        phoneNumber: '0912345678',
        department: 'Tư vấn & Chăm sóc KH',
        baseSalary: '9000000',
        commissionRate: '0.05'
      },
      {
        tenantId: tenant.id,
        employeeCode: 'EMP-003',
        fullName: 'Bác sĩ Lê Đình Trọng',
        email: 'trong.le@bhn.vn',
        phoneNumber: '0933112233',
        department: 'Chuyên khoa Da liễu',
        baseSalary: '25000000',
        commissionRate: '0.10'
      }
    ];

    let seededEmployees = [];
    for (const e of employeesData) {
      let [existing] = await db.select().from(schema.employees).where(sql`employee_code = ${e.employeeCode}`).limit(1);
      if (!existing) {
        [existing] = await db.insert(schema.employees).values(e).returning();
      }
      seededEmployees.push(existing);
    }
    console.log('✅ Seeded HR Employees');

    // 6. Seed Bookings
    const bookingsData = [
      {
        tenantId: tenant.id,
        bookingCode: 'BK-TODAY-01',
        customerId: seededCustomers[0].id,
        customerName: seededCustomers[0].fullName,
        customerPhone: seededCustomers[0].phoneNumber,
        employeeId: seededEmployees[0].id,
        serviceName: 'Gói Chăm Sóc Da Mặt Cao Cấp Bio-Cell',
        appointmentTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // in 2 hours
        durationMinutes: 75,
        status: 'CONFIRMED',
        price: '450000',
        notes: 'Xếp phòng VIP số 2'
      },
      {
        tenantId: tenant.id,
        bookingCode: 'BK-TODAY-02',
        customerId: seededCustomers[1].id,
        customerName: seededCustomers[1].fullName,
        customerPhone: seededCustomers[1].phoneNumber,
        employeeId: seededEmployees[1].id,
        serviceName: 'Massage Body Đá Nóng Himalaya 90 phút',
        appointmentTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // in 4 hours
        durationMinutes: 90,
        status: 'IN_PROGRESS',
        price: '550000',
        notes: 'Khách yêu cầu kỹ thuật viên tay nghề cứng'
      }
    ];

    for (const b of bookingsData) {
      const [existing] = await db.select().from(schema.bookings).where(sql`booking_code = ${b.bookingCode}`).limit(1);
      if (!existing) {
        await db.insert(schema.bookings).values(b);
      }
    }
    console.log('✅ Seeded Bookings');

    // 7. Seed POS Orders
    const ordersData = [
      {
        tenantId: tenant.id,
        orderCode: 'ORD-K891',
        customerId: seededCustomers[0].id,
        customerName: seededCustomers[0].fullName,
        cashierId: tenant.id,
        subtotal: '1070000',
        discount: '0',
        totalAmount: '1070000',
        status: 'PAID',
        paymentMethod: 'VIETQR',
        items: [
          { productName: 'Gói Chăm Sóc Da Mặt Cao Cấp', quantity: 1, unitPrice: 450000 },
          { productName: 'Serum Dưỡng Ẩm Phục Hồi B5', quantity: 1, unitPrice: 620000 }
        ]
      },
      {
        tenantId: tenant.id,
        orderCode: 'ORD-K890',
        customerId: seededCustomers[1].id,
        customerName: seededCustomers[1].fullName,
        cashierId: tenant.id,
        subtotal: '550000',
        discount: '0',
        totalAmount: '550000',
        status: 'PAID',
        paymentMethod: 'CASH',
        items: [{ productName: 'Massage Body Đá Nóng 90p', quantity: 1, unitPrice: 550000 }]
      },
      {
        tenantId: tenant.id,
        orderCode: 'ORD-K889',
        customerId: seededCustomers[3].id,
        customerName: seededCustomers[3].fullName,
        cashierId: tenant.id,
        subtotal: '2400000',
        discount: '0',
        totalAmount: '2400000',
        status: 'PAID',
        paymentMethod: 'CREDIT_CARD',
        items: [{ productName: 'Combo Trị Liệu Trẻ Hóa Công Nghệ Cao HIFU', quantity: 1, unitPrice: 2400000 }]
      }
    ];

    for (const o of ordersData) {
      const [existing] = await db.select().from(schema.orders).where(sql`order_code = ${o.orderCode}`).limit(1);
      if (!existing) {
        await db.insert(schema.orders).values(o);
      }
    }
    console.log('✅ Seeded POS Orders');

    // 8. Seed AI Knowledge Base (RAG Documents for AI Copilot)
    const aiDocsData = [
      {
        tenantId: tenant.id,
        title: 'Chính sách Tích lũy Điểm thưởng & Nâng hạng Hội viên BHN Privilege 2026',
        category: 'CHINH_SACH_HOI_VIEN',
        content: `
Mỗi 100.000 VNĐ thanh toán tại POS được tích lũy 1 điểm thưởng (points).
Các phân hạng thành viên:
1. Standard (0 - 49 điểm): Ưu đãi cơ bản.
2. Silver (50 - 199 điểm): Giảm 5% hóa đơn dịch vụ, quà sinh nhật 200.000 VNĐ.
3. Gold (200 - 499 điểm): Giảm 10% hóa đơn, miễn phí 1 buổi tư vấn chuyên khoa da liễu.
4. Platinum (500 - 999 điểm): Giảm 15% hóa đơn, ưu tiên đặt lịch giờ cao điểm, miễn phí nâng cấp phòng VIP.
5. Diamond (Từ 1.000 điểm trở lên): Giảm 20% toàn bộ dịch vụ & mỹ phẩm, chuyên viên riêng phục vụ 1-kèm-1.
`
      },
      {
        tenantId: tenant.id,
        title: 'Quy trình Điều phối Phòng Dịch vụ & Xử lý Hủy lịch hẹn',
        category: 'QUY_TRINH_VAN_HANH',
        content: `
1. Khách hàng cần thông báo dời/hủy lịch trước ít nhất 2 giờ so với giờ hẹn đã định.
2. Trường hợp khách đến trễ quá 15 phút mà không thông báo, hệ thống tự động chuyển trạng thái NO_SHOW và điều phối kỹ thuật viên cho khách hàng vãng lai.
3. Khung giờ cao điểm (Peak hours): 11h30 - 13h30 và 18h00 - 20h30 tất cả các ngày trong tuần. Luôn duy trì ít nhất 2 kỹ thuật viên dự phòng.
`
      },
      {
        tenantId: tenant.id,
        title: 'Chính sách Chi trả Hoa hồng & Thưởng Hiệu suất Nhân sự (HR & Commission)',
        category: 'CHINH_SACH_NHAN_SU',
        content: `
1. Kỹ thuật viên (Therapist): Hưởng 8% hoa hồng trên giá trị dịch vụ thực hiện trực tiếp.
2. Chuyên viên Tư vấn (Consultant): Hưởng 5% hoa hồng trên tổng doanh thu đơn hàng mỹ phẩm & gói liệu trình tư vấn thành công.
3. Bác sĩ chuyên khoa: Hưởng 10% hoa hồng trên các ca trị liệu công nghệ cao.
4. Bảng lương và hoa hồng được hệ thống tính tự động vào ngày cuối cùng của tháng và chi trả qua ngân hàng vào ngày 05 hàng tháng.
`
      }
    ];

    for (const doc of aiDocsData) {
      const [existing] = await db.select().from(schema.aiDocuments).where(sql`title = ${doc.title}`).limit(1);
      if (!existing) {
        await db.insert(schema.aiDocuments).values(doc);
      }
    }
    console.log('✅ Seeded AI Knowledge Base (RAG Documents)');

    // 9. Seed Branches (Cơ sở Chuỗi Thẩm mỹ viện & Clinic)
    const branchesData = [
      {
        tenantId: tenant.id,
        code: 'BR-HN-01',
        name: 'BHN Clinic & Spa — Trụ Sở Hoàn Kiếm (Hà Nội)',
        phone: '024 3828 2026',
        email: 'hoankiem@bhn.vn',
        address: 'Số 68 Phố Tràng Thi, Phường Hàng Trống, Quận Hoàn Kiếm',
        city: 'Hà Nội',
        managerName: 'Trần Hương Giang',
        isActive: true
      },
      {
        tenantId: tenant.id,
        code: 'BR-HCM-01',
        name: 'BHN Wellness Center — Chi Nhánh Quận 1 (TP. HCM)',
        phone: '028 3910 2026',
        email: 'quan1@bhn.vn',
        address: 'Số 120 Đường Lê Duẩn, Phường Bến Nghé, Quận 1',
        city: 'TP. Hồ Chí Minh',
        managerName: 'Võ Minh Quân',
        isActive: true
      },
      {
        tenantId: tenant.id,
        code: 'BR-DN-01',
        name: 'BHN Aesthetic Clinic — Chi Nhánh Hải Châu (Đà Nẵng)',
        phone: '0236 3848 2026',
        email: 'danang@bhn.vn',
        address: 'Số 86 Đường Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu',
        city: 'Đà Nẵng',
        managerName: 'Đặng Thảo Vy',
        isActive: true
      }
    ];

    for (const b of branchesData) {
      const [existing] = await db.select().from(schema.branches).where(sql`code = ${b.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.branches).values(b);
      }
    }
    console.log('✅ Seeded Branches (Chuỗi Chi Nhánh HN - HCM - DN)');

    // 10. Seed Departments (Phòng Ban Đa Cấp)
    const [branchHN] = await db.select().from(schema.branches).where(sql`code = 'BR-HN-01'`).limit(1);
    const branchId = branchHN?.id;

    const departmentsData = [
      {
        tenantId: tenant.id,
        branchId: branchId,
        code: 'DEPT-BOD',
        name: 'Ban Giám Đốc & Điều Hành Chiến Lược',
        description: 'Chỉ đạo toàn diện hoạt động vận hành và chiến lược kinh doanh',
        managerName: 'Tổng Giám Đốc',
        orderIndex: 1
      },
      {
        tenantId: tenant.id,
        branchId: branchId,
        code: 'DEPT-CLINIC',
        name: 'Khối Bác Sĩ & Điều Trị Da Chuyên Sâu',
        description: 'Khám, soi da vi điểm, lên phác đồ điều trị nám, mụn, trẻ hóa công nghệ cao',
        managerName: 'BS. CKI Nguyễn Tuấn Anh',
        orderIndex: 2
      },
      {
        tenantId: tenant.id,
        branchId: branchId,
        code: 'DEPT-SPA-THERAPY',
        name: 'Khối Kỹ Thuật Viên & Trị Liệu Spa',
        description: 'Thực hiện các gói chăm sóc da, massage bấm huyệt, tắm trắng sinh học',
        managerName: 'Hoàng Mai Phương',
        orderIndex: 3
      },
      {
        tenantId: tenant.id,
        branchId: branchId,
        code: 'DEPT-SALES-CSKH',
        name: 'Phòng Tư Vấn Thẩm Mỹ & Chăm Sóc Khách Hàng (CRM)',
        description: 'Tư vấn liệu trình, chốt đơn mỹ phẩm, chăm sóc sau dịch vụ và giải quyết khiếu nại',
        managerName: 'Lê Thu Thảo',
        orderIndex: 4
      },
      {
        tenantId: tenant.id,
        branchId: branchId,
        code: 'DEPT-FINANCE-POS',
        name: 'Phòng Kế Toán — Thu Ngân POS',
        description: 'Thu tiền quầy POS, quét VietQR, quản lý sổ quỹ và đối soát doanh thu',
        managerName: 'Nguyễn Thị Minh Hạnh',
        orderIndex: 5
      },
      {
        tenantId: tenant.id,
        branchId: branchId,
        code: 'DEPT-WAREHOUSE',
        name: 'Phòng Kho Dược Mỹ Phẩm & Thiết Bị Y Tế',
        description: 'Nhập xuất tồn kho dược mỹ phẩm cao cấp, bảo quản serum, máy laser',
        managerName: 'Trịnh Quốc Bảo',
        orderIndex: 6
      }
    ];

    for (const d of departmentsData) {
      const [existing] = await db.select().from(schema.departments).where(sql`code = ${d.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.departments).values(d);
      }
    }
    console.log('✅ Seeded Departments (Phòng Ban Đa Phân Hệ)');

    // 11. Seed Job Posts (Chức Vụ Hành Chính)
    const jobPostsData = [
      {
        tenantId: tenant.id,
        code: 'POST-BOD',
        name: 'Tổng Giám Đốc (CEO / C-Level)',
        level: 1,
        allowanceRate: '20000000.00',
        description: 'Lãnh đạo tối cao, phê duyệt ngân sách và phân quyền toàn chuỗi'
      },
      {
        tenantId: tenant.id,
        code: 'POST-BRANCH-DIR',
        name: 'Giám Đốc Chi Nhánh / Quản Lý Cơ Sở',
        level: 2,
        allowanceRate: '10000000.00',
        description: 'Chịu trách nhiệm P&L, KPI doanh số và vận hành tại cơ sở trực thuộc'
      },
      {
        tenantId: tenant.id,
        code: 'POST-DEPT-HEAD',
        name: 'Trưởng Phòng Chuyên Môn',
        level: 3,
        allowanceRate: '5000000.00',
        description: 'Quản lý chất lượng chuyên môn phòng ban, đào tạo nhân viên và phân ca'
      },
      {
        tenantId: tenant.id,
        code: 'POST-TEAM-LEAD',
        name: 'Phó Phòng / Trưởng Nhóm (Team Leader / Shift Leader)',
        level: 4,
        allowanceRate: '2500000.00',
        description: 'Giám sát ca làm việc, hỗ trợ xử lý sự cố tại quầy và phòng điều trị'
      },
      {
        tenantId: tenant.id,
        code: 'POST-STAFF',
        name: 'Chuyên Viên / Nhân Viên Thực Thi',
        level: 5,
        allowanceRate: '0.00',
        description: 'Thực hiện trực tiếp các ca dịch vụ hoặc nhiệm vụ nghiệp vụ được giao'
      }
    ];

    for (const p of jobPostsData) {
      const [existing] = await db.select().from(schema.jobPosts).where(sql`code = ${p.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.jobPosts).values(p);
      }
    }
    console.log('✅ Seeded Job Posts (Chức Vụ Cấp Bậc 1-5)');

    // 12. Seed Job Titles (Chức Danh Chuyên Môn Nghề Nghiệp)
    const jobTitlesData = [
      {
        tenantId: tenant.id,
        code: 'TITLE-DERMA-DOC',
        name: 'Bác Sĩ Chuyên Khoa Da Liễu CKI',
        field: 'Dermatology & Aesthetic Medicine',
        standardRequirements: 'Chứng chỉ hành nghề khám chữa bệnh Da liễu, >= 5 năm kinh nghiệm Laser thẩm mỹ'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-SENIOR-THERAPIST',
        name: 'Chuyên Viên Trị Liệu Công Nghệ Cao (High-Tech Laser Specialist)',
        field: 'Laser & Technology',
        standardRequirements: 'Chứng chỉ an toàn bức xạ Laser, đào tạo chuyển giao công nghệ Picosecond / HIFU'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-SPA-THERAPIST',
        name: 'Kỹ Thuật Viên Spa & Chăm Sóc Da Trưởng',
        field: 'Spa & Wellness',
        standardRequirements: 'Chứng chỉ hành nghề Chăm sóc da chuyên nghiệp, kỹ năng massage trị liệu chuyên sâu'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-BEAUTY-CONSULTANT',
        name: 'Chuyên Viên Tư Vấn Thẩm Mỹ Cao Cấp',
        field: 'Sales & Consulting',
        standardRequirements: 'Kỹ năng giao tiếp xuất sắc, am hiểu tường tận thành phần dược mỹ phẩm và phác đồ'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-LEAD-CASHIER',
        name: 'Thu Ngân Trưởng & Kế Toán Quầy POS',
        field: 'Cashier & Finance',
        standardRequirements: 'Bằng Trung cấp/Cao đẳng Tài chính Kế toán, kỹ năng đối soát VietQR và tiền mặt'
      }
    ];

    for (const t of jobTitlesData) {
      const [existing] = await db.select().from(schema.jobTitles).where(sql`code = ${t.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.jobTitles).values(t);
      }
    }
    console.log('✅ Seeded Job Titles (Chức Danh Chuyên Môn Y Tế / Spa)');

    // 13. Seed Job Positions (Vị Trí Công Việc Đính Kèm Định Biên Headcount)
    const [deptClinic] = await db.select().from(schema.departments).where(sql`code = 'DEPT-CLINIC'`).limit(1);
    const [deptTherapy] = await db.select().from(schema.departments).where(sql`code = 'DEPT-SPA-THERAPY'`).limit(1);
    const [deptSales] = await db.select().from(schema.departments).where(sql`code = 'DEPT-SALES-CSKH'`).limit(1);
    const [postStaff] = await db.select().from(schema.jobPosts).where(sql`code = 'POST-STAFF'`).limit(1);
    const [postLead] = await db.select().from(schema.jobPosts).where(sql`code = 'POST-TEAM-LEAD'`).limit(1);
    const [titleDoc] = await db.select().from(schema.jobTitles).where(sql`code = 'TITLE-DERMA-DOC'`).limit(1);
    const [titleLaser] = await db.select().from(schema.jobTitles).where(sql`code = 'TITLE-SENIOR-THERAPIST'`).limit(1);
    const [titleConsultant] = await db.select().from(schema.jobTitles).where(sql`code = 'TITLE-BEAUTY-CONSULTANT'`).limit(1);

    const jobPositionsData = [
      {
        tenantId: tenant.id,
        departmentId: deptClinic?.id,
        postId: postLead?.id,
        titleId: titleDoc?.id,
        code: 'POS-DOC-LEAD',
        name: 'Bác Sĩ Trưởng Ca Trị Liệu Da Liễu',
        headcountQuota: 2,
        currentHeadcount: 2,
        minSalary: '30000000.00',
        maxSalary: '60000000.00',
        jdDescription: 'Chịu trách nhiệm chuyên môn các ca can thiệp laser chuyên sâu, tiêm meso và trẻ hóa'
      },
      {
        tenantId: tenant.id,
        departmentId: deptTherapy?.id,
        postId: postStaff?.id,
        titleId: titleLaser?.id,
        code: 'POS-LASER-SPECIALIST',
        name: 'Chuyên Viên Vận Hành Máy Laser Pico & HIFU',
        headcountQuota: 6,
        currentHeadcount: 4,
        minSalary: '15000000.00',
        maxSalary: '25000000.00',
        jdDescription: 'Vận hành máy laser theo chỉ định của bác sĩ, vệ sinh đầu tip và bảo dưỡng thiết bị'
      },
      {
        tenantId: tenant.id,
        departmentId: deptSales?.id,
        postId: postStaff?.id,
        titleId: titleConsultant?.id,
        code: 'POS-BEAUTY-CONSULTANT',
        name: 'Chuyên Viên Tư Vấn & Chăm Sóc Hội Viên Ruby',
        headcountQuota: 8,
        currentHeadcount: 6,
        minSalary: '10000000.00',
        maxSalary: '35000000.00',
        jdDescription: 'Tư vấn phác đồ và gói liệu trình, đạt chỉ tiêu KPI cá nhân và chăm sóc khách quen'
      }
    ];

    for (const pos of jobPositionsData) {
      const [existing] = await db.select().from(schema.jobPositions).where(sql`code = ${pos.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.jobPositions).values(pos);
      }
    }
    console.log('✅ Seeded Job Positions (Vị Trí Công Việc Kèm Định Biên Headcount)');

    // 14. Seed Employment Types (Tính Chất Công Việc & Chính Sách Phúc Lợi)
    const employmentTypesData = [
      {
        tenantId: tenant.id,
        code: 'EMP-FULLTIME',
        name: 'Toàn Thời Gian Cố Định (Full-Time)',
        workHoursPerWeek: 44,
        hasInsurance: true,
        standardAnnualLeave: 12,
        description: 'Hợp đồng lao động chính thức không xác định thời hạn, đóng BHXH/BHYT/BHTN đầy đủ'
      },
      {
        tenantId: tenant.id,
        code: 'EMP-PARTTIME',
        name: 'Bán Thời Gian / Ca Gãy (Part-Time)',
        workHoursPerWeek: 24,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Linh động theo ca khách hẹn, thanh toán theo giờ làm việc thực tế + hoa hồng'
      },
      {
        tenantId: tenant.id,
        code: 'EMP-PROBATION',
        name: 'Thử Việc (Probation - 60 Ngày)',
        workHoursPerWeek: 44,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Hưởng 85% lương cơ bản theo quy định Bộ luật Lao động, đánh giá sau 2 tháng'
      },
      {
        tenantId: tenant.id,
        code: 'EMP-CONTRACTOR-DOC',
        name: 'Hợp Đồng Hợp Tác Chuyên Gia / Bác Sĩ Cố Vấn (Contractor)',
        workHoursPerWeek: 16,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Thù lao chi trả trực tiếp theo từng ca phẫu thuật/điều trị phức tạp, thuế TNCN 10%'
      },
      {
        tenantId: tenant.id,
        code: 'EMP-SEASONAL',
        name: 'Thời Vụ / Mùa Lễ Tết Cao Điểm (Seasonal)',
        workHoursPerWeek: 48,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Tăng cường mùa cận Tết và dịp lễ, phụ cấp ca đêm và thưởng năng suất'
      }
    ];

    for (const et of employmentTypesData) {
      const [existing] = await db.select().from(schema.employmentTypes).where(sql`code = ${et.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.employmentTypes).values(et);
      }
    }
    console.log('✅ Seeded Employment Types (Tính Chất Công Việc)');

    // 15. Seed Roles (Phân Quyền Ma Trận Granular RBAC)
    const rolesData = [
      {
        tenantId: tenant.id,
        code: 'ROLE_SUPER_ADMIN',
        name: 'Quản Trị Viên Tối Cao (Super Administrator)',
        description: 'Toàn quyền cấu hình hệ thống, quản lý chi nhánh, duyệt lương và sao lưu máy chủ',
        isSystem: true,
        permissions: [
          'system:view', 'system:manage', 'system:backup', 'system:vps',
          'crm:view', 'crm:create', 'crm:update', 'crm:delete',
          'booking:view', 'booking:create', 'booking:update', 'booking:delete',
          'pos:view', 'pos:create', 'pos:refund',
          'hr:view', 'hr:salary:view', 'hr:salary:calculate',
          'bi:view', 'bi:export',
          'ai:view', 'ai:manage'
        ]
      },
      {
        tenantId: tenant.id,
        code: 'ROLE_BRANCH_MANAGER',
        name: 'Giám Đốc / Quản Lý Chi Nhánh',
        description: 'Quản lý toàn diện dữ liệu và vận hành trong phạm vi cơ sở được phân công',
        isSystem: true,
        permissions: [
          'crm:view', 'crm:create', 'crm:update',
          'booking:view', 'booking:create', 'booking:update', 'booking:assign',
          'pos:view', 'pos:create',
          'hr:view', 'hr:timesheet:approve',
          'bi:view',
          'ai:view'
        ]
      },
      {
        tenantId: tenant.id,
        code: 'ROLE_CASHIER_POS',
        name: 'Thu Ngân Quầy POS & Lễ Tân',
        description: 'Tạo đơn hàng, quét thanh toán VietQR, in hóa đơn và tiếp đón khách check-in',
        isSystem: true,
        permissions: [
          'pos:view', 'pos:create',
          'booking:view', 'booking:checkin',
          'crm:view', 'crm:create'
        ]
      },
      {
        tenantId: tenant.id,
        code: 'ROLE_DOCTOR_THERAPIST',
        name: 'Bác Sĩ & Kỹ Thuật Viên Điều Trị',
        description: 'Xem lịch hẹn điều trị cá nhân, ghi nhận bệnh án và xác nhận hoàn tất ca dịch vụ',
        isSystem: true,
        permissions: [
          'booking:view', 'booking:complete',
          'crm:view:history'
        ]
      }
    ];

    for (const r of rolesData) {
      const [existing] = await db.select().from(schema.roles).where(sql`code = ${r.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.roles).values(r);
      }
    }
    console.log('✅ Seeded Roles (Ma Trận Phân Quyền RBAC)');

    // 16. Seed System Settings (VietQR, Zalo ZNS, e-Invoice, AI Copilot, White-label)
    const settingsData = [
      {
        tenantId: tenant.id,
        category: 'vietqr',
        key: 'vietqr_config',
        value: {
          bankCode: 'MB',
          bankName: 'Ngân Hàng Quân Đội (MB Bank)',
          accountNumber: '999988882026',
          accountHolder: 'CTY CP THAM MY VIEN BHN INTERNATIONAL',
          template: 'compact2',
          autoFillAmount: true,
          memoPrefix: 'BHN'
        }
      },
      {
        tenantId: tenant.id,
        category: 'zalo_zns',
        key: 'zalo_config',
        value: {
          appId: '182736459012',
          oaId: '992837465019',
          secretKey: 'zalo_sec_2026_live_production_token',
          templates: [
            { id: 'ZNS_01', name: 'Xác nhận đặt lịch hẹn thành công', status: 'ACTIVE' },
            { id: 'ZNS_02', name: 'Nhắc lịch hẹn trước 120 phút', status: 'ACTIVE' },
            { id: 'ZNS_03', name: 'Chúc mừng sinh nhật & Tặng Voucher 20%', status: 'ACTIVE' }
          ]
        }
      },
      {
        tenantId: tenant.id,
        category: 'einvoice',
        key: 'einvoice_config',
        value: {
          provider: 'VNPT-INVOICE',
          symbol: '1C26TBB',
          taxCode: '0109988776',
          autoPublishOnPayment: true
        }
      },
      {
        tenantId: tenant.id,
        category: 'ai_copilot',
        key: 'ai_config',
        value: {
          primaryModel: 'gemini-2.5-flash',
          fallbackModel: 'gpt-4o',
          monthlyTokenQuotaPerBranch: 1000000,
          currentMonthTokensUsed: 142850,
          ragChunkSize: 500,
          temperature: 0.3
        }
      },
      {
        tenantId: tenant.id,
        category: 'branding',
        key: 'branding_config',
        value: {
          brandName: 'BHN International Wellness & Clinic',
          shortName: 'BHN CORE',
          hotline: '1900 882026',
          defaultThemeColor: '#dc0037', // lab(45 79.29 35.14)
          secondaryColor: '#0066cc',
          logoUrl: '/brand/logo.svg'
        }
      }
    ];

    for (const s of settingsData) {
      const [existing] = await db.select().from(schema.systemSettings).where(sql`key = ${s.key}`).limit(1);
      if (!existing) {
        await db.insert(schema.systemSettings).values(s);
      }
    }
    console.log('✅ Seeded System Settings (VietQR, Zalo ZNS, e-Invoice, AI Quota, Branding)');

    // 17. Seed Sample Audit Logs
    const auditLogsData = [
      {
        tenantId: tenant.id,
        userName: 'BHN System Administrator',
        action: 'SYSTEM_INIT',
        resource: 'ORGANIZATION',
        resourceId: 'BR-HN-01',
        diff: { status: 'INITIALIZED', branchesCount: 3, departmentsCount: 6 },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      },
      {
        tenantId: tenant.id,
        userName: 'Trần Hương Giang',
        action: 'PAYROLL_CALCULATE',
        resource: 'PAYROLL',
        resourceId: '2026-11',
        diff: { month: '2026-11', totalEmployees: 5, totalPayout: 122200000 },
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    ];

    for (const a of auditLogsData) {
      await db.insert(schema.auditLogs).values(a);
    }
    console.log('✅ Seeded Sample Audit Logs');

    console.log('🎉 Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seed:', error);
  } finally {
    process.exit(0);
  }
}

// Auto run if executed directly
if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  runSeed();
}
