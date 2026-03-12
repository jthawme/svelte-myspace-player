<script>
	/** @type {{columns?: number, value: number}} */
	let { columns = 10, value } = $props();

	let parts = $derived.by(() => {
		const threshold = (columns - 1) * value;

		return new Array(columns).fill(0).map((_, idx, arr) => {
			if (threshold === arr.length - 1 || idx < threshold) {
				return 1;
			}

			if (Math.ceil(threshold) === idx) {
				return threshold % 1;
			}

			return 0;
		});
	});
</script>

<div>
	{#each parts as column, idx (idx)}
		<span style:--percentage={column} style:--height={(idx + 1) / columns}></span>
	{/each}
</div>

<style lang="scss">
	div {
		display: flex;

		gap: 0.2em;

		height: 0.5em;
	}

	span {
		position: relative;

		flex: 1 0 auto;

		height: calc(100% * var(--height));
	}

	span:before {
		content: '';

		display: block;

		background-color: var(--svelte-myspace-player-green-1);

		width: 100%;
		height: 100%;

		transform: scaleX(var(--percentage));
		transform-origin: left;

		z-index: -1;
	}

	span:after {
		content: '';

		position: absolute;

		inset: 0;

		box-shadow: 0 0.1em 0.1em rgba(0, 0, 0, 0.5) inset;
	}
</style>
