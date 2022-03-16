<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div v-if="!isFetchingData">

                <div class="flex">
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                        <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    </div>
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-semibold"> <p class="text-right"> {{ buyer.project.name }} - {{ buyer.project.location }} </p> </div>
                        <div class="text-xs"> <p class="text-right"> Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </p> </div>
                    </div>
                </div>

                <div class="full my-4 bg-gray-200">
                    <p class="text-center p-2 font-semibold text-lg"> STATEMENT OF ACCOUNT </p> <!-- add reservation type -->
                    <p class="text-center pb-2 font-bold text-sm text-red-700" v-if="!buyer.status"> This buyer has been forefeited and is now inactive. </p>
                </div>

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 py-1" v-if="payment.reservation_type > 0 && payment.reservation_type < 5">
                    <div class="w-full">
                        <div class="flex gap-4 my-2">
                            <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                            <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                            <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Project" :value="buyer.project.name" /> </div>
                            <div class="w-1/2"> <readonly-form label="Phase" :value="buyer.phase" /> </div> <!-- check if phase exists -->
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                            <div class="w-1/2"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                        </div>
                        <div class="full my-2"> <readonly-form label="Reservation Fee" :value="formatDisplay(payment.reservation_fee)" /> </div>
                        <div class="full my-2"> <readonly-form label="Total Contract Price" :value="formatDisplay(payment.total_contract_price)" /> </div>
                    </div>

                    <!-- HL REGULAR RESERVATION  -->
                    <div class="w-full" v-if="payment.reservation_type == 1">
                        <div class="full my-2"> <readonly-form label="Required Equity" :value="formatDisplay(payment.required_equity_amount)" /> </div>
                        <div class="full my-2"> <readonly-form label="Equity Net of Reservation:" :value="formatDisplay(payment.equity_net_of_reservation_fee)" /> </div>
                        <div class="full my-2">                            
                            <readonly-form v-if="buyer.project.id == 3" label="Required Loanable Amount" :value="formatDisplay(payment.new_balance_loanable_amount)"/>
                            <readonly-form v-else label="Required Loanable Amount" :value="formatDisplay(payment.balance_loanable_amount)"/>
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2">
                                <label-component label="Running Equity Balance:"/>
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(running_equity_balance)"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                                </div>
                            </div>
                             <div class="w-1/2">
                                <label-component label="Running TCP Balance:"/>
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(running_tcp_balance)"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                                </div>
                            </div>
                        </div>
                        <div class="full">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(total_payments_made)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- HL WITH SPOT EQUITY -->
                    <div class="w-full" v-if="payment.reservation_type == 2">
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Required Equity" :value="formatDisplay(payment.required_equity_amount)" /> </div>
                            <div class="w-1/2"> <readonly-form label="Equity Less of Reservation:" :value="formatDisplay(payment.equity_net_of_reservation_fee)" /> </div>
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Discount (%):" :value="payment.spot_cash_equity_less_percentage" /> </div>
                            <div class="w-1/2"> <readonly-form label="Total Discount (PHP)" :value="formatDisplay(payment.spot_cash_equity_less_amount)" /> </div>

                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Net Equity Payable" :value="formatDisplay(payment.net_equity_less_discount)" /> </div>
                            <div class="w-1/2"> <readonly-form label="Required Loanable Amount" :value="formatDisplay(payment.balance_loanable_amount)" /> </div>

                        </div>
                        <div class="full my-2">
                            <label-component label="Running Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(running_balance)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(total_payments_made)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- HL SPOT CASH -->
                    <div class="w-full" v-if="payment.reservation_type == 3">
                        <div class="full my-2"> <readonly-form label="TCP Net of Reservation" :value="formatDisplay(payment.net_total_contract_price)" /> </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Discount (%):" :value="formatDisplay(payment.spot_cash_discount_less_percentage)" /> </div>
                            <div class="w-1/2"> <readonly-form label="Discount Amount (PHP)" :value="formatDisplay(payment.spot_cash_discount_less_amount)" /> </div>
                        </div>
                        <div class="full my-2"> <readonly-form label="Total TCP Payable" :value="formatDisplay(payment.balance_total_contract_price)" /> </div>
                        <div class="full my-2">
                            <label-component label="TCP Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(running_balance)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full my-2">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(total_payments_made)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- DEFERRED CASH -->
                    <div class="w-full" v-if="payment.reservation_type == 4">
                        <div class="full my-2"> <readonly-form label="TCP Net of Reservation" :value="formatDisplay(payment.balance_amount_after_reservation)" /> </div>
                        <div class="full my-2"> <readonly-form label="Number of months payable" :value="payment.installment_months" /> </div>
                        <div class="full my-2"> <readonly-form label="Monthly Amortization" :value="formatDisplay(payment.monthly_installment)" /> </div>
                        <div class="full my-2">
                            <label-component label="TCP Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(running_balance)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full my-2">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(total_payments_made)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 py-1"
                    v-else-if="payment.reservation_type > 4 && payment.reservation_type < 8">
                    <div class="flex gap-4">
                        <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                        <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                        <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                    </div>
                    <div class="full"> <readonly-form label="Total Contract Price" :value="formatDisplay(payment.total_contract_price)" /> </div>
                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Project" :value="buyer.project.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Phase" :value="buyer.phase" /> </div>
                    </div>

                    <div class="full">
                        <label-component label="Running TCP Balance:"/>
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="text"
                                :value="formatDisplay(running_tcp_balance)"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                    </div>
                    <div class="full">
                        <label-component label="Total Payments Made:"/>
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="text"
                                :value="formatDisplay(total_payments_made)"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div>
                    </div>
                </div>

                <!-- <div v-else> RESERVATION TYPE ERROR  </div> -->

                <div class="mb-8">
                    <div class="full my-4 bg-gray-200">
                        <p class="text-center pt-2 font-semibold text-lg"> PAYMENT DETAILS </p>
                        <p class="text-center pb-2 font-regular text-xs" v-if="buyer.status"> ( Click on specific payment to edit ) </p>
                    </div>

                    <!-- CHECK FOR MANAGER CREDENTIALS IF REQUESTING FOR EDIT -->
                        <div class="full m-4 border-4 rounded-md" v-if="this.isRequestingEdit">
                            <p class="align-middle text-center text-md my-1 pt-8"> INPUT CREDENTIALS TO EDIT </p>
                            <p class="align-middle text-center text-sm font-bold my-1 pb-2"> {{ formatDate(clickedPayment.payment_date) }} {{ clickedPayment.remarks }} </p>
                            <div class="w-full flex mx-auto justify-center items-center my-2 gap-4">
                                <input-form label="Username:" v-model="inputtedCredentials.username"/>
                                <password-form label="Password: " v-model="inputtedCredentials.password"/>
                            </div>
                            <p class="align-middle text-center text-sm text-red-700 font-bold my-1 py-2" v-if="this.incorrectCredentials"> Incorrect credentials. Please try again. </p>
                            <div class="w-full flex mx-auto justify-center items-center my-4 gap-4">
                                <button type="button" v-on:click="checkCredentials"
                                    class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                                    SUBMIT
                                </button>
                                <button type="button" v-on:click="cancelEdit"
                                    class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                                    CANCEL
                                </button>
                            </div>
                        </div>

                        <div class="flex flex-wrap">
                            <div class="w-4/6 flex">
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Date </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Description </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Payment Via </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Trans. Date </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Reference No. </p> </div>
                        </div>

                        <div class="w-2/6 flex">
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Amount </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Penalty </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Receipt No. </p> </div>
                        </div>
                        <!-- <div class="w-1/6">
                        </div> -->
                    </div>

                    <div class="overflow-x-scroll">
                        <div class="max-h-96 mx-1">
                            <div class="overflow-y-auto h-full">
                                <div v-for="single_payment in previous_payees_payments" :key="single_payment.id">
                                        <single-payment v-bind:buyer_payment="single_payment" v-on:click.native="editPayment(single_payment)"/>
                                
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center mx-auto justify-center gap-8 mt-8">
                        <button type="button" v-if="buyer.status" v-on:click="addPayment"
                            class="bg-gray-500 p-4 w-1/4 align-middle text-white font-regular border rounded-md mb-4">
                            + Add Payment
                        </button>
                        <button type="button" v-if="buyer.status" v-on:click="exportPayment"
                            class="bg-gray-500 p-4 w-1/4 align-middle text-white font-regular border rounded-md mb-4">
                            Export Payment
                        </button>
                        <button type="button" v-if="buyer.status" v-on:click="backToReservationDetails"
                            class="bg-gray-500 p-4 w-1/4 align-middle text-white font-regular border rounded-md mb-4">
                            Back to Reservation Details
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
    import Label from '../components/v2/Label.vue'
    import Header from '../components/v2/Header'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import SinglePayment from '../components/v2/SinglePayment'
    import InputForm from '../components/v2/InputForm'
    import PasswordForm from '../components/v2/PasswordForm'
    import { ipcRenderer } from 'electron'
    
    export default ({
        components: {
            'main-header': Header,
            'readonly-form': ReadOnlyForm,
            'single-payment': SinglePayment,
            'input-form': InputForm,
            'password-form': PasswordForm,
            'label-component': Label
        },
        data() {
            return {
                buyer: this.$route.params.buyer,
                payment: this.$route.params.buyer.payment,
                buyer_payments: {},
                previous_payees: [],
                previous_payees_payments: [],

                total_payments_made: 0,
                running_equity_balance: 0,
                running_tcp_balance: 0, //change
                running_balance: 0,
                isFetchingData: false, // change to true
                isFetchingAllPayments: true,

                isRequestingEdit: false,
                incorrectCredentials: false,
                credentials: {
                    username: 'MANAGER',
                    password: 'password123'
                },
                inputtedCredentials: {
                    username: '',
                    password: ''
                },
                clickedPaymentID: 0,
                clickedPayment: {}
            }
        },
        created() {
            this.getAllPayments(this.buyer.id)
        },
        methods: {
            backToReservationDetails() {
                if(this.payment.reservation_type == 5
                    || this.payment.reservation_type == 6
                    || this.payment.reservation_type == 7) {
                        this.$router.push({name: 'View-Buyer-LO', params: { id: this.buyer.id }})
                } else if(this.payment.reservation_type == 1
                    || this.payment.reservation_type == 2
                    || this.payment.reservation_type == 3
                    || this.payment.reservation_type == 4) {
                        this.$router.push({name: 'View-Buyer-HL', params: { id: this.buyer.id }})
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${this.buyer_details.reservation_type}`)
                }
            },
            firstFunction(id, _callback) {
                setTimeout(() => {
                    console.log('First function should run first', id)
                    _callback()
                }, 5000)
            },
            secondFunction() {
                this.firstFunction(1, () => {
                    console.log('Then second function runs after')
                });
            },
            editPayment(single_payment) {
                console.log('EDITING PAYMENT ID', single_payment.id)
                this.clickedPaymentID = single_payment.id
                this.clickedPayment = single_payment

                // this.isRequestingEdit = true
                // remove this to re-add credentials
                this.$router.push({ name: 'Edit-Payment-Info',
                                            params: {   id: this.clickedPaymentID,
                                                        buyer: this.buyer,
                                                        payment: this.clickedPayment
                                                    }})
            },
            cancelEdit() {
                // this.clickedPaymentID = 0
                this.inputtedCredentials = { username: '', password: ''}
                this.incorrectCredentials = false
                this.isRequestingEdit = false
            },
            checkCredentials() {
                // WITH CREDENTIALS
                console.log('CHECKING CREDENTIALS', this.inputtedCredentials)
                if( this.credentials.username == this.inputtedCredentials.username.toUpperCase() &&
                    this.credentials.password == this.inputtedCredentials.password ) {
                        console.log('CREDENTIALS MATCHED')
                        // route to editing ?
                        this.$router.push({ name: 'Edit-Payment-Info',
                                            params: {   id: this.clickedPaymentID,
                                                        buyer: this.buyer,
                                                        payment: this.clickedPayment
                                                    }})
                        // this.isRequestingEdit = false
                } else {
                    this.incorrectCredentials = true
                }
            },
            getAllPayments(payee_id) {

               if(payee_id && payee_id !== 0) {
                    this.previous_payees.push(payee_id) 
                    ipcRenderer.send('fetchBuyer', payee_id)
                    ipcRenderer.once('fetchedBuyer', (event, fetchedBuyer) => {
                        ipcRenderer.send('fetchPaymentsList', {id: payee_id})
                        ipcRenderer.once('fetchedPaymentsList', (event2, fetchedPayments) => {
                            fetchedPayments.buyer_payments.forEach(single_payment => {
                                this.previous_payees_payments.unshift(single_payment)
                                this.calculateTotalPayments(payee_id, single_payment)
                            })

                            payee_id = fetchedBuyer.assumer_id
                            this.getAllPayments(payee_id)
                        })
                    })
                } else {
                    console.log('previous_payees', this.previous_payees)
                    console.log('previous_payees_payments', this.previous_payees_payments)
                    // is fetching payments false
                }
            },

            calculateTotalPayments(payee_id, single_payment) {
                if(single_payment) {
                    if(single_payment.isDeductible) {
                        this.total_payments_made = this.total_payments_made + single_payment.amount
                        console.log('PAYMENTS MADE', this.total_payments_made, single_payment)
                        this.running_tcp_balance = this.payment.total_contract_price - this.total_payments_made
                        if(this.payment.reservation_type == 1) {
                            this.running_equity_balance = this.payment.required_equity_amount - this.total_payments_made
                        } else if(this.payment.reservation_type == 2) {
                            this.running_balance = this.payment.balance_loanable_amount - (this.total_payments_made - this.payment.equity_net_of_reservation_fee)
                        } else if(this.payment.reservation_type == 3) {
                            this.running_balance = this.payment.balance_total_contract_price - this.total_payments_made
                        } else if(this.payment.reservation_type == 4) {
                            this.running_balance = this.payment.balance_amount_after_reservation - this.total_payments_made
                        } else {
                            // reservation type for lot only
                        }
                    }         
                } else {
                    console.log ('No payments yet', payee_id, single_payment)
                    if(this.payment.reservation_type == 1) {
                        this.running_equity_balance = this.payment.equity_net_of_reservation_fee
                    } else if(this.payment.reservation_type == 2) {
                        this.running_balance = this.payment.equity_net_of_reservation_fee
                    } else if(this.payment.reservation_type == 3) {
                        this.running_balance = this.payment.balance_total_contract_price
                    } else if(this.payment.reservation_type == 4) {
                        this.running_balance = this.payment.balance_amount_after_reservation
                    } else {
                        // reservation type for lot only
                    }
                }
            },
            addPayment() {
                console.log('add payment', this.payment)
                this.$router.push({ name: "Add-Payment", params: { id: this.buyer.id, buyer: this.buyer, payment: this.payment }})
            },
            formatDate(value) {
                return value && value.toDateString() ? value.toDateString().replace(/^\S+\s/,'') : value
            },
            formatDisplay(value) {
               return value ? `${(value.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : value
            },
            exportPayment() {
                console.log('Exporting Payment for Buyer', this.buyer.last_name, this.buyer.phase)
                // const buyer = this.buyer
                const { project, block, lot } = this.buyer
                const phase = this.buyer.phase ? this.buyer.phase : 'N/A'
                // const phase = "N/A"
                const reservation = this.buyer.payment
                console.log('BUYER RESERVATION', reservation)
                const buyer_payments = this.previous_payees_payments
                const buyer_name = `${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`

                const homedir = require('os').homedir();
                const file_name = `${block.name.toUpperCase()} ${lot.name.toUpperCase()} - ${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`

                var xl = require('excel4node');
                var wb = new xl.Workbook();
                const ws = wb.addWorksheet(`${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`);

                let r = 1   // row
                const s = 6 // initial size
                const col = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10, 'K': 11, 'L': 12, 'M': 13, 'N': 14 }

                ws.column(col['A']).setWidth(s*3)
                ws.column(col['B']).setWidth(s*3)
                ws.column(col['C']).setWidth(s*3)
                ws.column(col['D']).setWidth(s*3)
                ws.column(col['E']).setWidth(s*3)
                ws.column(col['F']).setWidth(s*1.5)
                ws.column(col['G']).setWidth(s*1.5)
                ws.column(col['H']).setWidth(s*3)
                ws.column(col['I']).setWidth(s*3)

                const bold_header_style = wb.createStyle({ font: { color: '#000000', size: 13, bold: true }, alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                const bordered_style = wb.createStyle({ border: { left: { style: 'thin', color: '#000000' }, right: { style: 'thin', color: '#000000' }, top: { style: 'thin', color: '#000000' }, bottom: { style: 'thin', color: '#000000' }} })
                const aligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                const left_aligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'left', vertical: 'center' } })
                const header_style = wb.createStyle({ font: { color: '#000000', size: 11, bold: true } })
                const bold_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: true } })
                const regular_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: false } })
                const center_bold = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' }, font: { color: '#000000', size: 11, bold: true } })
                const italic_rightaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'right', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })
                const italic_leftaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'left', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })
                var numberstyle = wb.createStyle({ font: { bold: true }, numberFormat: '#,##0.00; ($#,##0.00); -'});


                ws.cell(r, col['A'], r, col['F'], true).string('TUMABINI REAL ESTATE DEVELOPMENT').style(bold_header_style)
                ws.cell(r, col['G'], r, col['H'], true).string(project.name).style(bold_header_style).style({font: {size: 10}, alignment: {horizontal: 'right'}})
                ws.cell(++r, col['A'], ++r, col['F'], true).string('133 MC Briones St., Hi-way Bakilid, Mandaue City 6014 Tel#: 032 414-5103, 09564791879 Email: tumabinidevelopment@gmail.com').style(regular_style).style(aligned_style).style({font: {size: 8}})
                ws.cell(r-1, col['G'], r, col['H'], true).string(project.location).style(regular_style).style({font: {size: 8}, alignment: {horizontal: 'right'}})

                ws.cell(++r, col['A'], r, col['H'], true).string('STATEMENT OF ACCOUNT').style(bordered_style).style(aligned_style).style(header_style)
                
                // REGULAR RESERVATION || INHOUSE FINANCING
                if(reservation.reservation_type == 1 || reservation.reservation_type == 8) {
                    ws.cell(++r, col['A']).string("BUYER'S NAME").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(buyer_name).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED EQUITY").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.required_equity_amount)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("PHASE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(phase).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("EQUITY NET OF RESERVATION").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.equity_net_of_reservation_fee)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("BLOCK").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(block.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED LOANABLE AMOUNT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.balance_loanable_amount)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("LOT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(lot.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING EQUITY BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_equity_balance)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("RESERVATION FEE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.reservation_fee)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING TCP BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_tcp_balance)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("TOTAL CONTRACT PRICE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.total_contract_price)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("TOTAL PAYMENTS MADE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.total_payments_made)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    

                } else if(reservation.reservation_type == 2) {
                    ws.cell(++r, col['A']).string("BUYER'S NAME").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(buyer_name).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED EQUITY").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.required_equity_amount)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("PHASE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(phase).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("EQUITY NET OF RESERVATION").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.equity_net_of_reservation_fee)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("BLOCK").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(block.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED LOANABLE AMOUNT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.balance_loanable_amount)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("LOT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(lot.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING EQUITY BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_equity_balance)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("RESERVATION FEE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.reservation_fee)).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING TCP BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_tcp_balance)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("TOTAL CONTRACT PRICE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.total_contract_price)).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("TOTAL PAYMENTS MADE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.total_payments_made)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                } else if(reservation.reservation_type == 3) {
                    ws.cell(++r, col['A']).string("BUYER'S NAME").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(buyer_name).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED EQUITY").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.required_equity_amount)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("PHASE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(phase).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("EQUITY NET OF RESERVATION").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.equity_net_of_reservation_fee)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("BLOCK").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(block.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED LOANABLE AMOUNT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.balance_loanable_amount)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("LOT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(lot.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING EQUITY BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_equity_balance)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("RESERVATION FEE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.reservation_fee)).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING TCP BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_tcp_balance)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("TOTAL CONTRACT PRICE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.total_contract_price)).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("TOTAL PAYMENTS MADE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.total_payments_made)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                } else if(reservation.reservation_type == 4) {
                    ws.cell(++r, col['A']).string("BUYER'S NAME").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(buyer_name).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED EQUITY").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.required_equity_amount)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("PHASE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(phase).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("EQUITY NET OF RESERVATION").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.equity_net_of_reservation_fee)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("BLOCK").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(block.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("REQUIRED LOANABLE AMOUNT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.balance_loanable_amount)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("LOT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(lot.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING EQUITY BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_equity_balance)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("RESERVATION FEE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.reservation_fee)).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING TCP BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_tcp_balance)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("TOTAL CONTRACT PRICE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.total_contract_price)).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("TOTAL PAYMENTS MADE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.total_payments_made)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    
                } else {
                    // reservation format for lot only
                    console.log('lot only')
                    ws.cell(++r, col['A']).string("BUYER'S NAME").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(buyer_name).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("TOTAL CONTRACT PRICE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(reservation.total_contract_price)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("PHASE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(phase).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("RUNNING TCP BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.running_tcp_balance)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    ws.cell(++r, col['A']).string("BLOCK - LOT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(`${block.name} ${lot.name}`).style(bordered_style).style(left_aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['G'], true).string("TOTAL PAYMENTS MADE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    ws.cell(r, col['H']).string(this.formatDisplay(this.total_payments_made)).style(bordered_style).style(aligned_style).style(regular_style)

                    // ws.cell(++r, col['A']).string("LOT").style(bordered_style).style(left_aligned_style).style(bold_style)
                    // ws.cell(r, col['B'], r, col['D'], true).string(lot.name).style(bordered_style).style(left_aligned_style).style(regular_style)
                    // ws.cell(r, col['E'], r, col['G'], true).string("RUNNING EQUITY BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    // ws.cell(r, col['H']).string(this.formatDisplay(this.running_equity_balance)).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    // ws.cell(++r, col['A']).string("RESERVATION FEE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    // ws.cell(r, col['B'], r, col['D'], true).string(this.formatDisplay(reservation.reservation_fee)).style(bordered_style).style(left_aligned_style).style(regular_style)
                    // ws.cell(r, col['E'], r, col['G'], true).string("RUNNING TCP BALANCE").style(bordered_style).style(left_aligned_style).style(bold_style)
                    // ws.cell(r, col['H']).string(this.formatDisplay(this.running_tcp_balance)).style(bordered_style).style(aligned_style).style(regular_style)
                }

                ws.cell(++r, col['A'], r, col['H'], true).string('DETAILS OF PAYMENT').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['A']).string('PAYMENT DATE').style(bordered_style).style(aligned_style).style(bold_style)
                ws.cell(r, col['B']).string('DESCRIPTION').style(bordered_style).style(aligned_style).style(bold_style)
                ws.cell(r, col['C']).string('PAYMENT VIA').style(bordered_style).style(aligned_style).style(bold_style)
                ws.cell(r, col['D']).string('TRANSACTION CODE').style(bordered_style).style(aligned_style).style(bold_style)
                ws.cell(r, col['E']).string('REFERENCE NO').style(bordered_style).style(aligned_style).style(bold_style)
                ws.cell(r, col['F']).string('AMOUNT').style(bordered_style).style(aligned_style).style(bold_style)
                ws.cell(r, col['G']).string('PENALTY').style(bordered_style).style(aligned_style).style(bold_style)
                ws.cell(r, col['H']).string('RECEIPT NO').style(bordered_style).style(aligned_style).style(bold_style)
                    
                
                buyer_payments.forEach(buyer_payment => {
                    // s.cell(++r, col['A'], r, col['I'], true).string('sample').style(bordered_style).style(aligned_style).style(header_style)
                    // let amount = this.formatDisplay(buyer_payment.amount)
                    // let penalty = this.formatDisplay(buyer_payment.penalty)
                    
                    let amount = buyer_payment.amount
                    let penalty = buyer_payment.penalty

                    // let amount = parseFloat(buyer_payment.amount).toFixed(2)

                    let payment_date = this.formatDate(buyer_payment.payment_date)
                    let { reference_no, or_ar_no, remarks, payment_via, transaction_code } = buyer_payment

                    ws.cell(++r, col['A']).string(payment_date).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['B']).string(remarks).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['C']).string(payment_via).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['D']).string(transaction_code).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E']).string(reference_no).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['F']).number(amount).style(numberstyle).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['G']).number(penalty).style(numberstyle).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['H']).string(or_ar_no).style(bordered_style).style(aligned_style).style(regular_style)
                    
                    // })
                })
                
                // to change destination path
                // wb.write(`PAYMENT - ${file_name}.xlsx`);
                
                // wb.write(`${homedir}/MYHOME/Payments/${file_name}.xlsx`);
                // wb.write(`./outputs/${buyer_name}.xlsx`);

                switch(project.id) {
                    case 1:
                        console.log('unit project MYHOME')
                        wb.write(`${homedir}/TUMABINI-PROJECTS/MYHOME/Payments/${file_name}.xlsx`); break;
                    case 2:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/MYHOME-DOS/Payments/${file_name}.xlsx`); break;
                    case 3:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/GREGORY-HOMES/Payments/${file_name}.xlsx`); break;
                    case 4:
                        const laurence_file = `${this.buyer.phase} ${block.name.toUpperCase()} ${lot.name.toUpperCase()} - ${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                        wb.write(`${homedir}/TUMABINI-PROJECTS/LAURENCE-VILLE/Payments/${laurence_file}.xlsx`); break;                    
                    case 5:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/SAN-ISIDRO-ENCLAVE/Payments/${file_name}.xlsx`); break;
                    case 6:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/FATIMA-HEIGHTS/Payments/${file_name}.xlsx`); break;
                    default: break;
                }

                alert('DONE EXPORTING')
                console.log('Done Exporting Payment for Buyer', this.buyer.id)
            }
        }
    })
</script>