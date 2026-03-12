<script lang="ts">
	import { elementSize, chunk, animationLoop } from '$lib/utils.svelte';
	import { onMount } from 'svelte';

	interface EQDisplayProps {
		analyser: AnalyserNode;
	}

	let { analyser }: EQDisplayProps = $props();

	const BARS = [
		'#009D00',
		'#9FFF65',
		'#FFFFA2',
		'#FFFF01',
		'#FFD504',
		'#FF9E00',
		'#FF6405',
		'#FE3700',
		'#F60006'
	];

	let frequencyData = {
		current: new Uint8Array()
	};

	let canvasEl: HTMLCanvasElement | undefined = $state();

	let ctx = $derived(canvasEl ? canvasEl.getContext('2d') : null);

	let wrapperEl: HTMLDivElement | undefined = $state();

	let size = elementSize(() => wrapperEl);

	async function setupAudioAnalyser() {
		analyser.fftSize = 64;
		frequencyData.current = new Uint8Array(analyser.frequencyBinCount);
	}

	function getData(columns = 6) {
		if (analyser) {
			analyser.getByteFrequencyData(frequencyData.current);

			return chunk(Array.from(frequencyData.current), columns).map((part) => {
				return part.reduce((total, curr) => total + curr, 0) / part.length / 256;
			});
		}
	}

	function update() {
		if (!ctx) {
			return;
		}

		const columns = 6;
		const parts = getData(columns);

		ctx.clearRect(0, 0, size.width, size.height);

		const slice = size.width / columns;
		const sliceY = size.height / BARS.length;

		const PAD_X = 0.1;
		const PAD_Y = 0.2;
		const RADII = 0.1;

		(parts ?? new Array(columns).fill(0)).slice(0, columns).forEach((avg, idx) => {
			ctx.save();
			ctx.translate(slice * idx, size.height);

			const rows = Math.max(Math.round(avg * BARS.length), 1);

			for (let y = 0; y < rows; y++) {
				ctx.translate(0, -sliceY);

				ctx.save();

				ctx.translate(PAD_X * slice, PAD_Y * sliceY);

				ctx.fillStyle = BARS[y];
				ctx.beginPath();
				ctx.roundRect(0, 0, slice * (1 - PAD_X * 2), sliceY * (1 - PAD_Y * 2), slice * RADII);
				ctx.fill();
				ctx.restore();
			}
			ctx.restore();
		});
	}

	$effect(() => {
		if (!canvasEl || !ctx) {
			return;
		}

		const dpr = window.devicePixelRatio;
		canvasEl.width = size.width * dpr;
		canvasEl.height = size.height * dpr;
		canvasEl.style.width = `${size.width}px`;
		canvasEl.style.height = `${size.height}px`;
		ctx.scale(dpr, dpr);
	});

	$effect(() => {
		const animationDestroy = animationLoop(update, { fps: 10 });

		return () => animationDestroy();
	});

	onMount(() => {
		setupAudioAnalyser();
	});
</script>

<div class="wrapper" bind:this={wrapperEl}>
	<canvas bind:this={canvasEl} width="200" height="100"></canvas>
</div>

<style lang="scss">
	.wrapper {
		position: relative;

		height: 100%;
	}

	canvas {
		position: absolute;

		inset: 0;
	}
</style>
