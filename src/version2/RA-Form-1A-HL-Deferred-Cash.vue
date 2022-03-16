<template>
    <div>
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> RA - FORM 1A - HL</p> </div>
            
            <div v-if="!isSubmittingData">
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                    <div class="flex px-4 gap-4">
                        <div class="w-2/5"> <input-form label="Last Name" v-model="buyer.last_name" /> </div>
                        <div class="w-2/5"> <input-form label="First Name" v-model="buyer.first_name" /> </div>
                        <div class="w-1/5"> <input-form label="M.I." v-model="buyer.middle_initial" /> </div>
                    </div>
                    <!-- <div class="full px-4"> <readonly-form label="Reservation Date" v-bind:value="payment_details.date" /> </div> -->
                    <div class="full px-4">
                        <label-component label="Reservation Date" />
                        <datepicker :typeable="true" v-model="payment_details.date" placeholder="Select Date..." class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Name" :value="unit.project_name" /> </div>
                    <div class="grid grid-cols-5 gap-2 px-4">
                        <div class="full px-1"> <readonly-form label="Block" v-bind:value="unit.block" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot" v-bind:value="unit.lot" /> </div>
                        <div class="full px-1"> <readonly-form label="Phase" v-bind:value="getPhase()" /> </div>
                        <div class="full px-1"> <input-form label="Lot Area (SQ.M)" v-model="unit.lot_area" /> </div>
                        <div class="full px-1"> <input-form label="Flr Area (SQ.M)" v-model="unit.floor_area" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Address" v-bind:value="unit.project_address" /> </div>
                    <div class="grid grid-cols-2 gap-4 px-4">
                        <div class="full">
                            <!-- <input-form label="Price/Sq.M (PHP)" v-model="unit.price_per_sqm" /> -->
                            <div class="full">
                                <label-component label="Price / SQM (PHP)" />
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        :value="formatDisplay(unit.price_per_sqm)"
                                        @change="updatePricePerSqm"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                                </div>
                                <!-- <input-form label="Price/Sq.M (PHP)" :value="formatDisplay(unit.price_per_sqm)" /> -->
                            </div>
                        </div>
                        <div class="full"> <input-form label="House Type" v-model="unit.lot_type" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Home Address" v-model="buyer.home_address" /> </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <input-form label="Contact No." v-model="buyer.contact_number" /> </div>
                        <div class="w-1/2"> <input-form label="Email Address" v-model="buyer.email_address" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Realty's Name" v-model="unit.realty_name" /> </div>
                    <!-- <div class="full px-4"> <input-form label= "Agent's Name" v-model="unit.agent_name" /> </div> -->
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <input-form label= "Agent's Name" v-model="unit.agent_name" /> </div>
                        <div class="w-1/2"> <input-form label= "Agent's Number" v-model="unit.agent_number" /> </div>
                    </div>
                </div>

                <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> DEFERRED CASH </p> </div>
                <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                    <!-- TOTAL CONTRACT PRICE -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(payment_details.total_contract_price)"
                                    @change="updateTCP"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                            </div>
                        </div> </div>
                    </div>

                    <!-- RESERVATION FEE -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(payment_details.reservation_fee)"
                                    @change="updateREF"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase">
                            </div>
                        </div> </div>
                    </div>

                    <!-- BALANCE AMONT AFTER RESERVATION -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Balance Amount after Reservation Fee: </p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <input type="text"
                                :value="formatDisplay(payment_details.balance_amount_after_reservation)"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div> </div>
                    </div>
                    
                    <!-- MONTHLY INSTALLMENT -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2 mt-1">
                            <p class="align-middle text-right text-xs font-bold">Required Monthly Equity <br/> for
                                <input type="text"
                                    v-model="payment_details.installment_months" @change="updateIM"
                                    class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                > months:
                            </p>
                        </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4">
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    :value="formatDisplay(payment_details.monthly_installment)"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div> </div>
                    </div>

                    <!-- EQUITY START AND END DATES -->
                    <div class="flex px-4 gap-4 my-2">
                        <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity (Start - End): </p></div>
                        <div class="w-1/2 grid grid-cols-2 gap-x-4">
                            <div class="w-full">
                                <datepicker :typeable="true" v-model="payment_details.equity_start_date" placeholder="Start Date" class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                            </div>
                            <div class="w-full">
                                <datepicker :typeable="true" v-model="payment_details.equity_end_date" placeholder="End Date" class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                            </div>
                            <!-- <vue-date-picker class="border border-white" minDate="2000-01-01" @confirm="upDate($event)"/> -->
                        </div>
                    </div>

                    <div class="flex items-center my-4">
                        <button
                            type="button"
                            v-on:click="submitForm()"
                            class="bg-gray-600 py-4 mx-auto w-1/4 align-middle text-white font-bold border rounded-md">
                            SUBMIT RESERVATION
                        </button>
                    </div>
                </div>
            </div>
            
            <div v-if="isSubmittingData" class="text-center mx-auto my-4 font-semibold text-lg">
                SUBMITTING DATA...
            </div>
        </div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import InputForm from '../components/v2/InputForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import Label from '../components/v2/Label'
    import Datepicker from 'vuejs-datepicker'
    // import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'

    export default({
        components: {
            'main-header': Header,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm,
            'label-component': Label,
            'datepicker': Datepicker,
            // 'vue-date-picker': VueHotelDatepicker
        },
        data() {
            return {
                isSubmittingData: false,
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
                    project_id: this.$store.state.unit.project.project_id,
                    block: this.$store.state.unit.block.block_name,
                    lot: this.$store.state.unit.lot.lot_name,
                    lot_id: this.$store.state.unit.lot.lot_id,
                    phase: '',
                    project_address: this.$store.state.unit.project.project_location,
                    price_per_sqm: '',
                    realty_name: '',
                    agent_name: '',
                    agent_number: '',
                    floor_area: '',
                    lot_area: '',
                    lot_type: ''
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
        created() {
            let today = new Date()
            this.payment_details.date = today
            return this.payment_details.date
        },
        methods: {
            formatDisplay(value) {
               return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value
            },
            formatDecimal(value) {
                return value ? value.toFixed(2) : value
            },
            formatParsedFloat(value) {
                return value ? parseFloat(value.replace(/,/g, '')).toFixed(2) : value
            },
            upDate(event) {
                console.log('Updating dates', event)
                this.payment_details.equity_start_date = event.start
                this.payment_details.equity_end_date = event.end
                console.log('Updated dates', this.payment_details)
            },
            updatePricePerSqm(event) {
                this.unit.price_per_sqm = event.target.value
            },
            updateTCP(event) {
                this.payment_details.total_contract_price = event.target.value
                console.log('UpdateTCP', this.payment_details.total_contract_price)
                this.updateCalculations()
            },
            updateREF(event) {
                this.payment_details.reservation_fee = event.target.value
                console.log('UpdateREF', this.payment_details.reservation_fee)
                this.updateCalculations()
            },
            updateIM(event) {
                this.payment_details.installment_months = event.target.value
                console.log('updateIM', this.payment_details.installment_months)
                this.updateCalculations()
            },
            updateCalculations() {
                const formatted_total_contract_price = this.formatParsedFloat(this.payment_details.total_contract_price)
                const formatted_reservation_fee = this.formatParsedFloat(this.payment_details.reservation_fee)

                this.payment_details.balance_amount_after_reservation = this.formatDecimal(formatted_total_contract_price - formatted_reservation_fee)
                this.payment_details.monthly_installment = this.payment_details.installment_months ? this.formatDecimal((this.payment_details.balance_amount_after_reservation / this.payment_details.installment_months)) : 0
            },
            getPhase() {
                return  this.$store.state.unit.phase.phase_name &&
                        this.$store.state.unit.phase.phase_id ?
                        this.$store.state.unit.phase.phase_name : 'N/A'
            },
            submitForm() {
                this.isSubmittingData = true
                this.payment_details.total_contract_price = this.formatParsedFloat(this.payment_details.total_contract_price)
                this.payment_details.reservation_fee = this.formatParsedFloat(this.payment_details.reservation_fee)

                const dataToSubmit = {  buyer: this.buyer,
                                        unit: this.unit,
                                        payment_details: this.payment_details }
                console.log('UNIT', this.unit)
                ipcRenderer.send('addHouseAndLotBuyer', dataToSubmit)
                ipcRenderer.once('addedHouseAndLotBuyer', (event, data) => {
                    console.log('addedHouseAndLotBuyer', data)
                    if(data.response == 1) {
                        console.log('Add H&L Buyer SUCCESSFUL')
                        this.autoExport()

                        // add loading screen
                        // setTimeout(() => {
                            // this.$router.push('/')
                            this.$router.push({name: 'View-Buyer-HL', params: { id: data.new_id }})
                        // }, 2000)
                    } else {
                        alert('Add H&L Buyer error')
                        console.log('Add H&L Buyer error')
                    }
                    this.isFetchingData = false
                })
            },
            autoExport() {
                console.log('Auto Export after Adding Buyer, H&L Deferred Cash', this.payment_details)
                const homedir = require('os').homedir();

                const buyer_name = `${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                const file_name = `${this.unit.block} ${this.unit.lot} - ${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                // const file_name = `${this.unit.project_name.toUpperCase()} - ${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                const home_address = this.buyer.home_address.toUpperCase()
                const email_address = this.buyer.email_address.toUpperCase()
                const contact_number = this.buyer.contact_number.toUpperCase()

                const block_name = this.unit.block.toUpperCase()
                const project_name = this.unit.project_name.toUpperCase()
                const lot_name = this.unit.lot.toUpperCase()
                const price_per_sqm = this.unit.price_per_sqm.toUpperCase()
                const phase = this.unit.phase.toUpperCase()
                const lot_area = this.unit.lot_area.toUpperCase()
                const floor_area = this.unit.floor_area.toUpperCase()
                const lot_type = this.unit.lot_type.toUpperCase()
                const realty = this.unit.realty_name.toUpperCase()
                const agent = this.unit.agent_name.toUpperCase()
                const agent_number = this.unit.agent_number.toUpperCase()
                const project_address = this.unit.project_address.toUpperCase()
                

                const reservation_date = this.payment_details.date.toString()
                const total_contract_price = this.formatDisplay(this.payment_details.total_contract_price.toString())
                const balance_amount_after_reservation = this.formatDisplay(this.payment_details.balance_amount_after_reservation.toString())
                const installment_months = this.payment_details.installment_months.toString()
                const monthly_installment = this.formatDisplay(this.payment_details.monthly_installment.toString())
                const reservation_fee = this.formatDisplay(this.payment_details.reservation_fee.toString())
                const equity_start_date = this.payment_details.equity_start_date.toString()
                const equity_end_date = this.payment_details.equity_end_date.toString()

                const php = 'PHP'

                var xl = require('excel4node');
                var wb = new xl.Workbook();
                const ws = wb.addWorksheet('RA-Form 2A-LO Deferred Cash');

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
                ws.cell(r, col['I']).string(reservation_date).style(regular_style)

                ws.cell(++r, col['A']).string(` PROJECT NAME: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_name).style(regular_style)
                ws.cell(r, col['E']).string(` LOT: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(lot_name).style(regular_style)
                ws.cell(r, col['H']).string(` PRICE PER SQ.M: `).style(bold_style)
                ws.cell(r, col['I']).string(price_per_sqm).style(regular_style)

                // ws.cell(++r, col['A']).string(` PHASE: `).style(bold_style)
                // ws.cell(r, col['B'], r, col['D'], true).string(phase).style(regular_style)
                // ws.cell(r, col['E']).string(` LOT AREA: `).style(bold_style)
                // ws.cell(r, col['F'], r, col['G'], true).string(lot_area).style(regular_style)
                // ws.cell(r, col['H']).string(` TYPE OF LOT: `).style(bold_style)
                // ws.cell(r, col['I']).string(lot_type).style(regular_style)

                ws.cell(++r, col['A']).string(` PHASE: `).style(bold_style)
                ws.cell(r, col['B']).string(phase).style(regular_style)
                ws.cell(r, col['C']).string(` LOT AREA: `).style(bold_style)
                ws.cell(r, col['D']).string(lot_area).style(regular_style)
                ws.cell(r, col['E']).string(` FLR AREA: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(floor_area).style(regular_style)
                ws.cell(r, col['H']).string(` HOUSE TYPE: `).style(bold_style)
                ws.cell(r, col['I']).string(lot_type).style(regular_style)

                ws.cell(++r, col['A']).string(` PROJECT ADDRESS: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_address).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` HOME ADDRESS: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(home_address).style(regular_style)

                ws.cell(++r, col['A']).string(` EMAIL ADDRESS: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(email_address).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` CONTACT NUMBER: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(contact_number).style(regular_style)

                ws.cell(++r, col['A']).string(` REALTY: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(realty).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` AGENT: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(agent).style(regular_style)

                ws.cell(++r, col['A'], r, col['I'], true).string('')

                ws.cell(++r, col['A'], r, col['I'], true).string('DEFERRED CASH').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['A'], r, col['I'], true).string('')

                ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (includes transfer charges and move-in fee): `).style(italic_rightaligned_style)
                ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                ws.cell(r, col['H'], r, col['I'], true).string(total_contract_price).style(center_bold)

                ws.cell(++r, col['A'], r, col['F'], true).string(` Reservation Fee: `).style(italic_rightaligned_style)
                ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                ws.cell(r, col['H'], r, col['I'], true).string(reservation_fee).style(center_bold)

                ws.cell(++r, col['A'], r, col['F'], true).string(` Balance Amount After Reservation Fee: `).style(italic_rightaligned_style)
                ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                ws.cell(r, col['H'], r, col['I'], true).string(balance_amount_after_reservation).style(center_bold)
                // console.log('balance_amount_after_reservation', balance_amount_after_reservation)

                ws.cell(++r, col['A'], r, col['C'], true).string(` Balance Amount After Reservation Fee is payable in: `).style(italic_rightaligned_style)
                ws.cell(r, col['D']).string(installment_months).style(center_bold)
                ws.cell(r, col['E'], r, col['F'], true).string(php).string('months').style(italic_rightaligned_style)

                ws.cell(++r, col['A'], r, col['F'], true).string(` Monthly Installment Amount: `).style(italic_rightaligned_style)
                ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                ws.cell(r, col['H'], r, col['I'], true).string(monthly_installment).style(center_bold)
                ws.cell(++r, col['A'], r, col['I'], true).string('')

                ws.cell(++r, col['A'], r, col['I'], true).string('')
                ws.cell(++r, col['A'], r, col['C'], true).string(` Monthly Installment Starts (YYYY - MM - DD) :`).style(italic_rightaligned_style)
                ws.cell(r, col['D'], r, col['F'], true).string(equity_start_date).style(italic_leftaligned_style)
                ws.cell(++r, col['A'], r, col['C'], true).string(` Monthly Installment Ends: (YYYY - MM - DD) :`).style(italic_rightaligned_style)
                ws.cell(r, col['D'], r, col['F'], true).string(equity_end_date).style(italic_leftaligned_style)

                
                ws.cell(++r, col['A'], r, col['I'], true).string('')
                ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the first monthly equity after 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                ws.cell(++r, col['A'], r, col['I'], true).string(` 2. The balance amount shall be loanable to bank / PAG-IBIG financinng.`).style(italic_leftaligned_style)
                ws.cell(++r, col['A'], r, col['I'], true).string(` 3. For cash payment of balance amount, it shall be paid on or before 30 days after last payment of monthly equity.`).style(italic_leftaligned_style)

                ws.cell(++r, col['A'], r, col['I'], true).string('Sample Computation for Bank/Pag-ibig Financing').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['A'], r, col['I'], true).string(`Sample Computation at 6.00% annual interest rate`).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['C'], true).string(`5 years`).style(italic_leftaligned_style)
                ws.cell(r, col['D'], r, col['E'], true).string(`${monthly_installment} / month`).style(italic_leftaligned_style) 

                ws.cell(++r, col['A'], r, col['I'], true).string('')
                ws.cell(++r, col['A'], r, col['I'], true).string('REQUIREMENTS').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['A'], r, col['B'], true).string('Upon Reservation:').style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` 2 Valid IDs government issued with 3 speciment signature`).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` TIN number/TIN ID `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` RESERVATION FEE / First Monthly `).style(italic_leftaligned_style)
                
                ws.cell(++r, col['A'], r, col['B'], true).string('FOR PAG-IBIG/BANK LOAN').style(italic_leftaligned_style)
                ws.cell(r, col['C'], r, col['I'], true).string("to be given upon developer's request (more or less 5 monts before EQUITY ENDS)").style(italic_leftaligned_style)
                
                ws.cell(++r, col['B'], r, col['I'], true).string(` Certificate of Employment with stated gross income `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Latest 3 months payslip signed by HR or Compensation Personnel `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` 4 pcs 2x2 ID picture `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Marriage Certificate if married `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Birth Certificate `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Proof Of Billing`).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Post dated Check (if Pag-ibig will request) and or needed if opt for IN-HOUSE FINANCING `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Others as may be required by bank/Pag-ibig`).style(italic_leftaligned_style)
                
                r+=2
                ws.cell(++r, col['A'], r, col['C'], true).string(`Confirmed and Accepted By Buyer:`).style(bold_style)
                ws.cell(++r, col['D'], r, col['F'], true).string(buyer_name).style(bold_style).style(aligned_style)
                ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                ws.cell(r, col['I']).string(contact_number).style(bold_style).style(aligned_style)
                
                r+=2
                ws.cell(++r, col['A'], r, col['C'], true).string(`Broker/Agent's Name and Signature:`).style(bold_style)
                ws.cell(r, col['D'], r, col['F'], true).string(agent).style(bold_style).style(aligned_style)
                ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                ws.cell(r, col['I']).string(agent_number).style(bold_style).style(aligned_style)
                
                ws.cell(++r, col['A'], r, col['C'], true).string(`Realty Name:`).style(bold_style)
                ws.cell(r, col['D'], r, col['F'], true).string(realty).style(bold_style).style(aligned_style)

                r+=2
                ws.cell(++r, col['A']).string(`Account Officer:`).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string('_____________________________________').style(bold_style).style(aligned_style)

                ws.cell(r, col['E'], r, col['F'], true).string(`Confirmed By:`).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string('_____________________________________').style(bold_style).style(aligned_style)


                switch(this.unit.project_id) {
                    case 1:
                        console.log('unit project MYHOME')
                        wb.write(`${homedir}/TUMABINI-PROJECTS/MYHOME/Reservations/${file_name}.xlsx`); break;
                    case 2:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/MYHOME-DOS/Reservations/${file_name}.xlsx`); break;
                    case 3:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/GREGORY-HOMES/Reservations/${file_name}.xlsx`); break;
                    case 4:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/LAURENCE-VILLE/Reservations/${file_name}.xlsx`); break;
                    case 6:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/FATIMA-HEIGHTS/Reservations/${phase}-${file_name}.xlsx`); break;
                    default: break;
                }

                // to change destination path
                // wb.write(`./${file_name}.xlsx`);

                // wb.write(`./outputs/${buyer_name}.xlsx`);
                console.log('Done Autoexporting', file_name)
            }
        }
    })
</script>