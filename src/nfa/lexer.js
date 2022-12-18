const fs = require('fs')
const os = require('os')
require('buffer')

const ASCII_CHAR_COUNT = 256;

/**
 * 每读取一个字符时，将其转换成对应token
 */

const CONST_ENUM  = {
    EOS:'EOS', //行末
    ANY: 'ANY', // .
    AT_BOL: 'AT_BOL', //^
    AT_EOL: 'AT_EOL', // $
    CCL_END: 'CCL_END', // ]
    CCL_START: 'CCL_START', // [
    CLOSE_CURLY: 'CLOSE_CURLY', // }
    CLOST_PARAN: 'CLOST_PARAN', // )
    CLOUSER: 'CLOUSER', // *
    DASH: 'DASH', // -
    END_OF_INPUT: 'END_OF_INPUT', // 文件末尾
    L:'L', // 字符常量
    OPEN_CULY: 'OPEN_CULY', // {
    OPEN_PARAN: 'OPEN_PARAN', // (
    OPTIONAL: 'OPTIONAL', // ?
    OR: 'OR', // |
    PLUS_CLOUSURE: 'PLUS_CLOUSURE' // *
}

// class LexerReader {
//     constructor(verbose, actualLineNo, lineNo, inputFileName, lexeme, inquoted, outputFineName, looAhead){
//         this.verbose = verbose
//         this.actualLineNo = actualLineNo
//         this.lineNo = lineNo
//         this.inputFileName = inputFileName
//         this.lexeme = lexeme
//         this.inquoted = inquoted // 读取到双引号
        
//     }
// }
const tokenArr = new Array(ASCII_CHAR_COUNT)

const init = () => {
    for (let i = 0; i < tokenArr.length; i++) {
        tokenArr[i] = CONST_ENUM.L
    }

    tokenArr['$'.charCodeAt()] = CONST_ENUM.AT_EOL
    tokenArr['('.charCodeAt()] = CONST_ENUM.OPEN_PARAN
    tokenArr[')'.charCodeAt()] = CONST_ENUM.CLOST_PARAN
    tokenArr['*'.charCodeAt()] = CONST_ENUM.CLOUSER
    tokenArr['+'.charCodeAt()] = CONST_ENUM.PLUS_CLOUSURE
    tokenArr['-'.charCodeAt()] = CONST_ENUM.DASH
    tokenArr['.'.charCodeAt()] = CONST_ENUM.ANY
    tokenArr['?'.charCodeAt()] = CONST_ENUM.OPTIONAL
    tokenArr['['.charCodeAt()] = CONST_ENUM.CCL_START
    tokenArr[']'.charCodeAt()] = CONST_ENUM.CCL_END
    tokenArr['^'.charCodeAt()] = CONST_ENUM.AT_BOL
    tokenArr['{'.charCodeAt()] = CONST_ENUM.OPEN_CULY
    tokenArr['|'.charCodeAt()] = CONST_ENUM.OR
    tokenArr['}'.charCodeAt()] = CONST_ENUM.CLOSE_CURLY

}

init()

console.log(tokenArr)
