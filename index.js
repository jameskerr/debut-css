import {selectGroup} from "./lib/dom.js"


export function enter(groupName) {
    return selectGroup(groupName).enter()
}

export function exit(groupName) {
    return selectGroup(groupName).exit()
}
