// src/lib/authSession.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type StoredUser = {
  id: number;
  name: string;
  email: string;
};

const USER_KEY = 'caffit:user';

export async function saveCurrentUser(user: StoredUser): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getCurrentUser(): Promise<StoredUser | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    const parsed: StoredUser = JSON.parse(raw);
    if (
      typeof parsed.id !== 'number' ||
      typeof parsed.name !== 'string' ||
      typeof parsed.email !== 'string'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function clearCurrentUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
