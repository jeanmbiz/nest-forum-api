export abstract class Encrypter {
  // recebe oayload: que é o que quero iuncluir no token, objeto chave string + valor desconhecido
  // retorna Promisse de token /string
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
