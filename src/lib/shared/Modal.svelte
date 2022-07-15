<script>
    export let showModal = false;
</script>

{#if showModal}
<div class="backdrop" on:click|self>
    <div class="sv-modal">
        <slot name="title"></slot>
        <slot></slot>
    </div>
</div>
{/if}

<style>
    .backdrop {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0,0,0,0.8);
        top: 0;
        left: 0;
        right: 0;
    }
    .sv-modal {
        padding: 10px;
        padding-top: 20px;
        border-radius: 10px;
        min-width: 400px;
        height: 70vh;
        margin: 10% 10%;
        text-align: center;
        color: #000;
        background: white;
    }
</style>