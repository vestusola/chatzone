<template>
  <Page>
    <ActionBar class="action-bar">
      <Label style="color: #30bcff;" text="ChatZone" horizontalAlignment="center" />
      <ActionItem android.position="popup" text="New Group" />
      <ActionItem android.position="popup" @tap="goToSettings" text="Settings" />
      <ActionItem android.position="popup" @tap="goToChat" text="Chat" />
    </ActionBar>

    <BottomNavigation selectedIndex="0">
      <TabStrip>
        <TabStripItem title="Chats" class="material-icons" iconSource="res://ic_chat_black_24"></TabStripItem>
        <TabStripItem title="Groups" class="material-icons" iconSource="res://ic_forum_black_24"></TabStripItem>
        <TabStripItem title="People" class="material-icons" iconSource="res://ic_people_black_24"></TabStripItem>
      </TabStrip>

      <TabContentItem>
        <ChatList />
      </TabContentItem>
      <TabContentItem>
        <GroupList />
      </TabContentItem>
      <TabContentItem>
        <People />
      </TabContentItem>
    </BottomNavigation>
  </Page>
</template>

<script>
import axios from "axios";
import Login from "./Login";
import Chat from "./Chat";
import ChatList from "./ChatList";
import GroupList from "./GroupList";
import People from "./People";
import Setting from "./Setting";
import api from "~/shared/snackbar/index";
// import { mapGetters } from "vuex";

const applicationSettings = require("tns-core-modules/application-settings");

export default {
  components: {
    GroupList,
    ChatList,
    People,
    Setting,
    Login
  },
  data() {
    return {};
  },
  methods: {
    goToSettings() {
      this.$navigateTo(Setting, {
        transition: "SlideRight"
      });
    },
    goToChat() {
      this.$navigateTo(Chat, {
        transition: "SlideRight"
      });
    },
    logout({ commit }) {
      this.$store.commit("CLEAR_AUTH");
    },
    checkAuthentication() {
      this.$store.dispatch("loadFromStorage");
      if (this.token == null) {
        this.$navigateTo(Login, {
          clearHistory: true,
          transition: "SlideLeft"
        });
      }
    }
  },
  beforeMount() {
    //this.checkAuth();
  },
  computed: {
    // token: {
    //   get () {
    //     return this.$store.state.token
    //   },
    //   set (newValue) {
    //     return this.$store.dispatch('setToken', newValue)
    //   }
    // },
    // info: {
    //   get() {
    //     return this.$store.state.info
    //   },
    //   set (newValue) {
    //     return this.$store.dispatch('setInfo', newValue)
    //   }
    // }
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

.fas {
  font-family: "Font Awesome 5 Free";
  font-style: normal;
  font-weight: 900;
}
</style>