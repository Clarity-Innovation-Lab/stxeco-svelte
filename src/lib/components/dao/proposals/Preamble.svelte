<script lang="ts">
import DaoUtils from '$lib/service/DaoUtils';
import type { ProposalType } from "../../../../types/stxeco.type";

export let proposal:ProposalType;
const proposalMeta = DaoUtils.getMetaData(proposal);
const color = proposal.status.color;
</script>

<div class="container">
	<div class="col-12 p-4">
		<div class="row">
			<div class="cols-12 box">
				<div class="row mx-0 mb-2">
					<h4 class={'m-0 px-0 text-info'} style="position: relative; top: 0px; left: -35px;" >
						<img style="position: relative; top: -20px; left: 0px;" src="/img/png-assets/stx_eco_directional_arrow.png" alt="Scroll down" width="15px" height="auto" />
						PROPOSAL OVERVIEW</h4>
				</div>
				<div class="row">
					<div class={'col-4 border-info'}><p class={'text-info'}>DAO</p></div>
					<div class={'col-8 border-info'}><p class="text-white">{proposalMeta.dao}</p></div>
					<div class={'col-4 border-info'}><p class={'text-info'}>Title</p></div>
					<div class={'col-8 border-info'}><p class="text-white">{proposalMeta.title}</p></div>
					<div class={'col-4 border-info'}><p class={'text-info'}>Author</p></div>
					<div class={'col-8 border-info'}><p class="text-white">{proposalMeta.author}</p></div>
				</div>
				<div class="row mt-4">
					<div class={'col-4 border-info'}><p class={'text-info'}>Synopsis</p></div>
					<div class={'col-12 py-1 border-info'}><p class="text-white">{proposalMeta.synopsis}</p></div>
				</div>
				<div class="row mt-4">
					<div class={'col-4 border-info'}><p class={'text-info'}>Description</p></div>
					<div class={'col-12 py-1 border-info'}><p class="text-white">{proposalMeta.description}</p></div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
p {
	font-family: Gilroy-Light;
	padding: 3px;
	margin: 0 !important;
	font-size: 1.0rem;
	padding: 5px 0;
}
/**
.border-yellow {
	border: 1pt solid #fdad37;
}
.border-primary {
	border: 1pt solid #4B515D;
}
.border-info {
	border: 1pt solid #4786cd;
}
.border-success {
	border: 1pt solid #64c872;
}
.border-danger {
	border: 1pt solid #dd216e;
}
**/
</style>
