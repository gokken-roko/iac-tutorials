import { Crossplane } from "./services/crossplane";

export const PulumiProgram = async () => {
  const crossplane = new Crossplane("crossplane");

  return {
    crossplaneUrl: crossplane.helmUrn,
  };
};
