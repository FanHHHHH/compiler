

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

// ????????????????????????????????????????????????
function compileRegExp(pattern) {

  console.log('pattern', pattern);
  // ??????1???????????????????????????????????????
  const tokens = lexer(pattern);
  console.log('tokens', tokens);

  // ??????2??????????????????????????????????????????
  const infix = toInfix(tokens);
  console.log('infix', infix);

  // ??????3?????????????????????????????????????????????
  const postfix = toPostfix(infix);

  // ??????4??????????????????????????????NFA
  const nfa = buildNFA(postfix);

  console.log(nfa);

  // // ??????5?????????NFA??????DFA
  // const dfa = buildDFA(nfa);

  // // ??????6??????DFA????????????????????????
  // const transitionTable = toTransitionTable(dfa);

  // // ??????7????????????????????????
  // return transitionTable;
}

compileRegExp('a|b')






// // ??????NFA
// function drawNFA(nfa) {
//   const doc = new svg.Document();

//   // ???????????????????????????????????????
//   for (const state of nfa.states) {
//     const circle = new svg.Circle();
//     circle.cx = state.x;
//     circle.cy = state.y;
//     circle.r = 10;
//     doc.append(circle);
//   }

//   // ????????????????????????????????????
//   for (const edge of nfa.edges) {
//     const line = new svg.Line();
//     line.x1 = edge.from.x;
//     line.y1 = edge.from.y;
//     line.x2 = edge.to.x;
//     line.y2 = edge.to.y;
//     doc.append(line);
//   }

//   // ?????????????????????
//   return doc;
// }

// // ????????????????????????????????????
// const pattern =/a+b?/

// console.log(compileRegExp(pattern))