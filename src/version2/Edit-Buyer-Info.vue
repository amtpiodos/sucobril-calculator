<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24">

            
                <!-- <div>
                    <button type="button" v-on:click="viewPayment"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        View Payments
                    </button>
                </div> -->
            <div v-if="!isFetchingData">    
                <div class="h-2/3 flex">
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                        <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    </div>
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-semibold"> <p class="text-right"> {{ unedited_buyer.project.name }} - {{ unedited_buyer.project.location }} </p> </div>
                        <div class="text-xs"> <p class="text-right"> Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </p> </div>
                    </div>
                </div>

                <div class="full m-4 bg-gray-200">
                    <p class="text-center py-2 font-bold text-lg"> EDIT BUYER'S INFORMATION </p>
                    <p class="text-center pb-2 font-bold text-sm text-red-700" v-if="!unedited_buyer.status">
                        This buyer has been forefeited and is now inactive.
                    </p>
                </div>
                
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                    <div class="flex px-4 gap-4">
                        <div class="w-2/5"> <input-form label="Last Name" v-model="edited_buyer.last_name"/> </div>
                        <div class="w-2/5"> <input-form label="First Name" v-model="edited_buyer.first_name" /> </div>
                        <div class="w-1/5"> <input-form label="M.I." v-model="edited_buyer.middle_initial" /> </div>
                    </div> 
                    <div class="full px-4">
                        <readonly-form label="Reservation Date" :value="unedited_buyer.payment.date" />
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Name" :value="unedited_buyer.project.name" /> </div>
                    <div class="grid grid-cols-4 gap-4 px-4">
                        <div class="full px-1"> <readonly-form label="Block" :value="unedited_buyer.block.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot" :value="unedited_buyer.lot.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Phase" :value="unedited_buyer.phase" /> </div>
                        <div class="full px-1"> <readonly-form label="FLR Area (SQ.M)" :value="unedited_buyer.lot.lot_area" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Address" :value="unedited_buyer.project.location" /> </div>
                    <div class="grid grid-cols-2 gap-4 px-4">
                        <div class="full"> <readonly-form label="Price/Sq.M" :value="unedited_buyer.lot.price_per_sqm" /> </div>
                        <div class="full"> <readonly-form label="House Type" :value="unedited_buyer.lot.lot_type" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Home Address" v-model="edited_buyer.home_address"/> </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <input-form label="Contact No." v-model="edited_buyer.contact_number" /> </div>
                        <div class="w-1/2"> <input-form label="Email Address" v-model="edited_buyer.email_address" /> </div>
                    </div>
                    <div class="full px-4"> <input-form label="Realty's Name" v-model="edited_buyer.realty" /> </div>
                    <div class="full px-4"> <input-form label="Agent's Name" v-model="edited_buyer.agent" /> </div>
                </div>

                <div class="w-full flex mx-auto justify-center items-center my-4 gap-4">
                    <button type="button" v-on:click="updateInfo"
                        class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                        SUBMIT CHANGES
                    </button>
                    <button type="button" v-on:click="cancelEdit"
                        class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                        CANCEL
                    </button>
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
                unedited_buyer: '',
                // edited_buyer: '',
                edited_buyer: this.$route.params.buyer,
                changed_data: {},
                isFetchingData: true
            }
        },
        created() {
            console.log('this id', this.$route.params.id, this.$route.params.buyer)
            this.unedited_buyer = this.getDetails(this.$route.params.id)
        },
        methods: {
            addChangedFields(_callback) {
                const edited = this.edited_buyer
                for(const field in edited) {
                    
                    if(edited[field] !== this.unedited_buyer[field] && typeof(edited[field]) !== 'object') {
                        this.changed_data[field] = edited[field]
                    }
                }
                _callback()
            },
            updateInfo() {
                this.addChangedFields(() => {
                    console.log('added changed fields', this.changed_data)
                    const changed_size = Object.keys(this.changed_data).length
                    const dataToSubmit = {  id: this.unedited_buyer.id,
                                        unedited_buyer: this.unedited_buyer,
                                        edited_buyer: this.edited_buyer,
                                        changed_data: this.changed_data }
                    if(changed_size !== 0) {
                        ipcRenderer.send('editBuyerInfo', dataToSubmit)
                        ipcRenderer.once('editedBuyerInfo', (event, data) => {
                            console.log('editedBuyerInfo', data)
                            if(data.response == 1) {
                                alert('BUYER SUCCESSFULLY UPDATED')
                                this.isFetchingData = true
                                // this.autoExport()
                                // add loading screen
                                this.viewBuyerInfo()
                            } else {
                                alert(data.error)
                                console.log('EDIT BUYER INFORMATION ERROR')
                            }
                        })
                    } else {
                        alert('No edit/update has been made.')
                    }
                })

                
            },
            cancelEdit() {
                this.viewBuyerInfo()
            },
            viewBuyerInfo() {
                const reservation_type = this.unedited_buyer.reservation_type
                if(reservation_type == 5
                    || reservation_type == 6
                    || reservation_type == 7) {
                        this.$router.push({name: 'View-Buyer-LO', params: { id: this.unedited_buyer.id }})
                } else if(reservation_type == 1
                    || reservation_type == 2
                    || reservation_type == 3
                    || reservation_type == 4) {
                        this.$router.push({name: 'View-Buyer-HL', params: { id: this.unedited_buyer.id }})
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${reservation_type}`)
                }
            },
            getDetails(id) {
                this.isFetchingData = true,
                ipcRenderer.send('fetchBuyer', id)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.unedited_buyer = data
                    ipcRenderer.send('fetchLot', this.unedited_buyer.lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        this.unedited_buyer.lot = data
                        ipcRenderer.send('fetchBlock', this.unedited_buyer.lot.block_id)
                        ipcRenderer.once('fetchedBlock', (event, data) => {
                            this.unedited_buyer.block = data
                            if(this.unedited_buyer.block.phase_id) {
                               ipcRenderer.send('fetchPhase', this.unedited_buyer.block.phase_id)
                               ipcRenderer.once('fetchedPhase', (event, data) => {
                                   this.unedited_buyer.phase = data.name
                               })
                            } else {
                                this.unedited_buyer.phase = "N/A"
                            }
                            ipcRenderer.send('fetchProject', this.unedited_buyer.block.project_id)
                            ipcRenderer.once('fetchedProject', (event, data) => {
                                this.unedited_buyer.project = data
                                ipcRenderer.send('fetchHouseAndLotPayment', this.unedited_buyer.id)
                                ipcRenderer.once('fetchedHouseAndLotPayment', (event, data) => {
                                    this.unedited_buyer.payment = data
                                    console.log('this.buyer in EDIT BUYER INFO', this.unedited_buyer)
                                    // console.log('this.buyer in VIEW DETAILS HOUSE AND LOT PAYMENT', this.payment)
                                    this.isFetchingData = false
                                })
                            })
                        })
                    })
                })
            }
            
        }
    })
</script>