'use client';

import React, { useState } from 'react';
import {
  Settings,
  Network,
  Users,
  ShieldCheck,
  Building2,
  QrCode,
  Bot,
  Server,
  FileText,
  Sliders,
  CheckCircle2,
  Database,
  Plus,
  Layers,
  Award,
  Clock,
  Briefcase,
  Check,
  HardDrive,
  Cpu,
  Activity,
  MessageSquare
} from 'lucide-react';
import { UniversalTopbar, Sidebar, SubpageItem } from '@erp/ui';
import { OrgMetricRibbon } from '../components/org/OrgMetricRibbon';
import { DepartmentManager, DepartmentItem } from '../components/org/DepartmentManager';
import { BranchManager, BranchItem } from '../components/org/BranchManager';
import { DivisionManager, DivisionItem } from '../components/org/DivisionManager';
import { JobPostManager, JobPostItem } from '../components/org/JobPostManager';
import { JobTitleManager, JobTitleItem } from '../components/org/JobTitleManager';
import { JobPositionManager, JobPositionItem } from '../components/org/JobPositionManager';
import { EmploymentTypeManager, EmploymentTypeItem } from '../components/org/EmploymentTypeManager';
import { OrgTreeChart } from '../components/org/OrgTreeChart';
import { OrgEntityModal, OrgEntityType } from '../components/org/OrgEntityModal';
import { UserManager, SystemUserItem } from '../components/users/UserManager';
import { UserProvisionModal, UnprovisionedEmployee } from '../components/users/UserProvisionModal';

// Mock Data for Initial State (Travel Enterprise - Multi-Branch Architecture)
const INITIAL_BRANCHES = [
  {
    id: 'br-1',
    code: 'BR-HN-01',
    name: 'Viet Travel Corp — Trụ Sở Hoàn Kiếm (Hà Nội)',
    phone: '024 3828 2026',
    address: 'Tòa nhà Hanoi Opera Center, Số 68 Tràng Thi, Hoàn Kiếm, Hà Nội',
    managerName: 'Trần Hương Giang',
    headcount: 28,
    revenueToday: '185.000.000 đ',
    isActive: true
  },
  {
    id: 'br-2',
    code: 'BR-HCM-01',
    name: 'Viet Travel Group — Chi Nhánh Quận 1 (TP. HCM)',
    phone: '028 3910 2026',
    address: 'Tòa nhà Saigon Tower, Số 120 Đường Lê Duẩn, Bến Nghé, Quận 1, TP. HCM',
    managerName: 'Võ Minh Quân',
    headcount: 24,
    revenueToday: '240.000.000 đ',
    isActive: true
  },
  {
    id: 'br-3',
    code: 'BR-DN-01',
    name: 'Viet Travel Group — Chi Nhánh Hải Châu (Đà Nẵng)',
    phone: '0236 3848 2026',
    address: 'Số 86 Đường Bạch Đằng, Phường Hải Châu 1, Hải Châu, Đà Nẵng',
    managerName: 'Đặng Thảo Vy',
    headcount: 16,
    revenueToday: '115.000.000 đ',
    isActive: true
  }
];

const INITIAL_DIVISIONS: DivisionItem[] = [
  {
    id: 'div-1',
    code: 'BLOCK-BOD',
    name: 'Khối Quản Trị & Chiến Lược',
    shortName: 'BOD',
    leaderName: 'Lê Minh Sơn (COO)',
    color: '#4f46e5',
    orderIndex: 1,
    description: 'Định hướng chiến lược kinh doanh lữ hành toàn cầu, đối ngoại, chuyển đổi số & quản trị doanh nghiệp',
    isActive: true
  },
  {
    id: 'div-2',
    code: 'BLOCK-OPS',
    name: 'Khối Thiết Kế & Điều Hành Tour',
    shortName: 'OPS',
    leaderName: 'Nguyễn Tuấn Anh (COO)',
    color: '#0284c7',
    orderIndex: 2,
    description: 'Thiết kế sản phẩm tour Inbound, Outbound, nội địa và đặt giữ chỗ hàng không GDS toàn cầu',
    isActive: true
  },
  {
    id: 'div-3',
    code: 'BLOCK-GUIDES',
    name: 'Khối Hướng Dẫn Viên & Vận Chuyển',
    shortName: 'GUIDES',
    leaderName: 'Phan Thanh Hùng (Director)',
    color: '#16a34a',
    orderIndex: 3,
    description: 'Quản lý đội ngũ hướng dẫn viên quốc tế đa ngôn ngữ và điều phối xe du lịch toàn tuyến',
    isActive: true
  },
  {
    id: 'div-4',
    code: 'BLOCK-COMMERCIAL',
    name: 'Khối Kinh Doanh, B2B & M.I.C.E',
    shortName: 'MICE',
    leaderName: 'Lê Thu Thảo (CCO)',
    color: '#d97706',
    orderIndex: 4,
    description: 'Phát triển khách hàng doanh nghiệp M.I.C.E, chuỗi đại lý lữ hành B2B và bán lẻ toàn quốc',
    isActive: true
  },
  {
    id: 'div-5',
    code: 'BLOCK-FINANCE',
    name: 'Khối Tài Chính, Thanh Toán & Vé',
    shortName: 'FIN',
    leaderName: 'Nguyễn Thị Minh Hạnh (CFO)',
    color: '#9333ea',
    orderIndex: 5,
    description: 'Quản lý dòng tiền vé máy bay, bảo lãnh thanh toán quốc tế và hệ thống thu ngân POS đa cơ sở',
    isActive: true
  },
  {
    id: 'div-6',
    code: 'BLOCK-LOGISTICS',
    name: 'Khối Visa, CSKH & Xe Du Lịch',
    shortName: 'LOG',
    leaderName: 'Trịnh Quốc Bảo (Director)',
    color: '#dc2626',
    orderIndex: 6,
    description: 'Xử lý thủ tục thị thực visa các nước, chăm sóc khách hàng VIP và hậu cần vận tải',
    isActive: true
  }
];

