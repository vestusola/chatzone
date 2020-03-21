<template>
  <StackLayout>
    <ListView class="list-group" for="item in items" @itemTap="goToChat" seperatorColor="black" height="100%">
      <v-template>
        <GridLayout rows="auto,auto" columns="auto,*,auto" class="list-group-item">
          <Image row="0" col="0" rowSpan="2" :src="item.image" class="thumb"></Image>
          <Label row="0" col="1" class="font-weight-bold" :text="item.fullname"></Label>
          <Label row="1" col="1" :text="item.text"></Label>
          <Label row="0" col="2" :text="item.when"
            class="time" :class.time-unread="item.unread > 0"></Label>
          <StackLayout row="1" col="2" orientation="horizontal" class="m-x-auto">
            <Label v-if="item.unread" :text="item.unread" class="unread"></Label>
          </StackLayout>
        </GridLayout>
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script>
  import axios from "axios";
  import Login from "./Login";
  import ChatList from "./ChatList";
  import GroupList from "./GroupList";
  import People from "./People";
  import Setting from "./Setting";
  import api from "~/shared/snackbar/index";
  import { mapGetters } from "vuex";

  const applicationSettings = require("tns-core-modules/application-settings");
  import { alert } from "tns-core-modules/ui/dialogs";
  export default {
    data() {
      return {
        items: []
      }
    },
    methods: {
      getTime() {
        var now = new Date();
        var hours = now.getHours();
        var time =  hours == 12 ? "12" + ":" + now.getMinutes() + ":" + (hours < 13 ? "AM": "PM" ) : hours % 12 + ":" + now.getMinutes() + ":" + (hours < 13 ? "AM": "PM" );
        return time;
      },
      getTempData() {
        this.items = [];
        this.items.push(
          {
            fullname: "Jonathan Doe",
            text: "Where are you?",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "Jane Doe",
            text: "\u263A That\'s the point.",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "McCarthy Roland",
            text: "When are you coming to work?",
            unread: 6,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "Isabella Houston",
            text: "I will definately be there.",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "Immanuella Mikel",
            text: "Wow! That\'s fine by me.",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "Tribett John",
            text: "Will Real Madrid win this night?",
            unread: 1,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "James Richard",
            text: "Where are you?",
            unread: 26,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "Samuel Jackson",
            text: "Where are you?",
            unread: 1,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "James Fortune",
            text: "Where are you?",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "Stonebridge Theresa",
            text: "Where are you?",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          }
        );
      },
      goToChat(args) {
        alert('I am clicked ');
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
    beforeMount() {
      this.checkAuthentication()
    },
    mounted() {
      this.getTempData();
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
    }
  };
</script>

<style scoped lang="scss">
  @import "../app";

  // End custom common variables

  // Custom styles
  .fa {
    color: $accent-dark;
  }
  .info {
    font-size: 20;
  }
  .time {
    color: #000000;
    font-size: 13;
    margin-right: 5;
  }
  .thumb {
    border-radius: 50%;
    height: 60;
    width: 60;
  }
  .muted {
    font-weight: normal;
    opacity: 0.4;
    font-size: 20;
  }
  .unread {
    font-size: 11;
    padding-top: 2;
    border-radius: 50%;
    background-color: #5bc0de;
    margin-right: 5;
    text-align: center;
    min-width: 20;
    min-height: 20;
    color: $white;
  }
  .unread.active,
  .unread:active {
    font-size: 11;
    padding-top: 2;
    border-radius: 50%;
    background-color: #31b0d5;
    margin-right: 5;
    text-align: center;
    min-width: 20;
    min-height: 20;
    color: $white;
  }
  .unread:hover {
    font-size: 11;
    padding-top: 2;
    border-radius: 50%;
    background-color: #31b0d5;
    margin-right: 5;
    text-align: center;
    min-width: 20;
    min-height: 20;
    color: $white;
  }
  .unread:active:hover,
  .unread.active:hover,
  .unread:active:focus,
  .unread.active:focus,
  .unread:active.focus,
  .unread.active.focus {
    font-size: 11;
    padding-top: 2;
    border-radius: 50%;
    background-color: #269abc;
    margin-right: 5;
    text-align: center;
    min-width: 20;
    min-height: 20;
    color: $white;
  }
  .time {
    &-unread {
      color: #fff;
    }
    color: #000000;
    font-size: 12;
    margin-right: 5;
  }
  .list-group.list-group-item {
    color: #212121;
    font-size: 16;
    margin: 0;
    padding: 16;
  }
  .list-group .list-group-item Label {
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