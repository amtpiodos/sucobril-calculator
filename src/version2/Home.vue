<template>
    <div class="h-screen my-24">
        <div class="w-3/5 flex mx-auto">
            <div class="w-full mr-4">
                <label-component label="SELECT NEWER DATE" class="text-center my-1"/>
                <!-- <datepicker v-model="date1" @selected="upDate($event, 1)" :typeable=true placeholder="Select Date 1..." class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker> -->
                <input
                    type="text"
                    v-model="month1"
                    placeholder="MM (Month)"
                    class="my-1 p-2 px-2 w-full border border-gray-200 rounded-md"
                >
                <input
                    type="text"
                    v-model="day1"
                    placeholder="DD (Day)"
                    class="my-1 p-2 px-2 w-full border border-gray-200 rounded-md"
                >
                <input
                    type="text"
                    v-model="year1"
                    placeholder="YYYY (Year)"
                    class="my-1 p-2 px-2 w-full border border-gray-200 rounded-md"
                >
                <!-- <div v-if="typeof(date1) === 'object'">
                    <p class="mb-1 mt-1 text-center"> D1: {{ date1.getDate() }} </p>
                    <p class="mb-1 mt-1 text-center"> M1: {{ date1.getMonth()F+ }} </p>
                    <p class="mb-1 mt-1 text-center"> Y1: {{ date1.getFullYear() }} </p>
                </div> -->
            </div>
            <div class="w-full mx-4">
                <label-component label="SELECT OLDER DATE" class="text-center my-1"/>
                <!-- <datepicker v-model="date2" @change="upDate($event, 2)" :typeable=true placeholder="Select Date 2..." class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker> -->
                <input
                    type="text"
                    v-model="month2"
                    placeholder="MM (Month)"
                    class="my-1 p-2 px-2 w-full border border-gray-200 rounded-md"
                >
                <input
                    type="text"
                    v-model="day2"
                    placeholder="DD (Day)"
                    class="my-1 p-2 px-2 w-full border border-gray-200 rounded-md"
                >
                <input
                    type="text"
                    v-model="year2"
                    placeholder="YYYY (Year)"
                    class="my-1 p-2 px-2 w-full border border-gray-200 rounded-md"
                >
                <!-- <div v-if="typeof(date2) === 'object'">
                    <p class="mb-1 mt-1 text-center"> D2: {{ date2.getDate() }} </p>
                    <p class="mb-1 mt-1 text-center"> M2: {{ date2.getMonth()+1 }} </p>
                    <p class="mb-1 mt-1 text-center"> Y2: {{ date2.getFullYear() }} </p>
                </div> -->
            </div>
            
        </div>

        <div class="w-1/2 my-4 mx-auto flex">
                <div class="w-1/2 mx-1 mr-3">
                    <label-component label="SELECT GIVEN DAY" class="text-center my-1"/>
                    <select v-model="given_day" @change="upDate($event, 3)" placeholder="Select Given Day" class="px-2 py-4 w-full border-2 border-gray-400 rounded-md my-1">
                        <option class="" value="" disabled selected><p class="text-gray-300">Select Day..</p></option>
                        <option value=0>Sunday </option>
                        <option value=1>Monday</option>
                        <option value=2>Tuesday</option>
                        <option value=3>Wednesday</option>
                        <option value=4>Thursday</option>
                        <option value=5>Friday</option>
                        <option value=6>Saturday</option>
                    </select>
                    <p class="mt-1 text-center font-semibold"> {{ days[given_day] }} </p>
                </div>
                <div class="w-1/2 mx-1 ml-3">
                    <label-component label="FOR" class="text-center my-1"/>
                    <select v-model="day_for" @change="upDate($event, 4)" placeholder="Select Given Day" class="px-2 py-4 w-full border-2 border-gray-400 rounded-md my-1">
                        <option class="" value="" disabled selected><p class="text-gray-300">Select Day..</p></option>
                        <option value=0>Date 1 (newer date) </option>
                        <option value=1>Date 2 (older date) </option>
                    </select>
                    <p class="mt-1 text-center font-semibold"> {{ dates[day_for] }} </p>
                </div>
            </div>

        <div class="w-full flex items-center mx-auto justify-center gap-8 my-4">
            <img class="w-1/2" src="../assets/img/sucorbils_formula.jpg" />
        </div>

        <div class="w-1/2 flex items-center mx-auto justify-center gap-8 my-4">
            <button type="button" v-if="showReset" v-on:click="calculate()" class="bg-gray-600 p-4 w-1/2 align-middle text-white font-bold border rounded-md mb-4">CALCULATE</button>
            <button type="button" v-on:click="reset()" class="bg-gray-600 p-4 w-1/2 align-middle text-white font-bold border rounded-md mb-4">RESET</button>
        </div>

        <div class="w-1/4 items-center mx-auto justify-center gap-8 my-4" v-if="showResults">
            <p class="text-center"> y1 = {{ calculations.year1 }} ; y2 = {{ calculations.year2 }} <br/> </p>
            <p class="text-center"> m1 = {{ calculations.month1 }} ; m2 = {{ calculations.month2 }} <br/> </p>
            <p class="text-center"> d1 = {{ calculations.day1 }} ; d2 = {{ calculations.day2 }} <br/>  </p>
            <p class="text-center"> Em1 = {{ calculations.cumm_month1 }} ; Em2 = {{ calculations.cumm_month2 }} <br/> </p>
            <p class="text-center"> c = {{ c }} <br/> </p>
            <p class="font-semibold text-center"> k = {{ k }} </p>
            <p class="font-semibold text-center"> RESULT DAY: {{ result_day }} </p>
        </div>
    </div>
