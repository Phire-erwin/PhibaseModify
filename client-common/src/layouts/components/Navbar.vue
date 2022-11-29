<template>
  <div class="navbar-container d-flex content align-items-center">

  <b-modal
      id="promptEmailSetting"
      ref="modal"
      v-model="promptEmailSetting"
      title="SMTP Setting"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
     <b-form-group label="Email:" label-for="emailSettingForm-email">
      <b-form-input
        id="emailSettingForm-email"
        v-model="emailSettingForm.email"
      />
     </b-form-group>

    <b-form-group label="Previous Password:" label-for="emailSettingForm-previousPassword">
      <b-form-input
        id="emailSettingForm-previousPassword"
        v-model="emailSettingForm.previousPassword"
        placeholder="············"
        type="password"
      />
     </b-form-group>

     <b-form-group label="Password:" label-for="emailSettingForm-password">
      <b-form-input
        id="emailSettingForm-password"
        v-model="emailSettingForm.password"
        placeholder="············"
        type="password"
      />
     </b-form-group>

      <b-form-group label="Port:" label-for="emailSettingForm-port">
      <b-form-input
        id="emailSettingForm-port"
        v-model="emailSettingForm.port"
      />
     </b-form-group>

     <b-form-group label="Outgoing Name:" label-for="emailSettingForm-outgoingName">
      <b-form-input
        id="emailSettingForm-outgoingName"
        v-model="emailSettingForm.outgoingName"
      />
     </b-form-group>

      <b-form-group label="Display Name:" label-for="emailSettingForm-displayName">
      <b-form-input
        id="emailSettingForm-displayName"
        v-model="emailSettingForm.displayName"
      />
     </b-form-group>

      <template #modal-footer>
        <b-button
          size="md"
          variant="danger"
          @click="resetForm(); promptEmailSetting = false;"
        >
          Cancel
        </b-button>
        <b-button
          size="md"
          variant="success"
          @click="saveEmailSetting"
        >
          Save
        </b-button>
      </template>
  </b-modal>
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <!-- <dark-Toggler class="d-none d-lg-block" /> -->

      <a href="http://phibase.io" target="_blank" title="Homepage">
        <feather-icon icon="HomeIcon" style="width: 20px; height: 20px; margin: 0px 10px;"/>
      </a>

      <a title="Common">
        <feather-icon icon="UsersIcon" style="width: 20px; height: 20px; margin: 0px 10px;"/>
      </a>

      <a href="http://phibase.io/commerce" target="_blank" title="Commerce">
        <feather-icon icon="ShoppingCartIcon" style="width: 20px; height: 20px; margin: 0px 10px;"/>
      </a>

      <a href="http://phibase.io/manufacturing" target="_blank" title="Manufacture">
        <feather-icon icon="ToolIcon" style="width: 20px; height: 20px; margin: 0px 10px;"/>
      </a>

      <a href="http://phibase.io/quality-control" target="_blank" title="Quality Control">
        <feather-icon icon="EyeIcon" style="width: 20px; height: 20px; margin: 0px 10px;"/>
      </a>

      <a href="http://phibase.io/distribution" target="_blank" title="Distribution">
        <feather-icon icon="TruckIcon" style="width: 20px; height: 20px; margin: 0px 10px;"/>
      </a>

      <a href="http://phibase.io/planner" target="_blank" title="Planner">
        <feather-icon icon="CalendarIcon" style="width: 20px; height: 20px; margin: 0px 10px;"/>
      </a>
    </div>

     <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ name !== '' ? name : user.email }}
            </p>
            <small>{{ user.role }}</small>
          </div>
          <b-img src="@/assets/images/logo.png" alt="img" height="35" rounded="circle" />
        </template>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          @click="clickSMTPSetting"
        >
          <feather-icon
            size="16"
            icon="MailIcon"
            class="mr-50"
          />
          <span>SMTP Setting</span>
        </b-dropdown-item>
        <b-dropdown-item link-class="d-flex align-items-center" @click="goToProfile">
          <feather-icon
            size="16"
            icon="UserIcon"
            class="mr-50"
          />
          <span>Profile</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center" @click="goToChangePassword">
          <feather-icon
            size="16"
            icon="KeyIcon"
            class="mr-50"
          />
          <span>Password</span>
        </b-dropdown-item>
        <b-dropdown-item link-class="d-flex align-items-center" @click="goToApplication">
          <feather-icon
            size="16"
            icon="SettingsIcon"
            class="mr-50"
          />
          <span>Application</span>
        </b-dropdown-item>

        <b-dropdown-item link-class="d-flex align-items-center" @click="logout">
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>Logout</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import axios from "@/axios";
import router from '@/router/index.js'

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
  },
  data() {
    return {
      name: '',
      promptEmailSetting: false,
      emailSettingForm:{
        email: "",
        previousPassword: "",
        password: "",
        port: "",
        outgoingName: "",
        displayName: "",
        props: {}
      }
    }
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    saveEmailSetting(){
      this.emailSettingForm.props = {
        app:this.$session.get('phibase-app')
      }

      axios
        .post("/common/settingSMTP", this.emailSettingForm)
        .then(() => {        
          this.$bvToast.toast("Successfully Setting SMTP", {
            title: "Success",
            variant: "success",
            solid: true,
          });
          
          ///if success
          this.resetForm()
          this.promptEmailSetting = false
        })
        .catch((err) => {
          console.log({ err });
          this.$bvToast.toast(err.response.data.errors[0].message, {
            title: "Failed",
            variant: "danger",
            solid: true,
          });
        });
      
    },
    resetForm(){
      this.emailSettingForm.email = ""
      this.emailSettingForm.previousPassword = ""
      this.emailSettingForm.password = ""
      this.emailSettingForm.port = ""
      this.emailSettingForm.outgoingName = ""
      this.emailSettingForm.displayName = ""
    },
    clickSMTPSetting(){
      axios
        .get(`/common/settingSMTP/${router.app.$session.get('phibase-app')}`)
        .then((res) => {        
        this.emailSettingForm.email =  res.data.email
        this.emailSettingForm.port =  res.data.port
        this.emailSettingForm.outgoingName =  res.data.outgoingName
        this.emailSettingForm.displayName =  res.data.displayName  
        this.emailSettingForm.props =  res.data.props  
        })
        .catch((err) => console.log({ err }));
        
      this.promptEmailSetting = true
    },
    goToProfile() {
      this.$router.push({name: 'profile'});
    },

    goToChangePassword() {
      this.$router.push({name: 'change-password'});
    },
    goToApplication() {
      this.$router.push({name: 'application'});
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

      var firstName = getUser.props ? getUser.props.firstName ? getUser.props.firstName : '' : '';
      var lastName = getUser.props ? getUser.props.lastName ? getUser.props.lastName : '' : '';

      this.name = (`${firstName} ${lastName}`).trim();

      return getUser
    },
  },
  mounted() {
    this.$store
      .dispatch('auth/fetchUser')
      .catch(err => console.log(err))
  }
}
</script>
