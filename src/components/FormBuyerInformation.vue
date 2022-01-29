<template>
    <div :class="class_color" v-on:click="fetchLot(lot_id, lot_name)">
        <p :class="font1"> {{ lot_name }} </p>
        <p :class="font2"> {{ status }} </p>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    export default ({
        props: ['lot_name',
                'lot_status',
                'lot_id']
    })
</script>