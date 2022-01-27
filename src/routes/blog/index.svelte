<script context="module">
	import { collection, preloader } from '../../fire'
  
	// The nice thing about initializing the posts
	// collection in this module script tag,
	// is that it is initialized only once.
	// Even when you navigate to another page and back again.
	const posts = collection('sites')
	export const preload = preloader(posts)
  </script>
  
  <style>
	ul {
	  margin: 0 0 1em 0;
	  line-height: 1.5;
	}
  </style>
  
  <svelte:head>
	<title>Blog</title>
  </svelte:head>
  
  <h1>Recent posts</h1>
  
  <ul>
	{#each $posts as post}
	  <!-- we're using the non-standard `rel=prefetch` attribute to
				  tell Sapper to load the data for the page as soon as
				  the user hovers over the link or taps it, instead of
				  waiting for the 'click' event -->
	  <li><a rel="prefetch" href="blog/{post.slug}">{post.title}</a></li>
	{/each}
  </ul>