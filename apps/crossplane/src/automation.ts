import {
  InlineProgramArgs,
  LocalProgramArgs,
  LocalWorkspace,
  OpMap,
  OutputMap,
} from "@pulumi/pulumi/automation";
import { PulumiProgram } from "./pulumiprogram";

// https://github.com/pulumi/automation-api-examples/blob/main/nodejs/localProgram-tsnode-mochatests/automation.ts
const args: InlineProgramArgs = {
  stackName: "crossplane-dev",
  projectName: "crossplane",
  program: PulumiProgram,
};
export const Deploy = async (): Promise<OutputMap> => {
  console.log("Initializing stack...");
  const stack = await LocalWorkspace.createOrSelectStack(args);

  console.log("Run update...");
  const up = await stack.up({ onOutput: console.log });

  return up.outputs;
};

export const Preview = async (): Promise<OpMap> => {
  console.log("Initializing stack...");
  const stack = await LocalWorkspace.createOrSelectStack(args);

  console.log("[Preview] Run update...");
  const up = await stack.preview({ onOutput: console.log });

  return up.changeSummary;
};

export default { Deploy, Preview };
