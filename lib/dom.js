import {DebutConfig} from "./config.js"
import {DebutElement} from "./element.js"
import {DebutGroup} from "./group.js"

export function selectGroup(name) {
  const elements = []
  const nodes = document.querySelectorAll("[data-debut*=" + name + "]")

  for (const el of nodes) {
    const val = el.dataset.debut
    const configs = DebutConfig.parseAll(val)
    console.log(configs, val)
    const matchedConfigs = configs.filter(config => config.group === name)

    for (const config of matchedConfigs) {
      
      elements.push(new DebutElement(el, config.effect, config.group))
    }
  }
  return new DebutGroup(elements)
}
