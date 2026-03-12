<script lang="ts">
	import '$lib/demo/global.css';

	import { onMount, type Snippet } from 'svelte';
	import { MediaQuery } from 'svelte/reactivity';

	import { PUBLIC_GITHUB_TOKEN } from '$env/static/public';
	import type { PlayerItems } from '$lib/components/Player/Player.defs.ts';
	import { TRACKS, GROUPED_TRACKS } from '$lib/demo/tracks.ts';

	interface Comment {
		id: number;
		body_html: string;
		created_at: string;
		user: {
			avatar_url: string;
			login: string;
			html_url: string;
		};
	}

	import MyspacePlayer from '$lib/components/MyspacePlayer.svelte';

	const displayName = $state('svelte-myspace-player');

	let tracks: PlayerItems = $state(TRACKS);

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'short',
		timeStyle: 'short'
	});

	let playsToday = $state(0);
	let downloadsToday = $state(0);

	let isDesktop = new MediaQuery('min-width: 950px');

	let comments: { amount: number; perPage: number; items: Comment[] } = $state({
		amount: 0,
		perPage: 30,
		items: []
	});

	function onPlay() {
		playsToday += 1;
	}
	function onDownload() {
		downloadsToday += 1;
	}

	const navLinks = $state([
		['https://jthaw.me', 'Home'],
		['https://github.com/jthawme', 'Github'],
		['https://github.com/jthawme/svelte-myspace-player', 'Repository'],
		['https://newsletter.jthaw.me/', 'Newsletter'],
		['https://www.npmjs.com/package/svelte-myspace-player', 'NPM'],
		['https://www.linkedin.com/in/jonny-thaw/', 'LinkedIn']
	]);

	function github(url: string) {
		return fetch(url, {
			headers: {
				Accept: 'application/vnd.github.html+json',
				Authorization: `Bearer ${PUBLIC_GITHUB_TOKEN}`,
				'X-GitHub-Api-Version': '2026-03-10'
			}
		}).then((resp) => resp.json());
	}

	async function getComments() {
		const [commentsData, commentsStats] = await Promise.all([
			github(`https://api.github.com/repos/jthawme/svelte-myspace-player/issues/1/comments`),
			github(`https://api.github.com/repos/jthawme/svelte-myspace-player/issues/1`)
		]);

		comments.amount = commentsStats.comments;
		comments.items = commentsData;
	}

	function changeDemo(type: 'classic' | 'grouped') {
		switch (type) {
			case 'classic':
				tracks = TRACKS;
				break;
			case 'grouped':
				tracks = GROUPED_TRACKS;
				break;
		}
	}

	function accordions(open: boolean) {
		[...document.querySelectorAll('details:not(.permanent)')].map((el) => (el.open = open));
	}

	$effect(() => {
		accordions(isDesktop.current);
	});

	onMount(() => {
		getComments();
	});

	const seo = $state({
		title: 'svelte-myspace-player | Docs',
		description: 'The only unofficial myspace player built entirely in svelte',
		image: 'https://svelte-myspace-player.jthaw.club/images/social.jpg',
		url: 'https://svelte-myspace-player.jthaw.club'
	});
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />

	<meta property="og:title" content={seo.title} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={seo.url} />
	<meta property="og:image" content={seo.image} />

	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	<meta name="twitter:image" content={seo.image} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#snippet user(image: string, username: string, link: string)}
	<div class="user">
		<a href={link} target="_blank" rel="external" class="user-name">{username}</a>

		<a href={link} target="_blank" rel="external" class="user-image"><img src={image} alt="" /></a>
	</div>
{/snippet}

