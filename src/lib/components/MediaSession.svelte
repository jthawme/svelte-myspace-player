<script lang="ts">
	import { onMount } from 'svelte';
	import type { CurrentTrackInfo } from './Player/Player.defs.ts';

	interface MediaSessionProps {
		onPlay: () => void;
		onPause: () => void;
		onStop: () => void;
		onSeek: (time: number) => void;
		onPrevious: () => void;
		onNext: () => void;

		track?: CurrentTrackInfo;

		playing: boolean;
		idle: boolean;

		audioSessionType?:
			| 'auto'
			| 'playback'
			| 'transient'
			| 'transient-solo'
			| 'ambient'
			| 'play-and-record';
	}

	let {
		onPlay,
		onPause,
		onStop,
		onSeek,
		onPrevious,
		onNext,
		track,
		audioSessionType,
		playing,
		idle
	}: MediaSessionProps = $props();

	function setActionHandlers() {
		navigator.mediaSession.setActionHandler('play', onPlay);
		navigator.mediaSession.setActionHandler('pause', onPause);
		navigator.mediaSession.setActionHandler('stop', onStop);
		navigator.mediaSession.setActionHandler('seekto', (time) => {
			if (time.seekTime) onSeek(time.seekTime);
		});
		navigator.mediaSession.setActionHandler('previoustrack', onPrevious);
		navigator.mediaSession.setActionHandler('nexttrack', onNext);
	}

	onMount(() => {
		setActionHandlers();
	});

	$effect(() => {
		if ('audioSession' in navigator) {
			navigator.audioSession.type = audioSessionType;
		}
	});

	$effect(() => {
		if (idle) {
			navigator.mediaSession.playbackState = 'none';
		} else {
			navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
		}
	});

	$effect(() => {
		if (!idle && track?.title) {
			navigator.mediaSession.metadata = new MediaMetadata({
				title: track.title,
				artist: track.artist,
				album: track.album,
				artwork: track.artwork
					? [
							{
								src: track.artwork,
								sizes: '256x256',
								type: 'image/png'
							}
						]
					: []
			});
		}
	});
</script>
