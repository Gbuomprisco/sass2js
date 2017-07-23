# sass2js

Require any `.scss` file and extract all the variables contained. 
Webpack loader will be provided in another package.

**Work in progress, usage not recommended. Also, it currently doesn't support maps.**

## Example

Suppose we have as input:

```scss
// main.scss
@import "colors.scss"

$primary: lighten($black, 10%);

// colors.scss
$black: #000;
```

The library will output:

```
{
    "black": "#000",
    "primary": "#1a1a1a"
}
```

## Programmatic usage

```javascript
import sass2js from 'sass2js'; // returns Promise<object>

const scss = '...' // scss string, require using fs?
sass2js(scss).then(console.log); // object {varName: '#000'}
```