import {DebutElement} from "./element.js"
import {DebutGroup} from "./group.js"
import { includesWord, splitOnSpace } from "./utils.js"

export function target(...targetArgs) {
  const elements = []
  const targets = createTargets(targetArgs)
  for (const target of targets) {
    for (const effect of target.effects) {
      elements.push(new DebutElement(target.node, effect, target.name))
    }
  }
  return new DebutGroup(elements)
}

function createTargets(targetArgs) {
  const result = []
  for (const arg of targetArgs) {
    if (typeof arg === "string") {
      for (const node of queryForTarget(arg)) {
        if (includesWord(node.dataset.debutTarget, arg)) {
          result.push(new DebutTarget(node, arg))
        }
      }
    } else {
      result.push(new DebutTarget(arg))
    }
  }
  return result
}

function queryForTarget(name) {
  return document.querySelectorAll(targetSelector(name))
}

function targetSelector(name) {
  return `[data-debut-target*="${name}"]`
}

class DebutTarget {
  static fromString() {
    
  }

  constructor(node, name) {
    this.node = node
    this.name = name
    this.effects = splitOnSpace(node.dataset.debut)
  }
}
