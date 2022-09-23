import type { ProposalType, ProposalDataType, ExtensionType } from "../../types/stxeco.type";

const DaoUtils = {
  getStatus: (stacksTipHeight:number, proposal:ProposalType) => {
    const warning = '#fdad37';
    const primary = '#4B515D';
    const danger = '#dd216e';
    const info = '#4786cd';
    const success = '#64c872';
    
    let status = { name: 'unkown', color: 'primary', colorCode: primary };
    if (proposal && typeof proposal.executedAt === 'number' && proposal.executedAt > 0 && typeof proposal.emergencySignals === 'number' && proposal.emergencySignals > 0) {
      return { name: 'emergexec', color: 'success', colorCode: success }
    }
    /**
    if (typeof proposal.executedAt === 'number' && proposal.executedAt > 0) {
      clazzes = 'border-top: 1pt solid #64c872; border-left: 1pt solid #64c872; border-right: 1pt solid #64c872; color: #64c872;';
    } else if (proposal.funding > -1 && proposal.funding < fundingCost) {
		  clazzes = 'border-top: 1pt solid #fdad37; border-left: 1pt solid #fdad37; border-right: 1pt solid #fdad37; color: #fdad37;';
    } else if (proposal.funding > -1 && proposal.funding >= fundingCost) {
		  clazzes = 'border-top: 1pt solid #dd216e; border-left: 1pt solid #dd216e; border-right: 1pt solid #dd216e; color: #dd216e;';
    }

    let propStatus = 'unknown';
  if (typeof (proposal.executedAt) === 'number' && proposal.executedAt > 0) {
    propStatus = 'executed';
  } else if (proposal.deployTxId && !proposal.proposalData && proposal.contract.tx_status === 'pending') {
    propStatus = 'deploying';
  } else if (proposal.deployTxId && !proposal.proposalData && proposal.votingContract === 'ede007-snapshot-proposal-voting') {
    propStatus = 'readyToFund';
  } else if (proposal.deployTxId && !proposal.proposalData && proposal.votingContract !== 'ede007-snapshot-proposal-voting') {
    propStatus = 'readyToSubmit';
  } else if (proposal.proposalData && proposal.votingContract === 'ede001-proposal-voting') {
    propStatus = 'readyToVoteViaGovernanceToken';
  } else if (proposal.proposalData && proposal.votingContract === 'ede007-snapshot-proposal-voting') {
    propStatus = 'readyToVoteViaSnapshot';
  } else if (!proposal.proposalData && !proposal.submitTxId && proposal.deployTxId) {
    propStatus = 'readyToSubmit';
  }

    **/
    if (!proposal.proposalData) {
      if (proposal.funding > 0) {
        status = { name: 'funding', color: 'info', colorCode: info };
      } else if (proposal.submitTxId) {
        status = { name: 'submitting', color: 'primary', colorCode: primary };
      } else if (proposal.contract) {
        status = { name: 'deployed', color: 'primary', colorCode: primary };
      } else {
        status = { name: 'draft', color: 'primary', colorCode: primary };
      }
    } else {
      if (proposal.votingContract === 'ede001-proposal-voting') {
        status = { name: 'submitted', color: 'primary', colorCode: primary };
        if (stacksTipHeight < proposal.proposalData.startBlockHeight) {
          status = { name: 'commencing soon', color: 'warning', colorCode: warning };
        } else {
          status = { name: 'voting', color: 'warning', colorCode: warning };
        }
      } else if (proposal.votingContract === 'ede007-snapshot-proposal-voting') {
        status = { name: 'voting', color: 'warning', colorCode: warning };
      }
      if (proposal.proposalData.concluded) {
        if (proposal.proposalData.passed) status = { name: 'passed', color: 'success', colorCode: success };
        else status = { name: 'failed', color: 'danger', colorCode: danger };
      } else if (stacksTipHeight > proposal.proposalData.endBlockHeight) {
        status = { name: 'voting ended', color: 'warning', colorCode: warning };
      }
    }
    return status;
  },
  getVotingMessage: function (pd:ProposalDataType|undefined, stacksTipHeight:number) {
      if (!pd) return 'unknown';
      if (stacksTipHeight > pd.endBlockHeight) {
        if (pd.concluded) return 'vote concluded';
        else return 'voting ended';
      } else if (stacksTipHeight < pd.startBlockHeight) {
        return 'Voting starts in ' + (pd.startBlockHeight - stacksTipHeight) + ' blocks';
      } else {
        return (pd.endBlockHeight - stacksTipHeight) + ' blocks to go!'
      }
  },
  getMetaData: function (proposal: ProposalType) {
    // const preamble:Array<string> = [];
    let lines = proposal.contract.source_code?.split('\n');
    lines = lines?.filter((l) => l.indexOf(';;') > -1) || []
    const proposalMeta = { dao: '', title: '', author: '', synopsis: '', description: '', };
    lines.forEach((l) => {
      l = l.replace(/;;/, "");
      if (l.indexOf('DAO:') > -1) proposalMeta.dao = l.split('DAO:')[1];
      else if (l.indexOf('Title:') > -1) proposalMeta.title = l.split('Title:')[1];
      else if (l.indexOf('Author:') > -1) proposalMeta.author = l.split('Author:')[1];
      else if (l.indexOf('Synopsis:') > -1) proposalMeta.synopsis = l.split('Synopsis:')[1];
      else if (l.indexOf('Description:') > -1) proposalMeta.description = l.split('Description:')[1];
      else {
        proposalMeta.description += ' ' + l;
      }
    })
    return proposalMeta;
  },
  sortProposals: function (proposals: ProposalType[]|undefined, asc:boolean, sortField:string) {
    if (!proposals) return []
    proposals = proposals.sort(function compare (a:ProposalType, b:ProposalType) {
      let nameA = a.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      let nameB = b.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      if (sortField === 'status') {
        nameA = a.status.name.toUpperCase();
        nameB = b.status.name.toUpperCase();
      }
      if (nameA > nameB) {
        if (asc) {
          return -1;
        } else {
          return 1;
        }
      }
      if (nameA < nameB) {
        if (asc) {
          return 1;
        } else {
          return -1;
        }
      }
      // names must be equal
      return 0;
    })
    return proposals;
  },
  sortExtensions: function (extensions: ExtensionType[], asc:boolean, sortField:string) {
    if (!extensions) return []
    extensions = extensions.sort(function compare (a:ExtensionType, b:ExtensionType) {
      let nameA = a.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      let nameB = b.contractId.split('.')[1].toUpperCase() // ignore upper and lowercase
      if (sortField === 'status') {
        nameA = (a.valid) ? 'active' : 'inactive';
        nameB = (b.valid) ? 'active' : 'inactive';               
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
    return extensions;
  }
}
export default DaoUtils
