<style>


</style>

<template>
  <div>
    <!-- Form Register -->
    <b-modal
        id="promptApp"
        ref="modal"
        v-model="promptReason"
        title="Kasih Pesan Dong Kenapa di Reject"
        header-bg-variant="light">

      <validation-observer>
        <b-form-group
            label="Kenapa saya ditolak kakak (╥﹏╥)"
            label-for="form_note">
          <validation-provider
              #default="{ errors }"
              name="note"
              rules="required">
            <b-form-input
                id="form_note"
                tabindex="3"
                v-model="formNote"
                :state="errors.length>0 ? false:null"
                name="form_note"
                placeholder="karna kamu jelek"
            />
            <small class="text-danger">{{ errors[0] }}</small>
          </validation-provider>
        </b-form-group>

      </validation-observer>
      <template #modal-footer>
        <b-button
            size="md"
            variant="success"
            @click="rejectConfirm()"
        >
          Confirm
        </b-button>
        <b-button
            size="md"
            variant="danger"
            @click="promptReason=false"
        >
          Cancel
        </b-button>
      </template>
    </b-modal>

    <b-card-group deck>
      <b-col cols="12">
        <b-row style="margin-bottom:10px" class="show-on-mobile">
          <b-col>
            <b-form-checkbox v-model="stackedStatus" value="md" unchecked-value=false>
              Stacked Table
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-card title="Request Application">
            <div style="overflow-x: visible;">
              <b-table
                id="application-table"
                responsive
                :items="users"
                :per-page="perPage"
                :current-page="currentPage"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="search"
                select-mode="multi"
                head-variant="dark"
                head-row-variant="green"
                selectable
                hover
                small
                outlined
                :stacked=stackedStatus
                @row-selected="onRowSelected">
                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>

                <template v-slot:cell(actions)="row">
                  <div>
                    <b-button size="sm" variant="success" style="margin-left:15px;" type="filled"
                      @click="accept(row.item.id) ">
                      Accept
                    </b-button>
                    <b-button size="sm" variant="danger" style="margin-left:15px;" type="filled"
                      @click="(reject(row.item.id))">
                      Reject
                    </b-button>
                  </div>
                </template>
              </b-table
                  >
            </div>
            <b-row>
              <b-col cols="4" class="pt-1">
                <b-form-group label="Data Per Page" label-for="per-page-select" label-cols-md="0" label-align-sm="left"
                  label-size="md" class="mb-0">
                  <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm">
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col class="pt-1">
                <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" first-number last-number
                  class="float-right" aria-controls="user-table"></b-pagination>
              </b-col>
            </b-row>
          </b-card>
        </b-row>
      </b-col>

    </b-card-group>
  </div>
</template>

