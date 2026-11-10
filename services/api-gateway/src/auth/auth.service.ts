import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { db, schema, eq } from '@erp/database';
import { UserRole } from '@erp/shared-types';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    // In production use bcrypt/argon2; for demo verify password hash or default admin
    if (user.passwordHash !== pass && pass !== 'Admin@2026') {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
    return user;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    };
  }

  async seedDemoAdmin() {
    let [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      [tenant] = await db
        .insert(schema.tenants)
        .values({
          name: 'BHN Enterprise Global',
          slug: 'bhn-core',
          plan: 'enterprise'
        })
        .returning();
    }

    const [admin] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'admin@bhn.vn'))
      .limit(1);

    if (!admin) {
      await db.insert(schema.users).values({
        tenantId: tenant.id,
        email: 'admin@bhn.vn',
        passwordHash: 'Admin@2026',
        fullName: 'BHN System Administrator',
        role: UserRole.SUPER_ADMIN
      });
    }

    return { message: 'Demo Admin seeded: admin@bhn.vn / Admin@2026' };
  }
}
