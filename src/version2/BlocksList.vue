<template>
    <div>
        <main-header />
        <div class="my-5 mx-24">
            <div class="full my-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> {{ project_name }} {{ phase }} </p> </div>
        </div>
        <div class="flex my-5 mx-24 ">
            <div class="w-1/2">
                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                <div class="text-xs"> Contact: (032) 260-1522  Email: tumabinidevelopment@gmail.com </div>
            </div>
            <div class="w-1/2">
                <div class="flex items-right justify-right gap-8">
                    <button class="w-1/3"> </button>
                    <button class="w-1/3"> </button>
                    <button type="button" v-on:click="viewProjectBuyers"
                        class="bg-gray-500 p-4 w-1/3 items-center align-center text-white font-regular border rounded-md mb-4">
                        View {{ project_name }} Buyers
                    </button>
                </div>
            </div>
        </div>
        <div class="mb-8 mx-24 grid grid-cols-2 gap-4 lg:grid-cols-5 md:gap-8">
            <div v-for="block in blocks" :key="block.id">
                <single-block v-bind:block_name="block.name"
                            v-bind:block_id="block.id"
                            v-bind:block_status="block.status"
                            v-bind:project_id="project_id"
                            v-bind:has_phase="has_phase"
                            project_logo="../../assets/img/p2.jpeg"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import Block from '../components/v2/SingleBlock'
    import { ipcRenderer } from 'electron'

    export default ({
        components: {
            'main-header': Header,
            'single-block': Block
        },
        data() {
            return {
                blocks: '',
                project_id: this.$route.params.project_id,
                phase_id: this.$route.params.phase_id,
                // project_name: this.$route.params.name,
                project_location: this.$route.params.location,
                has_phase: this.$route.params.has_phase,

                project_name: this.$store.state.unit.project.project_name,
                phase: this.$store.state.unit.phase.phase_name
            }
        },
        created() {
            this.$store.dispatch('unit/setBlock', {})
            this.$store.dispatch('unit/setLot', {})
            this.fetchBlocks()
            console.log('ROUTE', this.$route.fullPath)
        },
        methods: {
            fetchBlocks() {
                console.log('store project', this.$store.state.unit.project.project_id)
                const id = this.has_phase ? this.phase_id : this.project_id
                const block_data = { id, has_phase: this.has_phase}
                ipcRenderer.send('fetchBlocksList', block_data)
                ipcRenderer.once('fetchedBlocksList', (event, data) => {
                    this.blocks = data
                    console.log('fetchedBlocksList', typeof(this.blocks), this.blocks)
                })
            },
            viewProjectBuyers() {
                const project_info = { id: this.project_id, name: this.project_name, location: this.project_location }
                // const phase_info = { id: phase_id, name: this.phase }
                this.$router.push({ name: "Project-Buyers-List", params: { id: this.project_id, project: project_info }})
            }
        }
    })
</script>
