<template>
	<v-app>
		<v-navigation-drawer v-model="drawer" fixed>
			<v-list>
				<v-list-item-group v-model="group">
					<v-list-item v-for="(item, i) in items" :key="i" @click="goToCommerces()">
						<v-list-item-icon>
							<v-icon v-text="item.icon"></v-icon>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title v-text="item.text"></v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar app color="primary" dark>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title>APP Title</v-toolbar-title>
		</v-app-bar>

		<v-main>
			<router-view></router-view>
		</v-main>

		<v-footer absolute app class="footer-style">
			<v-col class="text-center" cols="12">
				{{ new Date().getFullYear() }} — <strong>Juan Soler</strong>
			</v-col>
		</v-footer>
	</v-app>
</template>

<script>
export default {
  name: "App",

  //  components: {
  //    HelloWorld,
  //  },

  data: () => ({
    items: [
      {
        icon: "mdi-inbox",
        text: "Commercios",
        route: "/commerces",
      },
      {
        icon: "mdi-star",
        text: "Star",
        route: "#",
      },
      {
        icon: "mdi-send",
        text: "Send",
        route: "#",
      },
      {
        icon: "mdi-email-open",
        text: "Drafts",
        route: "#",
      },
    ],
    model: 1,
    drawer: false,
    group: null,
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    goToCommerces() {
      this.$router.push({ name: "commerces" });
    },
  },
};
</script>
