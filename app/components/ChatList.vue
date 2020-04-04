<template>
  <StackLayout>
    <ListView class="list-group" for="item in items" @itemTap="goToChat" separatorColor="black" height="100%">
      <v-template>
        <GridLayout rows="auto,auto" columns="auto,*,auto" class="list-group-item">
          <Image row="0" col="0" rowSpan="2" :src="item.image" class="thumb"></Image>
          <Label row="0" col="1" class="font-weight-bold"  style="font-size: 16" :text="item.fullname"></Label>
          <Label row="1" col="1" :text="item.text" style="font-size: 14;"></Label>
          <Label row="0" col="2" :text="item.when"
            :class="item.unread > 0 ? 'time-unread': 'time'"></Label>
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
  import Chat from './Chat';
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
      getTempData() {
        this.items = [];
        this.items.push(
          {
            fullname: "Jonathan Doe",
            text: "Where are you?",
            unread: 0,
            when: "15:26",
            image: "~/images/user_1.jpg"
          },
          {
            fullname: "Jane Doe",
            text: "\u263A That\'s the point.",
            unread: 0,
            when: "08:12",
            image: "~/images/user_2.jpg"
          },
          {
            fullname: "McCarthy Roland",
            text: "When are you coming to work?",
            unread: 6,
            when: "12:26",
            image: "~/images/user_3.jpg"
          },
          {
            fullname: "Isabella Houston",
            text: "I will definately be there.",
            unread: 0,
            when: "13:00",
            image: "~/images/user_4.jpg"
          },
          {
            fullname: "Immanuella Mikel",
            text: "Wow! That\'s fine by me.",
            unread: 0,
            when: "09:21",
            image: "~/images/user_5.jpg"
          },
          {
            fullname: "Tribett John",
            text: "Will Real Madrid win this night?",
            unread: 1,
            when: "22:22",
            image: "~/images/user_6.jpg"
          },
          {
            fullname: "James Richard",
            text: "Where are you?",
            unread: 26,
            when: "12:01",
            image: "~/images/user_7.jpg"
          },
          {
            fullname: "Samuel Jackson",
            text: "Where are you?",
            unread: 1,
            when: "10:10",
            image: "~/images/user_8.jpg"
          },
        );
      },
      goToChat(args) {
        this.$emit("select", args.item);
        this.$navigateTo(Chat, {
          transition: "SlideRight"
        })
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
    color: #222;
    font-size: 14;
    font-weight: 400;
    margin-right: 5;
  }
  .thumb {
    border-radius: 50%;
  }
  .muted {
    font-weight: normal;
    opacity: 0.4;
    font-size: 20;
  }
  .unread {
    width: 24;
    height: 24;
    border-radius: 50%;
    padding-top: 2;
    background-color: #579ffb;
    margin-right: 5;
    text-align: center;
    color: $white;
    font-weight: 600;
    font-size: 14;
  }
  .time-unread {
    font-size: 14;
    font-weight: 600;
    color: #579ffb;
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