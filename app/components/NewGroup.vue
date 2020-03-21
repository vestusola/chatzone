<template>
  <StackLayout>
    <RadDataForm
      ref="peopleDataForm"
      :source="people"
      :metadata="peopleProperty"
      :validationMode="validationMode"
      :commitMode="commitMode"
    ></RadDataForm>
  </StackLayout>
</template>

<script>
import axios from "axios";
import api from "~/shared/snackbar/index";
import { mapGetters } from "vuex";
const applicationSettings = require("tns-core-modules/application-settings");

import {
  PropertyGroup,
  DataFormValidationMode,
  DataFormCommitMode
} from "nativescript-ui-dataform";
// Configure notify color
const successType = "#51a351";
const errorType = "#bd362f";
const infoType = "#2f96b4";
const warningType = "#f89406";
export default {
  data() {
    return {
      commitMode: DataFormCommitMode.Immediate,
      validationMode: DataFormValidationMode.OnLostFocus,
      people: {
        search: ""
      },
      peopleProperty: {
        propertyAnnotations: [
          {
            name: "search",
            displayName: "Email or Phone Number",
            index: 0,
            required: true,
            editor: "Text",
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "This field is required."
                }
              }
            ]
          }
        ]
      },
      isValid: true
    };
  },
  methods: {
    validateForm() {
      const search = this.$refs.peopleDataForm.getPropertyByName("search");

      if (
        search.valueCandidate == null ||
        search.valueCandidate == "" ||
        search.valueCandidate.length < 1
      ) {
        search.errorMessage = "This field is required.";
        this.$refs.peopleDataForm.notifyValidated("search", false);
        this.isValid = false;
      } else {
        this.$refs.peopleDataForm.notifyValidated("search", true);
      }

      if (this.isValid) {
        this.$refs.peopleDataForm.commitAll();
        this.searchPeople();
      }
      return false;
    },
    checkAuthentication() {
      this.$store.dispatch("loadFromStorage");
      if(this.token == null) {
        this.$navigateTo(Login, {
          clearHistory: true,
          transition: "SlideLeft"
        })
      }
    }
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
  beforeMount(){
    this.checkAuthentication()
  }
};
</script>

<style lang="scss">
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
</style>