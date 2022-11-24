<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Application</b-breadcrumb-item>
    </b-breadcrumb><br>

    <b-card title="Application">

      <b-row>
        <b-col cols="2">
          Name
        </b-col>

        <b-col cols="4">
          {{applicationData.name}}
        </b-col>
      </b-row><br>

      <b-row class="option-border" v-if="!edit">
        <b-col cols="12" style="overflow-y: scroll; max-height: 500px; width: 100%; overflow-x: hidden;">
          <feather-icon icon="SettingsIcon" style="width:20px; height:20px; margin-right:15px;"/>
          <span class="font-weight-bold" style="font-size:15px;">Settings</span>

          <div v-for="(setting, setting_index) in settings" :key="`settings${setting_index}`">
            <hr>

            <strong style="font-size:15px;">{{setting.name}} </strong>

              <div v-for="(tr, index) in setting.options" :key="setting.name + index">
                <b-row style="margin-top:10px;">
                  <b-col cols="4">
                    {{tr.name}}
                  </b-col>
                  <b-col cols="2" style="display: table; margin: 0 auto;">
                    <b-form-checkbox
                      v-model="applicationData.props.options[tr.key]"
                      :value="true"
                      :unchecked-value="false"
                      disabled
                    ></b-form-checkbox>
                  </b-col>
                </b-row>                  
              </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="option-border" v-else>
        <b-col cols="12" style="overflow-y: scroll; max-height: 500px; width: 100%; overflow-x: hidden;">
          <feather-icon icon="SettingsIcon" style="width:20px; height:20px; margin-right:15px;"/>
          <span class="font-weight-bold" style="font-size:15px;">Settings</span>

          <div v-for="(setting, setting_index) in settings" :key="`settings${setting_index}`">
            <hr>

            <strong style="font-size:15px;">{{setting.name}} </strong>

              <div v-for="(tr, index) in setting.options" :key="setting.name + index">
                <b-row style="margin-top:10px;">
                  <b-col cols="4">
                    {{tr.name}}
                  </b-col>
                  <b-col cols="2" style="display: table; margin: 0 auto;">
                    <b-form-checkbox
                      v-model="applicationData.props.options[tr.key]"
                    ></b-form-checkbox>
                  </b-col>
                </b-row>                  
              </div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="12" style="text-align:right" v-if="!canEdit">
          Only Super Admin can Edit Application Options
        </b-col>
        <b-col cols="12" style="text-align:right" v-else-if="!edit">
          <b-button
            type="submit"
            variant="primary"
            @click="openEdit"
          >
            Edit
          </b-button>
        </b-col>
        <b-col cols="12" v-else style="text-align:right">
          <b-button
            type="submit"
            variant="primary"
            @click="save"
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
import { viewAccess,domainPermission } from '@/utils/utils.js';

import axios from '@/axios';

export default {
  data() {
    return {
      edit:false,
      editTemp:[],
      settings:[{
          name:'Commerce',
          key:'commerce',
          options:[
            {
              key:'prApproveRequired',
              name:'PR Approval Required',
              value:true
            },
            {
              key:'poApproveRequired',
              name:'PO Approval Required',
              value:false
            },
            {
              key:'quotationApproveRequired',
              name:'Quote. Approval Required',
              value:false
            },
            {
              key:'soApproveRequired',
              name:'SO Approval Required',
              value:false
            }
          ]
        },{
          name:'Distribution',
          key:'distribution',
          options:[
            {
              key:'pickingRequired',
              name:'Picking Required',
              value:false
            },
            {
              key:'unpackingRequired',
              name:'Unpacking Required',
              value:false
            }
          ]
        },{
          name:'Manufacture',
          key:'manufacture',
          options:[
            {
              key:'executorAutoRun',
              name:'Executor Auto Run',
              value:false
            }
          ]
        }]
        
      }
    
  },
  methods: {
    optionKeys(options){
      return Object.keys(options)
    },
    openEdit(){
      console.info('before ',this.applicationData);
      this.edit=true;
    },
    save() {
      console.info('after ',this.applicationData);
      
      this.$store
        .dispatch('application/updateCurrentApplication', this.applicationData
        )
        .then((res) => {
          this.$bvToast.toast('Application Updated', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.edit=false;
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
          this.edit=false;
        });
      /*axios
        .put(`/common/application/${this.applicationData.id}`, {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        })
        .then((res) => {
          this.$bvToast.toast('Application Setting Updated.', {
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
        */
    },

    logout() {
      this.$session.clear()
      this.$session.destroy()

      window.location.reload()
    },
  },
  computed: {
    canEdit(){
      var permission= domainPermission('Common');
      
      //only with allAccess can edit Application Data
      return permission.allAccess;
    },
    applicationData() {

      /** 
        All Application Options are put
      */
      var data= this.$store.getters['application/getCurrentApplication'];
      if(data===null){
        return {name:'',props:{options:{}}}
      }
      data.props.options=(data.props.options)?data.props.options:{temp:false}
      return data; 
    },
    home() {
      return viewAccess()[0]
    },
  },
  created() {
    document.title = 'Application | Phibase - Common'
  },
  mounted() {
    console.log(this.settings)
    this.$store
      .dispatch('application/fetchCurrentApplication')
      .catch(err => console.log(err))
  },
}
</script>

<style>
.option-border {
  border-radius: 10px;
  border: 2px solid #CCCCCC;
  padding: 20px;
  margin: 5px;
}
</style>