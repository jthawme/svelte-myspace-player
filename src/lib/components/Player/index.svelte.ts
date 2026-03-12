import type { CurrentTrackAudioInfo, PlayerObject } from './Player.defs.ts';
import { PubSub } from './pubsub.ts';

/**
 *
 */
function attachAudioElementListeners(el: HTMLAudioElement, comms: PubSub) {
	el.addEventListener('ended', () => comms.fire('ended'));
	el.addEventListener('pause', () => comms.fire('pause'));
	el.addEventListener('play', () => comms.fire('play'));
	el.addEventListener('loadstart', () => comms.fire('load'));
	el.addEventListener('canplaythrough', () => comms.fire('canplaythrough'));
	el.addEventListener('timeupdate', () => comms.fire('timeupdate'));
	el.addEventListener('error', (e) => {
		comms.fire('error');

		console.log(e);
	});
}

/**
 *
 */
function createAudioElement(comms: PubSub): HTMLAudioElement {
	let audioEl = document.querySelector('#player-element') as HTMLAudioElement | null;

	if (!audioEl) {
		audioEl = document.createElement('audio');
		audioEl.id = 'player-element';
		audioEl.setAttribute('playsinline', 'true');
		document.body.appendChild(audioEl);

		attachAudioElementListeners(audioEl, comms);
	}

	return audioEl;
}

/**
 *
 */
function createAudioContext(el: HTMLAudioElement): { ctx: AudioContext; analyser: AnalyserNode } {
	const ctx = new AudioContext();
	const source = ctx.createMediaElementSource(el);

	const analyser = ctx.createAnalyser();

	source.connect(analyser);
	analyser.connect(ctx.destination);

	return { ctx, analyser };
}

/**
 *
 */
function destroyAudioElement() {
	const audioEl = document.querySelector('#player-element') as HTMLAudioElement | null;

	if (audioEl) {
		audioEl.remove();
	}
}

interface MyspaceAudioPlayerInit {
	initialVolume?: number;

	next: () => void;
	previous: () => void;
}

export const MyspaceAudioPlayer = ({
	initialVolume = 1,
	next,
	previous
}: MyspaceAudioPlayerInit) => {
	const loaded = $state({ current: false });
	const playing = $state({ current: false });
	const error = $state({ current: false });
	const idle = $state({ current: true });
	const volume = $state({ current: initialVolume });
	const currentSongId: { current: string | null } = $state({ current: null });
	const currentPlaylistId: { current: string | null } = $state({ current: null });

	const currentTrackInfo: CurrentTrackAudioInfo = $state({
		duration: 1,
		currentTime: 0
	});

	let audioCtx: AudioContext | undefined;
	let audioAnalyser: AnalyserNode | undefined;
	let audioElement: HTMLAudioElement | undefined;

	const comms = new PubSub();

	// Creates an object to house the controls in which you can interact with the player through
	const Player: PlayerObject = {
		Play(src?: string) {
			if (src && audioElement) {
				audioElement.src = src;
				audioElement.currentTime = 0;
			}
			audioElement?.play();
		},
		Pause() {
			audioElement?.pause();
		},
		Stop() {
			audioElement?.pause();
			audioElement?.load();
		},
		Seek(time: number) {
			if (!audioElement) {
				return;
			}

			audioElement.currentTime = Math.min(Math.max(0, time), audioElement.duration);
		},
		Load(src, songId, playlistId) {
			if (!audioElement) {
				return;
			}

			audioElement.src = src;
			currentSongId.current = songId;
			currentPlaylistId.current = playlistId;
		},
		Volume(value: number) {
			if (!audioElement) {
				return;
			}

			volume.current = value;
			audioElement.volume = value;
		}
	};

	// Sets up events coming from
	comms.on('play', async () => {
		if (audioCtx && audioCtx.state !== 'running') {
			await audioCtx.resume();
		}
		idle.current = false;
		playing.current = true;
	});
	comms.on('pause', () => {
		playing.current = false;
	});
	comms.on('load', () => {
		idle.current = false;
		loaded.current = false;
	});
	comms.on('canplaythrough', () => {
		idle.current = false;
		loaded.current = true;
	});
	comms.on('error', () => {
		error.current = true;
	});
	comms.on('timeupdate', () => {
		if (!audioElement) {
			return;
		}

		currentTrackInfo.currentTime = audioElement.currentTime;
		currentTrackInfo.duration = audioElement.duration;
	});
	comms.on('ended', () => {
		next();
	});

	const destroy = $effect.root(() => {
		audioElement = createAudioElement(comms);
		const { ctx, analyser } = createAudioContext(audioElement);

		audioCtx = ctx;
		audioAnalyser = analyser;

		return () => {
			destroyAudioElement();
			audioCtx = undefined;
			audioElement = undefined;

			comms.off('play');
			comms.off('pause');
			comms.off('load');
			comms.off('timeupdate');
			comms.off('canplaythrough');
		};
	});

	return {
		audioCtx,
		audioAnalyser,
		Player,
		loaded,
		info: currentTrackInfo,
		destroy,
		playing,
		idle,
		error,
		volume,
		currentSongId,
		currentPlaylistId
	};
};