</template>

<script>
    import Label from '../components/v2/Label'
    import Datepicker from 'vuejs-datepicker'
    export default ({
        components: {
            'datepicker': Datepicker,
            'label-component': Label
        },
        data() {
            return {

                day1: '',
                day2: '',
                month1: '',
                month2: '',
                year1: '',
                year2: '',

                date1: '',
                date2: '',
                given_day: '',
                day_for: '',
                dates: ['Date 1 (newer date)', 'Date 2 (older date)'],
                c: '',
                k: '',
                showReset: 1,
                showResults: 0,
                cummulativeDays: [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                result_days_forward: [
                    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday'],
                    ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'],
                    ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
                    ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                    ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                ],
                result_days_backward: [
                    ['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'],
                    ['Monday', 'Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday'],
                    ['Tuesday', 'Monday', 'Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday'],
                    ['Wednesday', 'Tuesday', 'Monday', 'Sunday', 'Saturday', 'Friday', 'Thursday'],
                    ['Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday', 'Saturday', 'Friday'],
                    ['Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday', 'Saturday'],
                    ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'],
                ],
                result_day: '',
                calculations: {
                    year1: '',
                    year2: '',
                    month1: '',
                    month2: '',
                    cumm_month1: '',
                    cumm_month2: '',
                    day1: '',
                    day2: '',
                    leap1: '',
                    leap2: '',
                    l1_l2: '',
                    new_date: ''
                }
                
            }
        },
        mounted() {
            
        },
        created() {
        
        },
        methods: {
            
            validateDate(event) {
                console.log('event', event, event.target, this.date1)
                // const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
                // if (!regex.test(this.date1)) {
                //     // If the input doesn't match MM/DD/YYYY, you can handle it here
                //     // For instance, clear the input or show an error message
                //     this.date1 = ''; // Clear the input
                // }
            },
            calculate() {
                // this.calculations.year1 = this.date1.getFullYear()
                // this.calculations.year2 = this.date2.getFullYear()
                // this.calculations.month1 = this.date1.getMonth()
                // this.calculations.month2 = this.date2.getMonth()
                // this.calculations.cumm_month1 = this.cummulativeDays[this.date1.getMonth()]
                // this.calculations.cumm_month2 = this.cummulativeDays[this.date2.getMonth()]
                // this.calculations.day1 = this.date1.getDate()
                // this.calculations.day2 = this.date2.getDate()

                this.calculations.year1 = this.year1
                this.calculations.year2 = this.year2
                this.calculations.month1 = this.month1
                this.calculations.month2 = this.month2
                this.calculations.cumm_month1 = this.cummulativeDays[this.month1]
                this.calculations.cumm_month2 = this.cummulativeDays[this.month2]
                this.calculations.day1 = this.day1
                this.calculations.day2 = this.day2

                this.calculations.leap1 = (this.calculations.year1 % 4 !== 0) || ((this.calculations.year1 % 4 == 0) && ((this.calculations.month1 == 0) || (this.calculations.month1 == 1 && this.calculations.day1 < 29))) ? 0 : 1
                this.calculations.leap2 = (this.calculations.year2 % 4 !== 0) || ((this.calculations.year2 % 4 == 0) && ((this.calculations.month2 > 1) || (this.calculations.month2 == 1 && this.calculations.day2 > 29))) ? 0 : 1
                this.calculations.l1_l2 = this.calculations.leap1 == 1 && this.calculations.leap2 == 1 ? 1 : this.calculations.leap1 + this.calculations.leap2

                console.log('y1', this.calculations.year1)
                console.log('y2', this.calculations.year2)
                console.log('cm1', this.calculations.cumm_month1)
                console.log('cm2', this.calculations.cumm_month2)
                console.log('d1', this.calculations.day1)
                console.log('d2', this.calculations.day2)
                console.log('leap1', this.calculations.leap1)
                console.log('leap2', this.calculations.leap2)
                console.log('l1_l2', this.calculations.l1_l2)

                this.c = parseInt((this.calculations.year1/100) - (this.calculations.year1/400) - (this.calculations.year2/100) + (this.calculations.year2/400))
                console.log(`((((${this.calculations.year1}  - ${this.calculations.year2})*365) + parseInt((${this.calculations.year1} - 1)/4) - parseInt(${this.calculations.year2}/4) + (${this.calculations.cumm_month1} - ${this.calculations.cumm_month2}) + (${this.calculations.day1} - ${this.calculations.day2}) + (${this.calculations.l1_l2}) - ${this.c}) % 7)`)
                this.k = ((((this.calculations.year1 - this.calculations.year2)*365) + parseInt((this.calculations.year1 - 1)/4) - parseInt(this.calculations.year2/4) + (this.calculations.cumm_month1 - this.calculations.cumm_month2) + (this.calculations.day1 - this.calculations.day2) + (this.calculations.l1_l2) - this.c) % 7)
                
                console.log('c, k', this.c, this.k)
                console.log('index of this.day_for', this.given_day, this.day_for, this.dates[this.day_for])
                this.result_day = this.day_for == 0 ? this.result_days_backward[this.given_day][this.k] : this.result_days_forward[this.given_day][this.k]
                this.showResults = 1
                // this.showReset = 0
            },
            reset() {
                this.day1 = '',
                this.day2 = '',
                this.month1 = '',
                this.month2 = '',
                this.year1 = '',
                this.year2 = '',
                this.given_day = '',
                this.day_for = '',

                this.calculations = {}
                this.c = 0
                this.k = 0
                this.showResults = 0
                this.showReset = 1
            },
            upDate(event, date) {
                console.log('Updating calculaions', event, date)
                switch(date) {
                    // case 1: this.date1 = event; break
                    // case 2: this.date2 = event; break
                    case 3: this.given_day = event.target.value; break
                    case 4: this.day_for = event.target.value; break
                    default: break;
                }
            }
        }
    })
</script>