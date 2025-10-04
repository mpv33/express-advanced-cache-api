import { fetchFromDatabase, User } from "./mockData";

/**
 * Simple queue abstraction that manages a small worker pool.
 * For this assignment the queue simply exposes fetchUser(id) which simulates
 * asynchronous DB fetch with 200ms delay (implemented in fetchFromDatabase).
 */
export function createQueue() {
  return {
    async fetchUser(id: string): Promise<User | null> {
      // In real systems we'd push the job and let workers process it.
      // Here we simply call the simulated DB function.
      return await fetchFromDatabase(id);
    }
  };
}
