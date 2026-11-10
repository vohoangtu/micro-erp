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
