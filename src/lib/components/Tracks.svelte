<script lang="ts">
	import type { Snippet } from 'svelte';
	import { TYPE, type AlbumItemInternal, type SongItemInternal } from './Player/Player.defs.ts';
	import TrackItem from './TrackItem.svelte';

	export type TrackComponentAttributes = [
		SongItemInternal | AlbumItemInternal,
		(item: SongItemInternal | AlbumItemInternal) => void
	];

	interface TracksProps {
		items: Array<SongItemInternal | AlbumItemInternal>;
		inPlaylist?: boolean;

		onSelectAlbum: (albumId: string | null) => void;
		onSelectSong: (songId: string) => void;
		onDownload?: (song: SongItemInternal) => void;

		trackDisplay?: Snippet<TrackComponentAttributes>;
	}

	let { items, onSelectSong, onSelectAlbum, inPlaylist, trackDisplay, onDownload }: TracksProps =
		$props();

	function onSelect(item: SongItemInternal | AlbumItemInternal) {
		if (item.type === TYPE.TRACK) {
			onSelectSong(item.id);
		} else {
			onSelectAlbum(item.id);
		}
	}
</script>

{#if inPlaylist}
	<span class="back">
		<button class="btn-reset blue-link" onclick={() => onSelectAlbum(null)}>← Go Back</button>
	</span>
{/if}

{#each items as item (item.id)}
	{#if trackDisplay}
		{@render trackDisplay(item, () => onSelect(item))}
	{:else}
		<TrackItem
			{...item}
			items={item.type === TYPE.ALBUM ? (item.items.length as number) : undefined}
			onSelect={() => onSelect(item)}
			onDownload={item.type === TYPE.TRACK && onDownload ? () => onDownload(item) : () => false}
		/>
	{/if}
{/each}

<style>
	.back {
		display: block;

		padding-bottom: calc(var(--svelte-myspace-player-padding-y) * 2);
	}
</style>
