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

                <div class="full m-4 bg-gray-200">
                    <p class="text-center pt-2 font-bold text-lg"> BUYER'S INFORMATION </p>
                    <p class="text-center pb-2 font-regular text-sm" v-if="buyer.status" v-on:click="editPersonalInfo()"> Edit Information </p>
                    <p class="text-center py-2 font-bold text-sm text-red-700" v-if="!buyer.status">
                        This buyer has been forefeited and is now inactive.
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                    <div class="flex px-4 gap-4">
                        <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                        <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                        <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Reservation Date" :value="formatDate(buyer.payment.date)" /> </div>
                    <div class="full px-4"> <readonly-form label="Project Name" :value="buyer.project.name" /> </div>
                    <div class="grid grid-cols-4 gap-4 px-4">
                        <div class="full px-1"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Phase" :value="buyer.phase" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot Area" :value="getLotArea()" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Address" :value="buyer.project.location" /> </div>
                    <div class="grid grid-cols-2 gap-4 px-4">
                        <div class="full"> <readonly-form label="Price/Sq.M" :value="buyer.lot.price_per_sqm" /> </div>
                        <div class="full"> <readonly-form label="Type of Lot" :value="buyer.lot.lot_type" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Home Address" :value="buyer.home_address" />
                    </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <readonly-form label="Contact No." :value="buyer.contact_number" /> </div>
                        <div class="w-1/2"> <readonly-form label="Email Address" :value="buyer.email_address" /> </div>
                    </div>
                    <!-- <div class="full px-4"> <readonly-form label="Realty's Name" :value="buyer.realty" /> </div> -->
                    <!-- <div class="full px-4"> <readonly-form label="Agent's Name" :value="buyer.agent" /> </div> -->
                    <!-- <div class="full px-4"> <readonly-form label="Realty's Name" :value="realty.name" /> </div> -->
                    
                    <div class="full px-4">
                        <readonly-form label="Realty's Name" :value="realty.name" v-if="realty.id > 0" />
                        <readonly-form label="Realty's Name" :value="buyer.realty" v-else />
                        <!-- <readonly-form label="Realty's Name" :value="realty" v-else /> -->
                    </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <readonly-form label= "Agent's Name" :value="buyer.agent" /> </div>
                        <div class="w-1/2"> <readonly-form label= "Agent's Number" :value="buyer.agent_number" /> </div>
                    </div>
                    <div class="w-full px-4"> <readonly-form label= "Encoded by:" :value="encoder.name" /> </div>
                    <div class="w-full px-4"> <readonly-form label= "Confirmed by:" :value="manager.name" /> </div>
                      
                </div>

                <div class="flex items-center mx-auto justify-center gap-8 my-4">
                    <button type="button" v-on:click="viewPayment"
                        class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        VIEW PAYMENTS
                    </button>
                    <button type="button" v-on:click="exportDetails"
                        class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        EXPORT INFORMATION
                    </button>
                </div>

                <!-- LOT ONLY REGULAR RESERVATION -->
                <div v-if="buyer.reservation_type==5">
                    <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> REGULAR RESERVATION / STRAIGHT MONTHLY </p> </div>
                    <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (includes transfer fee) </p> </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.total_contract_price)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4">
                            <div class="w-1/4 items-center py-2">
                                <p class="align-middle text-right text-xs font-bold">MONTHLY INSTALLMENT for <br />
                                    <input type="text"
                                        v-model="buyer.payment.installment_months"
                                        class=" border border-gray-300 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        readonly disabled> months:
                                </p>
                            </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.monthly_installment)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4">
                            <div class="w-1/4 items-center py-4"> <p class="align-middle text-right text-xs font-bold">FIRST MONTHLY INSTALLMENT <br> FEE / RESERVATION FEE: </p> </div>
                            <div class="w-3/4 py-2"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.reservation_fee)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4">
                            <div class="w-1/4 items-center py-4"> <p class="align-middle text-right text-xs font-bold">Monthly Installment <br> START DATE: </p> </div>
                            <div class="w-3/4 py-2"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.monthly_start_date)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4 ">
                            <div class="w-1/4 items-center py-4"> <p class="align-middle text-right text-xs font-bold">Monthly Installment <br> END DATE: </p> </div>
                            <div class="w-3/4 py-2"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.monthly_end_date)" /> </div> </div>
                        </div>
                    </div>
                </div>

                <!-- LOT ONLY WITH SPOT DOWNPAYMENT -->
                <div v-else-if="buyer.reservation_type==6">
                    <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> WITH SPOT DOWNPAYMENT / ADVANCE PAYMENT </p> </div>
                    <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (includes transfer fee) </p> </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.total_contract_price)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Spot Downpayment / <br> Advance Payment </p> </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.spot_downpayment)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-4"> <p class="align-middle text-right text-xs font-bold">NEW TCP Less Downpayment </p> </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.new_tcp_less_downpayment)" /> </div> </div>
                        </div>

                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2">
                                <p class="align-middle text-right text-xs font-bold">MONTHLY INSTALLMENT for <br />
                                    <input type="text"
                                        v-model="buyer.payment.installment_months"
                                        class=" border border-gray-300 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        readonly disabled> months:
                                </p>
                            </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.monthly_installment)" /> </div> </div>
                        </div>

                        <!-- INSTALLMENT START AND END DATES -->
                        <div class="flex px-4 gap-4 my-2">
                            <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Starts: </p></div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.monthly_start_date)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4 my-2">
                            <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Ends: </p></div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.monthly_end_date)" /> </div> </div>
                        </div>
                    </div>
                </div>

                <!-- LOT ONLY WITH SPOT CASH -->
                <div v-else-if="buyer.reservation_type==7">
                    <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> SPOT CASH </p> </div>
                    <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (includes transfer fee) </p> </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.total_contract_price)" /> </div> </div>
                        </div>

                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-2">
                                <p class="align-middle text-right text-xs font-bold"> Spot Cash Discount
                                    <input type="text"
                                        v-model="buyer.payment.spot_cash_discount_percentage"
                                        class=" border border-gray-300 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        readonly disabled> %:
                                </p>
                            </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.spot_cash_discount_amount)" /> </div> </div>
                        </div>

                        <div class="flex px-4 gap-4 my-4">
                            <div class="w-1/4 items-center py-4"> <p class="align-middle text-right text-xs font-bold"> NEW TCP Less Discount </p> </div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.new_tcp_less_discount)" /> </div> </div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div class="full m-4 bg-gray-200">
                        <p class="text-center py-2 font-bold text-md text-red-500">
                            ERROR Incorrect reservation type: {{ this.buyer.reservation_type }}
                        </p>
                    </div>
                </div>

                <div class="flex items-center mx-auto justify-center gap-8 my-4" v-if="buyer.status" >
                    <button type="button" v-on:click="confirmForefeit"
                        class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        FOREFEIT BUYER
                    </button>
                    <button type="button" v-on:click="assumeUnit"
                        class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        ASSUME UNIT
                    </button>
                </div>

                <!-- <div class="flex items-center mx-auto justify-center gap-8 my-4">
                    <button type="button" v-on:click="viewPayment"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        VIEW PAYMENTS
                    </button>
                    <button type="button" v-on:click="exportDetails"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        EXPORT INFORMATION
                    </button>
                    <button type="button" v-if="buyer.status" v-on:click="forefeitBuyer"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        FOREFEIT BUYER
                    </button>
                </div> -->

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
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    // import XLSX from 'xlsx'
    import excel4node from 'excel4node'

    export default ({
        components: {
            'main-header': Header,
            'label-component': Label,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm
        },
        data() {
            return {
                buyer: {},
                payment: {},
                isFetchingData: true,
                isEditing: false,

                encoder: {},
                manager: {},
                realty: {},

                all_encoders: [],
                all_managers: [],
                all_realties: []
            }
        },
        created() {
            this.getAllEncoders()
            this.getAllManagers()
            this.getAllRealties()
            this.getDetails(this.$route.params.id)
        },
        methods: {
            assumeUnit() {
                console.log('buyer', this.buyer)
                this.$router.push({ name: 'Assume-Unit-Form',
                                    params: { buyer: this.buyer }})
                // route to input information for unit assumption
            },
            editPersonalInfo() {
                console.log('edit personal info')
                // this.isRequestingEdit = true
                // remove this to add credentials again
                this.$router.push({ name: 'Edit-Buyer-Info-LO',
                                            params: {   id: this.buyer.id,
                                                        buyer: this.buyer }})
                this.requestEditType = 1
            },
            formatDate(value) {
                return value && value.toDateString() ? value.toDateString().replace(/^\S+\s/,'') : value
            },
            formatDisplay(value) {
                return value ? value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value
            },
            viewPayment() {
                console.log('Viewing payment for buyer ', this.buyer.id)
                this.$router.push({ name: "View-Payment", params: { id: this.buyer.id, buyer: this.buyer }})
            },


            getAllEncoders() {
                ipcRenderer.send('fetchAllEncoders')
                ipcRenderer.once('fetchedAllEncoders', (event, data) => {
                    this.all_encoders = data
                })
            },
            getAllManagers() {
                ipcRenderer.send('fetchAllManagers')
                ipcRenderer.once('fetchedAllManagers', (event, data) => {
                    this.all_managers = data
                })
            },
            getAllRealties(){
                ipcRenderer.send('fetchAllRealties')
                ipcRenderer.once('fetchedAllRealties', (event, data) => {
                    this.all_realties = data
                })
            },


            getDetails(id) {
                this.isFetching = true,
                ipcRenderer.send('fetchBuyer', id)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.buyer = data
                    ipcRenderer.send('fetchLot', this.buyer.lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        this.encoder = this.all_encoders.find(encoder => encoder.id === this.buyer.encoder_id)
                        this.manager = this.all_managers.find(manager => manager.id === this.buyer.manager_id)
                        this.realty = this.all_realties.find(realty => realty.id === this.buyer.realty_id)
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
                                ipcRenderer.send('fetchLotOnlyPayment', this.buyer.id)
                                ipcRenderer.once('fetchedLotOnlyPayment', (event, data) => {
                                    this.buyer.payment = data
                                    console.log('this.buyer in VIEW DETAILS LOT ONLY BUYER', this.buyer)
                                    console.log('this.payment in VIEW DETAILS LOT ONLY PAYMENT', this.payment)
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
            confirmForefeit() {
                if(confirm('Are you sure to forefeit this buyer?')) {
                    console.log('OK')
                    this.forefeitBuyer()
                } else {
                    console.log('CANCELLED')
                }
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

                    // setTimeout(() =>{
                    //     this.$router.push('/')
                    // }, 1000)

                    this.$router.push({name: 'View-Buyer-LO', params: { id: this.buyer.id }})
                })
            },
            exportDetails() {
                console.log('exporting details')
                const raw_file_name = `${this.buyer.block.name} ${this.buyer.lot.name} - ${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                const file_name = raw_file_name.replace('/', '-')
                const homedir = require('os').homedir();

                const reservationType = this.buyer.reservation_type
                const php = ` Php `
                const buyer_name = `${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}`
                const block_name = this.buyer.block.name.replace('Block ', '')
                const project_name = `${this.buyer.project.name}`
                const lot_name = this.buyer.lot.name.replace('Lot ', '')
                const price_per_sqm = `${this.buyer.lot.price_per_sqm}`
                
                const phase = `${this.buyer.phase}`
                const lot_area = `${this.buyer.lot.lot_area} SQM.`
                const lot_type = this.buyer.lot.lot_type.toString()
                // const realty = this.buyer.realty
                
                // const agent = this.buyer.agent
                // const agent_number = this.buyer.agent_number.toString()
                // const project_address = this.buyer.project.location
                // const home_address = this.buyer.home_address
                // const email_address = this.buyer.email_address
                // const contact_number = this.buyer.contact_number

                const agent = this.buyer.agent.toUpperCase()
                const agent_number = this.buyer.agent_number.toString()
                const project_address = this.buyer.project.location.toUpperCase()
                const home_address = this.buyer.home_address.toUpperCase()
                const email_address = this.buyer.email_address.toUpperCase()
                const contact_number = this.buyer.contact_number.toString()

                const realty = this.realty.name
                const account_officer = this.encoder.name
                const approver = this.manager.name

                const reservation_date = this.formatDate(this.buyer.payment.date)
                const total_contract_price = this.buyer.payment.total_contract_price ? this.formatDisplay(this.buyer.payment.total_contract_price) : this.buyer.payment.total_contract_price
                const installment_months = this.buyer.payment.installment_months.toString()
                const monthly_installment = this.buyer.payment.monthly_installment ? this.formatDisplay(this.buyer.payment.monthly_installment) : this.buyer.payment.monthly_installment
                const reservation_fee = this.buyer.payment.reservation_fee ? this.formatDisplay(this.buyer.payment.reservation_fee) : this.buyer.payment.reservation_fee
                const spot_downpayment = this.buyer.payment.spot_downpayment ? this.formatDisplay(this.buyer.payment.spot_downpayment) : this.buyer.payment.spot_downpayment 
                const new_tcp_less_downpayment = this.buyer.payment.new_tcp_less_downpayment ? this.formatDisplay(this.buyer.payment.new_tcp_less_downpayment) : this.buyer.payment.new_tcp_less_downpayment 
                const spot_cash_discount_percentage = this.buyer.payment.spot_cash_discount_percentage
                const spot_cash_discount_amount = this.buyer.payment.spot_cash_discount_amount ? this.formatDisplay(this.buyer.payment.spot_cash_discount_amount) : this.buyer.payment.spot_cash_discount_amount
                const new_tcp_less_discount = this.buyer.payment.new_tcp_less_discount ? this.formatDisplay(this.buyer.payment.new_tcp_less_discount ) : this.buyer.payment.new_tcp_less_discount

                // const realty = this.realty.name
                // const account_officer = this.encoder.name
                // const approver = this.manager.name

                const monthly_start_date = this.formatDate(this.buyer.payment.monthly_start_date)
                const monthly_end_date = this.formatDate(this.buyer.payment.monthly_end_date)
                // const reservation_date = this.formatDate(this.buyer.payment.date)
                
                var wb = new excel4node.Workbook()
                var ws = wb.addWorksheet('RA - FORM 2A LO')

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
                const small_aligned_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: true }, alignment: { wrapText: true, horizontal: 'center', vertical: 'center' },  border: { bottom: { style: 'thin', color: '#000000' } } })  
                // const small_aligned_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: true }, alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
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
                ws.cell(r, col['I']).string(reservation_date).style(regular_style)
                
                ws.cell(++r, col['A']).string(` PROJECT NAME: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_name).style(regular_style)
                ws.cell(r, col['E']).string(` LOT: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(lot_name).style(regular_style)
                ws.cell(r, col['H']).string(` PRICE PER SQM: `).style(bold_style)
                ws.cell(r, col['I']).string(price_per_sqm).style(regular_style)

                ws.cell(++r, col['A']).string(` PHASE: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(phase).style(regular_style)
                ws.cell(r, col['E']).string(` LOT AREA: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(lot_area).style(regular_style)
                ws.cell(r, col['H']).string(` TYPE OF LOT: `).style(bold_style)
                ws.cell(r, col['I']).string(lot_type).style(regular_style)

                // ws.cell(++r, col['A']).string(` PROJECT ADDRESS: `).style(bold_style)
                // ws.cell(r, col['B'], r, col['D'], true).string(project_address).style(regular_style)
                // ws.cell(r, col['E'], r, col['F'], true).string(` HOME ADDRESS: `).style(bold_style)
                // ws.cell(r, col['G'], r, col['I'], true).string(home_address).style(regular_style)

                // ws.cell(++r, col['A']).string(` EMAIL ADDRESS: `).style(bold_style)
                // ws.cell(r, col['B'], r, col['D'], true).string(email_address).style(regular_style)
                // ws.cell(r, col['E'], r, col['F'], true).string(` CONTACT NUMBER: `).style(bold_style)
                // ws.cell(r, col['G'], r, col['I'], true).number(contact_number).style(regular_style)

                // ws.cell(++r, col['A']).string(` REALTY: `).style(bold_style)
                // ws.cell(r, col['B'], r, col['D'], true).string(realty).style(regular_style)
                // ws.cell(r, col['E'], r, col['F'], true).string(` AGENT: `).style(bold_style)
                // ws.cell(r, col['G'], r, col['I'], true).string(agent).style(regular_style)

                ws.cell(++r, col['A'], r, col['I'], true).string('')

                if(reservationType == 5) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('REGULAR RESERVATION / STRAIGHT MONTHLY').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (includes transfer fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['D'], true).string(` Monthly Installment for `).style(italic_rightaligned_style)
                    ws.cell(r, col['E']).string(installment_months).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['F']).string(` months: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(monthly_installment).style(center_bold)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` First Monthly Installment Fee / Reservation Fee: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['B'], true).string(` Monthly Installment Starts: `).style(italic_rightaligned_style)
                    ws.cell(r, col['C'], r, col['D'], true).string(monthly_start_date).style(center_bold)
                    ws.cell(++r, col['A'], r, col['B'], true).string(` Monthly Installment Ends: `).style(italic_rightaligned_style)
                    ws.cell(r, col['C'], r, col['D'], true).string(monthly_end_date).style(center_bold)
                
                } else if(reservationType == 6) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('WITH SPOT DOWNPAYMENT / ADVANCE PAYMENT').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (includes transfer fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` Spot Downpayment / Advance Downpayment: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(spot_downpayment).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` NEW TCP Less Downpayment `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(new_tcp_less_downpayment).style(center_bold)
                    
                    ws.cell(++r, col['A'], r, col['D'], true).string(` Monthly Installment for: `).style(italic_rightaligned_style)
                    ws.cell(r, col['E']).string(installment_months).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['F']).string(` months: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(monthly_installment).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['B'], true).string(` Monthly Installment Starts: `).style(italic_rightaligned_style)
                    ws.cell(r, col['C'], r, col['D'], true).string(monthly_start_date).style(center_bold)
                    ws.cell(++r, col['A'], r, col['B'], true).string(` Monthly Installment Ends: `).style(italic_rightaligned_style)
                    ws.cell(r, col['C'], r, col['D'], true).string(monthly_end_date).style(center_bold)

                } else if(reservationType == 7) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('SPOT CASH').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (includes transfer fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` Spot Cash Discount: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${spot_cash_discount_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(spot_cash_discount_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` NEW TCP Less Discount`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(new_tcp_less_discount).style(center_bold)
                } else {
                    
                }
                
                ws.cell(++r, col['A'], r, col['I'], true).string('')
                ws.cell(++r, col['A'], r, col['I'], true).string('REQUIREMENTS').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of 2 valid ID:  government issued with 3 specimen signature FOR BUYER `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of 2 valid ID:  government issued with 3 specimen signature FOR SPOUSE IF MARRIED `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` TIN number/TIN ID `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` RESERVATION FEE / First Monthly `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Marriage contract if married `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Birth Certificate `).style(italic_leftaligned_style)

                r+=2
                ws.cell(++r, col['A'], r, col['C'], true).string(`Confirmed and Accepted By Buyer:`).style(bold_style)
                ws.cell(++r, col['D'], r, col['F'], true).string(buyer_name).style(bold_style).style(small_aligned_style)
                ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                ws.cell(r, col['I']).string(contact_number).style(bold_style).style(small_aligned_style)
                
                r+=2
                ws.cell(++r, col['A'], r, col['C'], true).string(`Confirmed and Accepted By Buyer:`).style(bold_style)
                ws.cell(++r, col['D'], r, col['F'], true).string(buyer_name).style(bold_style).style(small_aligned_style)
                ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                ws.cell(r, col['I']).string(contact_number).style(bold_style).style(small_aligned_style)
                
                r+=2
                ws.cell(++r, col['A'], r, col['C'], true).string(`Broker/Agent's Name and Signature:`).style(bold_style)
                ws.cell(r, col['D'], r, col['F'], true).string(agent).style(bold_style).style(small_aligned_style)
                ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                ws.cell(r, col['I']).string(agent_number).style(bold_style).style(small_aligned_style)
                
                ws.cell(++r, col['A'], r, col['C'], true).string(`Realty Name:`).style(bold_style)
                ws.cell(r, col['D'], r, col['F'], true).string(realty).style(bold_style).style(small_aligned_style)

                r+=2
                ws.cell(++r, col['A']).string(`Account Officer:`).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(account_officer).style(bold_style).style(small_aligned_style)

                ws.cell(r, col['E'], r, col['F'], true).string(`Confirmed By:`).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(approver).style(bold_style).style(small_aligned_style)
                // ws.cell(++r, col['A'], r, col['C'], true).string(`Broker/Agent's Name and Signature:`).style(bold_style)
                // ws.cell(r, col['D'], r, col['F'], true).string(agent).style(bold_style).style(small_aligned_style)
                // ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                // ws.cell(r, col['I']).string(agent_number).style(bold_style).style(small_aligned_style)
                
                // ws.cell(++r, col['A'], r, col['C'], true).string(`Realty Name:`).style(bold_style)
                // ws.cell(r, col['D'], r, col['F'], true).string(realty).style(bold_style).style(small_aligned_style)

                // r+=2
                // ws.cell(++r, col['A']).string(`Account Officer:`).style(bold_style)
                // ws.cell(r, col['B'], r, col['D'], true).string('_____________________________________').style(bold_style).style(small_aligned_style)

                // ws.cell(r, col['E'], r, col['F'], true).string(`Confirmed By:`).style(bold_style)
                // ws.cell(r, col['G'], r, col['I'], true).string('_____________________________________').style(bold_style).style(small_aligned_style)

                // wb.write(`./${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}.xlsx`);
                switch(this.buyer.project.id) {
                    case 5: wb.write(`${homedir}/TUMABINI-PROJECTS/SAN-ISIDRO-ENCLAVE/Reservations/${file_name}.xlsx`); break;  
                    default: alert('WRONG PROJECT ID', this.buyer.project.id); break;
                }
                alert('Done Exporting')
                console.log('Done Exporting Payment for Buyer', this.buyer.id)
                // wb.write(`./outputs/buyers-list/${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}.xlsx`);
                // wb.write(`../../outputs/buyers-list/${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}.xlsx`);
            }
        }
    })
</script>