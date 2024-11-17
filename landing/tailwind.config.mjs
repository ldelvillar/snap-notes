/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
			"primary": "#ff553e"
		},
		extend: {
			clipPath: {
				'custom-hero': 'polygon(79% 0, 87% 52%, 100% 52%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0 0)',
			}
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
			  	'.clip-custom-hero': {
					clipPath: 'polygon(79% 0, 87% 52%, 100% 52%, 100% 80%, 100% 100%, 0 100%, 0% 80%, 0 0)',
			  	}
			})
		}
	],
}
