# sass2js

Require any `.scss` file and extract all the variables contained. It works best with Webpack: you can find the [webpack loader here](https://github.com/Gbuomprisco/sass2js-loader).

**Work in progress, many variants are not working, so usage is not recommended**

## Why

Styles are usually stored as variables in .scss files. And sometimes you need those in your code for things such as inline styles and animations, and you don't want to hardcode these variables. This library allows you to reuse sass code without redeclaring your styles, which should be less error prone. Your designer will thank you.

## Install

    npm install sass2js // OR
    yarn add sass2js


## Example

Suppose we have as input:

```scss
// main.scss
@import "colors.scss"

$primary: lighten($black, 10%);

// colors.scss
$black: #000;

$theme: (
    background: red
);
```

The library will output:

```
{
    "black": "#000",
    "primary": "#1a1a1a",
    "theme": {
        background: "red"
    }
}
```

## Programmatic usage

```javascript
import sass2js = require('sass2js');

const scss = '...' // any scss string
sass2js(scss) // returns Promise<object>
    .then(console.log); // object {varName: '#000'}
```