{#snippet box(title: string, children: Snippet, permanent?: boolean)}
	<details class="box" class:permanent open>
		<summary class="box-title">{title}</summary>
		<div class="box-body">
			{@render children()}
		</div>
	</details>
{/snippet}

{#snippet contactTable()}
	<div class="contact-table">
		<a
			href="https://github.com/jthawme/svelte-myspace-player/issues/1"
			target="_blank"
			rel="external">✏️ Leave comment</a
		>
		<a
			href="https://github.com/jthawme/svelte-myspace-player/issues/new/choose"
			target="_blank"
			rel="external">🔨 Create Issue</a
		>
		<a href="https://www.npmjs.com/package/svelte-myspace-player" target="_blank" rel="external"
			>📦 View NPM</a
		>
		<a href="https://github.com/jthawme/svelte-myspace-player" target="_blank" rel="external"
			>👨‍💻 View Github</a
		>
		<a href="https://www.jthaw.me" target="_blank" rel="external">❤️ Credits</a>
		<a href="https://www.youtube.com/watch?v=-yWpnto-hqQ" target="_blank" rel="external"
			>🎥 Good video</a
		>
	</div>
{/snippet}

{#snippet infoTable()}
	<div class="info-table">
		<div class="table-row">
			<span class="table-row-header"> Framework </span>
			<span class="table-row-cell">
				<a href="http://svelte.dev/" target="_blank">Svelte</a>
			</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">Installation</span>
			<span class="table-row-cell">
				<code>npm install svelte-myspace-player</code>
			</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">Author</span>
			<span class="table-row-cell">
				<code><a href="https://jthaw.me" target="_blank">jthawme</a></code>
			</span>
		</div>
	</div>
{/snippet}

{#snippet mainComponent()}
	<div id="main-component-props" class="component-table">
		<div class="table-row">
			<span class="table-row-header">tracks (required)</span>
			<span class="table-row-cell">
				(<a href="#song-item">SongItem</a> | <a href="#album-item">AlbumItem</a>)[]
			</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">totalPlaysCount</span>
			<span class="table-row-cell"> number </span>
		</div>
		<div class="table-row">
			<span class="table-row-header">playsTodayCount</span>
			<span class="table-row-cell"> number </span>
		</div>
		<div class="table-row">
			<span class="table-row-header">downloadsCount</span>
			<span class="table-row-cell"> number </span>
		</div>
		<div class="table-row">
			<span class="table-row-header">combineTotalPlays</span>
			<span class="table-row-cell">boolean</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">displayComponent</span>
			<span class="table-row-cell"
				>Snippet&lt;[<a href="#current-track-info">CurrentTrackInfo</a>]&gt;</span
			>
		</div>
		<div class="table-row">
			<span class="table-row-header">trackComponent</span>
			<span class="table-row-cell">Snippet&lt;[TrackComponentAttributes]&gt;</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">onPlay</span>
			<span class="table-row-cell">(songId: string, albumId?: string | null) =&gt; void;</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">onDownload</span>
			<span class="table-row-cell">(song: SongItem) =&gt; void;</span>
		</div>
	</div>
{/snippet}

{#snippet songItemAttributes()}
	<div id="song-item" class="component-table">
		<div class="table-row">
			<span class="table-row-header">id (required)</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">title (required)</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">artist (required)</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">src (required)</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">attribution</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">artwork</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">plays</span>
			<span class="table-row-cell">number</span>
		</div>
	</div>
{/snippet}
{#snippet albumItemAttributes()}
	<div id="album-item" class="component-table">
		<div class="table-row">
			<span class="table-row-header">id (required)</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">title (required)</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">attribution</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">artwork</span>
			<span class="table-row-cell">string</span>
		</div>
		<div class="table-row">
			<span class="table-row-header">items (required)</span>
			<span class="table-row-cell">
				<a href="#song-item">SongItem</a>[]
			</span>
		</div>
	</div>
{/snippet}

<header>
	<div><span>{displayName} | Home</span></div>
	<div><a href="https://github.com/jthawme/svelte-myspace-player" target="_blank">Github</a></div>
</header>

<nav class="top-nav">
	{#each navLinks as link, index (index)}
		<span>
			<a href={link[0]} rel="external" target="_blank">{link[1]}</a>
		</span>
	{/each}
</nav>

<main>
	<div class="left">
		<div class="group">
			<h1>{displayName}</h1>
			<span>svelte / sveltekit</span>
			<div class="profile">
				<div class="profile-image">
					<img src="/images/profile.png" alt="" />
				</div>

				<div class="profile-info">
					<em>"the only unofficial svelte myspace player!"</em><br /><br />
					Data center, Internet<br /><br />
					Profile Views: 69420<br /><br /><br /><br />
					Last Login: 29/06/2011
				</div>
			</div>
		</div>
		<div class="group">{@render box(`Interact with ${displayName}`, contactTable, true)}</div>
		<div class="url-box group">
			<b>Author URL:</b><br />
			&nbsp; https://www.jthaw.me
		</div>
		<div class="group">{@render box(`${displayName} General Info`, infoTable)}</div>
		<div class="group">{@render box(`<MyspacePlayer/> props`, mainComponent)}</div>
		<div class="group">{@render box(`SongItem attrs`, songItemAttributes)}</div>
		<div class="group">{@render box(`AlbumItem attrs`, albumItemAttributes)}</div>
	</div>
	<div class="right">
		<div class="group">
			<MyspacePlayer
				playsTodayCount={playsToday}
				downloadsCount={downloadsToday}
				{tracks}
				{onDownload}
				{onPlay}
			/>
		</div>

		<div class="group">
			<span class="transparent-header">{displayName} demo area</span>

			<div class="demo-row">
				Classic list of tracks (<button class="btn-link" onclick={() => changeDemo('classic')}
					>view</button
				>)
			</div>
			<div class="demo-row">
				Grouped tracks (<button class="btn-link" onclick={() => changeDemo('grouped')}>view</button
				>)
			</div>
			<div class="demo-row">🚧 More demos under construction 🚧</div>
		</div>

		<div class="group">
			<span class="orange-header">Basic {displayName} usage</span>

			<pre><code class="usage">
&lt;script&gt;
import MyspacePlayer from 'svelte-myspace-player';

const tracks = $state([
  &lcub;
    id: 'someid',
    title: 'Song Song',
    artist: 'Some Artist',
    src: '/some-song.mp3',
    artwork: '/some-artwork.jpg'
  &rcub;
]);
&lt;/script&gt;

&lt;MyspacePlayer &lcub; tracks &rcub; /&gt;
			</code></pre>
		</div>

		<div class="group">
			<span class="orange-header">About {displayName}</span>

			<p>
				Now you can bring back one of the greatest music playing experiences you ever (might have)
				had. It helped launched the careers of acts like Arctic Monkeys, Lily Allen and Kate Nash
				and presumably a large reason for that was the player.
			</p>

			<p>
				Updated for modern means, it is responsive, it plays with native web technology, it links
				into modern APIs (like the <a
					href="https://developer.mozilla.org/en-US/docs/Web/API/MediaSession"
					target="_blank">MediaSession API</a
				>) all with that metallic-y charm that you remember. It also now supports grouping items
				into Albums/Playlists (because I wanted that for something)
			</p>
		</div>

		<div class="group">
			<span class="orange-header">{displayName}'s Friend Space</span>
			<span class="transparent-header">{displayName} has <em>4</em> friends</span>

			<div class="friends">
				{@render user('/images/github.jpeg', 'jthawme', 'https://github.com/jthawme')}
				{@render user('/images/svelte.jpg', 'svelte', 'https://svelte.dev/')}
				{@render user('/images/ionicons.png', 'ionicons', 'https://ionic.io/ionicons')}
				{@render user('/images/tom.webp', 'tom', 'https://www.instagram.com/myspacetom/')}
			</div>
		</div>
	</div>

	<div class="bottom">
		<div class="comments">
			<span class="orange-header">{displayName}'s Friends Comments</span>
			<span class="transparent-header">
				Displaying {Math.min(comments.amount, comments.perPage)} of {comments.amount} comments (<a
					href="https://github.com/jthawme/svelte-myspace-player/issues/1"
					target="_blank"
					rel="external">Add comment</a
				>)
			</span>

			{#each comments.items as comment (comment.id)}
				<div class="comment">
					<div class="comment-user">
						{@render user(comment.user.avatar_url, comment.user.login, comment.user.html_url)}
					</div>
					<div class="comment-body">
						<span class="comment-body-time"
							>{dateFormatter.format(new Date(comment.created_at))}</span
						>

						{@html comment.body_html}
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>

<footer>
	<nav>
		{#each navLinks as link, index (index)}
			<span>
				<a href={link[0]} rel="external" target="_blank">{link[1]}</a>
			</span>
		{/each}
	</nav>

	<p>1992-Present jthaw.me. All Rights Reserved.</p>
</footer>

<style>
	header,
	nav,
	main,
	footer {
		width: 95%;
		max-width: 950px;

		margin: 0 auto;
	}

	@media (min-width: 950px) {
		header,
		nav,
		main,
		footer {
			width: 100%;
		}
	}

	header {
		background-color: var(--color-myspace-blue-1);
		color: white;

		display: flex;

		justify-content: space-between;

		padding: 0.6em 0.8em 2em;
	}

	header a {
		color: white;
	}

	.top-nav {
		background-color: var(--color-myspace-blue-2);
		color: white;
	}

	.top-nav a {
		color: white;
	}

	nav {
		display: flex;

		justify-content: center;
		flex-wrap: wrap;

		padding: 0.2rem 0.5rem;
	}

	nav span:not(:last-child):after {
		content: '|';
		color: black;

		margin: 0 0.5rem;
	}

	main {
		display: grid;

		background-color: white;
	}

	@media (min-width: 950px) {
		main {
			grid-template-columns: 2fr 3fr;
		}
	}

	.left,
	.right,
	.bottom {
		padding: 2rem;

		min-width: 0;
	}

	.contact-table {
		display: grid;

		grid-template-columns: 1fr 1fr;

		align-items: center;

		margin: 0.5em;
	}

	.contact-table a {
		padding: 0.25em;
	}

	.bottom {
		grid-column: 1 / -1;
	}

	.comments {
		max-width: 560px;

		margin: 0 auto;
	}

	.comments .orange-header {
		width: 90%;
	}
	.comments .transparent-header {
		display: block;
		margin-bottom: 0.5em;
	}

	.comment {
		display: grid;

		grid-template-columns: 1fr 4fr;
		gap: 0.2rem;

		margin: 0.1rem 0;
	}

	.comment-user {
		background-color: var(--color-myspace-orange-3);

		padding: 0.5rem 1rem;
	}

	.comment-body {
		background-color: var(--color-myspace-orange-4);

		padding: 0.5rem 0.2rem;
	}

	.comment-body-time {
		font-weight: bold;
	}

	.user {
		display: flex;

		flex-direction: column;

		align-items: center;

		gap: 0.75rem;
	}

	.user-name {
		font-weight: bold;
	}

	.user-image {
	}

	footer {
		text-align: center;
	}

	.url-box {
		border: 1px solid var(--color-table-header);
		font-size: 0.8rem;

		padding: 0.2em;
	}

	.friends {
		display: grid;

		grid-template-columns: repeat(4, 1fr);
		gap: 1.5em;

		margin-top: 0.5em;

		padding-left: 0.5em;
	}

	h1 {
		font-size: 1.2rem;

		margin: 0;
	}

	.profile {
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: 1rem;

		align-items: center;

		margin-top: 1rem;
	}

	.usage {
		display: block;

		overflow: auto;
	}

	.demo-row {
		margin: 1rem 0;
	}

	.demo-row button {
		border: none;
		outline: none;

		padding: 0;
		margin: 0;

		appearance: none;
		cursor: pointer;

		background-color: transparent;
	}

	details.permanent summary::marker {
		font-size: 0;
	}
</style>
