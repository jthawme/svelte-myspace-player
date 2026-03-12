export const elementSize = (el: () => Element | null | undefined) => {
	const size = $state({
		width: 0,
		height: 0
	});

	function onUpdate(entries: ResizeObserverEntry[]) {
		size.width = entries[0].contentRect.width;
		size.height = entries[0].contentRect.height;
	}

	let ro: ResizeObserver | undefined = $state();

	$effect(() => {
		const e = el();

		if (typeof e === 'undefined' || e === null || !ro) {
			return;
		}

		ro.observe(e);

		return () => ro?.unobserve(e);
	});

	$effect(() => {
		ro = new ResizeObserver(onUpdate);

		return () => ro?.disconnect();
	});

	return size;
};

export const animationLoop = (
	callback: (params: { time: number; frame: number }) => void,
	{ fps = 60 }
) => {
	let start: number;
	let time: number;

	const frameSlice = 1000 / fps;
	let frame = -1;

	const update: FrameRequestCallback = (timestamp) => {
		if (!start) {
			start = timestamp;
			time = start;
		}
		const delta = time - start;
		const seg = Math.floor(delta / frameSlice);

		if (seg > frame) {
			frame = seg;

			callback({
				time,
				frame
			});
		}

		time = timestamp;
		frameId = requestAnimationFrame(update);
	};

	let frameId = requestAnimationFrame(update);

	return () => cancelAnimationFrame(frameId);
};

export function chunk<T = unknown>(arr: T[], chunkSize = 1, cache: T[][] = []) {
	const tmp = [...arr];
	if (chunkSize <= 0) return cache;
	while (tmp.length) cache.push(tmp.splice(0, chunkSize));
	return cache;
}
