<template>
    <div>
        <main-header />

        <div class="flex my-8 mx-24 ">
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

        <div class="my-8 mx-24 grid grid-cols-2 gap-4 lg:grid-cols-3 md:gap-8">
            <div v-for="project in projects" :key="project.id">
                <single-project v-bind:project_name="project.name"
                            v-bind:project_location="project.location"
                            v-bind:project_id="project.id"
                            v-bind:project_type="project.type"
                            v-bind:project_hasPhases="project.has_phases"
                            project_logo="../../assets/img/p2.jpeg"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import Project from '../components/v2/SingleProject'

    export default({
        data() {
            return {
                projects: '',
                // to refactor: fetch project type via db
            }
        },
        components: {
            'main-header': Header,
            'single-project': Project
        },
        created() {
            // reset vuex store
            this.$store.dispatch('unit/setPhase', {})
            this.$store.dispatch('unit/setBlock', {})
            this.$store.dispatch('unit/setLot', {})
            this.fetchProjectsList()
        },
        methods: {
            fetchProjectsList() {
                console.log('fetchProjectsList')
                ipcRenderer.send('fetchProjectsList')
                ipcRenderer.once('fetchedProjectsList', (event, data) => {
                    this.projects = data
                })
            }
        }
    })
</script>
