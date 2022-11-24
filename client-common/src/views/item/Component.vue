<template>
  <b-card title="Component">
      <b-col cols="12">
        <b-button @click="add()" v-if="permission.add" variant="primary">Add new Component</b-button>
        <!-- Modal for adding new Component-->
        <b-modal style="margin:1em" v-model="addComponentModal" :title="addModal.title" :id="addModal.id" size="lg" >
          <b-form  style="margin:1em" @submit="onSubmitAdd" @reset="onReset" v-if="show">
            <b-card-actions-container class="bv-example-row">
              <b-row>
                <b-col cols="12">
                  <b-form-group>
                    <label id="add-component-name" for="add-component-name-input">Component Name<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-component-name-input"
                      v-model="addModal.form.name"
                      placeholder="Component Name"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <b-form-group>
                    <label id="add-component-stock" for="add-component-stock-input">Component Stock<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-component-stock-input"
                      v-model="addModal.form.props.stock"
                      placeholder="Component Stock"
                      type="Number"
                      min="0"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <b-form-group>
                    <label id="add-component-price" for="add-component-price-input">Component Price<span class="text-danger">*</span></label>
                    <b-form-input
                      id="add-component-price-input"
                      v-model="addModal.form.props.price"
                      placeholder="Component Price"
                      type="Number"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <b-button type="submit" class="float-right" variant="primary">Submit</b-button>
                  <b-button type="reset" class="float-right" variant="danger">Reset</b-button>    
                </b-col>
              </b-row>
            </b-card-actions-container>
          </b-form>
          <template #modal-footer>
            <div class="w-100">    
            </div>
          </template>
        </b-modal>

        <!-- Modal for editting Component-->
        <b-modal v-model="editComponentModal" :title="editModal.title" :id="editModal.id" size="lg">      
          <b-form @submit="onSubmitEdit" @reset="onReset" v-if="show">
            <b-row>
              <b-col cols="12">
                <b-form-group>
                  <label id="edit-component-name" for="edit-component-name-input">Component Name<span class="text-danger">*</span></label>
                  <b-form-input
                    id="edit-component-name-input"
                    v-model="editModal.form.name"
                    placeholder="Component Name"
                    required
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="12">
                  <b-form-group>
                    <label id="edit-component-stock" for="edit-component-stock-input">Component Stock<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-component-stock-input"
                      v-model="editModal.form.props.stock"
                      placeholder="Component Stock"
                      type="Number"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col cols="12">
                  <b-form-group>
                    <label id="edit-component-price" for="edit-component-price-input">Component Price<span class="text-danger">*</span></label>
                    <b-form-input
                      id="edit-component-price-input"
                      v-model="editModal.form.props.price"
                      placeholder="Component Price"
                      type="Number"
                      required
                    ></b-form-input>
                  </b-form-group>
                </b-col>
            </b-row>
            <div class="w-100">
              <b-button type="submit" class="float-right" variant="primary">Submit</b-button>
              <b-button type="reset" class="float-right" variant="danger">Reset</b-button>    
            </div>
            </b-form>
            
              
            <template #modal-footer>
              <div class="w-100">    
              </div>
            </template>
          </b-modal>

          <!-- Modal for showing Component Details-->
          <b-modal v-model="showComponentModal" :title="detailModal.title" :id="detailModal.id" size="lg" ok-only >
            <b-row>
              <b-col cols="3">
                Name :
              </b-col>
              <b-col cols="9">
                {{detailModal.content.name}}
              </b-col>
              <b-col cols="3">
                Stock :
              </b-col>
              <b-col cols="9">
                {{detailModal.content.props.stock}}
              </b-col>
              <b-col cols="3">
                Price :
              </b-col>
              <b-col cols="9">
                {{detailModal.content.props.price}}
              </b-col>
              <b-col cols="3">
                Created At:
              </b-col>
              <b-col cols="9">
                {{detailModal.content.createdAt}}
              </b-col>
              <b-col cols="3">
                Updated At :
              </b-col>
              <b-col cols="9">
                {{detailModal.content.updatedAt}}
              </b-col>
            </b-row>
            <template #modal-footer>
              <div class="w-100">    
              </div>
            </template>
          </b-modal>
        <!-- Delete Component modal-->
          <b-modal 
          @ok="onSubmitDelete" 
          v-model="deleteComponentModal" 
          :title="deleteModal.title" 
          :id="deleteModal.id" 
          ok-only >
            <b-row>
              {{deleteModal.message}}
            </b-row>
          </b-modal>
      </b-col>
      <b-col cols="12">
        <!-- Solid divider -->
        <hr class="solid">
      </b-col>
      
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
        <!-- Search Box -->
        <b-row style="margin-bottom:15px;">
            <b-col cols="4" />
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
              :filter="search"
              hover
              outlined
              head-variant="dark"
              :per-page="perPage"
              :current-page="currentPage"
              :items="items" 
              :fields="table_fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :stacked= stackedStatus 
              small
              responsive="sm">
              <template #cell(stock)="row">
                {{(row.item.props)?row.item.props.stock:'NO PROP'}}
                  
              </template>
              <template #cell(price)="row">
                {{(row.item.props)?row.item.props.price:'NO PROP'}}
                  
              </template>
              <template v-slot:cell(actions)="row">
                <b-dropdown variant="success" size="sm" text="Menu" no-caret>
                  <template #button-content>
                    <feather-icon size="1x" icon="MenuIcon" />
                  </template>
                  <b-dropdown-item>
                    <b-button variant="success" size="sm" @click="detail(row.item, row.index, $event.target)" style="margin-right:10px"><feather-icon size="1x" icon="EyeIcon" /></b-button>
                  </b-dropdown-item>
                  <b-dropdown-item v-if="permission.edit">
                    <b-button variant="primary" size="sm" style="margin-right:10px" @click="edit(row.item, row.index, $event.target)"><feather-icon size="1x" icon="EditIcon" /> </b-button>
                  </b-dropdown-item>
                  <b-dropdown-item v-if="permission.delete">
                    <b-button variant="danger" size="sm" style="margin-right:10px" @click="deleteOpen(row.item, row.index, $event.target)" ><feather-icon size="1x" icon="Trash2Icon" /></b-button>
                  </b-dropdown-item>
                </b-dropdown>
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
</template>


