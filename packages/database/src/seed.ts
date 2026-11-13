import { db, schema, sql } from './index.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export async function runSeed() {
  console.log('🌱 Starting database seed for Viet Travel Enterprise Group (2026 Edition)...');

  try {
    // 1. Create or get default Tenant
    let [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      [tenant] = await db
        .insert(schema.tenants)
        .values({
          name: 'Viet Travel Enterprise Group',
          slug: 'viettravel-group',
          plan: 'enterprise',
          isActive: true
        })
        .returning();
      console.log('✅ Created Tenant:', tenant.name);
    } else {
      await db
        .update(schema.tenants)
        .set({ name: 'Viet Travel Enterprise Group', slug: 'viettravel-group' })
        .where(sql`id = ${tenant.id}`);
      console.log('✅ Updated Tenant to:', 'Viet Travel Enterprise Group');
    }

    // 2. Seed Users
    const usersData = [
      {
        tenantId: tenant.id,
        email: 'admin@viettravel.vn',
        passwordHash: 'Admin@2026',
        fullName: 'Viet Travel Administrator',
        role: 'SUPER_ADMIN'
      },
      {
        tenantId: tenant.id,
        email: 'giang.th@viettravel.vn',
        passwordHash: 'Admin@2026',
        fullName: 'Trần Hương Giang (Giám Đốc CN Hà Nội)',
        role: 'MANAGER'
      },
      {
        tenantId: tenant.id,
        email: 'quan.vm@viettravel.vn',
        passwordHash: 'Admin@2026',
        fullName: 'Võ Minh Quân (Giám Đốc CN Quận 1)',
        role: 'MANAGER'
      },
      {
        tenantId: tenant.id,
        email: 'vy.dt@viettravel.vn',
        passwordHash: 'Admin@2026',
        fullName: 'Đặng Thảo Vy (Giám Đốc CN Đà Nẵng)',
        role: 'MANAGER'
      },
      {
        tenantId: tenant.id,
        email: 'cashier@viettravel.vn',
        passwordHash: 'Admin@2026',
        fullName: 'Nguyễn Thị Minh Hạnh (Thu Ngân Vé POS)',
        role: 'CASHIER'
      }
    ];

    for (const u of usersData) {
      const [existing] = await db.select().from(schema.users).where(sql`email = ${u.email}`).limit(1);
      if (!existing) {
        await db.insert(schema.users).values(u);
      }
    }
    console.log('✅ Seeded Users (admin@viettravel.vn / Admin@2026)');

    // 3. Seed Products & Tours
    const productsData = [
      {
        tenantId: tenant.id,
        sku: 'TOUR-EU-01',
        name: 'Tour Khám Phá Tây Âu 5 Nước (Pháp - Thụy Sĩ - Ý - Vatican - Monaco)',
        category: 'Tour Outbound',
        unitPrice: '68500000',
        stockQuantity: 40
      },
      {
        tenantId: tenant.id,
        sku: 'TOUR-US-02',
        name: 'Tour Bờ Tây Nước Mỹ Siêu Hấp Dẫn (Los Angeles - Las Vegas - San Francisco)',
        category: 'Tour Outbound',
        unitPrice: '89900000',
        stockQuantity: 30
      },
      {
        tenantId: tenant.id,
        sku: 'TOUR-JP-03',
        name: 'Tour Cung Đường Vàng Nhật Bản Mùa Hoa Anh Đào (Tokyo - Fuji - Kyoto - Osaka)',
        category: 'Tour Châu Á',
        unitPrice: '38900000',
        stockQuantity: 60
      },
      {
        tenantId: tenant.id,
        sku: 'TOUR-MICE-04',
        name: 'Gói Tour Hội Nghị & Teambuilding Doanh Nghiệp M.I.C.E (Đà Nẵng - Hội An)',
        category: 'Tour M.I.C.E',
        unitPrice: '8500000',
        stockQuantity: 200
      },
      {
        tenantId: tenant.id,
        sku: 'TICKET-IATA-05',
        name: 'Vé Máy Bay Quốc Tế Hạng Thương Gia Khứ Hồi Vietnam Airlines / Emirates',
        category: 'Vé Máy Bay',
        unitPrice: '24500000',
        stockQuantity: 150
      }
    ];

    for (const p of productsData) {
      const [existing] = await db.select().from(schema.products).where(sql`sku = ${p.sku}`).limit(1);
      if (!existing) {
        await db.insert(schema.products).values(p);
      }
    }
    console.log('✅ Seeded Tours & Travel Services');

    // 4. Seed CRM Customers
    const customersData = [
      {
        tenantId: tenant.id,
        phoneNumber: '0903123456',
        fullName: 'Nguyễn Thị Mai Lan',
        email: 'mailan.nguyen@vietcorp.vn',
        tier: 'PLATINUM',
        loyaltyPoints: 1200,
        totalSpent: '185000000',
        notes: 'Khách hàng VIP hay đặt tour Outbound Châu Âu, yêu cầu phòng đơn'
      },
      {
        tenantId: tenant.id,
        phoneNumber: '0912888999',
        fullName: 'Trần Văn Hoàng',
        email: 'hoang.tran@globaltech.com',
        tier: 'DIAMOND',
        loyaltyPoints: 2450,
        totalSpent: '420000000',
        notes: 'Trưởng ban đối ngoại tập đoàn, thường xuyên book tour MICE đoàn 100 khách'
      },
      {
        tenantId: tenant.id,
        phoneNumber: '0988777666',
        fullName: 'Phạm Thu Hằng',
        email: 'thuhang.pham@gmail.com',
        tier: 'GOLD',
        loyaltyPoints: 540,
        totalSpent: '78000000',
        notes: 'Đã hoàn tất visa Schengen và Nhật Bản'
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

    // 5. Seed Branches (Chuỗi Chi Nhánh Lữ Hành Toàn Quốc - Model 1)
    const branchesData = [
      {
        tenantId: tenant.id,
        code: 'BR-HN-01',
        name: 'Viet Travel Corp — Trụ Sở Hoàn Kiếm (Hà Nội)',
        phone: '024 3828 2026',
        email: 'hoankiem@viettravel.vn',
        address: 'Số 68 Phố Tràng Thi, Phường Hàng Trống, Quận Hoàn Kiếm',
        city: 'Hà Nội',
        managerName: 'Trần Hương Giang',
        isActive: true
      },
      {
        tenantId: tenant.id,
        code: 'BR-HCM-01',
        name: 'Viet Travel Group — Chi Nhánh Quận 1 (TP. HCM)',
        phone: '028 3910 2026',
        email: 'quan1@viettravel.vn',
        address: 'Số 120 Đường Lê Duẩn, Phường Bến Nghé, Quận 1',
        city: 'TP. Hồ Chí Minh',
        managerName: 'Võ Minh Quân',
        isActive: true
      },
      {
        tenantId: tenant.id,
        code: 'BR-DN-01',
        name: 'Viet Travel Group — Chi Nhánh Hải Châu (Đà Nẵng)',
        phone: '0236 3848 2026',
        email: 'danang@viettravel.vn',
        address: 'Số 86 Đường Bạch Đằng, Phường Hải Châu 1, Quận Hải Châu',
        city: 'Đà Nẵng',
        managerName: 'Đặng Thảo Vy',
        isActive: true
      },
      {
        tenantId: tenant.id,
        code: 'BR-WH-01',
        name: 'Trung Tâm Quản Lý Xe Du Lịch & Hậu Cần Vật Tư',
        phone: '024 3999 8888',
        email: 'fleet@viettravel.vn',
        address: 'Kho Tổng Số 18 Đường Phạm Văn Đồng, Cầu Giấy',
        city: 'Hà Nội',
        managerName: 'Trịnh Quốc Bảo',
        isActive: true
      }
    ];

    for (const b of branchesData) {
      const [existing] = await db.select().from(schema.branches).where(sql`code = ${b.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.branches).values(b);
      }
    }
    console.log('✅ Seeded Branches (Chuỗi Chi Nhánh HN - HCM - DN - Kho Tổng)');

    // Lấy ID chi nhánh
    const [brHN] = await db.select().from(schema.branches).where(sql`code = 'BR-HN-01'`).limit(1);
    const [brHCM] = await db.select().from(schema.branches).where(sql`code = 'BR-HCM-01'`).limit(1);
    const [brDN] = await db.select().from(schema.branches).where(sql`code = 'BR-DN-01'`).limit(1);
    const [brWH] = await db.select().from(schema.branches).where(sql`code = 'BR-WH-01'`).limit(1);

    // 6. Seed Divisions (Khối Trực Thuộc Doanh Nghiệp)
    const divisionsData = [
      {
        tenantId: tenant.id,
        code: 'BLOCK-BOD',
        name: 'Khối Quản Trị & Chiến Lược (BOD)',
        shortName: 'BOD & Quản Trị',
        leaderName: 'Tổng Giám Đốc (CEO)',
        description: 'Chỉ đạo toàn diện hoạt động vận hành, hoạch định chiến lược kinh doanh và tài chính toàn chuỗi',
        color: '#8b5cf6',
        orderIndex: 1
      },
      {
        tenantId: tenant.id,
        code: 'BLOCK-OPS',
        name: 'Khối Thiết Kế & Điều Hành Tour (Operations)',
        shortName: 'Sản Phẩm & Điều Hành',
        leaderName: 'Nguyễn Tuấn Anh (COO)',
        description: 'Thiết kế tuyến điểm mới, đàm phán hàng không và điều hành dịch vụ mặt đất land-tour toàn cầu',
        color: '#0ea5e9',
        orderIndex: 2
      },
      {
        tenantId: tenant.id,
        code: 'BLOCK-GUIDES',
        name: 'Khối Hướng Dẫn Viên & Vận Chuyển Du Lịch',
        shortName: 'Hướng Dẫn Viên & Xe',
        leaderName: 'Phan Thanh Hùng (Giám Đốc Khối HDV)',
        description: 'Đội ngũ tour leader quốc tế, hướng dẫn viên di sản và đội xe du lịch tiêu chuẩn 5 sao',
        color: '#10b981',
        orderIndex: 3
      },
      {
        tenantId: tenant.id,
        code: 'BLOCK-COMMERCIAL',
        name: 'Khối Kinh Doanh, B2B & Tour M.I.C.E',
        shortName: 'Kinh Doanh & M.I.C.E',
        leaderName: 'Lê Thu Thảo (CCO)',
        description: 'Phát triển khách hàng doanh nghiệp, đại lý bán vé B2B và tổ chức tour sự kiện đoàn lớn',
        color: '#f59e0b',
        orderIndex: 4
      },
      {
        tenantId: tenant.id,
        code: 'BLOCK-FINANCE',
        name: 'Khối Tài Chính, Thanh Toán & Vé Máy Bay',
        shortName: 'Tài Chính & Vé Máy Bay',
        leaderName: 'Nguyễn Thị Minh Hạnh (CFO)',
        description: 'Quản lý doanh thu POS, cổng VietQR, đại lý hàng không IATA/BSP và dòng tiền chuỗi',
        color: '#ec4899',
        orderIndex: 5
      },
      {
        tenantId: tenant.id,
        code: 'BLOCK-LOGISTICS',
        name: 'Khối Visa, CSKH & Hậu Cần Xe Du Lịch',
        shortName: 'Visa & Hậu Cần',
        leaderName: 'Trịnh Quốc Bảo (Trưởng Khối Hậu Cần)',
        description: 'Xử lý hồ sơ thị thực xuất nhập cảnh, quản lý trung tâm xe và chăm sóc du khách sau tour',
        color: '#6366f1',
        orderIndex: 6
      }
    ];

    for (const div of divisionsData) {
      const [existing] = await db.select().from(schema.divisions).where(sql`code = ${div.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.divisions).values(div);
      }
    }
    console.log('✅ Seeded Divisions (6 Khối Chức Năng Trực Thuộc)');

    const [divBOD] = await db.select().from(schema.divisions).where(sql`code = 'BLOCK-BOD'`).limit(1);
    const [divOps] = await db.select().from(schema.divisions).where(sql`code = 'BLOCK-OPS'`).limit(1);
    const [divGuides] = await db.select().from(schema.divisions).where(sql`code = 'BLOCK-GUIDES'`).limit(1);
    const [divComm] = await db.select().from(schema.divisions).where(sql`code = 'BLOCK-COMMERCIAL'`).limit(1);
    const [divFin] = await db.select().from(schema.divisions).where(sql`code = 'BLOCK-FINANCE'`).limit(1);
    const [divLog] = await db.select().from(schema.divisions).where(sql`code = 'BLOCK-LOGISTICS'`).limit(1);

    // 7. Seed Departments (Phòng Ban Đa Phân Hệ Theo Cơ Sở - Model 1)
    const departmentsData = [
      // Trụ sở trung ương
      {
        tenantId: tenant.id,
        branchId: null,
        divisionId: divBOD?.id,
        code: 'DEPT-BOD',
        name: 'Ban Giám Đốc & Hội Đồng Quản Trị Lữ Hành',
        description: 'Khối Quản Trị',
        managerName: 'Tổng Giám Đốc (CEO)',
        orderIndex: 1
      },
      {
        tenantId: tenant.id,
        branchId: null,
        divisionId: divOps?.id,
        code: 'DEPT-HQ-PRODUCT',
        name: 'Khối Thiết Kế Sản Phẩm Tour & Hàng Không (GDS)',
        description: 'Khối Điều Hành Tour',
        managerName: 'Nguyễn Tuấn Anh (COO)',
        orderIndex: 2
      },
      {
        tenantId: tenant.id,
        branchId: null,
        divisionId: divComm?.id,
        code: 'DEPT-HQ-COMMERCIAL',
        name: 'Khối Kinh Doanh M.I.C.E & Đại Lý B2B Toàn Quốc',
        description: 'Khối Kinh Doanh & MICE',
        managerName: 'Lê Thu Thảo (CCO)',
        orderIndex: 3
      },
      {
        tenantId: tenant.id,
        branchId: brWH?.id,
        divisionId: divLog?.id,
        code: 'DEPT-FLEET-LOGISTICS',
        name: 'Trung Tâm Quản Lý Xe Du Lịch & Hậu Cần Vật Tư',
        description: 'Khối Visa & Hậu Cần',
        managerName: 'Trịnh Quốc Bảo',
        orderIndex: 4
      },

      // Cơ sở Hoàn Kiếm (HN)
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divOps?.id,
        code: 'DEPT-HN-OUTBOUND',
        name: 'Phòng Điều Hành Tour Outbound (Châu Âu, Mỹ, Úc)',
        description: 'Khối Điều Hành Tour',
        managerName: 'Hoàng Mai Phương',
        orderIndex: 5
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divGuides?.id,
        code: 'DEPT-HN-GUIDES',
        name: 'Đội Ngũ Hướng Dẫn Viên Quốc Tế Miền Bắc',
        description: 'Khối Hướng Dẫn Viên',
        managerName: 'Phan Thanh Hùng',
        orderIndex: 6
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divComm?.id,
        code: 'DEPT-HN-SALES',
        name: 'Phòng Kinh Doanh Tour Khách Đoàn & Bán Lẻ (Hà Nội)',
        description: 'Khối Kinh Doanh & MICE',
        managerName: 'Trần Hương Giang',
        orderIndex: 7
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divFin?.id,
        code: 'DEPT-HN-FINANCE',
        name: 'Phòng Kế Toán Vé Máy Bay & Quầy Thu Ngân POS (HN)',
        description: 'Khối Tài Chính & Vé',
        managerName: 'Nguyễn Thị Minh Hạnh',
        orderIndex: 8
      },

      // Cơ sở Quận 1 (TP. HCM)
      {
        tenantId: tenant.id,
        branchId: brHCM?.id,
        divisionId: divOps?.id,
        code: 'DEPT-HCM-OUTBOUND',
        name: 'Phòng Điều Hành Tour Đông Bắc Á & Đông Nam Á (HCM)',
        description: 'Khối Điều Hành Tour',
        managerName: 'Trần Mỹ Duyên',
        orderIndex: 9
      },
      {
        tenantId: tenant.id,
        branchId: brHCM?.id,
        divisionId: divGuides?.id,
        code: 'DEPT-HCM-GUIDES',
        name: 'Đội Ngũ Hướng Dẫn Viên Du Lịch Miền Nam',
        description: 'Khối Hướng Dẫn Viên',
        managerName: 'Lê Hải Đăng',
        orderIndex: 10
      },
      {
        tenantId: tenant.id,
        branchId: brHCM?.id,
        divisionId: divComm?.id,
        code: 'DEPT-HCM-MICE',
        name: 'Phòng Kinh Doanh Tour M.I.C.E & Khách VIP (TP. HCM)',
        description: 'Khối Kinh Doanh & MICE',
        managerName: 'Võ Minh Quân',
        orderIndex: 11
      },

      // Cơ sở Hải Châu (Đà Nẵng)
      {
        tenantId: tenant.id,
        branchId: brDN?.id,
        divisionId: divOps?.id,
        code: 'DEPT-DN-INBOUND',
        name: 'Phòng Điều Hành Tour Di Sản & Khách Quốc Tế Inbound',
        description: 'Khối Điều Hành Tour',
        managerName: 'Đặng Thảo Vy',
        orderIndex: 12
      },
      {
        tenantId: tenant.id,
        branchId: brDN?.id,
        divisionId: divGuides?.id,
        code: 'DEPT-DN-GUIDES',
        name: 'Đội Hướng Dẫn Viên Tuyến Miền Trung & Di Sản',
        description: 'Khối Hướng Dẫn Viên',
        managerName: 'Nguyễn Hoàng Nam',
        orderIndex: 13
      }
    ];

    for (const d of departmentsData) {
      const [existing] = await db.select().from(schema.departments).where(sql`code = ${d.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.departments).values(d);
      } else {
        await db.update(schema.departments).set({ divisionId: d.divisionId, branchId: d.branchId }).where(sql`id = ${existing.id}`);
      }
    }
    console.log('✅ Seeded Departments (Phòng Ban Đa Phân Hệ Theo Chi Nhánh)');

    // 7. Seed Job Posts (Chức Vụ Hành Chính Level 1-5)
    const jobPostsData = [
      {
        tenantId: tenant.id,
        code: 'POST-BOD',
        name: 'Tổng Giám Đốc (CEO Lữ Hành)',
        level: 1,
        allowanceRate: '20000000.00',
        description: 'Lãnh đạo chiến lược tối cao, ký kết hợp tác quốc tế và phân quyền toàn chuỗi'
      },
      {
        tenantId: tenant.id,
        code: 'POST-BRANCH-DIR',
        name: 'Giám Đốc Chi Nhánh / Quản Lý Cơ Sở',
        level: 2,
        allowanceRate: '10000000.00',
        description: 'Chịu trách nhiệm toàn diện doanh số P&L và điều hành vận hành tại cơ sở'
      },
      {
        tenantId: tenant.id,
        code: 'POST-DEPT-HEAD',
        name: 'Trưởng Phòng Điều Hành / Kinh Doanh Tour',
        level: 3,
        allowanceRate: '5000000.00',
        description: 'Phụ trách chuyên môn tuyến tour, đàm phán dịch vụ và phân bổ tour leader'
      },
      {
        tenantId: tenant.id,
        code: 'POST-TEAM-LEAD',
        name: 'Phó Phòng / Trưởng Nhóm Hướng Dẫn Viên (Lead Guide)',
        level: 4,
        allowanceRate: '2500000.00',
        description: 'Giám sát nghiệp vụ dẫn tour, phân công ca trực sân bay và hỗ trợ giải quyết sự cố'
      },
      {
        tenantId: tenant.id,
        code: 'POST-STAFF',
        name: 'Chuyên Viên / Hướng Dẫn Viên Thực Thi',
        level: 5,
        allowanceRate: '0.00',
        description: 'Nhân sự thực thi dẫn tour, bán vé máy bay, tư vấn visa và chăm sóc du khách'
      }
    ];

    for (const p of jobPostsData) {
      const [existing] = await db.select().from(schema.jobPosts).where(sql`code = ${p.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.jobPosts).values(p);
      }
    }
    console.log('✅ Seeded Job Posts (Chức Vụ Cấp Bậc 1-5)');

    // 8. Seed Job Titles (Chức Danh Chuyên Môn Ngành Du Lịch)
    const jobTitlesData = [
      {
        tenantId: tenant.id,
        code: 'TITLE-TOUR-LEADER',
        name: 'Hướng Dẫn Viên Quốc Tế (Tour Leader Outbound)',
        field: 'Hướng Dẫn Đoàn Quốc Tế',
        standardRequirements: 'Thẻ Hướng Dẫn Viên Quốc Tế (Cục Du Lịch cấp), ngoại ngữ C1, >= 3 năm kinh nghiệm dẫn tuyến Âu/Mỹ'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-TICKETING-SPEC',
        name: 'Chuyên Viên Booker Vé Máy Bay Quốc Tế (GDS Specialist)',
        field: 'Vé Máy Bay & Hàng Không',
        standardRequirements: 'Chứng chỉ IATA, thành thạo hệ thống đặt chỗ Amadeus, Sabre, Galileo và xuất vé BSP'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-TOUR-OPERATOR',
        name: 'Chuyên Viên Thiết Kế & Điều Hành Sản Phẩm Tour',
        field: 'Sản Phẩm & Điều Hành Lữ Hành',
        standardRequirements: 'Tốt nghiệp Đại học chuyên ngành Du lịch, am hiểu sâu thị trường land tour quốc tế'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-MICE-CONSULTANT',
        name: 'Chuyên Viên Tư Vấn Tour Doanh Nghiệp & M.I.C.E',
        field: 'Kinh Doanh Doanh Nghiệp (B2B)',
        standardRequirements: 'Kỹ năng đàm phán B2B xuất sắc, kinh nghiệm tổ chức sự kiện và đấu thầu khách đoàn lớn'
      },
      {
        tenantId: tenant.id,
        code: 'TITLE-VISA-SPECIALIST',
        name: 'Chuyên Viên Hồ Sơ & Thị Thực (Visa Specialist)',
        field: 'Thủ Tục Xuất Nhập Cảnh & Visa',
        standardRequirements: 'Nắm vững quy định Lãnh sự quán Schengen, Mỹ, Úc, Nhật Bản, tỷ lệ đậu visa >= 98%'
      }
    ];

    for (const t of jobTitlesData) {
      const [existing] = await db.select().from(schema.jobTitles).where(sql`code = ${t.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.jobTitles).values(t);
      }
    }
    console.log('✅ Seeded Job Titles (Chức Danh Chuyên Môn Du Lịch & Vé Máy Bay)');

    // 9. Seed Job Positions (Vị Trí Công Việc Kèm Định Biên Headcount Quota)
    const [deptOutboundHN] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HN-OUTBOUND'`).limit(1);
    const [deptGuidesHN] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HN-GUIDES'`).limit(1);
    const [deptSalesHN] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HN-SALES'`).limit(1);
    const [deptFinanceHN] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HN-FINANCE'`).limit(1);

    const [postStaff] = await db.select().from(schema.jobPosts).where(sql`code = 'POST-STAFF'`).limit(1);
    const [postLead] = await db.select().from(schema.jobPosts).where(sql`code = 'POST-TEAM-LEAD'`).limit(1);
    const [postHead] = await db.select().from(schema.jobPosts).where(sql`code = 'POST-DEPT-HEAD'`).limit(1);

    const [titleLeader] = await db.select().from(schema.jobTitles).where(sql`code = 'TITLE-TOUR-LEADER'`).limit(1);
    const [titleTicket] = await db.select().from(schema.jobTitles).where(sql`code = 'TITLE-TICKETING-SPEC'`).limit(1);
    const [titleOperator] = await db.select().from(schema.jobTitles).where(sql`code = 'TITLE-TOUR-OPERATOR'`).limit(1);
    const [titleMICE] = await db.select().from(schema.jobTitles).where(sql`code = 'TITLE-MICE-CONSULTANT'`).limit(1);

    const jobPositionsData = [
      {
        tenantId: tenant.id,
        departmentId: deptOutboundHN?.id,
        postId: postHead?.id,
        titleId: titleOperator?.id,
        code: 'POS-HN-OP-HEAD',
        name: 'Trưởng Phòng Điều Hành Tour Outbound (HN)',
        headcountQuota: 1,
        currentHeadcount: 1,
        minSalary: '25000000.00',
        maxSalary: '40000000.00',
        jdDescription: 'Quản lý điều hành các tour Châu Âu, Mỹ, Úc; đàm phán đối tác land-tour quốc tế'
      },
      {
        tenantId: tenant.id,
        departmentId: deptGuidesHN?.id,
        postId: postLead?.id,
        titleId: titleLeader?.id,
        code: 'POS-HN-GUIDE-LEAD',
        name: 'Tour Leader Trưởng Tuyến Châu Âu & Mỹ',
        headcountQuota: 6,
        currentHeadcount: 5,
        minSalary: '20000000.00',
        maxSalary: '35000000.00',
        jdDescription: 'Phụ trách dẫn đoàn VIP, giám sát các trưởng đoàn thực tập và xử lý tình huống khẩn cấp'
      },
      {
        tenantId: tenant.id,
        departmentId: deptSalesHN?.id,
        postId: postStaff?.id,
        titleId: titleMICE?.id,
        code: 'POS-HN-MICE-CONSULTANT',
        name: 'Chuyên Viên Tư Vấn Tour M.I.C.E & Khách Đoàn',
        headcountQuota: 8,
        currentHeadcount: 6,
        minSalary: '12000000.00',
        maxSalary: '30000000.00',
        jdDescription: 'Tìm kiếm khách hàng doanh nghiệp, tư vấn gói teambuilding và chốt hợp đồng tour đoàn'
      },
      {
        tenantId: tenant.id,
        departmentId: deptFinanceHN?.id,
        postId: postStaff?.id,
        titleId: titleTicket?.id,
        code: 'POS-HN-TICKETING',
        name: 'Chuyên Viên Đặt Chỗ & Xuất Vé Hàng Không GDS',
        headcountQuota: 4,
        currentHeadcount: 3,
        minSalary: '14000000.00',
        maxSalary: '22000000.00',
        jdDescription: 'Đặt giữ chỗ đoàn trên GDS, xuất vé BSP, xử lý đổi ngày bay và hoàn vé theo chính sách'
      }
    ];

    for (const pos of jobPositionsData) {
      const [existing] = await db.select().from(schema.jobPositions).where(sql`code = ${pos.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.jobPositions).values(pos);
      }
    }
    console.log('✅ Seeded Job Positions (Vị Trí Công Việc Kèm Định Biên Headcount Quota)');

    // 10. Seed Employment Types (Tính Chất Công Việc & Phúc Lợi)
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
        code: 'EMP-LEADER-FREELANCE',
        name: 'Hướng Dẫn Viên / Tour Leader Theo Chuyến (Freelancer)',
        workHoursPerWeek: 20,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Hợp đồng khoán việc theo từng tour cụ thể, thanh toán công tác phí + thù lao theo ngày tour'
      },
      {
        tenantId: tenant.id,
        code: 'EMP-COMMERCIAL-AGENT',
        name: 'Cộng Tác Viên Bán Tour & Đại Lý (CTV)',
        workHoursPerWeek: 10,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Hưởng hoa hồng theo số lượng khách chốt thành công, không chấm công cố định'
      },
      {
        tenantId: tenant.id,
        code: 'EMP-PROBATION',
        name: 'Thử Việc (Probation - 60 Ngày)',
        workHoursPerWeek: 44,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Hưởng 85% lương cơ bản theo quy định Bộ luật Lao động, đánh giá năng lực sau 2 tháng'
      },
      {
        tenantId: tenant.id,
        code: 'EMP-SEASONAL',
        name: 'Thời Vụ Cao Điểm Mùa Hè & Lễ Tết (Seasonal)',
        workHoursPerWeek: 48,
        hasInsurance: false,
        standardAnnualLeave: 0,
        description: 'Tăng cường mùa cao điểm du lịch hè (tháng 6-8) và dịp Tết, phụ cấp ca trực sân bay'
      }
    ];

    for (const et of employmentTypesData) {
      const [existing] = await db.select().from(schema.employmentTypes).where(sql`code = ${et.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.employmentTypes).values(et);
      }
    }
    console.log('✅ Seeded Employment Types (Tính Chất Công Việc Ngành Lữ Hành)');

    // 11. Seed Roles (Phân Quyền Ma Trận Granular RBAC)
    const rolesData = [
      {
        tenantId: tenant.id,
        code: 'ROLE_SUPER_ADMIN',
        name: 'Quản Trị Viên Tối Cao (Super Administrator)',
        description: 'Toàn quyền cấu hình hệ thống, quản lý cơ cấu tổ chức, duyệt ngân sách và sao lưu máy chủ',
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
        name: 'Thu Ngân Quầy Vé & Thu Tiền Tour',
        description: 'Tạo đơn đặt tour, quét thanh toán VietQR, xuất hóa đơn vé máy bay',
        isSystem: true,
        permissions: [
          'pos:view', 'pos:create',
          'booking:view', 'booking:checkin',
          'crm:view', 'crm:create'
        ]
      }
    ];

    for (const r of rolesData) {
      const [existing] = await db.select().from(schema.roles).where(sql`code = ${r.code}`).limit(1);
      if (!existing) {
        await db.insert(schema.roles).values(r);
      }
    }
    console.log('✅ Seeded Roles (RBAC Matrix)');

    // 12. Seed System Settings (VietQR, Zalo ZNS, Branding)
    const settingsData = [
      {
        tenantId: tenant.id,
        category: 'vietqr',
        key: 'vietqr_config',
        value: {
          bankCode: 'VCB',
          bankName: 'Vietcombank — Ngân Hàng Ngoại Thương Việt Nam',
          accountNumber: '1028882026',
          accountHolder: 'CONG TY CO PHAN TAP DOAN DU LICH VIET TRAVEL GROUP',
          qrTemplate: 'compact2',
          autoConfirmWebhook: true
        }
      },
      {
        tenantId: tenant.id,
        category: 'zalo_zns',
        key: 'zns_config',
        value: {
          oaId: '2988123456789012',
          appId: '4820268819',
          templates: [
            { id: 'TMPL-TOUR-01', name: 'Xác nhận Đặt Tour & Lịch Bay Thành Công', status: 'ACTIVE' },
            { id: 'TMPL-VISA-02', name: 'Thông báo Kết Quả Visa & Hướng Dẫn Khởi Hành', status: 'ACTIVE' },
            { id: 'TMPL-FEEDBACK-03', name: 'Khảo sát Hài Lòng Dịch Vụ Sau Chuyến Đi', status: 'ACTIVE' }
          ]
        }
      },
      {
        tenantId: tenant.id,
        category: 'branding',
        key: 'branding_config',
        value: {
          brandName: 'Viet Travel Enterprise Group — International Tour Operator',
          shortName: 'VIET TRAVEL GROUP',
          hotline: '1900 882026',
          defaultThemeColor: '#dc0037', // Ruby Red
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
    console.log('✅ Seeded System Settings (VietQR, ZNS, Branding)');

    // 12. Seed Employees & Link System User Accounts
    const [deptBOD] = await db.select().from(schema.departments).where(sql`code = 'DEPT-BOD'`).limit(1);
    const [deptHQProduct] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HQ-PRODUCT'`).limit(1);
    const [deptHQComm] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HQ-COMMERCIAL'`).limit(1);
    const [deptFleet] = await db.select().from(schema.departments).where(sql`code = 'DEPT-FLEET-LOGISTICS'`).limit(1);
    const [deptHCMMice] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HCM-MICE'`).limit(1);
    const [deptHCMOutbound] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HCM-OUTBOUND'`).limit(1);
    const [deptHCMGuides] = await db.select().from(schema.departments).where(sql`code = 'DEPT-HCM-GUIDES'`).limit(1);
    const [deptDNInbound] = await db.select().from(schema.departments).where(sql`code = 'DEPT-DN-INBOUND'`).limit(1);
    const [deptDNGuides] = await db.select().from(schema.departments).where(sql`code = 'DEPT-DN-GUIDES'`).limit(1);

    const employeesData = [
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divComm?.id,
        departmentId: deptSalesHN?.id,
        employeeCode: 'NV-HN-001',
        fullName: 'Trần Hương Giang',
        email: 'giang.th@viettravel.vn',
        workEmail: 'giang.th@viettravel.vn',
        phoneNumber: '0903 123 456',
        citizenId: '001185002341',
        department: 'Phòng Kinh Doanh Tour Khách Đoàn & Bán Lẻ (Hà Nội)',
        baseSalary: '35000000',
        commissionRate: '0.0800',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHCM?.id,
        divisionId: divComm?.id,
        departmentId: deptHCMMice?.id,
        employeeCode: 'NV-HCM-001',
        fullName: 'Võ Minh Quân',
        email: 'quan.vm@viettravel.vn',
        workEmail: 'quan.vm@viettravel.vn',
        phoneNumber: '0908 234 567',
        citizenId: '079188003452',
        department: 'Phòng Kinh Doanh Tour M.I.C.E & Khách VIP (TP. HCM)',
        baseSalary: '35000000',
        commissionRate: '0.0800',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brDN?.id,
        divisionId: divOps?.id,
        departmentId: deptDNInbound?.id,
        employeeCode: 'NV-DN-001',
        fullName: 'Đặng Thảo Vy',
        email: 'vy.dt@viettravel.vn',
        workEmail: 'vy.dt@viettravel.vn',
        phoneNumber: '0905 345 678',
        citizenId: '048190004563',
        department: 'Phòng Điều Hành Tour Di Sản & Khách Quốc Tế Inbound',
        baseSalary: '28000000',
        commissionRate: '0.0600',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divFin?.id,
        departmentId: deptFinanceHN?.id,
        employeeCode: 'NV-HN-004',
        fullName: 'Nguyễn Thị Minh Hạnh',
        email: 'cashier@viettravel.vn',
        workEmail: 'cashier@viettravel.vn',
        phoneNumber: '0914 678 901',
        citizenId: '001192005674',
        department: 'Phòng Kế Toán Vé Máy Bay & Quầy Thu Ngân POS (HN)',
        baseSalary: '16000000',
        commissionRate: '0.0200',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divBOD?.id,
        departmentId: deptBOD?.id,
        employeeCode: 'NV-HN-005',
        fullName: 'Nguyễn Tuấn Anh',
        email: 'admin@viettravel.vn',
        workEmail: 'admin@viettravel.vn',
        phoneNumber: '0904 789 012',
        citizenId: '001180006785',
        department: 'Ban Giám Đốc & Hội Đồng Quản Trị Lữ Hành',
        baseSalary: '45000000',
        commissionRate: '0.0500',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divOps?.id,
        departmentId: deptOutboundHN?.id,
        employeeCode: 'NV-HN-002',
        fullName: 'Hoàng Mai Phương',
        email: 'phuong.hm@viettravel.vn',
        workEmail: 'phuong.hm@viettravel.vn',
        phoneNumber: '0912 456 789',
        citizenId: '001187007896',
        department: 'Phòng Điều Hành Tour Outbound (Châu Âu, Mỹ, Úc)',
        baseSalary: '25000000',
        commissionRate: '0.0500',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divGuides?.id,
        departmentId: deptGuidesHN?.id,
        employeeCode: 'NV-HN-003',
        fullName: 'Phan Thanh Hùng',
        email: 'hung.pt@viettravel.vn',
        workEmail: 'hung.pt@viettravel.vn',
        phoneNumber: '0913 567 890',
        citizenId: '001183008907',
        department: 'Đội Ngũ Hướng Dẫn Viên Quốc Tế Miền Bắc',
        baseSalary: '20000000',
        commissionRate: '0.0600',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divComm?.id,
        departmentId: deptHQComm?.id,
        employeeCode: 'NV-HN-006',
        fullName: 'Lê Thu Thảo',
        email: 'thao.lt@viettravel.vn',
        workEmail: 'thao.lt@viettravel.vn',
        phoneNumber: '0906 890 123',
        citizenId: '001186009018',
        department: 'Khối Kinh Doanh M.I.C.E & Đại Lý B2B Toàn Quốc',
        baseSalary: '38000000',
        commissionRate: '0.0800',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brWH?.id,
        divisionId: divLog?.id,
        departmentId: deptFleet?.id,
        employeeCode: 'NV-HN-007',
        fullName: 'Trịnh Quốc Bảo',
        email: 'bao.tq@viettravel.vn',
        workEmail: 'bao.tq@viettravel.vn',
        phoneNumber: '0907 901 234',
        citizenId: '001182001129',
        department: 'Trung Tâm Quản Lý Xe Du Lịch & Hậu Cần Vật Tư',
        baseSalary: '22000000',
        commissionRate: '0.0300',
        status: 'ACTIVE',
        isActive: true
      },
      // --- CÁC NHÂN SỰ CHƯA CẤP TÀI KHOẢN (SẴN SÀNG ĐỂ CẤP PHÁT HỆ THỐNG) ---
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divComm?.id,
        departmentId: deptSalesHN?.id,
        employeeCode: 'NV-HN-008',
        fullName: 'Vũ Đình Trọng',
        email: 'trong.vd@viettravel.vn',
        workEmail: 'trong.vd@viettravel.vn',
        phoneNumber: '0918 012 345',
        citizenId: '001195002230',
        department: 'Phòng Kinh Doanh Tour Khách Đoàn & Bán Lẻ (Hà Nội)',
        baseSalary: '14000000',
        commissionRate: '0.0500',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHCM?.id,
        divisionId: divOps?.id,
        departmentId: deptHCMOutbound?.id,
        employeeCode: 'NV-HCM-002',
        fullName: 'Trần Mỹ Duyên',
        email: 'duyen.tm@viettravel.vn',
        workEmail: 'duyen.tm@viettravel.vn',
        phoneNumber: '0938 123 456',
        citizenId: '079193003341',
        department: 'Phòng Điều Hành Tour Đông Bắc Á & Đông Nam Á (HCM)',
        baseSalary: '18000000',
        commissionRate: '0.0500',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHCM?.id,
        divisionId: divGuides?.id,
        departmentId: deptHCMGuides?.id,
        employeeCode: 'NV-HCM-003',
        fullName: 'Lê Hải Đăng',
        email: 'dang.lh@viettravel.vn',
        workEmail: 'dang.lh@viettravel.vn',
        phoneNumber: '0948 234 567',
        citizenId: '079189004452',
        department: 'Đội Ngũ Hướng Dẫn Viên Du Lịch Miền Nam',
        baseSalary: '16000000',
        commissionRate: '0.0600',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brDN?.id,
        divisionId: divGuides?.id,
        departmentId: deptDNGuides?.id,
        employeeCode: 'NV-DN-002',
        fullName: 'Nguyễn Hoàng Nam',
        email: 'nam.nh@viettravel.vn',
        workEmail: 'nam.nh@viettravel.vn',
        phoneNumber: '0978 345 678',
        citizenId: '048194005563',
        department: 'Đội Hướng Dẫn Viên Tuyến Miền Trung & Di Sản',
        baseSalary: '15000000',
        commissionRate: '0.0600',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brDN?.id,
        divisionId: divOps?.id,
        departmentId: deptDNInbound?.id,
        employeeCode: 'NV-DN-003',
        fullName: 'Phạm Thu Trang',
        email: 'trang.pt@viettravel.vn',
        workEmail: 'trang.pt@viettravel.vn',
        phoneNumber: '0988 456 789',
        citizenId: '048196006674',
        department: 'Phòng Điều Hành Tour Di Sản & Khách Quốc Tế Inbound',
        baseSalary: '12000000',
        commissionRate: '0.0200',
        status: 'ACTIVE',
        isActive: true
      },
      {
        tenantId: tenant.id,
        branchId: brHN?.id,
        divisionId: divOps?.id,
        departmentId: deptHQProduct?.id,
        employeeCode: 'NV-HN-009',
        fullName: 'Đỗ Thùy Linh',
        email: 'linh.dt@viettravel.vn',
        workEmail: 'linh.dt@viettravel.vn',
        phoneNumber: '0922 567 890',
        citizenId: '001198007785',
        department: 'Khối Thiết Kế Sản Phẩm Tour & Hàng Không (GDS)',
        baseSalary: '12000000',
        commissionRate: '0.0400',
        status: 'PROBATION',
        isActive: true
      }
    ];

    for (const emp of employeesData) {
      const [existing] = await db.select().from(schema.employees).where(sql`employee_code = ${emp.employeeCode}`).limit(1);
      if (!existing) {
        await db.insert(schema.employees).values(emp);
      } else {
        await db.update(schema.employees).set({
          branchId: emp.branchId,
          divisionId: emp.divisionId,
          departmentId: emp.departmentId,
          workEmail: emp.workEmail,
          status: emp.status
        }).where(sql`id = ${existing.id}`);
      }
    }
    console.log('✅ Seeded Employees (15 Nhân Sự Lữ Hành Đa Chi Nhánh Chuẩn HR)');

    // Link User Accounts to Employees
    const empMap: Record<string, string> = {
      'admin@viettravel.vn': 'NV-HN-005',
      'giang.th@viettravel.vn': 'NV-HN-001',
      'quan.vm@viettravel.vn': 'NV-HCM-001',
      'vy.dt@viettravel.vn': 'NV-DN-001',
      'cashier@viettravel.vn': 'NV-HN-004'
    };

    const moduleMap: Record<string, string[]> = {
      'admin@viettravel.vn': ['crm', 'booking', 'pos', 'hr', 'bi', 'ai', 'system'],
      'giang.th@viettravel.vn': ['crm', 'booking', 'pos', 'hr'],
      'quan.vm@viettravel.vn': ['crm', 'booking', 'pos', 'hr'],
      'vy.dt@viettravel.vn': ['crm', 'booking', 'pos', 'hr'],
      'cashier@viettravel.vn': ['pos', 'booking']
    };

    for (const [userEmail, empCode] of Object.entries(empMap)) {
      const [emp] = await db.select().from(schema.employees).where(sql`employee_code = ${empCode}`).limit(1);
      if (emp) {
        await db
          .update(schema.users)
          .set({
            employeeId: emp.id,
            allowedModules: JSON.stringify(moduleMap[userEmail] || ['pos'])
          })
          .where(sql`email = ${userEmail}`);
      }
    }
    console.log('✅ Linked Existing User Accounts to HR Employees (1-1 Provisioning Link)');

    // 13. Seed Sample Audit Logs
    const auditLogsData = [
      {
        tenantId: tenant.id,
        userName: 'Viet Travel Administrator',
        action: 'SYSTEM_INIT',
        resource: 'ORGANIZATION',
        resourceId: 'BR-HN-01',
        diff: { status: 'INITIALIZED', branchesCount: 4, departmentsCount: 13 },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      },
      {
        tenantId: tenant.id,
        userName: 'Trần Hương Giang',
        action: 'PAYROLL_CALCULATE',
        resource: 'PAYROLL',
        resourceId: '2026-11',
        diff: { month: '2026-11', totalEmployees: 26, totalPayout: 382500000 },
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    ];

    for (const a of auditLogsData) {
      await db.insert(schema.auditLogs).values(a);
    }
    console.log('✅ Seeded Sample Audit Logs');

    console.log('🎉 Database seed completed successfully for Viet Travel Group!');
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
