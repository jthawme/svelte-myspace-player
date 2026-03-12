<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */

	import type { Snippet } from 'svelte';
	import type { SongItem } from './Player/Player.defs.ts';
	import { TYPE } from './Player/Player.defs.ts';

	interface SongItemProps extends Partial<SongItem> {
		type: TYPE;
		items?: number;

		onSelect: () => void;

		canDownload?: boolean;
		onDownload?: () => void;

		bottom?: Snippet<[Partial<SongItem> & { type: TYPE }]>;
	}

	let {
		title,
		type,
		artist,
		artwork,
		attribution,
		plays,
		canDownload = true,
		src,
		onSelect,
		bottom,
		id,
		items,
		onDownload
	}: SongItemProps = $props();
</script>

{#snippet bottomRender()}
	{#if bottom}
		{@render bottom({ title, artist, artwork, attribution, plays, src, id, type })}
	{:else if type === TYPE.ALBUM}
		<button onclick={onSelect} class="btn-reset">View Playlist</button>
	{:else}
		{#if canDownload}
			<a href={src} download={title} onclick={onDownload}>Download</a>
		{/if}
		<span>Rate</span>
		<span>Comments</span>
		<span>Lyrics</span>
		<span>Add</span>
	{/if}
{/snippet}

<span class="outer">
	<span class="top">
		<button class="btn-reset text-clip blue-link" onclick={onSelect}>{title}</button>
		{#if plays}<span>Plays: {plays}</span>{/if}
		{#if items}<span>Items: {items}</span>{/if}
	</span>

	<span class="bottom">
		{@render bottomRender()}
	</span>
</span>

<style>
	.outer {
		display: flex;

		flex-direction: column;

		gap: 0.25em;

		padding: var(--svelte-myspace-player-padding-y) 0
			calc(var(--svelte-myspace-player-padding-y) * 2.5);

		font-size: 0.9em;

		border-bottom: 0.05em dashed var(--svelte-myspace-player-grey-1);
	}

	.outer:hover {
		background-color: var(--svelte-myspace-player-red-1);
	}

	.top,
	.bottom {
		display: flex;

		text-align: left;
	}

	.top {
		gap: 0.5em;
	}

	.top span {
		flex-shrink: 0;
	}

	.bottom {
	}

	.bottom a {
		text-decoration: none;
	}

	.bottom a:hover {
		color: var(--svelte-myspace-player-red-2);
	}

	.top span,
	.bottom span {
		color: var(--svelte-myspace-player-grey-1);
	}

	.bottom a:not(:last-child):after,
	.bottom span:not(:last-child):after {
		content: '|';

		margin: 0 0.8em;

		font-size: 0.9em;

		color: var(--svelte-myspace-player-grey-1);
	}

	.bottom a,
	.bottom a:has(+ a):after {
		color: var(--svelte-myspace-player-black-1);
	}
</style>
