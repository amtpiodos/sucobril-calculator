<template>
    <div>
        <main-header />
        <div class="my-8 mx-24 px-5">
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                <div class="full px-4"> <input-form label="Buyer's Name" v-model="buyer" /> </div>
                <div class="full px-4"> <readonly-form label="Date" v-bind:value="date" /> </div>
                <div class="full px-4"> <readonly-form label="Project Name" v-model="project" /> </div>
                <div class="grid grid-cols-3 gap-2">
                    <div class="full px-4"> <readonly-form label="Block" v-bind:value="block" /> </div>
                    <div class="full px-4"> <readonly-form label="Lot" v-bind:value="lot" /> </div>
                    <div class="full px-4"> <readonly-form label="Lot Area" v-bind:value="lot_area" /> </div>
                </div>
                <div class="full px-4"> <readonly-form label="Phase" v-model="phase" /> </div>
                <div class="full px-4"> <readonly-form label="Price/Sq.M" v-bind:value="price" /> </div>
                <div class="full px-4"> <input-form label="Contact No." v-model="contact_number" /> </div>
                <div class="full px-4"> <input-form label="Home Address" v-bind:value="home_address" /> </div>
                <div class="full px-4"> <input-form label="Realty's Name" v-model="realty_name" /> </div>
                <div class="full px-4"> <input-form label="Agent's Name" v-bind:value="agent_name" /> </div>
            </div>
            <div class="my-8 mx-24 px-5">
                <p> 
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
                buyer: '',
                date: 'May 30, 2021',
                project: this.$store.state.buyer_info.project_id,
                block: this.$store.state.buyer_info.project_details.block_id,
                lot: this.$store.state.buyer_info.project_details.lot_id,
                phase: '',
                price: '',
                contact_number: '',
                home_address: '',
                realty_name: '',
                agent_name: '',
                lot_area: '50 sq. m'
            }
        },
        computed: {
            getProjectName() {
                ipcRenderer.send('fetchProject', this.$store.state.buyer_info.project_id)
                ipcRenderer.once('fetchedProject', (event, project_name) => {
                    project = project_name
                })
                return project
            }
        }
    })
</script>