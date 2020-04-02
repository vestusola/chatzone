<template>
  <Page>
    <ActionBar class="action-bar">
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <Image src="~/images/avatar_2.png" class="thumb"></Image>
      <Label text="John Doe" class="color_blue" textWrap="true" horizontalAlignment="center"></Label>
    </ActionBar>

    <StackLayout class="msger">
      <!-- DIRECT CHAT -->
      <StackLayout class="msger-chat" height="90%">
        <ListView for="item in items" height="100%" separatorColor="transparent">
          <v-template>
            <StackLayout :class="item.is_you ? 'msg right-msg' : 'msg left-msg'">
              <StackLayout class="msg-bubble">
                <Label class="msg-info">
                  <Label class="msg-info-name">{{ item.fullname }}</Label>
                  <Label class="msg-info-time pull-right">{{ item.when }}</Label>
                </Label>
                <Label class="msg-text" :text="item.text"></Label>
              </StackLayout>
            </StackLayout>
          </v-template>
        </ListView>
        <!-- Conversations are loaded here -->
      </StackLayout>
      <StackLayout height="10%" class="send-msg-form">
        <GridLayout rows="*" columns="*,auto" class="form">
          <TextField hint="Type here" class="input input-rounded" row="0" col="0" />
          <Button @tap="sendMessage" row="0" class="btn btn-primary btn-rounded-lg" col="1">
            <Label class="material-icons" text.decode="\ue163"></Label>
          </Button>
        </GridLayout>
      </StackLayout>
    </StackLayout>
  </Page>
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
    };
  },
  methods: {
    checkAuthentication() {
      this.$store.dispatch("loadFromStorage");
      if (this.token == null) {
        this.$navigateTo(Login, {
          clearHistory: true,
          transition: "SlideLeft"
        });
      }
    },
    getTempData() {
      this.items = [];
      this.items.push(
        {
          fullname: "Festus Oyeleye",
          text: "Hi",
          when: this.getTime(),
          is_you: true
        },
        {
          fullname: "John Doe",
          text: "How are you?",
          when: this.getTime(),
          is_you: false
        },
        {
          fullname: "John Doe",
          text: "It's been a while.",
          when: this.getTime(),
          is_you: false
        },
        {
          fullname: "Festus Oyeleye",
          text: "Yeah, it is. How are your family?",
          when: this.getTime(),
          is_you: true
        },
        {
          fullname: "John Doe",
          text: "They are good and yours?",
          when: this.getTime(),
          is_you: false
        },
        {
          fullname: "Festus Oyeleye",
          text: "\u263A\u263A\u263A. Good.",
          when: this.getTime(),
          is_you: true
        }
      );
    },
    getTime() {
      var now = new Date();
      var hours = now.getHours();
      var time =
        hours == 12
          ? "12" + ":" + now.getMinutes() + ":" + (hours < 13 ? "AM" : "PM")
          : (hours % 12) +
            ":" +
            now.getMinutes() +
            ":" +
            (hours < 13 ? "AM" : "PM");
      return time;
    },
    sendMessage() {
      return false;
    }
  },
  beforeMount() {
    this.checkAuthentication();
  },
  mounted() {
    this.getTempData();
  },
  computed: {
    token: {
      get() {
        return this.$store.state.token;
      },
      set(newValue) {
        return this.$store.dispatch("setToken", newValue);
      }
    },
    info: {
      get() {
        return this.$store.state.info;
      },
      set(newValue) {
        return this.$store.dispatch("setInfo", newValue);
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
.thumb {
  border-radius: 50%;
  height: 60;
  width: 60;
}
.send-msg-form {
  padding-right: 5;
  padding-left: 5;
}
/*
  * Component: Chat
  * ----------------------
  */
.msger {
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border-color: #ddd;
  border-radius: 5;
  box-shadow: 0 15 15 -5 rgba(0, 0, 0, 0.2);
}
.msger-chat {
  flex: 1;
  padding: 10;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
.msg {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10;
  &:last-of-type {
    margin: 0;
  }
}
.msg-img {
  width: 50;
  height: 50;
  margin-right: 10;
  background-color: #ddd;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
}
.msg-bubble {
  padding: 15;
  border-radius: 15;
  background-color: #ececec;
  &::before {
    margin-top: 5;
  }
  &::after {
    margin-bottom: 5;
  }
}
.msg-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10;
}
.msg-info-name {
  margin-right: 8;
  font-weight: bold;
  font-size: 10;
}
.msg-info-time {
  margin-left: 8;
  font-size: 10;
}
.left-msg .msg-bubble {
  width: auto;
  max-width: 60%;
  border-bottom-left-radius: 0;
}
.right-msg {
  flex-direction: row-reverse;
}
.right-msg .msg-bubble {
  width: auto;
  max-width: 60%;
  background-color: #579ffb;
  color: #fff;
  border-bottom-right-radius: 0;
}
.right-msg .msg-img {
  margin: 0 0 0 10;
}
.msger-chat {
  background-color: #fcfcfe;
}
.msg-text {
  font-size: 12;
}
</style>