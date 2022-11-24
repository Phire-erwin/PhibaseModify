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

      <!-- Register-->
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
            height="50"
            :center="true"
            style="margin-bottom:30px;"
          />
          <b-card-title
            title-tag="h2"
            class="font-weight-bold mb-1"
            style="text-align:center;"
          >
            Phibase Suite Common
          </b-card-title>
          <b-card-text class="mb-2" style="text-align:center;">
            Please register your account to login
          </b-card-text>
          <!-- /Header -->

          <!-- Form -->
          <validation-observer ref="registerValidation">
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
                  name="email"
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

              <!-- Password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="register-password">Password</label>
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
                      id="register-password"
                      v-model="password"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="register-password"
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

              <!-- Confirm Password -->
              <b-form-group>
                <div class="d-flex justify-content-between">
                  <label for="register-password">Confirm Password</label>
                </div>
                <validation-provider
                  #default="{ errors }"
                  name="Confirm Password"
                  rules="min:6|confirmed:Password"
                >
                  <b-input-group
                    class="input-group-merge"
                    :class="errors.length > 0 ? 'is-invalid':null"
                  >
                    <b-form-input
                      id="confirm-password"
                      v-model="confirmPassword"
                      :state="errors.length > 0 ? false:null"
                      class="form-control-merge"
                      :type="passwordFieldType"
                      name="Confirm Password"
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

              <!-- Role -->
              <b-form-group label="Role" >
                <v-select
                  v-model="role"
                  placeholder="----- Select Role -----"
                  :options="options"
                  label="namerole"
                  :clearable="false" />
              </b-form-group>
              <!-- /Role -->
            
              <!-- Submit Button -->
              <b-button
                type="submit"
                variant="primary"
                block
                :disabled="disableRegister"
                @click="registerUser"
              >
                Register
              </b-button>
            </b-form>
          </validation-observer>

          <!-- Login -->
          <b-card-text class="text-center mt-2">
            <span>
              Back to 
              <b-link :to="{name:'login'}">
                <span>Login</span>
              </b-link>
            </span>
          </b-card-text>
          <!-- /Login -->
        </b-col>
      </b-col>
      <!-- /Register -->
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
      confirmPassword: '',
      role: '',
      sideImg: require('@/assets/images/pages/register-v2.svg'),
      options: [
          { role: 'admin', namerole: 'Admin' },
          { role: 'customer', namerole: 'Customer' },
          { role: 'vendor', namerole: 'Vendor' },
          { role: 'driver', namerole: 'Driver' },
          { role: 'operator', namerole: 'Operator' },
          { role: 'user', namerole: 'User' },
        ],
      // validation rulesimport store from '@/store/index'
      required,
      email,
    }
  },
  computed: {
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
    disableRegister() {
      return this.email === "" || this.password === "" || this.confirmPassword === "" || this.role === "";
    },
  },
  methods: {
    registerUser() {
      this.$store
        .dispatch('auth/register', {
          email: this.email,
          password: this.password,
          role: this.role.role,
        })
        .then((res) => {
          this.$bvToast.toast("Registration Successful", {
            title: "Success",
            variant: "success",
            solid: true,
          });
          setTimeout(() => {
            this.$router.push('/pages/login');
          }, 1000)
        })
        .catch(error => {
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
    },
  }
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
