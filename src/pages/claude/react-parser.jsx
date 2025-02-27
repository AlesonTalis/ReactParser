import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Stack
} from '@mui/material';

/**
 * Parses custom syntax and converts it to React components using Material UI
 */
class ReactParser {
  constructor() {
    this.components = {
      Screen: (props) => <Container maxWidth="lg" {...props} />,
      Section: (props) => <Box component="section" {...props} />,
      Text: (props) => <Typography {...props} />,
      FillLoren: (props) => <Typography>{this.generateLoremIpsum(props.paragraph || 1)}</Typography>
    };
  }

  /**
   * Generate Lorem Ipsum text
   * @param {number} paragraphs - Number of paragraphs to generate
   * @returns {string} - Lorem Ipsum text
   */
  generateLoremIpsum(paragraphs = 1) {
    const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.";
    let result = "";
    
    for (let i = 0; i < paragraphs; i++) {
      result += loremText + "\n\n";
    }
    
    return result.trim();
  }

  /**
   * Parse style properties from a string
   * @param {string} propString - String containing style properties
   * @returns {object} - Object with style properties
   */
  parseProps(propString) {
    if (!propString) return {};
    
    const props = {};
    const regex = /(\w+)\(([^)]*)\)/g;
    let match;
    
    while ((match = regex.exec(propString)) !== null) {
      const [, propName, propValue] = match;
      
      if (propName === 'id') {
        props.id = propValue;
      } else if (propName === 'value') {
        props.children = propValue.replace(/"/g, '');
      } else if (propName === 'paragraph') {
        props.paragraph = parseInt(propValue);
      } else if (propName === 'flex') {
        if (propValue === 'row') {
          props.display = 'flex';
          props.flexDirection = 'row';
        } else if (propValue === '') {
          props.flex = 1;
        } else {
          props.flex = propValue;
        }
      } else if (propName === 'align') {
        if (propValue === 'center') {
          props.textAlign = 'center';
          props.alignItems = 'center';
          props.justifyContent = 'center';
        } else if (propValue === 'start') {
          props.alignItems = 'flex-start';
        }
      } else if (propName === 'padding') {
        const values = propValue.split(',').map(v => parseInt(v));
        if (values.length === 1) {
          props.padding = values[0];
        } else if (values.length === 2) {
          props.paddingY = values[0];
          props.paddingX = values[1];
        } else if (values.length === 4) {
          props.padding = values.join('px ') + 'px';
        }
      } else if (propName === 'rem' && propValue === '') {
        // Add rem flag - convert padding to rem units
        if (props.padding) props.padding = `${props.padding / 16}rem`;
        if (props.paddingX) props.paddingX = `${props.paddingX / 16}rem`;
        if (props.paddingY) props.paddingY = `${props.paddingY / 16}rem`;
      }
    }
    
    console.log({props})

    return props;
  }

  /**
   * Parse a line of the custom syntax
   * @param {string} line - Line to parse
   * @returns {object} - Object with component type and props
   */
  parseLine(line) {
    const trimmedLine = line.trim();
    if (!trimmedLine) return null;
    
    // Count leading spaces to determine nesting level
    const indentation = line.search(/\S/);
    
    // Extract component type and props
    const componentMatch = trimmedLine.match(/^(\w+)(.*)$/);
    if (!componentMatch) return null;
    
    const [, componentType, propsString] = componentMatch;
    const props = this.parseProps(propsString);
    
    return {
      componentType,
      props,
      indentation,
    };
  }

  /**
   * Build a component tree from parsed lines
   * @param {array} parsedLines - Array of parsed lines
   * @returns {array} - Array of component trees
   */
  buildTree(parsedLines) {
    if (!parsedLines.length) return [];
    
    const root = parsedLines[0];
    const stack = [root];
    
    for (let i = 1; i < parsedLines.length; i++) {
      const currentLine = parsedLines[i];
      if (!currentLine) continue;
      
      while (stack.length > 0 && stack[stack.length - 1].indentation >= currentLine.indentation) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      
      parent.children.push(currentLine);
      stack.push(currentLine);
    }
    
    return [root];
  }

  /**
   * Render a component tree to React elements
   * @param {object} node - Node to render
   * @returns {React.Element} - Rendered React element
   */
  renderTree(node) {
    if (!node) return null;
    
    const Component = this.components[node.componentType];
    if (!Component) {
      console.error(`Component ${node.componentType} not found`);
      return null;
    }
    
    const childElements = node.children 
      ? node.children.map(child => this.renderTree(child)) 
      : null;

    console.log(node)
    
    return <Component key={Math.random()} {...node.props}>{childElements ?? node.children}</Component>;
  }

  /**
   * Parse custom syntax and render React components
   * @param {string} input - Custom syntax string
   * @returns {React.Element} - Rendered React components
   */
  parse(input) {
    const lines = input.split('\n');
    const parsedLines = lines
      .map(line => this.parseLine(line))
      .filter(line => line !== null);
    
    const trees = this.buildTree(parsedLines);
    return trees.map(tree => this.renderTree(tree));
  }
}

export default ReactParser;