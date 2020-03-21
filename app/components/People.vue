<template>
  <StackLayout>
    <SearchBar
      hint="Search"
      v-model="search"
      @clear="onClear"
      @submit="searchPerson"
    />

    <ListView class="list-group" :items="people" seperatorColor="black" height="100%">
      <v-template>
        <GridLayout rows="auto, auto" columns="auto,*,auto" class="list-group-item">
          <Image row="0" col="0" rowSpan="2" :src="item.image" v-if="item.image != undefined || item.image != null" class="thumb"></Image>
          <Image row="0" col="0" rowSpan="2" src="~/images/avatar.png" class="thumb"/>
          <Label row="0" col="1" colSpan="2" :text="item.fullname"></Label>
        </GridLayout>
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script>
import axios from "axios";
var app = require("application");
const permissions = require("nativescript-permissions");
const applicationSettings = require("tns-core-modules/application-settings");

const contacts = require("nativescript-contacts");
import notify from "~/shared/snackbar/index";
import { url } from "~/shared/api";
import { mapGetters } from "vuex";

// Configure notify color
const successType = "#51a351";
const errorType = "#bd362f";
const infoType = "#2f96b4";
const warningType = "#f89406";

// component
import Login from './Login';

export default {
  data() {
    return {
      search: "",
      searchResults: [],
      no_record: true,
      people: [],
      user: {
        email: '',
        phone: ''
      }
    };
  },
  methods: {
    onClear() {
      this.search = "";
      this.searchResults = [];
      this.no_record = false;
    },
    searchPerson() {
      this.searchResults = [];
      this.no_record = false;
      if (this.search != "" || this.search.length > 0 || this.search != null) {
        console.log(this.search);
        axios.get(`${url}/people/request/${this.search}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.token
          }
        }).then(response => {
          if (response.status == 200) {
            this.users = response.data.data;
          } else {
            this.users = response.data.data;
          }
        }).catch(error => {
          notify(error.message, errorType);
        })
      } else {
        this.search = '';
      }
    },
    showContacts() {
      let vm = this;
      permissions.requestPermissions([android.Manifest.permission.READ_CONTACTS, android.Manifest.permission.WRITE_CONTACTS], "Permission to read contacts").then(() => {
         console.log("Permission granted!");
         contacts.getAllContacts(['name', 'phoneNumbers', 'emailAddresses']).then(async args => {
          let records = args.data;
          for (var i = 0; i < records.length; i++) {
            if (records[i].phoneNumbers.length > 0) {
              vm.user.phone = records[i].phoneNumbers[0].value
            }

            if (records[i].emailAddresses.length > 0) {
              vm.user.email = records[i].emailAddresses[0].value
            }

            await axios.post(`${url}/people/request`, {
              email: vm.user.email,
              phone: vm.user.phone
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token
              }
            }).then(response => {
              if (response.status == 200) {
                if (response.data.data != null) {
                  vm.people.push(response.data.data);
                }
              } else {
                notify(response.data.message, errorType);
              }
            });
          }
         });
      }).catch(() => {
        notify('Unable to read contact. Are you sure, you allow chatzone to read your contact.', errorType);
      })
    },
    checkAuthentication() {
      this.$store.dispatch("loadFromStorage");
      if (this.token == null) {
        this.$navigateTo(Login, {
          clearHistory: true,
          transition: "SlideLeft"
        })
      }
    }
  },
  beforeMount(){
    this.checkAuthentication()
  },
  mounted() {
    this.showContacts();
  },
  computed: {
    token: {
      get () {
        return this.$store.state.token
      },
      set (newValue) {
        return this.$store.dispatch('setToken', newValue)
      }
    },
    info: {
      get() {
        return this.$store.state.info
      },
      set (newValue) {
        return this.$store.dispatch('setInfo', newValue)
      }
    }
  },
};
</script>

<style scoped lang="scss">
  @import "../app-variables";
  @import "../app-common";

  // End custom common variables

  // Custom styles
  .fa {
    color: $accent-dark;
  }

  .info {
    font-size: 20;
  }

  .fas {
    font-family: "Font Awesome 5 Free";
    font-style: normal;
    font-weight: 900;
  }

  .mdi {
    font-family: "MaterialIcon Regular", "MaterialIcon";
    font-style: normal;
  }

  .thumb {
    border-radius: 50%;
    height: 60;
    width: 60;
  }
</style>