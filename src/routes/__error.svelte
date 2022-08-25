<script>
  import { page } from '$app/stores';
</script>

  
<h1>{$page.status}: {$page?.error?.message || 'Error Happened'}</h1>
<p>
  An error occurred fetching data from an external source. Please
  bear with us while we fix this issue.
</p>
<p>Thank you for your patience.</p>
  