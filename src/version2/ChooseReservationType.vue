<template>
    <div> 
        <main-header />
        <div class="flex mt-5 mx-24 ">
            <div class="w-1/2">
                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                <div class="text-xs"> Contact: (032) 260-1522  Email: tumabinidevelopment@gmail.com </div>
            </div>
            <div class="w-full">
                <div class="flex items-right justify-right gap-8">
                    <button class="w-1/3"> </button>
                    <button class="w-1/3"> </button>
                    <button type="button" v-on:click="backToLots"
                        class="bg-gray-500 p-4 w-1/3 items-center align-center text-white font-regular border rounded-md mb-4">
                        Back To Lots
                    </button>
                </div>
            </div>
        </div>
        <div class="mb-5 mx-24">
            <div class="full my-4 bg-gray-200 p-8 space-y-2"> 
                <p class="text-xl leading-tight font-bold text-center mx-4"> {{ project.name }} {{ phase.name }} {{ block.name }} {{ lot.name }} </p>
                <p class="text-center align-center"> Please select reservation type for this specific unit. </p>
            </div>
        </div>
        

        <!-- House & Lot -->
        <div class="my-8 mx-24 grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-8" v-if="project.project_type==1">
            <common-button title="Regular Reservation" description="Sample description of what a Regular Reservation is" route_path="RA-Form-1A-HL-Regular-Reservation"/>
            <common-button title="With Spot Equity" description="Sample description of what a With Spot Equity is " route_path="RA-Form-1A-HL-With-Spot-Equity"/>
            <common-button title="Spot Cash TCP" description="Sample description of what a Spot Cash TCP is " route_path="RA-Form-1A-HL-Spot-Cash-TCP"/>
            <common-button title="Deferred Cash" description="Sample description of what a Deferred Cash is " route_path="RA-Form-1A-HL-Deferred-Cash"/>
            <common-button title="In-house Financing" description="Sample description of what a Inhouse Financing is" route_path="RA-Form-1A-HL-Inhouse-Financing"/>
        </div>

        <!-- LOT Only -->
        <div class="my-8 mx-24 grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-8" v-if="project.project_type==2">
            <common-button title="Regular Reservation" description="Sample description of what a Regular Reservation is" route_path="RA-Form-2A-LO-Regular-Reservation"/>
            <common-button title="Build After 6 Months" description="Sample description of what a Build After 6 months is" route_path="RA-Form-2A-LO-Spot-Downpayment"/>
            <common-button title="Spot Cash" description="Sample description of what a Spot Cash is" route_path="RA-Form-2A-LO-Spot-Cash"/>
        </div>

        <!-- TO DO: Add Back Button  -->

    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import CommonButton from '../components/v2/CommonButton'
    import { ipcRenderer } from 'electron'

    export default ({
        components: {
            'main-header': Header,
            'common-button': CommonButton
        },
        data() {
            return {
                project: this.$store.state.unit.project,
                phase: this.$store.state.unit.phase,
                block: this.$store.state.unit.block,
                lot: this.$store.state.unit.lot,
                project_type: this.$store.state.unit

                // project: this.$store.state.unit.project.project_name,
                // phase: this.$store.state.unit.phase.phase_name,
                // block: this.$store.state.unit.block.block_name,
                // lot: this.$store.state.unit.lot.lot_name,
                // project_type: this.$store.state.unit.project.project_type,
                // lot_id: this.$store.state.unit.lot.lot_id
            }
        },
        created() {
            console.log('CHOOSE RESERVATION TYPE: ROUTE', this.$route.fullPath, this.$store.state)
        },
        methods: {
            backToLots() {
                this.$router.push({ name: "Lots",
                                    params: {
                                        id: this.block.block_id,
                                        name: this.block.block_name,
                                        project_id: this.project.project_id,
                                        phase_id: this.phase.phase_id
                                    }})
            }
        }
    })
</script>