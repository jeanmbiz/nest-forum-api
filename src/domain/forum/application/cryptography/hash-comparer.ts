export abstract class HashComparer {
  // compara hash com hash do banco
  abstract compare(plain: string, hash: string): Promise<boolean>
}
