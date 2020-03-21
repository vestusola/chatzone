<template>
  <Page actionBarHidden="true">
    <FlexboxLayout class="page" verticalAlignment="center">
      <CardView margin="10" elevation="40" radius="5">
        <StackLayout>
          <Image class="logo" src="~/images/logo.png"></Image>
          <RadDataForm
            v-if="hasToken && !resetFormActivated"
            ref="personDataForm"
            :source="person"
            :metadata="personProperty"
            :commitMode="commitMode"
            :validationMode="validationMode"
          ></RadDataForm>

          <RadDataForm
            v-else-if="!hasToken && !resetFormActivated"
            ref="userDataForm"
            :source="user"
            :metadata="userProperty"
            :commitMode="commitMode"
            :validationMode="validationMode"
          ></RadDataForm>

          <RadDataForm
            v-if="resetFormActivated"
            ref="resetPasswordDataForm"
            :source="resetPassword"
            @propertyValidate="comparePassword"
            :metadata="resetPasswordProperty"
            :commitMode="commitMode"
            :validationMode="validationMode"
          ></RadDataForm>

          <Button
            v-if="hasToken && !resetFormActivated"
            class="btn btn-primary btn-rounded-lg m-t-50"
            text="Continue"
            @tap="validateResetCodeForm"
          ></Button>

          <Button
            v-else-if="!hasToken && !resetFormActivated"
            class="btn btn-primary btn-rounded-lg m-t-50"
            text="Send Reset Code"
            @tap="validateForm"
          ></Button>

          <Button
            v-if="resetFormActivated"
            class="btn btn-primary btn-rounded-lg m-t-50"
            text="Change Password"
            @tap="validateResetPasswordForm"
          ></Button>

          <Label class="login-span sign-up-label" v-if="!hasToken && !resetFormActivated" @tap="goToLogin">
            <FormattedString>
              <Span class="login-label" text="Go back to Login"></Span>
            </FormattedString>
          </Label>
        </StackLayout>
      </CardView>
    </FlexboxLayout>
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
import notify from "~/shared/snackbar/index";
import Login from "./Login";
const successType = "#51a351";
const errorType = "#bd362f";
const infoType = "#2f96b4";
const warningType = "#f89406";

