const bookData = {
    title: 'Pride and Prejudice',
    author: 'Emily Bronté',
    quantity: 3,
    edition: 4
}

const comicBookData = {
    title: 'Spiderman',
    author: 'Stan Lee',
    quantity: 3,
    graphicArtist: 'Todd McFarlane'
}


// Your code goes here

function Book(title, author, quantity, edition) {
    this.title = title;
    this.author = author;
    this.quantity = quantity;
    this.edition = edition;
}

Object.defineProperty(Book, "setEdition", {
    set: function(newEdition) {
      this.edition = newEdition;
    }
});

Book.prototype.sell = function() {
  if (this.quantity > 0) {
    this.quantity = this.quantity - 1;
  }
}

function ComicBook(title, author, quantity, graphicArtist) {
  Book.call(this, title, author, quantity);
  this.graphicArtist = graphicArtist;
}

ComicBook.prototype = Object.create(Book.prototype, {
  constructor: {
    value: ComicBook
  }
})

const book = new Book(bookData.title, bookData.author, bookData.quantity, bookData.edition);
const comicBook = new ComicBook(comicBookData.title, comicBookData.author, comicBookData.quantity, comicBookData.graphicArtist);
const result = [book, comicBook];
