class Macro {
    constructor(name, text ) {
        this.name = name,
        this.text = text
    }
}

let marcoManagerInstance

class MacroManager {
    constructor(name, macroIns) {
        this.marcoMap[name] = Macro
    }


}

const newMacroManager = () =>{
    return new MacroManager('1', new Macro('1', '1'))
}