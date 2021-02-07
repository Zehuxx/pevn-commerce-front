<style>
@import "../assets/styles/createCommerce.css";
</style>
<template>
  <v-container fluid fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <h1>Agregar comercio</h1>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="6">
        <v-alert
        v-model="alert"
        dismissible
        type="error"
        border="left"
        elevation="2"
        colored-border
        >
        <ul>
          <li class="red--text" v-for="error in serverErrors" :key="error.message">{{error.msg}}</li>
        </ul>
        
        </v-alert>
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="createCommerce()"
          lazy-validation
        >
          <v-text-field
            v-model="commerce.name"
            :counter="40"
            prepend-icon="mdi-format-title"
            :rules="nameRules"
            label="Nombre del comercio"
            required
          ></v-text-field>

          <v-text-field
            v-model="commerce.owner_name"
            :counter="40"
            prepend-icon="mdi-account"
            :rules="owner_nameRules"
            label="Nombre del propietario"
            required
          ></v-text-field>

          <v-text-field
            v-model="commerce.address"
            :counter="100"
            prepend-icon="mdi-map-marker"
            :rules="addressRules"
            label="Dirección"
            required
          ></v-text-field>

          <v-select
            v-model="commerce.commerceType"
            :items="commerceTypes"
            @change="commerceTypeChange($event)"
            :rules="commerceTypeRules"
            prepend-icon="mdi-view-sequential"
            label="Tipo de comercio"
            item-text="name"
            item-value="id"
            required
          >
          </v-select>

          <template v-if="commerce.commerceType">
            <h5 class="ml-8">Sub tipo de comercio</h5>
            <v-radio-group
              v-model="commerce.id_cst"
              :rules="commerceSubTypeRules"
              prepend-icon="mdi-home-modern"
              mandatory
              row
            >
              <v-radio
                v-for="commerceSubType in commerceSubTypes"
                :key="commerceSubType.id"
                :label="commerceSubType.name"
                :value="commerceSubType.id"
              ></v-radio>
            </v-radio-group>
          </template>

          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="commerce.fundation_date"
            transition="scale-transition"
            offset-y
            max-width="290"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="commerce.fundation_date"
                label="Fecha de fundación del commercio"
                :rules="fundationDateRules"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="commerce.fundation_date"
              no-title
              scrollable
              locale="es-419"
              :max="maxDate"
            >
              <v-btn text color="primary" @click="menu = false">
                Cancelar
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(commerce.fundation_date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-row justify="start" class="ml-8 my-4">
            <v-btn
              :disabled="!valid"
              color="primary"
              align="right"
              type="submit"
            >
              Guardar
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    commerceTypes: [],
    commerceSubTypes: [],
    serverErrors:[],
    alert:false,
    commerce: {
      name: "",
      owner_name: "",
	    address: "",
	    commerceType: null,
      id_cst: null,
      fundation_date: null,
    },
    valid: true,
    menu: false,
    nameRules: [
      (v) => !!v || "Nombre del comercio es requerido",
      (v) =>
        (v && v.length >= 5 && v.length <= 40 ) ||
        "El nombre del comercio debe de tener entre 5 y 40 caracteres",
    ],
    owner_nameRules: [
      (v) => !!v || "Nombre del propietario es requerido",
      (v) =>
        (v && v.length >= 5 && v.length <= 40) ||
        "El nombre del propietario debe de tener entre 5 y 40 caracteres",
    ],
    addressRules: [
      (v) => !!v || "La Dirección es requerida",
      (v) =>
        (v && v.length <= 100) ||
        "La Dirección debe de tener no mas de 100 caracteres",
    ],
    commerceTypeRules: [(v) => !!v || "Tipo de comercio es requerido"],
    commerceSubTypeRules: [(v) => !!v || "Sub tipo de comercio es requerido"],
    fundationDateRules: [(v) => !!v || "Fecha de fundación es requerida"],
  }),
  computed: {
    maxDate() {
      var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    }
  },
  created() {
    this.getCommerceTypes();
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    commerceTypeChange(val) {
      this.commerce.commerceType = val;
      this.commerce.id_cst = null;
      if (this.commerce.commerceType) {
        this.commerceSubTypes = this.commerceTypes.find(
          (x) => x.id === this.commerce.commerceType
        ).commercesubtype;
      } else {
        this.commerce.id_cst = null;
        this.commerceSubTypes = [];
      }
    },
    async getCommerceTypes() {
      try {
        let data = await this.axios.get("/commercetypes/");
        this.commerceTypes = data.data.commerceTypes;
      } catch (err) {
        this.commerceTypes = [];
        console.log(err);
      }
    },
    async createCommerce() {
      console.log(this.commerce);
      let valid = this.$refs.form.validate();
      if (valid) {
		  this.valid=!this.valid; 
        await this.axios
          .post("/commerces/create", this.commerce)
          .then((resp) => {
            this.$router.push({ name: "commerces" });
          })
          .catch((err) => {
            err = err.response;
            if(err.status == 400){
              this.serverErrors = err.data.errors;
              this.alert = true;
            }else{
              this.serverErrors=[];
              this.alert = false;
            }
            this.valid=!this.valid;
          });
      }
    }
  },
};
</script>
