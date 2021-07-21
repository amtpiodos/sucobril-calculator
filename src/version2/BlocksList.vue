<template>
    <div>
        <main-header />
        <div class="my-5 mx-24">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> {{ project_name }} </p> </div>
        </div>
        <div class="my-8 mx-24 grid grid-cols-2 gap-4 lg:grid-cols-5 md:gap-8">
            <div v-for="block in blocks" :key="block.id">
                <single-block v-bind:block_name="block.name"
                            v-bind:block_id="block.id"
                            v-bind:block_status="block.status"
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
                project_id: this.$route.params.id,
                project_name: this.$route.params.name,
                project_location: this.$route.params.location
            }
        },
        created() {
            this.fetchBlocks()
        },
        methods: {
            fetchBlocks() {
                console.log('store project', this.$store.state.unit.project.project_id)
                ipcRenderer.send('fetchBlocksList', this.project_id)
                ipcRenderer.once('fetchedBlocksList', (event, data) => {
                    this.blocks = data
                    console.log('fetchedBlocksList', typeof(this.blocks), this.blocks)
                })
            }
        }
    })
</script>
