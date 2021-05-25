<template>
    <div>
        <main-header />
        <div class="my-8 mx-24">
            <div class="flex">
                <div class="w-1/3 bg-white space-y-3 ">
                    <input class=" w-full bg-white border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2"
                        placeholder="SEARCH BUYER..."/>
                    <single-buyer label="Buyer 1"/>
                    <single-buyer label="Buyer 2"/>
                </div>
                <div class="w-2/3 bg-white">
                    <p class="text-xl leading-tight font-bold text-center mx-4"> Buyer's Information </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import SingleBuyer from '../components/v2/SingleBuyer'
    export default ({
        components: {
            'main-header': Header,
            'single-buyer': SingleBuyer
        }
    })
</script>