const INITIAL_DEPARTMENTS = [
  // 1. Trụ Sở & Điều Hành Toàn Hệ Thống (HQ)
  {
    id: 'd-1',
    code: 'DEPT-BOD',
    name: 'Ban Giám Đốc & Hội Đồng Quản Trị Lữ Hành',
    manager: 'Tổng Giám Đốc (CEO)',
    branch: 'Toàn Hệ Thống',
    headcount: 3,
    level: 'Khối Quản Trị'
  },
  {
    id: 'd-2',
    code: 'DEPT-HQ-PRODUCT',
    name: 'Khối Thiết Kế Sản Phẩm Tour & Hàng Không (GDS)',
    manager: 'Nguyễn Tuấn Anh (COO)',
    branch: 'Toàn Hệ Thống',
    headcount: 5,
    level: 'Khối Điều Hành Tour'
  },
  {
    id: 'd-3',
    code: 'DEPT-HQ-COMMERCIAL',
    name: 'Khối Kinh Doanh M.I.C.E & Đại Lý B2B Toàn Quốc',
    manager: 'Lê Thu Thảo (CCO)',
    branch: 'Toàn Hệ Thống',
    headcount: 6,
    level: 'Khối Kinh Doanh & MICE'
  },
  {
    id: 'd-4',
    code: 'DEPT-FLEET-LOGISTICS',
    name: 'Trung Tâm Quản Lý Xe Du Lịch & Hậu Cần Vật Tư',
    manager: 'Trịnh Quốc Bảo',
    branch: 'Kho Tổng Hà Nội',
    headcount: 4,
    level: 'Khối Visa & Hậu Cần'
  },

  // 2. Chi Nhánh Trụ Sở Hoàn Kiếm (Hà Nội - Cơ sở 1)
  {
    id: 'd-5',
    code: 'DEPT-HN-OUTBOUND',
    name: 'Phòng Điều Hành Tour Outbound (Châu Âu, Mỹ, Úc)',
    manager: 'Hoàng Mai Phương',
    branch: 'Cơ sở Hoàn Kiếm',
    headcount: 8,
    level: 'Khối Điều Hành Tour'
  },
  {
    id: 'd-6',
    code: 'DEPT-HN-GUIDES',
    name: 'Đội Ngũ Hướng Dẫn Viên Quốc Tế Miền Bắc',
    manager: 'Phan Thanh Hùng',
    branch: 'Cơ sở Hoàn Kiếm',
    headcount: 14,
    level: 'Khối Hướng Dẫn Viên'
  },
  {
    id: 'd-7',
    code: 'DEPT-HN-SALES',
    name: 'Phòng Kinh Doanh Tour Khách Đoàn & Bán Lẻ (Hà Nội)',
    manager: 'Trần Hương Giang',
    branch: 'Cơ sở Hoàn Kiếm',
    headcount: 9,
    level: 'Khối Kinh Doanh & MICE'
  },
  {
    id: 'd-8',
    code: 'DEPT-HN-FINANCE',
    name: 'Phòng Kế Toán Vé Máy Bay & Quầy Thu Ngân POS (HN)',
    manager: 'Nguyễn Thị Minh Hạnh',
    branch: 'Cơ sở Hoàn Kiếm',
    headcount: 5,
    level: 'Khối Tài Chính & Vé'
  },

  // 3. Chi Nhánh Quận 1 (TP. HCM - Cơ sở 2)
  {
    id: 'd-9',
    code: 'DEPT-HCM-OUTBOUND',
    name: 'Phòng Điều Hành Tour Đông Bắc Á & Đông Nam Á (HCM)',
    manager: 'Trần Mỹ Duyên',
    branch: 'Chi Nhánh Quận 1',
    headcount: 7,
    level: 'Khối Điều Hành Tour'
  },
  {
    id: 'd-10',
    code: 'DEPT-HCM-GUIDES',
    name: 'Đội Ngũ Hướng Dẫn Viên Du Lịch Miền Nam',
    manager: 'Lê Minh Trí',
    branch: 'Chi Nhánh Quận 1',
    headcount: 12,
    level: 'Khối Hướng Dẫn Viên'
  },
  {
    id: 'd-11',
    code: 'DEPT-HCM-SALES',
    name: 'Phòng Kinh Doanh Tour M.I.C.E & Khách VIP (TP. HCM)',
    manager: 'Võ Minh Quân',
    branch: 'Chi Nhánh Quận 1',
    headcount: 8,
    level: 'Khối Kinh Doanh & MICE'
  },
  {
    id: 'd-12',
    code: 'DEPT-HCM-FINANCE',
    name: 'Phòng Kế Toán Thanh Toán Quốc Tế & Quầy POS (HCM)',
    manager: 'Vũ Thị Ngọc Ánh',
    branch: 'Chi Nhánh Quận 1',
    headcount: 4,
    level: 'Khối Tài Chính & Vé'
  },

  // 4. Chi Nhánh Hải Châu (Đà Nẵng - Cơ sở 3)
  {
    id: 'd-13',
    code: 'DEPT-DN-INBOUND',
    name: 'Phòng Điều Hành Tour Di Sản & Khách Quốc Tế Inbound',
    manager: 'Nguyễn Bích Loan',
    branch: 'Chi Nhánh Đà Nẵng',
    headcount: 5,
    level: 'Khối Điều Hành Tour'
  },
  {
    id: 'd-14',
    code: 'DEPT-DN-GUIDES',
    name: 'Đội Hướng Dẫn Viên Tuyến Miền Trung & Di Sản',
    manager: 'Trần Quốc Huy',
    branch: 'Chi Nhánh Đà Nẵng',
    headcount: 8,
    level: 'Khối Hướng Dẫn Viên'
  },
  {
    id: 'd-15',
    code: 'DEPT-DN-SALES',
    name: 'Phòng Kinh Doanh Tour Biển Đảo & Khách Lẻ (Đà Nẵng)',
    manager: 'Đặng Thảo Vy',
    branch: 'Chi Nhánh Đà Nẵng',
    headcount: 5,
    level: 'Khối Kinh Doanh & MICE'
  },
  {
    id: 'd-16',
    code: 'DEPT-DN-FINANCE',
    name: 'Quầy Thu Ngân POS & Kế Toán Tour Chi Nhánh Đà Nẵng',
    manager: 'Phạm Thu Trang',
    branch: 'Chi Nhánh Đà Nẵng',
    headcount: 3,
    level: 'Khối Tài Chính & Vé'
  }
];

const INITIAL_JOB_POSTS = [
  { id: 'p-1', code: 'POST-BOD', name: 'Tổng Giám Đốc Lữ Hành (CEO / C-Level)', level: 1, allowance: '25.000.000 đ', desc: 'Chỉ đạo chiến lược kinh doanh lữ hành quốc tế, đối tác hàng không toàn cầu' },
  { id: 'p-2', code: 'POST-BRANCH-DIR', name: 'Giám Đốc Chi Nhánh / Trưởng Văn Phòng Đại Diện', level: 2, allowance: '12.000.000 đ', desc: 'Chịu trách nhiệm toàn diện doanh số, thị trường địa bàn và điều hành tour cơ sở' },
  { id: 'p-3', code: 'POST-DEPT-HEAD', name: 'Trưởng Phòng Điều Hành / Trưởng Phòng Kinh Doanh Tour', level: 3, allowance: '6.000.000 đ', desc: 'Phụ trách tuyến điểm, điều phối landtour, phân tour và giám sát doanh số' },
  { id: 'p-4', code: 'POST-TEAM-LEAD', name: 'Trưởng Nhóm Sản Phẩm / Tour Leader Trưởng', level: 4, allowance: '3.000.000 đ', desc: 'Phụ trách đoàn tour thực tế, xử lý sự cố phát sinh tại nước ngoài và nội địa' },
  { id: 'p-5', code: 'POST-STAFF', name: 'Chuyên Viên Điều Hành / Tư Vấn Bán Tour / Hướng Dẫn Viên', level: 5, allowance: '0 đ', desc: 'Tác nghiệp đặt booking, tư vấn bán tour, hướng dẫn đoàn khách' }
];

