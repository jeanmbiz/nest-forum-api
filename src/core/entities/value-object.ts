export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  // verifica se um VO é igual a outro
  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    // compara com base no valor das suas propriedades
    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
