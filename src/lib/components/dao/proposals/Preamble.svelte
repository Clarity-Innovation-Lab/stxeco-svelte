<script lang="ts">
import DaoUtils from '$lib/service/DaoUtils';
import type { ProposalType } from "../../../../types/stxeco.type";

export let proposal:ProposalType;
</script>

<div class="preamble my-4">
	<div class="py-2 px-4">
	<p class="my-0 py-0">{@html DaoUtils.getMetaData(proposal)}</p>
	</div>
</div>

<style>
.preamble {
	width: 60%;
	background: #4f5997;
	margin: 10px auto;
	padding: 10px;
	text-align: left;
	border-radius: 10px;
	color: #fff;
}
</style>