const INITIAL_JOB_TITLES = [
  { id: 't-1', code: 'TITLE-TOUR-GUIDE-INT', name: 'Hướng Dẫn Viên Du Lịch Quốc Tế', field: 'Hướng Dẫn Đoàn Quốc Tế', cert: 'Thẻ Hướng Dẫn Viên Quốc Tế (Cục Du Lịch Quốc Gia), Ngoại ngữ C1' },
  { id: 't-2', code: 'TITLE-AIR-TICKETING', name: 'Chuyên Viên Đặt Giữ Chỗ Hàng Không & Xuất Vé GDS', field: 'Vé Máy Bay & Hàng Không', cert: 'Chứng chỉ IATA, Amadeus, Sabre, Galileo, BSP Vietnam' },
  { id: 't-3', code: 'TITLE-TOUR-OPERATOR', name: 'Chuyên Viên Thiết Kế & Điều Hành Tour Trọn Gói', field: 'Sản Phẩm & Điều Hành Lữ Hành', cert: 'Chứng chỉ Nghiệp vụ Điều hành Du lịch Quốc tế' },
  { id: 't-4', code: 'TITLE-MICE-CONSULTANT', name: 'Chuyên Viên Tư Vấn Tour Khách Đoàn Doanh Nghiệp (M.I.C.E)', field: 'Kinh Doanh Doanh Nghiệp (B2B)', cert: 'Kỹ năng đàm phán hợp đồng lữ hành doanh nghiệp, đấu thầu tour' },
  { id: 't-5', code: 'TITLE-VISA-SPECIALIST', name: 'Chuyên Viên Xử Lý Hồ Sơ Visa & Lãnh Sự Quán', field: 'Thủ Tục Xuất Nhập Cảnh & Visa', cert: 'Kinh nghiệm hồ sơ Visa Châu Âu Schengen, Mỹ, Canada, Nhật Bản, Hàn Quốc' }
];

const INITIAL_JOB_POSITIONS: JobPositionItem[] = [
  // Cơ sở Hoàn Kiếm (HN)
  { id: 'pos-1', code: 'POS-TOUR-OP-HN', name: 'Chuyên Viên Điều Hành Tour Châu Âu & Mỹ (Outbound)', dept: 'Phòng Điều Hành Tour Outbound (Châu Âu, Mỹ, Úc)', branch: 'Cơ sở Hoàn Kiếm', quota: 4, current: 4, salaryRange: '18M - 35M đ' },
  { id: 'pos-2', code: 'POS-GUIDE-HN', name: 'Hướng Dẫn Viên Quốc Tế Tiếng Anh / Pháp / Đức', dept: 'Đội Ngũ Hướng Dẫn Viên Quốc Tế Miền Bắc', branch: 'Cơ sở Hoàn Kiếm', quota: 10, current: 8, salaryRange: '15M - 45M đ' },
  { id: 'pos-3', code: 'POS-MICE-HN', name: 'Chuyên Viên Tư Vấn Tour Khách Đoàn M.I.C.E (Hà Nội)', dept: 'Phòng Kinh Doanh Tour Khách Đoàn & Bán Lẻ (Hà Nội)', branch: 'Cơ sở Hoàn Kiếm', quota: 8, current: 6, salaryRange: '12M - 40M đ' },
  { id: 'pos-4', code: 'POS-TICKET-HN', name: 'Kế Toán Xuất Vé Hàng Không & Quầy Thu Ngân POS', dept: 'Phòng Kế Toán Vé Máy Bay & Quầy Thu Ngân POS (HN)', branch: 'Cơ sở Hoàn Kiếm', quota: 4, current: 3, salaryRange: '10M - 18M đ' },

  // Chi Nhánh Quận 1 (TP. HCM)
  { id: 'pos-5', code: 'POS-TOUR-OP-HCM', name: 'Chuyên Viên Điều Hành Tour Nhật Bản & Hàn Quốc (HCM)', dept: 'Phòng Điều Hành Tour Đông Bắc Á & Đông Nam Á (HCM)', branch: 'Chi Nhánh Quận 1', quota: 5, current: 4, salaryRange: '16M - 32M đ' },
  { id: 'pos-6', code: 'POS-GUIDE-HCM', name: 'Hướng Dẫn Viên Du Lịch Tiếng Nhật / Hàn / Trung', dept: 'Đội Ngũ Hướng Dẫn Viên Du Lịch Miền Nam', branch: 'Chi Nhánh Quận 1', quota: 8, current: 6, salaryRange: '15M - 40M đ' },
  { id: 'pos-7', code: 'POS-MICE-HCM', name: 'Chuyên Viên Kinh Doanh Tour Doanh Nghiệp VIP (HCM)', dept: 'Phòng Kinh Doanh Tour M.I.C.E & Khách VIP (TP. HCM)', branch: 'Chi Nhánh Quận 1', quota: 8, current: 7, salaryRange: '15M - 45M đ' },
  { id: 'pos-8', code: 'POS-CASH-HCM', name: 'Thu Ngân Quầy POS & Kế Toán Công Nợ Tour (HCM)', dept: 'Phòng Kế Toán Thanh Toán Quốc Tế & Quầy POS (HCM)', branch: 'Chi Nhánh Quận 1', quota: 3, current: 3, salaryRange: '10M - 18M đ' },

  // Chi Nhánh Hải Châu (Đà Nẵng)
  { id: 'pos-9', code: 'POS-INBOUND-DN', name: 'Chuyên Viên Điều Hành Tour Khách Quốc Tế Inbound (Đà Nẵng)', dept: 'Phòng Điều Hành Tour Di Sản & Khách Quốc Tế Inbound', branch: 'Chi Nhánh Đà Nẵng', quota: 4, current: 3, salaryRange: '14M - 26M đ' },
  { id: 'pos-10', code: 'POS-GUIDE-DN', name: 'Hướng Dẫn Viên Du Lịch Tuyến Miền Trung (Huế - Hội An)', dept: 'Đội Hướng Dẫn Viên Tuyến Miền Trung & Di Sản', branch: 'Chi Nhánh Đà Nẵng', quota: 6, current: 5, salaryRange: '12M - 30M đ' },
  { id: 'pos-11', code: 'POS-SALE-DN', name: 'Chuyên Viên Bán Tour Biển Đảo & Khách Lẻ (Đà Nẵng)', dept: 'Phòng Kinh Doanh Tour Biển Đảo & Khách Lẻ (Đà Nẵng)', branch: 'Chi Nhánh Đà Nẵng', quota: 4, current: 3, salaryRange: '10M - 25M đ' },

  // Trụ Sở Toàn Hệ Thống (HQ)
  { id: 'pos-12', code: 'POS-GDS-HQ', name: 'Trưởng Nhóm Booking Vé Máy Bay & Đại Lý Hàng Không GDS', dept: 'Khối Thiết Kế Sản Phẩm Tour & Hàng Không (GDS)', branch: 'Toàn Hệ Thống', quota: 3, current: 3, salaryRange: '22M - 40M đ' },
  { id: 'pos-13', code: 'POS-FLEET-HQ', name: 'Quản Lý Điều Đội Xe Du Lịch & Kho Vật Tư Lữ Hành', dept: 'Trung Tâm Quản Lý Xe Du Lịch & Hậu Cần Vật Tư', branch: 'Kho Tổng Hà Nội', quota: 3, current: 3, salaryRange: '14M - 22M đ' }
];

