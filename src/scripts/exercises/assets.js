import m from "mithril"
import localforage from "../common/storage"
import remove from "ramda/src/remove"
import lensPath from "ramda/src/lensPath"
import set from "ramda/src/set"


const uuidv4 = require('uuid/v4');

const Model = {
    objectives: [],
    activities: [],
    assets: {},

    init: (data)=>{

    },

    updateAsset: (path, value)=>{
        const aLens = lensPath(path)
        const newAssets = set(aLens, value, Model.assets)
        Model.assets = newAssets
        localforage.setItem("assets", newAssets)
    },

    addAsset: (id)=>{
        const content = {assetName: "",  id:uuidv4(), status:"needs"};
        if(Model.assets[id] === undefined) {
            Model.assets[id] = [content]
        } else {
            Model.assets[id].push(content)
        }
        localforage.setItem("assets", Model.assets)
    },

    removeAsset:(id, index)=>{
        const oldSet = Model.assets[id]
        const newSet = remove(index, 1, oldSet)
        Model.assets[id] = newSet
        localforage.setItem("assets", Model.assets)
    },
}

const assetListView = {
    view: (vnode)=>{
        return m("div",[
            m("p",{class:"f3 b mt5 navy"}, `Assets for ${vnode.attrs.objective} > ${vnode.attrs.activity}`),

            vnode.attrs.assets.map(function(asset, index){
                return m(assetView, {activityId: vnode.attrs.activityId, key: asset.id, index: index, assetName: asset.assetName, status: asset.status})
            }),

            m("button", {class:"button-reset pointer bg-blue white bn br2 lato b f5 pa2", onclick:()=>{Model.addAsset(vnode.attrs.activityId)}}, "Add Asset"),

        ])
    }
}

const assetView = {
    view: (vnode)=>{
        return m("div", {class:"pv2 mv2 flex"}, [
            m("select", {class:"input-reset border-box bn mw10 br2 f4 pa2 mr2 lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", onchange: (e)=>{Model.updateAsset([vnode.attrs.activityId, vnode.attrs.index, "status"], e.target.value)}, value: vnode.attrs.value}, [m("option", {value:"needs"}, "needs"), m("option", {value:"uses"}, "uses"), m("option", {value:"produces"}, "produces")]),
            m("input", {class:"input-reset border-box bn mw10 br2 f4 pa2  lato navy", style:"background-color: rgba(205, 236, 255, 0.5); resize: none", oninput: (e)=>{Model.updateAsset([vnode.attrs.activityId, vnode.attrs.index, "assetName"], e.target.value)}, value: vnode.attrs.benefit}),
            m("i", {class:"fas f3 pv2 pl2 navy mh2 handle fa-trash hover-red pointer", onclick:()=>{Model.removeAsset(vnode.attrs.activityId, vnode.attrs.index)}})
        ])
    }
}


const MainView = {
    view: ()=>{
        return m("div", [
            Object.entries(Model.objectives).map(function(objective){
                const objId = objective[0]
                const objContent = objective[1]

              return  Object.entries(objContent.activities).map(function(activity){
                    const actId = activity[0]
                    const actContent = activity[1]
                    const assets = Model.assets[actId] || []
                    return m(assetListView, {objective: objContent.content, activity: actContent, activityId: actId, assets: assets})
                })

                
            })
        
           
        ])
    }
}

const EmptyView = {
    view: ()=>{
        return m("div",[
            m("p",{class:"f3 b mt5 navy"}, [`Looks like you don't have any activities! `,m("br"),m("a", {href:"/purpose/exercise.html", class:"link navy hover-blue"}, `Click here to add some.`)]),

        ])
    }
}


localforage.ready().then(function(){

    localforage.getItem('objectives').then(function(value) {
     //   console.log(value)
     if(value===null){
        m.mount(document.getElementById("exercise"), EmptyView)
     } else{

        Model.objectives = value === null ? [] : value
        
        localforage.getItem('assets').then(function(value) {
        //    console.log(value)
            Model.assets = value === null ? [] : value
            m.mount(document.getElementById("exercise"), MainView)
        
        }).catch(function(err) {
          console.log(err);
        });
    }
    }).catch(function(err) {
        console.log(err);
    });

    
})