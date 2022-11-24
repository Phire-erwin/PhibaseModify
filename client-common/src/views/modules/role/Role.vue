<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Role</b-breadcrumb-item>
    </b-breadcrumb><br>

    <b-card title="Role">
      <b-modal
        id="promptDelete"
        ref="modal"
        v-model="promptDelete"
        title="Delete Role"
      >
        <p
          class="my-2"
        >
          Are you sure that you want to permanently delete selected role?
        </p>
        <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            @click="confirmDelete"
          >
            Delete
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptDelete=false"
          >
            Cancel
          </b-button>
        </template>
      </b-modal>

      <b-modal
        id="promptDeleteSelected"
        ref="modal"
        v-model="promptDeleteSelected"
        title="Delete Selected"
      >
        <p
          class="my-2"
        >
          Are you sure that you want to permanently delete selected roles?
        </p>
        <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            @click="deleteMultiple"
          >
            Delete
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptDeleteSelected=false"
          >
            Cancel
          </b-button>
        </template>
      </b-modal>

      <b-col>
        <b-row class="show-on-mobile">
          <b-col cols="6" style="margin-bottom:15px;">
            <b-form-group
              label="Sort By"
              label-for="sort-by-select"
              label-cols-md="0"
              label-align-sm="left"
              label-size="md"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-select
                  id="sort-by-select"
                  v-model="sortBy"
                  :options="sortOptions"
                  class="w-75"
                >
                  <template #first>
                    <option value="">-- none --</option>
                  </template>
                </b-form-select>

                <b-form-select
                  v-model="sortDesc"
                  :disabled="!sortBy"
                  :options="directionOptions"
                  size="sm"
                  class="w-25"
                >
                </b-form-select>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="12">
        <b-row style="margin-bottom:15px;">
          <b-col cols="4">
            <b-button
              variant="primary"
              to="/role/add"
              v-if="permission.add"
            >
              Add Role
            </b-button>
            <b-button
              variant="danger"
              style="margin-left:15px;"
              v-if="permission.delete && selected.length > 0"
              @click="promptDeleteSelected=true"
            >
              Delete Selected
            </b-button>
          </b-col>
          <b-col cols="4" />
          <b-col cols="4">
            <div>
              <b-row>
                <span class="spin" v-if="showSpinner"></span>
              </b-row>
              <b-form-input
                v-model="search"
                @input="debounceSearch"
                type="search"
                placeholder="Type to Search"
                style="float: right;"
              />
            </div>
          </b-col>
        </b-row>
        <b-row style="margin-bottom:10px" class="show-on-mobile">
          <b-col>
            <b-form-checkbox
              v-model="stackedStatus"
              value="md"
              unchecked-value= false
            >
              Stacked Table
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <div style="overflow-x: visible;">
              <b-table
                id="role-table"
                responsive
                :items="roles"
                :per-page="perPage"
                :current-page="currentPage"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="search"
                select-mode="multi"
                head-variant="dark"
                selectable
                small
                hover
                outlined 
                :stacked= stackedStatus
                @row-selected="onRowSelected"
              >
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
                    <b-dropdown variant="success" size="sm" text="Menu" no-caret>
                      <template #button-content>
                        <feather-icon size="1x" icon="MenuIcon" />
                      </template>
                      <b-dropdown-item>
                        <b-button variant="primary" size="sm" style="margin-left:15px;" :to="{name:'role-view', params: { id: row.item.id }}">
                          <feather-icon size="1x" icon="EyeIcon" />
                        </b-button>
                      </b-dropdown-item>
                      <b-dropdown-item v-if="permission.edit" >
                        <b-button variant="success" size="sm" style="margin-left:15px;" :to="{name:'role-edit', params: { id: row.item.id }}">
                          <feather-icon size="1x" icon="EditIcon" />
                        </b-button>
                      </b-dropdown-item>
                      <b-dropdown-item v-if="permission.delete" >
                        <b-button variant="danger" size="sm" style="margin-left:15px;" type="filled" @click="deleteRole(row.item.id)">
                          <feather-icon size="1x" icon="Trash2Icon" />
                        </b-button>
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>
                </template>
              </b-table>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="4" class="pt-1">
            <b-form-group
              label="Data Per Page"
              label-for="per-page-select"
              label-cols-md="0"
              label-align-sm="left"
              label-size="md"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>
            <b-col class="pt-1">
              <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                first-number
                last-number
                class="float-right"
                aria-controls="user-table"
              ></b-pagination>
          </b-col>
        </b-row>
      </b-col>
    </b-card>
  </div>
