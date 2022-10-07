<script>
  import RepeatContent from '$lib/shared/RepeatContent.svelte';
	import { page } from '$app/stores';

	let slug = $page.params.slug;

</script>
<RepeatContent docType="sip_tab" uid={slug} />

<style>
</style>