<template>
    <div>
        <main-header />
        <div class="my-8 mx-24">
            <div class="flex">
                <div class="w-1/3 bg-white space-y-3 ">
                    <input class=" w-full bg-white border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2"
                        placeholder="SEARCH BUYER..."/>

                    <div v-for="buyer in buyers" :key="buyer.id">
                        <single-buyer v-bind:lastname="buyer.last_name"
                                    :firstname="buyer.first_name"
                                    v-on:click.native="fetchBuyerDetails(buyer.id)"/>
                    </div>
                </div>
                <div class="w-2/3 bg-white">
                    <p class="text-xl leading-tight font-bold text-center mx-4"> Buyer's Information </p>
                    <div class="mx-auto">
                        <p class="text-center align-center"> CLICK ON A BUYER TO VIEW BUYER DETAILS </p>
                        <p class="text-center align-center"> {{ buyer_details }} </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import SingleBuyer from '../components/v2/SingleBuyer'

    export default ({
        components: {
            'main-header': Header,
            'single-buyer': SingleBuyer
        },
        data() {
            return {
                buyers: {},
                buyer_details: ''
            }
        },
        created() {
            console.log('HOME - created')
            this.fetchBuyers()
        },
        methods: {
            fetchBuyers() {
                ipcRenderer.send('fetchBuyersList')
                ipcRenderer.once('fetchedBuyersList', (event, data) => {
                    this.buyers = data
                })
                console.log('BUYERS LIST THIS.BUYERS', this.buyers)
            },
            fetchBuyerDetails(id) {
                console.log('id', id)
                ipcRenderer.send('fetchBuyer', id)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.buyer_details = data
                })
            }
        }
    })
</script>