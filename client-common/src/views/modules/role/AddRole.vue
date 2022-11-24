<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item to="/role">Role</b-breadcrumb-item>
      <b-breadcrumb-item active>Add Role</b-breadcrumb-item>
    </b-breadcrumb><br>

    <b-card title="Add Role">
      <b-row style="margin-bottom:15px;">
        <b-col cols="12">
          <b-button
            variant="primary"
            to="/role"
          >
            Back to Role
          </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="6">
          <b-form-group
            label="Name"
            label-for="form-name"
          >
            <b-form-input
              id="form-name"
              v-model="form.name"
            />
          </b-form-group>
        </b-col>

        <b-col cols="6">
          <b-form-group
            label="Level"
            label-for="form-level"
          >
            <b-form-input
              id="form-level"
              v-model="form.level"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-row class="permission-border">
        <b-col cols="12" style="overflow-y: scroll; max-height: 500px; width: 100%; overflow-x: hidden;">
          <feather-icon icon="LockIcon" style="width:20px; height:20px; margin-right:15px;"/>
          <span class="font-weight-bold" style="font-size:15px;">Permissions</span>

          <div v-for="(domain, domain_index) in domain" :key="`domain${domain_index}`">
            <hr>
            
            <strong style="font-size:15px;">{{domain.name}} </strong>
            <feather-icon
              v-if="show[domain_index]"
              size="16"
              icon="ChevronDownIcon"
              @click="collapseFunction(domain_index)"
              style="cursor: pointer;"
            />
            <feather-icon
              v-if="!show[domain_index]"
              size="16"
              icon="ChevronUpIcon"
              @click="expandFunction(domain_index)"
              style="cursor: pointer;"
            />
            
            <div v-if="show[domain_index]">
              <b-form-checkbox
                v-model="domain.allAccess"
                :value="true"
                :unchecked-value="false"
                style="margin-top:10px;"
              >
                All Access
              </b-form-checkbox>
              <div v-if="!domain.allAccess">
                <b-row style="margin-top:10px;">
                  <b-col cols="2">
                    <strong>Menu</strong>
                  </b-col>
                  <b-col cols="2" style="display: table; margin: 0 auto;">
                    <strong>View</strong>
                  </b-col>
                  <b-col cols="2" style="display: table; margin: 0 auto;">
                    <strong>Add</strong>
                  </b-col>
                  <b-col cols="2" style="display: table; margin: 0 auto;">
                    <strong>Edit</strong>
                  </b-col>
                  <b-col cols="2" style="display: table; margin: 0 auto;">
                    <strong>Delete</strong>
                  </b-col>
                </b-row>

                <div v-for="(tr, index) in domain.menu" :key="domain.name + index">
                  <b-row style="margin-top:10px;">
                    <b-col cols="2">
                      {{tr.name}}
                    </b-col>
                    <b-col cols="2" style="display: table; margin: 0 auto;">
                      <b-form-checkbox
                        v-model="tr.view"
                        v-if="tr.hasOwnProperty('view')"
                        :value="true"
                        :unchecked-value="false"
                      ></b-form-checkbox>
                    </b-col>
                    <b-col cols="2" style="display: table; margin: 0 auto;">
                      <b-form-checkbox
                        v-model="tr.add"
                        v-if="tr.hasOwnProperty('add')"
                        :value="true"
                        :unchecked-value="false"
                      ></b-form-checkbox>
                    </b-col>
                    <b-col cols="2" style="display: table; margin: 0 auto;">
                      <b-form-checkbox
                        v-model="tr.edit"
                        v-if="tr.hasOwnProperty('edit')"
                        :value="true"
                        :unchecked-value="false"
                      ></b-form-checkbox>
                    </b-col>
                    <b-col cols="2" style="display: table; margin: 0 auto;">
                      <b-form-checkbox
                        v-model="tr.delete"
                        v-if="tr.hasOwnProperty('delete')"
                        :value="true"
                        :unchecked-value="false"
                      ></b-form-checkbox>
                    </b-col>
                  </b-row>
                </div>

                <div v-for="(menu, idx) in domain.mainmenu" :key="menu+idx">
                  <div style="font-size:14px; margin-top:10px;">
                    <strong>{{menu}}</strong>
                  </div>

                  <div v-for="(tr, index) in domain[menu.toLowerCase()]" :key="'commerce_'+menu+index">
                    <b-row style="margin-top:10px;">
                      <b-col cols="2">
                        {{tr.name}}
                      </b-col>
                      <b-col cols="2" style="display: table; margin: 0 auto;">
                        <b-form-checkbox
                          v-model="tr.view"
                          v-if="tr.hasOwnProperty('view')"
                          :value="true"
                          :unchecked-value="false"
                        ></b-form-checkbox>
                      </b-col>
                      <b-col cols="2" style="display: table; margin: 0 auto;">
                        <b-form-checkbox
                          v-model="tr.add"
                          v-if="tr.hasOwnProperty('add')"
                          :value="true"
                          :unchecked-value="false"
                        ></b-form-checkbox>
                      </b-col>
                      <b-col cols="2" style="display: table; margin: 0 auto;">
                        <b-form-checkbox
                          v-model="tr.edit"
                          v-if="tr.hasOwnProperty('edit')"
                          :value="true"
                          :unchecked-value="false"
                        ></b-form-checkbox>
                      </b-col>
                      <b-col cols="2" style="display: table; margin: 0 auto;">
                        <b-form-checkbox
                          v-model="tr.delete"
                          v-if="tr.hasOwnProperty('delete')"
                          :value="true"
                          :unchecked-value="false"
                        ></b-form-checkbox>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row><br>

      <b-col>
        <div>
          <b-button
            class="float-right"
            variant="primary"
            @click="addRole"
          >
            Save
          </b-button>
        </div>
      </b-col>
    </b-card>
  </div>
