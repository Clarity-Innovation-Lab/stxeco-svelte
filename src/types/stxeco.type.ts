export type SettingsType = {
  proposals: Array<ProposalType>;
  issues: Array<IssueType>;
  daoProperties: Array<DaoPropertyType>;
};
export type UserPropertyType = {
  id: string | null | undefined;
  stxAddress: string;
  value: any;
  contractName: string;
  functionName: string;
};
export type DaoPropertyType = {
  id: string | null | undefined;
  value: number;
  contractName: string;
  functionName: string;
};
export type IssueType = {
  htmlUrl: string | null | undefined;
  createdAt: number;
  title: string;
  labels: Array<string>;
  state: string;
  pullRequest: boolean;
  comments: Array<string>;
};
export type Contract = {
  tx_id: string | null | undefined;
  source_code: string;
  block_height: number;
  contract_id: string;
};
export type ProposalType = {
  title: string;
  contractId: string;
  created: number;
  proposer: Array<string>;
  status: string;
  contract:Contract
};
