<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Item</b-breadcrumb-item>
    </b-breadcrumb><br>

    <b-card title="Item">
      <b-modal
        id="promptAddEdit"
        ref="modal"
        v-model="promptAddEdit"
        :title="title"
      > 
      
        <b-form-group
          label="Name"
          label-for="form-name"
        > 
          <b-form-input
            id="form-name"
            v-model="form.name"
          />
        </b-form-group>

        <b-form-group
          label="ID"
          label-for="form-id"
        >
          <b-form-input
            id="form-id"
            v-model="form.props.id"
          />
        </b-form-group>

        <b-form-group
          label="Stock"
          label-for="form-stock"
        >
          <b-form-input
            id="form-stock"
            v-model="form.props.stock"
            type="number"
            min="0"
          />
        </b-form-group>

        <b-form-group
          label="Unit"
          label-for="form-unit"
        >
          <b-form-input
            id="form-unit"
            v-model="form.props.unit"
            :oninput="this.form.props.unit = this.form.props.unit ? this.form.props.unit.toUpperCase().trim() : ''"
          />
        </b-form-group>

        <b-form-group
          label="Price"
          label-for="form-price"
        >
          <b-form-input
            id="form-price"
            v-model="form.props.price"
            type="number"
            min="0"
          />
        </b-form-group>

        <b-form-group
          label="Currency"
          label-for="form-currency"
        >
          <v-select
            v-model="form.props.currency"
            placeholder="----- Select Currency -----"
            :options="currency"
            label="label"
            :clearable="false" />
        </b-form-group>

        <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            @click="save"
          >
            Save
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptAddEdit=false"
          >
            Cancel
          </b-button>
        </template>
      </b-modal>

      <b-modal
        id="promptView"
        ref="modal"
        v-model="promptView"
        title="Item Details"
        hide-footer
      >
        <b-row>
          <b-col cols="4">
            <span class="font-weight-bold">Name</span>
          </b-col>

          <b-col cols="8">
            : {{ form.name }}
          </b-col>
        </b-row><br>
        
        <b-row>
          <b-col cols="4">
            <span class="font-weight-bold">ID</span>
          </b-col>

          <b-col cols="8">
            : {{ form.props.id }}
          </b-col>
        </b-row><br>

        <b-row>
          <b-col cols="4">
            <span class="font-weight-bold">Stock</span>
          </b-col>

          <b-col cols="8">
            : {{ form.props.stock ? Number(form.props.stock).toLocaleString() : 'Not Set Up' }}
          </b-col>
        </b-row><br>

        <b-row>
          <b-col cols="4">
            <span class="font-weight-bold">Unit</span>
          </b-col>

          <b-col cols="8">
            : {{ form.props.unit }}
          </b-col>
        </b-row><br>

        <b-row>
          <b-col cols="4">
            <span class="font-weight-bold">Price</span>
          </b-col>

          <b-col cols="8">
            : {{ form.props.price ? Number(form.props.price).toLocaleString() : 'Not Set Up' }}
          </b-col>
        </b-row><br>

        <b-row>
          <b-col cols="4">
            <span class="font-weight-bold">Created At</span>
          </b-col>

          <b-col cols="8">
            : {{ form.createdAtFormatted }}
          </b-col>
        </b-row><br>

        <b-row>
          <b-col cols="4">
            <span class="font-weight-bold">Updated At</span>
          </b-col>

          <b-col cols="8">
            : {{ form.updatedAtFormatted }}
          </b-col>
        </b-row><br>
      </b-modal>

      <b-modal
        id="promptDelete"
        ref="modal"
        v-model="promptDelete"
        title="Delete Item"
      >
        <p
          class="my-2"
        >
          Are you sure that you want to permanently delete selected item?
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
          Are you sure that you want to permanently delete selected items?
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

      <b-modal
        id="promptDownload"
        ref="modal"
        v-model="promptDownload"
        title="Download"
        hide-footer
      >
        <strong>Select download file type</strong>
        <div style="display: table; margin: 0 auto;">
          <download-excel :data="items" :fields="filter" name="Item.xls" class="download-border">
            <img src="@/assets/images/xls.png" height=100>
          </download-excel>
          <download-excel :data="items" :fields="filter" type="csv" name="Item.csv" class="download-border">
            <img src="@/assets/images/csv.png" height=100>
          </download-excel>
        </div>
      </b-modal>

       <b-modal
        id="promptUpload"
        ref="modal"
        v-model="promptUpload"
        title="Upload"
      >
        <div class="upload-border">
          <feather-icon icon="UploadIcon" size='4x'/><br>
          <b-form-file
            v-model="file"
            plain
            accept=".xls,.xlsx,.csv"
            @change="previewFiles"
            style="margin: 15px 20px;"
          ></b-form-file>
          <strong v-if="errorMessage" style="color:red; text-align:right;">{{ errorMessage }}</strong>
        </div>

        <template #modal-footer>
          <b-button
            size="md"
            variant="success"
            :disabled="errorMessage !== '' || file === null"
            @click="uploadItem"
          >
            Upload
          </b-button>
          <b-button
            size="md"
            variant="danger"
            @click="promptUpload=false"
          >
            Cancel
          </b-button>
        </template>
      </b-modal>

      <b-modal
        id="promptLoading"
        ref="modal"
        v-model="promptLoading"
        title="Processing..."
        hide-footer
      >
        <div class="progress" style="height: 30px; margin: 20px 0;">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :aria-valuenow="uploadCounter * 100 / uploadLength" aria-valuemin="0" aria-valuemax="100" :style="`width: ${uploadCounter * 100 / uploadLength}%`">
            <span class="progress-bar-title">{{ uploadCounter }} / {{ uploadLength }}</span>
          </div>
        </div>
      </b-modal>

      <!-- <b-modal
        id="promptSync"
        ref="modal"
        v-model="promptSync"
        title="Syncing..."
        hide-footer
      >
        <div class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Syncing...</span>
          </div>
        </div>
      </b-modal> -->

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
          <b-col cols="8">
            <b-button
              variant="primary"
              v-if="permission.add"
              @click="addItem"
            >
              Add Item
            </b-button>
            <!-- <b-button
              variant="primary"
              style="margin-left:15px;"
              @click="syncItems"
            >
              <feather-icon size="1x" icon="RefreshCwIcon" /> Sync
            </b-button> -->
            <b-button
              variant="primary"
              style="margin-left:15px;"
              @click="promptDownload=true"
            >
              <feather-icon size="1x" icon="DownloadIcon" /> Download
            </b-button>
            <b-button
              variant="primary"
              style="margin-left:15px;"
              @click="promptUpload=true"
            >
              <feather-icon size="1x" icon="UploadIcon" /> Upload
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
                id="item-table"
                responsive
                :items="items"
                :per-page="perPage"
                :current-page="currentPage"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="search"
                select-mode="multi"
                head-variant="dark"
                selectable
                hover
                small
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
                      <!-- <b-dropdown-item>
                        <b-button variant="primary" size="sm" style="margin-left:15px;" @click="viewItem(row.item.id)">
                          <feather-icon size="1x" icon="EyeIcon" />
                        </b-button>
                      </b-dropdown-item> -->
                      <b-dropdown-item v-if="permission.edit" >
                        <b-button size="sm" variant="success" style="margin-left:15px;" @click="editItem(row.item.id)">
                          <feather-icon size="1x" icon="EditIcon" />
                        </b-button>
                      </b-dropdown-item>
                      <b-dropdown-item v-if="permission.delete">
                        <b-button size="sm" variant="danger" style="margin-left:15px;" type="filled" @click="deleteItem(row.item.id)">
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
import vSelect from 'vue-select'
import * as XLSX from 'xlsx'
import axios from '@/axios'

