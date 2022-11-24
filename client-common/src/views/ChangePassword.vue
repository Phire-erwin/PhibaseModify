<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Change Password</b-breadcrumb-item>
    </b-breadcrumb><br>

    <b-card title="Change Password">
      <b-row v-if="message">
        <b-col cols="12">
          <b-card bg-variant="light">
            <strong style="color:red">{{ message }}</strong>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="2">
          Current Password
        </b-col>

        <b-col cols="4">
          <b-input-group>
            <template #append>
              <b-input-group-text>
                <feather-icon
                  class="cursor-pointer"
                  :icon="passwordIcon"
                  @click="changePasswordState"
                />
              </b-input-group-text>
            </template>
            <b-form-input
              id="current-password"
              v-model="currentPassword"
              :type="inputPassword"
              maxlength="20"
            />
          </b-input-group>
        </b-col>
      </b-row><br>

      <b-row>
        <b-col cols="2">
          New Password
        </b-col>

        <b-col cols="4">
          <b-input-group>
            <template #append>
              <b-input-group-text>
                <feather-icon
                  class="cursor-pointer"
                  :icon="passwordIcon"
                  @click="changePasswordState"
                />
              </b-input-group-text>
            </template>
            <b-form-input
              id="new-password"
              v-model="newPassword"
              :type="inputPassword"
              minlength="12"
              maxlength="20"
            />
          </b-input-group>
          <span v-if="newPassword.length < 12 && newPassword !== ''" style="color:red">Your password must be at least 12 characters.</span>
        </b-col>

        <b-col cols="6">
          <b-row>
            <b-col cols="3">
              <div class="character-on" v-if="result[1].includes('Lower Case')">Lower Case</div>
              <div class="character-off" v-else>Lower Case</div>
            </b-col>

            <b-col cols="3">
              <div class="character-on" v-if="result[1].includes('Upper Case')">Upper Case</div>
              <div class="character-off" v-else>Upper Case</div>
            </b-col>

            <b-col cols="3">
              <div class="character-on" v-if="result[1].includes('Number')">Number</div>
              <div class="character-off" v-else>Number</div>
            </b-col>

            <b-col cols="3">
              <div class="character-on" v-if="result[1].includes('Symbol')">Symbol</div>
              <div class="character-off" v-else>Symbol</div>
            </b-col>
          </b-row>
        </b-col>
      </b-row><br>

      <b-row>
        <b-col cols="2">
          Confirm Password
        </b-col>

        <b-col cols="4">
          <b-input-group>
            <template #append>
              <b-input-group-text>
                <feather-icon
                  class="cursor-pointer"
                  :icon="passwordIcon"
                  @click="changePasswordState"
                />
              </b-input-group-text>
            </template>
            <b-form-input
              id="confirm-password"
              v-model="confirmPassword"
              :type="inputPassword"
              maxlength="20"
            />
          </b-input-group>
          <span v-if="confirmPassword.length > 0 && confirmPassword !== newPassword" style="color:red">Confirm Password does not match.</span>
        </b-col>
      </b-row><br>

      <b-row v-if="newPassword.length >= 12">
        <b-col cols="2">
          Password Strength
        </b-col>

        <b-col cols="4">
          <div style="display:flex" v-if="result[0] === 'Weak'">
            <div class="bar-red">
              Weak
            </div>

            <div class="bar-off">
            </div>

            <div class="bar-off">
            </div>
          </div>

          <div style="display:flex" v-if="result[0] === 'Medium'">
            <div class="bar-orange">
            </div>

            <div class="bar-orange">
              Medium
            </div>

            <div class="bar-off">
            </div>
          </div>

          <div style="display:flex" v-if="result[0] === 'Strong'">
            <div class="bar-green">
            </div>

            <div class="bar-green">
            </div>

            <div class="bar-green">
              Strong
            </div>
          </div>
        </b-col>
      </b-row><br>

      <b-row>
        <b-col cols="6" style="text-align:right">
          <b-button
            type="submit"
            variant="primary"
            @click="save"
            :disabled="newPassword.length < 12 || newPassword !== confirmPassword || result[0] === 'Weak'"
          >
            Save
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import "vue-select/src/scss/vue-select.scss";
import { viewAccess } from '@/utils/utils.js';
import axios from '@/axios';

export default {
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      inputPassword: 'password',
      passwordIcon: 'EyeIcon',
      passwordState: true,
      strength: '',
      characters: [],
    }
  },
  methods: {
    changePasswordState() {
      this.passwordState = !this.passwordState;
      if (this.passwordState) {
        this.inputPassword = 'password';
        this.passwordIcon = 'EyeIcon'
      } else {
        this.inputPassword = 'text';
        this.passwordIcon = 'EyeOffIcon'
      }
    },

    save() {
      axios
        .put(`/common/auth/change-password/${this.user.id}`, {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        })
        .then((res) => {
          this.$bvToast.toast('Password updated.', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })

          setTimeout(() => {
            this.logout()
          }, 1000)
        })
        .catch((error) => {
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
    },

    logout() {
      this.$session.clear()
      this.$session.destroy()

      window.location.reload()
    },
  },
  computed: {
    user() {
      var getUser = this.$store.getters['auth/getActiveUser'];

      this.firstName = getUser.props ? getUser.props.firstName ? getUser.props.firstName : '' : '';
      this.lastName = getUser.props ? getUser.props.lastName ? getUser.props.lastName : '' : '';

      return getUser
    },
    message() {
      var getLastUpdatedPassword = this.user.props ? this.user.props.passwordUpdatedAt ? new Date(this.user.props.passwordUpdatedAt).getTime() : undefined : undefined;

      if (getLastUpdatedPassword === undefined || getLastUpdatedPassword < 1663139421195) {
        return "Your password has expired. Please change the password and log in again."
      } else {
        return false
      }
    },
    result() {
      axios
        .post("/common/password-strength/", {
          password: this.newPassword
        })
        .then((res) => {
          this.strength = res.data.strength;
          this.characters = res.data.characters;
        })
        .catch((err) => console.log({ err }));

      return [
        this.strength,
        this.characters
      ]
    },
    home() {
      return viewAccess()[0]
    },
  },
  created() {
    document.title = 'Change Password | Phibase - Common'
  },
  mounted() {
    this.$store
      .dispatch('auth/fetchUser')
      .catch(err => console.log(err))
  },
}
</script>

<style scoped>
.character-off{
  text-align: center;
  background: #F6F6F6;
  padding: 9px 0;
  color: gray;
  border-radius: 10px;
}

.character-on{
  text-align: center;
  background: #0892D0;
  padding: 9px 0;
  color: white;
  border-radius: 10px;
}

.bar-off{
  margin: 3px;
  text-align: center;
  background: #F6F6F6;
  padding: 3px 0;
  color: white;
  border-radius: 3px;
  width: 33%;
}

.bar-red{
  margin: 3px;
  text-align: center;
  background: #EA5455;
  padding: 3px 0;
  color: white;
  border-radius: 3px;
  width: 33%;
}

.bar-orange{
  margin: 3px;
  text-align: center;
  background: #FF9F43;
  padding: 3px 0;
  color: white;
  border-radius: 3px;
  width: 33%;
}

.bar-green{
  margin: 3px;
  text-align: center;
  background: #28C76F;
  padding: 3px 0;
  color: white;
  border-radius: 3px;
  width: 33%;
}
</style>