<script lang="ts">
	import type {
		CurrentTrackAudioInfo,
		CurrentTrackInfo,
		PlayerObject
	} from './Player/Player.defs.ts';

	import Play from './icons/play-sharp.svg.svelte';
	import Pause from './icons/pause-sharp.svg.svelte';
	import SkipBack from './icons/play-skip-back-sharp.svg.svelte';
	import SkipForward from './icons/play-skip-forward-sharp.svg.svelte';
	import Stop from './icons/stop-sharp.svg.svelte';
	import Volume from './icons/volume-high-sharp.svg.svelte';
	import EQDisplay from './EQDisplay.svelte';
	import BounceText from './BounceText.svelte';
	import SoftRange from './SoftRange.svelte';
	import VolumeDisplay from './VolumeDisplay.svelte';

	export interface MyspacePlayerAudioPlayerProps {
		player: PlayerObject;
		playing: boolean;
		loading: boolean;
		idle: boolean;
		error: boolean;
		trackInfo: CurrentTrackInfo;
		trackAudioInfo: CurrentTrackAudioInfo;
		analyser?: AnalyserNode;

		volume: number;

		onPreviousRequest: () => void;
		onNextRequest: () => void;
		onSeek: (time: number) => void;
		onVolumeChange: (value: number) => void;
	}

	let {
		player,
		trackInfo,
		trackAudioInfo,
		playing,
		loading,
		idle,
		error,
		onPreviousRequest,
		onNextRequest,
		analyser,
		onSeek,
		volume,
		onVolumeChange
	}: MyspacePlayerAudioPlayerProps = $props();

	let displayTime = $derived.by(() => {
		return [
			Math.floor(trackAudioInfo.currentTime / 60),
			Math.round(trackAudioInfo.currentTime) % 60
		]
			.map((num) => num.toString().padStart(2, '0'))
			.join(':');
	});

	let playerStatus = $derived.by(() => {
		if (idle) {
			return '';
		}

		if (error) {
			return 'error';
		}

		if (loading) {
			return 'loading...';
		}

		return playing ? 'playing' : 'paused';
	});

	let seekPercentage = $derived(trackAudioInfo.currentTime / (trackAudioInfo.duration || 1));
</script>

<svg viewBox="0 0 20 20">
	<filter id="inset-shadow">
		<!-- Shadow offset -->
		<feOffset dx="0" dy="1" />
		<!-- Shadow blur -->
		<feGaussianBlur stdDeviation="1" result="offset-blur" />
		<!-- Invert drop shadow to make an inset shadow-->
		<feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
		<!-- Cut colour inside shadow -->
		<feFlood flood-color="black" flood-opacity=".75" result="color" />
		<feComposite operator="in" in="color" in2="inverse" result="shadow" />
		<!-- Placing shadow over element -->
		<feComposite operator="over" in="shadow" in2="SourceGraphic" />
	</filter>
</svg>

<div class="outer">
	<div class="actions">
		<div class="controls">
			<button class="btn-reset" onclick={() => player.Stop()}>
				<Stop />
			</button>
			<button class="btn-reset" onclick={onPreviousRequest}>
				<SkipBack />
			</button>
			<button
				class="btn-reset"
				class:active={!playing}
				class:green={!playing}
				onclick={() => player.Pause()}
			>
				<Pause />
			</button>
			<button
				class="btn-reset"
				class:active={playing}
				class:green={playing}
				onclick={() => player.Play()}
			>
				<Play />
			</button>
			<button class="btn-reset" onclick={onNextRequest}>
				<SkipForward />
			</button>
		</div>

		<div class="volume">
			<div class="volume-icon"><Volume /></div>
			<div class="volume-track">
				<SoftRange value={volume} onUpdate={onVolumeChange} />
			</div>
			<div class="volume-display">
				<VolumeDisplay value={volume} />
			</div>
		</div>
	</div>

	<div class="display">
		<div class="display-window">
			<div class="display-window-text">
				{#if trackInfo.title}
					<span><BounceText text={trackInfo.title.trim()} /></span>
					<span>{trackInfo.artist}</span>
					<span class:green={!error} class:red={error}>{playerStatus}</span>
				{/if}
			</div>

			<div class="display-eq">
				{#if analyser}
					<EQDisplay {analyser} />
				{/if}
			</div>
		</div>

		<div class="time">
			<span class="time-numbers">{displayTime}</span>

			<div class="time-seek">
				<SoftRange value={seekPercentage} onValue={onSeek} />
			</div>
		</div>
	</div>
</div>

<style>
	svg {
		position: absolute;
		pointer-events: none;
		width: 0;
		height: 0;
	}

	.outer {
		display: grid;

		grid-template-columns: auto 1fr;

		gap: 1em;
	}

	.actions,
	.display {
		min-width: 0;
	}

	.actions {
		display: flex;
		flex-direction: column;

		gap: 0.2em;
	}

	.controls {
		display: flex;

		gap: 0.5em;
	}

	.controls :global(.ionicon) {
		width: 2em;
		height: 2em;

		color: currentColor;

		filter: url(#inset-shadow) drop-shadow(0 1px 1px white);
	}

	.controls button.btn-reset {
		cursor: pointer;

		width: 3em;
		height: 3em;

		border: 1px solid var(--svelte-myspace-player-grey-2);

		background: var(--svelte-myspace-player-chrome-gradient);

		border-radius: 0.25em;

		line-height: 0;

		color: var(--svelte-myspace-player-grey-2);
	}

	.controls button:hover {
		background: var(--svelte-myspace-player-chrome-gradient-active);
	}

	.controls button:hover:not(.active) {
		color: var(--svelte-myspace-player-grey-3);
	}

	.display {
		display: flex;

		flex-direction: column;
	}

	.display-window {
		display: grid;

		grid-template-columns: 3fr 1fr;

		gap: 0.5em;

		background-color: var(--svelte-myspace-player-grey-4);

		color: white;

		padding: var(--svelte-myspace-player-padding);

		border-radius: 0.5em;
		flex-grow: 1;
	}

	.display-window-text {
		display: flex;

		flex-direction: column;

		height: 7ch;

		font-size: 0.8em;

		min-width: 0;
	}

	.display-window-text span:nth-child(1) {
		font-weight: bold;
		font-size: 1.1em;
	}

	.display-window-text span:nth-child(2) {
		flex-grow: 1;
	}

	.display-window-text span {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		min-width: 0;
	}

	.display-eq {
		min-width: 0;
	}

	.time {
		display: grid;

		grid-template-columns: auto 1fr;
		gap: 0.5em;

		align-items: center;
	}

	.time-numbers {
		color: var(--svelte-myspace-player-grey-2);
		font-weight: bold;

		font-size: 0.8em;
	}

	.volume {
		display: grid;

		grid-template-columns: auto 1fr;
		column-gap: 0.5em;
		row-gap: 0.25em;
	}

	.volume-icon {
		color: var(--svelte-myspace-player-grey-2);

		grid-row: 1 / span 2;
	}

	.volume-icon :global(.ionicon) {
		height: 1.5em;
		width: 1.5em;
	}
</style>
