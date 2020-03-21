<template>
  <Page actionBarHidden="true">
    <!-- <GridLayout> -->
      <FlexboxLayout class="page" verticalAlignment="center">
        <CardView  margin="20" elevation="40" radius="5">
          <ScrollView>
            <StackLayout class="mb-20">
              <Image class="logo" src="~/images/logo.png"></Image>
              <RadDataForm
                v-if="isLoggingIn"
                ref="loginDataForm"
                :source="person"
                :metadata="personProperty"
                :validationMode="validationMode"
                :commitMode="commitMode"
              ></RadDataForm>

              <RadDataForm
                v-else
                ref="registerDataForm"
                :source="user"
                :metadata="userProperty"
                :validationMode="validationMode"
                :commitMode="commitMode"
                @propertyValidate="comparePassword"
              ></RadDataForm>

              <Button
                v-if="isLoggingIn"
                class="btn btn-primary btn-rounded-lg m-t-50"
                style="color: #fff;"
                text="Log In"
                @tap="validateForm"
              ></Button>

              <Button
                v-else
                class="btn btn-primary btn-rounded-lg m-t-50"
                style="color: #fff;"
                text="Sign Up"
                @tap="validateRegisterForm"
              ></Button>

              <Label class="login-span sign-up-label" @tap="toggleForm">
                <FormattedString>
                  <Span v-if="isLoggingIn" text="Don't have an account?"></Span>
                  <Span v-else text="Back to Login" class="login-label"></Span>
                  <Span :text="isLoggingIn ? ' Sign Up' : ''" style="font-weight: bold; color: purple;"></Span>
                </FormattedString>
              </Label>

              <Label
                v-if="isLoggingIn"
                class="login-label"
                text="Forgot your password?"
                @tap="forgotPassword"
              ></Label>
            </StackLayout>
          </ScrollView>
        </CardView>
      </FlexboxLayout>
    <!-- </GridLayout> -->
  </Page>
</template>

<script>
import {
  PropertyGroup,
  DataFormValidationMode,
  DataFormCommitMode
} from "nativescript-ui-dataform";
import { url } from "~/shared/api";
import axios from "axios";
import { mapGetters, mapState } from "vuex";
import notify from "~/shared/snackbar/index";
const applicationSettings = require("tns-core-modules/application-settings");

// Import components
import App from "./App";
import ForgotPassword from "./ForgotPassword";

// Configure notify color
const successType = "#51a351";
const errorType = "#bd362f";
const infoType = "#2f96b4";
const warningType = "#f89406";

