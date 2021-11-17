<template>
    <div>
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> RA - FORM 2A - LO</p> </div>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                <div class="flex px-4 gap-4">
                    <div class="w-2/5"> <input-form label="Last Name" v-model="buyer.last_name" /> </div>
                    <div class="w-2/5"> <input-form label="First Name" v-model="buyer.first_name" /> </div>
                    <div class="w-1/5"> <input-form label="M.I." v-model="buyer.middle_initial" /> </div>
                </div>
                <!-- <div class="full px-4"> <readonly-form label="Reservation Date" v-bind:value="payment_details.date" /> </div> -->
                <div class="full px-4">
                    <label-component label="Select Date" />
                    <datepicker v-model="payment_details.date" placeholder="Select Date..." class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                </div>
                <div class="full px-4"> <readonly-form label="Project Name" :value="unit.project_name" /> </div>
                <div class="grid grid-cols-4 gap-4 px-4">
                    <div class="full px-1"> <readonly-form label="Block" v-bind:value="unit.block" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot" v-bind:value="unit.lot" /> </div>
                    <div class="full px-1"> <readonly-form label="Phase" v-bind:value="getPhase()" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot Area" v-bind:value="unit.lot_area" /> </div>
                </div>
                <div class="full px-4"> <readonly-form label="Project Address" v-bind:value="unit.project_address" /> </div>
                <div class="grid grid-cols-2 gap-4 px-4">
                    <div class="full"> <input-form label="Price/Sq.M (PHP)" v-model="unit.price_per_sqm" /> </div>
                    <div class="full"> <input-form label="Lot Type" v-model="unit.lot_type" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Home Address" v-model="buyer.home_address" /> </div>
                <div class="flex px-4 gap-4">
                    <div class="w-1/2"> <input-form label="Contact No." v-model="buyer.contact_number" /> </div>
                    <div class="w-1/2"> <input-form label="Email Address" v-model="buyer.email_address" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Realty's Name" v-model="unit.realty_name" /> </div>
                <div class="full px-4"> <input-form label="Agent's Name" v-model="unit.agent_name" /> </div>
            </div>

            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> SPOT CASH </p> </div>
            <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
               <!-- TOTAL CONTRACT PRICE  -->
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="numbers"
                                :value="formatDisplay(payment_details.total_contract_price)"
                                @change="updateTCP"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase"></div>
                        </div>
                    </div>
                </div>
                
                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2">
                        <p class="align-middle text-right text-xs font-bold">SPOT CASH Discount <br />
                            <input type="text"
                                v-model="payment_details.spot_cash_discount_percentage" @change="updateSCDPercentage"
                                class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                            > %:
                        </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <!-- <input-form v-model="payment_details.spot_cash_discount_amount" /> -->
                        <input type="text"
                            :value="formatDisplay(payment_details.spot_cash_discount_amount)"
                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                            readonly disabled>
                    </div> </div>
                </div>

                <div class="flex px-4 gap-4 my-2">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">NEW TCP Less Discount</p> </div>
                    <div class="w-3/4"> <div class="items-starts w-3/4">
                        <!-- <input-form v-model="payment_details.new_tcp_less_discount" /> -->
                        <input type="text"
                            :value="formatDisplay(payment_details.new_tcp_less_discount)"
                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                            readonly disabled>
                    </div> </div>
                </div>
            </div>

            <div class="flex items-center">
                <button
                    type="button"
                    v-on:click="submitForm()"
                    class="bg-gray-600 py-4 mx-auto w-1/4 align-middle text-white font-bold border rounded-md">
                    SUBMIT RESERVATION
                </button>
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
    import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker'

    export default({
        components: {
            'main-header': Header,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm,
            'vue-date-picker': VueHotelDatepicker,
            'label-component': Label,
            'datepicker': Datepicker
        },
        data() {
            return {
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
                    lot_area: `${this.$store.state.unit.unit_details.lot_area} SQ. M`,
                    lot_type: '',
                },
                payment_details: {
                    date: '',
                    total_contract_price: '',
                    installment_months: '',
                    monthly_installment: '',
                    reservation_fee: '',
                    reservation_type: 7,
                    spot_cash_discount_percentage: '',
                    spot_cash_discount_amount: '',
                    new_tcp_less_discount: '',
                    monthly_start_date: '',
                    monthly_end_date: ''
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
               return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            formatDecimal(value) {
                return value.toFixed(2)
            },
            formatParsedFloat(value) {
                return parseFloat(value.replace(/,/g, '')).toFixed(2)
            },
            updateTCP(event) {
                this.payment_details.total_contract_price = event.target.value
                console.log('UpdateTCP', this.payment_details.total_contract_price)
                this.updateCalculations()
            },
            updateSCDPercentage(event) {
                this.payment_details.spot_cash_discount_percentage = event.target.value
                console.log('UpdateSCDPercentage', this.payment_details.spot_cash_discount_percentage)
                this.updateCalculations()
            },
            updateCalculations() {
                const formatted_total_contract_price = this.formatParsedFloat(this.payment_details.total_contract_price)

                this.payment_details.spot_cash_discount_amount = this.formatDecimal(formatted_total_contract_price * (this.payment_details.spot_cash_discount_percentage * 0.01))
                this.payment_details.new_tcp_less_discount = this.formatDecimal(formatted_total_contract_price - this.payment_details.spot_cash_discount_amount)
                this.payment_details.monthly_installment = this.payment_details.installment_months
                                    ? this.formatDecimal(this.payment_details.new_tcp_less_discount / this.payment_details.installment_months) : 0
            },
            getPhase() {
                return  this.$store.state.unit.phase.phase_name &&
                        this.$store.state.unit.phase.phase_id ?
                        this.$store.state.unit.phase.phase_name : 'N/A'
            },
            submitForm() {

                // insert error validation here
                // user should only click here once
                // add loading screen

                const dataToSubmit = {  buyer: this.buyer,
                                        unit: this.unit,
                                        payment_details: this.payment_details }
                console.log({dataToSubmit})
                ipcRenderer.send('addLotOnlyBuyer', dataToSubmit)
                ipcRenderer.once('addedLotOnlyBuyer', (event, data) => {
                    console.log('addedLotOnlyBuyer', data)
                    if(data == 1) {
                        console.log('Add Buyer SUCCESSFUL')
                        this.autoExport()
                        // add loading screen
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 2000)
                    } else {
                        console.log('Add Lot only buyer error')
                    }
                    console.log('this.payment in VIEW DETAILS LOT ONLY PAYMENT', this.payment)
                    this.isFetchingData = false
                })
            },
            autoExport() {
                console.log('AutoExport after Adding Buyer, LO - Spot Cash')
                const buyer_name = `${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                const file_name = `${this.unit.project_name.toUpperCase()} - ${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                const home_address = this.buyer.home_address.toUpperCase()
                const email_address = this.buyer.email_address.toUpperCase()
                const contact_number = this.buyer.contact_number.toUpperCase()

                const block_name = this.unit.block.toUpperCase()
                const project_name = this.unit.project_name.toUpperCase()
                const lot_name = this.unit.lot.toUpperCase()
                const price_per_sqm = this.unit.price_per_sqm.toUpperCase()
                const phase = this.unit.phase.toUpperCase()
                const lot_area = this.unit.lot_area.toUpperCase()
                const lot_type = this.unit.lot_type.toUpperCase()
                const realty = this.unit.realty_name.toUpperCase()
                const agent = this.unit.agent_name.toUpperCase()
                const project_address = this.unit.project_address.toUpperCase()

                const reservation_date = this.payment_details.date.toString()
                const total_contract_price = this.payment_details.total_contract_price.toString()
                const spot_cash_discount_percentage = this.payment_details.spot_cash_discount_percentage.toString()
                const spot_cash_discount_amount = this.payment_details.spot_cash_discount_amount.toString()
                const new_tcp_less_discount = this.payment_details.new_tcp_less_discount.toString()

                const php = 'PHP'

                var xl = require('excel4node');
                var wb = new xl.Workbook();
                const ws = wb.addWorksheet('RA-Form 2A-LO Spot Cash');

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
                ws.cell(r, col['I']).date(reservation_date).style(regular_style)

                ws.cell(++r, col['A']).string(` PROJECT NAME: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_name).style(regular_style)
                ws.cell(r, col['E']).string(` LOT: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(lot_name).style(regular_style)
                ws.cell(r, col['H']).string(` PRICE PER SQ.M: `).style(bold_style)
                ws.cell(r, col['I']).string(price_per_sqm).style(regular_style)

                ws.cell(++r, col['A']).string(` PHASE: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(phase).style(regular_style)
                ws.cell(r, col['E']).string(` LOT AREA: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(lot_area).style(regular_style)
                ws.cell(r, col['H']).string(` TYPE OF LOT: `).style(bold_style)
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

                ws.cell(++r, col['A'], r, col['I'], true).string('')
                ws.cell(++r, col['A'], r, col['I'], true).string('REQUIREMENTS').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of 2 valid ID:  government issued with 3 specimen signature FOR BUYER `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of 2 valid ID:  government issued with 3 specimen signature FOR SPOUSE IF MARRIED `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` TIN number/TIN ID `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` RESERVATION FEE / First Monthly `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Marriage contract if married `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Birth Certificate `).style(italic_leftaligned_style)

                // to change destination path
                wb.write(`./${file_name}.xlsx`);
                // wb.write(`./outputs/${buyer_name}.xlsx`);
                console.log('Done Autoexporting', file_name)
            }
        }
    })
</script>