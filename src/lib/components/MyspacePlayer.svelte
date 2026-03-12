<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import { elementSize } from '$lib/utils.svelte';

	import Display from './Display.svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import {
		TYPE,
		type AlbumItem,
		type AlbumItemInternal,
		type CurrentTrackInfo,
		type SongItem,
		type SongItemInternal
	} from './Player/Player.defs.ts';
	import { MyspaceAudioPlayer } from './Player/index.svelte.ts';
	import Tracks, { type TrackComponentAttributes } from './Tracks.svelte';
	import MediaSession from './MediaSession.svelte';

	interface MyspacePlayerProps {
		/** The total plays for the player */
		totalPlaysCount?: number;

		/** The plays today for the player */
		playsTodayCount?: number;

		/** The downloads for the player */
		downloadsCount?: number;

		/** Whether or not the total plays should be a sum of total plays + plays today */
		combineTotalPlays?: boolean;

		/** Snippet to override the default component for display in the player */
		displayComponent?: Snippet<[CurrentTrackInfo]>;

		/** Snippet to override the default component for each track */
		trackComponent?: Snippet<TrackComponentAttributes>;

		tracks: Array<SongItem | AlbumItem>;

		/** Callback that is called when a song is played. Useful for updating play counts */
		onPlay?: (songId: string, albumId?: string | null) => void;

		/** Callback that is called when a song is downloaded. Useful for updating play counts */
		onDownload?: (song: SongItemInternal) => void;
	}

	let {
		totalPlaysCount = 0,
		playsTodayCount = 0,
		downloadsCount = 0,
		combineTotalPlays = true,
		displayComponent,
		trackComponent,
		tracks,
		onPlay,
		onDownload
	}: MyspacePlayerProps = $props();

	function getPlaylistItems(id: string | null) {
		if (!id) {
			return internalTracks.filter((item) => item.type === TYPE.TRACK);
		}

		return (
			(
				internalTracks.find(
					(item) => item.id === id && item.type === TYPE.ALBUM
				) as AlbumItemInternal | null
			)?.items ?? []
		);
	}

	let internalTracks: Array<SongItemInternal | AlbumItemInternal> = $derived(
		tracks.map((item) => {
			if ('items' in item) {
				return {
					...item,
					items: item.items.map((subItem) => ({
						...subItem,
						type: TYPE.TRACK
					})),
					type: TYPE.ALBUM
				};
			}

			return {
				...item,
				type: TYPE.TRACK
			};
		})
	);

	let playerEl: HTMLDivElement | undefined = $state();

	const playerSize = elementSize(() => playerEl);

	// We make it responsive by scaling everything based off its relativity to
	// a 450px width element, which everything is initially sized to
	let scale = $derived(playerSize.width / 450);

	let totalPlays = $derived(
		combineTotalPlays ? totalPlaysCount + playsTodayCount : totalPlaysCount
	);

	const {
		loaded,
		audioAnalyser,
		Player,
		info,
		playing,
		destroy,
		idle,
		error,
		volume,
		currentPlaylistId,
		currentSongId
	} = MyspaceAudioPlayer({ previous: onPreviousRequest, next: onNextRequest });

	let playlistViewId: null | AlbumItem['id'] = $state(null);

	let currentPlaylistView = $derived(
		(
			internalTracks.find((item) => item.id === playlistViewId && item.type === TYPE.ALBUM) as
				| AlbumItemInternal
				| undefined
		)?.items ?? internalTracks
	);

	let currentPlaylistTracks = $derived(getPlaylistItems(playlistViewId));

	let currentPlaylist = $derived.by(() => {
		if (!currentPlaylistId.current) {
			return null;
		}

		return internalTracks.find(
			(playlist) => playlist.id === currentPlaylistId.current && playlist.type === TYPE.ALBUM
		) as AlbumItemInternal | undefined;
	});
	let currentTrack = $derived(
		getPlaylistItems(currentPlaylistId.current).find((item) => item.id === currentSongId.current)
	);

	const currentTrackInfo: CurrentTrackInfo = $derived({
		title: currentTrack?.title,
		artist: currentTrack?.artist,
		attribution: currentTrack?.attribution ?? currentPlaylist?.attribution,
		album: currentPlaylist?.title,
		artwork: currentTrack?.artwork ?? currentPlaylist?.artwork
	});

	function playlistTrackChange(direction: number) {
		const playlist = getPlaylistItems(currentPlaylistId.current);
		const currentTrackIndex = playlist.findIndex((item) => item.id === currentTrack?.id);
		const nextIndex = currentTrackIndex + direction;

		if (nextIndex >= 0 && nextIndex < playlist.length) {
			const { src, id } = playlist[nextIndex];
			Player.Load(src, id, currentPlaylistId.current);
			Player.Play();
			if (onPlay) onPlay(id, currentPlaylistId.current);
		}
	}

	function onNextRequest() {
		playlistTrackChange(1);
	}

	function onPreviousRequest() {
		playlistTrackChange(-1);
	}

	function onSeek(val: number) {
		Player.Seek(val * info.duration);
	}

	function onVolumeChange(val: number) {
		Player.Volume(val);
	}

	async function onPlaySong(songId: SongItem['id']) {
		const song = currentPlaylistTracks.find((item) => item.id === songId);

		if (!song) {
			return;
		}

		Player.Load(song.src, song.id, playlistViewId);
		Player.Play();
		if (onPlay) onPlay(songId, playlistViewId);
	}

	function onSelectAlbum(albumId: AlbumItem['id'] | null) {
		playlistViewId = albumId;
	}

	$effect(() => {
		return () => {
			destroy();
		};
	});

	function loadInitial() {
		if (currentPlaylistTracks.length === 0) {
			return;
		}

		const { src, id } = currentPlaylistTracks[0];
		Player.Load(src, id, playlistViewId);
	}

	onMount(() => {
		loadInitial();
	});
