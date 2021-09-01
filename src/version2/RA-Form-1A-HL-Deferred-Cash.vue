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
                <div class="full px-4"> <readonly-form label="Reservation Date" v-bind:value="getDate()" /> </div>
                <div class="full px-4"> <readonly-form label="Project Name" :value="unit.project_name" /> </div>
                <div class="grid grid-cols-4 gap-4 px-4">
                    <div class="full px-1"> <readonly-form label="Block" v-bind:value="unit.block" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot" v-bind:value="unit.lot" /> </div>
                    <div class="full px-1"> <readonly-form label="Phase" v-bind:value="getPhase()" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot Area" v-bind:value="unit.lot_area" /> </div>
                </div>
                <div class="full px-4"> <readonly-form label="Project Address" v-bind:value="unit.project_address" /> </div>
                <div class="grid grid-cols-2 gap-4 px-4">
                    <div class="full"> <readonly-form label="Floor Area" v-bind:value="unit.floor_area" /> </div>
                    <div class="full"> <readonly-form label="House Type" v-bind:value="unit.house_type" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Home Address" v-model="buyer.home_address" /> </div>
                <div class="flex px-4 gap-4">
                    <div class="w-1/2"> <input-form label="Contact No." v-model="buyer.contact_number" /> </div>
                    <div class="w-1/2"> <input-form label="Email Address" v-model="buyer.email_address" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Realty's Name" v-model="unit.realty_name" /> </div>
                <div class="full px-4"> <input-form label= "Agent's Name" v-model="unit.agent_name" /> </div>
            </div>

            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> DEFERRED CASH </p> </div>
            <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4"> <input-form v-model="payment_details.total_contract_price" /> </div> </div>
                </div>
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4"> <input-form v-model="payment_details.reservation_fee" /> </div> </div>
                </div>
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Balance Amount after Reservation Fee: </p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4"> <input-form v-model="payment_details.balance_amount_after_reservation" /> </div> </div>
                </div>



                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2">
                        <p class="align-middle text-right text-xs font-bold">Monthly Installment Amount <br /> payable in
                            <input type="text"
                                v-model="payment_details.installment_months"
                                class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                            > months:
                        </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4"> <input-form v-model="payment_details.monthly_installment" /> </div> </div>
                </div>
            </div>

            <div class="flex px-4 gap-4 my-2">
                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Starts: </p></div>
                <div class="w-3/4"> <div class="items-starts w-3/4"> <input-form v-model="payment_details.equity_start_date" /> </div> </div>
            </div>
            <div class="flex px-4 gap-4 my-2">
                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Ends: </p></div>
                <div class="w-3/4"> <div class="items-starts w-3/4"> <input-form v-model="payment_details.equity_end_date" /> </div> </div>
            </div>

            <div class="flex items-center my-4">
                <button
                    type="button"
                    v-on:click="submitForm"
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
                    price_per_sqm: `PHP ${this.$store.state.unit.unit_details.price_per_sqm}`,
                    realty_name: '',
                    agent_name: '',
                    floor_area: `${this.$store.state.unit.unit_details.floor_area} SQ. M`,
                    house_type: this.$store.state.unit.unit_details.house_type
                },
                payment_details: {
                    date: '',
                    total_contract_price: '',
                    reservation_fee: '',
                    balance_amount_after_reservation: '',
                    installment_months: '',
                    monthly_installment: '',
                    equity_start_date: '',
                    equity_end_date: '',
                    reservation_type: 4
                }
            }
        },
        mounted() {
            console.log('ADD BUYER FORM mounted STATE.UNIT', this.$store.state.unit)
        },
        methods: {
            getDate() {
                const today = new Date()
                this.payment_details.date = today
                return this.payment_details.date
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