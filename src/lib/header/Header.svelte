<script lang="ts">
import { page } from '$app/stores';
import StacksAuthStore from '../../stores/StacksAuthStore.js'
import StacksAuthService from '$lib/service/StacksAuthService.js'
import Dropdown from '../../shared/Dropdown.svelte'
import WalletConnectButton from './WalletConnectButton.svelte'
import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
import IconButton from '@smui/icon-button';
import type { TopAppBarComponentDev } from '@smui/top-app-bar';
import { mdiGithub, mdiDiscord } from '@mdi/js';
import { Svg } from '@smui/common/elements';
import Button from '@smui/button';
import { Label, Icon } from '@smui/common';
import type { MenuComponentDev } from '@smui/menu';
import Menu from '@smui/menu';
import List, { Item, Separator, Text } from '@smui/list';
 
let menu: MenuComponentDev;
let items = [
	"{$StacksAuthStore.stxAddress}",
	""
]

const logout = () => {
	StacksAuthService.logout()
}
const handleDropdownClick = (data: CustomEvent<any>) => {
	console.log(data)
}

let topAppBar: TopAppBarComponentDev;

let lightTheme =
	typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;
const switchTheme = () => {
	lightTheme = !lightTheme;
	let themeLink = document.head.querySelector<HTMLLinkElement>('#theme');
	if (!themeLink) {
		themeLink = document.createElement('link');
		themeLink.rel = 'stylesheet';
		themeLink.id = 'theme';
	}
	themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;
	document.head
		.querySelector<HTMLLinkElement>('link[href$="/smui-dark.css"]')
		?.insertAdjacentElement('afterend', themeLink);
}
</script>
<div class="text-center py-2">
	Under Construction - <a href="https://discord.com/channels/621759717756370964/971037457661444156" target="_blank">Join the Conversation about this app on discord!</a>
</div>
<TopAppBar bind:this={topAppBar} style="height: 60px;">
	<Row>
		<Section>
			<Title><a href="/"><img height="30px" src="img/logo.png" alt="stx ecosystem dao"/> eDAO</a></Title>
		</Section>
		<Section align="end" toolbar>
			<span class="mx-2">
				<a  class:active={$page.url.pathname === '/dao'} href="/dao">DAO</a>
			</span>
			<span class="mx-2">
				<a class:active={$page.url.pathname === '/sips'} href="/sips">SIPs</a>
			</span>
			<span class="mx-2">
			{#if $StacksAuthStore.loggedIn}
				<Dropdown on:handleDropdownClick={(data) => {handleDropdownClick(data)}}>
					<span slot="label">Account</span>
					<div id="myDropdown" class="dropdown-content">
						<div class="p-3">{$StacksAuthStore.stxAddress}</div>
						<div class="p-3"><a href="/stxdao/sip-landing">SIPs</a></div>
						<div class="p-3"><a href="/stxdao/proposals">Proposals</a></div>
						<div class="p-3"><a on:click|preventDefault={logout} href="/">Logout</a></div>
					</div>
				</Dropdown>
			{:else}
				<WalletConnectButton />
			{/if}
			</span>
			<IconButton aria-label="GitHub" href="https://github.com/Clarity-Innovation-Lab/stxeco-svelte">
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiGithub} />
				</Icon>
			</IconButton>
			<IconButton aria-label="Discord Site" href="https://discord.com/channels/621759717756370964/971037457661444156">
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiDiscord} />
				</Icon>
			</IconButton>
		</Section>
		<AutoAdjust {topAppBar} style="display: flex; justify-content: space-between;">
			<div class="container"><slot /></div>
			<div class="container">
			</div>
		</AutoAdjust>
	</Row>
</TopAppBar>

<style>
a:hover {
		color: var(--accent-color);
	}
 
</style>
