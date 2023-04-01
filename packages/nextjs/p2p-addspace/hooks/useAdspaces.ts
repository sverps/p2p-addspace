import { useEffect, useState } from "react";
import contracts from "../../generated/hardhat_contracts";
import { Dimensions } from "../components/DimensionsInfo";
import { BigNumber } from "ethers";
import { useContract, useProvider } from "wagmi";

const adspaceContract = contracts[31337][0].contracts.AdspaceMarketplace;

export type Adspace = {
  owner: string;
  websiteUrl: string;
  dimensions: Dimensions;
  restrictions: string;
  bidIndex: BigNumber;
};

export const useAdspaces = () => {
  const provider = useProvider();
  const contract = useContract({
    address: adspaceContract.address,
    abi: adspaceContract.abi,
    signerOrProvider: provider,
  });
  const [adspaces, setAdspaces] = useState<Adspace[]>();

  useEffect(() => {
    (async function getAdspaces() {
      if (!contract) {
        return;
      }
      console.log({ contract });

      const adspaceIndex = await contract.adspaceIndex();
      console.log({ adspaceIndex });
      if (!adspaceIndex) {
        return;
      }

      const result = await Promise.all(
        Array.from({ length: adspaceIndex.toNumber() }).map((_, index) =>
          contract.getAdspaceFromIndex(BigNumber.from(index)),
        ),
      );
      console.log({ result });

      setAdspaces(
        result.map(adsp => {
          const dimensionsArray = adsp.dimensions.split(":").map(v => parseInt(v));
          return { ...adsp, dimensions: { x: dimensionsArray[0], y: dimensionsArray[1] } };
        }),
      );
    })();
  }, [contract]);

  return { data: adspaces, loading: !adspaces } as
    | { data: undefined; loading: true }
    | { data: Adspace[]; loading: false };
};