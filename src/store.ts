import { defineStore } from 'pinia';
import axios from 'axios';

const VITE_API_LINK = import.meta.env.VITE_API_LINK
export const useStore = defineStore('lists', {
  state: () => ({
    // lists: [] as { name: string, items: string[] }[],
    lists: [] as { id: number, name: string,  list_items: { id:number, name: string }[]}[],
    list_items: [] as { id: number, listId: number, name: string }[],
    listCount: 0,
    accessToken: '' as string | null
  }),
  actions: {
    async getListItems(getId: number) {
      try {
        const response = await axios.get(`${VITE_API_LINK}/List/${getId}`);
        const listItems = response.data.list_items.map((item: { id: number; name: string; }) => ({
          id: item.id,
          name: item.name
        }));
        const listIndex = this.lists.findIndex(list => list.id === getId);
        this.lists[listIndex].list_items = listItems;
        return listItems;
      } catch(error) {
        console.log(error,'unable to get the lists');
        return [];
      }
    },
    setAccessToken(token: string) {
      this.accessToken = token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      sessionStorage.setItem('accessToken', token);
    },

    async createList(newListData: { name: string, list_items: { name: string }[] }) {
      try {
        const response = await axios.post(`${VITE_API_LINK}/List/`, newListData);
        console.log(response,"createList");
        // response.data
        return this.lists.push(response.data);
      }catch(e) {
        console.log(e);
      }
    },

    async addItemToList(itemId: number, itemName: string) {
      try {
        const response = await axios.post(`${VITE_API_LINK}/List/${itemId}/list-item`,
        {
          name: `${itemName}`
        });
        console.log(response,"addItemToList function");
        
        await this.getListItems(itemId);
        
      }catch(e) {
        console.log(e);
      }
    },
    
    async deleteItemFromList(listId: number, listItemId: number){
      try {
        const response = await axios.delete(`${VITE_API_LINK}/List/${listId}/list-item/${listItemId}`, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
        if(response.status === 200) {
          return true;
        } else {
          throw new Error('Failed to delete item');
        }
      }catch(error) {
        console.error('Unable to delete an item from the list', error);
        throw error;
      }
    },

    //Function to delete parent list
    async deleteList(listId: number){
      try {
        const response = await axios.delete(`${VITE_API_LINK}/List/${listId}`, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
        
      } catch(error) {
        console.error('Error deleting list: ', error);
        throw error;
      }
    }
  },
});
