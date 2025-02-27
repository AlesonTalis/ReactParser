import React from 'react';
import TextEditor from '../../component/TextEditor';
import FillLoren from '../../component/FillLoren';
import { Container, Box, Typography } from '@mui/material';

// A simple DSL parser that uses indentation to build a tree.
function parseDSL(input) {
    const lines = input.split('\n').filter(line => line.trim() !== '');
    const root = { type: 'ROOT', children: [] };
    const stack = [{ node: root, indent: -1 }];
  
    lines.forEach((line) => {
      const indent = line.match(/^(\s*)/)[0].length;
      const trimmed = line.trim();
      const node = parseLine(trimmed);
  
      // Pop stack until we find the parent for the current indent level
      while (stack.length && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }
      // The new node is a child of the last item on the stack
      stack[stack.length - 1].node.children.push(node);
      stack.push({ node, indent });
    });

    console.log(root.children,input);
  
    return root.children;
  }
  
  function parseLine(line) {
    // Replace dots with spaces so we treat chained tokens uniformly
    const tokens = tokenize(line);
    // The first token is the component name
    const componentName = tokens.shift();
    const props = {};
  
    tokens.forEach(token => {
      // Token pattern: name(arg) or just name
      const match = token.match(/^(\w+)(?:\((.*?)\))?$/);
      if (match) {
        const key = match[1];
        let value = match[2];
        if (value === undefined) {
          // If no argument is provided, assume a boolean flag
          value = true;
        } else {
          // Remove surrounding quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (!isNaN(Number(value))) {
            value = Number(value);
          }
        }
        props[key] = value;
      }
    });
    return { type: componentName, props, children: [] };
  }
  
  function tokenize(line) {
    // Replace dots with spaces to treat chained methods as separate tokens
    return line.replace(/\./g, ' ').split(/\s+/);
  }
  

// Mapping DSL types to React components
const componentMapping = {
    Screen: (props, children) => <Container {...props}>{children}</Container>,
    Section: (props, children) => <Box {...props}>{children}</Box>,
    Text: (props) => <Typography {...props}>{props.value}</Typography>,
    FillLoren: (props) => <FillLoren {...props} />
  };
  
  // A recursive function to render the AST
  function renderAST(nodes) {
    console.log({nodes});
    return nodes.map((node, index) => {
      const Component = componentMapping[node.type];
      if (!Component) {
        console.warn(`Component ${node.type} is not mapped.`);
        return null;
      }
      const children = node.children.length > 0 ? renderAST(node.children) : null;
      console.log({Component,children})
      return <Component key={index} {...node.props}>{children}</Component>;
    });
  }

export default function ChatGPT({ dsl }) {
  return (
    <TextEditor childrenElement={(text) => {
        return <>
            {renderAST(parseDSL(text))}
        </>
        }}
    />
  );
}
