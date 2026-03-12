/**
 * @typedef {object} TrackItem
 * @property {string} id
 * @property {string} title
 * @property {string} artist
 * @property {string} src
 *
 * @typedef {object} AlbumItem
 * @property {string} id
 * @property {string} title
 * @property {string} credits
 * @property {string} artwork
 * @property {TrackItem[]} items
 */

export interface SongItem {
	id: string;
	title: string;
	artist: string;
	src: string;

	attribution?: string;
	artwork?: string;
	plays?: number;
}

export interface AlbumItem {
	id: string;
	title: string;
	attribution?: string;
	artwork?: string;

	items: SongItem[];
}

export enum TYPE {
	TRACK = 'track',
	ALBUM = 'album'
}

export type PlayerItems = (AlbumItem | SongItem)[];

export type SongItemInternal = { type: TYPE.TRACK } & SongItem;
export type AlbumItemInternal = AlbumItem & { type: TYPE.ALBUM; items: SongItemInternal[] };

export interface PlayerObject {
	Play: (src?: string) => void;
	Pause: () => void;
	Stop: () => void;
	Seek: (time: number) => void;
	Load: (src: string, songId: string, playlistId: string | null) => void;
	Volume: (value: number) => void;
}

export interface CurrentTrackAudioInfo {
	duration: number;
	currentTime: number;
}

export interface CurrentTrackInfo {
	title?: string;
	artist?: string;
	attribution?: string;
	artwork?: string;
	album?: string;
}
