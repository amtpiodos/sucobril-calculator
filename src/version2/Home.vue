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
                <div class="w-2/5 flex">
                    <input class="align-center w-3/5 bg-white border-2 border-light-blue-500
                            border-opacity-100 rounded-md px-3 py-2 mr-4"
                            v-on:keyup.delete="searchFilterBuyer($event)" v-on:keypress="searchFilterBuyer($event)" placeholder="SEARCH BUYER..."/>

                    <!-- <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                    <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    <div class="text-xs"> Contact: (032) 260-1522  Email: tumabinidevelopment@gmail.com </div> -->
                </div>
                <div class="w-2/5 flex items-right justify-right gap-2">
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
                <div class="w-1/5 flex items-center my-1 ">
                    <button type="button" v-on:click="exportBuyersPerProject"
                        class="bg-gray-500 mx-2 p-4 w-full items-center align-center text-white text-sm font-regular border rounded-md">
                        Export Buyers
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
                                        v-on:click.native="hasClicked(buyer.id)"/>
                                        <!-- {{ buyer.first_name}} -->
                        </div>
                    </div>
                </div>

                <div class="h-96 w-3/4 bg-white items-center content-center space-y-3">
                    <div class="mx-auto h-full content-center grid grid-cols-1 space-y-6">
                        <div v-if="!hasClickedBuyer">
                            <p class="text-xl leading-tight font-bold text-center mx-4"> Buyer's Information </p>
                            <p class="text-center align-center"> CLICK ON A BUYER TO VIEW BUYER DETAILS </p>
                        </div>
                        <div class="my-5 mx-5 px-5" v-if="hasClickedBuyer">
                            <div class="my-32">
                                <p class="my-2 text-center align-center font-semibold uppercase text-xl"> {{ buyer_details.last_name }}, {{ buyer_details.first_name }} </p>
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
                id: 0,
                isFetchingData: false,

                all_projects: {},
                all_phases: {},
                all_blocks: {},
                all_lots: {},

                buyer_details: {},
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
        },
        methods: {

            fetchAllProjects() {
                console.log('fetchProjectsList')
                ipcRenderer.send('fetchProjectsList')
                ipcRenderer.once('fetchedProjectsList', (event, data) => {
                    this.all_projects = data
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
                                // console.log('projects list',this.project_details)
                            })
                        })
                    })
                })

                

            },
            exportBuyersPerProject() {
                console.log('Exporting Buyers')
                // const homedir = require('os').homedir();
                var xl = require('excel4node')
                const homedir = require('os').homedir()
                var wb = new xl.Workbook()
                // console.log('all projets', this.all_projects)
                this.all_projects.forEach(project => {
                    wb.addWorksheet(project.name)
                })

                wb.write( `${homedir}/TUMABINI-PROJECTS/MASTERLIST.xlsx`)
            },

            exportBuyers() {
                console.log('Exporting Buyers')
                let toExportBuyers = {}
                let temp_project_id = 1
                // change loop to dynamic
                var xl = require('excel4node');
                var wb = new xl.Workbook();
                const ws = wb.addWorksheet('MYHOME');
                const homedir = require('os').homedir();

                let r = 1   // row
                const s = 4 // initial size

                const col = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10, 'K': 11, 'L': 12, 'M': 13, 'N': 14 }
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

                const dataToSubmit = {  project_id: 1,
                                        status: this.status}
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
                        wb.write( `${homedir}/TUMABINI-PROJECTS/sample-masterlists.xlsx`)
                        console.log('DONE Exporting Buyers')
                    } else {
                        this.isFetchingData = false
                        alert('Fetching Buyers by Project ERROR', temp_project_id)
                    }
                })


            },
            fetchAllBuyers() {
                ipcRenderer.send('fetchBuyersList')
                ipcRenderer.once('fetchedBuyersList', (event, data) => {
                    this.buyers = data
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
                    || this.buyer_details.reservation_type == 4) {
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