export default {
  components: {
    App
  },
  data() {
    return {
      commitMode: DataFormCommitMode.Immediate,
      validationMode: DataFormValidationMode.OnLostFocus,
      person: {
        email: "",
        password: ""
      },
      personProperty: {
        propertyAnnotations: [
          {
            name: "email",
            displayName: "E-Mail Address",
            index: 0,
            required: true,
            editor: "Email",
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Email field is required."
                }
              },
              {
                name: "Email",
                params: {
                  errorMessage: "Enter a valid email address."
                }
              }
            ]
          },
          {
            name: "password",
            displayName: "Password",
            required: true,
            editor: "Password",
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Password field is required."
                }
              }
            ],
            index: 1
          }
        ]
      },
      user: {
        fullname: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      },
      userProperty: {
        propertyAnnotations: [
          {
            name: "fullname",
            displayName: "Fullname",
            required: true,
            index: 0,
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Fullname field is required."
                }
              }
            ]
          },
          {
            name: "email",
            displayName: "E-Mail Address",
            index: 1,
            required: true,
            editor: "Email",
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Email field is required."
                }
              },
              {
                name: "Email",
                params: {
                  errorMessage: "Invalid email provided."
                }
              }
            ]
          },
          {
            name: "phone",
            displayName: "Phone",
            index: 2,
            editor: "Text",
            required: true,
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Phone field is required."
                }
              }
            ]
          },
          {
            name: "password",
            displayName: "Password",
            required: true,
            editor: "Password",
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Password field is required."
                }
              },
              {
                name: "MinimumLength",
                params: {
                  length: 6,
                  errorMessage: "Password cannot be less than 6 characters."
                }
              }
            ],
            index: 3
          },
          {
            name: "confirmPassword",
            displayName: "Confirm Password",
            required: true,
            editor: "Password",
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Confirm Password field is required."
                }
              },
              {
                name: "MinimumLength",
                params: {
                  length: 6,
                  errorMessage:
                    "Confirm Password cannot be less than 6 characters."
                }
              }
            ],
            index: 4
          }
        ]
      },
      isLoginValid: true,
      isRegisterValid: true,
      isLoggingIn: true,
      loginUser: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    login() {
      axios.post(`${url}/login`, this.person).then(response => {
        if (response.status == 200) {
          this.$store.commit("SET_TOKEN", response.data.token);
          this.$store.commit("SET_INFO", response.data.user);
          this.$navigateTo(App, {
            clearHistory: true,
            transition: "SlideRight"
          });
        } else {
          notify(response.data.message, errorType);
        }
      }).catch(error => {
        notify(error.message, errorInfo);
      });
    },
    toggleForm() {
      this.isLoggingIn = !this.isLoggingIn;
    },
    forgotPassword() {
      // Goto forgot password component
      this.$navigateTo(ForgotPassword, {
        transition: "SlideRight"
      });
    },
    validateForm() {
      const email = this.$refs.loginDataForm.getPropertyByName("email");
      const password = this.$refs.loginDataForm.getPropertyByName("password");

      if (
        email.valueCandidate == null ||
        email.valueCandidate == "" ||
        email.valueCandidate.length < 1
      ) {
        email.errorMessage = "Email field is required.";
        this.$refs.loginDataForm.notifyValidated("email", false);
        this.isLoginValid = false;
      } else {
        this.$refs.loginDataForm.notifyValidated("email", true);
      }

      if (
        password.valueCandidate == null ||
        password.valueCandidate == "" ||
        password.valueCandidate.length < 1
      ) {
        password.errorMessage = "Password field is required.";
        this.$refs.loginDataForm.notifyValidated("password", false);
        this.isLoginValid = false;
      } else {
        this.$refs.loginDataForm.notifyValidated("password", true);
      }

      if (this.isLoginValid) {
        this.$refs.loginDataForm.commitAll();
        this.login();
      }
      return false;
    },
    register() {
      axios.post(`${url}/register`, this.user).then(response => {
        if (response.status == 200) {
          this.$store.commit("SET_TOKEN", response.data.token);
          this.$store.commit("SET_INFO", response.data.user);
          this.$navigateTo(App, {
            clearHistory: true,
            transition: "SlideRight"
          });
        } else {
          notify(response.data.message, errorType);
        }
      }).catch(error => {
        notify(error.message, errorType);
      });
    },
    validateRegisterForm() {
      const fullname = this.$refs.registerDataForm.getPropertyByName(
        "fullname"
      );
      const email = this.$refs.registerDataForm.getPropertyByName("email");
      const phone = this.$refs.registerDataForm.getPropertyByName("phone");
      const password = this.$refs.registerDataForm.getPropertyByName(
        "password"
      );
      const confirmPassword = this.$refs.registerDataForm.getPropertyByName(
        "confirmPassword"
      );

      if (
        fullname.valueCandidate == null ||
        fullname.valueCandidate == "" ||
        fullname.valueCandidate.length < 1
      ) {
        fullname.errorMessage = "Fullname field is required.";
        this.$refs.registerDataForm.notifyValidated("fullname", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("fullname", true);
      }

      if (
        email.valueCandidate == null ||
        email.valueCandidate == "" ||
        email.valueCandidate.length < 1
      ) {
        email.errorMessage = "Email field is required.";
        this.$refs.registerDataForm.notifyValidated("email", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("email", true);
      }

      if (phone.valueCandidate == null || phone.valueCandidate == "") {
        phone.errorMessage = "Phone field is required.";
        this.$refs.registerDataForm.notifyValidated("phone", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("phone", true);
      }

      if (password.valueCandidate == null || password.valueCandidate == "") {
        password.errorMessage = "Password field is required.";
        this.$refs.registerDataForm.notifyValidated("password", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("password", true);
      }

      if (
        password.valueCandidate.length > 0 &&
        password.valueCandidate.length < 6
      ) {
        password.errorMessage = "Password cannot be less than 6 characters.";
        this.$refs.registerDataForm.notifyValidated("password", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("password", true);
      }

      if (
        confirmPassword.valueCandidate == null ||
        confirmPassword.valueCandidate == "" ||
        confirmPassword.valueCandidate.length < 1
      ) {
        confirmPassword.errorMessage = "Confirm Password field is required.";
        this.$refs.registerDataForm.notifyValidated("confirmPassword", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("confirmPassword", true);
      }

      if (
        confirmPassword.valueCandidate.length > 0 &&
        confirmPassword.valueCandidate.length < 6
      ) {
        confirmPassword.errorMessage =
          "Confirm Password cannot be less than 6 characters.";
        this.$refs.registerDataForm.notifyValidated("confirmPassword", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("confirmPassword", true);
      }

      if (
        password.valueCandidate !== confirmPassword.valueCandidate &&
        password.length > 0 &&
        confirmPassword.length > 0
      ) {
        confirmPassword.errorMessage = "Passwords does not match.";
        this.$refs.registerDataForm.notifyValidated("confirmPassword", false);
        this.isRegisterValid = false;
      } else {
        this.$refs.registerDataForm.notifyValidated("confirmPassword", true);
      }

      if (this.isRegisterValid) {
        this.$refs.registerDataForm.commitAll();
        this.register();
      }
    },
    comparePassword(args) {
      let validationResult = true;

      if (args.propertyName === "confirmPassword") {
        const dataForm = args.object;
        const password = dataForm.getPropertyByName("password");
        const confirmPassword = args.entityProperty;
        if (password.valueCandidate !== confirmPassword.valueCandidate) {
          confirmPassword.errorMessage = "Passwords do not match.";
          validationResult = false;
        }
      }
      args.returnValue = validationResult;
    },
    checkAuthentication() {
      this.$store.dispatch("loadFromStorage");
      if (this.token != null) {
        this.$navigateTo(App, {
          clearHistory: true
        });
      }
    }
  },
  beforeMount() {
    this.checkAuthentication();
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
  .page {
    align-items: center;
    flex-direction: column;
    padding-top: 20;
    padding-bottom: 20;
    margin-right: 15;
    margin-left: 15;
  }
  .form {
    background-color: #fff;
    /*-webkit-box-shadow: 0 15 5 -6 #777;
     -moz-box-shadow: 0 15 5 -6 #777;
          box-shadow: 0 15 5 -6 #777;*/
    margin-left: 10;
    margin-right: 10;
    /*flex-grow: 2;
    vertical-align: middle;*/
  }
  .logo {
    margin-top: 20;
    margin-bottom: 10;
    height: 60;
    font-weight: bold;
  }
  .header {
    horizontal-align: center;
    font-size: 25;
    font-weight: 600;
    margin-bottom: 20;
    text-align: center;
    color: lighten($purple, 2%);
  }
  .input-field {
    margin-bottom: 25;
  }
  .input {
    font-size: 18;
    placeholder-color: #A8A8A8;
  }
  .btn-green {
    height: 50;
    margin: 30 5 15 5;
    background-color: $lemon;
    border-radius: 5;
    font-size: 20;
    font-weight: 600;
  }
  .login-label {
    horizontal-align: center;
    color: $blue;
    font-size: 16;
  }
  .login-span {
    horizontal-align: center;
    color: $black;
    margin-top: 10;
    font-size: 14;
  }
  .sign-up-label {
    margin-bottom: 20;
    font-weight: 600;
  }
  .m-t-50 {
    margin-top: 50;
  }
  .mb-20{
    margin-bottom: 20;
  }
</style>