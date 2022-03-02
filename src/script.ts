// 1 Import the PrismaClient constructor from the @prisma/client node module.
import { PrismaClient } from "@prisma/client";

// 2 Instantiate PrismaClient.
const prisma = new PrismaClient();

// 3 Define an async function called main to send queries to the database. You will write all your queries inside this function. You are calling the findMany() query, which will return all the link records that exist in the database.
async function main() {
  const allLinks = await prisma.link.findMany();

  const newLink = await prisma.link.create({
      data: {
          description: "my blog",
          url: "https://nurcin.co"
      }
  })
  console.log(allLinks);
}

// 4 Call the main function.
main()
  .catch((e) => {
    throw e;
  })
  // 5 Close the database connections when the script terminates.
  .finally(async () => {
    await prisma.$disconnect();
  });
