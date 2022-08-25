import { Preview, Deploy } from "./automation";

const args = process.argv.slice(2)
console.log("Option: ", args[0])

switch (args[0]) {
  case "preview":
    console.log("Preview...")
    Preview().catch((error) => {
      console.log(error);
      process.exit(1);
    });
    break;
  default:
    Deploy().catch((error) => {
      console.log(error);
      process.exit(1);
    });
}
