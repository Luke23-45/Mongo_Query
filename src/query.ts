// src/query.ts
import Book, { IBook } from './models/Book';
import { connectDB,disconnectDB } from './db';

const printResults = (description: string, result: any) => {
    console.log(`\n--- ${description} ---`);
    if (Array.isArray(result)) {
        console.log(`Found ${result.length} items:`);
        console.log(JSON.stringify(result.slice(0, 5), null, 2));
        if (result.length > 5) console.log('... more items exist');
    } else if (result && typeof result === 'object' && result.acknowledged !== undefined) {
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log(JSON.stringify(result, null, 2));
    }
    console.log(`--- End ${description} ---`);
};

export const runAllQueries = async () => {

  try{

  
    console.log('\n>>> Starting Mongoose Query Practice <<<');

    // Basic Find Operations

    // Find all books
    await connectDB();
    const allBooks = await Book.find();
    printResults("Find All Books", allBooks);

    // Find one book (the first match) by author
    const oneByAuthor = await Book.findOne({ author: "Jane Austen" });
    printResults("Find One Book by Author 'Jane Austen'", oneByAuthor);

    // Find book by ID (replace with an actual ID after seeding)
    const bookToFind = await Book.findOne({ title: "The Hobbit" });
    if (bookToFind) {
        const byId = await Book.findById(bookToFind._id);
        printResults(`Find Book by ID (${bookToFind._id})`, byId);
    } else {
         console.log("\n--- Could not find 'The Hobbit' to test findById ---")
    }

    // Querying with Comparison Operators 

    // Find books published after 1950 ($gt)
    const booksAfter1950 = await Book.find({ publicationYear: { $gt: 1950 } });
    printResults("Books Published After 1950 ($gt)", booksAfter1950);

    // Find books with rating 4.5 or higher ($gte)
    const highRatedBooks = await Book.find({ rating: { $gte: 4.5 } });
    printResults("Books with Rating >= 4.5 ($gte)", highRatedBooks);

    // Find books with 300 pages or fewer ($lte)
    const shortBooks = await Book.find({ pages: { $lte: 300 } });
    printResults("Books with <= 300 Pages ($lte)", shortBooks);

    // Find books NOT authored by Jane Austen ($ne)
    const notAusten = await Book.find({ author: { $ne: "Jane Austen" } });
    printResults("Books Not by Jane Austen ($ne)", notAusten);

    // Find books with genre 'Science' or 'Fantasy' ($in)
    const scienceOrFantasy = await Book.find({ genre: { $in: ['Science', 'Fantasy'] } });
    printResults("Books in 'Science' or 'Fantasy' Genre ($in)", scienceOrFantasy);

    // Find books NOT in 'Fiction' or 'Mystery' genre ($nin)
    const notFictionOrMystery = await Book.find({ genre: { $nin: ['Fiction', 'Mystery'] } });
    printResults("Books Not in 'Fiction' or 'Mystery' ($nin)", notFictionOrMystery);

    // Querying with Logical Operators

    // Find 'Fiction' books published after 1900 ($and implicitly)
    const fictionAfter1900 = await Book.find({ genre: 'Fiction', publicationYear: { $gt: 1900 } });
    printResults("Fiction Books Published After 1900 (Implicit $and)", fictionAfter1900);

    // Explicit $and (same as above)
    const fictionAfter1900Explicit = await Book.find({
        $and: [
            { genre: 'Fiction' },
            { publicationYear: { $gt: 1900 } }
        ]
    });
    printResults("Fiction Books Published After 1900 (Explicit $and)", fictionAfter1900Explicit);

    // Find books that are either 'Science' genre OR have rating > 4.7 ($or)
    const scienceOrHighlyRated = await Book.find({
        $or: [
            { genre: 'Science' },
            { rating: { $gt: 4.7 } }
        ]
    });
    printResults("Books: Genre 'Science' OR Rating > 4.7 ($or)", scienceOrHighlyRated);

    // Find books that are NOT 'Fantasy' genre ($not operator on field)
    const notFantasy = await Book.find({ genre: { $not: { $eq: 'Fantasy' } } }); // $not needs an operator like $eq
    printResults("Books NOT 'Fantasy' Genre ($not)", notFantasy);

    // Find books that are neither 'Fiction' nor 'Mystery' ($nor)
    const neitherFictionNorMystery = await Book.find({
      $nor: [
          { genre: 'Fiction' },
          { genre: 'Mystery'}
      ]
    })
    printResults("Books: Neither 'Fiction' NOR 'Mystery' ($nor)", neitherFictionNorMystery)


    // Querying with Element Operators 

    // Find books where the publisher field exists ($exists)
    const booksWithPublisher = await Book.find({ publisher: { $exists: true } });
    printResults("Books Where Publisher Field Exists ($exists: true)", booksWithPublisher);

     // Find books where the publisher.location field does NOT exist ($exists within embedded)
    const booksWithoutPublisherLocation = await Book.find({ 'publisher.location': { $exists: false } });
    printResults("Books Where publisher.location Field Does Not Exist ($exists: false)", booksWithoutPublisherLocation);

    // Find books where 'tags' field is an array ($type)
    const booksWithTagsArray = await Book.find({ tags: { $type: 'array' } });
    printResults("Books Where 'tags' Field is an Array ($type)", booksWithTagsArray);


    // Querying with Evaluation Operators

    // Find books with 'classic' in the title (case-insensitive regex) ($regex)
    const classicTitleBooks = await Book.find({ title: { $regex: /classic/i } });
    printResults("Books with 'classic' in Title ($regex, case-insensitive)", classicTitleBooks);

     try {
        const textSearchResult = await Book.find(
            { $text: { $search: "history universe exploration" } }, // Search terms
            { score: { $meta: "textScore" } } // Project the relevance score
        )
        .sort({ score: { $meta: "textScore" } }) // Sort by relevance
        ;
        printResults("Text Search for 'history universe exploration' ($text)", textSearchResult);
    } catch (error: any) {
         console.error("\n--- Text Search Error ---")
         console.error("Ensure you have run the seed script and a text index exists on 'title' and 'description'. Error:", error.message)
         console.log("--- End Text Search Error ---")
    }


    // Find books tagged with 'sci-fi' (exact match in array)
    const scifiTaggedBooks = await Book.find({ tags: 'sci-fi' }); // Simple query works for direct element match
    printResults("Books Tagged 'sci-fi'", scifiTaggedBooks);

    // Find books tagged with BOTH 'classic' AND 'adventure' ($all)
    const classicAdventureBooks = await Book.find({ tags: { $all: ['classic', 'adventure'] } });
    printResults("Books Tagged 'classic' AND 'adventure' ($all)", classicAdventureBooks);

    // Find books tagged with EITHER 'history' OR 'comedy' ($in - works on array elements too)
    const historyOrComedyBooks = await Book.find({ tags: { $in: ['history', 'comedy'] } });
    printResults("Books Tagged 'history' OR 'comedy' ($in)", historyOrComedyBooks);

    // Find books with exactly 3 tags ($size)
    const threeTagsBooks = await Book.find({ tags: { $size: 3 } });
    printResults("Books with Exactly 3 Tags ($size)", threeTagsBooks);


    //  Querying Embedded Documents

    const panBooks = await Book.find({ 'publisher.name': 'Pan Books' });
    printResults("Books Published by 'Pan Books' (Dot Notation)", panBooks);

    // Find books published in 'London'
    const londonPublished = await Book.find({ 'publisher.location': 'London' });
    printResults("Books Published in 'London'", londonPublished);

    //  Projection (Selecting Specific Fields) 
    // Get only title and author for all books
    const titlesAndAuthors = await Book.find({}, 'title author -_id') 
        ;
    printResults("Get Only Title and Author (Projection)", titlesAndAuthors);

    // Sorting

    // Get all books sorted by publication year ascending
    const sortedByYearAsc = await Book.find().sort({ publicationYear: 1 }); 
    printResults("Books Sorted by Publication Year Ascending", sortedByYearAsc);

    const sortedByRatingDescTitleAsc = await Book.find().sort({ rating: -1, title: 1 });
    printResults("Books Sorted by Rating Desc, Title Asc", sortedByRatingDescTitleAsc);

    //  10. Pagination 

    const page2Limit2 = await Book.find()
        .sort({ title: 1 })
        .skip(2) // Skip the first 2
        .limit(2) // Limit to 2 results
        ;
    printResults("Pagination: Get 3rd and 4th Books (Sorted by Title)", page2Limit2);

    //  Counting Documents 

    // Count total number of books
    const totalCount = await Book.countDocuments();
    printResults("Total Number of Books (countDocuments)", { count: totalCount });

    // Count number of 'Fiction' books
    const fictionCount = await Book.countDocuments({ genre: 'Fiction' });
    printResults("Number of Fiction Books", { count: fictionCount });

     // Estimated count (faster, less precise, uses metadata)
    const estimatedCount = await Book.estimatedDocumentCount();
    printResults("Estimated Total Books (estimatedDocumentCount)", { estimatedCount: estimatedCount });

    // Update Operations (Using Queries) 

    // Update the first book found with title '1984' to be available (updateOne)
    const updateOneResult = await Book.updateOne(
        { title: '1984' },
        { $set: { isAvailable: true, rating: 4.4 } } 
    );
    printResults("Update '1984' to isAvailable: true (updateOne)", updateOneResult);
    // Verify update
    const updated1984 = await Book.findOne({ title: '1984'}).select('title isAvailable rating')
    printResults("Verify '1984' update", updated1984)


    // Add a 'bestseller' tag to all books with rating >= 4.7 (updateMany)
    const updateManyResult = await Book.updateMany(
        { rating: { $gte: 4.7 } },
        { $addToSet: { tags: 'bestseller' } } 
    );
    printResults("Add 'bestseller' tag to Books with Rating >= 4.7 (updateMany)", updateManyResult);
    // Verify update
    const bestsellers = await Book.find({tags: 'bestseller'}).select('title rating tags')
    printResults("Verify 'bestseller' tag addition", bestsellers)

    // Find a 'Science' book and update its rating, returning the *new* document (findOneAndUpdate)
    const findAndUpdateResult = await Book.findOneAndUpdate(
        { genre: 'Science' }, // criteria
        { $inc: { rating: -0.1 } }, // Increment (or decrement) rating
        { new: true, sort: { publicationYear: 1 } } 
    );
    printResults("Find oldest Science book, decrement rating, return new doc (findOneAndUpdate)", findAndUpdateResult);

    //  Delete Operations (Using Queries)

    const deleteOneResult = await Book.deleteOne({ publicationYear: { $lt: 1900 } });
    printResults("Delete One Book Published Before 1900 (deleteOne)", deleteOneResult);

    const deleteManyResult = await Book.deleteMany({ tags: 'cult classic' });
    printResults("Delete All Books Tagged 'cult classic' (deleteMany)", deleteManyResult);


    // Basic Aggregation Framework Examples 

    // Count books per genre
    const booksPerGenre = await Book.aggregate([
        { $match: { isAvailable: true } }, 
        { $group: { _id: "$genre", count: { $sum: 1 } } }, 
        { $sort: { count: -1 } } 
    ]);
    printResults("Aggregation: Count Books per Genre (Available Only)", booksPerGenre);

    const avgRatingAfter2000 = await Book.aggregate([
        { $match: { publicationYear: { $gt: 2000 } } },
        { $group: {
            _id: null, 
            averageRating: { $avg: "$rating" },
            totalBooks: { $sum: 1 }
         }},
         { $project: {
             _id: 0, 
             description: "Average Rating for Books Published After 2000",
             avgRating: "$averageRating", 
             numberOfBooks: "$totalBooks" 
             }
         }
    ]);
    printResults("Aggregation: Average Rating for Books Published After 2000", avgRatingAfter2000);

     const prolificAuthors = await Book.aggregate([
        { $group: { _id: "$author", bookCount: { $sum: 1 } } },
        { $match: { bookCount: { $gt: 1 } } }, 
        { $project: { _id: 0, author: "$_id", numberOfBooks: "$bookCount" }}, // Reshape output
        { $sort: { numberOfBooks: -1 } }
    ]);
    printResults("Aggregation: Authors with More Than One Book", prolificAuthors);
    console.log('\n>>> Mongoose Query Practice Completed <<<');
  }catch(err){
    throw new Error(`Error occured ${err}`);
  }finally{
    disconnectDB();
  }
};