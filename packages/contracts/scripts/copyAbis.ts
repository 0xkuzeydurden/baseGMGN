import { promises as fs } from "fs";
import path from "path";

const contracts = [
  {
    name: "GMGN",
    artifact: path.join("GMGN.sol", "GMGN.json")
  },
  {
    name: "ERC20Mintable",
    artifact: path.join("ERC20Mintable.sol", "ERC20Mintable.json")
  }
];

async function main() {
  const artifactsDir = path.resolve(__dirname, "..", "artifacts", "contracts");
  const targetDir = path.resolve(__dirname, "../../web/lib/abis");

  await fs.mkdir(targetDir, { recursive: true });

  await Promise.all(
    contracts.map(async ({ name, artifact }) => {
      const artifactPath = path.join(artifactsDir, artifact);
      const artifactJson = JSON.parse(await fs.readFile(artifactPath, "utf8"));

      const payload = {
        abi: artifactJson.abi,
        bytecode: artifactJson.bytecode
      };

      const outputPath = path.join(targetDir, `${name}.json`);
      await fs.writeFile(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
    })
  );
}

main().catch((error) => {
  console.error("Failed to copy ABIs", error);
  process.exitCode = 1;
});
