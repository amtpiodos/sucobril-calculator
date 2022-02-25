<template>
    <div>
        <main-header />
        <!-- <div v-if="!isFetchingData"> -->
            <div class="h-2/3 flex mx-24 my-5 px-5">
                <div class="w-1/2 px-4">
                    <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                    <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                </div>
                <div class="w-1/2 px-4">
                    <div class="text-xs font-semibold"> <p class="text-right"> {{ newBuyer.project.name }} - {{ newBuyer.project.location }} </p> </div>
                    <div class="text-xs"> <p class="text-right"> Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </p> </div>
                </div>
            </div>
            <div class="my-5 mx-24 px-5">
                <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> ASSUME UNIT </p> </div>
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                    <div class="flex px-4 gap-4">
                        <div class="w-2/5"> <input-form label="Last Name" v-model="newBuyer.last_name" /> </div>
                        <div class="w-2/5"> <input-form label="First Name" v-model="newBuyer.first_name" /> </div>
                        <div class="w-1/5"> <input-form label="M.I." v-model="newBuyer.middle_initial" /> </div>
                    </div>
                    <!-- <div class="full px-4"> <readonly-form label="Reservation Date" v-bind:value="payment_details.date" /> </div> -->
                    <div class="full px-4">
                        <label-component label="RESERVATION DATE" />
                        <datepicker :typeable="true" v-model="newBuyer.date" placeholder="Select Date..." class="my-1" input-class="p-2 px-2 w-full border border-gray-200 rounded-md"> </datepicker>
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Name" :value="newBuyer.project.name" /> </div>
                    <div class="grid grid-cols-5 gap-4 px-4">
                        <div class="full px-1"> <readonly-form label="Block" v-bind:value="newBuyer.block.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot" v-bind:value="newBuyer.lot.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Phase" v-bind:value="newBuyer.phase" /> </div>
                        <div class="full px-1"> <input-form label="Lot Area" v-model="newBuyer.lot.lot_area" /> </div>
                        <div class="full px-1" v-if="newBuyer.reservation_type < 5">
                            <input-form label="Flr Area" v-model="newBuyer.lot.floor_area" />
                        </div>
                    </div>
                    
                    <div class="full px-4"> <readonly-form label="Project Address" v-bind:value="newBuyer.project.location" /> </div>
                    <div class="grid grid-cols-2 gap-4 px-4">
                        <div class="full"> <readonly-form label="Price/Sq.M (PHP)" v-bind:value="newBuyer.lot.price_per_sqm" /> </div>
                        <div class="full"> <readonly-form label="House Type" v-bind:value="newBuyer.lot.lot_type" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Home Address" v-model="newBuyer.home_address" /> </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <input-form label="Contact No." v-model="newBuyer.contact_number" /> </div>
                        <div class="w-1/2"> <input-form label="Email Address" v-model="newBuyer.email_address" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Realty's Name" v-model="newBuyer.realty_name" /> </div>
                    <!-- <div class="full px-4"> <input-form label= "Agent's Name" v-model="newBuyer.agent_name" /> </div> -->
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <input-form label= "Agent's Name" v-model="newBuyer.agent_name" /> </div>
                        <div class="w-1/2"> <input-form label= "Agent's Number" v-model="newBuyer.agent_number" /> </div>
                    </div>
                </div>
                <div class="flex items-center mx-auto justify-center gap-8 my-4">
                        <button type="button" v-on:click="submitNewBuyer"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            SUBMIT
                        </button>
                        <button type="button" v-on:click="cancelAssumption"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            CANCEL
                        </button>
                    </div>
            </div>
        <!-- </div> -->
        
        <!-- <div v-else> LOADING... </div> -->
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import InputForm from '../components/v2/InputForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import Label from '../components/v2/Label'
    import Datepicker from 'vuejs-datepicker'


    export default({
        components: {
            'main-header': Header,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm,
            'label-component': Label,
            'datepicker': Datepicker
        },
        data() {
            return {
                isFetchingData: false,
                oldBuyer: this.$route.params.buyer,
                newBuyer: ''
            }
        },
        created() {
            this.newBuyer = this.$route.params.buyer
            // new information
            this.newBuyer.agent_name = ''
            this.newBuyer.contact_number = ''
            this.newBuyer.date = ''
            this.newBuyer.email_address = ''
            this.newBuyer.first_name = ''
            this.newBuyer.home_address = ''
            this.newBuyer.last_name = ''
            this.newBuyer.middle_initial = ''
            this.newBuyer.agent_number = ''
            this.newBuyer.phase = typeof(this.newBuyer.phase) == 'object' ? this.newBuyer.phase.name : 'N/A'

        },
        methods: {
            cancelAssumption() {
                // go back to details page, check reservation type
            },
            submitNewBuyer() {
                console.log('newBuyer', this.newBuyer)
                const dataToSubmit = {  old_id: this.oldBuyer.id,
                                        newBuyer: this.newBuyer,
                                        payment_details: this.newBuyer.payment }
                
                console.log('dataToSubmit', dataToSubmit)
                // ASSUME H & L UNIT
                const reservation_type = this.newBuyer.reservation_type
                if(reservation_type == 1
                    || reservation_type == 2
                    || reservation_type == 3
                    || reservation_type == 4) {
                        console.log('ASSUMING BUYER HL')
                        ipcRenderer.send('assume-HL-unit', dataToSubmit)
                        ipcRenderer.once('assumed-HL-unit', (event, data) => {
                            console.log('assumed-HL-unit', data)
                            if(data.response == 1) {
                                console.log('Add H&L ASSUMING Buyer SUCCESSFUL')
                                setTimeout(() => {
                                    this.$router.push({name: 'View-Buyer-HL', params: { id: data.new_id }})
                                }, 1000)
                            } else {
                                alert('Add H&L Buyer error')
                                console.log('Add H&L Buyer error')
                            }
                            this.isFetchingData = false
                        })
                } else if(reservation_type == 5
                    || reservation_type == 6
                    || reservation_type == 7) {
                        console.log('ASSUMING BUYER LOT ONLY')
                        ipcRenderer.send('assume-LO-unit', dataToSubmit)
                        ipcRenderer.once('assumed-LO-unit', (event, data) => {
                            console.log('assumed-LO-unit', data)
                            if(data.response == 1) {
                                console.log('Add LOT ONLY ASSUMING Buyer SUCCESSFUL')
                                setTimeout(() => {
                                    this.$router.push({name: 'View-Buyer-LO', params: { id: data.new_id }})
                                }, 1000)
                            } else {
                                alert('Add LO Buyer error')
                                console.log('Add LO Buyer error')
                            }
                            this.isFetchingData = false
                        })
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${reservation_type}`)
                } 
            },
            viewBuyerInfo() {
                const reservation_type = this.newBuyer.reservation_type
                if(reservation_type == 5
                    || reservation_type == 6
                    || reservation_type == 7) {
                        this.$router.push({name: 'View-Buyer-LO', params: { id: this.newBuyer.id }})
                } else if(reservation_type == 1
                    || reservation_type == 2
                    || reservation_type == 3
                    || reservation_type == 4) {
                        this.$router.push({name: 'View-Buyer-HL', params: { id: this.newBuyer.id }})
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${reservation_type}`)
                }
            },
        }
    })
</script>