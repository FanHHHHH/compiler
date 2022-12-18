

// const svg = require('svg');

const lexer = (pattern) => {
  const tokens = [];
  let i = 0;
  while (i < pattern.length) {
    const char = pattern[i];
    if (char === '(') {
      tokens.push({ type: 'leftParenthesis' });
      i++;
    } else if (char === ')') {
      tokens.push({ type: 'rightParenthesis' });
      i++;
    } else if (char === '|') {
      tokens.push({ type: 'or' });
      i++;
    } else if (char === '*') {
      tokens.push({ type: 'star' });
      i++;
    } else if (char === '+') {
      tokens.push({ type: 'plus' });
      i++;
    } else if (char === '?') {
      tokens.push({ type: 'question' });
      i++;
    } else if (char === '.') {
      tokens.push({ type: 'dot' });
      i++;
    } else if (char === '\\') {
      if (i + 1 < pattern.length) {
        const nextChar = pattern[i + 1];
        if (nextChar === 'd') {
          tokens.push({ type: 'digit' });
          i += 2;
        } else if (nextChar === 'w') {
          tokens.push({ type: 'word' });
          i += 2;
        } else if (nextChar === 's') {
          tokens.push({ type: 'space' });
          i += 2;
        } else {
          tokens.push({ type: 'char', value: nextChar });
          i += 2;
        }
      } else {
        throw new Error('Unexpected end of input');
      }
    } else {
      tokens.push({ type: 'char', value: char });
      i++;
    }
  }
  return tokens;
};

const toInfix = (tokens) => {
  const infix = [];
  for (const token of tokens) {
    if (token.type === 'char' || token.type === 'digit' || token.type === 'word' || token.type === 'space' || token.type === 'dot') {
      infix.push(token);
    } else if (token.type === 'leftParenthesis') {
      infix.push(token);
    } else if (token.type === 'rightParenthesis') {
      while (infix[infix.length - 1].type !== 'leftParenthesis') {
        infix.push(infix.pop());
      }
      infix.pop();
    } else if (token.type === 'or') {
      while (infix[infix.length - 1].type === 'or') {
        infix.push(infix.pop());
      }
      infix.push(token);
    } else if (token.type === 'star' || token.type === 'plus' || token.type === 'question') {
      infix.push(token);
    }
  }
  while (infix.length > 0) {
    infix.push(infix.pop());
  }
  return infix;
};

const toPostfix = (infix) => {
  const postfix = [];
  for (const token of infix) {
    if (token.type === 'char' || token.type === 'digit' || token.type === 'word' || token.type === 'space' || token.type === 'dot') {
      postfix.push(token);
    } else if (token.type === 'star' || token.type === 'plus' || token.type === 'question') {
      postfix.push(token);
    } else if (token.type === 'or') {
      postfix.push(token);
    }
  }
  return postfix;
};

const buildNFA = (postfix) => {
  const nfaStack = [];
  for (const token of postfix) {
    if (token.type === 'char' || token.type === 'digit' || token.type === 'word' || token.type === 'space' || token.type === 'dot') {
      const nfa = new NFA();
      const startState = new State();
      const endState = new State();
      startState.addTransition(token, endState);
      nfa.startState = startState;
      nfa.endStates = [endState];
      nfaStack.push(nfa);
    } else if (token.type === 'star') {
      const nfa = nfaStack.pop();
      const startState = new State();
      const endState = new State();
      startState.addTransition(null, nfa.startState);
      startState.addTransition(null, endState);
      for (const endState of nfa.endStates) {
        endState.addTransition(null, nfa.startState);
        endState.addTransition(null, endState);
      }
      nfa.startState = startState;
      nfa.endStates = [endState];
      nfaStack.push(nfa);
    } else if (token.type === 'plus') {
      const nfa = nfaStack.pop();
      const startState = new State();
      const endState = new State();
      startState.addTransition(null, nfa.startState);
      for (const endState of nfa.endStates) {
        endState.addTransition(null, nfa.startState);
        endState.addTransition(null, endState);
      }
      nfa.startState = startState;
      nfa.endStates = [endState];
      nfaStack.push(nfa);
    } else if (token.type === 'question') {
      const nfa = nfaStack.pop();
      const startState = new State();
      const endState = new State();
      startState.addTransition(null, nfa.startState);
      startState.addTransition(null, endState);
      for (const endState of nfa.endStates) {
        endState.addTransition(null, endState);
      }
      nfa.startState = startState;
      nfa.endStates = [endState];
      nfaStack.push(nfa);
    } else if (token.type === 'or') {
      const nfa2 = nfaStack.pop();
      const nfa1 = nfaStack.pop();
      const startState = new State();
      const endState = new State();
      startState.addTransition(null, nfa1.startState);
      startState.addTransition(null, nfa2.startState);
      for (const endState of nfa1.endStates) {
        endState.addTransition(null, endState);
      }
      for (const endState of nfa2.endStates) {
        endState.addTransition(null, endState);
      }
      nfa1.startState = startState;
      nfa1.endStates = [endState];
      nfaStack.push(nfa1);
    }
  }
  return nfaStack.pop();
};

class State {
  constructor() {
    this.transitions = [];
  }

  addTransition(token, to) {
    this.transitions.push(new Transition(token, to));
  }

  getTransitions() {
    return this.transitions;
  }
}

class NFA {
  constructor() {
    this.startState = null;
    this.endStates = [];
  }
}

// 编译正则表达式，并返回状态转换表
function compileRegExp(pattern) {

  console.log('pattern', pattern);
  // 步骤1：对正则表达式进行词法分析
  const tokens = lexer(pattern);
  console.log('tokens', tokens);

  // 步骤2：将词法单元转换为中缀表达式
  const infix = toInfix(tokens);
  console.log('infix', infix);

  // 步骤3：将中缀表达式转换为后缀表达式
  const postfix = toPostfix(infix);

  // 步骤4：根据后缀表达式构建NFA
  const nfa = buildNFA(postfix);

  console.log(nfa);

  // // 步骤5：根据NFA构建DFA
  // const dfa = buildDFA(nfa);

  // // 步骤6：将DFA转换为状态转换表
  // const transitionTable = toTransitionTable(dfa);

  // // 步骤7：返回状态转换表
  // return transitionTable;
}

compileRegExp('a|b')






// // 绘制NFA
// function drawNFA(nfa) {
//   const doc = new svg.Document();

//   // 对于每个状态，添加一个圆圈
//   for (const state of nfa.states) {
//     const circle = new svg.Circle();
//     circle.cx = state.x;
//     circle.cy = state.y;
//     circle.r = 10;
//     doc.append(circle);
//   }

//   // 对于每条边，添加一条线段
//   for (const edge of nfa.edges) {
//     const line = new svg.Line();
//     line.x1 = edge.from.x;
//     line.y1 = edge.from.y;
//     line.x2 = edge.to.x;
//     line.y2 = edge.to.y;
//     doc.append(line);
//   }

//   // 返回绘制的图形
//   return doc;
// }

// // 定义需要编译的正则表达式
// const pattern =/a+b?/

// console.log(compileRegExp(pattern))