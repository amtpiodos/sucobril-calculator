<template>
    <div class="bg-gray-500 p-3 rounded-md" v-on:click="fetchPhase(phase_id, phase_name)">
        <p class="text-center text-white font-bold"> {{ phase_name }} </p>
        <!-- <p :class="font2"> {{ status }} </p> -->
    </div>
</template>

<script>
    export default ({
        props: ['phase_id',
                'phase_name',
                'project_id'],
        data() {
            return {
                // status: this.block_status === 0 ? 'Available' : 'Sold Out',
                // class_color: this.block_status === 0 ? 'bg-gray-500 p-3 rounded-md' : 'bg-gray-100 p-3 rounded-md',
                // font1: this.block_status === 0 ? 'text-center text-white font-bold' : 'text-center text-gray-500 font-bold',
                // font2: this.block_status === 0 ?  'text-center text-white' : 'text-center text-gray-500'
            }
        },
        methods: {
            fetchPhase(phase_id, phase_name) {
                console.log('this.project_id', this.project_id)
                const phase = { phase_id, phase_name }
                this.$store.dispatch('unit/setPhase', phase)
                this.$router.push({ name: "Blocks-With-Phase",
                                    params: {   phase_id: phase_id,
                                                name: phase_name,
                                                project_id: this.project_id,
                                                has_phase: true }})
            }
        }
    })  
</script>