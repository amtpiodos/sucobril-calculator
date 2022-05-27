<template>
    <!-- <div class="h-screen"> -->

    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24 px-5 flex">
            <div class="w-1/2">
                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
            </div>
            <div class="w-1/2">
                <div class="text-xs">
                    <p class="text-right"> Contact No. / Landline: (032) 260-1522 </p> 
                    <p class="text-right"> Email: tumabinidevelopment@gmail.com </p>
                </div>
            </div>
        </div>
        <div class="my-2 mx-24">
            <div class="flex">
                <div class="w-2/6 flex">
                    <input class="align-center w-3/5 bg-white border-2 border-light-blue-500
                            border-opacity-100 rounded-md px-3 py-2 mr-4"
                            v-on:keyup.delete="searchFilterBuyer($event)" v-on:keypress="searchFilterBuyer($event)" placeholder="SEARCH BUYER..."/>

                    <!-- <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                    <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    <div class="text-xs"> Contact: (032) 260-1522  Email: tumabinidevelopment@gmail.com </div> -->
                </div>
                <div class="w-2/6 flex items-right justify-right gap-2">
                    <select v-model="project_id" @change="filterProject($event)" placeholder="Select Project" class="px-2 w-full border-2 border-gray-400 rounded-md my-1">
                        <option class="" value="" disabled selected><p class="text-gray-300">Filter Project...</p></option>
                        <option value=1>MyHome </option>
                        <option value=2>MyHome Dos</option>
                        <option value=3>Gregory Homes</option>
                        <option value=4>Laurence Ville</option>
                        <option value=5>San Isidro Enclave</option>
                        <option value=6>Fatima Heights</option>
                    </select>

                    <select v-model="status" @change="filterStatus($event)" class="px-2 w-full border-2 border-gray-400 rounded-md my-1">
                        <option class="" value="" disabled selected><p class="text-gray-300">Select Status...</p></option>
                        <option value=1>Active</option>
                        <option value=0>Inactive</option>
                    </select>
                </div>

                <div class="w-1/6 flex items-center my-1 " v-if="!isExportingDetails">
                    <button type="button" v-on:click="exportData(1)"
                        class="bg-gray-500 mx-2 p-4 w-full items-center align-center text-white text-sm font-regular border rounded-md">
                        EXPORT MASTERLIST
                    </button>
                </div>
                <div class="w-1/6 flex items-center my-1 " v-else>
                    <button type="button"
                        class="bg-gray-200 mx-2 p-4 w-full items-center align-center text-white text-sm font-regular border rounded-md">
                        Exporting...
                    </button> 
                </div>

                <div class="w-1/6 flex items-center my-1 ">
                    <button type="button" v-if="!isExportingDetails" v-on:click="exportData(2)"
                        class="bg-gray-500 mx-2 p-4 w-full items-center align-center text-white text-sm font-regular border rounded-md">
                        EXPORT PAYMENTS
                    </button>
                    <button type="button" v-else
                        class="bg-gray-200 mx-2 p-4 w-full items-center align-center text-white text-sm font-regular border rounded-md">
                        Exporting...
                    </button> 
                </div>

            </div>
            <div class="flex my-4">
                <div class="w-1/4 h-96">
                    <!-- <div class="bg-white space-y-3 overflow-y-auto h-1/2"> -->
                    <div class="bg-white space-y-3 overflow-y-auto h-full">
                        <!-- <input class=" w-full bg-white border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2"
                            @change="searchFilterBuyer($event)" placeholder="SEARCH BUYER..."/> -->

                        <div v-for="buyer in filtered_buyers" :key="buyer.id">
                            <single-buyer v-bind:lastname="buyer.last_name"
                                        :firstname="buyer.first_name"
                                        :middle_initial="buyer.middle_initial"
                                        v-on:click.native="hasClicked(buyer.id)"/>
                                        <!-- {{ buyer.first_name}} -->
                        </div>
                    </div>
                </div>

                <div class="h-96 w-3/4 bg-white items-center content-center space-y-3">
                    <div class="mx-auto h-full content-center grid grid-cols-1 space-y-6" v-if="!isExportingDetails">
                        <div v-if="!hasClickedBuyer">
                            <p class="text-xl leading-tight font-bold text-center mx-4"> Buyer's Information </p>
                            <p class="text-center align-center"> CLICK ON A BUYER TO VIEW BUYER DETAILS </p>
                        </div>
                        <div class="my-5 mx-5 px-5" v-else-if="hasClickedBuyer && !isFetchingDetails">
                            <div class="my-32">
                                <p class="my-2 text-center align-center font-semibold uppercase text-xl"> {{ buyer_details.last_name }}, {{ buyer_details.first_name }} {{ buyer_details.middle_initial }} </p>
                                <!-- <p class="my-2 text-center align-center font-regular uppercase text-md"> {{ buyer_details.home_address }} </p> -->
                                <p class="my-2 text-center align-center font-regular uppercase text-md"> {{ unit_details }} </p>
                                <p class="my-2 text-center align-center font-bold uppercase text-sm" v-if="buyer_details.status"> Status: Active</p>
                                <p class="my-2 text-center align-center font-bold uppercase text-sm text-red-500" v-else> Status: Inactive </p>
                            </div>
                            <div class="flex items-center mx-auto justify-center gap-4 mt-36">
                                <button
                                    v-on:click="viewFullDetails"
                                    type="button"
                                    class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md">
                                    VIEW FULL DETAILS
                                </button>
                                <!-- <button
                                    v-on:click="viewFullDetails"
                                    type="button"
                                    class="bg-gray-600 py-4 w-1/4 align-middle text-white font-bold border rounded-md">
                                   EXPORT FULL DETAILS
                                </button> -->
                            </div>
                        </div>
                        <div class="my-5 mx-5 px-5" v-else-if="hasClickedBuyer && isFetchingDetails">
                            <div class="my-32">
                                <p class="my-2 text-center align-center font-semibold uppercase text-xl"> LOADING DETAILS... </p>
                        
                            </div>
                        </div>
                    </div>
                    <div class="mx-auto h-full content-center grid grid-cols-1 space-y-6" v-else>
                            <p class="text-xl leading-tight font-bold text-center mx-4"> EXPORTING DATA...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import SingleBuyer from '../components/v2/SingleBuyer'
    import ReadOnlyInput from '../components/v2/ReadonlyInput.vue'
    import Label from '../components/v2/Label.vue'
    import Excel from 'exceljs'
    import { saveAs } from 'file-saver'

    export default ({
        components: {
            'main-header': Header,
            'single-buyer': SingleBuyer,
            'readonly-input': ReadOnlyInput,
            'label-component': Label
        },
        data() {
            return {
                project_id: '',
                status: 1, // active
                hasClickedBuyer: false,
                buyers: [],
                filtered_buyers: [],
                toExportBuyers: [],
                id: 0,
                isFetchingData: false,
                isFetchingDetails: false,
                isExportingDetails: false,
                
                buyer_to_export: {},
                all_buyers: {},
                all_payments: {},
                all_projects: {},
                all_phases: {},
                all_blocks: {},
                all_lots: {},
                all_reservations: {},
                all_lo_reservations: {},
                all_hl_reservations: {},

                unitToExport: {},
                paymentToExport: {},

                buyer_details: {},
                reservation_details: {},
                block_details: {},
                lot_details: {},
                phase_details: {},
                project_details: {},
                unit_details: ''
            }
        },
        mounted() {
            this.hasClickedBuyer = false
            // console.log('hasClickedBuyer', this.hasClickedBuyer)
        },
        created() {
            // console.log('HOME - created')
            this.fetchAllBuyers()
            this.fetchAllProjects()
            this.fetchAllPhases()
            this.fetchAllBlocks()
            this.fetchAllLots()
            this.fetchAllHLReservations()
            this.fetchAllLotOnlyReservations()
            this.fetchAllPayments()
            // fetchAllPayments
        },
        methods: {
            fetchAllPayments() {
                console.log('fetchAllPayments')
                ipcRenderer.send('fetchAllPayments')
                ipcRenderer.once('fetchedAllPayments', (event, data) => {
                    this.all_payments = data
                })
            },

            fetchAllProjects() {
                console.log('fetchProjectsList')
                ipcRenderer.send('fetchProjectsList')
                ipcRenderer.once('fetchedProjectsList', (event, data) => {
                    this.all_projects = data
                })
            },

            fetchAllBlocks() {
                console.log('fetchAllBlocks')
                ipcRenderer.send('fetchAllBlocks')
                ipcRenderer.once('fetchedAllBlocks', (event, data) => {
                    this.all_blocks = data
                })
            },

            fetchAllLots() {
                console.log('fetchAllLots')
                ipcRenderer.send('fetchAllLots')
                ipcRenderer.once('fetchedAllLots', (event, data) => {
                    this.all_lots = data
                })
            },

            fetchAllPhases() {
                console.log('fetchAllPhases')
                ipcRenderer.send('fetchAllPhases')
                ipcRenderer.once('fetchedAllPhases', (event, data) => {
                    this.all_phases = data
                })
            },

            fetchAllLotOnlyReservations() {
                console.log('fetchAllLotOnlyReservations')
                ipcRenderer.send('fetchAllLotOnlyReservations')
                ipcRenderer.once('fetchedAllLotOnlyReservations', (event, data) => {
                    this.all_lo_reservations = data
                    console.log('fetch all LO', this.all_lo_reservations)
                })
            },

            fetchAllHLReservations() {
                console.log('fetchAllHLReservations')
                ipcRenderer.send('fetchAllHLReservations')
                ipcRenderer.once('fetchedAllHLReservations', (event, data) => {
                    this.all_hl_reservations = data
                    console.log('fetch all HL', this.all_hl_reservations)
                })
            },
            
            fetchUnitDetails(buyer) {
                // const specific_lot = this.all_lots.find(lot => lot.id === buyer_details.lot_id)
                // const specific_block = this.all_blocks.find(block => block.id === specific_lot.block_id)
                // // const specific_project = this.all_projects.find(project => project.id === buyer_details.project_id)
                // // const specific_phase = buyer.details.project_id === 4
                // //     ? this.all_phases.find(phase => phase.id === specific_block.phase_id).name : ''
                // // return `${specific_lot.name}
                // return specific_lot
                this.isFetchingDetails = true

                ipcRenderer.send('fetchBuyer', buyer)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.buyer_details = data
                    ipcRenderer.send('fetchLot', data.lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        this.lot_details = data
                        ipcRenderer.send('fetchBlock', data.block_id)
                        ipcRenderer.once('fetchedBlock', (event, data) => {
                            this.block_details = data
                            console.log('block', this.block_details)
                            if(buyer.project_id == 4) {
                               ipcRenderer.send('fetchPhase', data.phase_id)
                               ipcRenderer.once('fetchedPhase', (event, data) => {
                                   this.phase_details = data
                               })
                            } else { this.phase_details = {} }
                            ipcRenderer.send('fetchProject', data.project_id)
                            ipcRenderer.once('fetchedProject', (event, data) => {
                                this.project_details = data

                                const phase_name = this.phase_details.name ? this.phase_details.name : ''
                                this.unit_details = `${this.project_details.name} ${phase_name} ${this.block_details.name} ${this.lot_details.name}`
                                
                                
                                this.isFetchingDetails = false
                                ipcRenderer.send('fetchHouseAndLotPayment', this.buyer_details.id)
                                ipcRenderer.once('fetchedHouseAndLotPayment', (event, data) => {
                                    this.reservation_details = data
                                })
                            })
                        })
                    })
                })

            },
            
            formatDate(value) {
                return value && value.toDateString() ? value.toDateString().replace(/^\S+\s/,'') : value
            },

            exportData(type) {
              // type 1 == buyers masterlist ; 2 == payment
              this.isExportingDetails = true
                console.log('this.isExporting', this.isExportingDetails)
              if(type == 1) {
                  this.exportBuyersPerProject(() => {
                      this.isExportingDetails = false
                  })
              } else if(type == 2) {
                  this.exportAllPayments(() => {
                      this.isExportingDetails = false
                  })
              } else {
                  alert('WRONG EXPORT TYPE', type)
                  this.isExportingDetails = false
              }
            },

            async exportAllPayments(callback) {
                // this.isExportingDetails = true
                
                this.isExportingDetails = true
                const wb = new Excel.Workbook()
                const ws = wb.addWorksheet('PAYMENTS MASTERLIST')
                let r = 1   // row
                const s = 4 // initial size b
                const col_letters = {   payment_date: 'A',
                                        buyer_name: 'B',
                                        unit: 'C',
                                        remarks: 'D',
                                        payment_via: 'E',
                                        transcation_code: 'F',
                                        reference_no: 'G',
                                        amount: 'H',
                                        penalty: 'I',
                                        or_ar_no: 'J',
                                    }
                const col_numbers = {   payment_date: 1,
                                        buyer_name: 2,
                                        unit: 3,
                                        remarks: 4,
                                        payment_via: 5,
                                        transcation_code: 6,
                                        reference_no: 7,
                                        amount: 8,
                                        penalty: 9,
                                        or_ar_no: 10,
                                    }
                ws.columns = [  { width: 17, alignment: { vertical: 'middle', horizontal: 'center' }},  // date
                                { width: 30, alignment: { vertical: 'middle', horizontal: 'center' }},  // buyer
                                { width: 20, alignment: { vertical: 'middle', horizontal: 'center' }},  // unit
                                { width: 30, alignment: { vertical: 'middle', horizontal: 'center' }},  // remarks
                                { width: 20, alignment: { vertical: 'middle', horizontal: 'center' }},  // payment via
                                { width: 20, alignment: { vertical: 'middle', horizontal: 'center' }},  // transaction_code
                                { width: 20, alignment: { vertical: 'middle', horizontal: 'center' }},  // reference_no
                                { width: 13, alignment: { vertical: 'middle', horizontal: 'center' }},  // amount
                                { width: 13, alignment: { vertical: 'middle', horizontal: 'center' }},  // penalty
                                { width: 15, alignment: { vertical: 'middle', horizontal: 'center' }},  // or_ar_no
                ]

                // A1:H1
                ws.mergeCells(`${col_letters.payment_date}${r}:${col_letters.reference_no}${r}`)
                ws.getCell(`${col_letters.buyer_name}${r}`).value = 'TUMABINI REAL ESTATE DEVELOPMENT';
                ws.getCell('A1').font = { name: 'Calibri', size: 11, bold: true };
                ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

                // A2:H2
                ws.mergeCells(`${col_letters.payment_date}${++r}:${col_letters.reference_no}${++r}`)
                ws.getCell(`${col_letters.buyer_name}${r}`).value = '133 MC Briones St., Hi-way Bakilid, Mandaue City 6014 Tel#: 032 414-5103, 09564791879 Email: tumabinidevelopment@gmail.com';
                ws.getCell('A2').font = { name: 'Calibri', size: 8, bold: false };
                ws.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

                // header rows
                let rowValues = []
                rowValues[col_numbers.payment_date] = 'DATE (dd/mm/yyyy)'
                rowValues[col_numbers.buyer_name] = 'NAME'
                rowValues[col_numbers.unit] = 'UNIT'
                rowValues[col_numbers.remarks] = 'REMARKS'
                rowValues[col_numbers.payment_via] = 'PAYMENT VIA'
                rowValues[col_numbers.transcation_code] = 'TRANSACTION CODE'
                rowValues[col_numbers.reference_no] = 'REFERENCE NO'
                rowValues[col_numbers.amount] = 'AMOUNT'
                rowValues[col_numbers.penalty] = 'PENALTY'
                rowValues[col_numbers.or_ar_no] = 'RECEIPT NO'

                const header_row = ws.addRow(rowValues)
                header_row.font = { name: 'Calibri', size: 9, bold: true };
                header_row.alignment = { vertical: 'middle', horizontal: 'center' };

                // ws.addRow(rowValues)
                r = r+2
                
                this.all_payments.forEach(payment => {
                    this.getBuyerDetails(payment.buyer_id, () => {
                        this.getUnitWithProjectDetails(this.buyer_to_export.lot_id, () => {

                            ws.getCell(`${col_letters.payment_date}${r}`).value = payment.payment_date;
                            ws.getCell(`${col_letters.payment_date}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.payment_date}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                            ws.getCell(`${col_letters.buyer_name}${r}`).value = this.buyer_to_export.name;
                            ws.getCell(`${col_letters.buyer_name}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.buyer_name}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                            ws.getCell(`${col_letters.unit}${r}`).value = this.unitToExport;
                            ws.getCell(`${col_letters.unit}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.unit}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                            ws.getCell(`${col_letters.remarks}${r}`).value = payment.remarks;
                            ws.getCell(`${col_letters.remarks}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.remarks}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            
                            ws.getCell(`${col_letters.payment_via}${r}`).value = payment.payment_via;
                            ws.getCell(`${col_letters.payment_via}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.payment_via}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            
                            ws.getCell(`${col_letters.transcation_code}${r}`).value = payment.transcation_code;
                            ws.getCell(`${col_letters.transcation_code}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.transcation_code}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            
                            ws.getCell(`${col_letters.reference_no}${r}`).value = payment.reference_no;
                            ws.getCell(`${col_letters.reference_no}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.reference_no}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            
                            ws.getCell(`${col_letters.amount}${r}`).value = this.formatDisplay(payment.amount);
                            ws.getCell(`${col_letters.amount}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.amount}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };
                            
                            ws.getCell(`${col_letters.penalty}${r}`).value = this.formatDisplay(payment.penalty);
                            ws.getCell(`${col_letters.penalty}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.penalty}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                            ws.getCell(`${col_letters.or_ar_no}${r}`).value = payment.or_ar_no;
                            ws.getCell(`${col_letters.or_ar_no}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                            ws.getCell(`${col_letters.or_ar_no}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                            r++
                        })
                        
                    })
                    
                    // this.isExportingDetails = false
                    // console.log('this.isExporting', this.isExportingDetails)
                })

                
                const buf = await wb.xlsx.writeBuffer()
                saveAs(new Blob([buf]), `TUMABINI-PROJECTS/PAYMENTS-MASTERLIST.xlsx`)
                
                callback()
            },

            
            async exportBuyersPerProject(callback) {
                console.log('Exporting Buyers per project new')
                
                const wb = new Excel.Workbook()
                this.all_projects.forEach(project => {
                    const ws = wb.addWorksheet(project.name)

                    let r = 1   // row
                    const s = 4 // initial size b

                    const col_letters = {   date_of_reservation: 'A',
                                            buyer_name: 'B',
                                            unit: 'C',
                                            contact_number: 'D',
                                            agent: 'E',
                                            agent_number: 'F',
                                            realty: 'G',
                                            status: 'H',
                                            tcp: 'I',
                                            monthly_amount: 'J',
                                            balance_loanable_amount: 'K'
                                        }

                    const col_numbers = {   date_of_reservation: 1,
                                            buyer_name: 2,
                                            unit: 3,
                                            contact_number: 4,
                                            agent: 5,
                                            agent_number: 6,
                                            realty: 7,
                                            status: 8,
                                            tcp: 9,
                                            monthly_amount: 10,
                                            balance_loanable_amount: 11
                                        }

                    ws.columns = [  { width: 15, alignment: { vertical: 'middle', horizontal: 'center' }},  // date
                                    { width: 35, alignment: { vertical: 'middle', horizontal: 'center' }},  // buyer
                                    { width: 35, alignment: { vertical: 'middle', horizontal: 'center' }},  // unit
                                    { width: 20, alignment: { vertical: 'middle', horizontal: 'center' }},  // contact #
                                    { width: 35, alignment: { vertical: 'middle', horizontal: 'center' }},  // agent
                                    { width: 20, alignment: { vertical: 'middle', horizontal: 'center' }},  // agent #
                                    { width: 30, alignment: { vertical: 'middle', horizontal: 'center' }},  // realty
                                    { width: 11, alignment: { vertical: 'middle', horizontal: 'center' }},  // status
                                    { width: 15, alignment: { vertical: 'middle', horizontal: 'center' }},  // tcp
                                    { width: 15, alignment: { vertical: 'middle', horizontal: 'center' }},  // monthly
                                    { width: 15, alignment: { vertical: 'middle', horizontal: 'center' }},  // balance loanable
                                ];

                    // A1:H1
                    ws.mergeCells(`${col_letters.date_of_reservation}${r}:${col_letters.realty}${r}`)
                    ws.getCell(`${col_letters.buyer_name}${r}`).value = 'TUMABINI REAL ESTATE DEVELOPMENT';
                    ws.getCell('A1').font = { name: 'Calibri', size: 11, bold: true };
                    ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

                    // A2:H2
                    ws.mergeCells(`${col_letters.date_of_reservation}${++r}:${col_letters.realty}${++r}`)
                    ws.getCell(`${col_letters.buyer_name}${r}`).value = '133 MC Briones St., Hi-way Bakilid, Mandaue City 6014 Tel#: 032 414-5103, 09564791879 Email: tumabinidevelopment@gmail.com';
                    ws.getCell('A2').font = { name: 'Calibri', size: 8, bold: false };
                    ws.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center' };

                    // header rows
                    let rowValues = []
                    rowValues[col_numbers.date_of_reservation] = 'DATE (dd/mm/yyyy)'
                    rowValues[col_numbers.buyer_name] = 'NAME'
                    rowValues[col_numbers.unit] = 'UNIT'
                    rowValues[col_numbers.contact_number] = 'CONTACT #'
                    rowValues[col_numbers.agent] = 'AGENT'
                    rowValues[col_numbers.agent_number] = 'AGENT #'
                    rowValues[col_numbers.realty] = 'REALTY'
                    rowValues[col_numbers.status] = 'STATUS'
                    rowValues[col_numbers.tcp] = 'TCP'
                    rowValues[col_numbers.monthly_amount] = 'MONTHLY'
                    if(project.type == 1) {
                        rowValues[col_numbers.balance_loanable_amount] = 'BAL LOANABLE AMT'
                    }

                    const header_row = ws.addRow(rowValues)
                    header_row.font = { name: 'Calibri', size: 9, bold: true };
                    header_row.alignment = { vertical: 'middle', horizontal: 'center' };

                    // ws.addRow(rowValues)
                    r = r+2

                    this.all_buyers.forEach(buyer => {
                        if(buyer.project_id == project.id) {
                            
                            this.getReservationDetails(buyer.id, project.type, () => {
                                this.getUnitDetails(buyer.lot_id, () => {
                                    const color = buyer.status == 1 ? '#000000': '#800000' 
                                    ws.getCell(`${col_letters.date_of_reservation}${r}`).value
                                            = this.reservation_details && this.reservation_details.date
                                            ? this.reservation_details.date : '-';
                                    ws.getCell(`${col_letters.date_of_reservation}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.date_of_reservation}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    const buyer_fullname = `${buyer.last_name}, ${buyer.first_name} ${buyer.middle_initial}`
                                    ws.getCell(`${col_letters.buyer_name}${r}`).value = buyer_fullname;
                                    ws.getCell(`${col_letters.buyer_name}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.buyer_name}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    ws.getCell(`${col_letters.unit}${r}`).value = this.unitToExport;
                                    ws.getCell(`${col_letters.unit}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.unit}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    ws.getCell(`${col_letters.contact_number}${r}`).value = buyer.contact_number;
                                    ws.getCell(`${col_letters.contact_number}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.contact_number}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    ws.getCell(`${col_letters.agent}${r}`).value = buyer.agent;
                                    ws.getCell(`${col_letters.agent}${r}`).font = { name: 'Calibri', size: 8, bold: false, color: { argb: color} };
                                    ws.getCell(`${col_letters.agent}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    ws.getCell(`${col_letters.agent_number}${r}`).value = buyer.agent_number;
                                    ws.getCell(`${col_letters.agent_number}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.agent_number}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    ws.getCell(`${col_letters.realty}${r}`).value = buyer.realty;
                                    ws.getCell(`${col_letters.realty}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.realty}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    const status = buyer.status == 0 ? 'Inactive' : 'Active'
                                    ws.getCell(`${col_letters.status}${r}`).value = status;
                                    buyer.status == 0
                                        ? ws.getCell(`${col_letters.status}${r}`).font = { name: 'Calibri', size: 8, bold: false, color: 'red' }
                                        : ws.getCell(`${col_letters.status}${r}`).font = { name: 'Calibri', size: 8, bold: false }
                                    ws.getCell(`${col_letters.status}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    ws.getCell(`${col_letters.tcp}${r}`).value
                                                = this.reservation_details && this.reservation_details.total_contract_price
                                                ? this.formatDisplay(this.reservation_details.total_contract_price) : '-';
                                    ws.getCell(`${col_letters.tcp}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.tcp}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    if(project.type == 1) {
                                        ws.getCell(`${col_letters.monthly_amount}${r}`).value
                                                = this.reservation_details && this.reservation_details.monthly_equity_amount
                                                ? this.formatDisplay(this.reservation_details.monthly_equity_amount) : '-';
                                    } else if(project.type == 2) {
                                        ws.getCell(`${col_letters.monthly_amount}${r}`).value
                                                = this.reservation_details && this.reservation_details.monthly_installment
                                                ? this.formatDisplay(this.reservation_details.monthly_installment) : '-';
                                    } else {
                                        alert('WRONG PROJECT TYPE', project_type)
                                    }
                                    ws.getCell(`${col_letters.monthly_amount}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                    ws.getCell(`${col_letters.monthly_amount}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    // BALANCE LOANABLE AMOUNT FOR HL == 1
                                    if(project.type == 1) {
                                        this.reservation_details && this.reservation_details.new_balance_loanable_amount
                                            ? ws.getCell(`${col_letters.balance_loanable_amount}${r}`).value = this.formatDisplay(this.reservation_details.new_balance_loanable_amount)
                                            : this.reservation_details && this.reservation_details.balance_loanable_amount ? ws.getCell(`${col_letters.balance_loanable_amount}${r}`).value = this.formatDisplay(this.reservation_details.balance_loanable_amount) : '-'
                                        ws.getCell(`${col_letters.balance_loanable_amount}${r}`).font = { name: 'Calibri', size: 8, bold: false };
                                        ws.getCell(`${col_letters.balance_loanable_amount}${r}`).alignment = { vertical: 'middle', horizontal: 'center' };

                                    }

                                    r++
                                })
                            })
                            
                        }
                    })
                })

                const buf = await wb.xlsx.writeBuffer()
                saveAs(new Blob([buf]), `TUMABINI-PROJECTS/MASTERLIST.xlsx`)
                callback()
                
            },

            getReservationDetails(id, project_type, callback) {
                if(project_type == 1) {
                        // console.log('this.all_hl', this.all_hl_reservations)
                        this.reservation_details = this.all_hl_reservations.find(reservation => reservation.buyer_id === id)
                                                    ? this.all_hl_reservations.find(reservation => reservation.buyer_id === id) : '-'
                } else if(project_type ==2) {
                            // console.log('this.all_loreserv', this.all_lo_reservations)
                        this.reservation_details = this.all_lo_reservations.find(reservation => reservation.buyer_id === id)
                } else {
                    alert('WRONG PROJECT TYPE', project_type)
                }

                callback()
            },
            
            getBuyerDetails(buyer_id, callback) {
                let buyer = this.all_buyers.find(buyer => buyer.id == buyer_id) 
                this.buyer_to_export = {
                    name: `${buyer.last_name}, ${buyer.first_name} ${buyer.middle_initial}`,
                    lot_id: buyer.lot_id
                }
                callback()
            },

            getUnitWithProjectDetails(lot_id, callback) {
                let lot = this.all_lots.find(lot => lot.id === lot_id)
                let block = this.all_blocks.find(block => lot.block_id === block.id)
                let phase = this.all_phases.find(phase => block.phase_id === phase.id)
                let project = this.all_projects.find(project => block.project_id === project.id)

                // console.log('reservation', this.reservation_details)
                this.unitToExport = phase ? `${project.name} ${phase.name} ${block.name} ${lot.name}` : `${project.name} ${block.name} ${lot.name}`

                callback()
            },


            getUnitDetails(lot_id, callback) {
                let lot = this.all_lots.find(lot => lot.id === lot_id)
                let block = this.all_blocks.find(block => lot.block_id === block.id)
                let phase = this.all_phases.find(phase => block.phase_id === phase.id)

                // console.log('reservation', this.reservation_details)
                this.unitToExport = phase ? `${phase.name} ${block.name} ${lot.name}` : `${block.name} ${lot.name}`

                callback()
            },

            formatDisplay(value) {
               return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value
            },






















            async exportBuyers() {
                console.log('Exporting Buyers new')
                // let toExportBuyers = {}

                const wb = new Excel.Workbook()
                const ws = wb.addWorksheet()

                ws.columns = [
                    { header: 'DATE', key: 'id', width: 10,
                            style: { numFmt: 'dd/mm/yyyy', alignment : { vertical: 'middle', horizontal: 'center' } }},
                    { header: 'CLIENT', key: 'name', width: 32 },
                    { header: 'OR NO', key: 'or_no', width: 10 },
                    { header: 'POLICY NO', key: 'policy_no', width: 10 }
                ];

                const rowValues = []
                rowValues[1] = 'abc'
                rowValues[2] = 'def'
                rowValues[3] = 'ghi'
                ws.addRow(rowValues)

                const buf = await wb.xlsx.writeBuffer()
                saveAs(new Blob([buf]), `Masterlist.xlsx`)
            }, 

            exportBuyersPerProjectOld() {
                console.log('Exporting Buyers')
                let toExportBuyers = {}
                let temp_project_id = 1
                // change loop to dynamic
                var xl = require('excel4node');
                var wb = new xl.Workbook();
                this.all_projects.forEach(project => {
                    const ws = wb.addWorksheet(project.name);
                    const homedir = require('os').homedir();

                    let r = 1   // row
                    const s = 4 // initial size b

                    const col = {   'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5,
                                    'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10,
                                    'K': 11, 'L': 12, 'M': 13, 'N': 14 }
                    ws.column(col['A']).setWidth(s*5)
                    ws.column(col['B']).setWidth(s*5)
                    ws.column(col['C']).setWidth(s*5)
                    ws.column(col['D']).setWidth(s*5)
                    ws.column(col['E']).setWidth(s*2)
                    ws.column(col['F']).setWidth(s*2)
                    ws.column(col['I']).setWidth(s*5)

                    const bold_header_style = wb.createStyle({ font: { color: '#000000', size: 13, bold: true }, alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                    const bordered_style = wb.createStyle({ border: { left: { style: 'thin', color: '#000000' }, right: { style: 'thin', color: '#000000' }, top: { style: 'thin', color: '#000000' }, bottom: { style: 'thin', color: '#000000' }} })
                    const aligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                    const header_style = wb.createStyle({ font: { color: '#000000', size: 11, bolssd: true } })
                    const bold_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: true } })
                    const regular_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: false } })
                    const center_bold = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' }, font: { color: '#000000', size: 11, bold: true } })
                    const italic_rightaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'right', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })
                    const italic_leftaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'left', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })

                    ws.cell(r, col['A'], r, col['H'], true).string('TUMABINI REAL ESTATE DEVELOPMENT').style(bold_header_style)
                    // ws.cell(r, col['I']).string(project.name).style(bold_header_style).style({font: {size: 10}, alignment: {horizontal: 'right'}})
                    ws.cell(r, col['I']).string('MYHOME').style(bold_header_style).style({font: {size: 10}, alignment: {horizontal: 'right'}})
                    ws.cell(++r, col['A'], ++r, col['H'], true).string('133 MC Briones St., Hi-way Bakilid, Mandaue City 6014 Tel#: 032 414-5103, 09564791879 Email: tumabinidevelopment@gmail.com').style(regular_style).style(aligned_style).style({font: {size: 8}})
                    // ws.cell(r-1, col['I']).string(project.location).style(regular_style).style({font: {size: 8}, alignment: {horizontal: 'right'}})
                    ws.cell(r-1, col['I']).string('Perrelos, Carcar City, Cebu').style(regular_style).style({font: {size: 8}, alignment: {horizontal: 'right'}})

                    ws.cell(++r, col['A']).string(`BUYER NAME`).style(bold_header_style).style(aligned_style).style({font: {size: 8}})
                    ws.cell(r, col['B']).string(`HOME ADDRESS`).style(bold_header_style).style(aligned_style).style({font: {size: 8}})
                    ws.cell(r, col['C']).string(`EMAIL ADDRESS`).style(bold_header_style).style(aligned_style).style({font: {size: 8}})
                    ws.cell(r, col['D']).string(`PROJECT`).style(bold_header_style).style(aligned_style).style({font: {size: 8}})
                    ws.cell(r, col['E']).string(`LOT`).style(bold_header_style).style(aligned_style).style({font: {size: 8}})
                    ws.cell(r, col['F']).string(`STATUS`).style(bold_header_style).style(aligned_style).style({font: {size: 8}})         

                    const dataToSubmit = {  project_id: project.id }
                    ipcRenderer.send('fetchBuyersByProjectListNoStatus', dataToSubmit)
                    ipcRenderer.once('fetchedBuyersByProjectListNoStatus', (event, data) => {
                        if(data.response == 1) {
                            toExportBuyers = data.buyers
                            this.isFetchingData = false
                            console.log('Fetching Buyers by Project WITHOUT STATUS SUCCESS', toExportBuyers)

                            toExportBuyers.forEach(project_buyer => {
                                let status = project_buyer.status == 1 ? 'Active'  : 'Inactive'
                                ws.cell(++r, col['A']).string(`${project_buyer.last_name.toUpperCase()}, ${project_buyer.first_name.toUpperCase()}`).style(regular_style).style(aligned_style).style({font: {size: 8}})
                                ws.cell(r, col['B']).string(`${project_buyer.home_address.toUpperCase()}`).style(regular_style).style(aligned_style).style({font: {size: 8}})
                                ws.cell(r, col['C']).string(`${project_buyer.email_address.toUpperCase()}`).style(regular_style).style(aligned_style).style({font: {size: 8}})
                                ws.cell(r, col['D']).string(`MYHOME`).style(regular_style).style(aligned_style).style({font: {size: 8}})
                                ws.cell(r, col['E']).string(`LOT ${project_buyer.lot_id.toString()}`).style(regular_style).style(aligned_style).style({font: {size: 8}})
                                ws.cell(r, col['F']).string(status).style(regular_style).style(aligned_style).style({font: {size: 8}})
                                
                            })
                            wb.write( `${homedir}/TUMABINI-PROJECTS/new-masterlists.xlsx`)
                            console.log('DONE Exporting Buyers')
                        } else {
                            this.isFetchingData = false
                            alert('Fetching Buyers by Project ERROR', temp_project_id)
                        }
                    })
                })

            },
            fetchAllBuyers() {
                ipcRenderer.send('fetchBuyersList')
                ipcRenderer.once('fetchedBuyersList', (event, data) => {
                    this.buyers = data
                    this.all_buyers = data
                    this.filtered_buyers = data
                })
                console.log('BUYERS LIST THIS.BUYERS', this.buyers)
            },
            filterProject(event) {
                console.log('Filter Project ID', event.target.value)
                this.project_id = event.target.value
                this.fetchBuyersByProjectList()
            },
            filterStatus(event) {
                console.log('Filter Status', event.target.value)
                this.status = event.target.value
                this.fetchBuyersByProjectList()
            },
            fetchBuyersByProjectList() {
                this.isFetchingData = true
                const dataToSubmit = {  project_id: this.project_id,
                                        status: this.status}
                ipcRenderer.send('fetchBuyersByProjectList', dataToSubmit)
                ipcRenderer.once('fetchedBuyersByProjectList', (event, data) => {
                    if(data.response == 1) {
                        console.log('Fetching Buyers by Project SUCCESS')
                        this.buyers = data.buyers
                        this.filtered_buyers = data.buyers
                        this.isFetchingData = false
                    } else {
                        this.isFetchingData = false
                        alert('Fetching Buyers by Project ERROR')
                    }
                })
            },
            hasClicked(id) {
                this.hasClickedBuyer = true
                this.id = id
                console.log('hasClickedBuyer', this.hasClickedBuyer, 'id', this.id)
                // this.fetchBuyerDetails(id)
                this.fetchUnitDetails(id)
            },
            // fetchBuyerDetails(id) {
            //     console.log('id', id)
            //     ipcRenderer.send('fetchBuyer', id)
            //     ipcRenderer.once('fetchedBuyer', (event, data) => {
            //         this.buyer_details = data
            //     })
            // },
            viewFullDetails() {
                console.log('VIEW DETAILS this.id', this.id, this.buyer_details)
                if(this.buyer_details.reservation_type == 5
                    || this.buyer_details.reservation_type == 6
                    || this.buyer_details.reservation_type == 7) {
                        this.$router.push({name: 'View-Buyer-LO', params: { id: this.id }})
                } else if(this.buyer_details.reservation_type == 1
                    || this.buyer_details.reservation_type == 2
                    || this.buyer_details.reservation_type == 3
                    || this.buyer_details.reservation_type == 4
                    || this.buyer_details.reservation_type == 8) {
                        this.$router.push({name: 'View-Buyer-HL', params: { id: this.id }})
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${this.buyer_details.reservation_type}`)
                }
            },
            fetchActiveOrInactiveBuyers(status) {
                ipcRenderer.send('fetchActiveOrInactiveBuyersList', status)
                ipcRenderer.once('fetchedActiveOrInactiveBuyersList', (event, data) => {
                    console.log('fetchedActiveOrInactiveBuyersList', data)
                    // add loading screen
                    this.buyers = data
                    this.filtered_buyers = data.buyers
                    this.isFetchingData = false
                })
            },
            searchFilterBuyer(event){
                console.log('Searching', event.target.value)
                const keyword_filter = event.target.value.toUpperCase()
                let filtered_buyers = this.buyers.filter(function(buyer) {
                    
                    return buyer.last_name.toUpperCase().includes(keyword_filter) ||
                    buyer.first_name.toUpperCase().includes(keyword_filter)
                })
                console.log(filtered_buyers)
                this.filtered_buyers = filtered_buyers
                
                // return this.buyers
                
            }
        }
    })
</script>