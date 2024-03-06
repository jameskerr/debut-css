export class DebutConfig {
  constructor(group, effect) {
    this.group = group
    this.effect = effect
  }

  static parseAll(string) {
    return string
      .trim()
      .split(/\s+/)
      .flatMap(code => {
        const parts = code.split(":")
        if (parts.length === 2) {
          const group = parts[0]
          const effects = parts[1].split(",")
          return effects.map(effect => ({group, effect}))
        } else {
          throw new Error("Unable to parse data-debut attribute value: " + string)
        }
      })
      .flatMap((args) => {
        return new DebutConfig(args.group, args.effect)
      })
  }
}
