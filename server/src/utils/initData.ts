import { Book } from "../entity/Book.entity";
import { Member } from "../entity/Member.entity";
import { BooksData } from "../sampleData/Book.data";
import { MembersData } from "../sampleData/Member.data";

export const initData = async () => {
  console.log("Checking database data...");

  //insert books data from sample data
  const books = await Book.find();
  if (books.length == 0) {
    console.log("Book database is empty! \nAdding from sample data...");
    BooksData.forEach(async (e) => {
      const book = Object.assign(new Book(), e);
      await Book.save(book);
    });
    console.log("Book database is ready!");
  }

  //insert members data from sample data
  const members = await Member.find();
  if (members.length == 0) {
    console.log("Member database is empty! \nAdding from sample data...");
    MembersData.forEach(async (e) => {
      const member = Object.assign(new Member(), e);
      await member.save();
    });
    console.log("Member database is ready!");
  }
};
