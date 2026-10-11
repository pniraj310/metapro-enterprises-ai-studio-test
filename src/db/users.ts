import { db } from './index.ts';
import { users } from './schema.ts';

let isDbConnected: boolean | null = null;
const memoryUsers = new Map<string, any>();

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  if (isDbConnected !== false) {
    try {
      const result = await db
        .insert(users)
        .values({
          uid,
          email,
          name: name || email.split('@')[0],
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            ...(name ? { name } : {}),
          },
        })
        .returning();
      isDbConnected = true;
      return result[0];
    } catch (error) {
      console.warn('[AI Studio] PostgreSQL offline. Storing user in memory:', (error as any)?.message);
      isDbConnected = false;
    }
  }

  const existing = memoryUsers.get(uid) || { uid, createdAt: new Date() };
  const updated = {
    ...existing,
    email,
    name: name || existing.name || email.split('@')[0],
    updatedAt: new Date(),
  };
  memoryUsers.set(uid, updated);
  return updated;
}

export async function getUsers() {
  if (isDbConnected !== false) {
    try {
      const res = await db.select().from(users);
      isDbConnected = true;
      return res;
    } catch (error) {
      isDbConnected = false;
    }
  }

  return Array.from(memoryUsers.values());
}

