<script lang="ts">
	export interface MyspacePlayerDisplayProps {
		artwork?: string;

		title?: string;

		attribution?: string;
	}

	let { artwork, title, attribution }: MyspacePlayerDisplayProps = $props();
</script>

<div class="display">
	<div class="display-artwork">
		{#if artwork}
			<img src={artwork} alt={title ?? ''} />
		{/if}
	</div>

	<span class="display-text">
		{#if title}<span>{title}</span>{/if}
		{#if attribution}<span>{attribution}</span>{/if}
	</span>
</div>

<style>
	.display {
		background-color: var(--svelte-myspace-player-grey-1);

		padding: calc(var(--svelte-myspace-player-padding-y) * 3) var(--svelte-myspace-player-padding-x);

		display: flex;
		flex-direction: column;
		justify-content: center;

		width: 100%;
	}

	.display img {
		max-width: 100%;
		min-height: 0;

		object-fit: contain;
	}

	.display-artwork {
		min-height: 0;

		flex-grow: 1;

		display: flex;
		flex-direction: column;
	}

	.display-text {
		display: flex;
		flex-direction: column;

		padding: var(--svelte-myspace-player-padding);

		color: var(--svelte-myspace-player-grey-3);

		font-size: 0.8em;
	}
</style>
