import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);

// add simple get route
http.route({
  path: "/hello",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    console.log(ctx, request);

    return new Response("Hello, World!", {
      status: 200,
    });
  }),
});

export default http;
