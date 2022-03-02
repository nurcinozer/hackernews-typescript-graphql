import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.list.nonNull.field("links", {
      // The links field is a non-nullable array of Link type objects. It represents all the links that have been posted by that particular user.
      type: "Link",
      resolve(parent, args, context) {
        // The links field needs to implement a resolve function. Previously, you only needed to implement resolvers for fields in Query and Mutation. Since the resolver for the links field is non-trivial, meaning GraphQL can’t infer it automatically as the User object returned from your database does not automatically contain the links type. So unlike the other fields in the User type, you need to explcitly define the links resolver.
        return context.prisma.user // This is the Prisma query that returns the associated user.links for a certain user from your database. You are using the parent argument which contains the all the fields of the user that you are trying to resolve. Using the parent.id you can fetch the appropriate user record from your database and return the relevant links by chaining in the links() call.
          .findUnique({ where: { id: parent.id } })
          .links();
      },
    });
  },
});
