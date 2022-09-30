<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { ExtensionType } from "../../../../types/stxeco.type";

let dispatch = createEventDispatcher();

export let extension:ExtensionType;
export let status = { name: 'active', color: 'info', colorCode: '#4786cd' };
if (!extension.valid) {
	status = { name: 'inactive', color: 'primary', colorCode: '#4B515D' };
}
const openSesame = () => {
	dispatch('openSourceModal', extension)
}
const explorerUrl = () => {
	return import.meta.env.VITE_STACKS_EXPLORER + '/txid/' + extension.contractId + '?chain=' + import.meta.env.VITE_NETWORK;
}
const statusStyle = () => {
    let clazzes = 'border-top: 1pt solid ' + status.colorCode + '; border-left: 1pt solid ' + status.colorCode + '; border-right: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}

const actionStyle = () => {
    let clazzes = 'border-top: 1pt solid ' + status.colorCode + '; border-left: 1pt solid ' + status.colorCode + '; border-bottom: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}

const actionRightStyle = () => {
    let clazzes = 'border: 1pt solid ' + status.colorCode + ';';
    return clazzes;
}
const headerStyle = () => {
    let clazzes = 'upper text-' + status.color;
    return clazzes;
}

</script>

<div class="box">
	<div class="row">
		<div class="col-1">
		  <img style="position: relative; top: -20px; left: 15px;" src="/img/svg-assets/stx_eco_directional_arrow.svg" alt="Scroll down" width="15" height="auto" />
		</div>
		<div class="col-11">
				<div class="row">
					<div class="cols-12">
						<h2 class={headerStyle()}>{extension.contractId.split('.')[1]}</h2>
					</div>
				</div>
				<div class="row">
					<div class="cols-12">
						<p  class="p-2" style={statusStyle()}>
							{status.name}
						</p>
					</div>
				</div>
				<div class="row">
					<div class="col-3"><p class="text-light p-2" style={actionStyle()}>actions</p></div>
					<div class="col-9">
						<p class="p-2" style={actionRightStyle()}><a class="pointer text-light" href="/" on:click|preventDefault={() => { openSesame() }}>Show Clarity</a></p>
						<p class="p-2" style={actionRightStyle()}><a class="pointer text-light" href={explorerUrl()} target="_blank">Open Explorer</a></p>
					</div>
				</div>
			</div>
	</div>
</div>

<style>
.box {
	font-family: Gilroy-ExtraBold;
	background-color: #262626;
	height: auto;
	margin: 10px 2px;
	padding: 30px 10px;
}
.box h2 {
	font-size: 1.2rem;
}
.box p {
	font-family: Gilroy-Light;
	padding: 3px;
	margin: 0 !important;
	font-size: 1.0rem;
	text-transform: lowercase;
}
.col-9 {
	padding-left: 0 !important;
}
.col-3 {
	padding-right: 0 !important;
}
.text-light {
	color: #ededed;
}
</style>
