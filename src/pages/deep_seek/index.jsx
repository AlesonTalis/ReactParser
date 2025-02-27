import React from 'react';
import { Box, Typography } from '@mui/material';
import FillLoren from '../../component/FillLoren';
import TextEditor from '../../component/TextEditor';

// Component configuration mapping
const componentConfig = {
  Screen: {
    component: Box,
    sxProps: true,
  },
  Section: {
    component: Box,
    sxProps: true,
  },
  Text: {
    component: Typography,
    childrenProp: 'value',
    props: {
      align: 'align',
      size: 'fontSize'
    },
    sxProps: true,
    styleMappings: {
      flex: 'display',
    },
  },
  FillLoren: {
    component: FillLoren,
    props: {
      paragraph: 'paragraph',
    },
  },
};

// Utility functions
function getIndentLevel(line) {
  const match = line.match(/^\s*/);
  return match ? match[0].length : 0;
}

function tokenize(content) {
  const tokens = [];
  let current = '';
  let depth = 0;

  for (const char of content) {
    if (char === ' ' && depth === 0) {
      if (current) tokens.push(current);
      current = '';
    } else {
      current += char;
      if (char === '(') depth++;
      else if (char === ')') depth--;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

function parseProp(part) {
  const propMatch = part.match(/^(\w+)(?:\((.*)\))?$/);
  if (!propMatch) return null;

  const [_, name, value] = propMatch;
  let parsedValue = value || true;

  if (typeof parsedValue === 'string') {
    if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
      parsedValue = parsedValue.slice(1, -1);
    } else if (parsedValue.includes(',')) {
      parsedValue = parsedValue.split(',').map(v => v.trim());
    } else if (!isNaN(parsedValue)) {
      parsedValue = Number(parsedValue);
    }
  }

  return { name, value: parsedValue };
}

function parseModifier(part) {
  if (!part.startsWith('.')) return null;
  const modifierPart = part.slice(1);
  const modifierMatch = modifierPart.match(/^(\w+)(?:\((.*)\))?$/);
  if (!modifierMatch) return null;

  const [_, name, value] = modifierMatch;
  let parsedValue = value || true;

  if (typeof parsedValue === 'string') {
    if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
      parsedValue = parsedValue.slice(1, -1);
    } else if (parsedValue.includes(',')) {
      parsedValue = parsedValue.split(',').map(v => v.trim());
    } else if (!isNaN(parsedValue)) {
      parsedValue = Number(parsedValue);
    }
  }

  return { name, value: parsedValue };
}

function buildAST(lines) {
  const root = { children: [] };
  const stack = [{ node: root, indent: -1 }];

  lines.forEach(line => {
    const indent = getIndentLevel(line);
    const content = line.trim();
    if (!content) return;

    const tokens = tokenize(content);
    const component = tokens[0];
    const propTokens = tokens.slice(1);

    const node = {
      component,
      props: {},
      styles: {},
      children: [],
    };

    let lastSxKey = null;

    propTokens.forEach(token => {
      const parts = token.split(/(?=\.)/g);
      const propPart = parts[0];
      const modifiers = parts.slice(1);

      const prop = parseProp(propPart);
      if (!prop) return;

      const config = componentConfig[node.component] || {};
      const propName = (config.props || {})[prop.name] || prop.name;

      if (config.childrenProp === prop.name) {
        node.props.children = prop.value;
      } else if (config.props && config.props[prop.name]) {
        node.props[propName] = prop.value;
      } else if (config.sxProps) {
        const styleMappings = config.styleMappings || {};
        const sxKey = styleMappings[prop.name] || prop.name;
        node.styles[sxKey] = prop.value;
        lastSxKey = sxKey;
      }

      modifiers.forEach(modPart => {
        const modifier = parseModifier(modPart);
        if (!modifier) return;

        if (modifier.name === 'rem' && lastSxKey) {
          const value = node.styles[lastSxKey];
          const applyUnit = (val) => Array.isArray(val)
            ? val.map(v => `${v}rem`).join(' ')
            : `${val}rem`;
          node.styles[lastSxKey] = applyUnit(value);
        } else {
          const styleMappings = config.styleMappings || {};
          const sxKey = styleMappings[modifier.name] || modifier.name;
          node.styles[sxKey] = modifier.value;
        }
      });
    });

    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].node;
    parent.children.push(node);
    stack.push({ node, indent });
  });

  return root.children[0];
}

function generateComponent(node) {
  const config = componentConfig[node.component] || { component: node.component };
  const Component = config.component;
  const props = { ...node.props };
  if (Object.keys(node.styles).length > 0) {
    props.sx = node.styles;
  }

  const children = node.children.map(child => generateComponent(child));
  return React.createElement(Component, props, ...children);
}

export function parseCustomSyntax(input) {
  const lines = input.split('\n').filter(line => line.trim() !== '');
  const ast = buildAST(lines);
  return generateComponent(ast);
}

// Example usage:
// const input = `...`;
// const component = parseCustomSyntax(input);
// ReactDOM.render(component, document.getElementById('root'));


export default function DeepSeek() {
    return (
        <TextEditor 
            childrenElement={(text) => parseCustomSyntax(text)}
        />
    )
}
  