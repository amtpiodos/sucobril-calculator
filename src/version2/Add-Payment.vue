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

                    <div class="full"> <input-form label="Reference No." v-model="new_payment.reference_no" /> </div>
                    <div class="full"> <input-form label="OR/AR No." v-model="new_payment.or_ar_no" /> </div>
                    <div class="full"> <input-form label="Amount (Php)" v-model="new_payment.amount" /> </div>
                    <div class="full"> <input-form label="Penalty (Php)" v-model="new_payment.penalty" /> </div>
                </div>

                <div class="flex items-center mx-auto justify-center gap-8 my-4">
                    <button type="button" v-on:click="submitPayment"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        SUBMIT PAYMENT
                    </button>
                </div>


            <!-- </div> -->
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import InputForm from '../components/v2/InputForm'
    import { ipcRenderer } from 'electron'
    
    export default ({
        components: {
            'main-header': Header,
            'readonly-form': ReadOnlyForm,
            'input-form': InputForm
        },
        data() {
            return {
                buyer: {},
                payment: {},
                new_payment: {
                    reference_no: 'RR091239',
                    or_ar_no: '893128',
                    amount: '999.99',
                    penalty: '99.90'
                },
                isFetchingData: false // change to true
            }
        },
        created() {
            this.buyer = this.$route.params.buyer
            this.payment = this.$route.params.buyer.payment
            console.log('this.buyer', this.buyer)
            // this.getPaymentDetails(this.$route.params.id)
        },
        methods: {
            submitPayment() {
                // console.log('submitting payment', this.new_payment)
                const dataToSubmit = { id: this.buyer.id, payment: this.new_payment}
                console.log('submitPayment', dataToSubmit)
                ipcRenderer.send('addPayment', dataToSubmit)
                ipcRenderer.once('addedPayment', (event, data) => {
                    console.log('addedPayment', data)
                    if(data == 1) {
                        console.log('Add Payment SUCCESSFUL')
                        // this.autoExport()
                        // add loading screen
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 2000)
                    } else {
                        alert('Add Payment ERROR')
                        console.log('Add Payment ERROR')
                    }
                    this.isFetchingData = false
                })
            }
        }
    })
</script>