const INITIAL_EMPLOYMENT_TYPES = [
  { id: 'et-1', code: 'EMP-FULLTIME', name: 'Toàn Thời Gian Cố Định (Văn Phòng Lữ Hành)', hours: 44, insurance: true, leave: 12, desc: 'HĐLĐ chính thức không xác định thời hạn, đóng BHXH/BHYT đầy đủ' },
  { id: 'et-2', code: 'EMP-TOUR-LEADER', name: 'Hướng Dẫn Viên Theo Đoàn (Tour Leader / Freelancer)', hours: 30, insurance: false, leave: 0, desc: 'Tính theo ngày công tác dẫn tour + công tác phí nước ngoài / nội địa' },
  { id: 'et-3', code: 'EMP-PROBATION', name: 'Thử Việc Chuyên Viên Điều Hành (Probation - 60 Ngày)', hours: 44, insurance: false, leave: 0, desc: 'Hưởng 85% lương cơ bản theo quy định, đánh giá nghiệm thu sau 2 tháng' },
  { id: 'et-4', code: 'EMP-SEASONAL', name: 'Hướng Dẫn Viên Mùa Cao Điểm Lễ Tết / Hè (Seasonal Guide)', hours: 48, insurance: false, leave: 0, desc: 'Tăng cường mùa cao điểm du lịch hè và Tết, phụ cấp công tác đặc biệt' },
  { id: 'et-5', code: 'EMP-B2B-AGENT', name: 'Cộng Tác Viên Kinh Doanh Tour (Sales Partner / Affiliate)', hours: 15, insurance: false, leave: 0, desc: 'Thù lao chi trả trực tiếp theo hoa hồng doanh số vé và tour chốt thành công' }
];

const INITIAL_USERS = [
  { id: 'u-1', name: 'Viet Travel Administrator', email: 'admin@viettravel.vn', role: 'SUPER_ADMIN', branch: 'Toàn Hệ Thống', dept: 'Ban Giám Đốc', status: 'ACTIVE' },
  { id: 'u-2', name: 'Trần Hương Giang', email: 'giang.tran@viettravel.vn', role: 'BRANCH_MANAGER', branch: 'Cơ sở Hoàn Kiếm', dept: 'Giám Đốc Chi Nhánh HN', status: 'ACTIVE' },
  { id: 'u-3', name: 'Lê Thu Trang', email: 'trang.le@viettravel.vn', role: 'TICKETING_POS', branch: 'Cơ sở Hoàn Kiếm', dept: 'Vé & Thu Ngân POS', status: 'ACTIVE' },
  { id: 'u-4', name: 'Nguyễn Tuấn Anh', email: 'anh.nguyen@viettravel.vn', role: 'PRODUCT_DIRECTOR', branch: 'Toàn Hệ Thống', dept: 'Khối Sản Phẩm Tour', status: 'ACTIVE' },
  { id: 'u-5', name: 'Võ Minh Quân', email: 'quan.vo@viettravel.vn', role: 'BRANCH_MANAGER', branch: 'Chi Nhánh Quận 1', dept: 'Giám Đốc Chi Nhánh HCM', status: 'ACTIVE' }
];

const RBAC_MODULES = [
  { id: 'crm', name: 'CRM & Khách Hàng' },
  { id: 'booking', name: 'Booking & Lịch Hẹn' },
  { id: 'pos', name: 'ERP / POS Bán Hàng' },
  { id: 'hr', name: 'Nhân Sự HR & Bảng Lương' },
  { id: 'bi', name: 'Báo Cáo & Quản Trị BI' },
  { id: 'ai', name: 'AI Copilot 2026' },
  { id: 'system', name: 'Tháp Điều Khiển Hệ Thống' }
];

