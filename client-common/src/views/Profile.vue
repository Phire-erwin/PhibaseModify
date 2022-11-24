<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Profile</b-breadcrumb-item>
    </b-breadcrumb><br>
    <b-modal 
      v-model="modal2FA" 
      :title="'2FA'" 
      @ok="onSubmit2FA"
      id="status-2fa-modal" 
      >
        <b-row>
          <b-col cols="12">
            Our Two Factor Authentication (2FA) Feature is still on development. This
            will only flag your user data as having activated/deactivated 2FA Feature.
          </b-col>
        </b-row>
    </b-modal>

    <b-modal 
      v-model="modalQR" 
      :title="'2FA QR'" 
      id="qr-2fa-modal" 
      hide-footer
      >
        <b-row>
          <b-col cols="6">
            <img :src="qr2fa" />
            
          </b-col>
          <b-col cols="6">
            Scan this QR using your Authenticator Application (Authy, Google/Microsoft Authenticator)
          </b-col>
        </b-row>
    </b-modal>

    <b-modal 
      v-model="modalValidate" 
      :title="'Enter 2FA code'" 
      id="authenticate-2fa-modal" 
      hide-footer
      >
        <b-row>
          <b-col cols="12">
            <b-form-input
              id="code-authenticate-2fa"
              v-model="authenticate2fa"
            />
            <b-button  @click="onValidate" variant="primary">Validate</b-button>
            
          </b-col>
        </b-row>
    </b-modal>
    <b-card title="Profile">
      <b-row>
        <b-col cols="2">
          First Name
        </b-col>

        <b-col cols="6">
          <div v-if="!editFirstName">
            : {{ user.props ? user.props.firstName ? user.props.firstName : 'Not Set Up' : 'Not Set Up' }}
            <feather-icon @click="editFirstName = true" icon="EditIcon" style="cursor: pointer; color:#0892d0; width: 15px; height: 15px; margin: 0px 10px;"/>
          </div>

          <div v-else>
            <b-row>
              <b-col cols="3">
                <b-form-input
                  id="firstName"
                  v-model="firstName"
                />
              </b-col>
              
              <b-col cols="4">
                <b-button
                  type="submit"
                  variant="primary"
                  @click="updateUser"
                  style="margin-right:15px;"
                >
                  <feather-icon icon="CheckIcon"/>
                </b-button>

                <b-button
                  type="submit"
                  variant="danger"
                  @click="editFirstName = false"
                >
                  <feather-icon icon="XIcon"/>
                </b-button>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row><br>

      <b-row>
        <b-col cols="2">
          Last Name
        </b-col>

        <b-col cols="6">
          <div v-if="!editLastName">
            : {{ user.props ? user.props.lastName ? user.props.lastName : 'Not Set Up' : 'Not Set Up' }}
            <feather-icon @click="editLastName = true" icon="EditIcon" style="cursor: pointer; color:#0892d0; width: 15px; height: 15px; margin: 0px 10px;"/>
          </div>

          <div v-else>
            <b-row>
              <b-col cols="3">
                <b-form-input
                  id="lastName"
                  v-model="lastName"
                />
              </b-col>
              
              <b-col cols="4">
                <b-button
                  type="submit"
                  variant="primary"
                  @click="updateUser"
                  style="margin-right:15px;"
                >
                  <feather-icon icon="CheckIcon"/>
                </b-button>

                <b-button
                  type="submit"
                  variant="danger"
                  @click="editLastName = false"
                >
                  <feather-icon icon="XIcon"/>
                </b-button>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row><br>

      <b-row>
        <b-col cols="2">
          Email
        </b-col>

        <b-col cols="3">
          : {{ user.email }}
        </b-col>
      </b-row><br>

      <b-row>
        <b-col cols="2">
          Role
        </b-col>

        <b-col cols="3">
          : {{ user.role }}
        </b-col>
      </b-row>

    </b-card>

    <b-card title="Two Factor Authentication">
      <b-row>
        <b-col cols="2">
          Is Activated
        </b-col>

        <b-col cols="2">
          <b-badge v-if="status2FA().loaded" :variant="status2FA().color">
            {{status2FA().message}}
          </b-badge>
        </b-col>

        <b-col cols="2">
          <b-button size='sm' @click="openToggleModal()" variant="primary">{{(status2FA().isActive)?'De-activate':'Activate'}}</b-button>
        </b-col>

        <b-col cols="6">
          <b-button size='sm' v-if="status2FA().isActive" @click="openValidate()" variant="primary">Validate test</b-button>
        </b-col>
      </b-row>

    </b-card>
  </div>
