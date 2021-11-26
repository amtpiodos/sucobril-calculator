<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24">

            <div v-if="!isFetchingData">
                <div class="h-2/3 flex">
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                        <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    </div>
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-semibold"> <p class="text-right"> {{ buyer.project.name }} - {{ buyer.project.location }} </p> </div>
                        <div class="text-xs"> <p class="text-right"> Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </p> </div>
                    </div>
                </div>

                <!-- CHECK FOR MANAGER CREDENTIALS IF REQUESTING FOR EDIT -->
                <div class="full m-4 border-4 rounded-md" v-if="this.isRequestingEdit">
                    <p class="align-middle text-center text-md font-bold my-1 py-4 pt-8"> INPUT CREDENTIALS TO EDIT </p>
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

                <!-- VIEW BUYER INFO WITHOUT EDIT REQUEST -->
                <div v-else>
                    <div class="full m-4 bg-gray-200">
                        <p class="text-center pt-2 font-bold text-lg"> BUYER'S INFORMATION </p>
                        <p class="text-center pb-2 font-regular text-sm" v-if="buyer.status" v-on:click="editPersonalInfo()"> Edit Information </p>
                        <p class="text-center pb-2 font-bold text-sm text-red-700" v-if="!buyer.status">
                            This buyer has been forefeited and is now inactive.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                        <div class="flex px-4 gap-4">
                            <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                            <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                            <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Reservation Date" :value="buyer.payment.date" /> </div>
                        <div class="full px-4"> <readonly-form label="Project Name" :value="buyer.project.name" /> </div>
                        <div class="grid grid-cols-4 gap-4 px-4">
                            <div class="full px-1"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                            <div class="full px-1"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                            <div class="full px-1"> <readonly-form label="Phase" :value="buyer.phase" /> </div>
                            <div class="full px-1"> <readonly-form label="Floor Area" :value="getLotArea()" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Project Address" :value="buyer.project.location" /> </div>
                        <div class="grid grid-cols-2 gap-4 px-4">
                            <div class="full"> <readonly-form label="Price/Sq.M" :value="buyer.lot.price_per_sqm" /> </div>
                            <div class="full"> <readonly-form label="House Type" :value="buyer.lot.lot_type" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Home Address" :value="buyer.home_address" />
                        </div>
                        <div class="flex px-4 gap-4">
                            <div class="w-1/2"> <readonly-form label="Contact No." :value="buyer.contact_number" /> </div>
                            <div class="w-1/2"> <readonly-form label="Email Address" :value="buyer.email_address" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Realty's Name" :value="buyer.realty" /> </div>
                        <div class="full px-4"> <readonly-form label="Agent's Name" :value="buyer.agent" /> </div>
                    </div>

                    <!-- HOUSE AND LOT REGULAR RESERVATION -->
                    <div v-if="buyer.reservation_type==1">
                        <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> REGULAR RESERVATION </p> </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.total_contract_price" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Required Equity
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.required_equity_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.required_equity_amount" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.reservation_fee" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Net of Reservation Fee: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.equity_net_of_reservation_fee" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Required Monthly Equity <br/> for
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.equity_months"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > months:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.monthly_equity_amount" /> </div> </div>
                            </div>

                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Starts: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.equity_start_date" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Ends: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.equity_end_date" /> </div> </div>
                            </div>

                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Balance Loanable Amount <br/> After Equity:
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.balance_loanable_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > months:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.balance_loanable_amount" /> </div> </div>
                            </div>
                        </div>
                    </div>

                    <!-- HOUSE AND LOT WITH SPOT EQUITY -->
                    <div v-else-if="buyer.reservation_type==2">
                        <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> WIH SPOT DOWNPAYMENT / ADVANCE DOWNPAYMENT </p> </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.total_contract_price" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Required Equity
                                        <input type="text"
                                            v-model="buyer.payment.required_equity_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                            readonly disabled
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.required_equity_amount" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Spot Cash Equity Less
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.spot_cash_equity_less_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.spot_cash_equity_less_amount" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Net Equity Less Discount: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.net_equity_less_discount" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.reservation_fee" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Equity Net of Reservation Fee <br/>(shall be paid on or before 30 days from reservation): </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.equity_net_of_reservation_fee" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Balance Loanable Amount <br/> after Equity
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.balance_loanable_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.balance_loanable_amount" /> </div> </div>
                            </div>
                        </div>
                    </div>

                    <!-- HOUSE AND LOT WITH SPOT CASH TCP -->
                    <div v-else-if="buyer.reservation_type==3">
                        <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> SPOT CASH TCP </p> </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.total_contract_price" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">SPOT CASH Discount <br /> Less
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.spot_cash_discount_less_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.spot_cash_discount_less_amount" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Net Total Contact Price: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.net_total_contract_price" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.reservation_fee" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Balance TCP (shall be paid on or <br/> before 30 days from reservation): </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.balance_total_contract_price" /> </div> </div>
                            </div>
                        </div>
                    </div>

                    <!-- HOUSE AND LOT WITH DEFERREd CASH -->
                    <div v-else-if="buyer.reservation_type==4">
                        <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> DEFERRED CASH </p> </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.total_contract_price" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.reservation_fee" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Balance Amount after Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.balance_amount_after_reservation" /> </div> </div>
                            </div>

                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Monthly Installment Amount <br /> payable in
                                        <input type="text"
                                            v-model="buyer.payment.installment_months"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                            readonly disabled
                                        > months:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.monthly_installment" /> </div> </div>
                            </div>
                        </div>

                        <div class="flex px-4 gap-4 my-2">
                            <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Starts: </p></div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.equity_start_date" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4 my-2">
                            <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Ends: </p></div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form v-model="buyer.payment.equity_end_date" /> </div> </div>
                        </div>
                    </div>

                    <div v-else>
                        <div class="full m-4 bg-gray-200">
                            <p class="text-center py-2 font-bold text-md text-red-500">
                                ERROR Incorrect reservation type: {{ this.buyer.reservation_type }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center mx-auto justify-center gap-8 my-4">
                        <!-- <button type="button" v-if="buyer.status" v-on:click="editDetails"
                            class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            EDIT INFORMATION
                        </button> -->
                        <button type="button" v-on:click="viewPayment"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            VIEW PAYMENTS
                        </button>
                        <button type="button" v-on:click="exportDetails"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            EXPORT INFORMATION
                        </button>
                        <button type="button" v-if="buyer.status" v-on:click="forefeitBuyer"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            FOREFEIT BUYER
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="isFetchingData">
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
            // 'vue-tailwind-modal': VueTailwindModal
        },
        data() {
            return {
                buyer: {},
                payment: {},
                isFetchingData: true,
                isEditing: false,
                isRequestingEdit: false,
                incorrectCredentials: false,
                credentials: {
                    username: 'MANAGER',
                    password: 'password123'
                },
                inputtedCredentials: {
                    username: '',
                    password: ''
                }
                // modalOptions: {
                //     background: "",
                //     modal: "max-w-1/2 mx-24 border-8 border-gray-300 ",
                //     close: "",
                // },
            }
        },
        created() {
            this.getDetails(this.$route.params.id)
        },
        methods: {
            cancelEdit() {
                this.inputtedCredentials = { username: '', password: ''}
                this.incorrectCredentials = false
                this.isRequestingEdit = false
            },
            checkCredentials() {
                console.log('INPUTTED CREDENTIALS', this.inputtedCredentials)
                if( this.credentials.username == this.inputtedCredentials.username.toUpperCase() &&
                    this.credentials.password == this.inputtedCredentials.password ) {
                        console.log('CREDENTIALS MATCHED')
                        // route to editing ?
                        this.$router.push({ name: 'Edit-Buyer-Info',
                                            params: {   id: this.buyer.id,
                                                        buyer: this.buyer }})
                        // this.isRequestingEdit = false

                } else {
                    this.incorrectCredentials = true
                }
            },
            editPersonalInfo() {
                console.log('edit personal info')
                this.isRequestingEdit = true
            },
            viewPayment() {
                console.log('Viewing payment for buyer ', this.buyer.id)
                this.$router.push({ name: "View-Payment", params: { id: this.buyer.id, buyer: this.buyer }})
            },
            getDetails(id) {
                this.isFetchingData = true,
                ipcRenderer.send('fetchBuyer', id)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.buyer = data
                    ipcRenderer.send('fetchLot', this.buyer.lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        this.buyer.lot = data
                        ipcRenderer.send('fetchBlock', this.buyer.lot.block_id)
                        ipcRenderer.once('fetchedBlock', (event, data) => {
                            this.buyer.block = data
                            if(this.buyer.block.phase_id) {
                               ipcRenderer.send('fetchPhase', this.buyer.block.phase_id)
                               ipcRenderer.once('fetchedPhase', (event, data) => {
                                   this.buyer.phase = data.name
                               })
                            } else {
                                this.buyer.phase = "N/A"
                            }
                            ipcRenderer.send('fetchProject', this.buyer.block.project_id)
                            ipcRenderer.once('fetchedProject', (event, data) => {
                                this.buyer.project = data
                                ipcRenderer.send('fetchHouseAndLotPayment', this.buyer.id)
                                ipcRenderer.once('fetchedHouseAndLotPayment', (event, data) => {
                                    this.buyer.payment = data
                                    console.log('this.buyer in VIEW DETAILS HOUSE AND LOT BUYER', this.buyer)
                                    console.log('this.buyer in VIEW DETAILS HOUSE AND LOT PAYMENT', this.payment)
                                    this.isFetchingData = false
                                })
                            })
                        })
                    })
                })
            },
            getLotArea() {
                console.log('this.buyer.lot.lot_area', this.buyer.lot.lot_area)
                return `${this.buyer.lot.lot_area} sq.m`
            },
            editDetails() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                this.$router.push({ name: 'Edit Buyer', params: { id: this.buyer.id, buyer: this.buyer } })
            },
            forefeitBuyer() {
                const data = {  id: this.buyer.id,
                                lot_id: this.buyer.lot.id }
                console.log('Forefeiting Buyer', data)
                ipcRenderer.send('forefeitBuyer', data)
                ipcRenderer.once('forefeitedBuyer', (event, data) => {
                    console.log('FOREFEITED BUYER REPLY', data)
                    data ? alert(`Buyer for ${this.buyer.project.name} ${this.buyer.block.name} ${this.buyer.lot.name} - ${this.buyer.first_name} ${this.buyer.project.name} ${this.buyer.middle_initial} ${this.buyer.lot.name} ${this.buyer.last_name} has been forefeited`)
                         : alert(`Forefeiting buyer for ${this.buyer.project.name} ${this.buyer.block.name} ${this.buyer.lot.name} - ${this.buyer.first_name} ${this.buyer.project.name} ${this.buyer.middle_initial} ${this.buyer.lot.name} ${this.buyer.last_name} failed`)
                    // refresh page

                    setTimeout(() =>{
                        this.$router.push('/')
                    }, 1000)
                })
            },
            exportDetails() {
                console.log('exporting details', this.buyer.reservation_type)
                const reservationType = this.buyer.reservation_type
                const php = ` Php `
                const buyer_name = `${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}`
                const block_name = `${this.buyer.block.name}`
                const project_name = `${this.buyer.project.name}`
                const lot_name = `${this.buyer.lot.name}`
                const price_per_sqm = `${this.buyer.lot.price_per_sqm}`
                const phase = `${this.buyer.phase}`
                const lot_area = this.buyer.lot.lot_area
                const lot_type = this.buyer.lot.lot_type
                const realty = this.buyer.realty
                const agent = this.buyer.agent
                const project_address = this.buyer.project.location
                const home_address = this.buyer.home_address
                const email_address = this.buyer.email_address
                const contact_number = this.buyer.contact_number

                const total_contract_price = this.buyer.payment.total_contract_price
                const required_equity_percentage = this.buyer.payment.required_equity_percentage
                const required_equity_amount = this.buyer.payment.required_equity_amount
                const equity_net_of_reservation_fee = this.buyer.payment.equity_net_of_reservation_fee
                const equity_months = this.buyer.payment.equity_months
                const monthly_equity_amount = this.buyer.payment.monthly_equity_amount
                const equity_start_date = this.buyer.payment.equity_start_date
                const equity_end_date = this.buyer.payment.equity_end_date
                const balance_loanable_percentage = this.buyer.payment.balance_loanable_percentage
                const balance_loanable_amount = this.buyer.payment.balance_loanable_amount

                const spot_cash_equity_less_percentage = this.buyer.payment.spot_cash_equity_less_percentage
                const spot_cash_equity_less_amount = this.buyer.payment.spot_cash_equity_less_amount
                const net_equity_less_discount = this.buyer.payment.net_equity_less_discount

                const spot_cash_discount_less_percentage = this.buyer.payment.spot_cash_discount_less_percentage
                const spot_cash_discount_less_amount = this.buyer.payment.spot_cash_discount_less_amount
                const net_total_contract_price = this.buyer.payment.net_total_contract_price
                const balance_total_contract_price = this.buyer.payment.balance_total_contract_price

                const balance_amount_after_reservation = this.buyer.payment.balance_amount_after_reservation
                const installment_months = this.buyer.payment.installment_months
                const monthly_installment = this.buyer.payment.monthly_installment
                const reservation_fee = this.buyer.payment.reservation_fee
                
                var wb = new excel4node.Workbook()
                var ws = wb.addWorksheet('RA - FORM 1A HL');

                let r = 1   // row
                const s = 4 // initial size
                const col = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9 }

                ws.column(col['A']).setWidth(s*4)
                ws.column(col['B']).setWidth(s*2)
                ws.column(col['C']).setWidth(s*3)
                ws.column(col['D']).setWidth(s*2)
                ws.column(col['E']).setWidth(s*2)
                ws.column(col['F']).setWidth(s*2)
                ws.column(col['G']).setWidth(s*2)
                ws.column(col['H']).setWidth(s*4)
                ws.column(col['I']).setWidth(s*4)

                const bold_header_style = wb.createStyle({ font: { color: '#000000', size: 13, bold: true }, alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                const bordered_style = wb.createStyle({ border: { left: { style: 'thin', color: '#000000' }, right: { style: 'thin', color: '#000000' }, top: { style: 'thin', color: '#000000' }, bottom: { style: 'thin', color: '#000000' }} })
                const aligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                const header_style = wb.createStyle({ font: { color: '#000000', size: 11, bold: true } })
                const bold_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: true } })
                const regular_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: false } })
                const center_bold = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' }, font: { color: '#000000', size: 11, bold: true } })
                const italic_rightaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'right', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })
                const italic_leftaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'left', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })

                ws.cell(r, col['A'], r, col['H'], true).string('TUMABINI REAL ESTATE DEVELOPMENT').style(bold_header_style)
                ws.cell(r, col['I']).string('LO-RA - FORM 2A').style(bold_header_style).style({font: {size: 12}, alignment: {horizontal: 'right'}})

                ws.cell(++r, col['A'], ++r, col['H'], true).string('133 MC Briones St., Hi-way Bakilid, Mandaue City 6014 Tel#: 032 414-5103, 09564791879 Email: tumabinidevelopment@gmail.com').style(regular_style).style(aligned_style).style({font: {size: 8}})
                ws.cell(r-1, col['I']).string('ANNEX A').style(bold_header_style).style({font: {size: 10}, alignment: {horizontal: 'right'}})

                ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET').style(bordered_style).style(aligned_style).style(header_style)

                ws.cell(++r, col['A']).string(` BUYER'S NAME: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(buyer_name).style(regular_style)
                ws.cell(r, col['E']).string(` BLOCK: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(block_name).style(regular_style)
                ws.cell(r, col['H']).string(` RESERVATION DATE: `).style(bold_style)

                ws.cell(++r, col['A']).string(` PROJECT NAME: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_name).style(regular_style)
                ws.cell(r, col['E']).string(` LOT: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(lot_name).style(regular_style)
                ws.cell(r, col['H']).string(` PRICE PER SQ.M: `).style(bold_style)
                ws.cell(r, col['I']).string(price_per_sqm).style(regular_style)

                ws.cell(++r, col['A']).string(` PHASE: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(phase).style(regular_style)
                ws.cell(r, col['E']).string(` FLOOR AREA: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).number(lot_area).style(regular_style)
                ws.cell(r, col['H']).string(` TYPE OF HOUSE: `).style(bold_style)
                ws.cell(r, col['I']).string(lot_type).style(regular_style)

                ws.cell(++r, col['A']).string(` PROJECT ADDRESS: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_address).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` HOME ADDRESS: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(home_address).style(regular_style)

                ws.cell(++r, col['A']).string(` EMAIL ADDRESS: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(email_address).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` CONTACT NUMBER: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).number(contact_number).style(regular_style)

                ws.cell(++r, col['A']).string(` REALTY: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(realty).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` AGENT: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(agent).style(regular_style)

                ws.cell(++r, col['A'], r, col['I'], true).string('')

                if(reservationType == 1) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET - REGULAR RESERVATION').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` REQUIRED EQUITY `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${required_equity_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(required_equity_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` Reservation Fee:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` Equity Net of Reservation Fee:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(equity_net_of_reservation_fee).style(center_bold)

                    ws.cell(++r, col['A']).string('Equity Term: ').style(italic_leftaligned_style)
                    ws.cell(r, col['B']).number(equity_months).style(center_bold)
                    ws.cell(r, col['C']).string('months').style(italic_rightaligned_style)
                    
                    ws.cell(++r, col['A']).string('Equity Starts: ').style(italic_leftaligned_style)
                    ws.cell(r, col['B'], r, col['D'], true).number(equity_start_date).style(center_bold)

                    ws.cell(++r, col['A']).string('Equity Ends: ').style(italic_leftaligned_style)
                    ws.cell(r, col['B'], r, col['D'], true).number(equity_end_date).style(center_bold)

                    ws.cell(r-1, col['E'], r, col['F'], true).string('REQUIRED Monthly Equity: ').style(italic_rightaligned_style)
                    ws.cell(r-1, col['G'], r, col['G'], true).string(php).style(italic_rightaligned_style)
                    ws.cell(r-1, col['H'], r, col['I'], true).number(monthly_equity_amount).style(center_bold)
                    
                    ws.cell(++r, col['A'], r, col['E'], true).string(` Balance Loanable Amount after Equity: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${balance_loanable_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(balance_loanable_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the first monthly equity after 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 2. The balance amount shall be loanable to bank / PAG-IBIG financinng.`).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 3. For cash payment of balance amount, it shall be paid on or before 30 days after last payment of monthly equity.`).style(italic_leftaligned_style)
                   
                } else if(reservationType == 2) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET with SPOT CASH EQUITY').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` REQUIRED EQUITY: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${required_equity_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(required_equity_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` SPOT CASH Equity Less: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${spot_cash_equity_less_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(spot_cash_equity_less_amount).style(center_bold)
                    
                    ws.cell(++r, col['A'], r, col['F'], true).string(` Net Equity Less Discount:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(net_equity_less_discount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` Reservation Fee:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r+1, col['F'], true).string(` Equity Net of Reservation Fee (shall be paid on or before thirty (30) days from reservation date):`).style(italic_rightaligned_style)
                    ws.cell(r, col['G'], r+1, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r++, col['H'], r, col['I'], true).number(equity_net_of_reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` Balance Loanable Amount after Equity: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${balance_loanable_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(balance_loanable_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the first monthly equity after 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 2. The balance amount shall be loanable to bank / PAG-IBIG financinng.`).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 3. For cash payment of balance amount, it shall be paid on or before 30 days after last payment of monthly equity.`).style(italic_leftaligned_style)
  
                } else if(reservationType == 3) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET with SPOT CASH TCP').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` SPOT CASH Discount Less: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${spot_cash_discount_less_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(spot_cash_discount_less_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`NET TOTAL Contract Price: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(net_total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`Reservation Fee: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(reservation_fee).style(center_bold)

                     ws.cell(++r, col['A'], r+1, col['F'], true).string(`Balance TCP (shall be paid on or before thirty (30) days from reservation date):`).style(italic_rightaligned_style)
                    ws.cell(r, col['G'], r+1, col['G'], true).string(php).style(italic_rightaligned_style)
                    ws.cell(r++, col['H'], r, col['I'], true).number(balance_total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the TCP Balance 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                
                } else if(reservationType == 4) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET with SPOT CASH TCP').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`Reservation Fee: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`Balance Amount after Reservation Fee: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(balance_amount_after_reservation).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` Balance Amount after Reservation Fee is payable in `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).number(installment_months).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string('months').style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string('').style(center_bold)
                    
                    ws.cell(++r, col['A'], r, col['F'], true).string(`Monthly Installment Amount: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(balance_amount_after_reservation).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the the first monthly due 30 days after reservation date shall mean cancelled & forefeited reservation.`).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r+1, col['I'], true).string(` 2. Any balance amount after last monthly due or (after 60 months) shall be loanable to bank / pag-ibig financing, or shall be paid in cash 30 days after last monthly installment ends.`).style(italic_leftaligned_style)
        
                } else {
                    ws.cell(++r, col['A'], r, col['I'], true).string(`ERROR: Reservation type ${reservationType} does not exist`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    
                }
                

              
                wb.write(`./outputs/${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}.xlsx`);
                // wb.write(`../../outputs/buyers-list/${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}.xlsx`);
            }
        }
    })
</script>