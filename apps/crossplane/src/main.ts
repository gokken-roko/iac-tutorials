import { Preview } from "./automation";

Preview().catch((error) => {
  console.log(error);
  process.exit(1);
});
