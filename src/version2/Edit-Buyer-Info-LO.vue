<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24">

                <!-- <div>
                    <button type="button" v-on:click="viewPayment"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        View Payments
                    </button>
                </div> -->
            <div v-if="!isFetchingData">    
                <div class="h-2/3 flex">
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                        <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    </div>
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-semibold"> <p class="text-right"> {{ unedited_buyer.project.name }} - {{ unedited_buyer.project.location }} </p> </div>
                        <div class="text-xs"> <p class="text-right"> Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </p> </div>
                    </div>
                </div>

                <div class="full m-4 bg-gray-200">
                    <p class="text-center py-2 font-bold text-lg"> EDIT BUYER'S INFORMATION </p>
                    <p class="text-center pb-2 font-bold text-sm text-red-700" v-if="!unedited_buyer.status">
                        This buyer has been forefeited and is now inactive.
                    </p>
                </div> 
                
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                    <div class="flex px-4 gap-4">
                        <div class="w-2/5"> <input-form label="Last Name" v-model="edited_buyer.last_name"/> </div>
                        <div class="w-2/5"> <input-form label="First Name" v-model="edited_buyer.first_name" /> </div>
                        <div class="w-1/5"> <input-form label="M.I." v-model="edited_buyer.middle_initial" /> </div>
                    </div> 
                    <div class="full px-4">
                        <label-component label="Reservation Date" />
                        <datepicker :typeable="true" v-model="edited_payment.date "
                                    @selected="checkReservationDate()"
                                    placeholder="Select Date..." class="my-1"
                                    input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Name" :value="edited_buyer.project.name" /> </div>
                    <div class="grid grid-cols-4 gap-2 px-4">
                        <div class="full px-1"> <readonly-form label="Block" :value="edited_buyer.block.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot" :value="edited_buyer.lot.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Phase" :value="edited_buyer.phase" /> </div>
                        <div class="full px-1">
                            <label for="text" class="block text-sm font-semibold uppercase leading-5 text-black px-1"> LOT AREA (SQM) </label>
                            <input type="text" :value="formatDisplay(edited_unit.lot_area)" @change="updateLotArea" class="mt-1 w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                        </div>
                        <!-- <div class="full px-1"> <input-form label="Lot Area (SQ.M)" v-model="edited_unit.lot_area" /> </div> -->
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Address" :value="edited_buyer.project.location" /> </div>
                    <div class="grid grid-cols-2 gap-4 px-4">
                        <div class="full">
                            <label for="text" class="block text-sm font-semibold uppercase leading-5 text-black px-1"> PRICE PER SQM </label>
                            <input type="text" :value="formatDisplay(edited_unit.price_per_sqm)" @change="updatePricePerSqm" class="mt-1 w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                        </div>
                        <div class="full"> <input-form label="House Type" v-model="edited_unit.lot_type" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Home Address" v-model="edited_buyer.home_address"/> </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <input-form label="Contact No." v-model="edited_buyer.contact_number" /> </div>
                        <div class="w-1/2"> <input-form label="Email Address" v-model="edited_buyer.email_address" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Realty's Name" v-model="edited_buyer.realty" /> </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <input-form label= "Agent's Name" v-model="edited_buyer.agent" /> </div>
                        <div class="w-1/2"> <input-form label= "Agent's Number" v-model="edited_buyer.agent_number" /> </div>
                    </div> 
                </div>
    
                <div v-if="unedited_payment.reservation_type == 5">
                    <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> REGULAR RESERVATION / STRAIGHT MONTHLY </p> </div>
                    <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                        
                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4">
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase"
                                        :value="formatDisplay(edited_payment.total_contract_price)"
                                        readonly disabled>
                                </div>
                            </div> </div>
                        </div>

                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2">
                                <p class="align-middle text-right text-xs font-bold">MONTHLY INSTALLMENT for <br />
                                    <input type="text"
                                        class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase"
                                        v-model="edited_payment.installment_months"
                                        @change="updateIM"
                                    > months:
                                </p>
                            </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4">
                                <input type="text"
                                        :value="formatDisplay(edited_payment.monthly_installment)"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                            </div> </div>
                        </div>

                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">FIRST MONTHLY INSALLMENT <br> FEE / RESERVATION FEE: </p> </div>
                            <div class="w-3/4 py-2"> <div class="items-starts w-3/4">
                                <input type="text"
                                        :value="formatDisplay(edited_payment.reservation_fee)"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                            </div> </div>
                        </div>

                        <div class="flex px-4 gap-4 my-2">
                            <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity (Start - End): </p></div>
                            <div class="w-1/2 grid grid-cols-2 gap-x-4">
                                <div class="w-full">
                                    <datepicker :typeable="true" v-model="edited_payment.monthly_start_date" placeholder="Start Date" class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                                </div>
                                <div class="w-full">
                                    <datepicker :typeable="true" v-model="edited_payment.monthly_end_date" placeholder="End Date" class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            <div v-else-if="unedited_payment.reservation_type == 6"> 
                <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> WIH SPOT DOWNPAYMENT / ADVANCE DOWNPAYMENT </p> </div>
                <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                    <!-- TOTAL CONTRACT PRICE  -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(edited_payment.total_contract_price)"
                                    readonly disabled
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                            </div>
                        </div> </div>
                    </div>

                    <!-- SPOT DOWNPAYMENT / ADVANCE PAYMENT -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Spot Downpayment / <br> Advance Payment</p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <!-- <input-form v-model="payment_details.spot_downpayment" /> -->
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(edited_payment.spot_downpayment)"
                                    @change="updateSpotDownpayment"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                            </div>
                        </div> </div>
                    </div>

                    <!-- NEW TCP LESS  -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">NEW TCP Less <br> Downpayment</p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <!-- <input-form v-model="payment_details.new_tcp_less_downpayment" /> -->
                            <input type="text"
                                    :value="formatDisplay(edited_payment.new_tcp_less_downpayment)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                        </div> </div>
                    </div>

                    <!-- MONTHLY INSTALLMENT -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2">
                            <p class="align-middle text-right text-xs font-bold">MONTHLY INSTALLMENT for <br />
                                <input type="text"
                                    v-model="edited_payment.installment_months" @change="updateIM"
                                    class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                > months:
                            </p>
                        </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <!-- <input-form v-model="payment_details.monthly_installment" /> -->
                            <input type="text"
                                    :value="formatDisplay(edited_payment.monthly_installment)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                        </div> </div>
                    </div>

                    <!-- INSTALLMENT START AND END DATES -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity (Start - End): </p></div>
                        <div class="w-1/2 grid grid-cols-2 gap-x-4">
                            <div class="w-full">
                                <datepicker :typeable="true" v-model="edited_payment.monthly_start_date" placeholder="Start Date" class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                            </div>
                            <div class="w-full">
                                <datepicker :typeable="true" v-model="edited_payment.monthly_end_date" placeholder="End Date" class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="unedited_payment.reservation_type == 7">
                <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> SPOT CASH </p> </div>
                <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                <!-- TOTAL CONTRACT PRICE  -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="numbers"
                                    :value="formatDisplay(edited_payment.total_contract_price)"
                                    readonly disabled
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2">
                            <p class="align-middle text-right text-xs font-bold">SPOT CASH Discount <br />
                                <input type="text"
                                    v-model="edited_payment.spot_cash_discount_percentage" @change="updateSCDPercentage"
                                    class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                > %:
                            </p>
                        </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <!-- <input-form v-model="payment_details.spot_cash_discount_amount" /> -->
                            <input type="text"
                                :value="formatDisplay(edited_payment.spot_cash_discount_amount)"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div> </div>
                    </div>

                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">NEW TCP Less Discount</p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <!-- <input-form v-model="payment_details.new_tcp_less_discount" /> -->
                            <input type="text"
                                :value="formatDisplay(edited_payment.new_tcp_less_discount)"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div> </div>
                    </div>
                </div>

            </div>
                
            <div v-else class="text-center mx-auto my-4 font-semibold text-lg text-red-500">
                ERROR: WRONG RESERVATION TYPE
            </div>

                <div class="w-full flex mx-auto justify-center items-center my-4 gap-4">
                    <button type="button" v-on:click="updateInfo"
                        class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                        SUBMIT CHANGES
                    </button>
                    <button type="button" v-on:click="cancelEdit"
                        class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                        CANCEL
                    </button>
                </div>
            </div>
            <div v-if="isFetchingData" class="text-center mx-auto my-4 font-semibold text-lg">
                LOADING...
            </div>
        </div>
        
        

    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import Label from '../components/v2/Label.vue'
    import InputForm from '../components/v2/InputForm'
    import PasswordForm from '../components/v2/PasswordForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import Datepicker from 'vuejs-datepicker'
    // import { VueTailwindModal } from 'vue-tailwind-modal'
    // import XLSX from 'xlsx'
    import excel4node from 'excel4node'

    export default ({
        components: {
            'main-header': Header,
            'label-component': Label,
            'input-form': InputForm,
            'password-form': PasswordForm,
            'readonly-form': ReadOnlyForm,
            'datepicker': Datepicker,
            // 'vue-tailwind-modal': VueTailwindModal
        },
        data() {
            return {
                unedited_buyer: '',
                edited_buyer: this.$route.params.buyer,
                changed_data: {},

                edited_unit: this.$route.params.buyer.lot,
                unedited_unit: '',
                changed_unit: {},

                edited_payment: this.$route.params.buyer.payment,
                unedited_payment: '',
                changed_payment: {},

                isFetchingData: true
            }
        },
        created() {
            console.log('this id EDIT BUYER LO', this.$route.params.id, this.$route.params.buyer)
            this.unedited_buyer = this.getDetails(this.$route.params.id)
        },
        methods: {
            // change callback process or logic
            addChangedFields(_callback) {
                const edited = this.edited_buyer
                const unedited = this.unedited_buyer
                const edited_unit = this.edited_unit
                const unedited_unit = this.unedited_unit
                const edited_payment = this.edited_payment
                const unedited_payment = this.unedited_payment

                for(const field in edited) {
                    if(edited[field] !== unedited[field] && typeof(edited[field])) {
                        if(typeof(edited[field]) !== 'object') {
                            this.changed_data[field] = edited[field]
                        }
                    }
                }

                for(const lot_field in edited_unit) {
                    if(edited_unit[lot_field] !== unedited_unit[lot_field] && typeof(edited_unit[lot_field]) !== 'object') {
                        this.changed_unit[lot_field] = edited_unit[lot_field]
                    }
                }

                for(const payment_field in edited_payment) {
                    if(edited_payment[payment_field] !== unedited_payment[payment_field]) {
                        if(typeof(edited_payment[payment_field]) !== 'object') {
                            this.changed_payment[payment_field] = isNaN(this.formatParsedFloat(edited_payment[payment_field])) ? edited_payment[payment_field] : (this.formatParsedFloat(edited_payment[payment_field]))
                        } else {
                            if(payment_field == 'date' || payment_field == 'monthly_end_date' || payment_field == 'monthly_start_date') {
                                console.log('edited vs unedited', edited_payment[payment_field], typeof(edited_payment[payment_field]), unedited_payment[payment_field], typeof(unedited_payment[payment_field]))
                                this.changed_payment[payment_field] = edited_payment[payment_field]
                            }
                        }
                    }
                }

                _callback()
            },
            
            formatDisplay(value) {
               return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value
            },
            formatDecimal(value) {
                return value ? value.toFixed(2) : value
            },
            formatParsedFloat(value) {
                return value ? parseFloat((value.toString()).replace(/,/g, '')).toFixed(2) : value
            },
            updateBLA(event){
                this.edited_payment.balance_loanable_amount = event.target.value
                console.log('UpdateBLA', this.edited_payment.balance_loanable_amount, typeof(this.edited_payment.balance_loanable_amount))
                this.updateCalculations()
            },
            updateTCP(event) {
                this.edited_payment.total_contract_price = event.target.value
                console.log('UpdateTCP', this.edited_payment.total_contract_price, typeof(this.edited_payment.total_contract_price))
                this.updateCalculations()
            },
            updateREP(event) {
                this.edited_payment.required_equity_percentage = event.target.value
                console.log('UpdateREP', this.edited_payment.required_equity_percentage, typeof(this.edited_payment.required_equity_percentage))
                this.updateCalculations()
            },
            updateREF(event) {
                this.edited_payment.reservation_fee = event.target.value
                console.log('UpdateReservationFee')
                this.updateCalculations()
            },
            updateSCEL(event) {
                this.edited_payment.spot_cash_equity_less_percentage = event.target.value
                console.log('UpdateSCEL', this.edited_payment.spot_cash_equity_less_percentage)
                this.updateCalculations()
            },
            updateSCD(event) {
                this.edited_payment.spot_cash_discount_less_percentage = event.target.value
                console.log('UpdateSCD', this.edited_payment.spot_cash_discount_less_percentage)
                this.updateCalculations()
            },
            updateREA(event) {
                this.edited_payment.required_equity_amount = event.target.value
                console.log('UpdateREA', this.edited_payment.required_equity_amount, typeof(this.edited_payment.required_equity_amount))
                this.updateCalculations()
            },
            //DEFERRED
            updateIM(event) {
                this.edited_payment.installment_months = event.target.value
                console.log('UpdateIM', this.edited_payment.installment_months)
                this.updateCalculations()
            },
            updateEquityMonths(event) {
                this.edited_payment.equity_months = event.target.value
                console.log('UpdateEquityMonths')
                this.updateCalculations()
            },
            updateSCDPercentage(event) {
                this.edited_payment.spot_cash_discount_percentage = event.target.value
                console.log('UpdateSCDPercentage', this.edited_payment.spot_cash_discount_percentage)
                this.updateCalculations()
            },
            updateSpotDownpayment(event) {
                this.edited_payment.spot_downpayment = event.target.value
                console.log('UpdateSpotDownpayment', this.edited_payment.spot_downpayment)
                this.updateCalculations()
            },
            updateLotArea(event) {
                this.edited_unit.lot_area = event.target.value
                console.log('updating lot area', this.edited_unit.lot_area)
                this.updateCalculations()
            },
            updatePricePerSqm(event) {
                this.edited_unit.price_per_sqm = event.target.value
                console.log('updating price per sqm', this.edited_unit.price_per_sqm)
                this.updateCalculations()
            },
            updateCalculations() {
                console.log('update calc edited payment', this.edited_payment)
                const formatted_lot_area = this.formatParsedFloat(this.edited_unit.lot_area)
                const formatted_price_per_sqm = this.formatParsedFloat(this.edited_unit.price_per_sqm)

                this.edited_unit.lot_area = this.formatParsedFloat(this.edited_unit.lot_area)
                this.edited_unit.price_per_sqm = this.formatParsedFloat(this.edited_unit.price_per_sqm)

                this.edited_payment.total_contract_price = this.formatParsedFloat(formatted_lot_area * formatted_price_per_sqm)

                // const formatted_total_contract_price = this.formatParsedFloat(this.edited_payment.total_contract_price)
                // const formatted_reservation_fee = this.formatParsedFloat(this.edited_payment.reservation_fee)
                const formatted_spot_downpayment = this.formatParsedFloat(this.edited_payment.spot_downpayment)
                
                switch(this.unedited_payment.reservation_type) {
                    case 5:
                        this.edited_payment.monthly_installment = this.edited_payment.installment_months ? this.formatDecimal((this.edited_payment.total_contract_price / this.edited_payment.installment_months)) : 0
                        this.edited_payment.reservation_fee = this.edited_payment.installment_months ? this.formatDecimal((this.edited_payment.total_contract_price / this.edited_payment.installment_months)) : 0
                        break;
                    case 6:
                        this.edited_payment.new_tcp_less_downpayment = this.formatDecimal(this.edited_payment.total_contract_price - formatted_spot_downpayment)
                        this.edited_payment.monthly_installment = this.edited_payment.installment_months
                            ? this.formatDecimal(this.edited_payment.new_tcp_less_downpayment / this.edited_payment.installment_months) : 0
                        break;
                    case 7:
                        this.edited_payment.spot_cash_discount_amount = this.formatDecimal(this.edited_payment.total_contract_price * (this.edited_payment.spot_cash_discount_percentage * 0.01))
                        this.edited_payment.new_tcp_less_discount = this.formatDecimal(this.edited_payment.total_contract_price - this.edited_payment.spot_cash_discount_amount)
                        this.edited_payment.monthly_installment = this.edited_payment.installment_months
                                    ? this.formatDecimal(this.edited_payment.new_tcp_less_discount / this.edited_payment.installment_months) : 0

                        break;
                    default: break;
                }

                // if(this.unedited_buyer.project.id == 3) {
                //     this.edited_payment.new_balance_loanable_amount = this.formatDisplay(this.formatParsedFloat(this.edited_payment.balance_loanable_amount) - -100000)
                // }
            },
            updateInfo() {
                // this.edited_payment.total_contract_price = this.formatParsedFloat(this.edited_payment.total_contract_price)
                // this.edited_payment.reservation_fee = this.formatParsedFloat(this.edited_payment.reservation_fee)
                console.log('============ UPDATING INFO ==============')
                this.isFetchingData = true
                this.addChangedFields(() => {
                    // console.log('added changed fields', this.changed_payment)
                    const changed_size = Object.keys(this.changed_data).length
                    const changed_unit_size = Object.keys(this.changed_unit).length
                    const changed_payment_size = Object.keys(this.changed_payment).length

                    const dataToSubmit = { 
                                        id: this.unedited_buyer.id,
                                        unedited_buyer_info: this.unedited_buyer,
                                        edited_buyer: this.edited_buyer,
                                        changed_buyer_info: this.changed_data,
                                        
                                        unedited_unit: this.unedited_unit,
                                        edited_unit: this.edited_unit,
                                        changed_unit: this.changed_unit,
                                        
                                        unedited_payment: this.unedited_payment,
                                        edited_payment: this.edited_payment,
                                        changed_payment: this.changed_payment }

                    if(changed_size !== 0 || changed_unit_size !== 0 || changed_payment_size !== 0) {
                        ipcRenderer.send('editBuyerInfo', dataToSubmit)
                        ipcRenderer.once('editedBuyerInfo', (event, data) => {
                            console.log('editedBuyerInfo', data)
                            if(data.response == 1) {
                                alert('BUYER SUCCESSFULLY UPDATED')
                                this.isFetchingData = true
                                // this.autoExport()
                                // add loading screen
                                this.viewBuyerInfo()
                            } else {
                                alert(data.error)
                                console.log('EDIT BUYER INFORMATION ERROR')
                            }
                        })
                    } else {
                        alert('No edit/update has been made.')
                    }
                })

                
            },
            cancelEdit() {
                this.viewBuyerInfo()
            },
            viewBuyerInfo() {
                const reservation_type = this.unedited_buyer.reservation_type
                if(reservation_type == 5
                    || reservation_type == 6
                    || reservation_type == 7) {
                        this.$router.push({name: 'View-Buyer-LO', params: { id: this.unedited_buyer.id }})
                } else if(reservation_type == 1
                    || reservation_type == 2
                    || reservation_type == 3
                    || reservation_type == 4) {
                        this.$router.push({name: 'View-Buyer-HL', params: { id: this.unedited_buyer.id }})
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${reservation_type}`)
                }
            },
            getDetails(id) {
                this.isFetchingData = true,
                ipcRenderer.send('fetchBuyer', id)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.unedited_buyer = data
                    ipcRenderer.send('fetchLot', this.unedited_buyer.lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        this.unedited_buyer.lot = data
                        this.unedited_unit = data
                        ipcRenderer.send('fetchBlock', this.unedited_buyer.lot.block_id)
                        ipcRenderer.once('fetchedBlock', (event, data) => {
                            this.unedited_buyer.block = data
                            if(this.unedited_buyer.block.phase_id) {
                               ipcRenderer.send('fetchPhase', this.unedited_buyer.block.phase_id)
                               ipcRenderer.once('fetchedPhase', (event, data) => {
                                   this.unedited_buyer.phase = data.name
                               })
                            } else {
                                this.unedited_buyer.phase = "N/A"
                            }
                            ipcRenderer.send('fetchProject', this.unedited_buyer.block.project_id)
                            ipcRenderer.once('fetchedProject', (event, data) => {
                                this.unedited_buyer.project = data
                                ipcRenderer.send('fetchLotOnlyPayment', this.unedited_buyer.id)
                                ipcRenderer.once('fetchedLotOnlyPayment', (event, data) => {
                                    // this.unedited_buyer.payment = data
                                    this.unedited_payment = data
                                    // console.log('this.unedited_buyer in EDIT BUYER INFO', this.unedited_buyer)
                                    // console.log('this.buyer in VIEW DETAILS HOUSE AND LOT PAYMENT', this.payment)
                                    // this.dateIsBefore2021 = this.unedited_payment.date < this.dateToCheck ? true : false
                                    this.isFetchingData = false
                                })
                            })
                        })
                    })
                })
            }
            
        }
    })
</script>