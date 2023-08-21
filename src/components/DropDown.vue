<template class="dropdown-container">
    <select>
        <option v-for="option in dropdown">{{ option }}</option>
    </select>
</template>

<script lang="ts">
export default {
    props: {
        dropdown: { 
            type: Object
        }
    }
}
</script>

<style lang="scss" scoped>

</style>