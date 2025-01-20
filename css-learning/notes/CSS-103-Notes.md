## CSS Selectors

- Universal Selector (\*) : selects everything

  - override default styling
  - border-box: none
  - padding : 0
  - margin : 0

- Class Selectors

  - using class name
  - certain use cases

- Attribute Selectors
  - Exact : [data-type="primary"] {}
  - Only Attribute : [data-type] {}
  - Case sensitive by adding s : [data-type='primary' s] {}
  - Contains : [href*='example.com'] {}
  - starts with : [href^='https'] {}
  - ends with : [href$='.com'] {}

```
progress(value) {
  height: 66px;
}

```

```
[value] {
  height: 60px;
}

```

```
[value == "00"]
```

## Pseudo Elements

- after
- before
- marker
- Selection
- first-letter

- pseudo elements are inserted in the dom elements
- pseudo elements can be seen in the dom

- Pseudo-classes cannot be seen as element in the dom

- first-line is only for inline
- first-letter works for everything
