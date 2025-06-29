export class Cache<T> {
  private cache = new Map<string, Promise<T>>();

  get(key: string): Promise<T> | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: Promise<T>): void {
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}