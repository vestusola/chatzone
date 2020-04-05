<template>
  <Page>
    <ActionBar class="action-bar">
      <NavigationButton @tap="$navigateBack()" android.systemIcon="ic_menu_back" />
      <StackLayout orientation="horizontal" android:horizontalAlignment="left">
        <WrapLayout>
          <Image src="~/images/user_1.jpg" width="40" height="40" class="thumb pull-left"></Image>
          <Label class="online" verticalAlignment="bottom" />
        </WrapLayout>
        <Label text="John Doe" class="action-bar-title" />
      </StackLayout>
      <ActionItem @tap="" android.systemIcon="ic_menu_call" />
      <ActionItem android.position="popup" @tap="" text="Profile Info" />
      <ActionItem android.position="popup" @tap="" text="Block Friend" />
    </ActionBar>

    <StackLayout class="msger">
      <!-- CHAT -->
      <StackLayout class="msger-chat" ref="maindiv" :height="mainHeight">
        <ListView for="item in items" height="100%" separatorColor="transparent">
          <v-template>
            <StackLayout class="msg">
              <StackLayout :class="item.is_you ? 'bubble alt' : 'bubble'">
                <StackLayout class="txt">
                  <WrapLayout class="message" textWrap="true" orientation="horizontal">
                    <Label class="msg-text" :text="item.text" textWrap="true"></Label>
                    <Label class="timestamp" horizontalAlignment="right">
                      <FormattedString>
                        <Span :text="item.when + ' '" />
                        <Span v-if="item.status == 'delivered'" class="fas" color="#000000" text.decode="&#xf00c;" />
                        <Span v-if="item.status == 'read'" class="fas" color="#579ffb" text.decode="&#xf00c;" />
                      </FormattedString>
                    </Label>
                  </WrapLayout>
                </StackLayout>
                <StackLayout :class="item.is_you ? 'bubble-arrow alt' : 'bubble-arrow'"></StackLayout>
              </StackLayout>
            </StackLayout>
          </v-template>
        </ListView>
        <!-- Conversations are loaded here -->
      </StackLayout>

      <!-- TextField form -->
      <StackLayout class="send-form" ref="subdiv" :height="subHeight" verticalAlignment="bottom">
        <GridLayout rows="auto" columns="*,auto" class="form">
            <TextView hint="Type a message" @focus="textFieldFocus" @blur="removeFocus" row="0" col="0" textWrap="true" v-model="message" ref="textview" class="input input-sides" />
            <StackLayout row="0" col="1" @tap="sendMessage" verticalAlignment="center">
              <Image src="res://ic_send_black_24" :tintColor="tintColor" width="40" height="40"></Image>
            </StackLayout>
        </GridLayout>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios";
import Login from "./Login";
import Home from "./Home";
import ChatList from "./ChatList";
import GroupList from "./GroupList";
import People from "./People";
import Setting from "./Setting";
import notify from "~/shared/snackbar/index";
import { url } from "~/shared/api";
import { mapGetters } from "vuex";

import * as application from "tns-core-modules/application";
import { AndroidApplication } from "tns-core-modules/application";
import { isAndroid } from "tns-core-modules/platform";
const applicationSettings = require("tns-core-modules/application-settings");
export default {
  data() {
    return {
      items: [],
      message: "",
      mainHeight: "88%",
      subHeight: "12%",
      tintColor: "#000000"
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
          when: "7:12 AM",
          status: "read",
          is_you: true
        },
        {
          fullname: "John Doe",
          text: "How are you?",
          when: "7:35 AM",
          status: "read",
          is_you: false
        },
        {
          fullname: "John Doe",
          text: "It's been a while.",
          when: "7:35 AM",
          status: "read",
          is_you: false
        },
        {
          fullname: "Festus Oyeleye",
          text: "Yeah, it is. How are your family?",
          when: "7:37 AM",
          status: "read",
          is_you: true
        },
        {
          fullname: "John Doe",
          text: "They are good and yours? 😄",
          when: "7:38 AM",
          status: "read",
          is_you: false
        },
        {
          fullname: "Festus Oyeleye",
          text: "\u263A\u263A\u263A. Good to hear that bro.",
          when: "7:40 AM",
          status: "read",
          is_you: true
        },
        {
          fullname: "John Doe",
          text: "Hope you're keeping up with the corona-virus trends. Its very bad here, movement has been restricted and it seems it will last for a long time.",
          when: "7:41 AM",
          status: "delivered",
          is_you: false
        }
      );
    },
    sendMessage() {
      console.log(`You typed: ${this.message}`);
      if (this.message == "") {
        return false;
      } else  {
        this.$refs.textview.nativeView.android.clearFocus();
        this.message = "";
        this.removeFocus();
      }
    },
    goToHome() {
      this.$navigateTo(Home, {
        transition: "SlideRight"
      });
    },
    textFieldFocus(args) {
      this.$refs.maindiv.nativeView.height = { unit: "%", value: 0.79 };
      this.$refs.subdiv.nativeView.height = { unit: "%", value: 0.21 };
    },
    removeFocus() {
      this.$refs.textview.nativeView.dismissSoftInput();
      this.$refs.maindiv.nativeView.height = { unit: "%", value: 0.88 };
      this.$refs.subdiv.nativeView.height = { unit: "%", value: 0.12 };
    },
    onBackKeyPressed() {
      console.log('I am clicked');
      let vm = this;
      application.android.on(AndroidApplication.activityBackPressedEvent, () => {
        vm.removeFocus();
      });
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
  },
  watch: {
    message() {
      console.log(this.message);
      if (this.message != "" || this.message.length > 0) {
        this.tintColor = "#579ffb";
      } else {
        this.tintColor = "#000000";
      }
    }
  }
};
</script>

