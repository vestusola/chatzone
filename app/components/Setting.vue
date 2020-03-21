<template>
  <Page>
    <ActionBar>
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <Label textWrap="true" text="Settings" horizontalAlignment="center" />
    </ActionBar>

    <FlexboxLayout>
      <GridLayout rows="auto,auto" columns="auto,auto" class="list-group-item" height="100%">
        <StackLayout row="0">
          <Image row="0" v-if="info.image != null" col="0" :src="info.image" class="thumb"></Image>
          <Image row="0" v-else col="0" src="~/images/avatar.png" class="thumb"></Image>
          <Label row="0" col="1" class="font-weight-bold" :text="info.fullname"></Label>
        </StackLayout>
        <StackLayout row="1">
          <Label row="1" col="0" colSpan="2" class="font-weight-bold" @tap="logout" text="Logout"></Label>
        </StackLayout>
      </GridLayout>
    </FlexboxLayout>
  </Page>
</template>

<script>
import axios from "axios";
import api from "~/shared/snackbar/index";
import { mapGetters } from 'vuex';
const applicationSettings = require("tns-core-modules/application-settings");

export default {
  data() {
    return {

    };
  },
  methods: {
    checkAuthentication() {
      this.$store.dispatch("loadFromStorage");
      if(this.token == null) {
        this.$navigateTo(Login, {
          clearHistory: true,
          transition: "SlideLeft"
        })
      }
    },
    logout({ commit }) {
      this.$store.commit("CLEAR_AUTH");
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
  beforeMount() {
    this.checkAuthentication()
  }
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

  .thumb {
    border-radius: 50%;
    width: 50;
    height: 50;
  }

  .list-group.list-group-item {
    color: #212121;
    font-size: 16;
    margin: 0;
    padding: 16;
  }

  .list-group .list-group-item label {
    vertical-align: center;
  }

  .list-group .list-group-item .thumb {
    stretch: fill;
    width: 50;
    height: 50;
    margin-right: 16;
  }

  .list-group .list-group-item.active {
    background-color: #e0e0e0;
  }

  .list-group .list-group-item .list-group-item-text {
    color: #757575;
    font-size: 14;
  }
</style>