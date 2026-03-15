{
  description = "Flake utils demo";

  inputs.nixpkgs.url = "github:nixos/nixpkgs";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.agents.url = "path:///home/xeal/dev/agents";

  outputs = { self, nixpkgs, flake-utils, agents }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShells.default = pkgs.mkShellNoCC {
          packages = [
            (agents.lib.makeJailedOpencode { })
          ];
        };
      }
    );
}
