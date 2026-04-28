import { and, asc, count, eq, ilike, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';

import { db } from '../lib/db/index.js';
import { users } from '../lib/db/schema/auth.js';
import type {
  ListAdminUsersQueryDto,
  UpdateAdminUserDto,
} from '../dtos/admin-user.dto.js';
import type {
  CreateUserDto,
  CreatedUserDto,
  UserDepartment,
} from '../dtos/create-user.dto.js';

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function findUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

export async function createAdminManagedUser(
  input: CreateUserDto,
): Promise<CreatedUserDto | null> {
  const [createdUser] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      password: null,
      role: input.role,
      department: input.department ?? null,
      isVerified: false,
      isActive: true,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      department: users.department,
      isVerified: users.isVerified,
      isActive: users.isActive,
      createdAt: users.createdAt,
    });

  if (!createdUser) {
    return null;
  }

  return {
    ...createdUser,
    department: createdUser.department as UserDepartment | null,
  };
}

export async function setUserPassword(userId: string, password: string) {
  const [updatedUser] = await db
    .update(users)
    .set({ password })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
    });

  return updatedUser ?? null;
}

export async function markUserVerified(userId: string) {
  const [updatedUser] = await db
    .update(users)
    .set({ isVerified: true })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      isVerified: users.isVerified,
    });

  return updatedUser ?? null;
}

export async function upsertSeedAdmin(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(input.email);
  const hashedPassword = await bcrypt.hash(input.password, 12);

  if (existingUser) {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: input.name,
        password: hashedPassword,
        role: 'ADMIN',
        department: null,
        isVerified: true,
        isActive: true,
      })
      .where(eq(users.id, existingUser.id))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        isVerified: users.isVerified,
      });

    return updatedUser ?? null;
  }

  const [createdUser] = await db
    .insert(users)
      .values({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: 'ADMIN',
        department: null,
        isVerified: true,
        isActive: true,
      })
    .returning({
      id: users.id,
      email: users.email,
      role: users.role,
      isVerified: users.isVerified,
    });

  return createdUser ?? null;
}

const adminUserSelection = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  department: users.department,
  isVerified: users.isVerified,
  isActive: users.isActive,
  createdAt: users.createdAt,
};

export async function listAdminManagedUsers() {
  return db
    .select(adminUserSelection)
    .from(users)
    .orderBy(asc(users.createdAt), asc(users.email));
}

export async function findAdminManagedUserById(userId: string) {
  const [user] = await db
    .select(adminUserSelection)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

export async function updateAdminManagedUser(
  userId: string,
  payload: UpdateAdminUserDto,
) {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.email ? { email: payload.email } : {}),
      ...(payload.role ? { role: payload.role } : {}),
      ...(payload.department !== undefined ? { department: payload.department } : {}),
    })
    .where(eq(users.id, userId))
    .returning(adminUserSelection);

  return updatedUser ?? null;
}

export async function setAdminManagedUserActiveStatus(
  userId: string,
  isActive: boolean,
) {
  const [updatedUser] = await db
    .update(users)
    .set({
      isActive,
    })
    .where(eq(users.id, userId))
    .returning(adminUserSelection);

  return updatedUser ?? null;
}

export async function listAdminManagedUsersPaginated(
  query: Required<Pick<ListAdminUsersQueryDto, 'page' | 'pageSize'>> &
    Omit<ListAdminUsersQueryDto, 'page' | 'pageSize'>,
) {
  const conditions = [];

  if (query.search) {
    const pattern = `%${query.search}%`;
    conditions.push(or(ilike(users.name, pattern), ilike(users.email, pattern)));
  }

  if (query.role) {
    conditions.push(eq(users.role, query.role));
  }

  if (typeof query.isActive === 'boolean') {
    conditions.push(eq(users.isActive, query.isActive));
  }

  const whereClause = conditions.length
    ? conditions.length === 1
      ? conditions[0]
      : and(...conditions)
    : undefined;

  const [totalRow] = await db
    .select({ total: count() })
    .from(users)
    .where(whereClause);

  const total = Number(totalRow?.total ?? 0);
  const offset = (query.page - 1) * query.pageSize;

  const items = await db
    .select(adminUserSelection)
    .from(users)
    .where(whereClause)
    .orderBy(asc(users.createdAt), asc(users.email))
    .limit(query.pageSize)
    .offset(offset);

  return {
    items,
    total,
    page: query.page,
    pageSize: query.pageSize,
    totalPages: Math.max(Math.ceil(total / query.pageSize), 1),
  };
}

export async function deleteAdminManagedUser(userId: string) {
  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning(adminUserSelection);

  return deletedUser ?? null;
}
