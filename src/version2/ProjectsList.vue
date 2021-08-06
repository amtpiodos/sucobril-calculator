<template>
    <div>
        <main-header />
        <div class="my-8 mx-24 grid grid-cols-2 gap-4 lg:grid-cols-4 md:gap-8">
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
