import { extendType, nonNull, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  // objectType is used to create a new type in your GraphQL schema. Let’s dig into the syntax:
  name: "Link", // 1 The name option defines the name of the type
  definition(t) {
    // 2 Inside the definition, you can add different fields that get added to the type
    t.nonNull.int("id"); // 3 This adds a field named id of type Int
    t.nonNull.string("description"); // 4 This adds a field named description of type String
    t.nonNull.string("url"); // 5 This adds a field named url of type String
    t.field("postedBy", { // You are adding a postedBy field of type User. Notice this field does not have a nonNull attached, meaning it is an optional field (it can return null).
      type: "User",
      resolve(parent, args, context) { // The implementaiton of the resolver for postedBy should feel familiar, as it is very similar to what you did for the links field in User. In the query, you are fetching the link record first using findUnique({ where: { id: parent.id } }) and then the associated user relation who posted the link by chaining postedBy().
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
  },
});

export const LinkQuery = extendType({
  // 2 You are extending the Query root type and adding a new root field to it called feed.
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      // 3 You define the return type of the feed query as a not nullable array of link type objects (In the SDL the return type will look like this: [Link!]!).
      type: "Link",
      resolve(parent, args, context, info) {
        // 4 resolve is the name of the resolver function of the feed query. A resolver is the implementation for a GraphQL field. Every field on each type (including the root types) has a resolver function which is executed to get the return value when fetching that type. For now, our resolver implementation is very simple, it just returns the links array. The resolve function has four arguments, parent, args, context and info. We will get to these later.
        // return links;
        return context.prisma.link.findMany(); // You find and return all the Link records in your database. To do this you are using the PrismaClient instance available through context.prisma.
      },
    });
  },
});

// You’re defining a new Link type that represents the links that can be posted to Hacker News. Each Link has an id, a description, and a url.

export const LinkMutation = extendType({
  // 1 You’re extending the Mutation type to add a new root field. You did something similar in the last chapter with the Query type.
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      // 2 The name of the mutation is defined as post and it returns a (non nullable) link object.
      type: "Link",
      args: {
        // 3 Here you define the arguments to your mutation. You can pass arguments to your GraphQL API endpoints (just like in REST). In this case, the two arguments you need to pass are description and url. Both arguments mandatory (hence the nonNull()) because both are needed to create a new link.
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        // const { description, url } = args; // 4 You’re now using the second argument that’s passed into all resolver functions: args. 💡 It carries the arguments for the operation – in this case the url and description of the link to be created.

        // let idCount = links.length + 1; // 5 idCount serves as a very rudimentary way to generate new id values for our link objects. Finally, you add your new link object to the links array and return the newly created object.
        // const link = {
        //   id: idCount,
        //   description: description,
        //   url: url,
        // };
        // links.push(link);
        // return link;
        const newLink = context.prisma.link.create({
          // Similar to the feed resolver, you’re simply invoking a function on the PrismaClient instance. You’re calling the create method on the Link model from your Prisma Client API. As arguments, you’re passing the data that the resolvers receive via the args parameter.
          data: {
            description: args.description,
            url: args.url,
          },
        });
        return newLink;
      },
    });
  },
});
