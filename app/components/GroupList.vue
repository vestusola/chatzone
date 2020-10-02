<template>
  <StackLayout>
    <ListView class="list-group" for="item in items" @itemTap="goToGroupChat" separatorColor="black" height="100%">
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
     <FloationActionButton
        @tap="addNewGroup"
        icon="res://ic_add_white"
        rippleColor="#f1f1f1"
        class="fab-button"
      ></FloationActionButton>
  </StackLayout>
</template>

<script>
  import axios from "axios";
  import Login from "./Login";
  import NewGroup from "./NewGroup";
  import GroupChat from "./GroupChat";
  import ChatList from "./ChatList";
  import GroupList from "./GroupList";
  import People from "./People";
  import Setting from "./Setting";
  import notify from "~/shared/snackbar/index";
  import { url } from "~/shared/api";
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
            fullname: "Rollar Cecilee Teams",
            text: "Where are you?",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar_2.png"
          },
          {
            fullname: "Undespised Keys \u263A",
            text: "\u263A That\'s the point.",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "FUTMINA DE 2020",
            text: "I'll keep you guys updated, when the POST-UTME screening start.",
            unread: 6,
            when: this.getTime(),
            image: "~/images/avatar.png"
          },
          {
            fullname: "RCCG Regional Choir",
            text: "I will definately be there.",
            unread: 0,
            when: this.getTime(),
            image: "~/images/avatar.png"
          }
        );
      },
      goToGroupChat(args) {
        this.$navigateTo(GroupChat, {
          transition: "SlideRight"
        });
      },
      checkAuthentication() {
        this.$store.dispatch("loadFromStorage");
        if(this.token == null) {
          this.$navigateTo(Login, {
            clearHistory: true,
            transition: "SlideLeft"
          })
        }
      },
      addNewGroup() {
        this.$navigateTo(NewGroup, {
          transition: "SlideRight"
        });
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
  .info {
    font-size: 20;
  }
  .time {
    color: #222;
    font-size: 14;
    font-weight: 500;
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
  .fab-button {
    height: 70;
    width: 70;
    margin: 15;
    background-color: #579ffb;
    horizontal-align: right;
    vertical-align: bottom;
  }
</style>