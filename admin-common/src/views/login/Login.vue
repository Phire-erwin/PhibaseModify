<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">
      <!-- Left Text - Image -->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text - Image -->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <!-- Header -->
          <b-img
            :src="brandLogo"
            alt="logo"
            height="70"
            :center="true"
            style="margin-bottom:30px;"
          />
          <b-card-title
            title-tag="h2"
            class="font-weight-bold mb-1"
            style="text-align:center;"
          >
            Phibase - ADMIN
          </b-card-title>
          <b-card-text class="mb-2" style="text-align:center;">
            Please sign-in to your account to login
          </b-card-text>
          <!-- /Header -->

          <!-- Form -->
          <validation-observer ref="loginValidation">
            <b-form
              class="auth-login-form mt-2"
              @submit.prevent
            >
              <!-- Email -->
              <b-form-group
                label="Email"
                label-for="login-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="login-email"
                    v-model="email"
                    :state="errors.length > 0 ? false:null"
                    name="login-email"
                    placeholder="john@example.com"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <!-- /Email -->

              <!-- Password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="login-password">Password</label>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Password"
                  rules="required|min:6"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="login-password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="login-password"
                      placeholder="············"
                    />
                    <b-input-group-append is-text>
                      <feather-icon
                        class="cursor-pointer"
                        :icon="passwordToggleIcon"
                        @click="togglePasswordVisibility"
                      />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
              <!-- /Password -->

              <!-- Submit Button -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="disableLogin"
                @click="loginUser"
              >
                 Login
              </b-button>

              <!-- /Submit Button -->
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import store from '@/store/index'
import { viewAccess } from '@/utils/utils.js';

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    vSelect
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      password: '',
      email: '',
      app: '',
      sideImg: require('@/assets/images/pages/login-v2.svg'),
      // validation rulesimport store from '@/store/index'
      required,
    }
  },
  methods: {
    loginUser() {
      this.$store
        .dispatch('auth/loginAdmin', {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          var userAccess = viewAccess();
          
          if (userAccess.length > 0) {
            this.$router.push(`/${userAccess[0]}`);
          } else {
            this.$router.push('/');
          }
        })
        .catch(error => {
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
    },
  },
  computed: {
    // applications() {
    //   return this.$store.getters['application/getApplication']
    // },
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
    brandLogo() {
      return require('@/assets/images/logo-phire.png')
    },
    disableLogin() {
      return this.email === "" || this.password === "";
    },
  },
  created() {
    document.title = 'Phibase | Admin'
  },
  // mounted() {
  //   this.$store
  //     .dispatch('application/fetchApplication')
  //     .catch(err => console.log(err))
  // },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>