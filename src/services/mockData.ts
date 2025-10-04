export type User = { id: number; name: string; email: string };

export const mockUsers: Record<number, User> = {
  1: { id: 1, name: "John Doe", email: "john@example.com" },
  2: { id: 2, name: "Jane Smith", email: "jane@example.com" },
  3: { id: 3, name: "Alice Johnson", email: "alice@example.com" }
};

let nextId = 4;

export function fetchFromDatabase(id: string): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const n = Number(id);
      if (!Number.isFinite(n) || !mockUsers[n]) return resolve(null);
      resolve(mockUsers[n]);
    }, 200);
  });
}

export function addMockUser(name: string, email: string): User {
  const user = { id: nextId++, name, email };
  mockUsers[user.id] = user;
  return user;
}
