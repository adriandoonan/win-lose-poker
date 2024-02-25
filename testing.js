class Bookstore {
  constructor(name) {
    this.name = name;
    this.books = []
  }

  storeBook(book) {
    this.books.push(book)
  }

}





class Book {
  constructor(title,pages,price) {
    this.title = title;
    this.pages = pages;
    this.price = price;
  }
  changeTitle(newTitle) {
    this.title = newTitle;
  }
}

const book1 = new Book("JavaScript: The Good Parts", 456, 25);

console.log(book1);

const bookstore = new Bookstore("Ironhack Bookstore");

const book2 = new Book("Eloquent JavaScript", 472, 22);
bookstore.storeBook(book2);

console.log(bookstore);
// Output:
// {
//   name: "Ironhack Bookstore",
//   books: [
//     {
//       title: "Eloquent JavaScript",
//       pages: 472,
//       price: 22
//     }
//   ]
// }