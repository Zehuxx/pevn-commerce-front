<style>
@import "../assets/styles/commerces.css";
</style>
<template>
  <v-container fluid fill-height >
	<v-row justify="center">
	  <v-col
		class="my-0"
		cols="12"
		xs="12"
		sm="6"
		md="4"
		v-for="commerce in commerces"
		v-bind:key="commerce.id"
	  >
		<v-card
		  class="mx-auto"
		  max-width="400"
		  elevation="7"
		  outlined
		>
		  <v-card-title>{{ commerce.name }}</v-card-title>

		  <v-card-text>
			<v-row class="mx-0">
			  <div class="grey--text mb-4">
				<v-icon>mdi-account</v-icon>{{ commerce.owner_name }}
			  </div>
			</v-row>
			<v-row class="mx-0">
			  <div class="grey--text mb-4">
				<v-icon>mdi-home-modern</v-icon
				>{{ commerce.commercesubtype.name }}
			  </div>
			</v-row>
			<v-row class="mx-0">
			  <div class="grey--text mb-4">
				<v-icon>mdi-map-marker</v-icon>{{ commerce.address }}
			  </div>
			</v-row>
			<v-row class="mx-0">
			  <v-col class="pl-0 py-0 mb-2" md="12" sm="12" xs="12">
				<v-chip outlined>
				  <v-icon left> mdi-calendar </v-icon>
				  {{ commerce.fundation_date }}
				</v-chip>
				<v-btn
				  color="success mr-10"
				  right
				  absolute
				  bottom
				  fab
				  x-small
				  @click="goToUpdateCommerce(commerce.id)"
				>
				  <v-icon>mdi-pencil</v-icon>
				</v-btn>
				<v-btn
				  color="error"
				  right
				  absolute
				  bottom
				  fab
				  x-small
				  @click="deleteCommerce(commerce.id)"
				>
				  <v-icon>mdi-delete</v-icon>
				</v-btn>
			  </v-col>
			</v-row>
		  </v-card-text>
		</v-card>
	  </v-col>
	  <v-col cols="12">
		<v-pagination
		  v-model="currentPage"
		  :length="totalPages"
		  @input="handlePageChange"
		></v-pagination>
	  </v-col>
	</v-row>
	<v-btn
        fab
		color="primary"
		fixed
        bottom
        right
        class="bt-create-commerces-style mb-4"
		@click="goToCreateCommerce()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
  </v-container>
</template>

<script>
export default {
  data: () => ({
	commerces: [],
	currentPage: 1,
	totalPages: 0,
	pageSize: 6,
  }),
  created() {
	this.getCommerces();
  },
  computed: {
	classObject() {
	  switch (this.$vuetify.breakpoint.name) {
		case "lg":
		  return "text-right";
		  break;
		default:
		  break;
	  }
	},
  },
  methods: {
	goToCreateCommerce() {
      this.$router.push({ name: "createCommerce" });
	},
	goToUpdateCommerce(id) {
      this.$router.push({ name: "updateCommerce", params:{ id } });
    },
	handlePageChange(pageVal) {
	  this.currentPage = pageVal;
	  this.getCommerces();
	},
	async getCommerces() {
		try {
			let data = await this.axios.get(`/commerces/${this.currentPage - 1}/${this.pageSize}`)
			this.commerces = data.data.commerces;
		  	this.totalPages = data.data.totalPages;
		} catch (error) {
			this.commerces = [];
		  	this.totalPages = 0;
		  	console.log(error);
		}
	},
	async deleteCommerce(id) {
		try {
			this.$swal({
			title: 'Estas seguro?',
			text: "No podras revertir esto!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, borrarlo!'
			}).then(async(result) => {
				if (result.isConfirmed) {
					await this.axios.delete(`/commerces/${id}`).then((res)=>{
						this.getCommerces();
						this.$swal(
						'Eliminado!',
						res.data.message,
						'success'
						)
					}).catch((err)=>{
						console.log(err);
					});
				}				
			});
		} catch (error) {
		  	console.log(error);
		}
	},
  },
};
</script>
