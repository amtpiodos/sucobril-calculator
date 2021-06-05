<template>
    <div>
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> RA - FORM 2A - LO </p> </div>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                <div class="flex px-4 gap-4">
                    <div class="w-2/5"> <input-form label="Last Name" v-model="buyer_lastname" /> </div>
                    <div class="w-2/5"> <input-form label="First Name" v-model="buyer_firstname" /> </div>
                    <div class="w-1/5"> <input-form label="M.I." v-model="buyer_middle" /> </div>
                </div>
                <div class="full px-4"> <readonly-form label="Reservation Date" v-bind:value="date" /> </div>
                <div class="full px-4"> <readonly-form label="Project Name" v-model="project" /> </div>
                <div class="grid grid-cols-4 gap-4 px-4">
                    <div class="full px-1"> <readonly-form label="Block" v-bind:value="block" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot" v-bind:value="lot" /> </div>
                    <div class="full px-1"> <readonly-form label="Phase" v-model="phase" /> </div>
                    <div class="full px-1"> <readonly-form label="Lot Area" v-bind:value="lot_area" /> </div>
                </div>
                <div class="full px-4"> <readonly-form label="Project Address" v-model="project_address" /> </div>
                <div class="grid grid-cols-2 gap-4 px-4">
                    <div class="full"> <readonly-form label="Price/Sq.M" v-bind:value="price" /> </div>
                    <div class="full"> <readonly-form label="Type of Lot" v-bind:value="lot_type" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Home Address" v-bind:value="home_address" /> </div>
                <div class="flex px-4 gap-4">
                    <div class="w-1/2"> <input-form label="Contact No." v-model="contact_number" /> </div>
                    <div class="w-1/2"> <input-form label="Email Address" v-model="email_address" /> </div>
                </div>
                <div class="full px-4"> <input-form label="Realty's Name" v-model="realty_name" /> </div>
                <div class="full px-4"> <input-form label="Agent's Name" v-bind:value="agent_name" /> </div>
            </div>

            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> REGULAR RESERVATION / STRAIGHT MONTHLY </p> </div>

            <div class="full mx-48 gap-4">
                <div class="flex px-2 gap-4 my-4">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (includes transfer fee) </p> </div>
                    <div class="w-3/4"> <div class="items-starts"> <input-form v-bind:value="total_contract_price" /> </div> </div>
                </div>
                <div class="flex px-2 gap-4 my-4">
                    <div class="w-1/4 items-center">
                        <p class="align-middle text-right text-xs font-bold">MONTHLY INSTALLMENT for
                            <input type="text"
                                v-model="installment_months"
                                class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                            > months:
                        </p>
                    </div>
                    <div class="w-3/4"> <div class="items-starts"> <input-form v-bind:value="monthly_installment" /> </div> </div>
                </div>
                <div class="flex px-2 gap-4 my-4">
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">FIRST MONTHLY INSALLMENT <br> FEE / RESERVATION FEE: </p> </div>
                    <div class="w-3/4"> <div class="items-starts"> <input-form v-bind:value="reservation_fee" /> </div> </div>
                </div>
            </div>

            <div class="flex items-center">
                <button
                    type="button"
                    v-on:click="submitForm"
                    class="bg-gray-600 py-4 mx-auto w-1/4 align-middle text-white border rounded-md">
                    SUBMIT RESERVATION
                </button>
            </div>

        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import InputForm from '../components/v2/InputForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import { ipcRenderer } from 'electron'

    export default({
        components: {
            'main-header': Header,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm
        },
        data() {
            return {
                buyer: {
                    lastname: '',
                    firstname: '',
                    middle_initial: '',
                },
                date: 'May 30, 2021',
                project: this.$store.state.buyer_info.project_id,
                block: this.$store.state.buyer_info.project_details.block_id,
                lot: this.$store.state.buyer_info.project_details.lot_id,
                phase: '',
                project_address: '',
                price: '',
                contact_number: '',
                email_address: '',
                home_address: '',
                realty_name: '',
                agent_name: '',
                lot_area: '50 sq. m',
                lot_type: '',
                total_contract_price: '',
                installment_months: '',
                monthly_installment: '',
                reservation_fee
            }
        },
        computed: {
            getProjectName() {
                ipcRenderer.send('fetchProject', this.project)
                ipcRenderer.once('fetchedProject', (event, project_name) => {
                    project = project_name
                })
                return project
            }
        },
        methods: {
            submitForm() {

                // insert error validation here
                this.$router.push('/')

            }
        }
    })
</script>