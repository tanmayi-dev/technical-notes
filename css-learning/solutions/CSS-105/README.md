# Assignment 5

## 1. Given HTML and CSS what will be the actual value of the `**font-size**` and `padding` of the heading?

```html
<!doctype html>
  <head>
    <title>About CSS</title>
    <meta charset="UTF-8" />
		<style>
			section{
				width: 100vw;
				height: 100vh;
        font-size: 2rem;
			}

      h1{
				font-size: 1.5em;
      }
		</style>
  </head>
  <body>
    <section>
      <h1>CSS is fun!</h1>
    </section>
  </body>
</html>

```

**Font-size**
Described value : 1.5em

cascaded value : 1.5em

Specified value : 1.5rm

computed value : 1.5em * (2*16) = 1.5\*32 = 48px
used value : 48px ;

actual value : 48px;

**padding**

Described value : -

cascaded value : -

Specified value : 0px

computed value : 0px
used value : 0px

actual value : opx

## 2. Given the HTML and CSS below, what are the final computed values for **`font-size`**, **`padding`**, and **`margin`** of the **`<h1>`** element, considering inheritance and specific property values?

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Challenge</title>
    <style>
      body {
        font-size: 16px;
        margin: 10px;
      }

      section {
        font-size: 1.2em;
        padding: 15px;
      }

      h1 {
        font-size: inherit;
        margin: 5px;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <section>
      <h1>Challenge</h1>
    </section>
  </body>
</html>
```

**Only font-size is inherited**

h1 will take font-size as inherited (it will take fs from parent) section is the parent and let's calculate actual value of section

Described value : 1.2em

cascaded value : 1.2em

Specified value : 1.2em

computed value : 1.2em\* 16 = 19.2px (em will take size of parent so body is the parent and it has font-size 16px)
used value : 19.2px

actual value : 19.2px

**Padding**

Described value : 10px

cascaded value : 10px

Specified value : 10px

computed value : 10px
used value : 10px

actual value : 10px

**Margin**

Described value : 5px

cascaded value : 5px

Specified value : 5px

computed value : 5px
used value : 5px

actual value : 5px

## 3. What are the final computed **`margin`** and **`padding`** of the **`<p>`** element?

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Initial and Unset Challenge</title>
    <style>
      div {
        margin: 20px;
        padding: 10px;
      }

      p {
        margin: initial;
        padding: unset;
      }
    </style>
  </head>
  <body>
    <div>
      <p>Challenge</p>
    </div>
  </body>
</html>
```

**Margin**

Described value : 0px

cascaded value : 0px

Specified value : 0px

computed value : 0px
used value : 0px

actual value : opx

**Padding**

Described value : -

cascaded value : -

Specified value : 0px

computed value : 0px
used value : 0px

actual value : opx

## 4. What are the final computed **`color`** and **`border`** values of the **`<h1>`** element?

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Unset and Border Challenge</title>
    <style>
      body {
        color: blue;
      }

      section {
        border: 1px solid black;
      }

      h1 {
        color: unset;
        border: 2px dashed red;
      }
    </style>
  </head>
  <body>
    <section>
      <h1>Color and Border Challenge</h1>
    </section>
  </body>
</html>
```

**Color**

color : unset will remove all color make it black but since body has color defined it will get inherited color of **blue**.

**border**

Described value : 2px

cascaded value : 2px

Specified value : 2px

computed value : 2px
used value : 2px

actual value : 2px

## 5. What are the final computed **`line-height`**, **`margin`**, and **`padding`** values of the innermost **`<p>`** element?

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Challenge</title>
    <style>
      body {
        font-size: 16px;
        line-height: 1.6;
        margin: 10px;
        padding: 5px;
      }

      .container {
        font-size: 1.2em;
        line-height: 1.4;
        margin: 15px;
        padding: 10px;
      }

      p {
        line-height: 1.2;
        margin: 5px;
        padding: 2px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <p>Challenge</p>
      <div>
        <p>Another nested paragraph.</p>
      </div>
    </div>
  </body>
</html>
```

**line-height** is calculated as final number and its calculated based on font-size element.
so to calculate this we need to find the actual font-size of inner most <p>
since the font size of container is 1.2em actual value is 1.2\*16px(body font-size) = 19.2px

Described value : 1.2

cascaded value : 1.2

Specified value :1.2

computed value : 1.2\*19.2 =23.04px
used value : 23.04px

actual value : 23.04px

**Margin**

Described value : 5px

cascaded value : 5px

Specified value :5px

computed value : 5px
used value : 5px

actual value : 5px

P**adding**

Described value : 2px

cascaded value : 2px

Specified value :2px

computed value : 2px
used value : 2px

actual value : 2px