export default function SystemControlTowerPage() {
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('red');
  const [activeSubpageId, setActiveSubpageId] = useState<string>('org-depts');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Interactive State for Organization Structure
  const [branches, setBranches] = useState<any[]>(INITIAL_BRANCHES);
  const [divisions, setDivisions] = useState<DivisionItem[]>(INITIAL_DIVISIONS);
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [jobPosts, setJobPosts] = useState<JobPostItem[]>(INITIAL_JOB_POSTS);
  const [jobTitles, setJobTitles] = useState<JobTitleItem[]>(INITIAL_JOB_TITLES);
  const [jobPositions, setJobPositions] = useState<JobPositionItem[]>(INITIAL_JOB_POSITIONS);
  const [employmentTypes, setEmploymentTypes] = useState<EmploymentTypeItem[]>(INITIAL_EMPLOYMENT_TYPES);
  const [users, setUsers] = useState(INITIAL_USERS);

  // States for System User Accounts (IAM) & HR Employee Provisioning
  const [systemUsers, setSystemUsers] = useState<SystemUserItem[]>([]);
  const [unprovisionedEmployees, setUnprovisionedEmployees] = useState<UnprovisionedEmployee[]>([]);
  const [totalEmployeesCount, setTotalEmployeesCount] = useState<number>(0);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState<boolean>(false);
  const [targetEmpIdForProvision, setTargetEmpIdForProvision] = useState<string | undefined>(undefined);

  // Modal State for Unified CRUD
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: OrgEntityType;
    initialData?: any;
  }>({
    isOpen: false,
    type: 'department'
  });

  // VietQR Config State
  const [bankAccount, setBankAccount] = useState({
    bank: 'Vietcombank (Ngân hàng Ngoại Thương Việt Nam)',
    accountNumber: '102688889999',
    accountHolder: 'CONG TY CO PHAN TAP DOAN DU LICH VIET TRAVEL GROUP',
    memoPrefix: 'TOUR'
  });

  // Zalo ZNS Config State
  const [zaloConfig, setZaloConfig] = useState({
    appId: '182736459012',
    oaId: '992837465019'
  });

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isBlue = themeColor === 'blue';
  const primaryColorHex = isBlue ? '#0066cc' : '#dc0037';

  // Synchronize state with PostgreSQL via /system/api/org and /system/api/users on mount
  const fetchUsersData = async () => {
    try {
      const res = await fetch('/system/api/users');
      const json = await res.json();
      if (json.success && json.data) {
        setSystemUsers(json.data.users);
        setUnprovisionedEmployees(json.data.unprovisionedEmployees);
        setTotalEmployeesCount(json.data.totalEmployees);
      }
    } catch (err) {
      console.warn('Failed to fetch system users from API:', err);
    }
  };

  React.useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const res = await fetch('/system/api/org');
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.departments?.length) setDepartments(json.data.departments);
          if (json.data.divisions?.length) setDivisions(json.data.divisions);
          if (json.data.jobPosts?.length) setJobPosts(json.data.jobPosts);
          if (json.data.jobTitles?.length) setJobTitles(json.data.jobTitles);
          if (json.data.jobPositions?.length) setJobPositions(json.data.jobPositions);
          if (json.data.employmentTypes?.length) setEmploymentTypes(json.data.employmentTypes);
          if (json.data.branches?.length) setBranches(json.data.branches);
        }
      } catch (e) {
        console.warn('API org data fallback to local state:', e);
      }
    };
    fetchOrgData();
    fetchUsersData();
  }, []);

  // CRUD Handlers for Org Structure
  const openAddModal = (type: OrgEntityType) => {
    setModalConfig({ isOpen: true, type, initialData: undefined });
  };

  const openEditModal = (type: OrgEntityType, item: any) => {
    setModalConfig({ isOpen: true, type, initialData: item });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleSaveEntity = (type: OrgEntityType, data: any) => {
    if (type === 'branch') {
      if (data.id) {
        setBranches(prev => prev.map(b => (b.id === data.id ? { ...b, ...data } : b)));
        showToast(`✅ Đã cập nhật cơ sở: ${data.name}`);
      } else {
        const newBranch = {
          ...data,
          id: `br-${Date.now()}`
        };
        setBranches(prev => [newBranch, ...prev]);
        showToast(`✅ Đã thêm mới cơ sở: ${data.name}`);
      }
    } else if (type === 'division') {
      if (data.id) {
        setDivisions(prev => prev.map(div => (div.id === data.id ? { ...div, ...data } : div)));
        showToast(`✅ Đã cập nhật khối trực thuộc: ${data.name}`);
      } else {
        const newDiv: DivisionItem = {
          ...data,
          id: `div-${Date.now()}`
        };
        setDivisions(prev => [newDiv, ...prev]);
        showToast(`✅ Đã thêm mới khối trực thuộc: ${data.name}`);
      }
    } else if (type === 'department') {
      if (data.id) {
        setDepartments(prev => prev.map(d => (d.id === data.id ? { ...d, ...data } : d)));
        showToast(`✅ Đã cập nhật phòng ban: ${data.name}`);
      } else {
        const newDept: DepartmentItem = {
          ...data,
          id: `dept-${Date.now()}`,
          headcount: data.headcount || 0
        };
        setDepartments(prev => [newDept, ...prev]);
        showToast(`✅ Đã thêm mới phòng ban: ${data.name}`);
      }
    } else if (type === 'post') {
      if (data.id) {
        setJobPosts(prev => prev.map(p => (p.id === data.id ? { ...p, ...data } : p)));
        showToast(`✅ Đã cập nhật chức vụ: ${data.name}`);
      } else {
        const newPost: JobPostItem = {
          ...data,
          id: `post-${Date.now()}`
        };
        setJobPosts(prev => [newPost, ...prev]);
        showToast(`✅ Đã thêm chức vụ: ${data.name}`);
      }
    } else if (type === 'title') {
      if (data.id) {
        setJobTitles(prev => prev.map(t => (t.id === data.id ? { ...t, ...data } : t)));
        showToast(`✅ Đã cập nhật chức danh: ${data.name}`);
      } else {
        const newTitle: JobTitleItem = {
          ...data,
          id: `title-${Date.now()}`
        };
        setJobTitles(prev => [newTitle, ...prev]);
        showToast(`✅ Đã thêm chức danh: ${data.name}`);
      }
    } else if (type === 'position') {
      if (data.id) {
        setJobPositions(prev => prev.map(p => (p.id === data.id ? { ...p, ...data } : p)));
        showToast(`✅ Đã cập nhật định biên vị trí: ${data.name}`);
      } else {
        const newPos: JobPositionItem = {
          ...data,
          id: `pos-${Date.now()}`
        };
        setJobPositions(prev => [newPos, ...prev]);
        showToast(`✅ Đã thêm vị trí công việc & định biên: ${data.name}`);
      }
    } else if (type === 'type') {
      if (data.id) {
        setEmploymentTypes(prev => prev.map(t => (t.id === data.id ? { ...t, ...data } : t)));
        showToast(`✅ Đã cập nhật tính chất công việc: ${data.name}`);
      } else {
        const newType: EmploymentTypeItem = {
          ...data,
          id: `type-${Date.now()}`
        };
        setEmploymentTypes(prev => [newType, ...prev]);
        showToast(`✅ Đã thêm tính chất công việc: ${data.name}`);
      }
    }

    // Sync to PostgreSQL database in background
    fetch('/system/api/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: data.id ? 'UPDATE' : 'CREATE', type, data })
    }).catch(err => console.error('Failed to sync to PostgreSQL:', err));

    closeModal();
  };

  const handleDeleteEntity = async (type: OrgEntityType, id: string, name?: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa "${name || 'mục này'}" khỏi cơ cấu tổ chức?`)) return;

    // Safety validation via backend API
    try {
      const res = await fetch('/system/api/org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'DELETE', type, data: { id } })
      });
      const json = await res.json();
      if (!json.success) {
        alert(json.message || 'Không thể xóa mục này do ràng buộc dữ liệu!');
        return;
      }
    } catch {
      // Offline fallback
    }

    if (type === 'branch') setBranches(prev => prev.filter(b => b.id !== id));
    if (type === 'division') setDivisions(prev => prev.filter(d => d.id !== id));
    if (type === 'department') setDepartments(prev => prev.filter(d => d.id !== id));
    if (type === 'post') setJobPosts(prev => prev.filter(p => p.id !== id));
    if (type === 'title') setJobTitles(prev => prev.filter(t => t.id !== id));
    if (type === 'position') setJobPositions(prev => prev.filter(p => p.id !== id));
    if (type === 'type') setEmploymentTypes(prev => prev.filter(t => t.id !== id));
    showToast(`🗑️ Đã xóa "${name || 'mục này'}" thành công!`);
  };

  const handleToggleActiveBranch = (id: string) => {
    setBranches(prev =>
      prev.map(b => (b.id === id ? { ...b, isActive: b.isActive === false ? true : false } : b))
    );
    fetch('/system/api/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_ACTIVE', type: 'branch', data: { id } })
    }).catch(err => console.error('Toggle active sync error:', err));
    showToast('Đã chuyển đổi trạng thái cơ sở.');
  };

  const handleToggleActiveDivision = (id: string) => {
    setDivisions(prev =>
      prev.map(div => (div.id === id ? { ...div, isActive: div.isActive === false ? true : false } : div))
    );
    fetch('/system/api/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_ACTIVE', type: 'division', data: { id } })
    }).catch(err => console.error('Toggle active sync error:', err));
    showToast('Đã chuyển đổi trạng thái khối trực thuộc.');
  };

  const handleToggleActiveDept = (id: string) => {
    setDepartments(prev =>
      prev.map(d => (d.id === id ? { ...d, isActive: d.isActive === false ? true : false } : d))
    );
    fetch('/system/api/org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_ACTIVE', type: 'department', data: { id } })
    }).catch(err => console.error('Toggle active sync error:', err));
    showToast('Đã chuyển đổi trạng thái hoạt động của phòng ban.');
  };

  // User Management & IAM Provisioning Handlers
  const handleOpenProvisionModal = (empId?: string) => {
    setTargetEmpIdForProvision(empId);
    setIsProvisionModalOpen(true);
  };

  const handleProvisionUser = async (formData: any) => {
    const res = await fetch('/system/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'PROVISION', data: formData })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || 'Cấp phát thất bại!');
    }
    showToast(json.message || 'Cấp phát tài khoản thành công!');
    await fetchUsersData();
  };

  const handleToggleLockUser = async (id: string) => {
    const res = await fetch('/system/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_LOCK', data: { id } })
    });
    const json = await res.json();
    if (json.success) {
      showToast(json.message);
      setSystemUsers(prev => prev.map(u => (u.id === id ? { ...u, isActive: json.isActive } : u)));
    } else {
      alert(json.message || 'Không thể đổi trạng thái tài khoản!');
    }
  };

  const handleResetPasswordUser = async (id: string) => {
    const res = await fetch('/system/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'RESET_PASSWORD', data: { id } })
    });
    const json = await res.json();
    if (json.success) {
      alert(`Mật khẩu mới đã được đặt lại: ${json.temporaryPassword}\nVui lòng gửi thông tin này cho nhân sự!`);
      showToast(json.message);
    } else {
      alert(json.message || 'Không thể đặt lại mật khẩu!');
    }
  };

  const handleRevokeUser = async (id: string, email: string) => {
    if (!confirm(`Bạn có chắc chắn muốn thu hồi tài khoản "${email}" khỏi hệ thống?`)) return;
    const res = await fetch('/system/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REVOKE', data: { id } })
    });
    const json = await res.json();
    if (json.success) {
      showToast(json.message);
      await fetchUsersData();
    } else {
      alert(json.message || 'Không thể thu hồi tài khoản!');
    }
  };

  // Calculations for Metric Ribbon
  const totalCurrentHeadcount = departments.reduce((sum, d) => sum + d.headcount, 0);
  const totalQuotaHeadcount = jobPositions.reduce((sum, p) => sum + p.quota, 0) || 40;
  const totalAllowancePost = '37.500.000 đ';

  // 1-Click Backup Simulation
  const handleTriggerBackup = () => {
    showToast('🚀 Đang khởi chạy snapshot PostgreSQL 17...');
    setTimeout(() => {
      showToast('✅ Đã tạo bản sao lưu erp_core_backup_2026-11.sql.gz thành công (14.8 MB)!');
    }, 1500);
  };

  // Subpages for the Left Sidebar (SaaS Navigation with Nested Sub-menus for Org Structure)
  const systemSubpages: SubpageItem[] = [
    {
      id: 'org',
      label: 'Cơ Cấu Tổ Chức',
      icon: Network,
      children: [
        { id: 'org-branches', label: 'Cơ Sở Trực Thuộc', icon: Building2 },
        { id: 'org-divisions', label: 'Khối Trực Thuộc', icon: Layers },
        { id: 'org-depts', label: 'Phòng Ban (Org Units)', icon: Network },
        { id: 'org-posts', label: 'Chức Vụ Hành Chính', icon: Award },
        { id: 'org-titles', label: 'Chức Danh Chuyên Môn', icon: Briefcase },
        { id: 'org-positions', label: 'Vị Trí & Định Biên', icon: Layers },
        { id: 'org-types', label: 'Tính Chất Công Việc', icon: Clock },
        { id: 'org-chart', label: 'Sơ Đồ Cây Phân Cấp', icon: Network }
      ]
    },
    { id: 'users', label: 'Người Dùng & RBAC', icon: Users },
    { id: 'branches', label: 'Chuỗi Chi Nhánh', icon: Building2 },
    { id: 'integrations', label: 'Tích Hợp VietQR / Zalo', icon: QrCode },
    { id: 'ai', label: 'Trạm AI Copilot', icon: Bot },
    { id: 'vps', label: 'Giám Sát VPS Node', icon: Server },
    { id: 'audit', label: 'Nhật Ký Audit', icon: FileText },
    { id: 'branding', label: 'Cấu Hình Thương Hiệu', icon: Sliders }
  ];

  const getPageTitleAndBreadcrumb = () => {
    const topMatch = systemSubpages.find(s => s.id === activeSubpageId);
    if (topMatch) {
      return { parent: 'Hệ Thống ERP', current: topMatch.label };
    }
    for (const parent of systemSubpages) {
      if (parent.children) {
        const childMatch = parent.children.find(c => c.id === activeSubpageId);
        if (childMatch) {
          return { parent: parent.label, current: childMatch.label };
        }
      }
    }
    return { parent: 'Hệ Thống ERP', current: 'Cơ Cấu Tổ Chức' };
  };

  const { parent: breadcrumbParent, current: currentTitle } = getPageTitleAndBreadcrumb();

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#faf8f5] text-slate-800 antialiased">
      {/* Topbar chung: Chuyển đổi giữa các phân hệ ERP qua 9-dots App Switcher & Home Launcher */}
      <UniversalTopbar
        currentZoneName="Hệ Thống & Tháp Điều Khiển (Zone 8)"
        themeColor={themeColor}
        onThemeChange={setThemeColor}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main SaaS Layout: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Sidebar Điều Hướng Phân Hệ Chuẩn SaaS */}
        <Sidebar
          appName="Hệ Thống & Tháp Điều Khiển"
          appCode="ZONE 8 • CONTROL TOWER"
          appIcon={Settings}
          gradient="linear-gradient(135deg, #475569 0%, #1e293b 100%)"
          themeColor={themeColor}
          subpages={systemSubpages}
          activeSubpageId={activeSubpageId}
          onSelectSubpage={(id) => setActiveSubpageId(id)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Right Content Area: Giao diện SaaS nghiệp vụ chi tiết (Full-Width) */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          <div className="w-full space-y-6 pb-12">
            {/* Breadcrumb & Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{breadcrumbParent}</span>
                  <span>/</span>
                  <span className="font-semibold text-slate-800">{currentTitle}</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {currentTitle}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTriggerBackup}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: primaryColorHex }}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Sao Lưu DB Snapshot</span>
                </button>
              </div>
            </div>

            {/* 1. SUBPAGES: CƠ CẤU TỔ CHỨC & CÁC SUB-MENUS */}
            {(activeSubpageId === 'org' || activeSubpageId.startsWith('org-')) && (
              <div className="space-y-6">
                {/* Org Metric High-Level Ribbon */}
                <OrgMetricRibbon
                  totalDepts={departments.length}
                  totalPositions={jobPositions.length}
                  currentHeadcount={totalCurrentHeadcount}
                  quotaHeadcount={totalQuotaHeadcount}
                  totalAllowance={totalAllowancePost}
                  themeColorHex={primaryColorHex}
                />

                {/* Sub-menu 0A: Quản Lý Cơ Sở Trực Thuộc */}
                {activeSubpageId === 'org-branches' && (
                  <BranchManager
                    branches={branches}
                    departmentCounts={departments.reduce((acc, d) => {
                      if (d.branch) acc[d.branch] = (acc[d.branch] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)}
                    themeColorHex={primaryColorHex}
                    onAdd={() => openAddModal('branch')}
                    onEdit={(b) => openEditModal('branch', b)}
                    onDelete={(id) => {
                      const b = branches.find(item => item.id === id);
                      handleDeleteEntity('branch', id, b?.name);
                    }}
                    onToggleActive={handleToggleActiveBranch}
                    onSelectBranchContext={(name) => showToast(`Chuyển ngữ cảnh quản trị sang: ${name}`)}
                  />
                )}

                {/* Sub-menu 0B: Quản Lý Khối Trực Thuộc */}
                {activeSubpageId === 'org-divisions' && (
                  <DivisionManager
                    divisions={divisions}
                    departmentCounts={departments.reduce((acc, d) => {
                      if (d.level) acc[d.level] = (acc[d.level] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)}
                    headcountCounts={departments.reduce((acc, d) => {
                      if (d.level) acc[d.level] = (acc[d.level] || 0) + (d.headcount || 0);
                      return acc;
                    }, {} as Record<string, number>)}
                    themeColorHex={primaryColorHex}
                    onAdd={() => openAddModal('division')}
                    onEdit={(div) => openEditModal('division', div)}
                    onDelete={(id) => {
                      const div = divisions.find(item => item.id === id);
                      handleDeleteEntity('division', id, div?.name);
                    }}
                    onToggleActive={handleToggleActiveDivision}
                  />
                )}

                {/* Sub-menu 1: Phòng Ban */}
                {(activeSubpageId === 'org-depts' || activeSubpageId === 'org') && (
                  <DepartmentManager
                    departments={departments}
                    themeColorHex={primaryColorHex}
                    onAdd={() => openAddModal('department')}
                    onEdit={(dept) => openEditModal('department', dept)}
                    onDelete={(id) => {
                      const d = departments.find(item => item.id === id);
                      handleDeleteEntity('department', id, d?.name);
                    }}
                    onToggleActive={handleToggleActiveDept}
                    onNavigateToTab={(tabId) => setActiveSubpageId(tabId)}
                    divisionsCount={divisions.length}
                    branchesCount={branches.length}
                  />
                )}

                {/* Sub-menu 2: Chức Vụ Hành Chính */}
                {activeSubpageId === 'org-posts' && (
                  <JobPostManager
                    jobPosts={jobPosts}
                    themeColorHex={primaryColorHex}
                    onAdd={() => openAddModal('post')}
                    onEdit={(post) => openEditModal('post', post)}
                    onDelete={(id) => {
                      const p = jobPosts.find(item => item.id === id);
                      handleDeleteEntity('post', id, p?.name);
                    }}
                  />
                )}

                {/* Sub-menu 3: Chức Danh Chuyên Môn */}
                {activeSubpageId === 'org-titles' && (
                  <JobTitleManager
                    jobTitles={jobTitles}
                    themeColorHex={primaryColorHex}
                    onAdd={() => openAddModal('title')}
                    onEdit={(title) => openEditModal('title', title)}
                    onDelete={(id) => {
                      const t = jobTitles.find(item => item.id === id);
                      handleDeleteEntity('title', id, t?.name);
                    }}
                  />
                )}

                {/* Sub-menu 4: Vị Trí Công Việc & Định Biên */}
                {activeSubpageId === 'org-positions' && (
                  <JobPositionManager
                    jobPositions={jobPositions}
                    themeColorHex={primaryColorHex}
                    onAdd={() => openAddModal('position')}
                    onEdit={(pos) => openEditModal('position', pos)}
                    onDelete={(id) => {
                      const p = jobPositions.find(item => item.id === id);
                      handleDeleteEntity('position', id, p?.name);
                    }}
                  />
                )}

                {/* Sub-menu 5: Tính Chất Công Việc & Phúc Lợi */}
                {activeSubpageId === 'org-types' && (
                  <EmploymentTypeManager
                    employmentTypes={employmentTypes}
                    themeColorHex={primaryColorHex}
                    onAdd={() => openAddModal('type')}
                    onEdit={(type) => openEditModal('type', type)}
                    onDelete={(id) => {
                      const t = employmentTypes.find(item => item.id === id);
                      handleDeleteEntity('type', id, t?.name);
                    }}
                  />
                )}

                {/* Sub-menu 6: Sơ Đồ Cây Phân Cấp Doanh Nghiệp (Visual Org Chart) */}
                {activeSubpageId === 'org-chart' && (
                  <OrgTreeChart
                    departments={departments}
                    positions={jobPositions}
                    themeColorHex={primaryColorHex}
                  />
                )}
              </div>
            )}

          {/* 2. SUBPAGE: NGƯỜI DÙNG & RBAC */}
          {activeSubpageId === 'users' && (
            <div className="space-y-6">
              <UserManager
                users={systemUsers}
                unprovisionedEmployees={unprovisionedEmployees}
                totalEmployees={totalEmployeesCount}
                themeColorHex={primaryColorHex}
                onOpenProvisionModal={handleOpenProvisionModal}
                onToggleLock={handleToggleLockUser}
                onResetPassword={handleResetPasswordUser}
                onRevoke={handleRevokeUser}
              />

              {/* RBAC Matrix */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Ma Trận Phân Quyền Granular RBAC (Theo Phân Hệ)</h3>
                <p className="text-xs text-slate-500 mb-4">Quy định quyền truy cập CRUD cho từng chức vụ trên 7 phân hệ ERP</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <th className="p-2.5">Phân Hệ ERP</th>
                        <th className="p-2.5 text-center">Xem (Read)</th>
                        <th className="p-2.5 text-center">Tạo Mới (Create)</th>
                        <th className="p-2.5 text-center">Chỉnh Sửa (Update)</th>
                        <th className="p-2.5 text-center">Xóa / Hủy (Delete)</th>
                        <th className="p-2.5 text-center">Phê Duyệt (Approve)</th>
                        <th className="p-2.5 text-center">Xuất File (Export)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {RBAC_MODULES.map((mod) => (
                        <tr key={mod.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-semibold text-slate-800">{mod.name}</td>
                          <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                          <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                          <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                          <td className="p-2.5 text-center"><Check className="w-4 h-4 text-slate-300 mx-auto" /></td>
                          <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                          <td className="p-2.5 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. SUBPAGE: CHUỖI CHI NHÁNH */}
          {activeSubpageId === 'branches' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {branches.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400">{b.code}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đang Hoạt Động
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{b.name}</h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{b.address}</p>

                    <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3 mt-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Hotline cơ sở:</span>
                        <span className="font-semibold text-slate-800">{b.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Giám đốc cơ sở:</span>
                        <span className="font-semibold text-slate-800">{b.managerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quy mô nhân sự:</span>
                        <span className="font-bold text-emerald-600">{b.headcount} nhân sự</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Doanh thu hôm nay</span>
                      <span className="font-bold text-slate-900 text-sm">{b.revenueToday}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Chuyển ngữ cảnh quản trị sang: ${b.name}`)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
                    >
                      Xem Cơ Sở
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. SUBPAGE: TÍCH HỢP VIỆT NAM (VietQR / Zalo ZNS) */}
          {activeSubpageId === 'integrations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: primaryColorHex }}
                  >
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Cấu Hình VietQR NAPAS 247</h3>
                    <p className="text-xs text-slate-500">Tự động sinh mã QR động kèm số tiền và mã hóa đơn tại quầy POS</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Ngân Hàng Thụ Hưởng</label>
                    <input
                      type="text"
                      value={bankAccount.bank}
                      onChange={(e) => setBankAccount({ ...bankAccount, bank: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Số Tài Khoản</label>
                    <input
                      type="text"
                      value={bankAccount.accountNumber}
                      onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tên Chủ Tài Khoản (In hoa)</label>
                    <input
                      type="text"
                      value={bankAccount.accountHolder}
                      onChange={(e) => setBankAccount({ ...bankAccount, accountHolder: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => showToast('✅ Đã lưu cấu hình tài khoản VietQR thành công!')}
                  className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: primaryColorHex }}
                >
                  Lưu Cấu Hình VietQR
                </button>
              </div>

              {/* Zalo ZNS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Zalo Official Account & ZNS</h3>
                    <p className="text-xs text-slate-500">Tự động gửi thông báo lịch hẹn và tri ân hội viên qua Zalo</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Zalo App ID</label>
                    <input
                      type="text"
                      value={zaloConfig.appId}
                      onChange={(e) => setZaloConfig({ ...zaloConfig, appId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Zalo OA ID</label>
                    <input
                      type="text"
                      value={zaloConfig.oaId}
                      onChange={(e) => setZaloConfig({ ...zaloConfig, oaId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Mẫu thông báo ZNS tự động:</span>
                  {[
                    { name: 'ZNS 01: Xác nhận đặt lịch hẹn thành công', time: 'Tức thì' },
                    { name: 'ZNS 02: Nhắc lịch hẹn trước 120 phút', time: 'Trước 2h' },
                    { name: 'ZNS 03: Chúc mừng sinh nhật & Tặng Voucher 20%', time: '08:00 AM' }
                  ].map((tmpl, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{tmpl.name}</span>
                      <button
                        onClick={() => showToast(`Bắn thử nghiệm mẫu: ${tmpl.name}`)}
                        className="text-[11px] font-semibold px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100"
                      >
                        Bắn Thử
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. SUBPAGE: AI COPILOT CONTROL */}
          {activeSubpageId === 'ai' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Trạm Điều Khiển AI Copilot & Vector Store RAG</h3>
                  <p className="text-xs text-slate-500">Giám sát mức tiêu thụ Token theo từng chi nhánh và cập nhật tri thức `pgvector` HNSW</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Google Gemini 2.5 Flash
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Hạn mức Token toàn chuỗi tháng 11/2026</span>
                  <span className="font-mono text-emerald-600">142.850 / 1.000.000 Tokens (14.2%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '14.2%' }}></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3">Tài Liệu Tri Thức Doanh Nghiệp (PostgreSQL 17 HNSW Index)</h4>
                <div className="space-y-2.5 text-xs">
                  {[
                    { title: 'Chính sách Tích lũy Dặm thưởng & Nâng hạng Hội viên Viet Travel Passport 2026', chunks: 14, category: 'Hội Viên' },
                    { title: 'Quy trình Điều phối Booking Khách sạn, Vé máy bay & Hủy phạt Tour', chunks: 8, category: 'Vận Hành' },
                    { title: 'Chính sách Chi trả Hoa hồng Bán Tour & Thưởng Doanh số Đoàn M.I.C.E', chunks: 19, category: 'Nhân Sự' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{doc.title}</span>
                        <span className="text-[11px] text-slate-400">Phân loại: {doc.category} • {doc.chunks} vector chunks (1536 dims)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã Lập Chỉ Mục HNSW
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. SUBPAGE: GIÁM SÁT VPS */}
          {activeSubpageId === 'vps' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Tải Vi Xử Lý (CPU)</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">14.8%</span>
                  <span className="text-[11px] text-slate-500 block mt-1">4 vCPUs • 2.6 GHz</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Bộ Nhớ RAM</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">2.8 / 8.0 GB</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">35% Sử dụng</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Ổ Cứng SSD NVMe</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">34 / 160 GB</span>
                  <span className="text-[11px] text-slate-500 block mt-1">Còn trống 126 GB</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold text-slate-400 block mb-1">Uptime Máy Chủ</span>
                  <span className="text-2xl font-bold text-slate-900 font-mono">99.98%</span>
                  <span className="text-[11px] text-slate-500 block mt-1">38 ngày liên tục</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Trạng Thái Sức Khỏe Toàn Bộ Dịch Vụ Microservices</h3>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Tất Cả Dịch Vụ Sẵn Sàng
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    { name: 'PostgreSQL 17 + pgvector (HNSW)', port: 5432, role: 'Lưu trữ CSDL quan hệ & Vector embeddings', latency: '1.2 ms' },
                    { name: 'Valkey 8 (Linux Foundation Cache)', port: 6379, role: 'In-memory cache & Session store', latency: '0.4 ms' },
                    { name: 'NATS 2.29 JetStream Message Bus', port: 4222, role: 'Event-driven broker bất đồng bộ', latency: '< 0.1 ms' },
                    { name: 'NestJS 12.4 Fastify Gateway', port: 8000, role: 'API Gateway & Controllers nghiệp vụ', latency: '3.8 ms' },
                    { name: 'Traefik v3 Ingress & SSL', port: '80 / 443', role: 'Reverse proxy, HTTP/3 QUIC & Let\'s Encrypt', latency: '1.0 ms' }
                  ].map((svc, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{svc.name}</span>
                        <span className="text-slate-400">{svc.role} • Port: {svc.port}</span>
                      </div>
                      <span className="font-mono text-emerald-600 font-semibold">{svc.latency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. SUBPAGE: AUDIT LOGS */}
          {activeSubpageId === 'audit' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Nhật Ký Truy Vết Thao Tác (Audit Trails)</h3>
                <p className="text-xs text-slate-500">Ghi vết toàn bộ hành vi nhạy cảm: Đăng nhập, Duyệt lương, Hủy đơn, Sao lưu dữ liệu</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { user: 'Viet Travel Administrator', action: 'DATABASE_BACKUP_SNAPSHOT', resource: 'POSTGRESQL_17', time: '10 phút trước', ip: '127.0.0.1' },
                  { user: 'Trần Hương Giang', action: 'PAYROLL_CALCULATE', resource: 'PAYROLL_2026_11', time: '2 giờ trước', ip: '192.168.1.105' },
                  { user: 'Viet Travel Administrator', action: 'ORGANIZATION_UPDATE', resource: 'DEPT_HN_OUTBOUND', time: 'Hôm qua', ip: '127.0.0.1' },
                  { user: 'Lê Thu Trang', action: 'ORDER_CHECKOUT_VIETQR', resource: 'BOOKING_TOUR_8820', time: 'Hôm qua', ip: '192.168.1.108' }
                ].map((log, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.user}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">
                          {log.action}
                        </span>
                      </div>
                      <span className="text-slate-500 text-[11px] block mt-1">Đối tượng: {log.resource} • IP: {log.ip}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-mono">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. SUBPAGE: CẤU HÌNH THƯƠNG HIỆU */}
          {activeSubpageId === 'branding' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-1">Cấu Hình Thương Hiệu White-Label</h3>
              <p className="text-xs text-slate-500 mb-4">Tùy biến tên doanh nghiệp lữ hành, logo và tông màu chủ đạo hiển thị toàn chuỗi</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tên Chuỗi / Thương Hiệu Lữ Hành</label>
                  <input
                    type="text"
                    defaultValue="Viet Travel Enterprise Group — International Tour Operator"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hotline Đặt Tour & CSKH Toàn Quốc</label>
                  <input
                    type="text"
                    defaultValue="1900 882026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block text-xs">Tông màu mặc định hệ thống:</span>
                  <span className="text-[11px] text-slate-500">
                    Hiện tại: {isBlue ? '🔵 Xanh Biếc (Azure Blue)' : '🔴 Đỏ Ruby lab(45 79.29 35.14) (#dc0037)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setThemeColor('red')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                      !isBlue ? 'ring-2 ring-slate-800 ring-offset-2' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: '#dc0037' }}
                  >
                    🔴 Đỏ Ruby
                  </button>
                  <button
                    onClick={() => setThemeColor('blue')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                      isBlue ? 'ring-2 ring-slate-800 ring-offset-2' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: '#0066cc' }}
                  >
                    🔵 Xanh Biếc
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Unified Org Entity CRUD Modal */}
      <OrgEntityModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        initialData={modalConfig.initialData}
        branches={branches}
        departments={departments}
        divisions={divisions}
        jobPosts={jobPosts}
        jobTitles={jobTitles}
        themeColorHex={primaryColorHex}
        onClose={closeModal}
        onSave={handleSaveEntity}
      />

      {/* User IAM Account Provisioning Modal */}
      <UserProvisionModal
        isOpen={isProvisionModalOpen}
        unprovisionedEmployees={unprovisionedEmployees}
        themeColorHex={primaryColorHex}
        onClose={() => setIsProvisionModalOpen(false)}
        onProvision={handleProvisionUser}
      />
    </div>
  );
}
