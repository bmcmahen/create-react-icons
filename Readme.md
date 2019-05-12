<div align="center">
    
# Create react icons
  
[![npm package](https://img.shields.io/npm/v/create-react-icons/latest.svg)](https://www.npmjs.com/package/create-react-icons)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=create-react-icons%20is%20a%20CLI%20for%20generating%20your%20own%20react%20icon%20components%20from%20svg%20files.&url=https://github.com/bmcmahen/create-react-icons&hashtags=react,javascript)
[![Follow on Twitter](https://img.shields.io/twitter/follow/benmcmahen.svg?style=social&logo=twitter)](
https://twitter.com/intent/follow?screen_name=benmcmahen
)

</div>

Create react icons is a CLI for easily generating react icon components from a set of svg formatted icons. It was originally built to generate the feather icons found in [Sancho-UI](http://sancho-ui.com).

Install using yarn or npm

```
yarn global add create-react-icons
```

```
create-react-icons --source './icons/**.svg' --destination path/to/destination
```

## Features

- Generate javascript or typescript components.
- Provide a custom ejs template, or use the [included template](https://github.com/bmcmahen/create-react-icons/blob/master/lib/default-js-template.ejs). This flexibility means you could create a component that uses styled-components, themes, or even a non-react component.
- Generated icons support tree shaking. Bundle only those icons that you use!
- Creates an index file which exports all of your generated icons.

It converts something like this:

```svg
<!--?xml version="1.0" encoding="UTF-8" standalone="no"?-->
<svg viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-baseball">
    <!-- Generator: Sketch 3.0.3 (7891) - http://www.bohemiancoding.com/sketch -->
    <title>888</title>

    <defs></defs>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="#434343">
            <path d="M3.518,14.562 C4.434,13.746 5.712,13.19 6.863,12.963 C8.597,12.622 9.894,10.984 9.882,9.151 C9.878,8.305 9.534,7.506 8.916,6.9 C8.345,6.36 7.584,6.062 6.776,6.061 L6.623,6.064 C4.815,6.145 3.773,7.072 3.247,9.071 C2.929,10.291 2.214,11.566 1.411,12.471 C1.976,13.292 2.69,14.002 3.518,14.562 L3.518,14.562 Z" class="si-glyph-fill"></path>
            <path d="M8,0.046 C3.591,0.046 0.0160000001,3.603 0.0160000001,7.989 C0.0160000001,9.197 0.295,10.337 0.78,11.362 C1.325,10.659 1.837,9.722 2.087,8.766 C2.75,6.246 4.217,4.971 6.571,4.867 L6.772,4.862 C7.891,4.862 8.948,5.279 9.749,6.037 C10.602,6.873 11.074,7.975 11.081,9.142 C11.099,11.542 9.386,13.69 7.096,14.138 C6.22,14.312 5.32,14.682 4.632,15.183 C5.657,15.659 6.796,15.932 8.001,15.932 C12.41,15.932 15.985,12.375 15.985,7.989 C15.985,3.603 12.409,0.046 8,0.046 L8,0.046 Z" class="si-glyph-fill"></path>
        </g>
    </g>
</svg>
```

into this:

```jsx
import React from "react";
import PropTypes from "prop-types";

export function IconBaseball(props) {
  const { size, color, ...other } = props;
  return (
    <svg
      viewBox="0 0 17 17"
      version="1.1"
      height={size}
      width={size}
      {...other}
    >
      <title>888</title>

      <defs />
      <g stroke="none" fill="none" strokeWidth="1" fillRule="evenodd">
        <g fill={color}>
          <path d="M3.518,14.562 C4.434,13.746 5.712,13.19 6.863,12.963 C8.597,12.622 9.894,10.984 9.882,9.151 C9.878,8.305 9.534,7.506 8.916,6.9 C8.345,6.36 7.584,6.062 6.776,6.061 L6.623,6.064 C4.815,6.145 3.773,7.072 3.247,9.071 C2.929,10.291 2.214,11.566 1.411,12.471 C1.976,13.292 2.69,14.002 3.518,14.562 L3.518,14.562 Z" />
          <path d="M8,0.046 C3.591,0.046 0.0160000001,3.603 0.0160000001,7.989 C0.0160000001,9.197 0.295,10.337 0.78,11.362 C1.325,10.659 1.837,9.722 2.087,8.766 C2.75,6.246 4.217,4.971 6.571,4.867 L6.772,4.862 C7.891,4.862 8.948,5.279 9.749,6.037 C10.602,6.873 11.074,7.975 11.081,9.142 C11.099,11.542 9.386,13.69 7.096,14.138 C6.22,14.312 5.32,14.682 4.632,15.183 C5.657,15.659 6.796,15.932 8.001,15.932 C12.41,15.932 15.985,12.375 15.985,7.989 C15.985,3.603 12.409,0.046 8,0.046 L8,0.046 Z" />
        </g>
      </g>
    </svg>
  );
}

IconBaseball.defaultProps = {
  color: "currentColor",
  size: 24
};

IconBaseball.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
```

## API

```
Usage: create-react-icons [options]

Options:
  -V, --version             output the version number
  -s, --source <path>       Path to the svg icons source ('./path/**.svg')
  -d, --destination <path>  Destination path for the react components (./path/destination)
  -t, --template <path>     Path to ejs react component template (./path/template.ejs)
  --typescript              Generate typescript icons
  -h, --help                output usage information
```

## License

MIT
