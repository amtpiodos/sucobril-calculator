<template>
    <div> 
        <main-header />
        <div class="my-5 mx-24">
            <div class="full my-4 bg-gray-200 p-8 space-y-2"> 
                <p class="text-xl leading-tight font-bold text-center mx-4"> {{ project }} {{ phase }} {{ block }} {{ lot }} </p>
                <p class="text-center align-center"> Please select reservation type for this specific unit. </p>
            </div>
        </div>

        <!-- House & Lot -->
        <div class="my-8 mx-24 grid grid-cols-1 gap-4 lg:grid-cols-2 md:gap-8" v-if="project_type==1">
            <common-button title="Regular Reservation" description="Sample description of what a Regular Reservation is" />
            <common-button title="With Spot Equity" description="Sample description of what a With Spot Equity is "/>
            <common-button title="Spot Cash TCP" description="Sample description of what a Spot Cash TCP is"/>
            <common-button title="Deferred Cash" description="Sample description of what a Deferred Cash is"/>
        </div>

        <!-- LOT Only -->
        <div class="my-8 mx-24 grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-8" v-if="project_type==2">
            <common-button title="Regular Reservation" description="Sample description of what a Regular Reservation is" route_path="RA-Form-2A-LO-Regular-Reservation"/>
            <common-button title="With Spot Downpayment" description="Sample description of what a With Spot Downpayment is" route_path="RA-Form-2A-LO-Spot-Downpayment"/>
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
                project: this.$store.state.unit.project.project_name,
                phase: this.$store.state.unit.phase.phase_name,
                block: this.$store.state.unit.block.block_name,
                lot: this.$store.state.unit.lot.lot_name,
                project_type: this.$store.state.unit.project.project_type
            }
        },
        created() {
            console.log('ROUTE', this.$route.fullPath)
        },
        methods: {

        }
    })
</script>