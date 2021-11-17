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
                    <p class="text-center p-2 font-semibold text-lg"> STATEMENT OF ACCOUNT </p>
                    <p class="text-center pb-2 font-bold text-sm text-red-700" v-if="!buyer.status">
                        This buyer has been forefeited and is now inactive.
                    </p>
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
                        <div class="full my-2"> <readonly-form label="Reservation Fee" :value="payment.reservation_fee" /> </div>
                        <div class="full my-2"> <readonly-form label="Total Contract Price" :value="payment.total_contract_price" /> </div>
                    </div>

                    <!-- HL REGULAR RESERVATION  -->
                    <div class="w-full" v-if="payment.reservation_type == 1">
                        <div class="full my-2"> <readonly-form label="Required Equity" :value="payment.required_equity_amount" /> </div>
                        <div class="full my-2"> <readonly-form label="Equity Net of Reservation:" :value="payment.equity_net_of_reservation_fee" /> </div>
                        <div class="full my-2"> <readonly-form label="Required Loanable Amount" :value="payment.balance_loanable_amount" /> </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2">
                                <label-component label="Running Equity Balance:"/>
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        v-model="running_equity_balance"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                                </div>
                            </div>
                             <div class="w-1/2">
                                <label-component label="Running TCP Balance:"/>
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        v-model="running_tcp_balance"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                                </div>
                            </div>
                        </div>
                        <div class="full">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- HL WITH SPOT EQUITY -->
                    <div class="w-full" v-if="payment.reservation_type == 2">
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Required Equity" :value="payment.required_equity_amount" /> </div>
                            <div class="w-1/2"> <readonly-form label="Equity Less of Reservation:" :value="payment.equity_net_of_reservation_fee" /> </div>
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Discount (%):" :value="payment.spot_cash_equity_less_percentage" /> </div>
                            <div class="w-1/2"> <readonly-form label="Total Discount (PHP)" :value="payment.spot_cash_equity_less_amount" /> </div>

                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Net Equity Payable" :value="payment.net_equity_less_discount" /> </div>
                            <div class="w-1/2"> <readonly-form label="Required Loanable Amount" :value="payment.balance_loanable_amount" /> </div>

                        </div>
                        <div class="full my-2">
                            <label-component label="Running Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="running_balance"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- HL SPOT CASH -->
                    <div class="w-full" v-if="payment.reservation_type == 3">
                        <div class="full my-2"> <readonly-form label="TCP Net of Reservation" :value="payment.net_total_contract_price" /> </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Discount (%):" :value="payment.spot_cash_discount_less_percentage" /> </div>
                            <div class="w-1/2"> <readonly-form label="Discount Amount (PHP)" :value="payment.spot_cash_discount_less_amount" /> </div>
                        </div>
                        <div class="full my-2"> <readonly-form label="Total TCP Payable" :value="payment.balance_total_contract_price" /> </div>
                        <div class="full my-2">
                            <label-component label="TCP Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="running_balance"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full my-2">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- DEFERRED CASH -->
                    <div class="w-full" v-if="payment.reservation_type == 4">
                        <div class="full my-2"> <readonly-form label="TCP Net of Reservation" :value="payment.balance_amount_after_reservation" /> </div>
                        <div class="full my-2"> <readonly-form label="Number of months payable" :value="payment.installment_months" /> </div>
                        <div class="full my-2"> <readonly-form label="Monthly Amortization" :value="payment.monthly_installment" /> </div>
                        <div class="full my-2">
                            <label-component label="TCP Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="running_balance"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full my-2">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
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
                    <div class="full"> <readonly-form label="Total Contract Price" :value="payment.total_contract_price" /> </div>
                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Project" :value="buyer.project.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Phase" :value="buyer.phase" /> </div>
                    </div>

                    <div class="full">
                        <label-component label="Running TCP Balance:"/>
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="text"
                                v-model="running_tcp_balance"
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
                                v-model="total_payments_made"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div>
                    </div>
                </div>

                <!-- <div v-else> RESERVATION TYPE ERROR  </div> -->

                <div class="mb-8">
                    <div class="full my-4 bg-gray-200">
                        <p class="text-center p-2 font-semibold text-lg"> PAYMENT DETAILS </p>
                    </div>

                    <div class="flex">
                        <div class="w-1/5">
                            <div class="flex">
                                <!-- <div class="w-1/4"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> No. </p> </div> -->
                                <!-- <div class="w-3/4"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Date </p> </div> -->
                                <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Date </p> </div>
                            </div>
                        </div>
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Reference No. </p>
                        </div>
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> OR/AR No. </p>
                        </div>
                        <div class="w-1/5 flex">
                            <div class="w-1/2"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Amount </p> </div>
                            <div class="w-1/2"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Penalty </p> </div>
                        </div>
                        <!-- <div class="w-1/6">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Penalty </p>
                        </div> -->
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Remarks </p>
                        </div>
                    </div>

                    <div v-for="buyer_payment in buyer_payments" :key="buyer_payment.id">
                        <single-payment v-bind:buyer_payment="buyer_payment"/>
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
                    </div>

                    <div> ... </div>
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
    import { ipcRenderer } from 'electron'
    
    export default ({
        components: {
            'main-header': Header,
            'readonly-form': ReadOnlyForm,
            'single-payment': SinglePayment,
            'label-component': Label
        },
        data() {
            return {
                buyer: {},
                payment: {},
                buyer_payments: {},

                total_payments_made: 0,
                running_equity_balance: 0,
                running_tcp_balance: 0,
                running_balance: 0,
                isFetchingData: false // change to true
            }
        },
        created() {
            this.buyer = this.$route.params.buyer
            this.payment = this.$route.params.buyer.payment
            console.log('this.buyer', this.buyer)
            this.getPaymentDetails(this.$route.params.id)
        },
        methods: {
            getPaymentDetails(buyer_id) {
                console.log('getPaymentDetails HL', buyer_id)

                const dataToSubmit = { id: this.buyer.id, payment: this.new_payment}
                ipcRenderer.send('fetchPaymentsList', dataToSubmit)
                ipcRenderer.once('fetchedPaymentsList', (event, data) => {
                    console.log('fetchedPaymentsList', data)
                    if(data.response == 1) {
                        console.log('Fetch Buyer Payment Details SUCCESSFUL')
                        this.buyer_payments = data.buyer_payments
                        
                        console.log(this.buyer_payments, typeof(this.buyer_payments))
                        console.log('RESERVATION TYPE', this.payment.reservation_type)
                        if(this.buyer_payments.length > 0) {
                            this.buyer_payments.forEach(buyer_payment => {
                                if(buyer_payment.isDeductible) {
                                    this.total_payments_made = this.total_payments_made + buyer_payment.amount
                                    console.log('PAYMENTS MADE', this.total_payments_made, buyer_payment)
                                    this.running_tcp_balance = this.payment.total_contract_price - this.total_payments_made
                                    if(this.payment.reservation_type == 1) {
                                        this.running_equity_balance = this.payment.equity_net_of_reservation_fee - this.total_payments_made
                                    } else if(this.payment.reservation_type == 2) {
                                        this.running_balance = this.payment.equity_net_of_reservation_fee - this.total_payments_made
                                    } else if(this.payment.reservation_type == 3) {
                                        console.log('this.payment.balance_total_contract_price', this.payment.balance_total_contract_price)
                                        this.running_balance = this.payment.balance_total_contract_price - this.total_payments_made
                                    } else if(this.payment.reservation_type == 4) {
                                        this.running_balance = this.payment.balance_amount_after_reservation - this.total_payments_made
                                    } else {
                                        // reservation type for lot only
                                    }
                                }
                            })
                        } else {
                            console.log ('No payments yet')
                            if(this.payment.reservation_type == 1) {
                                this.running_equity_balance = this.payment.equity_net_of_reservation_fee
                            } else if(this.payment.reservation_type == 2) {
                                this.running_balance = this.payment.equity_net_of_reservation_fee
                            } else if(this.payment.reservation_type == 3) {
                                this.running_balance = this.payment.balance_total_contract_price
                            } else if(this.payment.reservation_type == 4) {
                                this.running_balance = this.payment.balance_amount_after_reservation
                            } else {

                            }
                        }
                        

                         setTimeout(() => {}, 2000)
                    } else {
                        alert('Fetch Buyer Payment Details ERROR')
                        console.log('Fetch Buyer Payment Details ERROR')
                    }

                    this.isFetchingData = false
                })
            },
            addPayment() {
                console.log('add payment', this.payment)
                this.$router.push({ name: "Add-Payment", params: { id: this.buyer.id, buyer: this.buyer, payment: this.payment }})
            },
            exportPayment() {

            }
        }
    })
</script>