<style scoped lang="scss">
  @import "../app";
  .send-form {
    padding-top: 5;
    padding-bottom: 3;
    padding-right: 5;
    padding-left: 5;
  }
  .form {
    padding-top: 3;
    padding-bottom: 3;
    padding-right: 10;
    padding-left: 10;
    border-radius: 30;
    border-width: 1;
    border-color: #fff;
  }
  .send-form .form {
    background: #fff;
    color: #555;
  }
  .input {
    placeholder-color: #777;
    color: #222;
    font-size: 14;
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
    background: url("~/images/chat_background.png") no-repeat;
    position: fixed;
    min-width: 100%;
    min-height: 100%;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  .msger-chat {
    flex: 1;
    padding: 6;
  }
  .action-bar-title {
    horizontal-align: center;
    color: #222;
  }
  .thumb {
    border-radius: 50%;
    margin-right: 10;
  }
  .online {
    height: 10;
    width: 10;
    margin-right: 10;
    background-color: #1fb833;
    border-radius: 50%;
    display: inline-block;
  }
  .offline {
    height: 10;
    width: 10;
    margin-right: 10;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }
  /**
  * chat template
  */
  .msg {
    display: flex;
    width: 100%;
    align-items: flex-end;
    height: auto;
    overflow: hidden;
    .bubble {
      display: inline-block;
      width: auto;
      horizontal-align: left;
      height: auto;
      background: #f5f5f5;
      border-radius: 10;
      border-top-left-radius: 0;
      position: relative;
      margin: 5 50 3 10;
      box-shadow: 0 2 1 rgba(0, 0, 0, 0.2);
      &.alt {
        horizontal-align: right;
        flex-direction: row-reverse;
        margin: 5 10 3 50;
        border-top-right-radius: 0;
        border-top-left-radius: 10;
        background: #DCF8C6;
      }
      .txt {
        padding: 4 0 4 0;
        display: inline-block;
        .name {
          font-weight: 600;
          font-size: 11;
          display: inline-block;
          padding: 0 0 0 15;
          margin: 0 0 4 0;
          color: #3498db;
          &.alt {
            color: #2ecc51;
          }
        }
        .message {
          padding: 0 10 0 10;
          margin: auto;
          color: #2b2b2b;
          display: inline-block;
          .timestamp {
            font-size: 12;
            margin: 5 0 0 3;
            margin-top: 5;
            position: relative;
            text-transform: uppercase;
            horizontal-align: right;
            color: #999;
            font-weight: 600;
          }
        }
      }
      .bubble-arrow {
        position: absolute;
        horizontal-align: left;
        left: -8;
        top: 0;
        &.alt {
          bottom: 20;
          left: auto;
          right: 4;
          horizontal-align: right;
          &::after {
            border-top-width: 15;
            border-top-color: #DCF8C6;
            transform: scaleX(-1);
          }
        }
        &::after {
          content: "";
          position: absolute;
          border-top-width: 15;
          border-top-color: #f5f5f5;
          border-left-color: transparent;
          border-left-width: 15;
          border-radius: 6 0 0 0;
          width: 0;
          height: 0;
        }
      }
    }
  }
  .msg-text {
    color: #222;
    font-size: 16;
  }
</style>