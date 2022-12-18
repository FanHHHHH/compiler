class Debuger {
    constructor(level) {
        this.level = level
    }

    Enter = function(name) {
        let s = '*'
        for (let i = 0; i < level; i++) {
            s + '****'
        }
        s += 'entering' + name
        console.log(s)
        this.level += 1
    }

    Leave = function(name) {
        this.level -= 1
        let s = '*'
        for (let i = 0; i < level; i++) {
            s + '****'
        }
        s += 'leaving' + name
        console.log(s)
    }
     
}
const newDebugger = () => {
    return new Debuger(0)
}

let DEBUG;

export const DebuggerInstance = () => {
    if (!DEBUG) {
        DEBUG = newDebugger()
    }
    return DEBUG
}

