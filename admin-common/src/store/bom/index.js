
import axios from '@/axios.js'
import {getApp} from '../../utils/utils';
export default {
  namespaced: true,
  state: {
    boms:[],
    components:[],
  },
  getters: {
    getBOM:state=>{
      return state.boms;
    },
    getComponents:state=>{
      state.components.map(comp => {
        comp.item = comp.name;
      });
      // console.log('STORE', data);
      return state.components;
    }
  },
  mutations: {
    DELETE_BOM(state,payload){
      var index = state.boms.findIndex(x=>{return x.id==payload});
      if(index>=0){
        state.boms.splice(index,1);
      }
      
    },
    DELETE_COMPONENT(state,payload){
      var index = state.components.findIndex(x=>{return x.id==payload});
      if(index>=0){
        state.components.splice(index,1);
      }
      
    },
    GET_ITEMS(state,payload){
      //insert all item into components
      state.components=payload;

      //filter, if item have components, put into BOM
      var bomFilter= payload.filter(x=>{
        if (x.props !== undefined) {
          if (x.props.components !== undefined) {
            return x.props.components.length >= 1;
          }
        }

        return false;
        
        // if(!x.props){
        //   return false
        // }
        // return x.props.components.length>=1
      });
      state.boms=bomFilter;

    },
    GET_BOM(state,payload) {
      state.boms = payload
    },
    ADD_BOM(state,payload) {
      state.boms.push(payload)
    },
    EDIT_BOM(state,payload){
      console.log('BOM',payload)
      var editIndex = state.boms.findIndex(x=>{return x.id==payload.id})
      if(editIndex>=0){
        var curBOM=state.boms[editIndex];
        //get keys of object in payload
        var objects=Object.keys(payload);
        for(var i=0;i<objects.length;i++){
          curBOM[objects[i]]=payload[objects[i]];
        }
      }
      
    },
    ADD_COMPONENT(state,payload){
      state.components.push(payload);
    },
    EDIT_COMPONENT(state,payload){
      console.log('Component',payload)
      var editIndex = state.components.findIndex(x=>{return x.id==payload.id})
      if(editIndex>=0){
        var curComp=state.components[editIndex];
        //get keys of object in payload
        var objects=Object.keys(payload);
        for(var i=0;i<objects.length;i++){
          curComp[objects[i]]=payload[objects[i]];
        }
      }
      
    },
    GET_COMPONENT(state,payload){
      state.components=payload
    }
  },
  actions: {
    //Used to get all item data (component or BOM)
    getItems({ commit }){
      //console.log('app-name ',process.env.VUE_APP_APPLICATION_NAME)
      axios
          // .get('/common/items?app='+process.env.VUE_APP_APPLICATION_NAME)
          .get('/common/items?app='+getApp())
          .then(res => {
            console.log(res.data.data)
            commit('GET_ITEMS',res.data.data)
          })
          .catch(err => {
            alert(err);
          });
    },
    getBOM({ commit }){
      commit('GET_BOM',
      [{id:123123,name:'BOM A',createdAt:new Date(),updatedAt:new Date()},
      {id:126121,name:'BOM B',createdAt:new Date(),updatedAt:new Date()},
      {id:1234123,name:'BOM C',createdAt:new Date(),updatedAt:new Date()}])
    },
    addComponent({commit},payload){
      return new Promise((resolve,reject)=>{
        var data={
          app:getApp(),
          domain:['Manufacture'],
          name:payload.name,
          props:{
            id:payload.name.toUpperCase(),
            components:[],
            stock:payload.props.stock,
            price:payload.props.price
          },
        }
        axios
            .post('/common/items',data)
            .then(res => {
              console.log(res.data.data)
              commit('ADD_COMPONENT',res.data.data)
              resolve('run finished')
            })
            .catch(err => {
              reject(err.response.data.errors[0].message)
            });
      })
    },
    addBOM({commit},payload){
      console.log(payload.components)
      //Process payload, optional
      return new Promise((resolve,reject)=>{
        var data={
          app:getApp(),
          domain:['Manufacture'],
          name:payload.name,
          props:{
            id:payload.name.toUpperCase(),
            components:payload.components,
            recipe:payload.recipe,
          },
        }
        data.props.components=data.props.components.map(x=>{
          if(x.isNew){
            return {name:x.name,quantity:(typeof x.quantity =='number')?x.quantity:Number(x.quantity), isNew: x.isNew}
          }
          return {id:x.name,quantity:(typeof x.quantity =='number')?x.quantity:Number(x.quantity)}
        });
        axios 
            .post('/common/boms',data)
            .then(res => {
              console.log(res.data.data)
              commit('ADD_BOM',res.data.data)
              resolve('run finished')
            })
            .catch(err => {
              reject('reject')
              alert(err);
            });
      })
      
      
    },
    editBOM({commit},{id,payload}){
      //Process payload, optional
      return new Promise((resolve,reject)=>{
        var data={
          app:getApp(),
          domain:['Manufacture'],
          name:payload.name,
          props:{
            id:payload.name.toUpperCase(),
            components:payload.components,
            recipe:payload.recipe,
          },
        }
        data.props.components=data.props.components.map(x=>{
          if(x.isNew){
            return {name:x.name,quantity:(typeof x.quantity =='number')?x.quantity:Number(x.quantity), isNew: x.isNew}
          }
          return {id:(typeof x.name == 'object') ? x.name.id : x.id,quantity:(typeof x.quantity =='number')?x.quantity:Number(x.quantity)}
        }) 
        console.log('edit data'+id,data)
        axios
            .put('/common/boms/'+id,data)
            .then(res => {
              // console.log(res.data.data)
              commit('EDIT_BOM',res.data.data)
              resolve('edit bom finish')
            })
            .catch(err => {
              reject(err);
              alert(err);
            });
      })
      
    },
    editComponent({commit},{id,payload}){
      //Process payload, optional
      return new Promise((resolve,reject)=>{
        var data={
          app:getApp(),
          domain:['Manufacture'],
          name:payload.name,
          props:{
            id:payload.name.toUpperCase(),
            stock:payload.props.stock,
            price:payload.props.price
          },
        }
        console.log('edit data'+id,data)
        axios
            .put('/common/items/'+id,data)
            .then(res => {
              console.log(res.data.data)
              commit('EDIT_COMPONENT',res.data.data)
              resolve('edit comp finish')
            })
            .catch(err => {
              reject(err.response.data.errors[0].message);
            });
      })
      
    },
    deleteBOM({commit},id){
      return new Promise((resolve,reject)=>{
        axios
          .delete('/common/items/'+id)
          .then(res => {
            commit('DELETE_BOM',id)
            resolve('delete bom finish')
          })
          .catch(err => {
            console.log(err.errors)
            reject({message:err.message,errors:err.errors});
          });
      })
    },
    deleteComponent({commit},id){
      return new Promise((resolve,reject)=>{
        axios
          .delete('/common/items/'+id)
          .then(res => {
            commit('DELETE_COMPONENT',id)
            resolve('delete component finish')
          })
          .catch(err => {
            console.log(err.errors)
            reject({message:err.message,errors:err.errors});
          });
      })
    },
    getComponents({commit}){
      commit('GET_COMPONENT',
      [{id:1920291,name:'COMPONENT A',createdAt:new Date(),updatedAt:new Date()},
      {id:1231414141,name:'COMPONENT B',createdAt:new Date(),updatedAt:new Date()},
      {id:1234123,name:'COMPONENT C',createdAt:new Date(),updatedAt:new Date()}])
    }
  },
}