export default {
  components: {
    vSelect
  },
  data() {
    return {
      stackedStatus:"md",
      showSpinner: false,
      fields: [
        { key: 'selected', label: '' },
        { key: 'name', label: 'Name', filterable: true, sortable: true },
        { key: 'itemID', label: 'ID', filterable: true, sortable: true },
        { key: 'type', label: 'Type', filterable: true, sortable: true },
        { key: 'stock', label: 'Stock', filterable: true, sortable: true },
        { key: 'unit', label: 'Unit', filterable: true, sortable: true },
        { key: 'price', label: 'Price', filterable: true, sortable: true },
        { key: 'currency', label: 'Currency', filterable: true, sortable: true },
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
      promptAddEdit: false,
      addEdit: '',
      title: '',
      pageOptions: [5, 10, 20, 100],
      sortBy: '',
      sortDesc: false,
      form: {
        name: '',
        props: {
          id: '',
          stock: '',
          unit: '',
          price: '',
          currency: '',
        }
      },
      currency: [],
      promptView: false,
      promptDelete: false,
      promptDeleteSelected: false,
      deleteCounter: 0,
      selected: [],
      currentPage: 1,
      perPage: 10,
      promptDownload: false,
      filter: {
        'Name'      : "name",
        'ID'        : 'itemID',
        'Type'      : 'type',
        'Stock'     : 'stock',
        'Unit'      : 'unit',
        'Price'     : 'price',
        'Currency'  : 'currency',
        'Created At': 'createdAtFormatted',
        'Updated At': 'updatedAtFormatted'
      },
      promptUpload: false,
      file: null,
      uploadCounter: 0,
      uploadLength: 0,
      uploadArray: [],
      errorMessage: '',
      overwrite: false,
      promptLoading: false,
      // promptSync: false,
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

    addItem() {
      this.promptAddEdit = true;
      this.title = 'Add Item';
      this.addEdit = 'Add';
      this.clearFields();
    },

    editItem(id) {
      this.promptAddEdit = true;
      this.title = 'Edit Item';
      this.addEdit = 'Edit';
      this.item = this.items.find(i => i.id === id);
      this.form = {
        ...this.item
      }
    },

    save() {
      this.addEdit === 'Add' ? this.addNewItem() : this.updateItem()
    },

    addNewItem() {
      this.$store
        .dispatch('item/addItem', {
          ...this.form,
          app: this.$session.get('phibase-app')
        })
        .then(() => {
          this.$bvToast.toast('Successfully Add Item', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.clearFields();
          this.promptAddEdit = false;
        })
        .catch(err => {
          console.log({ err })
          this.$bvToast.toast(err.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        })
    },

    updateItem() {
      this.$store
        .dispatch('item/updateItem', {
          id: this.item.id,
          data: {
            ...this.form,
            app: this.$session.get('phibase-app')
          }
        })
        .then(() => {
          this.$bvToast.toast('Successfully Update Item', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.clearFields();
          this.promptAddEdit = false;
        })
        .catch(err => {
          console.log({ err });
          this.$bvToast.toast(err.response.data.errors[0].message, {
            title: 'Failed',
            variant: 'danger',
            solid: true,
          })
        });
    },

    viewItem(id) {
      this.item = this.items.find(i => i.id === id);
      this.form = {
        ...this.item
      }
      this.promptView = true
    },

    deleteItem(id) {
      this.deleteId = id
      this.promptDelete = true
    },
    
    confirmDelete() {
      this.promptDelete = false
      this.$store
        .dispatch('item/deleteItem', { id: this.deleteId })
        .then(() => {
          this.$bvToast.toast('Successfully Deleted Item', {
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

    clearFields() {
      this.form = {
        name: '',
        props: {
          id: '',
          stock: '',
          unit: '',
          price: '',
          currency: ''
        }
      }
    },

    uploadItem() {
      if (this.uploadCounter === 0) {
        this.promptUpload = false;
        this.promptLoading = true;
      }
      if (this.uploadCounter < this.uploadLength) {
        setTimeout(() => {
          var data = this.uploadArray[this.uploadCounter];

          const trimmedData = Object.entries(data).reduce((acc, curr) => {
            let [key, value] = curr;
            // Checking if the key is a string
            acc[typeof key === "string" ? key.trim() : key] = value; 
            return acc;
          }, {});

          const currency = this.currency.find(u => u.label === trimmedData['Currency']);

          this.form.name = trimmedData['Name']
          this.form.props = {
            id: trimmedData['ID'],
            stock: trimmedData['Stock'],
            unit: trimmedData['Unit'],
            price: trimmedData['Price'],
            currency
          }

          this.uploadCounter++;
          this.addNewItem();
          this.uploadItem();
        }, 50)
      } else {
        this.file = null;
        this.promptLoading = false;
        this.$bvToast.toast(`Successfully Uploaded ${this.uploadLength} Item(s)`, {
          title: 'Success',
          variant: 'success',
          solid: true,
        })
      }
    },

    previewFiles (e) {
      this.errorMessage = '';
      let files = e.target.files, f = files[0]
      const reader = new FileReader()
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, {type: 'array'})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const XL_row_object = XLSX.utils.sheet_to_json(worksheet, {raw: false, defval: ''})

        const acceptedColumnName = [
          'Name',
          'ID',
          'Type',
          'Stock',
          'Unit',
          'Price',
          'Currency'
        ]

        const columnName = Object.keys(XL_row_object[0]);

        for (let i = 0; i < acceptedColumnName.length; i++) {
          if (columnName[i] !== acceptedColumnName[i]) {
            this.errorMessage = 'Invalid column name'
            return;
          }
        }

        this.uploadCounter = 0;
        this.uploadLength = XL_row_object.length;
        this.uploadArray = XL_row_object;
      }.bind(this)
      reader.readAsArrayBuffer(f)
    },

    // syncItems() {
    //   this.promptSync = true
    //   axios
    //     .put(`/common/items-sync/${this.$session.get('phibase-app')}`)
    //     .then(res => {
    //       this.promptSync = false
    //       this.$bvToast.toast("Successfully Sync Item", {
    //         title: "Success",
    //         variant: "success",
    //         solid: true,
    //       });
    //     })
    //     .catch((err) => {
    //       console.log({ err });
    //       this.$bvToast.toast(err.response.data.error, {
    //         title: "Failed",
    //         variant: "danger",
    //         solid: true,
    //       });
    //     });
    // }
  },
  computed: {
    permission() {
      return userAccess('Item')
    },
    home() {
      return viewAccess()[0]
    },
    items() {
      var getItems = this.$store.getters['item/getItem'] ? this.$store.getters['item/getItem'].map(el => {
        return {
          ...el,
          itemID: el.props ? el.props.id ? el.props.id : 'Not Set Up' : 'Not Set Up',
          type: el.props ? el.props.components ? el.props.components.length > 0 ? 'BOM' : 'Raw Material' : 'Raw Material' : 'Raw Material',
          stock: el.props ? el.props.stock ? el.props.stock : 'Not Set Up' : 'Not Set Up',
          unit: el.props ? el.props.unit ? el.props.unit : 'Not Set Up' : 'Not Set Up',
          price: el.props ? el.props.price ? el.props.price : 'Not Set Up' : 'Not Set Up',
          currency: el.props ? el.props.currency ? el.props.currency.label : 'Not Set Up' : 'Not Set Up',
          createdAtFormatted: dateFormat(el.createdAt),
          updatedAtFormatted: dateFormat(el.updatedAt)
        }
      }) : []
      return getItems
    },
    rows() {
      return this.items.length
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
    document.title = 'Item | Phibase - Common'
  },
  mounted() {
    this.$store
      .dispatch('item/fetchItem')
      .catch(err => console.log(err))

    this.currency = require('@/json/country-by-currency-code.json').map(el => {
      return {
        ...el,
        label: `${el.currency_code} - ${el.country}`
      }
    });
    
    // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageItemCommon")) {
      this.perPage = this.$session.get("perPageItemCommon")
    }
    if (this.$session.has("sortByItemCommon")) {
      this.sortBy = this.$session.get("sortByItemCommon")
    }
    if (this.$session.has("sortDescItemCommon")) {
      this.sortDesc = this.$session.get("sortDescItemCommon")
    }
    // if (this.$session.has("stackedStatusItemCommon")) {
    //   this.stackedStatus = this.$session.get("stackedStatusItemCommon")
    // }
  },

  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
     this.$session.set("perPageItemCommon", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByItemCommon", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescItemCommon", sortDescNew)
    },
    // stackedStatus(stackedStatusNew) {
    //   this.$session.set("stackedStatusItemCommon", stackedStatusNew)
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

.download-border {
  border-radius: 25px;
  border: 2px solid #0077B3;
  border-style: dashed;
  padding-top: 23px; 
  width: 175px;
  height: 150px;
  float: left;
  margin: 20px;
  text-align: center;
  cursor: pointer;
}

.download-border:hover {
  background-color: #d9f2ff;
}

.upload-border {
  border-radius: 25px;
  border: 2px solid #0077B3;
  border-style: dashed;
  padding-top: 25px; 
  width: 90%;
  height: 175px;
  margin: 20px;
  text-align: center;
}

.progress-bar-title {
  position: absolute;
  text-align: center;
  line-height: 30px; /* line-height should be equal to bar height */
  overflow: hidden;
  color: black;
  font-size: 20px;
  right: 0;
  left: 0;
  top: 20;
  font-weight: 900;
  text-shadow: -1px 1px 0 #fff, 1px 1px 0 #fff, 1px -1px 0 #fff, -1px -1px 0 #fff;
}
</style>