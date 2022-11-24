<template>
  <div>
    <b-card-group deck>
      <b-card>
        <b-card-text>
          <b-row>
            <b-col cols="4" class="d-flex flex-column h-auto justify-content-center align-items-center">
              <feather-icon
                icon="SettingsIcon"
                style="width:60px;height:80px;color:#662E9B;"
              />
            </b-col>

            <b-col cols="8" class="d-flex flex-column h-auto justify-content-center align-items-center">
              <div style="padding-top:15px; color:#662E9B;">
                <span style="font-size:70px; font-weight:bold;">{{ roles.length }}</span>
                <span class="font-weight-bold" style="font-size:16px;"> ROLES</span>
              </div>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card>

      <b-card>
        <b-card-text>
          <b-row>
            <b-col cols="4" class="d-flex flex-column h-auto justify-content-center align-items-center">
              <feather-icon
                icon="UsersIcon"
                style="width:60px;height:80px;color:#F86624;"
              />
            </b-col>

            <b-col cols="8" class="d-flex flex-column h-auto justify-content-center align-items-center">
              <div style="padding-top:15px; color:#F86624;">
                <span style="font-size:70px; font-weight:bold;">{{ users.length }}</span>
                <span class="font-weight-bold" style="font-size:16px;"> USERS</span>
              </div>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card>

      <b-card>
        <b-card-text>
          <b-row>
            <b-col cols="4" class="d-flex flex-column h-auto justify-content-center align-items-center">
              <feather-icon
                icon="BoxIcon"
                style="width:60px;height:80px;color:#EA3546;"
              />
            </b-col>

            <b-col cols="8" class="d-flex flex-column h-auto justify-content-center align-items-center">
              <div style="padding-top:15px; color:#EA3546;">
                <span style="font-size:70px; font-weight:bold;">{{ items.length }}</span>
                <span class="font-weight-bold" style="font-size:16px;"> ITEMS</span>
              </div>
            </b-col>
          </b-row>
        </b-card-text>
      </b-card>
    </b-card-group><br>

    <b-card-group deck v-if="giveTime">
      <b-card>
        <apexchart height="450" :options="userChart.option" :series="userChart.series"></apexchart>
      </b-card>

      <b-card>
        <b-card-text>
          <div v-if="roleChart.series">
            <apexchart height="500" :options="roleChart.option" :series="roleChart.series"></apexchart>
          </div>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      giveTime : false,

      optionsrole: {
        chart: {
          height: 350,
          type: 'bar',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: true
        },
        colors:['#662E9B'],
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Role Distribution',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
          position: 'bottom'
        },
      },

      optionsuser: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: true
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Number of Registered Users by Date',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
        }
      },
    }
  },
  methods: {
  },
  computed: {
    roles() {
      var getRoles = this.$store.getters['role/getRole'] ? this.$store.getters['role/getRole'].filter(el => {
        return el.name !== 'Super Admin'
      }) : []
      return getRoles
    },
    users() {
      var getUsers = this.$store.getters['user/getUser'] ? this.$store.getters['user/getUser'].filter(doc => {
        return doc.role !== 'Super Admin'
      }) : []
      return getUsers
    },
    items() {
      var getItems = this.$store.getters['item/getItem'] ? this.$store.getters['item/getItem'] : []
      return getItems
    },
    roleChart(){
      let getRoleCounter = this.$store.getters['dashboard/getRoleCounter'];
      this.optionsrole.xaxis.categories = getRoleCounter.role;
      return {
        series: [{
          name: 'Roles',
          data: getRoleCounter.total
        }],
        option: this.optionsrole
      }
    },
    userChart(){
      var getUserByDate = this.$store.getters['dashboard/getUserByDate'];
      this.optionsuser.xaxis.categories = getUserByDate.date;
      return {
        series: [{
          name: 'New Users',
          data: getUserByDate.user
        }],
        option: this.optionsuser
      }
    },
  },
  created() {
    document.title = 'Dashboard | Phibase - Common'
  },
  mounted() {
    this.$store
      .dispatch('role/fetchRole')
      .catch(err => console.log(err))
    this.$store
      .dispatch('user/fetchUser')
      .catch(err => console.log(err))
    this.$store
      .dispatch('item/fetchItem')
      .catch(err => console.log(err))
    this.$store
      .dispatch('dashboard/fetchRoleCounter')
      .catch(err => console.log(err))
    this.$store
      .dispatch('dashboard/fetchUserByDate')
      .catch(err => console.log(err))

    setTimeout(()=>{
      this.giveTime = true;
    }, 300);
  },
}
</script>