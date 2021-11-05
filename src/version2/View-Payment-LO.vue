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

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 py-1">
                    <div class="flex gap-4">
                        <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                        <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                        <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                    </div>
                    <div class="full"> <readonly-form label="Total Contract Price" :value="payment.total_contract_price" /> </div>
                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Project" :value="buyer.project.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Phase" :value="buyer.phase" /> </div> <!-- check if phase exists -->
                    </div>
                    <div class="full"> <readonly-form label="Running TCP Balance" :value="0" /> </div>
                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                    </div>
                    <div class="full"> <readonly-form label="Total Payments Made" :value="0" /> </div>
                </div>

                <div class="mb-8">
                    <div class="full my-4 bg-gray-200">
                        <p class="text-center p-2 font-semibold text-lg"> PAYMENT DETAILS </p>
                    </div>

                    <div class="flex">
                        <div class="w-1/5">
                            <div class="flex">
                                <div class="w-1/4"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> No. </p> </div>
                                <div class="w-3/4"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Date </p> </div>
                            </div>
                        </div>
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Reference No. </p>
                        </div>
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> OR/AR No. </p>
                        </div>
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Amount </p>
                        </div>
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Penalty </p>
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
                    </div>

                    <div> ... </div>
                </div>

                <!-- {{ buyer_payments }} -->

            </div>
        </div>
    </div>
</template>


<script>
    import Header from '../components/v2/Header'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import SinglePayment from '../components/v2/SinglePayment'
    import { ipcRenderer } from 'electron'
    
    export default ({
        components: {
            'main-header': Header,
            'readonly-form': ReadOnlyForm,
            'single-payment': SinglePayment
        },
        data() {
            return {
                buyer: {},
                payment: {},
                buyer_payments: {},
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
            }
        }
    })
</script>