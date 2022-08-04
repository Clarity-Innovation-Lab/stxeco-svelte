
<script>
  export let image = ''
  export let title = ''
  export let subtitle = ''
  export let linkName = ''
  export let linkTarget = ''
</script>
<div class="card">
  <img src={image} class="card-img-top" alt={subtitle}>
  <div class="card-body">
    <h5 class="card-title">{title}</h5>
    <p class="card-text">{@html subtitle}</p>
    <p class="mt-5 card-text text-center"><a href={linkTarget} class="btn btn-primary">{linkName}</a></p>
  </div>
</div>

<style>
  .card{
    min-width: 18rem;
  }
</style>