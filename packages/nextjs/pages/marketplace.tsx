import { useState } from "react";
import type { NextPage } from "next";
import { ContentSpace } from "~~/p2p-addspace/components/ContentSpace";
import { Page } from "~~/p2p-addspace/components/Page";
import { Pane } from "~~/p2p-addspace/components/Pane";
import { PlaceBidModal } from "~~/p2p-addspace/components/PlaceBidModal";
import { useAdspaces } from "~~/p2p-addspace/hooks/useAdspaces";

const Marketplace: NextPage = () => {
  const [contentSpaceIndex, setContentSpaceIndex] = useState<number>();
  const { data: adspaces, loading } = useAdspaces();

  return (
    <Page>
      <Pane className="gap-0 py-4 divide-y divide-base-300">
        {loading
          ? "Loading..."
          : adspaces.map(({ websiteUrl, dimensions }, index) => (
              <ContentSpace
                key={`${websiteUrl}-${index}`}
                data={{ dimensions, url: websiteUrl, costPerClick: 4 }}
                onInitiateBid={() => setContentSpaceIndex(index)}
              />
            ))}
      </Pane>
      <PlaceBidModal contentSpaceIndex={contentSpaceIndex} onClose={() => setContentSpaceIndex(undefined)} />
    </Page>
  );
};

export default Marketplace;