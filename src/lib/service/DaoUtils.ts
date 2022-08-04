import type { ProposalType, ExtensionType } from "../../types/stxeco.type";

const DaoUtils = {
  getStatus: (stacksTipHeight:number, proposal:ProposalType) => {
    let message = 'unkown';
    // if (proposal.executedAt) return 'executed'
    if (proposal.emergencySignals > 0) {
      return 'emergexec'
    }
    if (!proposal.proposalData) {
      if (proposal.funding > 0) {
        message = 'funding';
      } else if (proposal.contract) {
        message = 'deployed';
      } else if (proposal.submitTxId) {
        message = 'submitting';
      } else {
        message = 'draft';
      }
    } else {
      if (proposal.votingContract === 'ede001-proposal-voting') {
        message = 'submitted';
        if (stacksTipHeight < proposal.proposalData.startBlockHeight) {
          message = 'commencing soon'; // 'Starts in ' + (proposal.proposalData.startBlockHeight - stacksTipHeight) + ' blocks.'
        } else {
          message = 'voting';
        }
      } else if (proposal.votingContract === 'ede007-snapshot-proposal-voting') {
        message = 'funded';
      }
      if (proposal.proposalData.concluded) {
        if (proposal.proposalData.passed) message = 'passed';
        else message = 'failed';
      } else if (stacksTipHeight > proposal.proposalData.endBlockHeight) {
        message = 'voting ended';
      }
    }
    return message;
  },
  sortProposals: function (proposals: ProposalType[], asc:boolean, sortField:string) {
    if (!proposals) return []
    proposals = proposals.sort(function compare (a:ProposalType, b:ProposalType) {
      let nameA = a.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      let nameB = b.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      if (sortField === 'status') {
        nameA = a.status.toUpperCase()
        nameB = b.status.toUpperCase()
      }
      if (nameA > nameB) {
        if (asc) {
          return -1;
        } else {
          return 1
        }
      }
      if (nameA < nameB) {
        if (asc) {
          return 1;
        } else {
          return -1
        }
      }
      // names must be equal
      return 0
    })
    return proposals
  },
  sortExtensions: function (proposals: ExtensionType[], asc:boolean) {
    if (!proposals) return []
    proposals = proposals.sort(function compare (a:ExtensionType, b:ExtensionType) {
      const nameA = a.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      const nameB = b.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      if (nameA > nameB) {
        if (asc) {
          return -1;
        } else {
          return 1
        }
      }
      if (nameA < nameB) {
        if (asc) {
          return 1;
        } else {
          return -1
        }
      }
      // names must be equal
      return 0
    })
    return proposals
  }
}
export default DaoUtils