</template>

<script>
import "vue-select/src/scss/vue-select.scss";
import { viewAccess } from '@/utils/utils.js';

export default {
  data() {
    return {
      
      editFirstName: false,
      editLastName: false,
      firstName: '',
      lastName: '',
      
      //modal 2fa
      modal2FA:false,
      
      //qr
      modalQR:false,
      qr2fa:'https://chart.googleapis.com/chart?chs=166x166&chld=L%7C0&cht=qr&chl=otpauth://totp/ABC-XYZ%3Atest1%40test.com%3Fsecret=CLP2JPKUPCLCV3YKOYFXLQPM5BJP6QHL%26issuer=ABC-XYZ',
      
      //validate
      modalValidate:false,
      authenticate2fa:'',
    }
  },
  methods: {
    openValidate(){
      this.modalValidate=true
    },
    onValidate(){
      this.$store
        .dispatch('auth/validate2FA', this.authenticate2fa)
        .then((res) => {
          console.log('2fa result ',res);
          this.$bvToast.toast('2FA Validate is correct', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.editFirstName = false;
          this.editLastName = false;
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
    },
    openToggleModal(){
      this.modal2FA=true;
    },
    onSubmit2FA(event){
      event.preventDefault()
      var current2FA= (this.user.props.activated2FA==undefined)?false:this.user.props.activated2FA;
      //if current is on, then disable 2fa
      if(current2FA){
        this.$store
        .dispatch('auth/updateUser', {
          email: this.user.email,
          role: this.user.role,
          roleRef: this.user.roleRef,
          props: {
            firstName: this.firstName,
            lastName: this.lastName,
            activated2FA: false
          }
        })
        .then((res) => {
          this.$bvToast.toast('2FA updated', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.editFirstName = false;
          this.editLastName = false;
          this.modal2FA=false;
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
      }else{
         this.$store
        .dispatch('auth/generate2FA')
        .then((res) => {
          
          console.log(res);
          this.$bvToast.toast('2FA Code Generated', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.editFirstName = false;
          this.editLastName = false;
          this.modal2FA=false;
          this.modalQR=true;
          this.qr2fa=res.data.secret.qr;
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
          
      }
      
    },
    status2FA(){
      var userData=this.user;
      if(!userData){
        return{
          loaded:false,
          color:'',
          message:'',
          isActive:false
        }
      }

      if(userData.props.activated2FA){
        return{
          loaded:true,
          color:'success',
          message:'Activated',
          isActive:true
        }
      }
      return{
        loaded:true,
        color:'danger',
        message:'Not Activated',
        isActive:false
      }

    },
    updateUser() {
      this.$store
        .dispatch('auth/updateUser', {
          email: this.user.email,
          role: this.user.role,
          roleRef: this.user.roleRef,
          props: {
            firstName: this.firstName,
            lastName: this.lastName,
          }
        })
        .then((res) => {
          this.$bvToast.toast('Profile Updated', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.editFirstName = false;
          this.editLastName = false;
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
    }
  },
  computed: {
    user() {
      var getUser = this.$store.getters['auth/getActiveUser'];

      this.firstName = getUser.props ? getUser.props.firstName ? getUser.props.firstName : '' : '';
      this.lastName = getUser.props ? getUser.props.lastName ? getUser.props.lastName : '' : '';
      //console.log(getUser);
      return getUser
    },
    home() {
      return viewAccess()[0]
    },
  },
  created() {
    document.title = 'Profile | Phibase - Common'
  },
  mounted() {
    this.$store
      .dispatch('auth/fetchUser')
      .catch(err => console.log(err))
  },
}
</script>