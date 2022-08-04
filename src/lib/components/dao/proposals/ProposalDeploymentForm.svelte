<script>
    import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	let fields = { contractName: '', title: '', author: '', synopsis: '', description: '' }
	let errors = { contractName: '', title: '', author: '', synopsis: '', description: '' }
	let valid = false
	const submitHandler = () => {
		valid = true
		if (fields.contractName.trim().length < 2) {
			errors.contractName = 'contract name is required - no spaces, dots, underscores or special characters'
			valid = false
		} else {
			errors.contractName = ''
		}
		if (fields.title.trim().length < 5) {
			errors.title = 'title is required'
			valid = false
		} else {
			errors.title = ''
		}
		if (fields.author.trim().length < 1) {
			errors.author = 'author is required'
			valid = false
		} else {
			errors.author = ''
		}
		if (fields.synopsis.trim().length < 1) {
			errors.synopsis = 'synopsis is required'
			valid = false
		} else {
			errors.synopsis = ''
		}
		if (fields.description.trim().length < 1) {
			errors.description = 'Description is required'
			valid = false
		} else {
			errors.description = ''
		}
		// add ew poll if valid
		if (valid) {
			dispatch('addNewPoll', fields)
		}
	}
</script>

<form on:submit|preventDefault={submitHandler}>
    <div class="form-field">
	    <label for="contractName">Contract Name</label>
		<input type="text" id="title" bind:value={fields.contractName}/>
		<div class="error">{errors.contractName}</div>
    </div>
    <div class="form-field">
	    <label for="title">Title</label>
		<input type="text" id="title" bind:value={fields.title}/>
		<div class="error">{errors.title}</div>
    </div>
    <div class="form-field">
	    <label for="author">Author</label>
		<input type="text" id="author" bind:value={fields.author}/>
		<div class="error">{errors.author}</div>
    </div>
    <div class="form-field">
	    <label for="synopsis">Synopsis</label>
		<input type="text" id="synopsis" bind:value={fields.synopsis}/>
		<div class="error">{errors.synopsis}</div>
    </div>
    <div class="form-field">
	    <label for="description">Description</label>
		<textarea rows="3" type="text" id="description" bind:value={fields.description}/>
		<div class="error">{errors.description}</div>
    </div>
	<button class="btn btn-sm outline-light">Update</button>
</form>

<style>
	form {
		width: 100%;
		margin: 0 auto;
		text-align: left;
	}
	.form-field {
		margin: 10px auto;
	}
	textarea {
		width: 100%;
		border-radius: 6px;
	}
	input {
		width: 100%;
		border-radius: 6px;
	}
	label {
		vertical-align: top;
		width: 100%;
		margin: 5px auto;
		text-align: left;
	}
	.error {
		text-align: right;
		font-weight: bold;
		font-size: 12px;
		color: #d91b42;
	}
</style>