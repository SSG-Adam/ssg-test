<template>
    <div class="dialogBox" :class="{ 'dark-mode': isDarkMode }">
        <button @click="isOpen = true">+ New List</button>
        <teleport to="body">
            <div class="modal" v-if="isOpen">
                <div class="newlist-container">
                    <div class="newList-heading">
                        <h3>New List</h3>
                        <button @click="closeDialog">X</button>
                    </div>
                    <div class="newList-input">
                        <p>List name</p>
                        <input v-model="inputText" />
                    </div>
                    <button @click="createLists" class="add-btn">Add</button>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { ref } from 'vue'
export default {
    name: 'DialogBox',
    data(){
        return {
            isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
        }
    },
    setup() {
        const isOpen = ref(false);
        const store = useStore();
        const inputText = ref('');

        const closeDialog = async () => {
            isOpen.value = false;
        }

        const createLists = async () => {
            try {
                await useStore().createList({ name: inputText.value, list_items: [] });
                closeDialog();
                // location.reload();
            } catch (error) {
                console.log(error);
            }
        }
        const lists = store.lists;

        return {
            isOpen,
            closeDialog,
            inputText,
            createLists,
            lists
        }
    }
}
</script>

<style lang="scss" scoped>
.dialogBox{
    cursor: pointer;
    button {
        border: none;
        border-radius: 4px;
        padding: 10px;

    }
}
.modal {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(25, 25, 25, 0.5);
    padding: 40px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .newlist-container {
        position: relative;
        background-color: lightgray;
        color: black;
        border: 1px solid rgba(25, 25, 25, 0.5);
        padding: 20px;

        .newList-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            button {
                border: none;
                background-color: lightgray;
                cursor: pointer;
                &:hover {
                    transform: scale(1.2);
                }
            }
        }
        .newList-input {
            display: flex;
            p {
                padding-right: 5px;
            }
        }
        .add-btn {
            display: flex;
            margin-left: auto;
            margin-top: 15px;
        }
    }
}
</style>