</template>

<script>
import { viewAccess } from '@/utils/utils.js';

export default {
  data() {
    return {
      form: {
        name: '',
        level: '',
        permission: ''
      },
      show: [true, true, true, true, true, true,true],
      domain: [
        {
          name: 'Common',
          allAccess: false,
          menu: [
          {
            name: 'Dashboard',
            view: false,
          },
          {
            name: 'Item',
            view: false,
            add: false,
            edit: false,
            delete: false,
          },
          {
            name: 'Role',
            view: false,
            add: false,
            edit: false,
            delete: false
          },
          {
            name: 'User',
            view: false,
            add: false,
            edit: false,
            delete: false
          }
        ]
        },
        {
          name: 'Commerce',
          allAccess: false,
          mainmenu: ['Purchase', 'Sales', 'Payment', 'POS'],
          menu: [
            {
              name: 'Dashboard',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'User',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Receive',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Warranty',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Settings',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          purchase: [
            {
              name: 'Purchase Request',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Purchase Order',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          sales: [
            {
              name: 'Quotation',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Sales Order',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          payment: [
            {
              name: 'Invoice',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Payment',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          pos: [
            {
              name: 'Transaction-Home',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Receipt',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Transaction List',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Receipt List',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Reserve List',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Commission Admin',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Commission One',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ]
        },
        {
          name: 'Manufacture',
          allAccess: false,
          mainmenu: ['Item', 'Plant', 'ProdManagement', 'Monitoring', 'Energy', 'Other'],
          menu: [
            {
              name: 'Dashboard',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'User',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Job Order',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Maintenance',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          item: [
            {
              name: 'Component',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'BOM',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          plant: [
            {
              name: 'Hardware',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Station',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          prodmanagement: [
            {
              name: 'Instruction',
              view: false,
              add: false,
              edit: false,
              delete: false
            },{
              name: 'Recipe',
              view: false,
              add: false,
              edit: false,
              delete: false
            },{
              name: 'Work Order',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Production',
              view: false,
              add: false,
              edit: false,
              delete: false,
              scan: false,
            },
            {
              name: 'Production SSE',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Production List',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
          ],
          monitoring: [
            {
              name: 'Operator Monitor',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Equipment',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Indicator',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          energy: [
            {
              name: 'Parameter',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Energy Consumption',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          other: [
            {
              name: 'Andon',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Debug',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Canvas',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Executor',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Recycle',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ]
        },
        {
          name: 'Quality Control',
          allAccess: false,
          mainmenu: ['Masterdata', 'Core'],
          masterdata: [
          {
              name: "Sample Code",
              view: false,
              add: false,
              edit: false,
              delete: false,
            },
            {
              name: "Test Parameter",
              view: false,
              add: false,
              edit: false,
              delete: false,
            },
            {
              name: "Item",
              view: false,
              edit: false,
            },
            {
              name: "Station",
              view: false,
              add: false,
              edit: false,
              delete: false,
            },
            {
              name: 'User',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          core: [
            {
              name: "Print Barcode",
              view: false,
              add: false,
            },
            {
              name: "Queue",
              view: false,
              edit: false,
              delete: false,
            },
            {
              name: "Quality Control",
              view: false,
              edit: false,
            },
            {
              name: "Report",
              view: false,
              delete: false,
            }
          ],
        },
        {
          name: 'Distribution',
          allAccess: false,
          mainmenu: ['Masterdata', 'Core', 'InBound', 'OutBound'],
          menu: [
            {
              name: 'Dashboard',
              view: false,
            },
            {
              name: 'User',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          masterdata: [
            {
              name: 'Vehicle',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Courier',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Location',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Warehouse',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Warehouse Maps',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          core: [
            {
              name: 'Inventory',
              view: false,
              add: false,
              delete: false
            },
            {
              name: 'Moving',
              view: false,
              add: false,
              edit: false,
              delete: false
            }
          ],
          inbound: [
            {
              name: 'Arrival',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Return',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Unpacking',
              view: false,
              add: false,
              edit: false
            },
            {
              name: 'Put Away',
              view: false,
              add: false,
              edit: false,
            }
          ],
          outbound: [
            {
              name: 'Picking',
              view: false,
              add: false,
              edit: false,
              delete: false
            },
            {
              name: 'Packing',
              view: false,
              add: false,
              edit: false
            },
            {
              name: 'Delivery',
              view: false,
              add: false,
              edit: false,
            },
            {
              name: 'Order',
              view: false
            }
          ]
        },
        {
          name: 'Planner',
          allAccess: false,
          menu: [
            {
              name: "Schedule",
              view: false,
            },
            {
              name: "Work Order",
              view: false,
              edit: false,
            },
            {
              name: "Job Order",
              view: false,
              edit: false,
            },
            {
              name: "Delivery Order",
              view: false,
              edit: false,
            },
            {
              name: "Issue",
              view: false,
              edit: false,
              add: false,
              delete: false,
            },
            {
              name: "Operator Input",
              view: false,
              add: false,
            },
          ]
        },
        {
          name : 'Valve',
          allAccess : false,
          menu : [
            {
              name : "Color",
              edit : false,
              delete : false,
              add : false,
            },
            {
              name : "Line",
              edit : false,
              delete : false,
              add : false,
            },
            {
              name : "Pump",
              edit : false,
              view : false,
              delete : false,
              add : false,
            },
            {
              name : "Unloading Station",
              view : false,
              edit : false,
              delete : false,
              add : false,
            },
            {
              name : "Tank",
              view : false,
              edit : false,
              delete : false,
              add : false,
            }
          ]
        },
      ],
    }
  },
  methods: {
    collapseFunction(index) {
      this.show = this.show.map((el, mapIndex) => {
        if (index === mapIndex) {
          return false
        } else {
          return el
        }
      })
    },

    expandFunction(index) {
      this.show = this.show.map((el, mapIndex) => {
        if (index === mapIndex) {
          return true
        } else {
          return el
        }
      })
    },

    addRole() {
      if (this.form.name === 'Super Admin') {
        this.$bvToast.toast('Super Admin name is prohibited.', {
          title: 'Failed',
          variant: 'danger',
          solid: true,
        })
        return
      }
      this.$store
        .dispatch('role/addRole', {
          ...this.form,
          permission: this.domain,
          app: this.$session.get('phibase-app')
        })
        .then(() => {
          this.$bvToast.toast('Successfully Add Role', {
            title: 'Success',
            variant: 'success',
            solid: true,
          })
          this.$router.push('/role');
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
  },
  computed: {
    home() {
      return viewAccess()[0]
    },
  },
  created() {
    document.title = 'Add Role | Phibase - Common'
  },
}
</script>

<style>
.permission-border {
  border-radius: 10px;
  border: 2px solid #CCCCCC;
  padding: 20px;
  margin: 5px;
}
</style>