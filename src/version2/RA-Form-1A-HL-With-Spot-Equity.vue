<template>
    <div>
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> RA - FORM 1A - HL</p> </div>
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
                <div class="full px-4"> <input-form label= "Agent's Name" v-model="unit.agent_name" /> </div>
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
                    </div> </div>
                </div>

                <!-- REQUIRED EQUITY  -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2 mt-1">
                        <p class="align-middle text-right text-xs font-bold">Required Equity 
                            <input type="number"
                                :value="payment_details.required_equity_percentage" @change="updateREP"
                                class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                            > %:
                        </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="text"
                                :value="payment_details.required_equity_amount"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div>
                    </div> </div>
                </div>

                <!-- SPOT CASH EQUITY LESS -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2 mt-1">
                        <p class="align-middle text-right text-xs font-bold">Spot Cash Equity Less
                            <input type="number"
                                :value="payment_details.spot_cash_equity_less_percentage" @change="updateSCEL"
                                class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                            > %:
                        </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <input type="text"
                            :value="payment_details.spot_cash_equity_less_amount"
                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                            readonly disabled>
                    </div> </div>
                </div>

                <!-- NET EQUITY LESS DISCOUNT  -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Net Equity Less Discount: </p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <input type="text"
                            :value="payment_details.net_equity_less_discount"
                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                            readonly disabled>
                    </div> </div>
                </div>

                <!-- RESERVATION FEE  -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="numbers"
                                :value="payment_details.reservation_fee"
                                @change="updateREF"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                        </div>
                    </div> </div>
                </div>

                <!-- EQUITY NEt OF RESERVATION FEE -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2">
                        <p class="align-middle text-right text-xs font-bold">Equity Net of Reservation Fee <br/>(shall be paid on or before 30 days from reservation): </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <input type="text"
                            :value="payment_details.equity_net_of_reservation_fee"
                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                            readonly disabled>
                    </div> </div>
                </div>

                <!-- BALANCE LOANABLE AMOUNT -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2">
                        <p class="align-middle text-right text-xs font-bold">Balance Loanable Amount <br/> After Equity
                            <input type="text"
                                v-model="payment_details.balance_loanable_percentage"
                                class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase bg-gray-100"
                                readonly disabled
                            > %:
                        </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="text"
                                :value="payment_details.balance_loanable_amount"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div>
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

    export default({
        components: {
            'main-header': Header,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm
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
                    lot_type: ''
                },
                payment_details: {
                    date: '',
                    total_contract_price: '',
                    required_equity_percentage: '',
                    required_equity_amount: '',
                    spot_cash_equity_less_percentage: '',
                    spot_cash_equity_less_amount: '',
                    net_equity_less_discount: '',
                    reservation_fee: '',
                    equity_net_of_reservation_fee: '',
                    reservation_type: 2,
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
            updateTCP(event) {
                this.payment_details.total_contract_price = event.target.value
                console.log('UpdateTCP', this.payment_details.total_contract_price)
                this.updateCalculations()
            },
            updateREP(event) {
                this.payment_details.required_equity_percentage = event.target.value
                console.log('UpdateREP', this.payment_details.required_equity_percentage)
                this.updateCalculations()
            },
            updateSCEL(event) {
                this.payment_details.spot_cash_equity_less_percentage = event.target.value
                console.log('UpdateSCEL', this.payment_details.spot_cash_equity_less_percentage)
                this.updateCalculations()
            },
            updateREF(event) {
                this.payment_details.reservation_fee = event.target.value
                console.log('UpdateREF', this.payment_details.reservation_fee)
                this.updateCalculations()
            },
            updateCalculations() {
                this.payment_details.required_equity_amount = this.payment_details.total_contract_price * (this.payment_details.required_equity_percentage * 0.01)
                this.payment_details.spot_cash_equity_less_amount = this.payment_details.required_equity_amount * (this.payment_details.spot_cash_equity_less_percentage * 0.01)
                this.payment_details.net_equity_less_discount = this.payment_details.required_equity_amount - this.payment_details.spot_cash_equity_less_amount
                this.payment_details.equity_net_of_reservation_fee = this.payment_details.required_equity_amount - this.payment_details.reservation_fee
                this.payment_details.balance_loanable_percentage = 100 - this.payment_details.required_equity_percentage
                this.payment_details.balance_loanable_amount = this.payment_details.total_contract_price * (this.payment_details.balance_loanable_percentage * 0.01)
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

                console.log('submitForm, LO - With Spot Equity')
                const dataToSubmit = {  buyer: this.buyer,
                                        unit: this.unit,
                                        payment_details: this.payment_details }
                console.log({dataToSubmit})
                ipcRenderer.send('addHouseAndLotBuyer', dataToSubmit)
                this.$router.push('/')
            }
        }
    })
</script>