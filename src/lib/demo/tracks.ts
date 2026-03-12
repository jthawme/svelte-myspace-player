import type { PlayerItems } from '$lib/components/Player/Player.defs.ts';

const TRACK = Object.freeze({
	UNTITLED: {
		id: 'untitled',
		title: 'Untitled',
		artist: 'Electric Skyline',
		src: '/music/untitled.mp3',
		artwork: '/images/pfp.jpg',
		attribution: '2008 ES'
	},
	INTEGRITY: {
		id: 'integrity',
		title: 'Integrity',
		artist: 'Electric Skyline',
		src: '/music/integrity.mp3',
		artwork: '/images/pfp.jpg',
		attribution: '2008 ES'
	},
	HELLO_SEATTLE: {
		id: 'hello-seattle',
		title: 'Hello Seattle (Owl City Cover)',
		artist: 'Electric Skyline',
		src: '/music/hello-seattle.mp3',
		artwork: '/images/live.jpg',
		attribution: '2008 ES'
	},
	FIREFLIES: {
		id: 'fireflies',
		title: 'Fireflies (Owl City Cover)',
		artist: 'Electric Skyline',
		src: '/music/fireflies.mp3',
		artwork: '/images/live.jpg',
		attribution: '2008 ES'
	},
	FIRST_DATE: {
		id: 'first-date',
		title: 'First Date (Blink 182 Cover)',
		artist: 'Electric Skyline',
		src: '/music/first-date.mp3',
		artwork: '/images/live.jpg',
		attribution: '2008 ES'
	},
	DINSOAURS_GO_RAWR: {
		id: 'dinosaurs',
		title: 'Dinosaurs Go Rawr (Amy Can Flyy Cover)',
		artist: 'Electric Skyline',
		src: '/music/dinosaurs-go-rawr.mp3',
		artwork: '/images/live.jpg',
		attribution: '2008 ES'
	},
	DANCE: {
		id: 'dance',
		title: 'Dance',
		artist: 'Electric Skyline',
		src: '/music/dance.mp3',
		artwork: '/images/pfp.jpg',
		attribution: '2008 ES'
	}
});

export const TRACKS: PlayerItems = [
	{
		...TRACK.FIRST_DATE
	},
	{
		...TRACK.UNTITLED
	},
	{
		...TRACK.DANCE
	},
	{
		...TRACK.FIREFLIES
	},
	{
		...TRACK.INTEGRITY
	},
	{
		...TRACK.DINSOAURS_GO_RAWR
	}
];

export const GROUPED_TRACKS: PlayerItems = [
	{
		id: 'originals',
		title: 'Originals',
		items: [
			{
				...TRACK.UNTITLED
			},
			{
				...TRACK.DANCE
			},
			{
				...TRACK.INTEGRITY
			}
		]
	},
	{
		id: 'covers',
		title: 'Covers',
		items: [
			{
				...TRACK.DINSOAURS_GO_RAWR
			},
			{
				...TRACK.FIREFLIES
			},
			{
				...TRACK.FIRST_DATE
			}
		]
	}
];
