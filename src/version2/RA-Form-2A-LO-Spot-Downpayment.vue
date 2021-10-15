<template>
    <div>
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> RA - FORM 2A - LO</p> </div>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                <div class="flex px-4 gap-4">
                    <div class="w-2/5"> <input-form label="Last Name" v-model="buyer.last_name" /> </div>
                    <div class="w-2/5"> <input-form label="First Name" v-model="buyer.first_name" /> </div>
                    <div class="w-1/5"> <input-form label="M.I." v-model="buyer.middle_initial" /> </div>
                </div>
                <div class="full px-4"> <readonly-form label="Reservation Date" v-bind:value="payment_details.date" /> </div>
                <div class="full px-4"> <readonly-form label="Project Name" :value="unit.project_name" /> </div>
                <div class="grid grid-cols-4 gap-4 px-4">
                    <div class="full px-1"> <readonly-form label="Block" v-bind:value="unit.block" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot" v-bind:value="unit.lot" /> </div>
                    <div class="full px-1"> <readonly-form label="Phase" v-bind:value="getPhase()" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot Area" v-bind:value="unit.lot_area" /> </div>
                </div>
                <div class="full px-4"> <readonly-form label="Project Address" v-bind:value="unit.project_address" /> </div>
                <div class="grid grid-cols-2 gap-4 px-4">
                    <div class="full"> <input-form label="Price/Sq.M (PHP)" v-model="unit.price_per_sqm" /> </div>
                    <div class="full"> <input-form label="House Type" v-model="unit.lot_type" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Home Address" v-model="buyer.home_address" /> </div>
                <div class="flex px-4 gap-4">
                    <div class="w-1/2"> <input-form label="Contact No." v-model="buyer.contact_number" /> </div>
                    <div class="w-1/2"> <input-form label="Email Address" v-model="buyer.email_address" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Realty's Name" v-model="unit.realty_name" /> </div>
                <div class="full px-4"> <input-form label="Agent's Name" v-model="unit.agent_name" /> </div>
            </div>

            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> WIH SPOT DOWNPAYMENT / ADVANCE DOWNPAYMENT </p> </div>
            <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                <!-- TOTAL CONTRACT PRICE  -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="numbers"
                                :value="payment_details.total_contract_price"
                                @change="updateTCP"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                        </div>
                    </div>
                </div>

                <!-- SPOT DOWNPAYMENT / ADVANCE PAYMENT -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Spot Downpayment / <br> Advance Payment</p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <!-- <input-form v-model="payment_details.spot_downpayment" /> -->
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="numbers"
                                :value="payment_details.spot_downpayment"
                                @change="updateSpotDownpayment"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase"></div>
                        </div>
                    </div> </div>
                </div>

                <!-- NEW TCP LESS  -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">NEW TCP Less <br> Downpayment</p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <!-- <input-form v-model="payment_details.new_tcp_less_downpayment" /> -->
                        <input type="text"
                                :value="payment_details.new_tcp_less_downpayment"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                    </div> </div>
                </div>

                <!-- MONTHLY INSTALLMENT -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2">
                        <p class="align-middle text-right text-xs font-bold">MONTHLY INSTALLMENT for <br />
                            <input type="text"
                                v-model="payment_details.installment_months" @change="updateIM"
                                class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                            > months:
                        </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <!-- <input-form v-model="payment_details.monthly_installment" /> -->
                        <input type="text"
                                :value="payment_details.monthly_installment"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                    </div> </div>
                </div>

                <!-- INSTALLMENT START AND END DATES -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Monthly Installment (Start - End): </p></div>
                    <div class="w-3/4"> <div class="items-starts border border-gray-200 w-3/4 rounded-md ">
                        <vue-date-picker class="border border-white" @confirm="upDate($event)"/>
                    </div> </div>
                </div>
            </div>
            <div class="flex items-center">
                <button
                    type="button"
                    v-on:click="submitForm()"
                    class="bg-gray-600 py-4 mx-auto w-1/4 align-middle text-white font-bold border rounded-md">
                    SUBMIT RESERVATION
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import InputForm from '../components/v2/InputForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'

    export default({
        components: {
            'main-header': Header,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm,
            'vue-date-picker': VueHotelDatepicker
        },
        data() {
            return {
                buyer: {
                    last_name: '',
                    first_name: '',
                    middle_initial: '',
                    contact_number: '',
                    email_address: '',
                    home_address: '',
                },
                unit: {
                    project_name: this.$store.state.unit.project.project_name,
                    block: this.$store.state.unit.block.block_name,
                    lot: this.$store.state.unit.lot.lot_name,
                    lot_id: this.$store.state.unit.lot.lot_id,
                    phase: '',
                    project_address: this.$store.state.unit.project.project_location,
                    price_per_sqm: '',
                    realty_name: '',
                    agent_name: '',
                    lot_area: `${this.$store.state.unit.unit_details.lot_area} SQ. M`,
                    lot_type: '',
                },
                payment_details: {
                    date: '',
                    total_contract_price: '',
                    installment_months: '',
                    monthly_installment: '',
                    spot_downpayment: '',
                    new_tcp_less_downpayment: '',
                    monthly_start_date: '',
                    monthly_end_date: '',
                    reservation_type: 6,
                }
            }
        },
        mounted() {
            console.log('ADD BUYER FORM mounted STATE.UNIT', this.$store.state.unit)
        },
        created() {
            let today = new Date()
            this.payment_details.date = today
            return this.payment_details.date
        },
        methods: {
            upDate(event) {
                console.log('Updating dates', event)
                this.payment_details.monthly_start_date = event.start
                this.payment_details.monthly_end_date = event.end
                console.log('Updated dates', this.payment_details)
            },
            updateTCP(event) {
                this.payment_details.total_contract_price = event.target.value
                console.log('UpdateTCP', this.payment_details.total_contract_price)
                this.updateCalculations()
            },
            updateSpotDownpayment(event) {
                this.payment_details.spot_downpayment = event.target.value
                console.log('UpdateSpotDownpayment', this.payment_details.spot_downpayment)
                this.updateCalculations()
            },
            updateIM(event) {
                this.payment_details.installment_months = event.target.value
                console.log('UpdateIM', this.payment_details.installment_months)
                this.updateCalculations()
            },
            updateCalculations() {
                this.payment_details.new_tcp_less_downpayment = this.payment_details.total_contract_price - this.payment_details.spot_downpayment
                this.payment_details.monthly_installment = this.payment_details.installment_months
                                    ? this.payment_details.new_tcp_less_downpayment / this.payment_details.installment_months : 0
            },
            getPhase() {
                return  this.$store.state.unit.phase.phase_name &&
                        this.$store.state.unit.phase.phase_id ?
                        this.$store.state.unit.phase.phase_name : 'N/A'
            },
            submitForm() {

                // insert error validation here
                // user should only click here once
                // add loading screen

                console.log('submitForm')
                const dataToSubmit = {  buyer: this.buyer,
                                        unit: this.unit,
                                        payment_details: this.payment_details }
                console.log({dataToSubmit})
                ipcRenderer.send('addLotOnlyBuyer', dataToSubmit)
                this.$router.push('/')
            }
        }
    })
</script>