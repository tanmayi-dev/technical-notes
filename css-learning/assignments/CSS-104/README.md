# Week 4 Assignment

# Cascade and Specificity

### 1. Which of the below css rule will apply?

```css
p {
  color: red;
}

p {
  color: maroon !important;
}
```

### 2. Which CSS rule will apply to the first line of the paragraph?

```css
p::first-line {
  line-height: 1.5;
}

body p::first-line {
  line-height: 1.7;
}
```

### 3. Which CSS rule will be applied to the button when it is focused?

```css
button:focus {
  background-color: yellow;
}

body button:focus {
  background-color: green;
}
```

### 4. In the following example, what will be the color of the span element with the attribute `data-example`?

```css
span[data-example] {
  color: purple;
}

body span[data-example] {
  color: orange;
}

span[data-example] {
  color: teal !important;
}
```

### 5. If a `<p>` element is inside both the `<div>` with id "container" and the `<div>` with class "sidebar," what color will the text be?

```css
#container .content p {
  color: blue;
}

.sidebar p {
  color: red;
}

#container p {
  color: green !important;
}
```

### 6. If a `<p>` element is inside an element with id "header," what font size will be applied?

```css
#header p {
  font-size: 16px;
}

p {
  font-size: 14px !important;
}
```

### 7. What background color will be applied when you hover over a `<p>` element inside an element with class "container"?

```css
.container p {
  background-color: yellow;
}

.container p:hover {
  background-color: orange !important;
}
```

### 8. What font style will be applied to the first line of a `<p>` element inside an element with id "main-content"?

```css
#main-content p::first-line {
  font-style: italic;
}

#main-content p {
  font-style: normal !important;
}
```

### 9. If a `<p>` element is both inside the <div> with id "sidebar" and the `<div>` with id "content," what color will the text be?

```css
#sidebar p {
  color: purple;
}

#content p {
  color: orange;
}
```

### 10. If a `<p>` element is inside both the <div> with id "container" and the `<div>` with class "sidebar," and has a class of "highlight," what color will the text be?

```css
#container .content p {
  color: blue;
}

.sidebar p {
  color: red;
}

#container p {
  color: green !important;
}
```

### 11. If a `<p>` element has a class "important-text" and is inside an element with id "header" and a <div> with class "content," what font size will be applied?

```css
#header .important-text {
  font-size: 18px !important;
}

.content p {
  font-size: 14px;
}
```

### 11. What background color will be applied when you hover over a `<p>` element inside an element with class "container," having a class "highlight"?

```css
.container p {
  background-color: yellow;
}

.container p:hover:not(.highlight) {
  background-color: orange !important;
}
```

### 12. What font style will be applied to the first line of a `<p>` element with the class "special" inside an element with id "main-content"?

```css
#main-content p::first-line {
  font-style: italic !important;
}

#main-content p.special::first-line {
  font-style: normal;
}
```
