<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24 px-5">
            <!-- <div v-if="!isFetchingData"> -->

                <!-- Add back button  -->

                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                <div class="text-xs">    Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </div>
                <div class="text-xs font-semibold"> {{ buyer.project.name }} - {{ buyer.project.location }} </div>

                <div class="full my-4 bg-gray-200">
                    <p class="text-center p-2 font-semibold text-lg"> ADD PAYMENT </p>
                </div>

                
                <div v-if="!isAddingPayment">
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 py-1">
                    <div class="flex gap-4">
                        <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                        <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                        <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Project" :value="buyer.project.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Phase" :value="buyer.phase" /> </div> <!-- check if phase exists -->
                    </div>
                    <div class="full"> <readonly-form label="Project Location" :value="buyer.project.location" /> </div>
                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                    </div>

                    <div class="full flex">
                        <div class="w-1/2 mr-2">
                            <label-component label="Date" />
                             <!-- <input-form label="Date" v-model="new_payment.payment_date" /> -->
                            <datepicker v-model="new_payment.payment_date" typeable=true placeholder="Select Date..." class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                        </div>
                        <div class="w-1/2 ml-2"> <input-form label="Transaction Date" v-model="new_payment.transaction_code" />  </div>
                    </div>
                    <div class="full flex gap-4">
                        <div class="w-1/2"> <input-form label="Reference No." v-model="new_payment.reference_no" /> </div>
                        <div class="w-1/2"> <input-form label="OR/AR No." v-model="new_payment.or_ar_no" /> </div>
                    </div>
                    <div class="full"> <input-form label="Payment Via" v-model="new_payment.payment_via" /> </div>
                    <div class="full flex">
                        <div class="w-1/2 mr-2">
                            <label-component label="Amount (PHP)" />
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(new_payment.amount)"
                                    @change="updateAmount"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                            </div>
                        </div>
                        <div class="w-1/2 mr-2">
                            <label-component label="Penalty (PHP)" />
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(new_payment.penalty)"
                                    @change="updatePenalty"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="full my-2"> <text-area label="Remarks / Description" v-model="new_payment.remarks" /> </div>
                <div class="my-2">
                    <label class="inline-flex items-center">
                        <input type="checkbox" class="form-checkbox" v-model="new_payment.isDeductible"/>
                        <span class="ml-2 font-bold">Is deductible</span>
                    </label>
                </div>

                <div class="flex items-center mx-auto justify-center gap-8 my-4">
                    <button type="button" v-on:click="submitPayment"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        SUBMIT PAYMENT
                    </button>

                    <button type="button" v-on:click="back"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        BACK to PAYMENT DETAILS
                    </button>
                </div>
                <!-- <div class="flex items-center mx-auto justify-center gap-8 my-4">
                    <button type="button" v-on:click="this.$router.go(-1)"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        BACK to PAYMENT DETAILS
                    </button>
                </div> -->

            <!-- </div> -->
                </div>
                
            <div v-if="isAddingPayment" class="text-center mx-auto my-4 font-semibold text-lg">
                ADDING PAYMENT...
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import InputForm from '../components/v2/InputForm'
    import Label from '../components/v2/Label'
    import TextArea from '../components/v2/TextArea'
    import Datepicker from 'vuejs-datepicker'
    import { ipcRenderer } from 'electron'
    
    export default ({
        components: {
            'main-header': Header,
            'readonly-form': ReadOnlyForm,
            'input-form': InputForm,
            'datepicker': Datepicker,
            'text-area': TextArea,
            'label-component': Label
        },
        data() {
            return {
                isAddingPayment: false,
                buyer: {},
                payment: {},
                new_payment: {
                    payment_date: '',
                    reference_no: '-',
                    or_ar_no: '',
                    transaction_code: '-',
                    payment_via: '',
                    amount: '',
                    penalty: '',
                    remarks: '',
                    isDeductible: 1
                },
                isFetchingData: false // change to true
            }
        },
        created() {
            // this.getDate()
            this.buyer = this.$route.params.buyer
            this.payment = this.$route.params.buyer.payment
            console.log('this.buyer', this.buyer)
            // this.getPaymentDetails(this.$route.params.id)
        },
        methods: {
            back() {
                this.$router.push({ name: "View-Payment", params: { id: this.buyer.id, buyer: this.buyer }})
            },
            formatDisplay(value) {
               return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            formatParsedFloat(value) {
                return parseFloat(value.replace(/,/g, '')).toFixed(2)
            },
            updateAmount(event) {
                this.new_payment.amount = event.target.value
            },
            updatePenalty(event) {
                this.new_payment.penalty = event.target.value
            },
            submitPayment() {
                this.isAddingPayment = true
                this.new_payment.amount = this.formatParsedFloat(this.new_payment.amount)
                this.new_payment.penalty = this.formatParsedFloat(this.new_payment.penalty)
                // setTimeout(() => {
                    const dataToSubmit = { id: this.buyer.id, payment: this.new_payment}
                    console.log('submitPayment', dataToSubmit)
                    ipcRenderer.send('addPayment', dataToSubmit)
                    ipcRenderer.once('addedPayment', (event, data) => {
                        console.log('addedPayment', data)
                        if(data == 1) {
                            console.log('Add Payment SUCCESSFUL')
                            // this.autoExport()
                            // add loading screen
                            this.$router.push({ name: "View-Payment", params: { id: this.buyer.id, buyer: this.buyer }})
                        } else {
                            alert('Add Payment ERROR')
                            console.log('Add Payment ERROR')
                        }
                        this.isFetchingData = false
                    })
                // }, 1000)   
            }
        }
    })
</script>
