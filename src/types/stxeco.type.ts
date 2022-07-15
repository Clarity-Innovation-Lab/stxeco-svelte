export type IssueType = {
  htmlUrl: string | null | undefined;
  createdAt: number;
  title: string;
  labels: Array<string>;
  state: string;
  pullRequest: boolean;
  comments: Array<string>;
};
export type ProposalType = {
  title: string;
  contractId: string;
  created: number;
  proposer: Array<string>;
  status: string;
};
