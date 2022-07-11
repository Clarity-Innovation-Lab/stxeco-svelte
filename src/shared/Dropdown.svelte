<script>
// @ts-nocheck

	export let type = 'dropdown primary'
	export let showMenu = false

    const handleClick = () => {
		showMenu = !showMenu
        // dispatch('showMenu', showMenu)
    }
</script>

<div class={type}>
	<button class="dropbtn" on:click={handleClick}>
		<slot name="label"></slot>
	</button>
	{#if showMenu}
	<div id="myDropdown" class="dropdown-content">
		<slot></slot>
	</div>
	{/if}
</div>
  
<style>
button {
	border: 0;
	cursor: pointer;
	padding: 8px 12px;
	font-weight: bold;
	box-shadow: 1px 2px 3px rgba(0,0,0,0.2);
}
/* Dropdown Button */
.dropbtn {
  background-color: transparent;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover, .dropbtn:focus {
  background-color: transparent;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  position: absolute;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  padding: 5px 10px;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd}
</style>