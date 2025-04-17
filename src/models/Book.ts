import mongoose, {Schema} from "mongoose";


export interface IBook {
  title:string;
  author:string;
  genre:"Fiction"|"Non-Fiction" | "Science"| "Fantasy" | "Mystery";
  publicationYear:number;
  isbn:string;
  rating:number;
  tags:string[];
  isAvailable:boolean;
  pages:number;
  publisher?:{
    name:string;
    location?:string;
  };
  description:string;
};



export const bookSchema:Schema = new Schema({
  title:{
    type:String,
    required:true,
    index:true
  },
  author:{
    type:String,
    required:true,
    index:true
  },
  genre:{
    type:String,
    required:true,
    emun:["Fiction","Non-Fiction","Science", "Fantasy", "Mystery"]
  },
  publicationYear:{
    type:Number,
    required:true
  },
  isbn:{
    type:String
  },
  rating:{
    type:Number
  },
  tags:{
    type:[String]
  },
  isAvailable:{
    type:Boolean,
    default:false
  },
  pages:{
    type:Number
  },
  publisher:{
    type:{
      name:{
        type:String,
        required:true
      },
      location:{
        type:String,
        required:false
      }
    }
  },
  description:{
    type:String
  }
},{
  timestamps:true
})


bookSchema.index({genre:1, rating:-1});
bookSchema.index({title:"text",description:"text" })

const Book =  mongoose.model<IBook>("Book", bookSchema)

export default Book;