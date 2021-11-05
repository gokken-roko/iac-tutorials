import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

interface argoProps {
  namespace?: string;
}

export class Argo extends pulumi.ComponentResource {
  public helmUrn: pulumi.Output<string>;

  constructor(
    name: string,
    props: argoProps,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("kubernetes:helm:argo", name, {}, opts);

    const n = props.namespace || "argo";
    const argoNamaspace = new k8s.core.v1.Namespace(
      n,
      {
        metadata: { name: n },
      },
      opts
    );

    const argocd = new k8s.helm.v3.Chart(
      "argo-cd",
      {
        chart: "argo-cd",
        version: "3.26.2",
        namespace: argoNamaspace.metadata.name,
        fetchOpts: {
            repo: "https://argoproj.github.io/argo-helm"
        },
        values: {
          server: {
            config: {
              url: "http://localhost:8080"
            },
          },
        },
      },
      opts
    );

    this.helmUrn = argocd.urn;
    this.registerOutputs();
  }
}
