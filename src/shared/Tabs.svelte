<script>
    import { createEventDispatcher } from 'svelte';
	let dispatch = createEventDispatcher();
	export let activeItem
	export let items
    const handleClick = () => {
        const person = {
            name,
            beltColor,
            age,
            id: Math.random
        }
        dispatch('addPerson', person)
    }
</script>

<div class="tabs">
    <ul>
		{#each items as item}
			<li on:click={() => dispatch('tabChange', item)}><div class:active={item === activeItem}>{item}</div></li>
		{/each}
	</ul>
</div>

<style>
	.tabs {
		margin-bottom: 40px;
	}
	ul {
		display: flex;
		justify-content: center;
		padding: 0;
		list-style-type: none;
	}
	li {
		margin: 0 16px;
		font-size: 18px;
		color: #555;
		cursor: pointer;
	}
	.active {
		color: #d91b42;
		border-bottom: 1px solid #ddd;
		padding-bottom: 8px;
	}
</style>