</template>

<script>
import { dateFormat, userAccess, viewAccess } from '@/utils/utils.js';

export default {
  data() {
    return {
      stackedStatus:"md",
      showSpinner: false,
      fields: [
        { key: 'selected', label: '' },
        { key: 'name', label: 'Name', filterable: true, sortable: true },
        { key: 'level', label: 'Level', filterable: true, sortable: true },
        { key: 'createdAtFormatted', label: 'Created At', filterable: true, sortable: true },
        { key: 'updatedAtFormatted', label: 'Updated At', filterable: true, sortable: true },
        { key: 'actions', label: 'Actions'},
      ],
      //sort direction list
      directions: [
        { key: false, label: 'Asc', sortable: true },
        { key: true, label: 'Desc', sortable: true },
      ],
      search: null,
      promptDelete: false,
      promptDeleteSelected: false,
      pageOptions: [5, 10, 20, 100],
      sortBy: '',
      sortDesc: false,
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

    deleteRole(id) {
      this.deleteId = id
      this.promptDelete = true
    },
    
    confirmDelete() {
      this.promptDelete = false
      this.$store
        .dispatch('role/deleteRole', { id: this.deleteId })
        .then(() => {
          this.$bvToast.toast('Successfully Deleted Role', {
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

    deleteMultiple() {
      if (this.deleteCounter === 0) {
        this.temp = this.selected;
      }
      if (this.deleteCounter < this.temp.length) {
        setTimeout(() => {
          this.deleteId = this.temp[this.deleteCounter].id;
          
          this.deleteCounter++;
          this.confirmDelete();
          this.deleteMultiple();
        }, 50)
      } else {
        this.deleteCounter = 0;
        this.promptDeleteSelected = false;
      }
    },
  },
  computed: {
    permission() {
      return userAccess('Role')
    },
    home() {
      return viewAccess()[0]
    },
    roles() {
      var getRoles = this.$store.getters['role/getRole'] ? this.$store.getters['role/getRole'].filter(doc => {
        return doc.name !== 'Super Admin'
      }).map(el => {
        return {
          ...el,
          createdAtFormatted: dateFormat(el.createdAt),
          updatedAtFormatted: dateFormat(el.updatedAt)
        }
      }) : []
      return getRoles
    },
    rows() {
      return this.roles.length
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
    document.title = 'Role | Phibase - Common'
  },
  mounted() {
    this.$store
      .dispatch('role/fetchRole')
      .catch(err => console.log(err))
    
    // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageRoleCommon")) {
      this.perPage = this.$session.get("perPageRoleCommon")
    }
    if (this.$session.has("sortByRoleCommon")) {
      this.sortBy = this.$session.get("sortByRoleCommon")
    }
    if (this.$session.has("sortDescRoleCommon")) {
      this.sortDesc = this.$session.get("sortDescRoleCommon")
    }
    // if (this.$session.has("stackedStatusRoleCommon")) {
    //   this.stackedStatus = this.$session.get("stackedStatusRoleCommon")
    // }
  },

  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
     this.$session.set("perPageRoleCommon", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByRoleCommon", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescRoleCommon", sortDescNew)
    },
    // stackedStatus(stackedStatusNew) {
    //   this.$session.set("stackedStatusRoleCommon", stackedStatusNew)
    // }
  },
}
</script>

<style>
@media (min-width: 761px) {
  .show-on-mobile { display: none !important; }
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