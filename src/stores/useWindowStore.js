// stores/windowStore.js
import { defineStore } from "pinia";
import { watch } from "vue";
import WelcomeWindow from "../components/WelcomeWindow.vue";
import DevelopersWindow from "../components/DevelopersWindow.vue";
import IframeWindow from "../components/IframeWindow.vue";
import defaultAppIcon from "../assets/default_app_icon.png";
import startIcon from "../assets/start-icon.png";

export const useWindowStore = defineStore("windowStore", {
	setup() {
		const store = useWindowStore();
		watch(
			() => store.$state,
			(newState) => {
				localStorage.setItem("my-window-store", JSON.stringify(newState));
			},
			{ deep: true }
		);

		return store;
	},
	state: () => {
		const defaultState = {
			windows: [
				{
					id: 0,
					zIndex: 100,
					title: "Welcome to Windoge98",
					icon: startIcon,
					visible: true,
					active: true,
					maximised: false,
					type: "welcome",
					subType: "unknown",
					dimensions: {
						height: 570,
						width: 600,
						x: 100,
						y: 5,
					},
				},
				{
					id: 1,
					zIndex: 1,
					title: "Developers",
					icon: defaultAppIcon,
					visible: true,
					active: false,
					maximised: false,
					type: "developers",
					subType: "unknown",
					dimensions: {
						height: 440,
						width: 600,
						x: 200,
						y: 400,
					},
				},
			],
			highestZIndex: 100,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight - 40,
			// Add more default state properties if needed
		};

		// Load state from local storage if available
		const savedState = localStorage.getItem("my-window-store");
		return savedState ? JSON.parse(savedState) : defaultState;
	},
	actions: {
    persistToLocalStorage() {
      localStorage.setItem("my-window-store", JSON.stringify(this.windows));
    },
		activateWindow(id) {
			this.windows.forEach((w) => {
				w.active = w.id === id;
				if (w.active) {
					this.highestZIndex++;
					w.zIndex = this.highestZIndex;
				} else {
					w.zIndex = 1;
				}
			});
			this.getWindowById(id).visible = true;
		},

		closeWindow(id) {
			const index = this.windows.findIndex((w) => w.id == id);
			if (index !== -1) {
				this.windows.splice(index, 1);
			}
		},

		maximiseWindow(id) {
			const win = this.windows.find((w) => w.id === id);
			if (win) {
				win.maximised = !win.maximised;
			}
		},

		minimiseWindow(id) {
			// Implementation depends on how you want to handle minimization
			const win = this.windows.find((w) => w.id === id);
			if (win) {
				win.visible = false;
			}
			windows[-1].active = true;
			windows[-1].zIndex = this.highestZIndex;
		},

		onResize(id, left, top, width, height) {
			const win = this.windows.find((w) => w.id === id);
			if (win) {
				win.dimensions.x = left;
				win.dimensions.y = top;
				win.dimensions.width = width;
				win.dimensions.height = height;
			}
		},
    onDragEnd(id, left, top) {
      const winIndex = this.windows.findIndex((win) => win.id === id);
      if (winIndex !== -1) {
        this.windows[winIndex].dimensions.x = left;
        this.windows[winIndex].dimensions.y = top;
      }
    },  
	},

	getters: {
		getWindowById: (state) => (id) => {
			return state.windows.find((w) => w.id === id);
		},

		getComponentForWindowType: (state) => (windowData) => {
			switch (windowData.type) {
				case "welcome":
					return { component: WelcomeWindow, props: {} };
				case "developers":
					return { component: DevelopersWindow, props: {} };
				default:
					return {
						component: IframeWindow,
						props: {
							title: windowData.title,
							url: windowData.url,
							// onMount: windowData.init, // If you have specific initialization logic
						},
					};
			}
		},
	},
	persist: {
		enabled: true,
		strategies: [
			{
				key: "my-window-store",
				storage: localStorage, // You can also use sessionStorage
			},
		],
	},
});