<script>
import { dateFormat, userAccess, userAccessManufacture, viewAccess } from '@/utils/utils.js';

export default {
 //name: 'User',
  components: {
  },
  data() {
    return {
      stackedStatus:"md",
      showSpinner: false,
      //sort direction list
      directions: [
          { key: false, label: 'Asc', sortable: true },
          { key: true, label: 'Desc', sortable: true },
      ],
      search: "",
      pageOptions: [5, 10, 20, 100],
      sortBy: '',
      sortDesc: false,
      currentPage: 1,
      perPage: 5,
      //for add items
      addComponentModal:false,
      addModal:{
        id:'add-modal-item',
        title:'',
        form: {
          name:'',
          props:{
            stock:0,
            price:0,
          },
          createdAt:'',
        }
      },
      


      //for edit items
      editComponentModal:false,
      editModal: {
        id: 'edit-modal-item',
        title: '',
        form: {
          name:'',
          props:{
            stock:0,
            price:0,
          },
        }
      },
      
      show: true,

      //for show itemdetails
      showComponentModal:false,
      detailModal: {
        id: 'detail-modal-component',
        title: '',
        content: {
          name:'',
          props:{
            stock:0,
            price:0,
          },
          createdAt:'',
          updatedAt:'',
        }
      },

      //for delete Bo,
      deleteComponentModal:false,
      deleteModal: {
        id: 'delete-modal-component',
        title: ' ',
        message:' ',
        content: {
          id:'',
          name:''
        }
      }
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

    onSubmitAdd(event) {
      event.preventDefault()
      this.$store.dispatch("bom/addComponent",this.addModal.form).
      then(x=>{
        this.addComponentModal=false;
        this.$bvToast.toast("Add Component run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
        this.addModal.form = {
          ...this.addModal.form,
          name: '',
          props: {
            stock: 0,
            price: 0,
          }
        }
      }).
      catch(err=>{
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })
      
    },
    
    onSubmitEdit(event) {
      event.preventDefault()
      this.$store.dispatch("bom/editComponent",{id:this.editModal.form.id,payload:this.editModal.form}).
      then(x=>{
        this.editComponentModal=false;
        this.$bvToast.toast("Edit Component run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
      }).
      catch(err=>{
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })
    },
    onSubmitDelete(event){
      event.preventDefault();
      this.$store.dispatch("bom/deleteComponent",this.deleteModal.content.id).
      then(x=>{
        this.deleteComponentModal=false;
        this.$bvToast.toast("delete Component run Successfully", {
            title: "Success",
            variant: "success",
            solid: true,
          });
      }).
      catch(err=>{
        console.log(err.message);
        this.$bvToast.toast(err, {
            title: "Error",
            variant: "warning",
            solid: true,
          });
      })
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.addModal.form = {
        ...this.addModal.form,
        name: '',
        props: {
          stock: 0,
          price: 0,
        }
      }
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    detail(item,index,event){
      this.detailModal.title=item.name;
      this.detailModal.content={
        createdAt:item.createdAt,
        updatedAt:item.updatedAt,
        name:item.name,
        id:item.id,
        props:{
          stock:item.props.stock,
          price:item.props.price,
        }
      }
      this.showComponentModal=true;
    },
    add(){
      this.addModal.title="Add New component"
      this.addComponentModal=true;
    },
    edit(item,index,event){
      
      this.editModal.title="Edit "+item.name;
      this.editModal.form={
        name:item.name,
        id:item.id,
        props:{
          stock:(item.props)?item.props.stock:0,
          price:(item.props)?item.props.price:0,
        }
      }
      console.log(this.editModal.form)
      this.editComponentModal=true;
    },
    deleteOpen(item,index,event){
      console.log('delete triggered');
      this.deleteModal={
       title:"Delete Component "+item.name,
       message:"Would you like to delete Component "+item.name+" ?",
       content:item
      };
      this.deleteComponentModal=true;
    }
  },
  computed: {
    permission() {
      return userAccessManufacture('component','item');
    },
    items(){
      var filter=this.search.toString();
      var list = this.$store.getters["bom/getComponents"].filter(x=>{
        return x.name.includes(filter)
      });
      return list;

    },
    rows() {
      return this.items.length;
    },
    table_fields(){
      return [{
          key: "name",
          label: "Name",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },
        {
          key: "stock",
          label: "Stock",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },
        {
          key: "price",
          label: "Price",
          filterable: true,
          sortable: true,
        //   stickyColumn: true,
        },'actions']
    },
    // Create an options list from our fields
    sortOptions() {
      return this.table_fields
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
  },
  mounted(){
    this.$store.dispatch("bom/getItems");

    //this.$store.dispatch("bom/getBOM");
    //this.$store.dispatch("bom/getComponents");
    
    // Saving Menu Setting on localstorage session so it still same even after reloading the page
    if (this.$session.has("perPageComponentManufacture")) {
      this.perPage = this.$session.get("perPageComponentManufacture")
    }
    if (this.$session.has("sortByComponentManufacture")) {
      this.sortBy = this.$session.get("sortByComponentManufacture")
    }
    if (this.$session.has("sortDescComponentManufacture")) {
      this.sortDesc = this.$session.get("sortDescComponentManufacture")
    }
    // if (this.$session.has("stackedStatusComponentManufacture")) {
    //   this.stackedStatus = this.$session.get("stackedStatusComponentManufacture")
    // }
  },

  watch: {
    // Taking the Menu Setting from localstorage session so the setting will be the same as before
    perPage(perPageNew) {
      this.$session.set("perPageComponentManufacture", perPageNew)
    },
    sortBy(sortByNew) {
      this.$session.set("sortByComponentManufacture", sortByNew)
    },
    sortDesc(sortDescNew) {
      this.$session.set("sortDescComponentManufacture", sortDescNew)
    },
    // stackedStatus(stackedStatusNew) {
    //   this.$session.set("stackedStatusComponentManufacture", stackedStatusNew)
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
