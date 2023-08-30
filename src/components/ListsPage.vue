<template>
    <button class="logout-btn" @click="logout">Logout</button>
    <section id="lists-page-body" :class="{ 'dark-mode': isDarkMode }">
        <div class="top-row">
            <div class="left-side">
                <h1>Lists</h1>
                <div class="newListBtn">
                    <DialogBox class="dialog" />
                </div>
            </div>
            <div class="right-side">
                <h1>Sort</h1>
                <DropDown :dropdown="optionsObj" />
            </div>
        </div>
        <section class="Main_List_Names">
            <div class="left-col">
                <div v-for="(list, index) in lists" :key="index" @click="selectedListIndex = index"
                    :class="{ active: index === selectedListIndex }" class="parent-list">
                    <div class="single-list">
                        <h3>
                            {{ list.name }}
                        </h3>
                        <button @click="deleteList(list.id)">X</button>
                    </div>
                    <!-- <div class="right-col">
                        <div>
                            <h1>{{ list.name }}</h1>
                            <hr />
                            <ul class="items">
                                <li v-for="(item, itemIndex) in list.list_items" :key="item.id">
                                    {{ item.name }}
                                    <button @click="deleteItem(list.id, item.id)">X</button>
                                </li>
                            </ul>
                        </div>
                        <p>Add an item</p>
                        <input @keyup.enter="addItem(list.id, newItemText)" v-model="newItemText" placeholder="New Item Name" />
                    </div> -->
                </div>
            </div>
            <div class="right-col">
                <div v-if="selectedListIndex !== -1">
                    <h1>{{ lists[selectedListIndex]?.name }}</h1>
                    <hr />
                    <ul class="items">
                        <li v-for="(item, itemIndex) in lists[selectedListIndex]?.list_items" :key="item.id"
                            class="single-item">
                            {{ item.name }}
                            <button @click="deleteItem(lists[selectedListIndex].id, item.id)">X</button>
                        </li>
                    </ul>
                </div>
                <hr />
                <input @keyup.enter="addItem(lists[selectedListIndex].id, newItemText)" v-model="newItemText"
                    placeholder="New Item Name" class="inputItemName" />
            </div>
        </section>
    </section>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { onMounted, ref, watch } from 'vue';
// import { useAuthStore } from '@/stores/loginState';
import axios from 'axios';
import { storeToRefs } from 'pinia'
import DialogBox from './DialogBox.vue';
import DropDown from './DropDown.vue';
import router from '@/router';

const VITE_API_LINK = import.meta.env.VITE_API_LINK
export default {
    name: 'Lists',
    data() {
        return {
            isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
        }
    },
    setup() {
        const store = useStore();
        const newItemText = ref('');
        const selectedListIndex = ref(0);
        const authStore = useStore();
        const { lists, accessToken } = storeToRefs(store);

        const optionsObj = {
            option1: 'ASC',
            option2: 'DESC'
        }

        onMounted(async () => {
            if (!accessToken.value) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('accessToken');
                accessToken.value = sessionStorage.getItem('accessToken');
                console.log('access token: ', accessToken.value);
            }
            await getLists();
            for (const list of lists.value) {
                await getItemsForList(list.id);
            }
        });

        //retrieve item data inside list data
        const getItemsForList = async (listId: number) => {
            const listItems = await store.getListItems(listId);
            return listItems;
        };

        //retrieve list data
        const getLists = async () => {
            try {
                const response = await axios.get(`${VITE_API_LINK}/List`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken.value}`
                    }
                });
                lists.value = response.data;
            }
            catch (error) {
                console.error(error, "getLists function is not working");
                router.push({ name: 'Login' })
            }
        };

        watch(() => authStore.accessToken, () => {
            getLists();
        });

        const addItem = async (id: number, itemName: string) => {
            await store.addItemToList(id, itemName);
            newItemText.value = '';
        };
        const deleteItem = async (listId: number, listItemId: number) => {
            try {
                await store.deleteItemFromList(listId, listItemId);
                await getItemsForList(listId);
            }
            catch (error) {
                console.log('Error in deleteItem', error);
            }
        };

        const deleteList = async (listId: number) => {
            try {
                await store.deleteList(listId);
                getLists();
            }
            catch (error) {
                console.error('Error deleting list: ', error);
            }
        };

        const logout = () => {
            try {
                const authStore = useStore();

                // Clear the access token from the auth store
                authStore.setAccessToken('');

                // Remove the access token from sessionStorage
                sessionStorage.removeItem('accessToken');

                // Remove the Authorization header from Axios default headers
                delete axios.defaults.headers.common['Authorization'];

                // Redirect to the login page or any desired location
                router.push({ name: 'Login' });
            } catch (error) {
                console.log(error);
            }
        }

        return {
            lists,
            newItemText,
            addItem,
            deleteItem,
            deleteList,
            accessToken,
            selectedListIndex,
            optionsObj,
            logout
        };
    },
    components: { DialogBox, DropDown }
}
</script>

<style scoped lang="scss">
#lists-page-body {
    &.dark-mode {
        .top-row {

            .left-side,
            .right-side {
                h1 {
                    color: black;
                }
            }
        }

        .Main_List_Names {

            h1,
            .single-list {
                color: black;
            }

            .right-col {
                ul {
                    color: black;
                }
            }
        }
    }
}

.logout-btn {
    display: flex;
    margin-left: auto;
    margin-bottom: 10px;
    border: 1px solid black;
    padding: 5px;

    &:hover {
        transform: scale(1.2);
    }
}

.top-row {
    display: flex;
    justify-content: space-between;
    height: 100px;
    background-color: lightgray;
    padding: 0 30px;
    margin-bottom: 20px;

    .left-side,
    .right-side {
        display: flex;
        align-items: center;
    }

    .left-side {
        .newListBtn {
            margin-left: 20px;
        }
    }

    .right-side {
        h1 {
            margin-right: 20px;
        }
    }
}

.Main_List_Names {
    display: flex;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
    max-height: 500px;

    .left-col {
        width: 20%;
        background-color: lightgray;
        margin-right: 20px;
        overflow-y: auto;

        .active:hover {
            background-color: rgba($color: #cd5757, $alpha: 0.5) !important;
        }

        .parent-list:hover {
            background-color: rgba($color: #96d5e4, $alpha: 0.5);
        }

        .single-list {
            display: flex;
            justify-content: space-between;
            padding: 5px 10px 5px 5px;
        }
    }

    .right-col {
        width: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: lightgray;
        padding: 10px;
        overflow-y: auto;

        .inputItemName {
            margin-top: 10px;
        }

        .items {
            list-style-type: none;
            padding: 15px 10px;

            .single-item {
                padding: 5px 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                button:hover {
                    transform: scale(1.2);
                }

                &:hover {
                    background-color: rgba($color: #606060, $alpha: 0.5);
                }
            }
        }
    }
}</style>