export default {
  name: "ForgotPassword",
  data() {
    return {
      commitMode: DataFormCommitMode.Immediate,
      validationMode: DataFormValidationMode.OnLostFocus,
      user: {
        email: ""
      },
      userProperty: {
        propertyAnnotations: [
          {
            name: "email",
            displayName: "EMail Address",
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
          }
        ]
      },
      person: {
        code: ""
      },
      personProperty: {
        propertyAnnotations: [
          {
            name: "code",
            displayName: "Verification Code",
            index: 0,
            required: true,
            editor: "Text",
            validators: [
              {
                name: "NonEmpty",
                params: {
                  errorMessage: "Verification Code is required."
                }
              }
            ]
          }
        ]
      },
      isValid: true,
      hasToken: false,
      resetFormActivated: false,
      resetPassword: {
        password: "",
        confirmPassword: ""
      },
      resetPasswordProperty: {
        propertyAnnotations: [
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
            index: 0
          },
          {
            name: "confirmPassword",
            displayName: "Re-type Password",
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
            index: 1
          }
        ]
      },
      code: null
    };
  },
  methods: {
    sendForgotPasswordCode() {
      axios.post(`${url}/forgot_password`, this.user, {
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {
        if (response.status == 200) {
          this.hasToken = true;
        } else {
          notify(response.data.message, errorType);
          this.hasToken = false;
        }
      }).catch(error => {
        notify(error.message, errorType);
        this.hasToken = false;
      });
    },
    verifyPasswordCode() {
      axios.post(`${url}/forgot_password/verify`, this.person, {
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {
        if (response.status == 200) {
          this.code = this.$refs.personDataForm.getPropertyByName("code").valueCandidate;
          this.resetFormActivated = true;
          this.hasToken = false;
        } else {
          notify(response.data.message, errorType);
        }
      }).catch(error => {
        notify(error.message, errorType);
      })
    },
    validateForm() {
      const email = this.$refs.userDataForm.getPropertyByName("email");

      if (
        email.valueCandidate == null ||
        email.valueCandidate == "" ||
        email.valueCandidate.length < 1
      ) {
        email.errorMessage = "Email field is required.";
        this.$refs.userDataForm.notifyValidated("email", false);
        this.isValid = false;
      } else {
        this.$refs.userDataForm.notifyValidated("email", true);
      }

      if (this.isValid) {
        this.$refs.userDataForm.commitAll();
        this.sendForgotPasswordCode();
      }
    },
    validateResetCodeForm() {
      const code = this.$refs.personDataForm.getPropertyByName("code");

      if (
        code.valueCandidate == null ||
        code.valueCandidate == "" ||
        code.valueCandidate.length < 1
      ) {
        code.errorMessage = "Verification Code is required.";
        this.$refs.personDataForm.notifyValidated("code", false);
        this.isValid = false;
      } else {
        this.$refs.personDataForm.notifyValidated("code", true);
      }

      if (this.isValid) {
        this.$refs.personDataForm.commitAll();
        this.verifyPasswordCode();
      }
    },
    goToLogin() {
      this.$navigateTo(Login, {
        transition: "SlideLeft"
      });
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
    validateResetPasswordForm() {
      const password = this.$refs.resetPasswordDataForm.getPropertyByName(
        "password"
      );
      const confirmPassword = this.$refs.resetPasswordDataForm.getPropertyByName(
        "confirmPassword"
      );

      if (password.valueCandidate == null || password.valueCandidate == "") {
        password.errorMessage = "Password field is required.";
        this.$refs.resetPasswordDataForm.notifyValidated("password", false);
        this.isValid = false;
      } else {
        this.$refs.resetPasswordDataForm.notifyValidated("password", true);
      }

      if (
        password.valueCandidate.length > 0 &&
        password.valueCandidate.length < 6
      ) {
        password.errorMessage = "Password cannot be less than 6 characters.";
        this.$refs.resetPasswordDataForm.notifyValidated("password", false);
        this.isValid = false;
      } else {
        this.$refs.resetPasswordDataForm.notifyValidated("password", true);
      }

      if (
        confirmPassword.valueCandidate == null ||
        confirmPassword.valueCandidate == "" ||
        confirmPassword.valueCandidate.length < 1
      ) {
        confirmPassword.errorMessage = "Confirm Password field is required.";
        this.$refs.resetPasswordDataForm.notifyValidated("confirmPassword", false);
        this.isValid = false;
      } else {
        this.$refs.resetPasswordDataForm.notifyValidated("confirmPassword", true);
      }

      if (
        confirmPassword.valueCandidate.length > 0 &&
        confirmPassword.valueCandidate.length < 6
      ) {
        confirmPassword.errorMessage =
          "Confirm Password cannot be less than 6 characters.";
        this.$refs.resetPasswordDataForm.notifyValidated("confirmPassword", false);
        this.isValid = false;
      } else {
        this.$refs.resetPasswordDataForm.notifyValidated("confirmPassword", true);
      }

      if (
        password.valueCandidate !== confirmPassword.valueCandidate &&
        password.length > 0 &&
        confirmPassword.length > 0
      ) {
        confirmPassword.errorMessage = "Passwords does not match.";
        this.$refs.resetPasswordDataForm.notifyValidated("confirmPassword", false);
        this.isValid = false;
      } else {
        this.$refs.resetPasswordDataForm.notifyValidated("confirmPassword", true);
      }

      if (this.isValid) {
        this.$refs.resetPasswordDataForm.commitAll();
        this.resetPasswordByCode();
      }
    },
    resetPasswordByCode() {
      this.resetPassword.code = this.code;
      axios.put(`${url}/change_password/password`, this.resetPassword, {
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {
        if (response.status == 202) {
          this.goToLogin();
        } else {
          notify(response.data.message, errorType);
        }
      }).catch(error => {
        notify(error.message, errorType);
      });
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
    margin-left: 30;
    margin-right: 30;
    flex-grow: 2;
    vertical-align: middle;
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
  .btn-purple {
    height: 50;
    margin: 30 5 15 5;
    background-color: $purple;
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
  .bold {
    color: $black;
    font-weight: 700;
  }
  .m-t-50 {
    margin-top: 50;
  }
  .mb-20{
    margin-bottom: 20;
  }
</style>