<template>
    <div>
        <main-header />
        <div class="my-5 mx-24">
            <div class="full my-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> {{ project_name }} </p> </div>
        </div>
        <div class="my-8 mx-24 grid grid-cols-2 gap-4 lg:grid-cols-5 md:gap-8">
            <div v-for="phase in phases" :key="phase.id">
                <single-phase v-bind:phase_id="phase.id"
                            v-bind:phase_name="phase.name"
                            v-bind:project_id="project_id" />
                <!-- <single-block v-bind:block_name="block.name"
                            v-bind:block_id="block.id"
                            v-bind:block_status="block.status"
                            v-bind:project_id="project_id"
                            project_logo="../../assets/img/p2.jpeg"/> -->
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import Phase from '../components/v2/SinglePhase'
    import { ipcRenderer } from 'electron'

    export default ({
        components: {
            'main-header': Header,
            'single-phase': Phase
        },
        data() {
            return {
                phases: '',
                project_id: this.$route.params.id,
                // project_name: this.$route.params.name,
                project_name: this.$store.state.unit.project.project_name,
                phase: this.$store.state.unit.phase.phase_name,
            }
        },
        created() {
            this.$store.dispatch('unit/setPhase', {})
            this.$store.dispatch('unit/setBlock', {})
            this.$store.dispatch('unit/setLot', {})
            this.fetchPhases()
            console.log('PHASES Route', this.$route.params)
        },
        methods: {
            fetchPhases() {
                console.log('store project', this.$store.state.unit.project.project_id)
                ipcRenderer.send('fetchPhasesList', this.project_id)
                ipcRenderer.once('fetchedPhasesList', (event, data) => {
                    this.phases = data
                    console.log('fetchedPhasesList', typeof(this.phases), this.phases)
                })
            }
        }
    })
</script>