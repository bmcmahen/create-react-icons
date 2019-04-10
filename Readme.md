# Create react icons

This is a tool built to generate icons for [Sancho-UI](http://sancho-ui.com). It takes a set of svg files and converts them into React components using one of the default templates or your own custom template. The generated icons support tree shaking and are all exported via the main index file.

```
yarn create react-icons -s 'node_modules/feather-icons/dist/icons/**.svg' -d destination
```

For typescript, use the `typescript` option.

```
yarn create react-icons -s 'node_modules/feather-icons/dist/icons/**.svg' -d destination --typescript
```

You can provide your ejs style template. It's best to start by copying one of the provided templates in the `lib` folder.

```
yarn create react-icons -s 'node_modules/feather-icons/dist/icons/**.svg' -d destination -t template.js
```

The cli can also be installed using yarn or npm allowing you to use the script within a local project.

```
yarn add create-react-icons
```
