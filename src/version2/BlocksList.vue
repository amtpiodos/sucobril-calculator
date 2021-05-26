<template>
    <div>
        <main-header />
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
                project_id: this.$route.params.id
            }
        },
        created() {
            this.fetchBlocks()
        },
        methods: {
            fetchBlocks() {
                ipcRenderer.send('fetchBlocksList', this.project_id)
                ipcRenderer.once('fetchedBlocksList', (event, data) => {
                    this.blocks = data
                    console.log('fetchedBlocksList', typeof(this.blocks), this.blocks)
                })
            }
        }
    })
</script>
