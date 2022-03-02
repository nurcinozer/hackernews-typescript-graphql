import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql"; // 1 You are importing the graphql model which exports the Link object type through index.ts. The import is named types.

export const schema = makeSchema({
  types, // 2 You are passing types to the makeSchema function. Nexus will do its thing to generate the SDL from this.
  outputs: {
    typegen: join(process.cwd(), "nexus-typegen.ts"),
    schema: join(process.cwd(), "schema.graphql"),
  },
  contextType: {
    module: join(process.cwd(), "./src/context.ts"), // 1 Path to the file (also sometimes called a module) where the context interface (or type) is exported.
    export: "Context", // 2 Name of the exported interface in that module.
  },
});