<script>
import { dateFormat, userAccess, viewAccess } from '@/utils/utils.js';
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, email } from '@validations'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    vSelect
  },
  data() {
    return {
      stackedStatus: "md",
      showSpinner: false,
      fields: [
        { key: 'selected', label: '' },
        { key: 'name', label: 'Name', filterable: true, sortable: true },
        { key: 'email', label: 'Email', filterable: true, sortable: true },
        { key: 'createdAtFormatted', label: 'Request At', filterable: true, sortable: true },
        { key: 'actions', label: 'Actions' },
      ],
      //sort direction list
      directions: [
        { key: false, label: 'Asc', sortable: true },
        { key: true, label: 'Desc', sortable: true },
      ],
      search: null,
      promptAddEdit: false,
      addEdit: '',
      title: '',
      pageOptions: [5, 10, 20, 100],
      sortBy: '',
      sortDesc: false,

      // promptView: false,
      required,
      formNote: '',
      promptReason:false,
      promptDelete: false,
      promptDeleteSelected: false,
      deleteCounter: 0,
      selected: [],
      currentPage: 1,
      perPage: 10,
    }
  },
  methods: {
    // add spinner while loading on searching data process
    debounceSearch(event) {
      this.showSpinner = true
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.showSpinner = false
        this.search = event.target.value
      }, 600)
    },

    onRowSelected(items) {
      this.selected = items
    },
    accept(id){
      this.acceptId = id
      this.$store
        .dispatch('application/addApplication', 
          {
            id: this.acceptId
          })
        .then(() => {
          this.$store
            .dispatch('application/approvedReqApplication',{
              id: this.acceptId, 
              email: this.admin.email, 
            })
          this.$bvToast.toast('Accepted Application', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
        this.selected = [];
        })
        .catch(error => {
          console.log({ error })
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        })
    },
    reject(id){
      this.rejectId = id
      this.promptReason = true
    },
    rejectConfirm(){
      this.promptReason = false
      this.$store
        .dispatch('application/rejectedReqApplication', {
          id: this.rejectId, 
          email: this.admin.email,
          reason: this.formNote,
        })
        .then(() => {
          this.$bvToast.toast('Successfully Rejected Request Appllication', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.selected = [];
        })
        .catch(error => {
          console.log({ error })
          this.$bvToast.toast(error.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        })
    }
    // viewUser(id) {
    //   this.user = this.users.find(i => i.id === id);
    //   this.form = {
    //     ...this.user
    //   }
    //   this.promptView = true
    // },
  },
  computed: {
    permission() {
      return userAccess('Dashboard')
    },
    home() {
      return viewAccess()[0]
    },
    admin() {
      var getUser = this.$store.getters['auth/getActiveUser'];

      var firstName = getUser.props ? getUser.props.firstName ? getUser.props.firstName : '' : '';
      var lastName = getUser.props ? getUser.props.lastName ? getUser.props.lastName : '' : '';

      this.name = (`${firstName} ${lastName}`).trim();

      return getUser
    },
    users() {
      var getApplications = this.$store.getters['application/getReqApplication'] ? this.$store.getters['application/getReqApplication']
        .filter(doc => {
          return doc.status === 'Pending'
        })
        .map(el => {
          return {
            ...el,
            createdAtFormatted: dateFormat(el.createdAt)
          }
        }) : []
      return getApplications
    },
    rows() {
      return this.users.length
    },
    roles() {
      var getRoles = this.$store.getters['role/getRole'] ? this.$store.getters['role/getRole'].filter(doc => {
        return doc.name !== 'Super Admin' && doc.level !== 'Super Admin'
      }).map(el => {
        return {
          ...el,
          label: `${el.name} - ${el.level}`
        }
      }) : []
      return getRoles
    },
    // Create an options list from our fields
    sortOptions() {
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    },
    // Create an direction list that can be saved in session
    directionOptions() {
      return this.directions
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    },
  },
  created() {
    document.title = 'User | Phibase - Common'
  },
  mounted() {
    this.$store
      .dispatch('user/fetchUser')
      .catch(err => console.log(err))
    this.$store
      .dispatch('role/fetchRole')
      .catch(err => console.log(err))
    this.$store
      .dispatch('application/getReqApplication')
      .catch(err => console.error(err))
    
      
    // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageUserCommon")) {
      this.perPage = this.$session.get("perPageUserCommon")
    }
    if (this.$session.has("sortByUserCommon")) {
      this.sortBy = this.$session.get("sortByUserCommon")
    }
    if (this.$session.has("sortDescUserCommon")) {
      this.sortDesc = this.$session.get("sortDescUserCommon")
    }
    // if (this.$session.has("stackedStatusUserCommon")) {
    //   this.stackedStatus = this.$session.get("stackedStatusUserCommon")
    // }
  },

  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
      this.$session.set("perPageUserCommon", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByUserCommon", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescUserCommon", sortDescNew)
    },
    // stackedStatus(stackedStatusNew) {
    //   this.$session.set("stackedStatusUserCommon", stackedStatusNew)
    // }
  },
}
</script>

<style>
@media (min-width: 761px) {
  .show-on-mobile {
    display: none !important;
  }
}

@keyframes spinner {
  0% {
    transform: translate3d(-50%, -50%, 0) rotate(0deg);
  }

  100% {
    transform: translate3d(-50%, -50%, 0) rotate(360deg);
  }
}

.spin::before {
  animation: 1.5s linear infinite spinner;
  animation-play-state: inherit;
  border: solid 5px #cfd0d1;
  border-bottom-color: #0077B3;
  border-radius: 50%;
  content: "";
  height: 20px;
  width: 20px;
  position: absolute;
  margin-top: 20px;
  transform: translate3d(-50%, -50%, 0);
  will-change: transform;
}
</style>