export abstract class CacheRepository {
  // método salvar no cache
  abstract set(key: string, value: string): Promise<void>
  // método buscar no cache
  abstract get(key: string): Promise<string | null>
  // método deletar informação do cache
  abstract delete(key: string): Promise<void>
}
