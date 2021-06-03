<template>
    <div class="bg-gray-500 p-3 rounded-md" v-on:click="fetchProject(project_id, project_name)">
        <img class="mb-2 object-scale-down h-48 w-full" src="../../assets/img/p2.jpeg">
        <p class="text-center text-white font-bold"> {{ project_name }} </p>
        <p class="text-center text-white"> {{ project_location }} </p>
    </div>
</template>

<script>
    export default ({
        props: ['project_name',
                'project_location',
                'project_logo',
                'project_id'],
        
        methods: {
            fetchProject(project_id, project_name) {
                console.log('fetching project id', project_id)
                this.$store.dispatch('buyer_info/setUnitDetails', project_name)
                
                this.$router.push({ name: "Blocks", params: { id: project_id }})
            }
        }
    })
</script>
