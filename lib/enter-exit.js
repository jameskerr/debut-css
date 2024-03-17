import {target} from "./target.js"

export function enter(...targetArgs) {
    return target(...targetArgs).enter()
}

export function exit(...targetArgs) {
    return target(...targetArgs).exit()
}
