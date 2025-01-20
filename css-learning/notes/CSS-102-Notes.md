## CSS Units

- Root font size of browsers is 16px

- px : pixels
  - absolute unit
- % : percentage
  - relative unit
  - certain percentage of parents value
- em : emphemeral unit
  - relative to the current font size
  - do not use much in production
  - fonts: 2 em = 2 \* parent's computed font size
  - lengths : 2 em = 2 \* current div size
- rem : root em
  - relative to the root font size
  - refers to the font-size of the root element of a document - by default root font-size is 16px
  - To make it 10px we use 62.5%
  - font size : 62.5%
  - https://m2.material.io/design/typography/the-type-system.html#type-scale
  - https://www.aleksandrhovhannisyan.com/blog/62-5-percent-font-size-trick/
  - https://www.youtube.com/watch?v=BPsrVVOKMLc
- ch : character width
  - the width of the character 0 (zero, or U+0030) of the font
- vh : viewport height
- vw : viewport width

- By default, font-size of root is 16px
- It is recommended not to modify the default font-size since browser takes into account user preferences
- It will cause problem with accessiblity

- You should use relative units such as percentage or rem for font-size. So that when user increases the percentage of browser, the font-size increase with it. If you use fixed pixel units, then user will not be able to increase the font-size

## Colors

- there are 140 named colors
- background-color is for background color
- color is for text color
- rgba : red green blue alpha
  - 0-255
  - 16 million colors can be created
  - alpha is the opacity / transparency
- hex : hexadecimal
  - #000000
  - #ffffff
- hsl : hue saturation lightness
  - hsl(0deg 100% 50% / 0.5)
- background: linear-gradient(90deg, hsl(), hsl())

## Typography

- how to add custom fonts

## CSS Properties

- default line height is 1.15
- Web accessiblity says, line-height should be atleast 1.5

- currentColor

- clip-path
- opacity for background images
- gradient for background images

- box-shadow - x-offset, y-offset, spread, inset, blur, color
