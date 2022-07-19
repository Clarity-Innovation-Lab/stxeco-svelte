<script>
    import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();
	let data;
	let files;
	const convertToPlainFile = (binfile) => {
		const sub = 'data:application/octet-stream;base64,'
		//const octets = this.files[0].dataUrl.substring(sub.length)
		const decodedString = atob(binfile)
		return decodedString

	}
	$: {
		if (files && files[0]) {
			let binfile = files[0];
			let filename = binfile.name.split('.')[0];
			//let plainFile = plainFile(binfile)
			let reader = new FileReader();
			reader.onload = function(evt) {
				data = new TextDecoder().decode(new Uint8Array(evt.target.result));
				// plainFile = convertToPlainFile(binfile)
				dispatch('fileLoaded', { source: data, contractName: filename })
			}
			reader.readAsArrayBuffer(binfile);
		}
	}
</script>
	
<main>
	<div>
		<h4>Upload Contract</h4>
		<p>Upload a contract. Contract must</p>
		<ol>
			<li>Be fully clarinet unit tested</li>
			<li>Implement <strong>proposal-trait</strong></li>
		</ol>
		<label for="fileinput">Choose Clarity File: </label>
		<input class="btn btn-info" type="file" id="fileinput" bind:files />
	</div>
</main>
	