</script>

<MediaSession
	track={currentTrackInfo}
	onPlay={Player.Play}
	onPause={Player.Pause}
	onStop={Player.Stop}
	onSeek={Player.Seek}
	onPrevious={onPreviousRequest}
	onNext={onNextRequest}
	idle={idle.current}
	playing={playing.current}
/>

<div class="wrapper" bind:this={playerEl} style:--scale={scale}>
	<div class="player">
		<AudioPlayer
			playing={playing.current}
			loading={!loaded.current}
			idle={idle.current}
			error={error.current}
			volume={volume.current}
			player={Player}
			analyser={audioAnalyser}
			trackInfo={currentTrackInfo}
			trackAudioInfo={info}
			{onNextRequest}
			{onPreviousRequest}
			{onSeek}
			{onVolumeChange}
		/>
	</div>

	<div class="info">
		<span>Total Plays: {totalPlays}</span>
		<span>Downloads Today: {downloadsCount}</span>
		<span>Plays Today: {playsTodayCount}</span>
	</div>

	<div class="display">
		{#if displayComponent}
			{@render displayComponent(currentTrackInfo)}
		{:else}
			<Display
				artwork={currentTrackInfo.artwork}
				title={currentTrackInfo.album || currentTrackInfo.artist}
				attribution={currentTrackInfo.attribution}
			/>
		{/if}
	</div>

	<div class="tracks">
		<Tracks
			items={currentPlaylistView}
			onSelectSong={onPlaySong}
			{onSelectAlbum}
			{onDownload}
			inPlaylist={!!playlistViewId}
			trackDisplay={trackComponent}
		/>
	</div>
</div>

<style>
	:root {
		--svelte-myspace-player-font-family: Verdana, Geneva, sans-serif;

		--svelte-myspace-player-aspect-ratio: 522 / 400;

		--svelte-myspace-player-black-1: #000;

		--svelte-myspace-player-grey-1: #d7d7d7;
		--svelte-myspace-player-grey-2: #696667;
		--svelte-myspace-player-grey-3: #303030;
		--svelte-myspace-player-grey-4: #272020;

		--svelte-myspace-player-padding-x: 0.8em;
		--svelte-myspace-player-padding-y: 0.4em;
		--svelte-myspace-player-padding: var(--svelte-myspace-player-padding-y)
			var(--svelte-myspace-player-padding-x);

		--svelte-myspace-player-red-1: #ffd5d6;
		--svelte-myspace-player-red-2: #c00;

		--svelte-myspace-player-blue-1: #02339a;

		--svelte-myspace-player-green-1: #009200;

		--svelte-myspace-player-chrome-gradient: linear-gradient(
			to bottom,
			#f6f6f6 9%,
			#a1a1a1 50%,
			#989898 79%,
			#eeeeee 95%
		);
		--svelte-myspace-player-chrome-gradient-active: linear-gradient(
			to bottom,
			#c9c9c9 9%,
			#7d7d7d 50%,
			#636363 69%,
			#c2c2c2 94%
		);
	}

	.wrapper {
		display: grid;

		grid-template-areas:
			'player player'
			'info info'
			'display tracks';
		grid-template-rows: auto auto 1fr;
		grid-template-columns: 2fr 3fr;

		border: 1px solid var(--svelte-myspace-player-black-1);

		aspect-ratio: var(--svelte-myspace-player-aspect-ratio);

		font-size: calc(11px * var(--scale));
		font-family: var(--svelte-myspace-player-font-family);

		box-sizing: border-box;
	}

	.wrapper :global(.green) {
		color: var(--svelte-myspace-player-green-1) !important;
	}

	.wrapper :global(.red) {
		color: var(--svelte-myspace-player-red-1) !important;
	}

	.wrapper :global(.grey) {
		color: var(--svelte-myspace-player-grey-1) !important;
	}

	.wrapper :global(.text-clip) {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.wrapper :global(.blue-link),
	.wrapper :global(button.blue-link) {
		color: var(--svelte-myspace-player-blue-1);
		text-decoration: underline;

		cursor: pointer;
	}

	.wrapper :global(.blue-link:hover) {
		color: var(--svelte-myspace-player-red-2);
	}

	.wrapper :global(.btn-reset) {
		border: none;
		background-color: transparent;

		padding: 0;
		margin: 0;

		color: inherit;
		font-weight: inherit;
		font-size: inherit;
		outline: 0;
	}

	.player,
	.info,
	.display,
	.tracks {
		min-width: 0;
		min-height: 0;
	}

	.player {
		grid-area: player;

		background: var(--svelte-myspace-player-chrome-gradient);
		padding: var(--svelte-myspace-player-padding);
	}

	.info {
		grid-area: info;

		display: flex;
		justify-content: space-between;

		background-color: var(--svelte-myspace-player-grey-3);
		color: white;

		font-size: 0.8em;

		padding: var(--svelte-myspace-player-padding);

		font-weight: bold;
	}

	.display {
		grid-area: display;

		display: flex;
	}

	.tracks {
		grid-area: tracks;

		padding: var(--svelte-myspace-player-padding);

		overflow: auto;
	}
</style>
