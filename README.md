# sass2js

Require any `.scss` file and extract all the variables contained. You can find the [webpack loader here](https://github.com/Gbuomprisco/sass2js-loader).

**Work in progress, production usage not recommended**

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
