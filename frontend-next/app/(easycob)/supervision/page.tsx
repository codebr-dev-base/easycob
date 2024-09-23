import ContainerCampaign from "./components/ContainerCampaign";
import { fetchCampaign } from "./service/campaigns";

export default async function Supervision() {
  const result = await fetchCampaign();
  return <ContainerCampaign campaigns={result}/>;
}
