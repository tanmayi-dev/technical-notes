# Clean Code

### index

- [Basics](#basics)
  - [What is Clean Code?]
  - [Key Pain Points]
  - [Course Structure]
- 

## Basics <a id="basics"></a>

### What is Clean Code ?

- Should be readable and meaningful
- Should reduce cognitive load
- Should be concise and "to the point"
- Should avoid unintuitive names, complex nesting and big code blogs
- Should follow common best practions and patterns
- Should be fun to write and to maintain
- Below is dirty-code-1 
  ```py
  def create(m, n):
    if m == 'Max':
      return lambda v: v < n
    elif m == "Min":
      return lambda v: v > n

  max = create('Max', 31)

  print(max(15))
  print(max(32))
  ```
- Below better-code-1
  ```py
  def create_validator(mode, number):
    if mode == "Max":
      return lambda value: value < number
    elif mode == "Min":
      return lambda value: value > number

  is_below_max = create_validator("Max", 31)

  print(is_below_max(15))
  print(is_below_max(32))
  ```
- Below is clean-code-1
```py
class ValidatableNumber:
  def __init__(self, number):
    self.number = number

  def is_bigger_than(self, other_number):
    return other_number < self.number

  def is_smaller_than(self, other_number):
    return other_number > self.number

  input_number = ValidatableNumber(31)

  print(input_number.is_bigger_than(15))
  print(input_number.is_bigger_than(32))
```

## Key Pain Points

### Problems

- Names
  - Variables
  - Functions
  - Classes
- Structure and Comments
  - Code  
- Functions
  - Length
  - Parameters 
- Conditionals and Error handling
  - Deep Nesting
  - Missing Error Handling
- Classes and Data Structures
  - Missing Distinction
  - Bloated Classes
 
### Solutions

- Rules and Concepts
- Patterns and Principles
- Test-Driven Development

## Course Structure

### Problems , Rules and Concepts

- Learn about bad code and why it's bad
- Understand the core rules and concepts you should follow

### Demos and Examples

- See bad and good code in action
- Bad to good code transformations and examples

### Challenge Time

- Analyze and transform code on your own
- Apply what you learned
