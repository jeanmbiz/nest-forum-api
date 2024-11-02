export abstract class HashGenerator {
  // converte senha para hash
  abstract hash(plain: string): Promise<string>
}
