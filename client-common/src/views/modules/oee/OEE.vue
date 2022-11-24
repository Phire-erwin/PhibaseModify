<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item :to="`/${home}`">
        <b-icon icon="house-fill" scale="1.25" shift-v="1.25" aria-hidden="true"></b-icon>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>OEE</b-breadcrumb-item>
    </b-breadcrumb><br>

    <b-card title="OEE">
      <b-row>
        <b-col>
          OEE (Overall Equipment Effectiveness) is the gold standard for measuring manufacturing productivity. Simply put - it identifies the percentage of manufacturing time that is truly productive. An OEE score of 100% means you are manufacturing only Good Parts, as fast as possible, with no Stop Time. In the language of OEE that means 100% Quality (only Good Parts), 100% Performance (as fast as possible), and 100% Availability (no Stop Time).
        </b-col>
      </b-row><br>

      <b-row>
        <b-col cols="3">
        </b-col>

        <b-col cols="6">
          <b-card bg-variant="light">
            <b-row>
              <b-col cols="6">
                <span class="font-weight-bold">Shift Length (Hours)</span>
              </b-col>

              <b-col cols="6">
                <b-input
                  type="number"
                  v-model="form.shiftLength"
                />
              </b-col>
            </b-row><br>

            <b-row>
              <b-col cols="6">
                <span class="font-weight-bold">Total Break Time (Minutes)</span>
              </b-col>

              <b-col cols="6">
                <b-input
                  type="number"
                  v-model="form.breakTime"
                />
              </b-col>
            </b-row><br>

            <b-row>
              <b-col cols="6">
                <span class="font-weight-bold">Total Down Time (Minutes)</span>
              </b-col>

              <b-col cols="6">
                <b-input
                  type="number"
                  v-model="form.downTime"
                />
              </b-col>
            </b-row><br>

            <b-row>
              <b-col cols="6">
                <span class="font-weight-bold">Ideal Cycle Time (Seconds)</span>
              </b-col>

              <b-col cols="6">
                <b-input
                  type="number"
                  v-model="form.cycleTime"
                />
              </b-col>
            </b-row><br>

            <b-row>
              <b-col cols="6">
                <span class="font-weight-bold">Total Produced Item</span>
              </b-col>

              <b-col cols="6">
                <b-input
                  type="number"
                  v-model="form.producedItem"
                />
              </b-col>
            </b-row><br>

            <b-row>
              <b-col cols="6">
                <span class="font-weight-bold">Defect Item</span>
              </b-col>

              <b-col cols="6">
                <b-input
                  type="number"
                  v-model="form.defectItem"
                />
              </b-col>
            </b-row>
          </b-card>
        </b-col>

        <b-col cols="3">
        </b-col>
      </b-row>

      <div v-if="!isEmpty">
        <b-container fluid>
          <b-row cols="1" cols-sm="1" cols-md="2" cols-lg="4">
            <b-col>
              <b-card
                align="center"
                bg-variant="success"
                body-text-variant="light">
                <strong style="font-size:20px">Availability</strong><br>
                <strong style="font-size:50px">{{ oeeCalculation[0] }} %</strong>
              </b-card>
            </b-col>

            <b-col>
              <b-card
                align="center"
                bg-variant="info"
                body-text-variant="light">
                <strong style="font-size:20px">Performance</strong><br>
                <strong style="font-size:50px">{{ oeeCalculation[1] }} %</strong>
              </b-card>
            </b-col>

            <b-col>
              <b-card
                align="center"
                bg-variant="warning"
                body-text-variant="light">
                <strong style="font-size:20px">Quality</strong><br>
                <strong style="font-size:50px">{{ oeeCalculation[2] }} %</strong>
              </b-card>
            </b-col>

            <b-col>
              <b-card
                align="center"
                bg-variant="danger"
                body-text-variant="light">
                <strong style="font-size:20px">OEE</strong><br>
                <strong style="font-size:50px">{{ oeeCalculation[3] }} %</strong>
              </b-card>
            </b-col>
          </b-row>
        </b-container>

        <b-row>
          <b-col>
            <div style="text-align:center">
              <strong>Don't fixate on the <i>absolute value</i> of the number. Fixate on your ability to <i>improve</i> the number.</strong>
            </div>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
import { viewAccess } from '@/utils/utils.js';

export default {
  data() {
    return {
      form: {
        shiftLength: '',
        breakTime: '',
        downTime: '',
        cycleTime: '',
        producedItem: '',
        defectItem: ''
      }
    }
  },
  methods: {
  },
  computed: {
    home() {
      return viewAccess()[0]
    },

    isEmpty() {
      // Get form values
      var values = Object.values(this.form);

      if (values.includes('')) {
        return true
      } else {
        return false
      }
    },

    oeeCalculation() {
      if (this.isEmpty) {
        return ''
      }

      var plannedProductionTime = this.form.shiftLength * 60 - this.form.breakTime;
      var runTime = plannedProductionTime - this.form.downTime;
      var goodItem = this.form.producedItem - this.form.defectItem;

      // Availability
      var availability = (runTime * 100 / plannedProductionTime).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      // Performance
      var performance = (this.form.cycleTime * this.form.producedItem * 100 / (runTime * 60)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      // Quality
      var quality = (goodItem * 100 / this.form.producedItem).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      // OEE
      var oee = (availability * performance * quality / 10000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      return [
        availability,
        performance,
        quality,
        oee
      ]
    }
  },
  created() {
    document.title = 'OEE | Phibase - Common'
  },
  mounted() {
  },
}
</script>