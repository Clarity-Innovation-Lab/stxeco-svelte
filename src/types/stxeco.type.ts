export type SettingsType = {
  extensions: any;
  proposals?: Array<ProposalType>;
  issues?: Array<IssueType>;
  daoProperties?: Array<DaoPropertyType>;
  userProperties?: Array<UserPropertyType>;
  accountInfo?: any;
  info?: any;
};
export type ProfileType = {
  loggedIn: boolean;
  stxAddress: string | undefined;
};
export type ExtensionType = {
  contractId: string;
  valid: boolean;
  contract:Contract;
};
export type UserPropertyType = {
  id: string | null | undefined;
  stxAddress: string;
  value: {
    value: string|number;
  };
  contractName: string;
  functionName: string;
};
export type DaoPropertyType = {
  id: string | null | undefined;
  value: string | number;
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
  tx_id?: string | null | undefined;
  source_code?: string;
  block_height?: number;
  contract_id?: string;
};
export type ProposalDataType = {
  votesFor: number;
  votesAgainst: number;
  proposer: string;
  startBlockHeight: number;
  endBlockHeight: number;
  concluded: boolean;
  passed: boolean;
};
export type ProposalType = {
  deployTxId?: string|null;
  submitTxId?: string|null;
  title: string;
  contractId: string;
  votingContract: string;
  created: number;
  updated: number;
  funding: number;
  emergencySignals: number;
  executedAt: number;
  proposer: string|null;
  status: string;
  contract:Contract;
  proposalData?:ProposalDataType;
  githubIssue?: string;
  githubPullRequest?: string;
  description?: string;
  startHeight?:number;
};
