<template>
    <div>
        <main-header />
        <div class="my-8 mx-24 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-8">
            <single-project project_name="Gregory Homes"
                            project_location="Carcar City, Cebu"
                            project_logo="../../assets/img/p2.jpeg"/>
            <single-project project_name="Gregory Homes"
                            project_location="Carcar City, Cebu"
                            project_logo="../../assets/img/p2.jpeg"/>
            <single-project project_name="Gregory Homes"
                            project_location="Carcar City, Cebu"
                            project_logo="../../assets/img/p2.jpeg"/>
            <single-project project_name="Gregory Homes"
                            project_location="Carcar City, Cebu"
                            project_logo="../../assets/img/p2.jpeg"/>
        
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import Project from '../components/v2/Project'

    export default({
        components: {
            'main-header': Header,
            'single-project': Project
        }
    })
</script>
