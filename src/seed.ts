
import Book, {IBook} from "./models/Book";
import {connectDB, disconnectDB} from './db'

const sampleBooks: Partial<IBook>[] = [
  {
      title: "The Hitchhiker's Guide to the Galaxy",
      author: "Douglas Adams",
      genre: "Science", 
      publicationYear: 1979,
      isbn: "978-0345391803",
      rating: 4.5,
      tags: ["comedy", "sci-fi", "cult classic", "adventure"],
      isAvailable: true,
      pages: 224,
      publisher: { name: "Pan Books", location: "London" },
      description: "A hilarious satirical science fiction series."
  },
  {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      genre: "Fiction",
      publicationYear: 1813,
      isbn: "978-0141439518",
      rating: 4.7,
      tags: ["romance", "classic", "regency", "social commentary"],
      isAvailable: true,
      pages: 432,
      description: "A classic novel exploring themes of love, marriage, and social status in Regency England."
  },
  {
      title: "1984",
      author: "George Orwell",
      genre: "Fiction", // Changed from Dystopian to fit enum
      publicationYear: 1949,
      isbn: "978-0451524935",
      rating: 4.3,
      tags: ["dystopian", "political fiction", "classic", "surveillance"],
      isAvailable: false, // Example of unavailable book
      pages: 328,
      publisher: { name: "Secker & Warburg", location: "London" }
  },
  {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      genre: "Non-Fiction",
      publicationYear: 2011, // Original Hebrew publication year
      isbn: "978-0062316097",
      rating: 4.8,
      tags: ["history", "anthropology", "science", "evolution"],
      isAvailable: true,
      pages: 464,
      publisher: { name: "Harper" } // Example without location
  },
  {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      publicationYear: 1937,
      isbn: "978-0547928227",
      rating: 4.6,
      tags: ["fantasy", "adventure", "classic", "middle-earth"],
      isAvailable: true,
      pages: 310,
      description: "An introductory tale to the world of Middle-earth, following Bilbo Baggins."
  },
  {
      title: "Cosmos",
      author: "Carl Sagan",
      genre: "Science",
      publicationYear: 1980,
      isbn: "978-0345539434",
      rating: 4.9,
      tags: ["science", "astronomy", "cosmology", "popular science"],
      isAvailable: true,
      pages: 384,
      publisher: { name: "Random House" },
      description: "Explores the universe and our place within it."
  },
   {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      genre: "Science",
      publicationYear: 1988,
      isbn: "978-0553380163",
      rating: 4.4,
      tags: ["science", "physics", "cosmology", "black holes"],
      isAvailable: false,
      pages: 212
  },
  {
      title: "The Da Vinci Code",
      author: "Dan Brown",
      genre: "Mystery",
      publicationYear: 2003,
      isbn: "978-0307474278",
      rating: 4.1,
      tags: ["mystery", "thriller", "conspiracy", "symbology"],
      isAvailable: true,
      pages: 454,
      publisher: { name: "Doubleday", location: "New York" },
      description: "A gripping thriller involving symbology, secret societies, and religious history."
  },
   {
      title: "Becoming",
      author: "Michelle Obama",
      genre: "Biography",
      publicationYear: 2018,
      isbn: "978-1524763138",
      rating: 4.8,
      tags: ["biography", "memoir", "politics", "inspirational"],
      isAvailable: true,
      pages: 426,
      publisher: { name: "Crown Publishing Group" },
       description: "The memoir of the former First Lady of the United States."
  },
   {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      genre: "Mystery",
      publicationYear: 2005, // Swedish publication
      isbn: "978-0307949486",
      rating: 4.2,
      tags: ["mystery", "thriller", "crime", "nordic noir"],
      isAvailable: true,
      pages: 672,
      publisher: { name: "Norstedts Förlag", location: "Stockholm"},
      description: "A complex mystery involving a journalist and a hacker."
  }
];


const correctedBook = sampleBooks.map(book =>{
  const validGenre = ["Fiction", "Non-Fiction", "Science", "Fantasy", "Mystery"];
  if(book.genre && !validGenre.includes(book.genre)){
    console.log(`The book ${book.title} has invalid genre therefore its genre is changed into Fantasy`)
    return {...book, genre:"Fiction" as IBook["genre"]};
  }
  return book as Partial<IBook>;
})



const seedModelData = async():Promise<void> =>{

try{
  console.log(correctedBook);
  connectDB();
  console.log("Clearing all the past data!");
  await Book.deleteMany({});
  console.log("Inserting the data!");
  await Book.insertMany(correctedBook);
  console.log("All the book has been added");
}catch(err){
  throw new Error(`Error occured while inserting the data${err}`);
}finally{
  await disconnectDB();
}
} 

if(require.main == module){
  seedModelData();
}