<script lang="ts">
	import { animationLoop, elementSize } from '$lib/utils.svelte';

	interface BounceTextProps {
		text: string;

		measureCharacter?: string;
	}

	let { text, measureCharacter = 'L' }: BounceTextProps = $props();

	let el: HTMLSpanElement | undefined = $state();

	let measureEl: HTMLSpanElement | null | undefined = $derived(el?.querySelector('.width'));

	const DIRECTION = {
		FORWARD: 1,
		BACKWARD: 0
	};

	const DEFAULT_HOLD = 5;

	const size = elementSize(() => el);
	const measureSize = elementSize(() => measureEl);

	let hold = $state(DEFAULT_HOLD);

	let position = $state(0);
	let direction = $state(DIRECTION.FORWARD);
	let total = $derived(
		Math.min(Math.max(Math.floor(size.width / measureSize.width), 0), size.width)
	);

	let display = $derived.by(() => {
		if (text.length < total) {
			return text;
		}

		let sub = text.slice(position, position + total);

		if (sub.at(-1) !== text.at(-1)) {
			return (sub += '...');
		}

		return sub;
	});

	$effect(() => {
		if (text) {
			position = 0;
			direction = DIRECTION.FORWARD;
			hold = DEFAULT_HOLD;
		}
	});

	$effect(() => {
		return animationLoop(
			() => {
				if (display.length === text.length) {
					return;
				}

				if (hold > 0) {
					hold -= 1;
					return;
				}

				if (
					(direction === DIRECTION.BACKWARD && display.slice(0, 5) === text.slice(0, 5)) ||
					(direction === DIRECTION.FORWARD &&
						display.slice(display.length - 5, display.length) ===
							text.slice(text.length - 5, text.length))
				) {
					direction = direction === DIRECTION.FORWARD ? DIRECTION.BACKWARD : DIRECTION.FORWARD;
					hold = DEFAULT_HOLD;
				} else {
					position = position + (direction === DIRECTION.FORWARD ? 1 : -1);
				}
			},
			{ fps: 5 }
		);
	});
</script>

<span bind:this={el}>
	<span class="width" aria-hidden="true">{measureCharacter}</span>
	{display}
</span>

<style lang="scss">
	span {
		position: relative;

		display: block;

		font-size: inherit;
	}

	.width {
		position: absolute;
		opacity: 0;
		visibility: hidden;

		pointer-events: none;
	}
</style>
