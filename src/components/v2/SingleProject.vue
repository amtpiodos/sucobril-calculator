<template>
    <div class="bg-gray-500 p-3 rounded-md" v-on:click="fetchProject(project_id, project_name, project_location)">
        <img class="mb-2 object-scale-down h-48 w-full" src="../../assets/img/p2.jpeg">
        <p class="text-center text-white font-bold"> {{ project_name }} </p>
        <p class="text-center text-white"> {{ proj_type }} </p>
        <p class="text-center text-white"> {{ project_location }} </p>

    </div>
</template>

<script>
    export default ({
        data() {
            return {
                proj_type : this.project_type === 1 ? 'House & Lot' : 'Lot Only'
            }
        },
        props: ['project_name',
                'project_location',
                'project_logo',
                'project_id',
                'project_type'],
        
        methods: {
            fetchProject(project_id, project_name, project_location) {
                console.log('PROJECT LOCATION', project_location)
                const project = {
                    project_id,
                    project_name,
                    project_location
                }
                this.$store.dispatch('unit/setProject', project)
                this.$router.push({ name: "Blocks", params: { id: project_id, name: project_name, location: project_location }})
            },

            fetchProjectType(project_type) {

            }
        }
    })
</script>
