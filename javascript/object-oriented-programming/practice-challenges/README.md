# Practice Challenges

#### Index

1. [Create a course roster using functions](#p1)
2. [Create a Book object with functions](#p2)
3. [Create a Country with Classes](#p3)
4. [Create a Food Ordering Class](#p4)
5. [Create User and Admin Classes](#p5)

   
### 1. Create a course roster using functions <a id="p1"></a>

- [Code](https://github.com/tanmayi-dev/javascript-notes/blob/main/object-oriented-programming/practice-challenges/01-create-a-roster-with-functions.js)

Create a `Student` object and a `CourseRoster` object, and use their prototype settings to create `getRoster()` and `returnGraduatingStudents()` object functions. The output of these object functions is described below/

**Parameters for the Student Object**
- `name`: String
- `grades`: An array of integers that rangee from 0-100

**Student Object Functions**
- `getGrades`: Returns the grades for the student
- `checkIsPassing`: Returns true if the student is passing (use the provided `calculateGPA` function)

**Parameters for the CourseRoster object**
- `roster`: An array of `Student` objects
- `teacher`: String

**CourseRoster object functions**
- `getRoster`: Returns a string of student names separated by a comma
- `returnGraduatingStudents`: Returns an array of Student objects who will graduate

**Result**
- `testCourseRoster`: An instance of the CourseRoster object

**Example 1**

Input:
```js
const roster = [
    {
        name: 'Anwar',
        grades: [97, 87, 99]
    },
    {
        name: 'Sophie',
        grades: [75, 22, 85]
    },
    {
        name: 'Ron',
        grades: [64, 77, 90]
    }
];
const teacher = 'Harriet'
```

Result:
```js
CourseRoster {
    roster: [
        Student { name: 'Anwar', grades: [Array] },
        Student { name: 'Sophie', grades: [Array] },
        Student { name: 'Ron', grades: [Array] }
    ],
    teacher: 'Harriet'
}
```

--- 

### 2. Create a Book object with functions <a id="p2"></a>

- [Code](https://github.com/tanmayi-dev/javascript-notes/blob/main/object-oriented-programming/practice-challenges/02-create-a-book-object-with-functions.js)

We can use the `Object.defineProperty()` method to define a new property directly on an object. This method takes the object where the property is defined, the property name we want to define, and a descriptor of the property we're defining.

For example, if we have a `wrangler` object, we can define a new property called `maker` which sets its maker to "Jeep":

```js
const wrangler = {};

Object.defineProperty(wrangler, 'maker', {
    value : 'Jeep'
});

wrangler.maker; // Jeep
```

Similarly, `Object.create()` allows us to create a new object using an already-existing object as the prototype.

**Your task**: Create a `Book` object and a `ComicBook` object. For the `Book` object, define a `setEdition` property and a `sell()` function. For the `ComicBook` object, use `Object.create()` to create a relationship between `Book` and `ComicBook`.

**Parameters for the Book object**

- `title`: String
- `author`: String
- `quantity`: Number
- `edition`: String

**Parameters for the ComicBook object**

- `title`: String
- `author`: String
- `quantity`: Number
- `graphicArtist`: String

**Book object functions**

- `setEdition(newEdition)`: Sets the edition of the book
- `sell()`: Sells one copy of the book if there are available copies

**Result**

`[TestBook, TestComicBook]`: An array containing an instance of the `Book` object and an instance of the `ComicBook` object

**Constraints**

- You must use `defineProperty` to declare the `setEdition` function
- You must use `Object.create` to create a relationship between `Book` and `ComicBook`

**Example 1 :** 

Input : 
```js
const bookData = {
    title: 'Pride and Prejudice',
    author: 'Emily Bronte',
    quantity: 3,
    edition: 4
}

const comicBookData = {
    title: 'Spiderman',
    author: 'Stan Lee',
    quantity: 3.
    graphicArtist: 'Todd McFarlane'
}
```

Result :
```js
[
    Book {
        title: 'Pride and Prejudice',
        author: 'Emily Bronte',
        quantity: 2,
        edition: 5
    },
    ComicBook {
        title: 'Spiderman',
        author: 'Stan Lee',
        quantity: 3,
        edition: undefined,
        graphicArtist: 'Todd McFarlane'
    }
]
```

---

### 3. Create a Country with Classes <a id="p3"></a>

- [Code](https://github.com/tanmayi-dev/javascript-notes/blob/main/object-oriented-programming/practice-challenges/03-create-a-country-with-classes.js)

JavaScript class syntax is a method of creating objects, built on prototypes. Classes use a constructor function which is a special way to initialize objects. Classes can also contain functions that both modify and return data as in this example:

```js
class Person {
   constructor(name, age) {
      this.name = name;
      this.age = age;
   }

   sayHello() {
      return 'Hello!';
   }

   haveBirthday() {
      this.age = this.age + 1;
   }
}
```

**Your task**: Create a `Country` class with two internal methods : `getOverview()` and `setPopulation()`.

**Parameters for the Country class**

- `name`: String
- `continent`: String
- `currency`: String
- `population`: String

**Country class functions**

- `getOverview()`: Returns an overview of the country's data (for example, _"France is a country in Europe. Its currency is the Euro and it has a current population of 67.75 million people."_)
- `setPopulation(newPopulation)`: Sets the population for a country

**Result**

`testCountry`: An instance of the `Country` class

**Constraints**

- You must use JavaScript class syntax
- `getOverview` must return a string with the following syntax:
  ```
  [country] is a country in [continent]. Its currency is the [currency] and it has a current population of [population] people.
  ```

**Example 1 :**

Input:
```js
const countryData = {
   name: 'France',
   continent: 'Europe',
   currency: 'Euro',
   population: '67.75 million'
}
```

Result:
```js
Country {
   name: 'France',
   continent: 'Europe',
   currency: 'Euro',
   population: '70.12 million'
}
```

---

### 4. Create a Food Ordering Class <a id="p4"></a>

- [Code](https://github.com/tanmayi-dev/javascript-notes/blob/main/object-oriented-programming/practice-challenges/04-create-a-food-ordering-class.js)
  
JavaSciprt's `get` syntax allows us to bind a property of an object to a function that will be called when we attempt to liik up its value. This is extremely useful when we want to access a dynamically computed property.

For example, if we have a `Person` object, and it contains a value called `salary`, that contains the value of their annual salary in US dollars, but we want to be able to access their salary in Euro, we could use a `get` function to do compute this conversion as in this example:

```js
class Person {
   constructor(salary) {
      this.salary = salary;
   }

   get salaryEuro() {
      return this.salary * .93;
   }
}

const me = new Person(45000);
console.log(me.salaryEuro);
```

The `set` syntax is similar to `get` but instead of returning a computed value, it binds the property of an object to a function which is called when setting that property.

For example, if we have an object named `device`, we can use the `set` keyword to change the orientation of the device:

```js
const device = {
   orientation: 'landscape',
   set view(value) {
      this.orientation = value;
   }
}

device.view = 'portrait';
device.view = 'landscape';
```

**Your task**: Create an `Order` class with getters and setters.

**Parameters for the Order class**

- `restaurant`: String
- `total`: String
- `customer`: String

**Properties of the Order Class**

The following properties must also be added to the Order class. They are not parameters.

- `foodStatus = 0;`
- `validFoodStatuses = [0,1,2,3];`

**Order class functions**

- **(get)** `orderStatus()` : Returns a string that relates to the current `foodStatus`
   - `0`: "Waiting for the restaurant to accept the order"
   - `1`: "Your order is being prepared"
   - `2`: "Your order is ready for pickup"
   - `3`: "Your order has been cancelled"
   - `Error/default`: "Something went wrong"
- **(set)** `orderStatus(newStatus)`: Sets the `foodStatus` for the order. If the `newStatus` is invalid, set the `foodStatus` to `null`.

**Result**

`testOrder`: An instance of the `Order` class

**Constraints**
- You must use a getter function for getting the food status
- You must use a setter function for setting the food status

**Example 1 :**

Input:
```js
const orderData = {
   restaurant: 'Chick-Fil-A',
   total: 14.73,
   customer: 'Henry Cavill'
}
```

Result: 
```js

Order {
   restaurant: 'Chick-Fil-A',
   total: 14.73,
   customer: 'Henry Cavill',
   foodStatus: null,
   validFoodStatuses: [ 0, 1, 2, 3 ]
}

```

--- 

### 5. Create User and Admin Classes <a id="p5"></a>

- [Code](https://github.com/tanmayi-dev/javascript-notes/blob/main/object-oriented-programming/practice-challenges/05-create-user-and-admin-classes.js)

Use private properties to hide certain values and prevent them from being directly accessed. Private properties can only be accessed from inside the class declaration.

We denote a private variable or function with the hash (#) symbol.

For example if we had a Person class with a social security number and a function to calculate their tax bracket, we wouldn't necessarily want that information publicly accessible. So we can make these fields private as in the example below :

```js
class Person {
   #socialSecurityNumber;

   #calculateTaxBracket() {
   }
}
```

**Your task**: Create a `User` class and an `Admin` class. The `Admin` class extends the `User` class. The `User` class has a public `updatePassword()` function and a private `resetPassword()` function. The `Admin` class a public `deleteUser()` function.

**Parameters for the User class**

- `username`: String
- `(private) password`: String

**Parameters for the Admin class**

- `username`: String
- `(private) password`: String

**Properties of the Admin class**

The following properties must also be added to the Admin class. They are not parameters.

- `isAdmin` = true;

**User class functions**

- `resetPassword(newPassword)`: Calls the private function `updatePassword` with the new password
- `updatePassword(newPassword)`: Sets the user's password to the newPassword. This is a private function.

**Admin class functions**

- `deleteUser(userToDelete)`: Takes a string, `userToDelete` and returns a string message: _The user [userToDelete] has been deleted_

**Result**

`[testUser, testAdmin]`: An array containing an instance of the `User` class and an instance of the `Admin` class

**Constraints**

- Password must be a private variable
- `updatePassword` must be a private function
- You must use the `extends` keyword to create a relationship between `User` and `Admin`

**Example 1:**

Input:
```js
const userData = {
   username: 'emma',
   password: 'ZRYAK3GSS3wQujr'
};

const adminData = {
   username: 'sarah',
   password: 'r5tHZE9DUP1SgTB'
};
```

Result:
```js
[
   User { username: 'emma' },
   Admin { username: 'sarah', isAdmin: true }
]
```
