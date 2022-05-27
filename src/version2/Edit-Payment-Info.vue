<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24 px-5">
            <!-- <div v-if="!isFetchingData"> -->

                <!-- Add back button  -->
            
            <div v-if="!isFetchingData">
                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                <div class="text-xs">    Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </div>
                <div class="text-xs font-semibold"> {{ buyer.project.name }} - {{ buyer.project.location }} </div>

                <div class="full my-4 bg-gray-200">
                    <p class="text-center p-2 font-semibold text-lg" v-if="!isUnpaid"> EDIT PAYMENT INFO </p>
                    <p class="text-center p-2 font-semibold text-lg" v-else-if="(isUnpaid && !isEditingUnpaid)"> PAY UNPAID ENTRY </p>
                    <p class="text-center p-2 font-semibold text-lg" v-else-if="isEditingUnpaid"> EDIT UNPAID ENTRY </p>
                    <p class="text-center p-2 font-semibold text-lg text-red" v-else> WRONG TYPE </p>
                </div>

                <div v-if="!isUnpaid || (isUnpaid && !isEditingUnpaid)">
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
                                <datepicker v-model="edited_payment.payment_date" :typeable="true" placeholder="Select Date..." class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                            </div>
                            <div class="w-1/2 ml-2"> <input-form label="Transaction Date" v-model="edited_payment.transaction_code" />  </div>
                        </div>
                        <div class="full flex gap-4">
                            <div class="w-1/2"> <input-form label="Reference No." v-model="edited_payment.reference_no" /> </div>
                            <div class="w-1/2"> <input-form label="OR/AR No." v-model="edited_payment.or_ar_no" /> </div>
                        </div>
                        <div class="full"> <input-form label="Payment Via" v-model="edited_payment.payment_via" /> </div>

                        <!-- DISABLING EDIT FOR AMOUNT AND PENALTY if from PAY UNPAID Button -->
                        <div class="full flex" v-if="isUnpaid && !isEditingUnpaid">
                            <div class="w-1/2 mr-2">
                                <label-component label="Amount (PHP)" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(edited_payment.amount)"
                                        @change="updateAmount"
                                        readonly disabled
                                        class="w-full py-2 px-4 text-md border border-gray-200  bg-gray-100 rounded-md uppercase">
                                </div>
                            </div>
                            <div class="w-1/2 mr-2">
                                <label-component label="Penalty (PHP)" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(edited_payment.penalty)"
                                        @change="updatePenalty"
                                        readonly disabled
                                        class="w-full py-2 px-4 text-md border border-gray-200 bg-gray-100 rounded-md uppercase">
                                </div>
                            </div>
                        </div>

                        <!-- ENABLING EDIT FOR AMOUNT AND PENALTY if not from PAY UNPAID BUTTON -->
                        <div class="full flex" v-else>
                            <div class="w-1/2 mr-2">
                                <label-component label="Amount (PHP)" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(edited_payment.amount)"
                                        @change="updateAmount"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                                </div>
                            </div>
                            <div class="w-1/2 mr-2">
                                <label-component label="Penalty (PHP)" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(edited_payment.penalty)"
                                        @change="updatePenalty"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="full my-2"> <text-area label="Remarks / Description" v-model="edited_payment.remarks" /> </div> -->
                    <div class="full my-2 flex">
                        <div class="w-1/2 mr-2"> <text-area label="Remarks / Description" v-model="edited_payment.remarks" /> </div>
                        <div class="w-1/2 ml-2">
                            <label-component label="NOTES (e.g. payment breakdowns, etc." class="mb-1" />
                            <textarea class="p-2 w-full border rounded-md" v-model="edited_payment.notes" rows=5 > </textarea>
                        </div>
                    </div>
                    <div class="my-2">
                        <label class="inline-flex items-center">
                            <input type="checkbox" class="form-checkbox" v-model="edited_payment.isDeductible"/>
                            <span class="ml-2 font-bold">Is deductible</span>
                        </label>
                    </div>
                </div>

                <div v-else-if="isUnpaid && isEditingUnpaid">
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

                        
                        <div class="full my-4 bg-gray-200">
                            <p class="text-center p-2 font-semibold text-lg my-2"> PENALTY CALCULATOR </p>
                            <div class="grid grid-cols-3 mb-4">
                                <div class="mx-auto w-3/4">
                                    <label-component label="# of unpaid months" class="w-full text-center my-1"/>
                                    <div class="mx-auto w-fullmt-1 relative rounded-md shadow-sm border-gray-200">
                                        <input type="text"
                                        :value="formatDisplay(amountsForDisplay.consecutive_unpaid_months)"
                                        @change="updateUnpaidMonths"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                                    </div>
                                </div>
                                <div class="mx-auto w-3/4">
                                    <label-component label="Unpaid Amount (PHP)" class="text-center"/>
                                    <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                        <input type="text"
                                            :value="formatDisplay(edited_payment.amount)"
                                            @change="updateAmount"
                                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                                    </div>
                                </div>
                                <div class="mx-auto w-3/4">
                                    <label-component label="2% EXPECTED PENALTY" class="text-center"/>
                                    <div class="mt-1 relative rounded-md shadow-sm bg-red-200 border-gray-200">
                                        <input type="text"
                                            :value="formatDisplay(calculatedPenalty)"
                                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase"
                                            readonly disabled>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="full flex grid grid-cols-2">
                            <div class="w-full mr-2">
                                <label-component label="Date" />
                                <datepicker v-model="edited_payment.payment_date"
                                            placeholder="Select Date..." class="my-1" minimum-view="month"
                                            input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                            </div>
                            <div class="w-full ml-2">
                                <label-component label="Amount (PHP)" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(edited_payment.amount)"
                                        @change="updateAmount"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                                </div>
                            </div>
                            <div class="w-full mr-2">
                                <label-component label="Penalty (PHP)" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(edited_payment.penalty)"
                                        @change="updatePenalty"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                                </div>
                            </div>
                            <div class="w-full ml-2">
                                <label-component label="Total Unpaid Amount" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(amountsForDisplay.total_unpaid)"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase"
                                        readonly disabled>
                                </div>
                            </div>
                        </div>


                        <div class="full flex gap-4">
                            
                        </div>
                    </div>

                    <div class="full my-2"> <text-area label="Remarks / Description" v-model="edited_payment.remarks" /> </div>
                </div>

                <div v-else> ERROR: Wrong action (isUnpaid) {{ isUnpaid }} (isEditingUnpaid) {{ isEditingUnpaid }} </div>

                <div class="flex items-center mx-auto justify-center gap-8 my-4">
                    <button type="button" v-on:click="submitEditedPayment"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        SUBMIT PAYMENT
                    </button>

                    <button type="button" v-on:click="viewPayment"
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
            
            <div v-if="isFetchingData" class="text-center mx-auto my-4 font-semibold text-lg">
                LOADING...
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
                buyer: this.$route.params.buyer,
                unedited_payment: '',
                edited_payment: this.$route.params.payment,
                changed_data: {},
                isFetchingData: false, // change to true

                amountsForDisplay: {
                    consecutive_unpaid_months: 0,
                    total_unpaid: 0
                },
                isUnpaid: this.$route.params.isUnpaid,
                isEditingUnpaid: this.$route.params.isEditingUnpaid,
                calculatedPenalty: 0
            }
        },
        created() {
            console.log('created', this.$route.params.id, 'ISUNPAID', this.isUnpaid)
            this.getDetails(this.$route.params.id)
        },
        methods: {
            addChangedFields(_callback) {
                const edited = this.edited_payment
                const unedited = this.unedited_payment
                for(const field in edited) {
                    console.log(field, edited[field], unedited[field])
                    if(edited[field] !== unedited[field]) {
                        if(typeof(edited[field]) !== 'object') {
                            if(!isNaN(this.formatParsedFloat(edited[field])) && (field == 'amount' || field == 'penalty')) {5
                                this.changed_data[field] = this.formatParsedFloat(edited[field])
                            } else {
                                
                                this.changed_data[field] = edited[field]
                            }
                            // this.changed_data[field] = isNaN(this.formatParsedFloat(edited[field])) ? edited[field] : (this.formatParsedFloat(edited[field]))
                        } else {
                            if(field == 'payment_date') {
                                this.changed_data[field] = edited[field]
                            }
                        }
                        // console.log('edited vs unedited', edited[field], typeof(edited[field]), unedited[field], typeof(unedited[field]))
                    }
                }
                _callback()
            },
            formatParsedFloat(value) {
                console.log('TYPE OF VALUE', typeof(value))
                return parseFloat(value.toString().replace(/,/g, '')).toFixed(2)
            },
            submitEditedPayment() {
                this.isFetchingData = true
                
                // this.edited_payment.isUnpaid = this.isEditingUnpaid ? this.isUnpaid : !this.isUnpaid
                if(this.isUnpaid && !this.isEditingUnpaid) {
                    console.log('IS UNPAID ISEDITING UNPAID', this.isUnpaid, this.isEditingUnpaid)
                    this.edited_payment.isUnpaid = 0
                }
                this.addChangedFields(() => {
                    console.log('added changed fields', this.changed_data)
                    const changed_size = Object.keys(this.changed_data).length

                    const dataToSubmit = {  id: this.unedited_payment.id,
                                        unedited_payment: this.unedited_payment,
                                        buyer: this.buyer,
                                        changed_data: this.changed_data }
                    if(changed_size !== 0) {
                        ipcRenderer.send('editPayment', dataToSubmit)
                        ipcRenderer.once('editedPayment', (event, data) => {
                            console.log('editedPayment', data)
                            if(data.response == 1) {
                                // if(this.isUnpaid && !this.isEditingUnpaid) {
                                    alert('PAYMENT SUCCESSFULLY UPDATED')
                                    this.isFetchingData = true
                                    // this.autoExport()
                                    // add loading screen
                                    this.viewPayment()
                                // }
                            } else {
                                alert('EDIT PAYMENT ERROR', data.error)
                            }
                        })
                    } else {
                        alert('No edit/update has been made.')
                        this.isFetchingData = false
                    }
                })
            },
            viewPayment() {
                this.$router.push({ name: "View-Payment", params: { id: this.buyer.id, buyer: this.buyer }})
            },
            formatDisplay(value) {
               return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value
            },
            // formatParsedFloat(value) {
            //     return parseFloat(value.replace(/,/g, '')).toFixed(2)
            // },
            getDetails(id) {
                this.isFetchingData = true,
                ipcRenderer.send('fetchPayment', id)
                ipcRenderer.once('fetchedPayment', (event, data) => {
                    if(data.response == 1) {
                        this.unedited_payment = data.buyer_payment
                        this.getInitialUnpaid(data.buyer_payment)
                    } else {
                        alert('ERROR FETCHING OF PAYMENT ID ', id)
                    }
                    this.isFetchingData = false
                })
            },
            calculateUnpaid() {
                if(this.isUnpaid) {
                    // this.edited_payment.penalty = this.formatParsedFloat(parseFloat(this.edited_payment.amount) * parseFloat(0.02) * parseFloat(this.amountsForDisplay.consecutive_unpaid_months))
                    this.amountsForDisplay.total_unpaid = this.formatParsedFloat(parseFloat(this.edited_payment.amount) + parseFloat(this.edited_payment.penalty))
                    this.updateCalculatedPenalty()
                }
            },
            getInitialUnpaid(unpaid) {
                this.amountsForDisplay.consecutive_unpaid_months = this.formatDisplay(parseFloat(unpaid.penalty) / parseFloat(unpaid.amount) / 0.02)
                this.amountsForDisplay.total_unpaid = this.formatDisplay(parseFloat(unpaid.penalty) + parseFloat(unpaid.amount))
            },
            updateAmount(event) {
                this.edited_payment.amount = event.target.value
                this.calculateUnpaid()
            },
            updateCalculatedPenalty() {
                this.calculatedPenalty =  this.formatParsedFloat(parseFloat(this.edited_payment.amount) * parseFloat(0.02) * parseFloat(this.amountsForDisplay.consecutive_unpaid_months))
            },
            updatePenalty(event) {
                this.edited_payment.penalty = event.target.value
                this.calculateUnpaid()
            },
            updateUnpaidMonths(event) {
                this.amountsForDisplay.consecutive_unpaid_months = event.target.value
                this.calculateUnpaid()
            },
            
            // submitEditedPayment() {
            //     console.log('submitEditedPayment unedited', this.unedited_payment)
            //     console.log('submitEditedPayment edited', this.edited_payment)
            //     // this.new_payment.amount = this.formatParsedFloat(this.new_payment.amount)
            //     // this.new_payment.penalty = this.formatParsedFloat(this.new_payment.penalty)
            //     // setTimeout(() => {
            //     //     const dataToSubmit = { id: this.buyer.id, payment: this.new_payment}
            //     //     console.log('submitPayment', dataToSubmit)
            //     //     ipcRenderer.send('addPayment', dataToSubmit)
            //     //     ipcRenderer.once('addedPayment', (event, data) => {
            //     //         console.log('addedPayment', data)
            //     //         if(data == 1) {
            //     //             console.log('Add Payment SUCCESSFUL')
            //     //             // this.autoExport()
            //     //             // add loading screen
            //     //             setTimeout(() => {
            //     //                 this.$router.push({ name: "View-Payment", params: { id: this.buyer.id, buyer: this.buyer }})
            //     //             }, 2000)
            //     //         } else {
            //     //             alert('Add Payment ERROR')
            //     //             console.log('Add Payment ERROR')
            //     //         }
            //     //         this.isFetchingData = false
            //     //     })
            //     // }, 1000)   
            // }



            

                                    // if(this.isUnpaid && !isEditingUnpaid) {
                                    //     ipcRenderer.send('deleteUnpaidPayment', this.unedited_payment.id)
                                    //     ipcRenderer.once('deletedUnpaidPayment', (event, data) => {
                                    //         if(data.response == 1) {
                                    //             alert('SUCCESSFULLY ADDED PAYMENT for UNPAID ENTRY')
                                    //         } else {
                                    //             alert('ERROR', data.error)
                                    //         }
                                    //     })
                                    // }
        }
    })
</script>


