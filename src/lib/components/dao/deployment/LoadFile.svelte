<script>
// @ts-nocheck

    import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();
	let data;
	let files = [];
	$: {
		if (files.length > 0) {
			let binfile = files[0];
			let filename = binfile.name.split('.')[0];
			let reader = new FileReader();
			reader.onload = function(evt) {
				data = new TextDecoder().decode(new Uint8Array(evt.target.result));
				dispatch('fileLoaded', { source: data, contractName: filename })
			}
			reader.readAsArrayBuffer(binfile);
		}
	}
</script>
	
<main>
	<div>
		<label for="fileinput">Choose Clarity File: </label>
		<input class="btn btn-white" type="file" id="fileinput" bind:files />
	</div>
</main>
	