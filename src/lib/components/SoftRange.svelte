<script lang="ts">
	import type { FormEventHandler } from 'svelte/elements';

	interface SoftRangeProps {
		value: number;

		/** Runs after value is changed and released */
		onValue?: (value: number) => void;

		/** Runs at update speed */
		onUpdate?: (value: number) => void;

		min?: number;
		max?: number;
		step?: number;
	}

	let { value, onValue, onUpdate, min = 0, max = 1, step = 0.001 }: SoftRangeProps = $props();

	let el: HTMLInputElement | undefined = $state();

	let interacting = $state(false);

	const onInput: FormEventHandler<HTMLInputElement> = (e) => {
		if (onUpdate) {
			onUpdate(parseFloat((e.target as HTMLInputElement).value));
		}

		interacting = true;
	};

	const onChange: FormEventHandler<HTMLInputElement> = (e) => {
		if (onValue) {
			onValue(parseFloat((e.target as HTMLInputElement).value));
		}
		interacting = false;
	};

	$effect(() => {
		if (!interacting && el) {
			el.value = value.toString();
		}
	});
</script>

<input
	bind:this={el}
	type="range"
	value={min}
	oninput={onInput}
	onchange={onChange}
	class="soft-range"
	{min}
	{max}
	{step}
/>

<style lang="scss">
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;

		width: 100%;
		background: transparent;

		font-size: inherit;
	}

	/* Special styling for WebKit/Blink */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		margin-top: -0.35em; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */

		border: 0.1em solid var(--svelte-myspace-player-grey-2);
		height: 1em;
		width: 2em;
		border-radius: 0.25em;
		background: var(--svelte-myspace-player-chrome-gradient);
		cursor: pointer;
	}

	/* All the same stuff for Firefox */
	input[type='range']::-moz-range-thumb {
		border: 0.1em solid var(--svelte-myspace-player-grey-2);
		height: 1em;
		width: 2em;
		border-radius: 0.25em;
		background: var(--svelte-myspace-player-chrome-gradient);
		cursor: pointer;
	}

	/* All the same stuff for IE */
	input[type='range']::-ms-thumb {
		border: 0.1em solid var(--svelte-myspace-player-grey-2);
		height: 1em;
		width: 2em;
		border-radius: 0.25em;
		background: var(--svelte-myspace-player-chrome-gradient);
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 0.4em;
		cursor: pointer;
		box-shadow: 0.05em -0.05em 0.1em white inset;
		background: var(--svelte-myspace-player-black-1);
		border-radius: 0;
		border-width: 0.01em;
		border-style: solid;
		border-color: var(--svelte-myspace-player-grey-3);
		border-bottom-color: white;
		border-left-color: white;
	}

	input[type='range']::-moz-range-track {
		width: 100%;
		height: 0.4em;
		cursor: pointer;
		box-shadow: 0.05em -0.05em 0.1em white inset;
		background: var(--svelte-myspace-player-black-1);
		border-radius: 0;
		border-width: 0.01em;
		border-style: solid;
		border-color: var(--svelte-myspace-player-grey-3);
		border-bottom-color: white;
		border-left-color: white;
	}

	input[type='range']::-ms-track {
		width: 100%;
		height: 0.4em;
		cursor: pointer;
		background: transparent;
		border-color: transparent;
		border-width: 1.2em 0;
		color: transparent;
	}
	input[type='range']::-ms-fill-lower {
		box-shadow: 0.05em -0.05em 0.1em white inset;
		background: var(--svelte-myspace-player-black-1);
		border-radius: 0;
		border-width: 0.01em;
		border-style: solid;
		border-color: var(--svelte-myspace-player-grey-3);
		border-bottom-color: white;
		border-left-color: white;
	}
	input[type='range']::-ms-fill-upper {
		box-shadow: 0.05em -0.05em 0.1em white inset;
		background: var(--svelte-myspace-player-black-1);
		border-radius: 0;
		border-width: 0.01em;
		border-style: solid;
		border-color: var(--svelte-myspace-player-grey-3);
		border-bottom-color: white;
		border-left-color: white;
	}
</style>
