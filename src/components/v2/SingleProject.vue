<template>
    <div class="bg-gray-500 p-3 rounded-md" v-on:click="fetchProject(project_id, project_name, project_location, project_type)">
        
        <p class="text-center text-white font-bold"> {{ project_name }}</p>
        <p class="text-center text-white text-xs mb-2">( {{ proj_type }} )</p>
        <!-- <img class="mb-2 object-scale-down h-48 w-full" src="../../assets/img/p2.jpeg"> -->
        <p class="text-center text-white text-sm font-bold"> {{ project_location }} </p>
        <!-- temporary: to retrieve data from db -->
        <!-- <p class="text-center text-white text-xs"> x available units </p>
        <p class="text-center text-white text-xs"> Price Range: Php 1M - 3M</p> -->

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
                'project_type',
                'project_hasPhases'],
        
        methods: {
            fetchProject(project_id, project_name, project_location, project_type) {
                const project = {
                    project_id,
                    project_name,
                    project_location,
                    project_type
                }

                this.$store.dispatch('unit/setProject', project)
                this.project_hasPhases
                    ? this.$router.push({ name: "Phases", params: {
                                                                    id: project_id,
                                                                    name: project_name,
                                                                    location: project_location,
                                                                    has_phase: true
                                                                }})
                    : this.$router.push({ name: "Blocks-Without-Phase", params: {
                                                                            project_id: project_id,
                                                                            name: project_name,
                                                                            location: project_location,
                                                                            has_phase: false }})
            },

            fetchProjectType(project_type) {}
        }
    })
</script>
