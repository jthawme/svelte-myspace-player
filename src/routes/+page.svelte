<script lang="ts">
	import type { PlayerItems } from '$lib/components/Player/Player.defs.ts';

	import MyspacePlayer from '$lib/components/MyspacePlayer.svelte';

	const tracks: PlayerItems = $state([
		{
			id: 'album',
			title: 'Test Album',
			items: [
				{
					id: 'celine',
					title: 'My Heart Will Go On (Celine Dion Cover)',
					artist: 'Electric Skyline',
					src: '/music/celine-dion.mp3',
					artwork: 'https://placehold.co/400',
					plays: 450
				},
				{
					id: 'celine2',
					title: 'My Heart Will Go On (Celine Dion Cover)',
					artist: 'Electric Skyline',
					src: '/music/celine-dion.mp3',
					artwork: 'https://placehold.co/600x400/orange/white',
					plays: 450
				},
				{
					id: 'celine3',
					title: 'My Heart Will Go On (Celine Dion Cover)',
					artist: 'Electric Skyline',
					src: '/music/celine-dion.mp3',
					plays: 450
				}
			]
		},

		{
			id: 'celine',
			title: 'My Heart Will Go On (Celine Dion Cover)',
			artist: 'Electric Skyline',
			src: '/music/celine-dion.mp3',
			artwork: 'https://placehold.co/400',
			plays: 450
		},
		{
			id: 'celine2',
			title: 'My Heart Will Go On (Celine Dion Cover)',
			artist: 'Electric Skyline',
			src: '/music/celine-dion.mp3',
			artwork: 'https://placehold.co/600x400/orange/white',
			plays: 450
		},
		{
			id: 'celine3',
			title: 'My Heart Will Go On (Celine Dion Cover)',
			artist: 'Electric Skyline',
			src: '/music/celine-dion.mp3',
			plays: 450
		},
		{
			id: 'celine4',
			title: 'My Heart Will Go On (Celine Dion Cover)',
			artist: 'Electric Skyline',
			src: '/music/celine-dion.mp3',
			artwork: 'https://placehold.co/400',
			plays: 450
		},
		{
			id: 'celine5',
			title: 'My Heart Will Go On (Celine Dion Cover)',
			artist: 'Electric Skyline',
			src: '/music/celine-dion.mp3',
			artwork: 'https://placehold.co/600x400/orange/white',
			plays: 450
		},
		{
			id: 'celine6',
			title: 'My Heart Will Go On (Celine Dion Cover)',
			artist: 'Electric Skyline',
			src: '/music/celine-dion.mp3',
			plays: 450
		}
	]);

	let playsToday = $state(0);
	let downloadsToday = $state(0);

	function onPlay() {
		playsToday += 1;
	}
	function onDownload() {
		downloadsToday += 1;
	}
</script>

<div style:width="500px">
	<MyspacePlayer
		playsTodayCount={playsToday}
		downloadsCount={downloadsToday}
		{tracks}
		{onDownload}
		{onPlay}
	/>
</div>
